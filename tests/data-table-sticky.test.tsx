import { readFileSync } from 'node:fs';

import { render, screen } from '@testing-library/react';
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
  it('is a focusable, named region', () => {
    // A scroll container reachable only by pointer fails 2.1.1 (axe
    // scrollable-region-focusable). An unnamed one says nothing about what you
    // have landed in.
    render(table(PLAIN, { scrollable: true }));
    const region = screen.getByRole('region', { name: 'Table' });
    expect(region).toHaveAttribute('tabindex', '0');
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

describe('DataTable scroll arrows', () => {
  it('shows none while there is nowhere to scroll', () => {
    // jsdom reports zero scrollWidth/clientWidth, i.e. "no overflow" — which
    // is exactly the state an arrow must not appear in.
    render(table(PLAIN, { scrollable: true }));
    expect(screen.queryByRole('button', { name: /scroll/i })).not.toBeInTheDocument();
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

  it('keeps a visible focus ring on the scroll region', () => {
    // The root clips, so an outward offset would be invisible.
    expect(scss).toMatch(/__scroller[\s\S]{0,300}?:focus-visible[\s\S]{0,160}?outline-offset:\s*-2px/);
  });
});
