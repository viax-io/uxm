import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { dataTableDef } from '@/studio/lib/registry/composite/data-table';
import { DataTable } from '@/ui';
import type { DataTableColumn, DataTableStackAt } from '@/ui';

import { compiledCss } from './compiled-css';

/**
 * `stackAt` moves the width at which rows reflow into stacked cards.
 *
 * It is a prop rather than a `--uxm-data-table-*` knob because a container
 * query will not read a custom property: `@container (max-width: var(--bp))`
 * parses, survives in `cssRules` with its `conditionText` intact, and then
 * never matches. Measured in Chrome, not assumed. So every threshold needs its
 * own `@container` block, and the prop's type has to be a closed set that
 * matches those blocks exactly — which is what the pairing test below pins.
 */
interface Row {
  id: string;
  name: string;
}

const ROWS: Row[] = [{ id: 'r1', name: 'Alpha' }];
const COLUMNS: DataTableColumn<Row>[] = [{ key: 'name', header: 'Name' }];

const rootOf = (c: HTMLElement) => c.querySelector('.uxm-data-table') as HTMLElement;
const table = (stackAt?: DataTableStackAt, className?: string) => (
  <DataTable rowKey={(r) => r.id} columns={COLUMNS} rows={ROWS} stackAt={stackAt} className={className} />
);

describe('DataTable stackAt', () => {
  it('emits no modifier at the default, so an unset table is untouched', () => {
    const { container } = render(table());
    expect(rootOf(container).className).not.toMatch(/--stack-/);
  });

  it('emits no modifier for an explicit 480 either', () => {
    // 480 is the stylesheet's UNCONDITIONAL threshold. A `--stack-480` class
    // would resolve its stacked rules at one extra class of specificity, so
    // `stackAt={480}` would quietly behave unlike every table that omits it.
    const { container } = render(table(480));
    expect(rootOf(container).className).not.toMatch(/--stack-/);
  });

  it.each([640, 768, 960] as const)('emits exactly one modifier for %i', (bp) => {
    const { container } = render(table(bp));
    const cls = rootOf(container).className;
    expect(cls).toContain(`uxm-data-table--stack-${bp}`);
    expect(cls.match(/--stack-\d+/g)).toHaveLength(1);
  });

  it('leaves the other root modifiers and a consumer className alone', () => {
    const { container } = render(table(768, 'mine'));
    const cls = rootOf(container).className;
    expect(cls).toContain('uxm-data-table--default'); // density
    expect(cls).toContain('mine');
  });
});

