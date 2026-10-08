import { cn } from '@/helpers';

import { EditableCell, type EditableCellOption, type EditableCellType, type EditableCellValue } from '../editable-cell';
import { HoverTooltip } from '../hover-tooltip';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Menu, type MenuEntry } from '../menu';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type DataTableDensity = 'compact' | 'default' | 'relaxed';

export type DataTableSortDirection = 'asc' | 'desc';

/** Which column is sorted, and which way. `null`/absent means "unsorted". */
/**
 * The direction actually in force, or `null` for "not sorted by this column".
 *
 * `sort.direction` is often read straight out of a URL (`?dir=asc`), so it can
 * arrive as anything at runtime despite the type. Normalising once, here, is
 * what stops the glyph, the next-click direction and `aria-sort` from
 * disagreeing about a value none of them recognise.
 */
export function resolveSortDirection(
  sort: DataTableSort | null | undefined,
  sortKey: string | undefined,
): DataTableSortDirection | null {
  if (!sortKey || !sort || sort.key !== sortKey) return null;
  return sort.direction === 'asc' || sort.direction === 'desc' ? sort.direction : null;
}

/** The sort a click on this column should produce, given what is in force. */
export function nextSort(
  sortKey: string,
  active: DataTableSortDirection | null,
  firstSortDirection: DataTableSortDirection = 'asc',
): DataTableSort {
  return {
    key: sortKey,
    direction: active === null ? firstSortDirection : active === 'asc' ? 'desc' : 'asc',
  };
}

/** The glyph for a column in the given state. One source for all renderers. */
export function sortGlyph(active: DataTableSortDirection | null): 'sort-none' | 'sort-asc' | 'sort-desc' {
  return active === null ? 'sort-none' : active === 'asc' ? 'sort-asc' : 'sort-desc';
}

export interface DataTableSort {
  /** Matches a column's `sortKey` — not its `key`, so the two can differ. */
  key: string;
  direction: DataTableSortDirection;
}

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  /** Optional cell renderer; defaults to `row[key]`. Ignored when the cell is editable (EditableCell handles display via `formatValue` below). */
  render?: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  /**
   * Makes the column sortable, and is the value reported back in
   * `DataTableSort.key`. Separate from `key` on purpose: the column you show
   * and the field you sort by are often not the same thing (a "Customer"
   * column sorted by `customer.lastName`, a rendered total sorted by cents).
   *
   * Opt-in. A column without it renders its header exactly as before — no
   * button, no link, no `aria-sort`.
   */
  sortKey?: string;
  /**
   * Which way the FIRST click sorts this column. Defaults to `'asc'`.
   *
   * Worth setting on dates and amounts: ascending-first means a date column
   * opens on the oldest row, which is almost never what someone clicking a
   * date header wants. Consumers were already carrying this by hand.
   */
  firstSortDirection?: DataTableSortDirection;
  /**
   * Accessible name for this column's sort control.
   *
   * Normally unnecessary — the control is named by `header`, per the APG
   * sortable-table pattern. But `header` is a `ReactNode`: an icon-only or
   * empty header leaves the button/link with NO accessible name, which is an
   * axe `button-name` / `link-name` violation. Set this whenever `header` is
   * not plain text.
   */
  sortLabel?: string;
  /**
   * When true, every row's cell in this column renders an EditableCell —
   * click to enter edit mode, Enter commits, Esc cancels, blur commits.
   * The underlying primitive comes from `row[key]` (string or number);
   * use the sibling `formatValue` for display formatting (e.g. "$0.00").
   */
  editable?: boolean;
  /** Editor type when editable. Defaults to "text". */
  editor?: EditableCellType;
  /** Date format — only used when `editor="date"`. */
  dateFormat?: 'mdy' | 'dmy' | 'ymd';
  /** Options for `editor="select"` or `editor="multiselect"`. */
  editorOptions?: EditableCellOption[];
  /** Whether the select panel includes a search box. */
  editorSearchable?: boolean | 'auto';
  /** Clear affordance, per editor type: select/multiselect get a "Clear" footer action in the dropdown; text/number/date get a ✕ inside the editing input (draft-only — commit still via Enter/blur). `editorRequired` never hides it — clearing a required column surfaces the required warning; clearing an optional one empties to the placeholder. Defaults to `true` (EditableCell's own default, mirroring the input family) — pass `false` to opt a column out. */
  editorClearable?: boolean;
  /** Require a non-empty value — empty blocks commit with a warning, before `validate`. */
  editorRequired?: boolean;
  /** Override the default required message for this column. */
  editorRequiredMessage?: string;
  /** Display formatter for the editable cell's read-only state. */
  formatValue?: (value: EditableCellValue) => ReactNode;
  /** Synchronous per-cell validation. Returning a string blocks commit. */
  validate?: (value: EditableCellValue, row: T) => string | null | undefined;
  /**
   * Per-row override for editability (e.g. some rows are read-only). When
   * omitted, every cell in an editable column is editable.
   */
  isEditable?: (row: T) => boolean;
  /** Commit handler. Async — atom shows a submitting state, rejects surface inline. */
  onCommit?: (row: T, value: EditableCellValue) => void | Promise<void>;
  /**
   * Cap the column's content width, in px. One policy for both cell kinds:
   * editable cells receive it as their max-width (display values truncate
   * with an ellipsis, the editing input scrolls internally instead of
   * widening the column); plain cells truncate with an ellipsis. Without
   * it, editable cells fall back to the atom's own per-size Max Width
   * (320px at `size="small"`, uncapped at `"medium"`) and plain cells are
   * uncapped.
   */
  maxWidth?: number;
}

