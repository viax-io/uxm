import { readFileSync } from 'node:fs';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataTable } from '@/ui';
import type { DataTableColumn } from '@/ui';

interface Row {
  id: string;
  name: string;
  amount: number;
}

const ROWS: Row[] = [
  { id: 'r1', name: 'Alpha', amount: 10 },
  { id: 'r2', name: 'Beta', amount: 20 },
];

const PLAIN: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name' },
  { key: 'amount', header: 'Amount' },
];

const table = (
  columns: DataTableColumn<Row>[],
  props: Partial<React.ComponentProps<typeof DataTable<Row>>> = {},
) => <DataTable<Row> columns={columns} rows={ROWS} rowKey={(r) => r.id} {...props} />;

const th = (name: string) => screen.getByRole('columnheader', { name });
const tableEl = (c: HTMLElement) => c.querySelector('table')!;
const rowFor = (id: string) => screen.getByText(id === 'r1' ? 'Alpha' : 'Beta').closest('tr')!;

describe('DataTable column width', () => {
  it('leaves a table with no declared width on auto layout', () => {
    // The compatibility promise: adding the prop to the API must not re-lay-out
    // a single existing table. Fixed layout is opt-in BY USE, not by import.
    const { container } = render(table(PLAIN));
    expect(tableEl(container).className).toBe('uxm-data-table__table');
  });

  it('switches to fixed layout as soon as one column declares a width', () => {
    // Auto layout treats a declared width as a hint and drops it once content
    // is wider, so the width and the layout mode are one feature.
    const { container } = render(table([{ ...PLAIN[0], width: '34%' }, PLAIN[1]]));
    expect(tableEl(container).className).toContain('uxm-data-table__table--fixed');
  });

  it('accepts a share or pixels, and puts the width on the th only', () => {
    // Both shapes are needed: consumers pin some columns in px and let one
    // take the remaining share.
    const { container } = render(
      table([
        { ...PLAIN[0], width: '34%' },
        { ...PLAIN[1], width: 92 },
      ]),
    );
    expect(th('Name')).toHaveStyle({ width: '34%' });
    expect(th('Amount')).toHaveStyle({ width: '92px' });
    // Under fixed layout the first row sizes every column; repeating the width
    // on each cell is noise that can only disagree with itself.
    expect(container.querySelector('td')).not.toHaveAttribute('style');
  });

  it('treats width: 0 as declared, not as absent', () => {
    // `!= null`, not truthiness: 0 is a real (if unwise) width, and silently
    // ignoring it would leave the table on auto layout with a width attribute.
    const { container } = render(table([{ ...PLAIN[0], width: 0 }, PLAIN[1]]));
    expect(container.querySelector('table')!.className).toContain('--fixed');
    expect(th('Name')).toHaveStyle({ width: '0px' });
  });

  it('leaves columns without a width to share what is left', () => {
    const { container } = render(table([{ ...PLAIN[0], width: 120 }, PLAIN[1]]));
    expect(th('Name')).toHaveStyle({ width: '120px' });
    expect(th('Amount').getAttribute('style')).toBeNull();
    expect(tableEl(container).className).toContain('--fixed');
  });
});

describe('DataTable column className', () => {
  it('applies the class to the header AND every cell in the column', () => {
    // The point of the prop: a column is a vertical thing. Styling one from
    // outside otherwise takes two nth-child selectors that renumber the moment
    // a column is inserted — which is exactly what consumers were writing.
    const { container } = render(table([{ ...PLAIN[0], className: 'vm-amt' }, PLAIN[1]]));
    expect(th('Name').className).toContain('vm-amt');
    const cells = [...container.querySelectorAll('td')].filter((td) =>
      td.className.includes('vm-amt'),
    );
    expect(cells, 'every row in the column should carry it').toHaveLength(ROWS.length);
  });

  it('adds to the library classes rather than replacing them', () => {
    render(table([{ ...PLAIN[0], className: 'vm-amt', align: 'right' }, PLAIN[1]]));
    const header = th('Name');
    expect(header.className).toContain('uxm-data-table__th');
    expect(header.className).toContain('uxm-data-table__th--right');
    expect(header.className).toContain('vm-amt');
  });

  it('touches no other column', () => {
    const { container } = render(table([{ ...PLAIN[0], className: 'vm-amt' }, PLAIN[1]]));
    expect(th('Amount').className).not.toContain('vm-amt');
    expect(container.querySelectorAll('.vm-amt')).toHaveLength(ROWS.length + 1); // cells + th
  });
});

