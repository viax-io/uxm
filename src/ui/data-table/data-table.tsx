import { cn } from '@/helpers';

import { EditableCell, type EditableCellOption, type EditableCellType, type EditableCellValue } from '../editable-cell';
import { HoverTooltip } from '../hover-tooltip';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Menu, type MenuEntry } from '../menu';

import type { CSSProperties, HTMLAttributes, MouseEvent, ReactNode } from 'react';

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

/**
 * A column's name as plain text, or `undefined` when it has none.
 *
 * Falls back to `header` when it is a string, which is what `data-label` has
 * always used — so adding `label` only ever fills a gap. A `ReactNode` header
 * previously meant the cell rendered with no label at all in stacked mode,
 * silently; `label` is how that gets fixed without stringifying JSX.
 */
export function columnLabel<T>(column: DataTableColumn<T>): string | undefined {
  return column.label ?? (typeof column.header === 'string' ? column.header : undefined);
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
   * Column width — a share (`'34%'`, `'1fr'` is NOT supported: this is a
   * table) or pixels (`120` or `'120px'`).
   *
   * Setting it on ANY column switches the table to `table-layout: fixed`,
   * which is what makes a declared width actually hold instead of being a
   * hint the browser may ignore once content is wide. Columns without a width
   * split what is left. A table where no column declares one is untouched —
   * auto layout, exactly as before.
   *
   * This replaces reaching into `.uxm-data-table__th:nth-child(n)` from a
   * consumer stylesheet, which is what people were doing.
   */
  width?: number | string;
  /**
   * Class applied to BOTH this column's `<th>` and every `<td>` in it —
   * which is the point: a column is a vertical thing, and styling one from
   * the outside otherwise means two `nth-child` selectors that renumber the
   * moment a column is inserted.
   */
  className?: string;
  /**
   * The column's name as plain text, for places a `ReactNode` header cannot
   * go: the `data-label` that stacked mode shows on each cell, and the
   * accessible name of the sort control.
   *
   * Defaults to `header` when it is a string, which is exactly today's
   * behaviour — so this only ever adds a label where there was none.
   */
  label?: string;
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
   * Marks one row as the active one — the row whose detail is open in a pane
   * beside the table, typically. Compared against `rowKey(row)`.
   *
   * Sets `aria-current="true"` and a `--active` class. Separate from hover and
   * from `onRowClick`: a row stays active while the pointer is elsewhere.
   */
  activeRowId?: string | null;
  /**
   * Extra attributes per row, merged onto the `<tr>`.
   *
   * The escape hatch for everything `activeRowId` does not cover — an `id` to
   * deep-link to, a data attribute, a row-specific class.
   *
   * Merge rules, because they differ per key and silence here would be a trap:
   * - `className` is merged with the table's own classes, not replacing them.
   * - `onClick` is COMPOSED with `onRowClick`: yours runs first, then the row
   *   click, unless you call `preventDefault()`. Letting either one simply win
   *   would silently drop the other, which is what the first version did.
   * - everything else wins over the default, `aria-current` included — a
   *   consumer may have its own idea of what "current" means.
   * - `children` and `dangerouslySetInnerHTML` are not accepted; they would
   *   fight the cells. A runtime `key` is ignored.
   */
  rowProps?: (row: T) => Omit<
    HTMLAttributes<HTMLTableRowElement>,
    'children' | 'dangerouslySetInnerHTML'
  >;
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
  // `sortLabel` is the sort-specific override; `label` is the column's general
  // plain-text name. Either beats nothing, and nothing is the right answer for
  // a string header — an aria-label there would merely restate the visible
  // text, and a redundant one is worse than none.
  // `sortLabel` is the sort-specific override; otherwise the column's plain
  // name, but ONLY when it says something the visible header does not. A label
  // identical to a string header would just restate it, and a redundant
  // accessible name replaces the visible text rather than adding to it.
  const columnName = columnLabel(column);
  const label =
    column.sortLabel ?? (columnName && columnName !== column.header ? columnName : undefined);

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
  activeRowId,
  rowProps,
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
      {/* `table-layout: fixed` ONLY once a column declares a width. Under auto
          layout a declared width is a suggestion the browser drops as soon as
          content is wider, so the two go together — but switching every table
          to fixed would re-lay-out every existing consumer, which is a major
          decision, not a side effect of adding a prop. */}
      <table
        className={cn(
          'uxm-data-table__table',
          columns.some((c) => c.width != null) && 'uxm-data-table__table--fixed',
        )}
      >
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
                  // The width lands on the <th> only: under fixed layout the
                  // first row decides every column, so repeating it on each
                  // <td> is noise that can only disagree with itself.
                  style={c.width != null ? { width: c.width } : undefined}
                  className={cn(
                    'uxm-data-table__th',
                    c.align && `uxm-data-table__th--${c.align}`,
                    sortable && 'uxm-data-table__th--sortable',
                    c.className,
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
          {rows.map((row) => {
            const id = rowKey(row);
            const isActive = activeRowId != null && activeRowId === id;
            // Spread BEFORE the table's own attributes for className (merged,
            // not replaced) and AFTER for everything else, so a consumer can
            // override `aria-current` — it may well have its own idea of what
            // "current" means — without having to fight the defaults.
            const extra = rowProps?.(row);
            const { className: rowClassName, onClick: rowOnClick, ...restRowProps } = extra ?? {};
            // Compose rather than let one win: `onClick` sitting after the
            // spread meant a consumer's handler was dropped every time, and
            // `onClick={undefined}` clobbered it even with no `onRowClick`.
            const handleClick =
              rowOnClick || onRowClick
                ? (event: MouseEvent<HTMLTableRowElement>) => {
                    rowOnClick?.(event);
                    if (!event.defaultPrevented) onRowClick?.(row);
                  }
                : undefined;
            return (
            <tr
              key={id}
              aria-current={isActive ? 'true' : undefined}
              {...restRowProps}
              className={cn(
                'uxm-data-table__row',
                onRowClick && 'uxm-data-table__row--interactive',
                isActive && 'uxm-data-table__row--active',
                rowClassName,
              )}
              onClick={handleClick}
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
                    data-label={columnLabel(c)}
                    className={cn(
                      'uxm-data-table__td',
                      c.align && `uxm-data-table__td--${c.align}`,
                      rowEditable && 'uxm-data-table__td--editable',
                      c.className,
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
