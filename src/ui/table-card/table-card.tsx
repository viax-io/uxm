'use client';

import { useId } from 'react';

import { cn } from '@/helpers';

import { DataTable, type DataTableProps } from '../data-table';

import type { HTMLAttributes, ReactNode } from 'react';

export type TableCardVariant = 'lines' | 'striped';

/** The props `DataTable` owns, without the `div` attributes it spreads on its root. */
type DataTableOwnProps<T> = Omit<DataTableProps<T>, keyof HTMLAttributes<HTMLDivElement>>;

export interface TableCardProps<T>
  extends DataTableOwnProps<T>,
    Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Card heading. Pass an element (`<h3>`) when the page outline needs a real heading level. */
  title?: ReactNode;
  /** Before the title: an `Icon` or a small mark. Muted (`--uxm-table-card-icon-color`). */
  icon?: ReactNode;
  /** After the title, muted, on the same line: a count such as the number of rows. */
  count?: ReactNode;
  /** Muted line under the title. */
  description?: ReactNode;
  /** Right side of the header: buttons, a menu, a filter. */
  actions?: ReactNode;
  /**
   * `lines` (default): rows run edge to edge with a divider between rows, and
   * the column-header row sits flush under the card header. `striped`: no
   * dividers, alternate rows tinted, rows inset so their text lines up with
   * the header text.
   */
  variant?: TableCardVariant;
  /**
   * Drop the column-header strip. The header cells stay in the DOM at zero
   * height, so a screen reader still hears the column names; don't combine it
   * with sortable columns, whose buttons would stay focusable and invisible.
   */
  hideHeaderRow?: boolean;
  /** Shown in the body, in place of the table, when `rows` is empty. */
  empty?: ReactNode;
  /** Lift the card with the shadow `Card` uses (`--uxm-table-card-shadow-*`). */
  shadow?: boolean;
}

/**
 * `TableCard` — one frame whose body is a `DataTable`: a card header (title,
 * muted description, actions) over a table with no border of its own. The
 * alternative, a `DataTable` inside a `Card`, draws two frames and needs
 * negative margins to make the rows reach the card's edge.
 *
 * Every `DataTable` prop passes through to the table (columns, rows, rowKey,
 * sorting, stacking…); the native `div` attributes, `className` and `style`
 * land on the card.
 */
export function TableCard<T>({
  title,
  icon,
  count,
  description,
  actions,
  variant = 'lines',
  hideHeaderRow,
  empty,
  shadow,
  className,
  // DataTable's own props, split from the root's `div` attributes (`rest`).
  columns,
  rows,
  density,
  stackAt,
  scrollResetKey,
  scrollArrows,
  rowKey,
  onRowClick,
  rowActions,
  actionsColumnLabel,
  rowActionsLabel,
  sort,
  onSortChange,
  activeRowId,
  scrollable,
  scrollLabel,
  scrollArrowLabel,
  stickyActions,
  rowProps,
  sortHref,
  renderSortLink,
  tableLabelledBy,
  framed: _framed,
  ...rest
}: TableCardProps<T>) {
  const hasTitle = title != null || icon != null || count != null;
  const hasHeader = hasTitle || description != null || actions != null;
  const showEmpty = empty != null && rows.length === 0;
  // The title names the table, so a screen reader hears "Deals, table" rather
  // than an unnamed one. A consumer's own `tableLabelledBy` wins.
  const titleId = useId();
  const labelledBy = tableLabelledBy ?? (title != null ? titleId : undefined);

  return (
    <div
      className={cn(
        'uxm-table-card',
        `uxm-table-card--${variant}`,
        hasHeader && 'uxm-table-card--has-header',
        hideHeaderRow && 'uxm-table-card--no-header-row',
        shadow && 'uxm-table-card--shadow',
        className,
      )}
      {...rest}
    >
      {hasHeader && (
        <div className="uxm-table-card__header">
          {(hasTitle || description != null) && (
            <div className="uxm-table-card__heading">
              {hasTitle && (
                <div className="uxm-table-card__titlerow">
                  {icon != null && (
                    <span className="uxm-table-card__icon" aria-hidden="true">
                      {icon}
                    </span>
                  )}
                  {title != null && (
                    <div id={titleId} className="uxm-table-card__title">
                      {title}
                    </div>
                  )}
                  {count != null && <span className="uxm-table-card__count">{count}</span>}
                </div>
              )}
              {description != null && (
                <div className="uxm-table-card__description">{description}</div>
              )}
            </div>
          )}
          {actions != null && <div className="uxm-table-card__actions">{actions}</div>}
        </div>
      )}
      <div className="uxm-table-card__body">
        {showEmpty ? (
          <div className="uxm-table-card__empty">{empty}</div>
        ) : (
          <DataTable<T>
            framed={false}
            columns={columns}
            rows={rows}
            density={density}
            stackAt={stackAt}
            scrollResetKey={scrollResetKey}
            scrollArrows={scrollArrows}
            rowKey={rowKey}
            onRowClick={onRowClick}
            rowActions={rowActions}
            actionsColumnLabel={actionsColumnLabel}
            rowActionsLabel={rowActionsLabel}
            sort={sort}
            onSortChange={onSortChange}
            activeRowId={activeRowId}
            scrollable={scrollable}
            scrollLabel={scrollLabel}
            scrollArrowLabel={scrollArrowLabel}
            stickyActions={stickyActions}
            rowProps={rowProps}
            sortHref={sortHref}
            renderSortLink={renderSortLink}
            tableLabelledBy={labelledBy}
          />
        )}
      </div>
    </div>
  );
}
