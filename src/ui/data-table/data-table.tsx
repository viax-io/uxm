import { cn } from '@/helpers';

import { EditableCell, type EditableCellOption, type EditableCellType, type EditableCellValue } from '../editable-cell';
import { HoverTooltip } from '../hover-tooltip';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Menu, type MenuEntry } from '../menu';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type DataTableDensity = 'compact' | 'default' | 'relaxed';

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  /** Optional cell renderer; defaults to `row[key]`. Ignored when the cell is editable (EditableCell handles display via `formatValue` below). */
  render?: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
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
   * it, editable cells fall back to the atom's themable Max Width and
   * plain cells are uncapped.
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
}

export function DataTable<T>({
  columns,
  rows,
  density = 'default',
  rowKey,
  onRowClick,
  rowActions,
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
            {rowActions && (
              // Trailing actions column — header is visually empty (the ⋮
              // affordance speaks for itself) but carries an accessible
              // name. `--actions` shrinks the column to the trigger width.
              <th
                className="uxm-data-table__th uxm-data-table__th--actions"
                aria-label="Actions"
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
                    // max-width var so display truncation, editing ghosts,
                    // and the input all honor the same limit.
                    style={
                      c.maxWidth != null
                        ? ({ '--uxm-editable-cell-max-width': `${c.maxWidth}px` } as CSSProperties)
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
                        aria-label="Row actions"
                        renderTrigger={({ open, triggerProps }) => (
                          <IconButton
                            {...triggerProps}
                            aria-label="Row actions"
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
