import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { cn } from '@/helpers';

import { Banner } from '../banner';
import { ButtonGhost } from '../button';
import { Calendar, type CalendarValue } from '../calendar';
import {
  FORMAT_SPEC,
  formatDate as formatDateAs,
  invalidDateMessage,
  maskDate,
  parseDate as parseFormattedDate,
  type DateInputFormat,
} from '../date-input';
import { HoverTooltip } from '../hover-tooltip';
import { Icon } from '../icon';
import { Listbox, MultiListbox, type ListboxRenderTriggerState } from '../listbox';
import { maskNumeric } from '../number-input';
import { Popover } from '../popover';

export type EditableCellType = 'text' | 'number' | 'date' | 'select' | 'multiselect';
export type EditableCellAlign = 'left' | 'right' | 'center';
export type EditableCellSize = 'small' | 'medium';
export type EditableCellValue = string | number | string[];

/** Strict `YYYY-MM-DD` → local Date (no TZ surprises), null if not parseable. */
function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const day = Number(m[3]);
  const d = new Date(y, mo - 1, day);
  // Reject regex-valid but out-of-range dates: `new Date(2024, 1, 30)` silently
  // rolls over to Mar 1 rather than producing NaN, which would later read as a
  // value change and trigger an unprompted rewrite. Require a clean round-trip.
  if (d.getFullYear() !== y || d.getMonth() !== mo - 1 || d.getDate() !== day) return null;
  return d;
}

/** Serialize a Date to ISO (`YYYY-MM-DD`) — reuses the shared `ymd` formatter. */
const toISODate = (d: Date): string => formatDateAs(d, 'ymd');

/**
 * Committed dates are stored ISO (`YYYY-MM-DD`); the input and display show
 * the cell's `dateFormat` mask. Convert ISO → mask so `dmy`/`mdy` cells read
 * and edit in their own shape. Values that aren't ISO (e.g. a consumer's
 * already-formatted seed) pass through untouched.
 */
function isoToFormatted(value: EditableCellValue, format: DateInputFormat): string {
  if (typeof value !== 'string' || !value) return '';
  const d = parseISODate(value);
  return d ? formatDateAs(d, format) : value;
}

/**
 * Emptiness rule for the `required` check — the single definition shared by
 * every editor type: an empty array (multiselect), a NaN number (blank numeric
 * draft), or a blank/whitespace string (text/select/date).
 */
