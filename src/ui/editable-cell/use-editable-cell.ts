import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FORMAT_SPEC, formatDate as formatDateAs, invalidDateMessage, parseDate as parseFormattedDate } from '../date-input';

import { isEmptyValue, isoToFormatted, parseISODate, toISODate } from './editable-cell-utils';

import type { CalendarValue } from '../calendar';
import type { CellError, EditableCellProps, EditableCellValue } from './editable-cell.types';

/** Keys `EditableCell` defaults before handing the props to the hook and the views. */
export type EditableCellDefaultedKey = 'type' | 'dateFormat' | 'searchable' | 'clearable' | 'align' | 'size' | 'required' | 'saveErrorMessage' | 'invalidNumberMessage' | 'invalidValueMessage' | 'clearSelectionLabel' | 'clearDateLabel' | 'clearValueLabel' | 'openCalendarLabel' | 'calendarDialogLabel' | 'addDateLabel';

/** `EditableCellProps` with every default applied — what the hook and the views see. */
export type EditableCellResolvedProps = Omit<EditableCellProps, EditableCellDefaultedKey> &
  Required<Pick<EditableCellProps, EditableCellDefaultedKey>>;

export interface EditableCellViewProps {
  props: EditableCellResolvedProps;
  cell: EditableCellState;
}

export type EditableCellState = ReturnType<typeof useEditableCell>;

/**
 * All of EditableCell's state, effects, commit paths and derived display
 * values — everything that is NOT per-type JSX. The three views
 * (`editable-cell-{text,date,select}.tsx`) are hook-free and read this
 * object, so the hook order is fixed here regardless of which view renders.
 */
export function useEditableCell(props: EditableCellResolvedProps) {
  const {
    value,
    onCommit,
    options,
    format,
    validate,
    requiredMessage,
    placeholder,
    forceMode,
    invalidDateMessage: invalidDateMessageProp,
    type,
    dateFormat,
    required,
    saveErrorMessage,
    invalidNumberMessage,
    invalidValueMessage,
  } = props;
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

  return {
    isEditing,
    setIsEditing,
    draft,
    setDraft,
    submitting,
    setSubmitting,
    error,
    setError,
    open,
    setOpen,
    inputRef,
    wrapRef,
    parsedValue,
    displayFormatted,
    parseDraft,
    commitValue,
    commitDate,
    handleCommit,
    handlePick,
    handleClearDraft,
    handleCancel,
    handleKeyDown,
    editing,
    dateHint,
    isEmpty,
    display,
    isMulti,
    isSelect,
    isDate,
    titleText,
    shownError,
  };
}
