import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { dataTableDef } from '@/studio/lib/registry/composite/data-table';
import { DataTable } from '@/ui';
import type { DataTableColumn } from '@/ui';
import { DataTablePreview } from '@/ui/data-table/data-table-preview';

import { compiledCss } from './compiled-css';

/**
 * `scrollArrows` controls when the horizontal scroll arrows show and where
 * they sit.
 *
 * The placement half rides on the prop rather than landing as a default,
 * because insetting moves the arrows in every table that pins. Measured in the
 * portal before this existed: a 32px arrow sitting entirely inside a 180px
 * pinned column, and the end arrow inside the 56px actions column, clipping one
 * row's kebab 24x12px. After, with the prop: 493 vs a pin ending at 489, and
 * 876 vs a pin starting at 912 — clear on both sides.
 */
interface Row {
  id: string;
  name: string;
  owner: string;
}

const ROWS: Row[] = [{ id: 'r1', name: 'Alpha', owner: 'Ada' }];

/** Sticky implies a scroller, which is what the arrows live on. */
const COLUMNS: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', width: 240, sticky: 'start' },
  { key: 'owner', header: 'Owner', width: 240 },
];

/**
 * jsdom has no layout: every element reports `scrollWidth === clientWidth === 0`
 * and a zero-sized rect. Both of the things this feature keys off — "is there
 * anything to scroll" and "how wide is the pinned column" — are therefore
 * always false/zero, which makes the obvious assertions vacuous. Two mutations
 * (rendering arrows for `'none'`, and measuring pins for a table that did not
 * opt in) passed the first version of this file for exactly that reason.
 *
 * So fake the two measurements the code reads, and nothing else.
 */