export interface DataTableProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: DataTableColumn<T>[];
  rows: T[];
  density?: DataTableDensity;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  /**
   * Per-row action menu. When provided, a trailing column is appended
   * whose cell is a ⋮ `IconButton` that opens a `Menu` of these entries
   * (actions + separators) on click. The callback receives the row, so
   * each action's `onSelect` closes over its row. Return an empty array
   * to leave a row without a trigger (the column stays for alignment).
   * Clicks inside the actions cell don't bubble to `onRowClick`.
   */
  rowActions?: (row: T) => MenuEntry[];
  /**
   * Accessible name for the visually-empty actions COLUMN header.
   * Default `"Actions"`.
   */
  actionsColumnLabel?: string;
  /**
   * Accessible name for each row's ⋮ trigger and its menu. Default
   * `"Row actions"`. A bare default repeats identically on every row, so
   * override it with something row-specific where the row has a name.
   */
  rowActionsLabel?: string;
  /**
   * The current sort. Controlled — the table never sorts `rows` itself and
   * never holds sort state; it renders what you pass and reports intent. You
   * stay in charge of the comparator, which is the only way a server-paged
   * list can work at all.
   */
  sort?: DataTableSort | null;
  /**
   * Sort as a CALLBACK: the header renders a `<button>` and this fires with
   * the sort a click should produce. For in-page state (`useState`, a store).
   *
   * Never called with `null` — clicking a sorted column flips its direction
   * rather than cycling back to unsorted, because a three-state header gives
   * no hint which of the three a click lands on.
   */
  onSortChange?: (next: DataTableSort) => void;
  /**
   * Sort as a LINK: the header renders an `<a href>` instead, built from the
   * sort a click should produce.
   *
   * This is not a nicety. When sort lives in the URL the list is linkable, the
   * back button works and a server-paged table can render on the server — and
   * a `<button>` cannot do any of it. Consumers were hand-building this header
   * for exactly that reason.
   *
   * Takes precedence over `onSortChange` if both are passed.
   */
  sortHref?: (next: DataTableSort) => string;
  /**
   * Render link mode's anchor yourself — for a client-side router.
   *
   * The default is a plain `<a href>`, which in a Next or React Router app
   * means a full document load on every sort click. Supply this to render the
   * framework's own link (`next/link`, `<Link>`) with the same look: you get
   * the computed `href`, the `className` the table's styling keys on, and the
   * label + glyph as `children`.
   *
   * Requires `sortHref` — this chooses the element, `sortHref` computes the URL.
   */
  renderSortLink?: (args: {
    href: string;
    sort: DataTableSort;
    className: string;
    children: ReactNode;
    'aria-label'?: string;
  }) => ReactNode;
}

