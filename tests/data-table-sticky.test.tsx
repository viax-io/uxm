import { readFileSync } from 'node:fs';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataTable } from '@/ui';
import type { DataTableColumn } from '@/ui';

interface Row {
  id: string;
  name: string;
  amount: number;
}

const ROWS: Row[] = [{ id: 'r1', name: 'Alpha', amount: 10 }];

const PLAIN: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name' },
  { key: 'amount', header: 'Amount' },
];

const table = (
  columns: DataTableColumn<Row>[],
  props: Partial<React.ComponentProps<typeof DataTable<Row>>> = {},
) => <DataTable<Row> columns={columns} rows={ROWS} rowKey={(r) => r.id} {...props} />;

const scss = readFileSync('src/ui/data-table/data-table.scss', 'utf8');

describe('DataTable scroller — opt-in', () => {
  it('adds no scroller, no region and no class by default', () => {
    // The compatibility promise: a table that neither scrolls nor pins keeps
    // exactly the DOM it had, down to the absence of a wrapper element.
    const { container } = render(table(PLAIN));
    expect(container.querySelector('.uxm-data-table__scroller')).toBeNull();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(container.firstElementChild!.className).not.toContain('--scrollable');
    // The table is still a direct child of the root — no wrapper slipped in.
    expect(container.querySelector('.uxm-data-table > table')).not.toBeNull();
  });

  it('turns on with `scrollable`', () => {
    const { container } = render(table(PLAIN, { scrollable: true }));
    expect(container.querySelector('.uxm-data-table__scroller')).not.toBeNull();
    expect(container.firstElementChild!.className).toContain('uxm-data-table--scrollable');
  });

  it('is implied by a sticky column, without asking for it', () => {
    // Pinning only means something against a scroll, so `sticky` alone must
    // not silently do nothing.
    const { container } = render(table([{ ...PLAIN[0], sticky: 'start' }, PLAIN[1]]));
    expect(container.querySelector('.uxm-data-table__scroller')).not.toBeNull();
  });
});

describe('DataTable scroll region — accessibility', () => {
  it('is only a tab stop while it can actually scroll', () => {
    // A region that fits its content is a no-op stop; one that scrolls MUST be
    // focusable or it is pointer-only navigation.
    const { container } = render(table(PLAIN, { scrollable: true }));
    expect(container.querySelector('.uxm-data-table__scroller')).not.toHaveAttribute('tabindex');
  });

  it('is a focusable, named region', () => {
    // A scroll container reachable only by pointer fails 2.1.1 (axe
    // scrollable-region-focusable). An unnamed one says nothing about what you
    // have landed in.
    const restore = withGeometry(1000, 400);
    try {
      render(table(PLAIN, { scrollable: true }));
      const region = screen.getByRole('region', { name: 'Table' });
      expect(region).toHaveAttribute('tabindex', '0');
    } finally {
      restore();
    }
  });

  it('takes a caller-supplied name', () => {
    render(table(PLAIN, { scrollable: true, scrollLabel: 'Orders' }));
    expect(screen.getByRole('region', { name: 'Orders' })).toBeInTheDocument();
  });
});

describe('DataTable sticky columns', () => {
  it('marks the pinned column on the header and every cell', () => {
    const { container } = render(
      table([
        { ...PLAIN[0], sticky: 'start' },
        { ...PLAIN[1], sticky: 'end' },
      ]),
    );
    expect(container.querySelector('.uxm-data-table__th--sticky-start')).not.toBeNull();
    expect(container.querySelector('.uxm-data-table__td--sticky-start')).not.toBeNull();
    expect(container.querySelector('.uxm-data-table__th--sticky-end')).not.toBeNull();
    expect(container.querySelector('.uxm-data-table__td--sticky-end')).not.toBeNull();
  });

  it('leaves unpinned columns alone', () => {
    const { container } = render(table([{ ...PLAIN[0], sticky: 'start' }, PLAIN[1]]));
    const amountCells = [...container.querySelectorAll('td')].filter((td) =>
      td.textContent?.includes('10'),
    );
    expect(amountCells[0].className).not.toContain('sticky');
  });
});

/**
 * jsdom does no layout, but it will honour geometry defined on the prototype —
 * which is enough to drive the whole scroll-edge hook. The earlier claim that
 * this was untestable was simply wrong, and it hid every bug below.
 */
function withGeometry(scrollWidth: number, clientWidth: number) {
  const defs = ['scrollWidth', 'clientWidth'] as const;
  const original = defs.map((k) => Object.getOwnPropertyDescriptor(HTMLElement.prototype, k));
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get() { return scrollWidth; },
  });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get() { return clientWidth; },
  });
  return () => defs.forEach((k, i) => {
    if (original[i]) Object.defineProperty(HTMLElement.prototype, k, original[i]!);
    else delete (HTMLElement.prototype as unknown as Record<string, unknown>)[k];
  });
}

