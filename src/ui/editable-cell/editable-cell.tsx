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
import { ButtonGhost } from '../button';
import { Calendar, type CalendarValue } from '../calendar';
import {
  FORMAT_SPEC,
  formatDate as formatDateAs,
  maskDate,
  parseDate as parseFormattedDate,
  type DateInputFormat,
} from '../date-input';
import { HoverTooltip } from '../hover-tooltip';
import { Icon } from '../icon';
import { Listbox, MultiListbox, type ListboxRenderTriggerState } from '../listbox';
import { Popover } from '../popover';

export type EditableCellType = 'text' | 'number' | 'date' | 'select' | 'multiselect';
export type EditableCellAlign = 'left' | 'right' | 'center';
export type EditableCellValue = string | number | string[];

/** Strict `YYYY-MM-DD` → local Date (no TZ surprises), null if not parseable. */
function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

function toISODate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
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
  /** Editor type. Text uses a string input; number coerces to Number on commit. Defaults to "text". */
  type?: EditableCellType;
  /** Date format — only used when `type="date"`. Defaults to `"mdy"`. */
  dateFormat?: DateInputFormat;
  /** Options — required for `type="select"` and `type="multiselect"`. */
  options?: EditableCellOption[];
  /** Whether the select panel includes a search box. Passed to the internal Listbox. */
  searchable?: boolean | 'auto';
  /** Whether the select panel allows clearing the selection. */
  clearable?: boolean;
  /** Text alignment — pass through from a DataTable column's `align` so the editing input matches the display alignment. */
  align?: EditableCellAlign;
  /** Display-mode formatter. Receives the raw value, returns the React node to render in display mode. */
  format?: (value: EditableCellValue) => ReactNode;
  /** Synchronous validation. Return an error message to block commit; return null/undefined to accept. */
  validate?: (next: EditableCellValue) => string | null | undefined;
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
  dateFormat = 'ymd',
  options,
  searchable,
  clearable,
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
  const [draft, setDraft] = useState<string>(() => {
    if (type === 'date') {
      if (typeof value === 'string' && value) {
        // If the value is already a formatted date string, use as-is.
        return value;
      }
      return '';
    }
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
  const triggerRef = useRef<HTMLElement | null>(null);

  // When the externally-committed value changes (parent state updated, or
  // someone else edited the row), sync the draft — but only when we're
  // NOT mid-edit. Mid-edit syncs would clobber what the user is typing.
  useEffect(() => {
    if (!isEditing) {
      const next = Array.isArray(value)
        ? ''
        : type === 'date' && typeof value === 'string'
          ? value
          : String(value ?? '');
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional external-value → draft sync, gated to non-editing mode
      setDraft(next);
    }
  }, [value, isEditing, type]);

  // Focus + select-all when entering edit mode. Select-all means typing
  // immediately replaces the value — the most common edit intent — while
  // keyboard navigation (Home/End/arrows) still works to refine.
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const parseDraft = useCallback((): EditableCellValue => {
    if (type === 'number') return Number(draft);
    if (type === 'date') return draft;
    return draft;
  }, [type, draft]);

  const commitValue = useCallback(
    async (next: EditableCellValue): Promise<boolean> => {
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
          message: err instanceof Error ? err.message : 'Failed to save',
          severity: 'error',
        });
        // Refocus the input so the user can retry without re-entering edit mode.
        requestAnimationFrame(() => inputRef.current?.focus());
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [validate, onCommit],
  );

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

    // Typed dates parse at the boundary too: per the cell's `dateFormat`
    // mask first, with canonical ISO always accepted. Whatever parses is
    // committed normalized to ISO. An emptied draft clears the date
    // (commits "") — same semantics as the text type, not a validation
    // failure; pass `validate` to make the date required.
    if (type === 'date') {
      const raw = String(next).trim();
      if (raw === '') {
        await commitValue('');
        return;
      }
      const parsed = parseFormattedDate(raw, dateFormat) ?? parseISODate(raw);
      if (!parsed) {
        setError({
          message: `Enter a valid date (${FORMAT_SPEC[dateFormat].placeholder})`,
          severity: 'warning',
        });
        return;
      }
      await commitValue(toISODate(parsed));
      return;
    }

    // No-op when value didn't change — exit edit mode without firing
    // the consumer's handler (avoids spurious "save" calls on blur).
    const valueStr = Array.isArray(value) ? '' : String(value ?? '');
    if (String(next) === valueStr) {
      setIsEditing(false);
      setError(null);
      return;
    }

    await commitValue(next);
  }, [parseDraft, type, dateFormat, value, commitValue]);

  const handleMultiChange = useCallback(
    async (items: EditableCellOption[]) => {
      const next = items.map((o) => o.value);
      await commitValue(next);
    },
    [commitValue],
  );

  const handlePick = useCallback(
    async (calValue: CalendarValue) => {
      if (!calValue.start) return;
      setDraft(formatDateAs(calValue.start, dateFormat));
      await commitValue(toISODate(calValue.start));
    },
    [dateFormat, commitValue],
  );

  const handleCancel = useCallback(() => {
    if (Array.isArray(value)) {
      setDraft('');
    } else if (type === 'date') {
      setDraft(typeof value === 'string' ? value : '');
    } else {
      setDraft(String(value ?? ''));
    }
    setIsEditing(false);
    setOpen(false);
    setError(null);
  }, [value, type]);

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

  // Hint shown in the date input — the canonical format pattern for the
  // chosen `dateFormat`. Used as the placeholder when the cell is empty
  // and as the input placeholder in edit mode.
  const dateHint = FORMAT_SPEC[dateFormat].placeholder;

  // Compute display value
  const isEmpty = Array.isArray(value)
    ? value.length === 0
    : value === '' || value === null || value === undefined;

  const display = (() => {
    if (format) return format(value);
    if (Array.isArray(value)) {
      if (value.length === 0) return placeholder ?? '';
      // For multiselect: show labels from options if available
      if (options) {
        return value
          .map((v) => options.find((o) => o.value === v)?.label ?? v)
          .join(', ');
      }
      return value.join(', ');
    }
    if (isEmpty) return placeholder ?? (type === 'date' ? dateHint : '');
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
          ? String(value)
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
            `uxm-editable-cell--align-${align}`,
            `uxm-editable-cell--type-${type}`,
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
                ref={(el) => {
                  triggerRef.current = el;
                  const refProp = triggerProps.ref as (el: HTMLElement | null) => void;
                  refProp(el);
                }}
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
                className="uxm-editable-cell__clear-option"
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

    // multiselect
    const selectedItems = Array.isArray(value)
      ? optionItems.filter((o) => value.includes(o.value))
      : [];

    return (
      <span
        ref={wrapRef}
        className={cn(
          'uxm-editable-cell',
          `uxm-editable-cell--align-${align}`,
          `uxm-editable-cell--type-${type}`,
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
          onChange={handleMultiChange}
          disabled={disabled}
          searchable={searchable}
          matchAnchorWidth
          onOpenChange={setOpen}
          renderTrigger={({ open: isOpen, triggerProps }: ListboxRenderTriggerState<EditableCellOption>) => (
            <button
              type="button"
              {...triggerProps}
              ref={(el) => {
                triggerRef.current = el;
                const refProp = triggerProps.ref as (el: HTMLElement | null) => void;
                refProp(el);
              }}
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
        />
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

  // Date type — display with calendar popover
  if (type === 'date') {
    const parsedDate = typeof value === 'string' && value
      ? parseFormattedDate(value, dateFormat)
      : null;
    const calendarValue: CalendarValue = { start: parsedDate, end: parsedDate };
    const spec = FORMAT_SPEC[dateFormat];

    if (!editing) {
      const displayNode = isEmpty
        ? placeholder ?? ''
        : format
          ? format(value)
          : value;

      return (
        <span
          ref={wrapRef}
          className={cn(
            'uxm-editable-cell',
            `uxm-editable-cell--align-${align}`,
            `uxm-editable-cell--type-date`,
            disabled && 'uxm-editable-cell--disabled',
            isEmpty && 'uxm-editable-cell--empty',
            open && 'uxm-editable-cell--open',
            className,
          )}
          style={style}
        >
          <button
            type="button"
            className="uxm-editable-cell__date-trigger"
            onClick={() => {
              if (!disabled) setOpen((o) => !o);
            }}
            disabled={disabled}
            aria-label={ariaLabel ?? `Edit date ${String(value ?? '')}`}
            aria-expanded={open}
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
          <Popover
            open={open}
            onOpenChange={setOpen}
            anchor={wrapRef}
            placement="bottom-start"
            closeOnEscape
            closeOnOutsideClick
            restoreFocus={false}
            role="dialog"
          >
            <Calendar
              value={calendarValue}
              onChange={handlePick}
            />
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

    // Date editing — text input with mask
    return (
      <span
        ref={wrapRef}
        className={cn(
          'uxm-editable-cell uxm-editable-cell--editing',
          `uxm-editable-cell--align-${align}`,
          `uxm-editable-cell--type-date`,
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
        // `type="text"` + `inputMode` — the input-family convention (see
        // NumberInput): native number inputs ship browser spinner UI, trigger
        // autofill, and disagree across browsers on accepted characters. The
        // NaN parse boundary in handleCommit already guards number commits.
        type="text"
        inputMode={type === 'number' ? 'decimal' : undefined}
        autoComplete="off"
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