function withFakeLayout<T>(run: () => T): T {
  const proto = Element.prototype;
  const scrollW = Object.getOwnPropertyDescriptor(proto, 'scrollWidth')!;
  const clientW = Object.getOwnPropertyDescriptor(proto, 'clientWidth')!;
  const rect = proto.getBoundingClientRect;
  const isScroller = (el: Element) => el.classList.contains('uxm-data-table__scroller');
  Object.defineProperty(proto, 'scrollWidth', {
    configurable: true,
    get(this: Element) {
      return isScroller(this) ? 1000 : 0;
    },
  });
  Object.defineProperty(proto, 'clientWidth', {
    configurable: true,
    get(this: Element) {
      return isScroller(this) ? 400 : 0;
    },
  });
  proto.getBoundingClientRect = function (this: Element) {
    const w = this.classList.contains('uxm-data-table__th--sticky-start')
      ? 180
      : this.classList.contains('uxm-data-table__th--sticky-end')
        ? 56
        : 0;
    return { width: w, height: 0, top: 0, left: 0, right: w, bottom: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
  };
  try {
    return run();
  } finally {
    Object.defineProperty(proto, 'scrollWidth', scrollW);
    Object.defineProperty(proto, 'clientWidth', clientW);
    proto.getBoundingClientRect = rect;
  }
}

const arrows = (c: HTMLElement) => c.querySelectorAll('.uxm-data-table__scroll-arrow');
const root = (c: HTMLElement) => c.querySelector<HTMLElement>('.uxm-data-table')!;

describe('DataTable scrollArrows — the default is untouched', () => {
  it('adds no class and no inline measurement when the prop is absent', () => {
    const { container } = withFakeLayout(() =>
      render(<DataTable<Row> columns={COLUMNS} rows={ROWS} rowKey={(r) => r.id} scrollLabel="T" />),
    );
    const el = root(container);
    expect(el.className).not.toContain('arrows-');
    // The pin widths are published only for an opted-in table, so a table that
    // passes nothing carries no inline style from this feature at all.
    expect(el.style.getPropertyValue('--_uxm-data-table-pin-start')).toBe('');
    expect(el.style.getPropertyValue('--_uxm-data-table-pin-end')).toBe('');
    // ...and with the prop the SAME faked layout does publish them, so the
    // empty strings above are the opt-in working rather than nothing measured.
    const opted = withFakeLayout(() =>
      render(
        <DataTable<Row>
          columns={COLUMNS}
          rows={ROWS}
          rowKey={(r) => r.id}
          scrollArrows="always"
          scrollLabel="T"
        />,
      ),
    );
    expect(root(opted.container).style.getPropertyValue('--_uxm-data-table-pin-start')).toBe('180px');
  });

  it('keeps the 4px placement rule as the unconditional one', () => {
    const css = compiledCss('src/ui/data-table/data-table.scss');
    // Knob-ised, but the computed value when unset is the same 4px it was.
    expect(css).toMatch(
      /\.uxm-data-table \.uxm-data-table__scroll-arrow--start \{\s*inset-inline-start: var\(--uxm-data-table-scroll-arrow-inset, 4px\)/,
    );
  });
});

describe('DataTable scrollArrows — visibility', () => {
  const withProp = (scrollArrows: 'always' | 'hover' | 'none') =>
    withFakeLayout(() =>
      render(
        <DataTable<Row>
          columns={COLUMNS}
          rows={ROWS}
          rowKey={(r) => r.id}
          scrollArrows={scrollArrows}
          scrollLabel="T"
        />,
      ),
    );

  it("renders nothing for 'none', even though the table scrolls", () => {
    // The sibling assertion is what keeps this honest: with faked layout
    // `'always'` DOES render them, so an empty list here means the gate, not
    // the absence of layout.
    expect(arrows(withProp('always').container).length).toBeGreaterThan(0);
    const { container } = withProp('none');
    expect(container.querySelector('.uxm-data-table__scroller')).not.toBeNull();
    expect(arrows(container)).toHaveLength(0);
    // ...and it must not claim the inset either.
    expect(root(container).className).not.toContain('arrows-inset');
  });

  it("marks 'always' for the inset only", () => {
    const { container } = withProp('always');
    expect(root(container).className).toContain('uxm-data-table--arrows-inset');
    expect(root(container).className).not.toContain('uxm-data-table--arrows-hover');
  });

  it("marks 'hover' for both the inset and the hover behaviour", () => {
    const { container } = withProp('hover');
    expect(root(container).className).toContain('uxm-data-table--arrows-hover');
    expect(root(container).className).toContain('uxm-data-table--arrows-inset');
  });
});

describe('DataTable scrollArrows — the stylesheet', () => {
  const css = compiledCss('src/ui/data-table/data-table.scss');
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, '');

  it('gates every new rule on an opt-in class', () => {
    // Comments stripped first: this file's are long and name the very classes
    // below, so left in they parse as selectors.
    const rules = [...bare.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map((m) => ({
      selectors: m[1].split(',').map((x) => x.trim()).filter(Boolean),
      body: m[2],
    }));
    // Keyed off the declarations the feature owns, not off class names — a rule
    // can carry neither class and still belong to it.
    const own = rules.filter(
      // `visibility`, not `opacity`: the long-standing `--disabled { opacity:
      // 0.4 }` rule is correctly ungated and is not this feature's to police.
      (r) => r.body.includes('--_uxm-data-table-pin') || r.body.includes('visibility'),
    );
    expect(own.length, 'no rules found — this check would pass vacuously').toBeGreaterThan(3);
    // Only the selectors that TOUCH an arrow are this feature's. The
    // reduced-motion rule legitimately joins a pre-existing comma list of row
    // and sticky-cell selectors; those are not ours to gate.
    const ungated = own
      .flatMap((r) => r.selectors)
      .filter((s) => s.includes('scroll-arrow'))
      .filter((s) => !s.includes('arrows-hover') && !s.includes('arrows-inset'));
    expect(ungated, 'an arrow rule any table would resolve').toEqual([]);
  });

  it('adds the measured pin to the inset rather than replacing it', () => {
    // Replacing would drop the 4px that clears the root's border and radius.
    for (const side of ['start', 'end']) {
      expect(css).toMatch(
        new RegExp(
          `--arrows-inset \\.uxm-data-table__scroll-arrow--${side} \\{\\s*inset-inline-${side}: calc\\(\\s*var\\(--uxm-data-table-scroll-arrow-inset, 4px\\) \\+ var\\(--_uxm-data-table-pin-${side}, 0px\\)`,
        ),
      );
    }
  });

  it('hides the hover state with visibility, not opacity alone', () => {
    // An invisible button that is still focusable is a worse bug than the
    // clutter this mode removes.
    const hidden = bare.match(/\.uxm-data-table--arrows-hover \.uxm-data-table__scroll-arrow \{[^}]*\}/);
    expect(hidden?.[0]).toMatch(/visibility:\s*hidden/);
    expect(hidden?.[0]).toMatch(/opacity:\s*0/);
  });

  it('hides a disabled arrow at the SAME specificity as the reveal', () => {
    // `:hover` and `:focus-within` each count as a class, so the reveal is
    // (0,3,0). A plain `.--arrows-hover .--disabled` is (0,2,0) and loses —
    // measured in the browser, where the disabled arrow came back `visible`.
    expect(bare, 'the disabled rule must compound the same pseudo-classes').toMatch(
      /\.uxm-data-table--arrows-hover:hover \.uxm-data-table__scroll-arrow--disabled,\s*\.uxm-data-table--arrows-hover:focus-within \.uxm-data-table__scroll-arrow--disabled \{[^}]*visibility:\s*hidden/,
    );
    expect(bare, 'and must not rely on the weaker un-compounded form').not.toMatch(
      /\n\.uxm-data-table--arrows-hover \.uxm-data-table__scroll-arrow--disabled \{/,
    );
  });

  it('drops the arrows entirely where there is no hover', () => {
    const at = css.indexOf('@media (hover: none)');
    expect(at, 'no (hover: none) block').toBeGreaterThan(-1);
    const block = css.slice(at, css.indexOf('\n}', at));
    expect(block).toContain('arrows-hover');
    expect(block).toMatch(/display:\s*none/);
  });

  it('honours prefers-reduced-motion for the reveal', () => {
    // The fade is the component's second motion; the nudge's smooth scroll is
    // handled in the component.
    const at = css.indexOf('@media (prefers-reduced-motion: reduce)');
    const block = css.slice(at, css.indexOf('\n}', at));
    expect(block).toContain('arrows-hover');
  });
});

describe('DataTable scrollArrows — the studio reaches it', () => {
  // A knob the studio offers and the preview never reads has bitten this
  // preview three times; the sibling variants carry the same gate.
  const variant = dataTableDef.layoutVariants.find((v) => v.key === 'scrollArrows');

  it('offers every value the prop accepts, plus the opt-out', () => {
    expect(variant).toBeDefined();
    const offered = (variant?.options ?? []).map((o) => (typeof o === 'string' ? o : o.value)).sort();
    expect(offered).toEqual(['always', 'default', 'hover', 'none']);
    expect(variant?.defaultValue).toBe('default');
  });

  it('is read by the preview — rendered, not grepped', () => {
    // Grepping the source passes on a dead branch.
    const { container } = render(
      <DataTablePreview componentId="data-table" styles={{}} variants={{ scrollArrows: 'hover' }} />,
    );
    expect(root(container).className).toContain('uxm-data-table--arrows-hover');
  });

  it("maps 'default' to passing nothing at all", () => {
    // The opt-out has to stay an opt-out: passing `'always'` for it would
    // silently move the arrows in the preview and hide the regression.
    const { container } = render(
      <DataTablePreview componentId="data-table" styles={{}} variants={{ scrollArrows: 'default' }} />,
    );
    expect(root(container).className).not.toContain('arrows-');
  });
});