describe('DataTable column label', () => {
  it('still derives data-label from a string header', () => {
    // Today's behaviour, unchanged — `label` only ever fills a gap.
    const { container } = render(table(PLAIN));
    expect(container.querySelector('td')).toHaveAttribute('data-label', 'Name');
  });

  it('gives a ReactNode header a label it could not have had', () => {
    // The latent gap: a JSX header reaches no `attr()` pseudo-element, so in
    // stacked mode those cells rendered with no label at all, silently.
    const { container } = render(
      table([{ key: 'name', header: <span>Name</span>, label: 'Customer name' }, PLAIN[1]]),
    );
    expect(container.querySelector('td')).toHaveAttribute('data-label', 'Customer name');
  });

  it('leaves a ReactNode header with no label when none is supplied', () => {
    const { container } = render(table([{ key: 'name', header: <span>Name</span> }, PLAIN[1]]));
    expect(container.querySelector('td')).not.toHaveAttribute('data-label');
  });

  it('lets label override a string header', () => {
    const { container } = render(table([{ ...PLAIN[0], label: 'Full name' }, PLAIN[1]]));
    expect(container.querySelector('td')).toHaveAttribute('data-label', 'Full name');
  });

  it('names the sort control when the header is not text', () => {
    render(
      table([{ key: 'flag', header: <svg aria-hidden />, label: 'Flagged', sortKey: 'flag' }], {
        onSortChange: vi.fn(),
        sort: null,
      }),
    );
    expect(screen.getByRole('button', { name: 'Flagged' })).toBeInTheDocument();
  });

  it('prefers sortLabel over label for the sort control', () => {
    render(
      table([{ ...PLAIN[0], sortKey: 'name', label: 'Column name', sortLabel: 'Sort by name' }], {
        onSortChange: vi.fn(),
        sort: null,
      }),
    );
    expect(screen.getByRole('button', { name: 'Sort by name' })).toBeInTheDocument();
  });

  it('uses label for the sort control when it differs from a string header', () => {
    // The docs promise label feeds the accessible name; an abbreviation in the
    // header is exactly when that matters.
    render(
      table([{ key: 'amt', header: 'Amt', label: 'Amount due', sortKey: 'amt' }], {
        onSortChange: vi.fn(),
        sort: null,
      }),
    );
    expect(screen.getByRole('button', { name: 'Amount due' })).toBeInTheDocument();
  });

  it('does not restate a string header as an aria-label', () => {
    // A redundant accessible name is worse than none — it would be announced
    // in place of, not alongside, the visible text.
    render(
      table([{ ...PLAIN[0], sortKey: 'name' }], { onSortChange: vi.fn(), sort: null }),
    );
    expect(screen.getByRole('button', { name: 'Name' })).not.toHaveAttribute('aria-label');
  });
});