function isEmptyValue(v: EditableCellValue): boolean {
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'number') return Number.isNaN(v);
  return String(v ?? '').trim() === '';
}

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
interface CellError {
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
  value,
  onCommit,
  type = 'text',
  dateFormat = 'ymd',
  options,
  searchable = 'auto',
  clearable = true,
  align = 'left',
  size = 'small',
  format,
  validate,
  required = false,
  requiredMessage,
  saveErrorMessage = 'Failed to save',
  invalidNumberMessage = 'Enter a number',
  invalidDateMessage: invalidDateMessageProp,
  invalidValueMessage = 'Enter a valid value',
  disabled,
  placeholder,
  className,
  style,
  'aria-label': ariaLabel,
  clearSelectionLabel = 'Clear selection',
  clearDateLabel = 'Clear date',
  clearValueLabel = 'Clear value',
  openCalendarLabel = 'Open calendar',
  calendarDialogLabel = 'Choose date',
  addDateLabel = 'Add date',
  forceMode,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string>(() => {
    if (type === 'date') return isoToFormatted(value, dateFormat);
    if (Array.isArray(value)) return '';
    return String(value ?? '');
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<CellError | null>(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Anchor for the error popover — the editing wrapper, so the banner hangs
  // under the cell without affecting the table row's layout.
  const wrapRef = useRef<HTMLSpanElement | null>(null);

  // Committed date as a Date and in the cell's mask, memoized so the display,
  // tooltip, aria-label, calendar highlight, draft sync, and cancel-reset all
  // share one parse/format instead of each re-running it. Cheap `null`/`''`
  // no-ops for non-date types. Declared before the effects so they can reuse it.
  const parsedValue = useMemo(
    () =>
      type === 'date' && typeof value === 'string' && value
        ? parseISODate(value) ?? parseFormattedDate(value, dateFormat)
        : null,
    [type, value, dateFormat],
  );
  const displayFormatted = useMemo(
    () => (type === 'date' ? isoToFormatted(value, dateFormat) : ''),
    [type, value, dateFormat],
  );

  // When the externally-committed value changes (parent state updated, or
  // someone else edited the row), sync the draft — but only when we're
  // NOT mid-edit. Mid-edit syncs would clobber what the user is typing.
  useEffect(() => {
    if (!isEditing) {
      const next = Array.isArray(value)
        ? ''
        : type === 'date'
          ? displayFormatted
          : String(value ?? '');
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional external-value → draft sync, gated to non-editing mode
      setDraft(next);
    }
  }, [value, isEditing, type, displayFormatted]);

  // Focus + select-all when entering edit mode. Select-all means typing
  // immediately replaces the value — the most common edit intent — while
  // keyboard navigation (Home/End/arrows) still works to refine.
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // A surfaced problem and the date calendar can't share the anchor, so the
  // calendar is hidden while an error shows. Close it outright (not just via
  // the render gate) so clearing the error later — e.g. the next keystroke's
  // `setError(null)` — doesn't silently reopen a calendar the user dismissed.
  useEffect(() => {
    if (error && type === 'date') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- close the calendar exactly when a date error appears, so it can't auto-reopen on clear
      setOpen(false);
    }
  }, [error, type]);

  const parseDraft = useCallback((): EditableCellValue => {
    // `Number('')` is 0, not NaN — map an empty/whitespace draft to NaN so
    // blur-with-empty hits the "Enter a number" boundary instead of silently
    // committing 0.
    if (type === 'number') return draft.trim() === '' ? Number.NaN : Number(draft);
    if (type === 'date') return draft;
    return draft;
  }, [type, draft]);

  // Per-type default required message; overridable via `requiredMessage`.
  // (multiselect's own default lives in MultiListbox, which owns that rule.)
  const requiredMsg =
    requiredMessage ?? (type === 'select' ? 'Select an option' : 'Required');

  const commitValue = useCallback(
    async (next: EditableCellValue): Promise<boolean> => {
      // Re-entrancy guard lives HERE, not only in each caller's render
      // condition: every commit path funnels through this function, so a new
      // call site can't forget to gate itself (`commitDate` keeps its own
      // early return for the same reason).
      if (submitting) return false;
      // Required is checked before `validate` so consumers get the empty rule
      // for free. Multiselect empties are already blocked upstream by
      // MultiListbox (they never reach here), so this covers the scalar types.
      if (required && isEmptyValue(next)) {
        setError({ message: requiredMsg, severity: 'warning' });
        return false;
      }
      const validationError = validate?.(next);
      if (validationError) {
        setError({ message: validationError, severity: 'warning' });
        return false;
      }

      setError(null);
      setSubmitting(true);
      try {
        await onCommit(next);
        setIsEditing(false);
        setOpen(false);
        return true;
      } catch (err) {
        // Error severity: the value was acceptable but saving failed.
        setError({
          message: err instanceof Error ? err.message : saveErrorMessage,
          severity: 'error',
        });
        // Refocus the input so the user can retry without re-entering edit mode.
        requestAnimationFrame(() => inputRef.current?.focus());
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, required, requiredMsg, saveErrorMessage, validate, onCommit],
  );

  // Shared commit path for both the typed input (handleCommit) and the calendar
  // (handlePick). Guards a re-entrant commit while one is in flight, and skips
  // the consumer's onCommit when nothing changed — comparing normalized ISO on
  // BOTH sides so a formatted seed (or a re-picked day) isn't mistaken for a
  // change — while still running `validate` on the no-op so a required /
  // row-dependent rule still surfaces.
  const commitDate = useCallback(
    async (iso: string) => {
      if (submitting) return;
      const currentIso = parsedValue ? toISODate(parsedValue) : '';
      if (iso === currentIso) {
        const validationError = validate?.(iso);
        if (validationError) {
          setError({ message: validationError, severity: 'warning' });
          return;
        }
        setIsEditing(false);
        setOpen(false);
        setError(null);
        return;
      }
      await commitValue(iso);
    },
    [submitting, parsedValue, validate, commitValue],
  );

  const handleCommit = useCallback(async () => {
    const next = parseDraft();

    // Number type with a NaN draft is rejected at the parse boundary —
    // EXCEPT when the draft was emptied outright (the ✕, or select-all +
    // Delete): that's an intentional clear, not a typo, so it routes
    // through `commitValue('')` like every other type — `required` blocks
    // it with its own message, an optional cell commits '' and shows its
    // placeholder. Half-typed non-numbers ("-", ".") stay input errors.
    // Warning severity: the input is the problem and the user can fix it.
    if (type === 'number' && Number.isNaN(next)) {
      if (draft.trim() === '') {
        if (String(value ?? '') === '') {
          // Already empty — pure exit, no spurious onCommit (mirrors the
          // unchanged-value no-op below).
          setIsEditing(false);
          setError(null);
          return;
        }
        await commitValue('');
        return;
      }
      setError({ message: invalidNumberMessage, severity: 'warning' });
      return;
    }

    // Typed dates parse at the boundary: per the cell's `dateFormat` mask
    // first, canonical ISO as fallback. An emptied draft clears the date
    // (commits ""). Unchanged-value / submitting / validation handling all
    // live in the shared `commitDate` so typing and calendar picking behave
    // identically.
    if (type === 'date') {
      const raw = String(next).trim();
      if (raw === '') {
        await commitDate('');
        return;
      }
      const parsed = parseFormattedDate(raw, dateFormat) ?? parseISODate(raw);
      if (!parsed) {
        setError({
          message: invalidDateMessageProp ?? invalidDateMessage(dateFormat),
          severity: 'warning',
        });
        return;
      }
      await commitDate(toISODate(parsed));
      return;
    }

    // No-op when value didn't change — exit edit mode without firing
    // the consumer's handler (avoids spurious "save" calls on blur).
    // NOTE: unlike the date path in `commitDate` (which re-runs `validate`
    // on an unchanged value so a required / row-dependent rule still
    // surfaces on blur), text/number intentionally skip `validate` here.
    // These cells have no cross-row validity story today, so an unchanged
    // blur is treated as a pure exit; keep the two paths in sync if that
    // assumption ever changes.
    const valueStr = Array.isArray(value) ? '' : String(value ?? '');
    if (String(next) === valueStr) {
      setIsEditing(false);
      setError(null);
      return;
    }

    await commitValue(next);
  }, [
    parseDraft,
    type,
    draft,
    dateFormat,
    value,
    commitValue,
    commitDate,
    invalidNumberMessage,
    invalidDateMessageProp,
  ]);

  const handlePick = useCallback(
    async (calValue: CalendarValue) => {
      if (!calValue.start || submitting) return;
      setDraft(formatDateAs(calValue.start, dateFormat));
      // Routes through the shared guard: re-picking the already-selected day is
      // a no-op (no spurious onCommit), and a pick can't fire mid-commit.
      await commitDate(toISODate(calValue.start));
    },
    [dateFormat, submitting, commitDate],
  );

  // ✕ inside the editing input (text/number/date, gated by `clearable`).
  // Empties the DRAFT only — focus stays in the input (the button swallows
  // its mousedown so the field never blurs) and nothing commits until
  // Enter/blur, so required/validate still guard and Esc still restores.
  const handleClearDraft = useCallback(() => {
    setDraft('');
    setError(null);
  }, []);

  const handleCancel = useCallback(() => {
    if (Array.isArray(value)) {
      setDraft('');
    } else if (type === 'date') {
      setDraft(displayFormatted);
    } else {
      setDraft(String(value ?? ''));
    }
    setIsEditing(false);
    setOpen(false);
    setError(null);
  }, [value, type, displayFormatted]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCommit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleCommit, handleCancel],
  );

  // `forceMode` (preview-only) renders the input branch without a real
  // click. `warning` / `error` also surface a sample message at that
  // severity so the matching knobs paint. Derived in the render body —
  // deliberately NOT fed into the focus effect above, so a forced preview
  // never steals focus from the rest of the page. Production leaves
  // forceMode unset, so `editing` collapses to the internal `isEditing`.
  const editing = forceMode != null || isEditing;
  const shownError: CellError | null =
    forceMode === 'error'
      ? error ?? { message: saveErrorMessage, severity: 'error' }
      : forceMode === 'warning'
        ? error ?? { message: invalidValueMessage, severity: 'warning' }
        : error;

  // Hint shown in the date input — the canonical format pattern for the
  // chosen `dateFormat`. Used as the placeholder when the cell is empty
  // and as the input placeholder in edit mode.
  const dateHint = FORMAT_SPEC[dateFormat].placeholder;

  // Compute display value
  const isEmpty = Array.isArray(value)
    ? value.length === 0
    : value === '' || value === null || value === undefined;

  const display = (() => {
    // Empty wins over `format`: a cleared cell must read as its placeholder,
    // not as the formatter's rendering of "" (e.g. a Tag formatter would
    // paint an empty pill). `format` only ever sees real values.
    if (isEmpty) return placeholder ?? (type === 'date' ? dateHint : '');
    if (format) return format(value);
    if (Array.isArray(value)) {
      // For multiselect: show labels from options if available
      if (options) {
        return value
          .map((v) => options.find((o) => o.value === v)?.label ?? v)
          .join(', ');
      }
      return value.join(', ');
    }
    if (type === 'select' && options) {
      return options.find((o) => o.value === String(value))?.label ?? String(value);
    }
    return value;
  })();

  // Plain-text form of the value, fed to the HoverTooltip so a value that's
  // clipped at the cell's max-width is still readable on hover. Best-effort
  // for custom `format` cells — those render arbitrary nodes, so the tooltip
  // falls back to the underlying value rather than extracting text from JSX.
  const isMulti = type === 'multiselect';
  const isSelect = type === 'select';
  const isDate = type === 'date';
  const titleText = isEmpty
    ? placeholder ?? ''
    : isMulti
      ? Array.isArray(value)
        ? (options ?? [])
            .filter((o) => (value as string[]).includes(o.value))
            .map((o) => o.label)
            .join(', ')
        : ''
      : isSelect
        ? (options?.find((o) => o.value === String(value))?.label ?? String(value))
        : isDate
          ? displayFormatted || String(value)
          : String(value);

  // For select/multiselect in open state, we render a Listbox-driven UI
  if (type === 'select' || type === 'multiselect') {
    const optionItems = options ?? [];
    const getKey = (o: EditableCellOption) => o.value;
    const getLabel = (o: EditableCellOption) => o.label;

    if (type === 'select') {
      const selectedItem = Array.isArray(value)
        ? null
        : optionItems.find((o) => o.value === String(value ?? '')) ?? null;

      return (
        <span
          ref={wrapRef}
          className={cn(
            'uxm-editable-cell',
            `uxm-editable-cell--${size}`,
            `uxm-editable-cell--align-${align}`,
            `uxm-editable-cell--type-${type}`,
            clearable && 'uxm-editable-cell--clearable',
            disabled && 'uxm-editable-cell--disabled',
            isEmpty && 'uxm-editable-cell--empty',
            open && 'uxm-editable-cell--open',
            className,
          )}
          style={style}
        >
          <Listbox<EditableCellOption>
            items={optionItems}
            getKey={getKey}
            getLabel={getLabel}
            value={selectedItem}
            onChange={async (next) => {
              if (next) await commitValue(next.value);
            }}
            disabled={disabled}
            searchable={searchable}
            matchAnchorWidth
            onOpenChange={setOpen}
            renderTrigger={({ open: isOpen, triggerProps }: ListboxRenderTriggerState<EditableCellOption>) => (
              <button
                type="button"
                {...triggerProps}
                className={cn(
                  'uxm-editable-cell__select-trigger',
                  isOpen && 'uxm-editable-cell__select-trigger--open',
                )}
                aria-label={ariaLabel ?? `Edit ${String(value ?? '')}`}
              >
                <HoverTooltip content={titleText} disabled={disabled}>
                  <span className="uxm-editable-cell__value uxm-editable-cell__option-label">
                    {display}
                  </span>
                </HoverTooltip>
                <span className="uxm-editable-cell__chevron" aria-hidden="true">
                  <Icon glyph="chevron-down" size={12} />
                </span>
              </button>
            )}
            renderItem={(o) => (
              <span className="uxm-editable-cell__option-label">{o.label}</span>
            )}
            footer={clearable && selectedItem ? ({ close }: { close: () => void }) => (
              <ButtonGhost
                className="uxm-listbox__footer-clear-option"
                onClick={() => {
                  commitValue('');
                  close();
                }}
              >
                <Icon glyph="close" size={12} />
                Clear
              </ButtonGhost>
            ) : undefined}
          />
          {clearable && !disabled && !submitting && !isEmpty && (
            /* Trigger ✕ — clear from the field itself (the input-family
               convention), on every size: commits the empty value directly,
               complementing the panel-footer Clear. Sibling of the trigger (a
               button can't nest a button), absolutely positioned into the
               reserved second gutter slot. Revealed only while the panel is
               open (see the `--open` gate in the stylesheet) — unlike the
               chevron, which also shows on hover. */
            <button
              type="button"
              className="uxm-editable-cell__trigger-clear"
              // Out of the tab order, same as every in-field clear here.
              tabIndex={-1}
              // This button is a SIBLING of the Listbox trigger, so it sits
              // outside the refs `useDismiss` treats as "inside" — and dismiss
              // runs on mousedown, i.e. BEFORE this click. Left alone, pressing
              // ✕ would first dismiss the panel and only then clear. Stop the
              // mousedown here so the clear below is the single thing that acts.
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => void commitValue('')}
              aria-label={clearSelectionLabel}
            >
              <Icon glyph="close" size={12} />
            </button>
          )}
          <Popover
            open={Boolean(shownError)}
            onOpenChange={(next) => {
              if (!next) setError(null);
            }}
            anchor={wrapRef}
            placement="bottom-start"
            closeOnEscape={false}
            closeOnOutsideClick={false}
            restoreFocus={false}
            role="presentation"
          >
            {shownError && (
              <Banner
                variant={shownError.severity}
                id="uxm-editable-cell__error"
                className="uxm-editable-cell__error-banner"
              >
                {shownError.message}
              </Banner>
            )}
          </Popover>
        </span>
      );
    }

    // multiselect. A cell is a commit boundary, so this branch opts into
    // MultiListbox's staged mode (`commitMode="close"`: draft while open, one
    // commit on close) — a required cell then survives "clear all → pick one"
    // and N picks are one `onCommit`. It just hands over the committed
    // selection and commits the final array back.
    const selectedItems = Array.isArray(value)
      ? optionItems.filter((o) => value.includes(o.value))
      : [];

    return (
      <span
        ref={wrapRef}
        className={cn(
          'uxm-editable-cell',
          `uxm-editable-cell--${size}`,
          `uxm-editable-cell--align-${align}`,
          `uxm-editable-cell--type-${type}`,
          clearable && 'uxm-editable-cell--clearable',
          disabled && 'uxm-editable-cell--disabled',
          isEmpty && 'uxm-editable-cell--empty',
          open && 'uxm-editable-cell--open',
          className,
        )}
        style={style}
      >
        <MultiListbox<EditableCellOption>
          items={optionItems}
          getKey={getKey}
          getLabel={getLabel}
          value={selectedItems}
          onChange={(items) => void commitValue(items.map((o) => o.value))}
          // Commit on close, not per toggle — see the note above.
          commitMode="close"
          required={required}
          requiredMessage={requiredMessage}
          // MultiListbox owns the empty rule for multi (shared with every
          // picker); route its violation into this cell's error Banner.
          onRequiredViolation={(message) => setError({ message, severity: 'warning' })}
          disabled={disabled}
          searchable={searchable}
          matchAnchorWidth
          // Clear a stale required warning when the panel reopens for a fresh edit.
          onOpenChange={(next) => {
            setOpen(next);
            if (next) setError(null);
          }}
          renderTrigger={({ open: isOpen, triggerProps }: ListboxRenderTriggerState<EditableCellOption>) => (
            <button
              type="button"
              {...triggerProps}
              className={cn(
                'uxm-editable-cell__select-trigger',
                isOpen && 'uxm-editable-cell__select-trigger--open',
              )}
              aria-label={ariaLabel ?? `Edit ${String(value ?? '')}`}
            >
              <HoverTooltip content={titleText} disabled={disabled}>
                <span className="uxm-editable-cell__value uxm-editable-cell__option-label">
                  {display}
                </span>
              </HoverTooltip>
              <span className="uxm-editable-cell__chevron" aria-hidden="true">
                <Icon glyph="chevron-down" size={12} />
              </span>
            </button>
          )}
          renderItem={(o) => (
            <span className="uxm-editable-cell__option-label">{o.label}</span>
          )}
          footer={clearable ? ({ clear, selected }: { clear: () => void; selected: EditableCellOption[] }) =>
            selected.length > 0 ? (
              <ButtonGhost
                className="uxm-listbox__footer-clear-option"
                // `clear` (from MultiListbox) empties the draft and keeps the
                // panel open, so "clear all then pick one" works even on a
                // required cell — the empty state is transient and never
                // reaches `validate` / `onCommit`. `selected` is the live
                // draft, so the button hides itself once nothing is picked.
                onClick={clear}
              >
                <Icon glyph="close" size={12} />
                Clear all
              </ButtonGhost>
            ) : null
          : undefined}
        />
        {clearable && !disabled && !submitting && !isEmpty && (
          /* Trigger ✕ — clear from the field itself (the input-family
             convention), on every size: commits the empty value directly,
             complementing the panel-footer Clear. Sibling of the trigger (a
             button can't nest a button), absolutely positioned into the
             reserved second gutter slot. Revealed only while the panel is
             open (see the `--open` gate in the stylesheet) — unlike the
             chevron, which also shows on hover. */
          <button
            type="button"
            className="uxm-editable-cell__trigger-clear"
            // Out of the tab order, same as every in-field clear here.
            tabIndex={-1}
            // Same sibling-of-the-trigger problem as the select ✕ above, but
            // costlier here: `useDismiss` fires on mousedown, and this panel
            // runs `commitMode="close"`, so an unswallowed mousedown would
            // commit the STAGED DRAFT first and only then clear — two commits
            // for one press, and if the first is still in flight the
            // re-entrancy guard in `commitValue` drops the clear entirely.
            // Stopping it leaves the panel open, which is deliberate and
            // matches the footer's "Clear all": clear, then pick afresh.
            // MultiListbox re-seeds its draft from `value` under an open panel,
            // so the later close commits the cleared set, not the stale draft.
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => void commitValue([])}
            aria-label={clearSelectionLabel}
          >
            <Icon glyph="close" size={12} />
          </button>
        )}
        <Popover
          open={Boolean(shownError)}
          onOpenChange={(next) => {
            if (!next) setError(null);
          }}
          anchor={wrapRef}
          placement="bottom-start"
          closeOnEscape={false}
          closeOnOutsideClick={false}
          restoreFocus={false}
          role="presentation"
        >
          {shownError && (
            <Banner
              variant={shownError.severity}
              id="uxm-editable-cell__error"
              className="uxm-editable-cell__error-banner"
            >
              {shownError.message}
            </Banner>
          )}
        </Popover>
      </span>
    );
  }

