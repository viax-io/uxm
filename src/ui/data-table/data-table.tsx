'use client';

import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export type DataTableDensity = 'compact' | 'default' | 'relaxed';

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  /** Optional cell renderer; defaults to `row[key]`. */
  render?: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
}

export interface DataTableProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: DataTableColumn<T>[];
  rows: T[];
  density?: DataTableDensity;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  rows,
  density = 'default',
  rowKey,
  onRowClick,
  className,
  ...rest
}: DataTableProps<T>) {
  return (
    <div
      className={cn('uxm-data-table', `uxm-data-table--${density}`, className)}
      {...rest}
    >
      <table className="uxm-data-table__table">
        <thead className="uxm-data-table__head">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn('uxm-data-table__th', c.align && `uxm-data-table__th--${c.align}`)}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={cn(
                'uxm-data-table__row',
                onRowClick && 'uxm-data-table__row--interactive',
              )}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn('uxm-data-table__td', c.align && `uxm-data-table__td--${c.align}`)}
                >
                  {c.render ? c.render(row) : (row as Record<string, ReactNode>)[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