describe('DataTable fixed layout — the cases CSS alone decides', () => {
  // These tests cannot see CSS (jsdom applies none), so they guard the SOURCE
  // contract instead: the class names the stylesheet keys on, and the rules
  // that must exist for the opt-in to mean anything. Renaming either side
  // silently without this would leave every class-name assertion passing.
  const scss = readFileSync('src/ui/data-table/data-table.scss', 'utf8');

  it('defines the fixed-layout and active-row rules the component emits', () => {
    expect(scss).toMatch(/\.uxm-data-table__table--fixed\s*\{[^}]*table-layout:\s*fixed/);
    expect(scss).toMatch(/\.uxm-data-table__row--active\s*\{[^}]*background-color/);
  });

  it('gives the actions column a real width under fixed layout', () => {
    // `width: 1%` is shrink-to-fit under AUTO layout only; under fixed it is a
    // literal 1% of the table, which collapses the kebab trigger's column.
    expect(scss).toMatch(/--fixed[^{]*__th--actions[\s\S]{0,200}?width:\s*calc\(/);
  });

  it('never clips a cell that could hold a focus ring', () => {
    // The clip cannot tell a focus ring from content. Stacked cells and the
    // actions cell have no padding to spare, so an outline would be cut off.
    const clip = /overflow:\s*hidden;\s*text-overflow:\s*ellipsis/.exec(scss);
    expect(clip, 'the ellipsis clip went missing').not.toBeNull();
    const before = scss.slice(0, clip!.index);
    expect(before, 'the clip must be inside a min-width container query').toMatch(
      /@container \(min-width: 481px\)[\s\S]*$/,
    );
    expect(before).toMatch(/:not\(\.uxm-data-table__td--actions\)/);
  });

  it('keeps the stacked rail override after the base rail rule', () => {
    // Both selectors are (0,1,0), so SOURCE ORDER decides. Declared earlier the
    // override loses and the stacked card draws two rails — one on the row and
    // one on its first field. That is exactly what the first version did.
    const base = scss.indexOf('.uxm-data-table__row--active > :first-child');
    const stacked = scss.indexOf('@container (max-width: 480px)', base);
    expect(base, 'base rail rule missing').toBeGreaterThan(-1);
    expect(stacked, 'stacked rail override must come after the base rule').toBeGreaterThan(base);
    expect(scss.slice(stacked)).toMatch(
      /@container \(max-width: 480px\)[\s\S]{0,400}?__row--active > :first-child\s*\{\s*box-shadow:\s*none/,
    );
  });

  it('renders a table with rowActions AND a width without throwing', () => {
    const { container } = render(
      table([{ ...PLAIN[0], width: '50%' }, PLAIN[1]], {
        rowActions: () => [{ key: 'edit', label: 'Edit', onSelect: () => {} }],
      }),
    );
    expect(container.querySelectorAll('.uxm-data-table__th--actions')).toHaveLength(1);
    expect(container.querySelector('table')!.className).toContain('--fixed');
  });
});

describe('DataTable active row', () => {
  it('marks nothing active by default', () => {
    render(table(PLAIN));
    expect(rowFor('r1')).not.toHaveAttribute('aria-current');
    expect(rowFor('r1').className).not.toContain('--active');
  });

  it('marks the matching row, and only it', () => {
    render(table(PLAIN, { activeRowId: 'r2' }));
    expect(rowFor('r2')).toHaveAttribute('aria-current', 'true');
    expect(rowFor('r2').className).toContain('uxm-data-table__row--active');
    expect(rowFor('r1')).not.toHaveAttribute('aria-current');
  });

  it('matches against rowKey, not row order or index', () => {
    render(
      <DataTable<Row>
        columns={PLAIN}
        rows={ROWS}
        rowKey={(r) => `row-${r.id}`}
        activeRowId="row-r2"
      />,
    );
    expect(rowFor('r2')).toHaveAttribute('aria-current', 'true');
  });

  it('treats null as nothing active', () => {
    render(table(PLAIN, { activeRowId: null }));
    expect(rowFor('r1')).not.toHaveAttribute('aria-current');
    expect(rowFor('r2')).not.toHaveAttribute('aria-current');
  });
});

describe('DataTable rowProps', () => {
  it('merges extra attributes onto the row', () => {
    // The gap this closes: a deep link needs an `id` on the <tr>, which
    // consumers were faking with an anchor inside the first cell.
    render(table(PLAIN, { rowProps: (r) => ({ id: `line-${r.id}`, 'data-kind': 'line' }) }));
    expect(rowFor('r1')).toHaveAttribute('id', 'line-r1');
    expect(rowFor('r1')).toHaveAttribute('data-kind', 'line');
  });

  it('merges className instead of replacing the library classes', () => {
    render(table(PLAIN, { rowProps: () => ({ className: 'csp-row' }), activeRowId: 'r1' }));
    const row = rowFor('r1');
    expect(row.className).toContain('uxm-data-table__row');
    expect(row.className).toContain('uxm-data-table__row--active');
    expect(row.className).toContain('csp-row');
  });

  it('lets a consumer override aria-current', () => {
    // A consumer may well have its own idea of what "current" means; the
    // table should not fight it.
    render(table(PLAIN, { activeRowId: 'r1', rowProps: () => ({ 'aria-current': 'page' }) }));
    expect(rowFor('r1')).toHaveAttribute('aria-current', 'page');
  });

  it('runs a rowProps onClick, with no onRowClick in play', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(table(PLAIN, { rowProps: () => ({ onClick }) }));
    await user.click(rowFor('r1'));
    expect(onClick, 'the table clobbered the consumer handler').toHaveBeenCalledTimes(1);
  });

  it('runs BOTH handlers when onRowClick is also set, consumer first', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    render(
      table(PLAIN, {
        onRowClick: () => calls.push('onRowClick'),
        rowProps: () => ({ onClick: () => calls.push('rowProps') }),
      }),
    );
    await user.click(rowFor('r1'));
    expect(calls).toEqual(['rowProps', 'onRowClick']);
  });

  it('lets a rowProps onClick suppress the row click with preventDefault', async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      table(PLAIN, {
        onRowClick,
        rowProps: () => ({ onClick: (e: React.MouseEvent) => e.preventDefault() }),
      }),
    );
    await user.click(rowFor('r1'));
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('is called per row, with that row', () => {
    const rowProps = vi.fn(() => ({}));
    render(table(PLAIN, { rowProps }));
    expect(rowProps).toHaveBeenCalledTimes(ROWS.length);
    expect(rowProps).toHaveBeenCalledWith(ROWS[0]);
    expect(rowProps).toHaveBeenCalledWith(ROWS[1]);
  });
});

describe('DataTable studio canvas placement', () => {
  // `canvasFill` used to mean "fill the width AND top-align", so the table —
  // which only needed the width — silently lost the vertical centring every
  // other preview has. The two are separate flags now.
  it('fills the canvas width and stays vertically centred', async () => {
    const { dataTableDef } = await import('@/studio/lib/registry/composite/data-table');
    expect(dataTableDef.canvasFill, 'a shrink-to-fit flex item collapses the table').toBe(true);
    expect(dataTableDef.canvasAlign ?? 'center').toBe('center');
  });

  it('leaves the icon grid top-anchored, which it relies on', async () => {
    // Its height changes as you filter; re-centring makes the whole block jump.
    const { iconsDefs } = await import('@/studio/lib/registry/icons');
    const grid = iconsDefs.find((d) => d.canvasFill);
    expect(grid, 'no filling icon preview found').toBeDefined();
    expect(grid!.canvasAlign).toBe('top');
  });
});