/**
 * The header control for a sortable column — a `<button>` normally, an `<a>`
 * when the table was given `sortHref`.
 *
 * The accessible name is just the column's header text, per the APG sortable-
 * table pattern: `aria-sort` on the `<th>` carries the state, so the control
 * does not also narrate it. That also sidesteps the fact that `header` is a
 * `ReactNode` — there is no string to build "sort by X descending" from.
 *
 * The glyph is the 4.51.0 sort family, whose three members share one ink box,
 * so the header does not change weight as the column toggles.
 */
function SortHeader<T>({
  column,
  active,
  onSortChange,
  sortHref,
  renderSortLink,
}: {
  column: DataTableColumn<T>;
  active: DataTableSortDirection | null;
  onSortChange?: (next: DataTableSort) => void;
  sortHref?: (next: DataTableSort) => string;
  renderSortLink?: DataTableProps<T>['renderSortLink'];
}) {
  const next = nextSort(column.sortKey!, active, column.firstSortDirection);
  const body = (
    <>
      <span className="uxm-data-table__sort-label">{column.header}</span>
      <Icon glyph={sortGlyph(active)} size={12} className="uxm-data-table__sort-icon" />
    </>
  );
  // Only set when the consumer asked for it: an aria-label would otherwise
  // override the visible header text, which is the name we want by default.
  const label = column.sortLabel;

  // Link mode wins when both are supplied: an href is a stronger statement of
  // intent than a handler, and silently preferring the button would strand a
  // consumer whose sort lives in the URL.
  if (sortHref) {
    const href = sortHref(next);
    if (renderSortLink) {
      return <>{renderSortLink({ href, sort: next, className: 'uxm-data-table__sort', children: body, 'aria-label': label })}</>;
    }
    return (
      <a className="uxm-data-table__sort" href={href} aria-label={label}>
        {body}
      </a>
    );
  }
  return (
    <button
      type="button"
      className="uxm-data-table__sort"
      aria-label={label}
      onClick={() => onSortChange?.(next)}
    >
      {body}
    </button>
  );
}