describe('DataTable scroll arrows', () => {
  it('renders both arrows, inert, when there is nowhere to scroll', () => {
    render(table(PLAIN, { scrollable: true }));
    const back = screen.getByRole('button', { name: 'Scroll Table back' });
    const forward = screen.getByRole('button', { name: 'Scroll Table forward' });
    // Mounted but inert, NOT unmounted: removing the button under the pointer
    // or the focus ring is the 2.4.3 problem this shape avoids.
    expect(back).toHaveAttribute('aria-disabled', 'true');
    expect(forward).toHaveAttribute('aria-disabled', 'true');
  });

  it('enables the forward arrow once there is overflow', () => {
    const restore = withGeometry(1000, 400);
    try {
      render(table(PLAIN, { scrollable: true }));
      expect(screen.getByRole('button', { name: 'Scroll Table forward' })).not.toHaveAttribute(
        'aria-disabled',
      );
      expect(screen.getByRole('button', { name: 'Scroll Table back' })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    } finally {
      restore();
    }
  });

  it('enables the back arrow once scrolled away from the start', () => {
    const restore = withGeometry(1000, 400);
    try {
      const { container } = render(table(PLAIN, { scrollable: true }));
      const scroller = container.querySelector('.uxm-data-table__scroller')!;
      scroller.scrollLeft = 300;
      fireEvent.scroll(scroller);
      expect(screen.getByRole('button', { name: 'Scroll Table back' })).not.toHaveAttribute(
        'aria-disabled',
      );
    } finally {
      restore();
    }
  });

  it('treats a NEGATIVE scrollLeft as scrolled — the RTL case', () => {
    // RTL browsers report 0 at the start and negative towards the end, so a
    // raw `> 1` never fires: the back arrow never appears and the forward one
    // never goes away.
    const restore = withGeometry(1000, 400);
    try {
      const { container } = render(table(PLAIN, { scrollable: true }));
      const scroller = container.querySelector('.uxm-data-table__scroller')!;
      scroller.scrollLeft = -300;
      fireEvent.scroll(scroller);
      expect(screen.getByRole('button', { name: 'Scroll Table back' })).not.toHaveAttribute(
        'aria-disabled',
      );
    } finally {
      restore();
    }
  });

  it('marks the root with the measured edges', () => {
    const restore = withGeometry(1000, 400);
    try {
      const { container } = render(table(PLAIN, { scrollable: true }));
      expect(container.firstElementChild!.className).toContain('uxm-data-table--scrolled-end');
      expect(container.firstElementChild!.className).not.toContain('--scrolled-start');
    } finally {
      restore();
    }
  });

  it('takes a caller-supplied arrow label', () => {
    render(
      table(PLAIN, {
        scrollable: true,
        scrollLabel: 'Orders',
        scrollArrowLabel: (d, l) => `${l}: ${d === 'start' ? 'previous' : 'next'}`,
      }),
    );
    expect(screen.getByRole('button', { name: 'Orders: next' })).toBeInTheDocument();
  });
});

describe('DataTable sticky actions column', () => {
  it('does not pin the generated actions column by default', () => {
    const { container } = render(
      table(PLAIN, { scrollable: true, rowActions: () => [{ key: 'e', label: 'Edit', onSelect: () => {} }] }),
    );
    expect(container.querySelector('.uxm-data-table__th--actions')!.className).not.toContain(
      'sticky',
    );
  });

  it('pins it with stickyActions, and that alone turns the scroller on', () => {
    // The generated column has no `column` object to put `sticky` on, which is
    // why it needs its own prop.
    const { container } = render(
      table(PLAIN, { stickyActions: true, rowActions: () => [{ key: 'e', label: 'Edit', onSelect: () => {} }] }),
    );
    expect(container.querySelector('.uxm-data-table__scroller')).not.toBeNull();
    expect(container.querySelector('.uxm-data-table__th--actions')!.className).toContain(
      'uxm-data-table__th--sticky-end',
    );
    expect(container.querySelector('.uxm-data-table__td--actions')!.className).toContain(
      'uxm-data-table__td--sticky-end',
    );
  });
});

describe('DataTable sticky/scroll — CSS contracts', () => {
  // jsdom applies no CSS, so these guard the stylesheet directly. Without them
  // every class-name assertion above passes against rules that do not exist.
  it('gives sticky cells a position and an opaque fill', () => {
    // Transparent pinned cells let the scrolling content show straight
    // through, which looks like a rendering bug rather than a missing style.
    expect(scss).toMatch(/__td--sticky-start[\s\S]{0,400}?position:\s*sticky/);
    expect(scss).toMatch(/__td--sticky-start,[\s\S]{0,200}?background-color/);
  });

  it('switches to separate borders only in scrollable mode', () => {
    // With `border-collapse: collapse` the border belongs to the table, so a
    // pinned cell scrolls out from under its own rules in Chrome and Safari.
    expect(scss).toMatch(
      /\.uxm-data-table--scrollable .uxm-data-table__table\s*\{[^}]*border-collapse:\s*separate/,
    );
    // ...and the default stays collapsed for every other table.
    expect(scss).toMatch(/\.uxm-data-table__table\s*\{[^}]*border-collapse:\s*collapse/);
  });

  it('un-pins and stops scrolling in stacked mode', () => {
    // There is no horizontal axis below 480px: a pinned cell would pin against
    // nothing and the arrows would point at nothing.
    const stacked = scss.lastIndexOf('@container (max-width: 480px)');
    const tail = scss.slice(stacked);
    expect(tail).toMatch(/position:\s*static/);
    expect(tail).toMatch(/__scroll-arrow\s*\{\s*display:\s*none/);
    expect(tail).toMatch(/__scroller\s*\{\s*overflow-x:\s*visible/);
  });

  it('kills the scroll shadows in stacked mode at matching specificity', () => {
    // The shadow selectors are (0,2,0) (`--scrolled-start` + the cell class).
    // A bare class reset in the stacked block is (0,1,0) and loses, so the
    // shadows survived onto the stacked cards — which is what shipped until a
    // browser probe caught it. The reset must mirror their shape.
    const stacked = scss.slice(scss.lastIndexOf('@container (max-width: 480px)'));
    expect(stacked).toMatch(
      /\.uxm-data-table--scrolled-start \.uxm-data-table__td--sticky-start[\s\S]{0,300}?box-shadow:\s*none/,
    );
    // Strip comments before scanning for `!important`: this very block
    // explains why it is NOT used, and a raw text scan matched that prose —
    // the same way a commented-out token once fooled the parity gate.
    expect(
      stacked.replace(/\/\*[\s\S]*?\*\//g, ''),
      'do not reach for !important here',
    ).not.toMatch(/!important/);
  });

  it('beats IconButton on the cascade for the arrow chrome', () => {
    // styles.css imports icon-button.css AFTER data-table.css, so an arrow rule
    // at (0,1,0) loses on source order and the button renders transparent with
    // its chevron over the cell text. Qualify with the root.
    expect(scss).toMatch(/\.uxm-data-table \.uxm-data-table__scroll-arrow\s*\{/);
    expect(
      scss,
      'an unqualified arrow rule will be overridden by IconButton',
    ).not.toMatch(/^\.uxm-data-table__scroll-arrow\s*\{/m);
  });

  it('composes the active rail WITH the scroll shadow instead of replacing it', () => {
    // Both are box-shadows at (0,2,0) on the same element when the first cell
    // is pinned; whichever came later simply erased the other, and the rail
    // losing leaves colour as the only active-row cue (1.4.1).
    expect(scss).toMatch(
      /--scrolled-start[\s\S]{0,160}?__row--active[\s\S]{0,160}?__td--sticky-start:first-child\s*\{\s*box-shadow:\s*\n?\s*inset 3px[\s\S]{0,200}?var\(--uxm-data-table-scroll-shadow/,
    );
  });

  it('fades pinned cells in lockstep with the row', () => {
    // A pinned cell paints its OWN opaque background (it must, or the
    // scrolling content shows through), so it does not inherit the row's
    // fade. Without a matching transition it snapped while the unpinned
    // columns eased over 100ms, and one row changed colour in two stages —
    // reported as the first and last columns lagging.
    const rowFade = /\.uxm-data-table__row\s*\{[^}]*transition:\s*background-color\s*0\.1s/.exec(scss);
    expect(rowFade, 'row fade missing').not.toBeNull();
    expect(scss).toMatch(
      /__td--sticky-start,\s*\n\.uxm-data-table__td--sticky-end\s*\{[\s\S]{0,400}?transition:\s*background-color\s*0\.1s/,
    );
  });

  it('drops both fades under prefers-reduced-motion', () => {
    const block = scss.slice(scss.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(block).toMatch(/__row,[\s\S]{0,200}?__td--sticky-end\s*\{\s*transition:\s*none/);
  });

  it('keeps a visible focus ring on the scroll region', () => {
    // The root clips, so an outward offset would be invisible.
    // On the ROOT, via :has — an inset outline on the scroller itself is
    // painted under the z-index:1 pinned cells, so the pinned columns hid its
    // leading/trailing edges and every corner.
    expect(scss).toMatch(
      /\.uxm-data-table--scrollable:has\(\.uxm-data-table__scroller:focus-visible\)[\s\S]{0,200}?outline-offset:\s*-2px/,
    );
  });
});
