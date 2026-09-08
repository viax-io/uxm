import { type CSSProperties, type ReactNode } from 'react';

import type { DateInputFormat } from '../date-input';

export type EditableCellType = 'text' | 'number' | 'date' | 'select' | 'multiselect';

export type EditableCellAlign = 'left' | 'right' | 'center';

export type EditableCellSize = 'small' | 'medium';

export type EditableCellValue = string | number | string[];

export interface EditableCellOption {
  value: string;
  label: string;
}

/**
 * Two severity levels, mapped to Banner variants:
 *   - `warning` — recoverable input problems the user can fix in place
 *     (sync `validate` failures, unparseable number drafts).
 *   - `error` — the commit itself failed (`onCommit` rejected): the value
 *     was fine but saving didn't happen.
 */
export interface CellError {
  message: string;
  severity: 'warning' | 'error';
}

export interface EditableCellProps {
  /** Current committed value. The atom keeps a draft internally while editing. */
  value: EditableCellValue;
  /**
   * Called when the user commits the change (Enter, or blur with no
   * validation error). The promise's settlement controls error display:
   * resolve → exit edit mode, reject → stay in edit mode with the error
   * surfaced inline so the user can correct.
   */
  onCommit: (next: EditableCellValue) => void | Promise<void>;
  /** Editor type. Text uses a string input; number coerces to Number on commit (an emptied draft commits `""` — the uniform "cleared" value). Defaults to "text". */
  type?: EditableCellType;
  /** Date format — only used when `type="date"`. Defaults to `"mdy"`. */
  dateFormat?: DateInputFormat;
  /** Options — required for `type="select"` and `type="multiselect"`. */
  options?: EditableCellOption[];
  /**
   * Whether the select panel includes a search box. Defaults to `"auto"` —
   * the box appears only once the option count passes the shared Listbox
   * threshold (6) — so a select/multiselect cell matches the `Select` atom's
   * behavior instead of inheriting the raw Listbox `true` default.
   */
  searchable?: boolean | 'auto';
  /**
   * Clear affordance — the surface differs per editor type:
   *   - `select` / `multiselect` — a "Clear" / "Clear all" action in the
   *     dropdown footer (commits "" / empties the draft).
   *   - `text` / `number` / `date` — a ✕ inside the EDITING input (mirrors
   *     TextInput/NumberInput/DateInput) that empties the draft and keeps
   *     focus; nothing commits until Enter/blur, so `required`/`validate`
   *     still guard, and Esc still restores the old value. Available on
   *     required cells too — "wipe it and type the right value" is the
   *     point. Display mode never shows a ✕ — the pencil owns that gutter,
   *     and a one-click destroy on a static table cell invites accidents.
   *
   * `required` never hides the affordance — it guards the OUTCOME instead:
   * clearing a required cell surfaces the required warning (the value stays),
   * clearing an optional one empties it back to the placeholder.
   *
   * Defaults to `true` — the input-family default (TextInput, NumberInput,
   * DateInput …), so consumers like DataTable get the affordance uniformly
   * without per-column wiring. Pass `false` to opt out.
   */
  clearable?: boolean;
  /** Text alignment — pass through from a DataTable column's `align` so the editing input matches the display alignment. */
  align?: EditableCellAlign;
  /**
   * Size preset. `small` (default) is the dense table scale — the cell reads
   * like a static text cell inside a DataTable row (its font falls back to
   * the inherited size). `medium` steps the cell up to the input-family
   * scale (12/6 padding, 14px font) for standalone use in side panels /
   * detail views, where a table-dense cell looks undersized next to real
   * inputs. Each size owns a symmetric
   * `--uxm-editable-cell-{size}-{padding-x,padding-y,font-size}` knob set;
   * height always derives from font-size + padding (a `1lh` floor keeps
   * empty cells clickable).
   */
  size?: EditableCellSize;
  /**
   * Display-mode formatter. Receives the raw value, returns the React node
   * to render in display mode. Never called for an empty value — a cleared
   * cell renders its `placeholder` instead (so a Tag/Badge formatter can't
   * paint an empty pill).
   */
  format?: (value: EditableCellValue) => ReactNode;
  /** Synchronous validation. Return an error message to block commit; return null/undefined to accept. */
  validate?: (next: EditableCellValue) => string | null | undefined;
  /**
   * Mark the cell required — an empty value blocks commit and surfaces a
   * warning, checked BEFORE `validate` so you don't hand-write the empty rule.
   * Uniform across every editor type: `multiselect` → non-empty array (the
   * rule lives in MultiListbox, shared with every other picker), `select` →
   * a chosen option, `text`/`number`/`date` → a non-blank value.
   */
  required?: boolean;
  /** Override the default required message (per-type: "Select at least one option" / "Select an option" / "Required"). */
  requiredMessage?: string;
  /**
   * Shown at `error` severity when `onCommit` rejects without a message of
   * its own. Default `"Failed to save"`. A rejection that *does* carry an
   * `Error.message` still wins — that text is the server's, not the atom's.
   */
  saveErrorMessage?: string;
  /**
   * Shown at `warning` severity when a `type="number"` draft isn't a number.
   * Default `"Enter a number"`.
   */
  invalidNumberMessage?: string;
  /**
   * Shown at `warning` severity when a `type="date"` draft doesn't parse.
   * Defaults to `invalidDateMessage(dateFormat)` — `` `Enter a valid date
   * (YYYY-MM-DD)` `` — which names the expected mask, so a translation
   * should keep the mask in it.
   */
  invalidDateMessage?: string;
  /**
   * Sample warning text for `forceMode="warning"`. Preview-only — production
   * consumers never see it. Default `"Enter a valid value"`.
   */
  invalidValueMessage?: string;
  /** Read-only — clicking does nothing, no edit affordance. */
  disabled?: boolean;
  /** Shown when value is empty/blank. */
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
  /**
   * Accessible names for the editors' icon-only controls. Which ones apply
   * depends on the editor type. The composed "Edit {value}" trigger names
   * are not here — pass `aria-label` to replace those wholesale.
   */
  /** Clear button, select + multiselect editors. Default `"Clear selection"`. */
  clearSelectionLabel?: string;
  /** Clear button, date editor. Default `"Clear date"`. */
  clearDateLabel?: string;
  /** Clear button, text / number editors. Default `"Clear value"`. */
  clearValueLabel?: string;
  /** Calendar trigger, date editor. Default `"Open calendar"`. */
  openCalendarLabel?: string;
  /** Calendar popover dialog, date editor. Default `"Choose date"`. */
  calendarDialogLabel?: string;
  /** Trigger name when the date editor is empty. Default `"Add date"`. */
  addDateLabel?: string;
  /**
   * Preview-only branch override. UXM's canvas passes this to render the
   * input branch without a real click — `editing` shows the input, `warning`
   * / `error` also surface a sample message at that severity so the matching
   * knobs paint. It does NOT focus the input (the canvas must never steal
   * focus from the editor panel); the preview mirrors the focus visuals via
   * a forced CSS class instead. Production consumers leave it unset.
   */
  forceMode?: 'editing' | 'warning' | 'error';
}