export function DataTable<T>({
  columns,
  rows,
  density = 'default',
  rowKey,
  onRowClick,
  rowActions,
  actionsColumnLabel = 'Actions',
  rowActionsLabel = 'Row actions',
  sort,
  onSortChange,
  sortHref,
  renderSortLink,
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
            {columns.map((c) => {
              // A column without `sortKey` is untouched: same markup, no
              // aria-sort, no wrapper. Existing tables render byte-identically.
              const sortable = Boolean(c.sortKey) && Boolean(onSortChange || sortHref);
              const active = sortable ? resolveSortDirection(sort, c.sortKey) : null;
              return (
                <th
                  key={c.key}
                  className={cn(
                    'uxm-data-table__th',
                    c.align && `uxm-data-table__th--${c.align}`,
                    sortable && 'uxm-data-table__th--sortable',
                  )}
                  // Only a sortable column carries aria-sort, and only the
                  // active one carries a direction — "none" on every other
                  // column is what tells a screen reader the table IS sorted
                  // by exactly one of them.
                  aria-sort={
                    !sortable ? undefined : active === 'asc' ? 'ascending' : active === 'desc' ? 'descending' : 'none'
                  }
                >
                  {sortable ? (
                    <SortHeader
                      column={c}
                      active={active}
                      onSortChange={onSortChange}
                      sortHref={sortHref}
                      renderSortLink={renderSortLink}
                    />
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
            {rowActions && (
              // Trailing actions column — header is visually empty (the ⋮
              // affordance speaks for itself) but carries an accessible
              // name. `--actions` shrinks the column to the trigger width.
              <th
                className="uxm-data-table__th uxm-data-table__th--actions"
                aria-label={actionsColumnLabel}
              />
            )}
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
              {columns.map((c) => {
                // Cells fall into three rendering paths:
                //   1. Editable + this row is editable → EditableCell
                //      with click-to-edit and async commit
                //   2. Column has a custom `render` → use that (read-only)
                //   3. Default → stringify `row[key]`
                //
                // (1) reads its primitive from `row[key]` (typed) and
                // ignores `render`, since the editor needs to round-trip
                // string/number values. Custom display formatting goes
                // through `formatValue`.
                const rowEditable =
                  c.editable && (c.isEditable ? c.isEditable(row) : true);
                const staticContent = c.render
                  ? c.render(row)
                  : (row as Record<string, ReactNode>)[c.key];
                const cellContent = rowEditable ? (
                  <EditableCell
                    value={(row as Record<string, EditableCellValue>)[c.key]}
                    onCommit={(next) => c.onCommit?.(row, next)}
                    type={c.editor ?? 'text'}
                    dateFormat={c.dateFormat}
                    options={c.editorOptions}
                    searchable={c.editorSearchable}
                    clearable={c.editorClearable}
                    required={c.editorRequired}
                    requiredMessage={c.editorRequiredMessage}
                    align={c.align}
                    format={c.formatValue}
                    validate={
                      c.validate
                        ? (next) => c.validate?.(next, row)
                        : undefined
                    }
                    // Column-level cap routes through the atom's own
                    // max-width vars so display truncation, editing ghosts,
                    // and the input all honor the same limit. Written for BOTH
                    // sizes on purpose: the cap is per-size in the atom (small
                    // caps at 320px, medium is uncapped so a side-panel cell
                    // fills its container), and a column cap must win whichever
                    // size the cell renders at — today always `small`, but this
                    // stays correct if a size ever gets passed through.
                    style={
                      c.maxWidth != null
                        ? ({
                            '--uxm-editable-cell-small-max-width': `${c.maxWidth}px`,
                            '--uxm-editable-cell-medium-max-width': `${c.maxWidth}px`,
                          } as CSSProperties)
                        : undefined
                    }
                  />
                ) : c.maxWidth != null ? (
                  <HoverTooltip content={staticContent}>
                    <span
                      className="uxm-data-table__clamp"
                      style={{ maxWidth: c.maxWidth }}
                    >
                      {staticContent}
                    </span>
                  </HoverTooltip>
                ) : (
                  staticContent
                );
                return (
                  <td
                    key={c.key}
                    // `data-label` carries the column header text down to the
                    // cell so the card-list mode at narrow container widths
                    // (see `.uxm-data-table` container query in
                    // data-table.scss) can surface it via a CSS
                    // pseudo-element. Only stringifiable headers participate
                    // — a ReactNode header (icon, JSX) can't reach a
                    // pseudo-element via `attr()`, so those cells fall back
                    // to value-only rendering, which is the existing
                    // behaviour at normal widths.
                    data-label={typeof c.header === 'string' ? c.header : undefined}
                    className={cn(
                      'uxm-data-table__td',
                      c.align && `uxm-data-table__td--${c.align}`,
                      rowEditable && 'uxm-data-table__td--editable',
                    )}
                    // Stop the row click from firing when the user clicks an
                    // editable cell — otherwise both onRowClick and the
                    // EditableCell's enter-edit handler race.
                    onClick={rowEditable ? (e) => e.stopPropagation() : undefined}
                  >
                    {cellContent}
                  </td>
                );
              })}
              {rowActions && (() => {
                const actions = rowActions(row);
                return (
                  <td
                    className="uxm-data-table__td uxm-data-table__td--actions"
                    data-label="Actions"
                    // Opening the menu must not also fire the row click —
                    // same guard the editable cells use.
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions.length > 0 && (
                      <Menu
                        items={actions}
                        aria-label={rowActionsLabel}
                        renderTrigger={({ open, triggerProps }) => (
                          <IconButton
                            {...triggerProps}
                            aria-label={rowActionsLabel}
                            className={cn(
                              'uxm-data-table__actions-trigger',
                              open && 'uxm-icon-button--active',
                            )}
                          >
                            <Icon glyph="kebab" size={18} />
                          </IconButton>
                        )}
                      />
                    )}
                  </td>
                );
              })()}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