  // Date type — click-to-edit like text/number, but the editing surface is a
  // DateInput-style masked field: type the date OR pick it from the calendar
  // that opens on focus. Committed values are ISO; the input shows the mask.
  if (type === 'date') {
    // `parsedValue` (memoized above) already parses ISO-first with a mask
    // fallback, so the calendar highlights the right day for every `dateFormat`.
    const calendarValue: CalendarValue = { start: parsedValue, end: parsedValue };
    const spec = FORMAT_SPEC[dateFormat];

    if (!editing) {
      const displayNode = isEmpty
        // Fall back to the format hint (MM/DD/YYYY etc.) so an empty date cell
        // shows the mask as a placeholder — same as the shared `display` and
        // the edit-mode input, rather than rendering blank.
        ? placeholder ?? dateHint
        : format
          ? format(value)
          : displayFormatted || value;

      // Single button root — same shape as the text/number display so the
      // value's left edge and padding match the editing input exactly (no
      // horizontal jump on enter-edit). A wrapper + inner trigger would
      // double the padding; the display has no popover to anchor, so the
      // wrapper span is only needed in edit mode (for the calendar/error
      // popovers).
      return (
        <button
          type="button"
          className={cn(
            'uxm-editable-cell',
            `uxm-editable-cell--${size}`,
            `uxm-editable-cell--align-${align}`,
            `uxm-editable-cell--type-date`,
            disabled && 'uxm-editable-cell--disabled',
            isEmpty && 'uxm-editable-cell--empty',
            className,
          )}
          style={style}
          onClick={() => {
            if (disabled) return;
            // Enter edit AND open the calendar in one deterministic step —
            // mirrors DateInput's "focus reveals the calendar". Opening here
            // (rather than on the input's onFocus) avoids the focus-after-
            // remount race: the display button and editing input are
            // different elements, so the auto-focus that mounts the input
            // doesn't reliably deliver a focus event the calendar can hook.
            setIsEditing(true);
            setOpen(true);
          }}
          disabled={disabled}
          // Empty cell has no value to edit — "Add date" reads better than the
          // trailing-space "Edit date " and signals the fill affordance.
          aria-label={ariaLabel ?? (isEmpty ? addDateLabel : `Edit date ${displayFormatted || String(value)}`)}
        >
          <HoverTooltip content={titleText} disabled={disabled}>
            <span className="uxm-editable-cell__value">{displayNode}</span>
          </HoverTooltip>
          {!disabled && (
            <span className="uxm-editable-cell__pencil" aria-hidden="true">
              <Icon glyph="calendar" size={14} />
            </span>
          )}
        </button>
      );
    }

    // Date editing — DateInput-style masked input plus a calendar popover.
    return (
      <span
        ref={wrapRef}
        className={cn(
          'uxm-editable-cell uxm-editable-cell--editing',
          `uxm-editable-cell--${size}`,
          `uxm-editable-cell--align-${align}`,
          `uxm-editable-cell--type-date`,
          clearable && 'uxm-editable-cell--clearable',
          shownError?.severity === 'error' && 'uxm-editable-cell--error',
          shownError?.severity === 'warning' && 'uxm-editable-cell--warning',
          className,
        )}
        style={style}
      >
        <span className="uxm-editable-cell__ghost" aria-hidden="true">
          {display}
        </span>
        <span className="uxm-editable-cell__ghost" aria-hidden="true">
          {draft || spec.placeholder}
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          className="uxm-editable-cell__input"
          value={draft}
          placeholder={spec.placeholder}
          onChange={(e) => {
            setDraft(maskDate(e.target.value, dateFormat));
            if (error) setError(null);
          }}
          onBlur={() => {
            if (!submitting) handleCommit();
          }}
          onKeyDown={handleKeyDown}
          disabled={submitting}
          aria-invalid={Boolean(shownError)}
          aria-describedby={shownError ? 'uxm-editable-cell__error' : undefined}
        />
        {/* ✕ sits inboard of the calendar toggle (mirrors DateInput's layout);
            hidden while the draft is empty — the reserved gutter stays, so
            typing never shifts the text. */}
        {clearable && !submitting && draft !== '' && (
          <button
            type="button"
            className="uxm-editable-cell__clear"
            // Out of the tab order (the in-field-clear convention). Tab must
            // keep moving to the next real control: the blur it fires commits
            // and leaves edit mode, which unmounts this button mid-focus-shift
            // and would drop focus to <body>. Pointer-only; select-all +
            // Delete is the keyboard path to the same result.
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClearDraft}
            aria-label={clearDateLabel}
          >
            <Icon glyph="close" size={12} />
          </button>
        )}
        <button
          type="button"
          className="uxm-editable-cell__date-icon"
          // Out of the tab order for the same reason as the ✕ above — Tab's
          // blur commits and unmounts this button. Keyboard users never need
          // it: entering edit mode on a date cell already opens the calendar.
          tabIndex={-1}
          // preventDefault keeps focus on the input — toggling the calendar
          // must not blur the field (a blur commits the in-flight draft).
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (submitting) return;
            // Clear any shown error as we open, so the calendar and the error
            // banner (both anchored here) are mutually exclusive — otherwise a
            // later `setError(null)` from typing would un-hide and reopen the
            // calendar the user had dismissed.
            setError(null);
            setOpen((o) => !o);
          }}
          disabled={submitting}
          aria-label={openCalendarLabel}
          // Match the popover's effective visibility (hidden while an error
          // shows) rather than raw `open`, so the two never disagree.
          aria-expanded={open && !shownError}
        >
          <Icon glyph="calendar" size={14} />
        </button>
        <Popover
          open={open && !shownError}
          onOpenChange={setOpen}
          anchor={wrapRef}
          placement="bottom-start"
          closeOnEscape
          closeOnOutsideClick
          restoreFocus={false}
          role="dialog"
          // A `role="dialog"` needs an accessible name. Non-modal by design
          // (no `aria-modal`): focus deliberately stays in the typed input
          // — `restoreFocus={false}` and the mousedown-preventDefault above
          // keep the field focused so the calendar augments typing rather
          // than trapping focus like a true modal.
          aria-label={calendarDialogLabel}
        >
          {/* Swallow mousedown so a calendar click never blurs the input:
              the pick commits explicitly via handlePick, and a blur-commit of
              the typed draft would race it. Purely focus management — the
              wrapper carries no semantics, so it stays a plain element. */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- focus-retention only; the interactive controls are the Calendar's own buttons */}
          <div onMouseDown={(e) => e.preventDefault()}>
            <Calendar value={calendarValue} onChange={handlePick} />
          </div>
        </Popover>
        <Popover
          open={Boolean(shownError)}
          onOpenChange={(next) => {
            if (!next) setError(null);
          }}
          anchor={wrapRef}
          placement="bottom-start"
          closeOnEscape={false}
          closeOnOutsideClick={false}
          restoreFocus={false}
          role="presentation"
        >
          {shownError && (
            <Banner
              variant={shownError.severity}
              id="uxm-editable-cell__error"
              className="uxm-editable-cell__error-banner"
            >
              {shownError.message}
            </Banner>
          )}
        </Popover>
      </span>
    );
  }

  // Text / number types
  if (!editing) {
    return (
      <button
        type="button"
        className={cn(
          'uxm-editable-cell',
          `uxm-editable-cell--${size}`,
          `uxm-editable-cell--align-${align}`,
          disabled && 'uxm-editable-cell--disabled',
          isEmpty && 'uxm-editable-cell--empty',
          className,
        )}
        style={style}
        onClick={() => {
          if (!disabled) setIsEditing(true);
        }}
        disabled={disabled}
        aria-label={ariaLabel ?? `Edit ${String(value ?? '')}`}
      >
        {/* The value needs its own element for ellipsis — text-overflow
            doesn't apply to a flex container's anonymous text. Values wider
            than the cell's max-width truncate instead of growing the column
            unboundedly; the hidden text surfaces in a hover tooltip (only
            when actually clipped) and stays editable by entering edit mode. */}
        <HoverTooltip content={titleText} disabled={disabled}>
          <span className="uxm-editable-cell__value">{display}</span>
        </HoverTooltip>
        {/* Hover affordance — a pencil glyph fades in on hover / keyboard
            focus. The background tint alone can't signal editability inside
            a DataTable, where the row's own hover tint coincides with it.
            Absolute overlay in a reserved gutter (see editable-cell.scss) so
            it never shifts or collides with the value. Hidden when disabled. */}
        {!disabled && (
          <span className="uxm-editable-cell__pencil" aria-hidden="true">
            <Icon glyph="pencil" size={16} strokeWidth={1.75} />
          </span>
        )}
      </button>
    );
  }

  return (
    <span
      ref={wrapRef}
      className={cn(
        'uxm-editable-cell uxm-editable-cell--editing',
        `uxm-editable-cell--${size}`,
        `uxm-editable-cell--align-${align}`,
        clearable && 'uxm-editable-cell--clearable',
        shownError?.severity === 'error' && 'uxm-editable-cell--error',
        shownError?.severity === 'warning' && 'uxm-editable-cell--warning',
        className,
      )}
      style={style}
    >
      {/* Invisible width-keepers, stacked in the same grid cell as the
          input. The display content ghost preserves the exact min-content
          width this cell contributed before entering edit mode — without
          it, editing the column's WIDEST row would drop its contribution
          from auto table-column sizing and the column would visibly
          shrink. The draft ghost grows the cell naturally as the user
          types past the original width. */}
      <span className="uxm-editable-cell__ghost" aria-hidden="true">
        {display}
      </span>
      <span className="uxm-editable-cell__ghost" aria-hidden="true">
        {draft}
      </span>
      <input
        ref={inputRef}
        // `type="text"` + `inputMode` — the input-family convention (see
        // NumberInput): native number inputs ship browser spinner UI, trigger
        // autofill, and disagree across browsers on accepted characters.
        // `maskNumeric` replaces the native filtering per keystroke (same as
        // the date editor's `maskDate`); without it, `Number()`'s loose
        // coercion would let e.g. "0x1A" commit as 26.
        type="text"
        inputMode={type === 'number' ? 'decimal' : undefined}
        autoComplete="off"
        className="uxm-editable-cell__input"
        value={draft}
        onChange={(e) => {
          setDraft(
            type === 'number'
              ? maskNumeric(e.target.value, true, true, Number.POSITIVE_INFINITY)
              : e.target.value,
          );
          // Clear stale validation error as the user types — they'll
          // see a new one on the next commit attempt if it still fails.
          if (error) setError(null);
        }}
        onBlur={() => {
          // Don't double-commit while a previous commit is still pending.
          if (!submitting) handleCommit();
        }}
        onKeyDown={handleKeyDown}
        disabled={submitting}
        placeholder={placeholder}
        aria-invalid={Boolean(shownError)}
        aria-describedby={shownError ? 'uxm-editable-cell__error' : undefined}
      />
      {/* One-click ✕ (mirrors TextInput/NumberInput): empties the draft and
          keeps focus; hidden while the draft is already empty. The gutter is
          reserved via `--clearable` so its appearance never shifts text. */}
      {clearable && !submitting && draft !== '' && (
        <button
          type="button"
          className="uxm-editable-cell__clear"
          // Out of the tab order — see the date branch's note: the blur Tab
          // fires commits and unmounts this button, so leaving it focusable
          // would strand focus on a removed node instead of advancing to the
          // next cell.
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClearDraft}
          aria-label={clearValueLabel}
        >
          <Icon glyph="close" size={12} />
        </button>
      )}
      {/* Problems hang under the cell in a portal'd popover so the table
          row never changes height. The popover must not manage focus —
          the input keeps it for in-place correction / retry. Escape and
          outside clicks already have edit-mode semantics (cancel / blur-
          commit), so the popover's own close triggers are disabled; it
          opens and closes purely with the error state. */}
      <Popover
        open={Boolean(shownError)}
        onOpenChange={(next) => {
          if (!next) setError(null);
        }}
        anchor={wrapRef}
        placement="bottom-start"
        closeOnEscape={false}
        closeOnOutsideClick={false}
        restoreFocus={false}
        role="presentation"
      >
        {shownError && (
          <Banner
            variant={shownError.severity}
            id="uxm-editable-cell__error"
            className="uxm-editable-cell__error-banner"
          >
            {shownError.message}
          </Banner>
        )}
      </Popover>
    </span>
  );
}
