'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

import { cn } from '@/helpers';

import { Banner } from '../banner';
import { Icon } from '../icon';
import { Popover } from '../popover';

export type EditableCellType = 'text' | 'number';
export type EditableCellAlign = 'left' | 'right' | 'center';

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
  value: string | number;
  /**
   * Called when the user commits the change (Enter, or blur with no
   * validation error). The promise's settlement controls error display:
   * resolve → exit edit mode, reject → stay in edit mode with the error
   * surfaced inline so the user can correct.
   */
  onCommit: (next: string | number) => void | Promise<void>;
  /** Editor type. Text uses a string input; number coerces to Number on commit. Defaults to "text". */
  type?: EditableCellType;
  /** Text alignment — pass through from a DataTable column's `align` so the editing input matches the display alignment. */
  align?: EditableCellAlign;
  /** Display-mode formatter. Receives the raw value, returns the React node to render in display mode. */
  format?: (value: string | number) => ReactNode;
  /** Synchronous validation. Return an error message to block commit; return null/undefined to accept. */
  validate?: (next: string | number) => string | null | undefined;
  /** Read-only — clicking does nothing, no edit affordance. */
  disabled?: boolean;
  /** Shown when value is empty/blank. */
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
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
  align = 'left',
  format,
  validate,
  disabled,
  placeholder,
  className,
  style,
  'aria-label': ariaLabel,
  forceMode,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string>(String(value ?? ''));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<CellError | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Anchor for the error popover — the editing wrapper, so the banner hangs
  // under the cell without affecting the table row's layout.
  const wrapRef = useRef<HTMLSpanElement | null>(null);

  // When the externally-committed value changes (parent state updated, or
  // someone else edited the row), sync the draft — but only when we're
  // NOT mid-edit. Mid-edit syncs would clobber what the user is typing.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional external-value → draft sync, gated to non-editing mode
    if (!isEditing) setDraft(String(value ?? ''));
  }, [value, isEditing]);

  // Focus + select-all when entering edit mode. Select-all means typing
  // immediately replaces the value — the most common edit intent — while
  // keyboard navigation (Home/End/arrows) still works to refine.
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const parseDraft = useCallback((): string | number => {
    return type === 'number' ? Number(draft) : draft;
  }, [type, draft]);

  const handleCommit = useCallback(async () => {
    const next = parseDraft();

    // Number type with a NaN draft (empty / non-numeric) is rejected at
    // the parse boundary — surface the same error the input gives the
    // user. This catches blur-with-empty before reaching onCommit.
    // Warning severity: the input is the problem and the user can fix it.
    if (type === 'number' && Number.isNaN(next)) {
      setError({ message: 'Enter a number', severity: 'warning' });
      return;
    }

    const validationError = validate?.(next);
    if (validationError) {
      setError({ message: validationError, severity: 'warning' });
      return;
    }

    // No-op when value didn't change — exit edit mode without firing
    // the consumer's handler (avoids spurious "save" calls on blur).
    if (next === value) {
      setIsEditing(false);
      setError(null);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onCommit(next);
      setIsEditing(false);
    } catch (err) {
      // Error severity: the value was acceptable but saving failed.
      setError({
        message: err instanceof Error ? err.message : 'Failed to save',
        severity: 'error',
      });
      // Refocus the input so the user can retry without re-entering edit mode.
      requestAnimationFrame(() => inputRef.current?.focus());
    } finally {
      setSubmitting(false);
    }
  }, [parseDraft, validate, type, value, onCommit]);

  const handleCancel = useCallback(() => {
    setDraft(String(value ?? ''));
    setIsEditing(false);
    setError(null);
  }, [value]);

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
      ? error ?? { message: 'Failed to save', severity: 'error' }
      : forceMode === 'warning'
        ? error ?? { message: 'Enter a valid value', severity: 'warning' }
        : error;

  const isEmpty = value === '' || value === null || value === undefined;
  const display = isEmpty
    ? placeholder ?? ''
    : format
      ? format(value)
      : value;

  if (!editing) {
    return (
      <button
        type="button"
        className={cn(
          'uxm-editable-cell',
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
            unboundedly; the full value is reachable by entering edit mode. */}
        <span className="uxm-editable-cell__value">{display}</span>
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
        `uxm-editable-cell--align-${align}`,
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
        type={type === 'number' ? 'number' : 'text'}
        className="uxm-editable-cell__input"
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
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
