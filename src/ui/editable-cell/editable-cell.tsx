import { EditableCellDateView } from './editable-cell-date';
import { EditableCellSelectView } from './editable-cell-select';
import { EditableCellTextView } from './editable-cell-text';
import { useEditableCell, type EditableCellResolvedProps } from './use-editable-cell';

import type { EditableCellProps } from './editable-cell.types';
// The public types live in ./editable-cell.types.ts; re-exported here so the
// folder barrel (`export * from './editable-cell'`) keeps the same surface.
export type {
  EditableCellAlign,
  EditableCellOption,
  EditableCellProps,
  EditableCellSize,
  EditableCellType,
  EditableCellValue,
} from './editable-cell.types';

/**
 * Inline-editable cell. Three modes:
 *
 *   - **Display** (default) — renders the formatted value as a button-styled
 *     text run. Click (or Enter/Space when focused) to enter edit mode.
 *   - **Editing** — replaces the display with a focused, select-all'd input.
 *     Enter commits, Esc cancels, blur commits.
 *   - **Submitting** — input disabled while an async `onCommit` is pending.
 *
 * Problems surface in a Popover anchored under the cell (never inline — a
 * table row must not change height) carrying a compact Banner: `warning`
 * (yellow) for sync validate failures the user can fix in place, `error`
 * (red) for a rejected `onCommit`. Either way the user stays in edit mode
 * to correct or retry.
 *
 * Designed primarily for DataTable cells, but works anywhere an inline
 * commit semantic is needed (PageHeader rename, StatCard label, etc.).
 */
export function EditableCell({
  type = 'text',
  dateFormat = 'ymd',
  searchable = 'auto',
  clearable = true,
  align = 'left',
  size = 'small',
  required = false,
  saveErrorMessage = 'Failed to save',
  invalidNumberMessage = 'Enter a number',
  invalidValueMessage = 'Enter a valid value',
  clearSelectionLabel = 'Clear selection',
  clearDateLabel = 'Clear date',
  clearValueLabel = 'Clear value',
  openCalendarLabel = 'Open calendar',
  calendarDialogLabel = 'Choose date',
  addDateLabel = 'Add date',
  ...rest
}: EditableCellProps) {
  // Defaults are applied once, here, so the hook and every view read one
  // fully-resolved props object instead of re-declaring them.
  const props: EditableCellResolvedProps = {
    ...rest,
    type,
    dateFormat,
    searchable,
    clearable,
    align,
    size,
    required,
    saveErrorMessage,
    invalidNumberMessage,
    invalidValueMessage,
    clearSelectionLabel,
    clearDateLabel,
    clearValueLabel,
    openCalendarLabel,
    calendarDialogLabel,
    addDateLabel,
  };
  const cell = useEditableCell(props);

  if (props.type === 'select' || props.type === 'multiselect') {
    return <EditableCellSelectView props={props} cell={cell} />;
  }
  if (props.type === 'date') {
    return <EditableCellDateView props={props} cell={cell} />;
  }
  return <EditableCellTextView props={props} cell={cell} />;
}