describe('DataTable stackAt — the prop and the stylesheet agree', () => {
  // The DOM tests above prove a class is rendered. On their own they are the
  // repo's "emitted but unread" shape, and measurably so: renaming the SCSS
  // selector to `--stak-N`, or dropping any one `@include`, left every test in
  // this file and the two sibling data-table files green while the feature did
  // nothing. So these read the COMPILED css — what the browser resolves — and
  // check each preset's block actually contains the rules.
  const css = compiledCss('src/ui/data-table/data-table.scss');

  const strip = (src: string) =>
    src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
  const tsx = strip(
    readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../src/ui/data-table/data-table.tsx'), 'utf8'),
  );

  const declared = () => {
    const m = tsx.match(/export type DataTableStackAt =([^;]+);/);
    if (!m) throw new Error('DataTableStackAt union not found');
    return [...m[1].split('|').map((v) => Number(v.trim()))].sort((a, b) => a - b);
  };

  /** The text of one `@container (max-width: Npx)` block in the compiled css. */
  const blockFor = (bp: number) => {
    const at = css.indexOf(`@container (max-width: ${bp}px)`);
    if (at < 0) return '';
    const end = css.indexOf('\n}', at);
    return css.slice(at, end < 0 ? undefined : end);
  };

  const OPT_IN = [640, 768, 960] as const;

  it('reads a non-empty union (a silent zero would pass the checks below)', () => {
    expect(declared().length).toBeGreaterThan(1);
    expect(blockFor(480).length).toBeGreaterThan(200);
  });

  it('every value the prop accepts has a block, and every block has a value', () => {
    const inScss = [...OPT_IN, 480].sort((a, b) => a - b);
    expect(declared()).toEqual(inScss);
    for (const bp of OPT_IN) expect(blockFor(bp), `no @container block for ${bp}`).not.toBe('');
  });

  it.each(OPT_IN)("%i's block carries all three rule groups, keyed to its own class", (bp) => {
    const block = blockFor(bp);
    const sel = `.uxm-data-table--stack-${bp}`;
    // One signature rule per mixin. Dropping any single `@include` previously
    // left the whole suite green.
    expect(block, 'cards: the header must be hidden').toMatch(
      new RegExp(`\\${sel}[^{]*__head[^}]*display:\\s*none`),
    );
    expect(block, 'no-scroll: the arrows must go').toMatch(
      new RegExp(`\\${sel}[^{]*__scroll-arrow[^}]*display:\\s*none`),
    );
    expect(block, 'active rail: the row carries it, not the first cell').toMatch(
      new RegExp(`\\${sel}[^{]*__row--active\\s*\\{[^}]*box-shadow`),
    );
    // The `min-width: 481px` clip is a second hard-coded 480, and an inverted
    // one. A table stacked by `stackAt` sits above it, so it must opt back out
    // or stacked cells clip their focus ring (2.4.7).
    expect(block, 'the fixed-layout clip must be released').toMatch(
      new RegExp(`\\${sel}[^{]*--fixed[^}]*overflow:\\s*visible`),
    );
  });

  it.each(OPT_IN)('%i keys root modifiers COMPOUND, never as descendants', (bp) => {
    const sel = `uxm-data-table--stack-${bp}`;
    // `--compact`, `--scrolled-start` and friends live on the SAME element as
    // the stack class. Nested, they compile to descendants and can never match
    // — four such selectors shipped in the first version of this change.
    expect(css, 'a root modifier written as a descendant is a dead rule').not.toMatch(
      new RegExp(`\\.${sel} \\.uxm-data-table--`),
    );
    expect(css).toContain(`.${sel}.uxm-data-table--compact`);
    expect(css).toContain(`.${sel}.uxm-data-table--scrolled-start`);
  });
});

describe('DataTable stackAt — the registry, the preview and the prop agree', () => {
  // A knob the studio offers and the preview never reads is this repo's
  // recurring defect: the panel looks like it works, the canvas does nothing,
  // and no gate notices. It has bitten the DataTable preview three times. The
  // variant is only reachable through two hand-written maps — the registry's
  // option list and the preview's `STACK_AT` — so pin both against the union.
  const read = (rel: string) =>
    readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '..', rel), 'utf8');

  const union = (() => {
    const m = read('src/ui/data-table/data-table.tsx').match(/export type DataTableStackAt =([^;]+);/);
    if (!m) throw new Error('DataTableStackAt union not found');
    return m[1].split('|').map((v) => Number(v.trim())).sort((a, b) => a - b);
  })();

  const variant = dataTableDef.layoutVariants.find((v) => v.key === 'stackAt');

  it('exposes stackAt as a layout variant', () => {
    // Without it the stacked-card layout is unreachable in the studio: the
    // canvas never narrows to 480px, so its knobs cannot be tuned at all.
    expect(variant, 'the studio registry must offer the stackAt variant').toBeDefined();
  });

  it('offers exactly the widths the prop accepts', () => {
    const offered = (variant?.options ?? [])
      .map((o) => Number(typeof o === 'string' ? o : o.value))
      .sort((a, b) => a - b);
    expect(offered).toEqual(union);
  });

  it('defaults to the width that emits no class', () => {
    expect(Number(variant?.defaultValue)).toBe(480);
  });

  it('is read by the preview, through a map covering every option', () => {
    const src = read('src/ui/data-table/data-table-preview.tsx');
    expect(src, 'the preview must pass the variant to the atom').toMatch(/stackAt=\{STACK_AT\[/);
    const m = src.match(/const STACK_AT:[^=]+=\s*\{([^}]+)\}/);
    if (!m) throw new Error('STACK_AT map not found in the preview');
    const mapped = [...m[1].matchAll(/'(\d+)':\s*(\d+)/g)];
    // Keys are what the registry hands back; values are what reaches the atom.
    expect(mapped.map(([, k]) => Number(k)).sort((a, b) => a - b)).toEqual(union);
    expect(mapped.every(([, k, v]) => k === v), 'each key must map to its own width').toBe(true);
  });
});
