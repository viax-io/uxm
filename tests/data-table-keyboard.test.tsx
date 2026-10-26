import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DataTable } from '@/ui';
import type { DataTableColumn } from '@/ui';

/**
 * A row with `onRowClick` opens a detail pane, and used to do so for the
 * pointer only: the `<tr>` carried a click handler but no `tabIndex`, no
 * `onKeyDown` and no focus style, so the row could not be reached or activated
 * from the keyboard at all (WCAG 2.1.1, Level A). The README had documented the
 * gap and told consumers to put their own control in the row — while the same
 * file applied the opposite rule to the scroll region, which takes `tabIndex`
 * precisely because "a scroll container reachable only by pointer fails 2.1.1".
 */
interface Row {
  id: string;
  name: string;
}

const ROWS: Row[] = [
  { id: 'r1', name: 'Alpha' },
  { id: 'r2', name: 'Beta' },
];

const COLUMNS: DataTableColumn<Row>[] = [{ key: 'name', header: 'Name' }];

const rowOf = (name: string) => screen.getByText(name).closest('tr') as HTMLTableRowElement;

describe('DataTable row keyboard activation', () => {
  it('puts a row in the tab order only when it is a click target', () => {
    const { rerender } = render(<DataTable rowKey={(r) => r.id} columns={COLUMNS} rows={ROWS} />);
    expect(rowOf('Alpha')).not.toHaveAttribute('tabindex');

    rerender(<DataTable rowKey={(r) => r.id} columns={COLUMNS} rows={ROWS} onRowClick={() => {}} />);
    expect(rowOf('Alpha')).toHaveAttribute('tabindex', '0');
  });

  it.each(['Enter', ' '])('activates the row on %s', (key) => {
    const onRowClick = vi.fn();
    render(<DataTable rowKey={(r) => r.id} columns={COLUMNS} rows={ROWS} onRowClick={onRowClick} />);
    fireEvent.keyDown(rowOf('Beta'), { key });
    expect(onRowClick).toHaveBeenCalledWith(ROWS[1]);
  });

  it('stops Space scrolling the region instead of activating', () => {
    // Without preventDefault the key both opens the row AND scrolls the
    // scroller under it, which reads as the table jumping on activation.
    render(<DataTable rowKey={(r) => r.id} columns={COLUMNS} rows={ROWS} onRowClick={() => {}} />);
    const row = rowOf('Alpha');
    expect(fireEvent.keyDown(row, { key: ' ' })).toBe(false); // false = defaultPrevented
    // Enter has no scroll behaviour to suppress, but is prevented for symmetry.
    expect(fireEvent.keyDown(row, { key: 'Enter' })).toBe(false);
  });

  it('ignores a key that was pressed on a control inside the row', () => {
    // The whole reason for the `target === currentTarget` guard: Enter on a
    // cell's button is that button's, and must not also open the row.
    const onRowClick = vi.fn();
    const columns: DataTableColumn<Row>[] = [
      { key: 'name', header: 'Name', render: (r) => <button type="button">Edit {r.name}</button> },
    ];
    render(<DataTable rowKey={(r) => r.id} columns={columns} rows={ROWS} onRowClick={onRowClick} />);
    fireEvent.keyDown(screen.getByRole('button', { name: 'Edit Alpha' }), { key: 'Enter' });
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('leaves a key alone that is neither Enter nor Space', () => {
    const onRowClick = vi.fn();
    render(<DataTable rowKey={(r) => r.id} columns={COLUMNS} rows={ROWS} onRowClick={onRowClick} />);
    fireEvent.keyDown(rowOf('Alpha'), { key: 'a' });
    fireEvent.keyDown(rowOf('Alpha'), { key: 'ArrowDown' });
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('composes with a consumer handler, and lets it cancel the activation', () => {
    // Same contract `onClick` already has: theirs runs first, and a
    // `preventDefault` suppresses ours. Getting this backwards would silently
    // drop every consumer handler, which is the bug the click path records.
    const onRowClick = vi.fn();
    const consumer = vi.fn();
    render(
      <DataTable
        rowKey={(r) => r.id}
        columns={COLUMNS}
        rows={ROWS}
        onRowClick={onRowClick}
        rowProps={() => ({ onKeyDown: (e) => { consumer(); e.preventDefault(); } })}
      />,
    );
    fireEvent.keyDown(rowOf('Alpha'), { key: 'Enter' });
    expect(consumer).toHaveBeenCalledTimes(1);
    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('lets rowProps override the tabIndex', () => {
    // `tabIndex` sits before the spread for this reason — a consumer running
    // a roving-tabindex scheme of their own has to be able to take it to -1.
    render(
      <DataTable
        rowKey={(r) => r.id}
        columns={COLUMNS}
        rows={ROWS}
        onRowClick={() => {}}
        rowProps={() => ({ tabIndex: -1 })}
      />,
    );
    expect(rowOf('Alpha')).toHaveAttribute('tabindex', '-1');
  });

  it('still delivers a consumer onKeyDown on a table with no onRowClick', () => {
    // `onKeyDown` is destructured OUT of rowProps so it can be composed, which
    // means the composed handler is now the ONLY thing passing it through. Build
    // that handler from `onRowClick` alone and a plain non-interactive table
    // silently stops delivering the consumer's key events — a regression against
    // the old straight-through spread, and invisible to every other test here.
    const consumer = vi.fn();
    render(
      <DataTable
        rowKey={(r) => r.id}
        columns={COLUMNS}
        rows={ROWS}
        rowProps={() => ({ onKeyDown: consumer })}
      />,
    );
    expect(rowOf('Alpha')).not.toHaveAttribute('tabindex');
    fireEvent.keyDown(rowOf('Alpha'), { key: 'Enter' });
    expect(consumer).toHaveBeenCalledTimes(1);
  });
});
