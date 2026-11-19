import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataTable, TableCard, type DataTableColumn } from '@/ui';

import { compiledCss } from './compiled-css';

interface Row {
  id: string;
  name: string;
}
const columns: DataTableColumn<Row>[] = [{ key: 'name', header: 'Name' }];
const rows: Row[] = [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Beta' },
];
const rowKey = (r: Row) => r.id;

/**
 * One frame: the card draws the border and the table inside it draws none
 * (`framed={false}`). The card's own attributes stay on the card, the table's
 * props reach the table, and the header only renders when something is in it.
 */
describe('TableCard', () => {
  it('renders the table frameless inside one card and the header only when given', () => {
    const { container, rerender } = render(<TableCard columns={columns} rows={rows} rowKey={rowKey} />);
    expect(container.querySelector('.uxm-table-card__header')).toBeNull();
    expect(container.querySelector('.uxm-table-card .uxm-data-table--frameless')).not.toBeNull();
    expect(container.firstElementChild).toHaveClass('uxm-table-card--lines');
    rerender(
      <TableCard columns={columns} rows={rows} rowKey={rowKey} title="Deals" description="2 open" actions={<button>Add</button>} variant="striped" />,
    );
    expect(screen.getByText('Deals')).toHaveClass('uxm-table-card__title');
    expect(screen.getByText('2 open')).toHaveClass('uxm-table-card__description');
    expect(screen.getByRole('button', { name: 'Add' }).parentElement).toHaveClass('uxm-table-card__actions');
    expect(container.firstElementChild).toHaveClass('uxm-table-card--striped', 'uxm-table-card--has-header');
  });

  it('puts native attributes, className and style on the card, and the table props on the table', () => {
    const { container } = render(
      <TableCard
        columns={columns}
        rows={rows}
        rowKey={rowKey}
        id="deals"
        data-x="1"
        className="mine"
        style={{ width: 400 }}
        shadow
        hideHeaderRow
        density="compact"
        onRowClick={() => undefined}
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('id', 'deals');
    expect(root).toHaveAttribute('data-x', '1');
    expect(root).toHaveClass('uxm-table-card', 'mine', 'uxm-table-card--shadow', 'uxm-table-card--no-header-row');
    expect(root.style.width).toBe('400px');
    expect(root.querySelector('.uxm-data-table')).toHaveClass('uxm-data-table--compact');
    expect(root.querySelector('.uxm-data-table__row')).toHaveClass('uxm-data-table__row--interactive');
    // The column names stay in the DOM when the strip is hidden.
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });

  it('shows `empty` instead of the table when there are no rows', () => {
    const { container, rerender } = render(<TableCard columns={columns} rows={[]} rowKey={rowKey} empty="Nothing here" />);
    expect(screen.getByText('Nothing here')).toHaveClass('uxm-table-card__empty');
    expect(container.querySelector('table')).toBeNull();
    rerender(<TableCard columns={columns} rows={[]} rowKey={rowKey} />);
    expect(container.querySelector('table')).not.toBeNull();
  });
});

describe('DataTable framed', () => {
  it('is framed by default and drops the frame only on `framed={false}`', () => {
    const { container, rerender } = render(<DataTable columns={columns} rows={rows} rowKey={rowKey} />);
    expect(container.firstElementChild).not.toHaveClass('uxm-data-table--frameless');
    rerender(<DataTable columns={columns} rows={rows} rowKey={rowKey} framed={false} />);
    expect(container.firstElementChild).toHaveClass('uxm-data-table--frameless');
  });

  it('declares the frameless modifier after the base rule so it wins at equal specificity', () => {
    const css = compiledCss('src/ui/data-table/data-table.scss');
    const base = css.indexOf('.uxm-data-table {');
    const frameless = css.indexOf('.uxm-data-table--frameless {');
    expect(base).toBeGreaterThan(-1);
    expect(frameless).toBeGreaterThan(base);
    expect(css.slice(frameless, css.indexOf('}', frameless))).toMatch(/border:\s*0[\s\S]*border-radius:\s*0/);
  });
});

describe('table-card stylesheet', () => {
  it('compiles the nested selectors the variants depend on', () => {
    const css = compiledCss('src/ui/table-card/table-card.scss');
    expect(css).toContain('.uxm-table-card--lines .uxm-table-card__body');
    expect(css).toContain('--uxm-data-table-header-bg: var(--uxm-table-card-header-row-bg, transparent)');
    expect(css).toContain('.uxm-table-card--striped .uxm-table-card__body .uxm-data-table__row:nth-child(even)');
  });
});
