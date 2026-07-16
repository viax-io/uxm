import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { cn } from '@/helpers';

import { useFocusOnMount } from '../../hooks/use-focus-on-mount';
import { Calendar, type CalendarValue } from '../calendar';
import { FieldError } from '../field-error';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';

import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from 'react';

export type DateInputFormat = 'mdy' | 'dmy' | 'ymd';
export type DateInputMode = 'single' | 'range';

const RANGE_SEPARATOR = ' – ';

export interface DateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'type' | 'style'> {
  /** Format mask. Drives placeholder, the digit-segment layout, and Calendar ↔ input parsing. */
  format?: DateInputFormat;
  /**
   * Selection mode. `single` picks one date and closes after one click; `range`
   * keeps the popover open after the first click and shows both dates joined by
   * `" – "` once the second click commits the end. Range mode makes the input
   * read-only — the `"MM/DD/YYYY – MM/DD/YYYY"` shape isn't practical to type.
   */
  mode?: DateInputMode;
  /** Formatted string value (controlled). In range mode use `"start – end"`. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the masked, formatted value after each keystroke or calendar pick. */
  onChange?: (formatted: string) => void;
  /**
   * Render the calendar icon button and enable the click-to-open popover.
   * Defaults to true. Pass false for a typing-only date field (no icon, no popover).
   */
  calendar?: boolean;
  /**
   * Show a clear (✕) button when the field has a value. On by default (opt out
   * with `clearable={false}`). The ✕ sits just left of the calendar icon (or
   * at the trailing edge when `calendar={false}`). The component owns the reset
   * — it wipes its own uncontrolled state and fires `onChange("")` — so no
   * separate `onClear` is needed. Works in both single and range mode.
   */
  clearable?: boolean;
  /**
   * Inline style applied to the WRAPPER (not the inner <input>). CSS custom
   * properties set here cascade to every descendant — the input AND the
   * popover (a sibling of the input) — so theming knobs reach all parts.
   */
  style?: React.CSSProperties;
  /**
   * When set to a non-empty string, the field renders in its error state:
   * red border (`.uxm-date-input--error`), `aria-invalid` on the input,
   * and the message rendered below the field. Omit (or pass an empty
   * string) for the normal state.
   */
  error?: string;
}

export const FORMAT_SPEC: Record<DateInputFormat, { segments: number[]; sep: string; placeholder: string }> = {
  mdy: { segments: [2, 2, 4], sep: '/', placeholder: 'MM/DD/YYYY' },
  dmy: { segments: [2, 2, 4], sep: '/', placeholder: 'DD/MM/YYYY' },
  ymd: { segments: [4, 2, 2], sep: '-', placeholder: 'YYYY-MM-DD' },
};

/** Auto-format raw input per the chosen format. Strips non-digits, caps at the format's total digit count, inserts separators. */
export function maskDate(raw: string, format: DateInputFormat): string {
  const spec = FORMAT_SPEC[format];
  const maxDigits = spec.segments.reduce((sum, n) => sum + n, 0);
  const digits = raw.replace(/\D/g, '').slice(0, maxDigits);
  let out = '';
  let consumed = 0;
  for (let i = 0; i < spec.segments.length; i++) {
    const segDigits = digits.slice(consumed, consumed + spec.segments[i]);
    if (!segDigits) break;
    if (i > 0) out += spec.sep;
    out += segDigits;
    consumed += spec.segments[i];
  }
  return out;
}

/**
 * Parse a formatted date string back to a Date so the Calendar can highlight
 * it. Returns null until enough digits are typed for a complete date AND the
 * date is real — a round-trip check rejects impossible dates like Feb 30 or
 * Apr 31, which JS `Date` would otherwise silently roll into the next month.
 * A non-null result is therefore always the exact date the digits spell.
 */
export function parseDate(formatted: string, format: DateInputFormat): Date | null {
  const digits = formatted.replace(/\D/g, '');
  if (digits.length !== 8) return null;
  let y: number, m: number, d: number;
  if (format === 'ymd') {
    y = Number(digits.slice(0, 4));
    m = Number(digits.slice(4, 6));
    d = Number(digits.slice(6, 8));
  } else if (format === 'mdy') {
    m = Number(digits.slice(0, 2));
    d = Number(digits.slice(2, 4));
    y = Number(digits.slice(4, 8));
  } else {
    d = Number(digits.slice(0, 2));
    m = Number(digits.slice(2, 4));
    y = Number(digits.slice(4, 8));
  }
  if (!m || !d || !y || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(y, m - 1, d);
  // Round-trip guard: `new Date(2024, 1, 30)` silently rolls Feb 30 over to
  // Mar 1 rather than failing. Require the constructed date to spell back the
  // exact digits so callers can trust a non-null result is a real date.
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }
  return date;
}

/** Format a Date back into the chosen mask. Inverse of `parseDate`. */
export function formatDate(date: Date, format: DateInputFormat): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const y = String(date.getFullYear()).padStart(4, '0');
  switch (format) {
    case 'mdy': return `${m}/${d}/${y}`;
    case 'dmy': return `${d}/${m}/${y}`;
    case 'ymd': return `${y}-${m}-${d}`;
  }
}

/** Range-aware value formatter: `"<start>"` or `"<start> – <end>"`. */
function formatRangeValue(value: CalendarValue, format: DateInputFormat): string {
  if (!value.start) return '';
  const startStr = formatDate(value.start, format);
  if (!value.end) return startStr;
  return `${startStr}${RANGE_SEPARATOR}${formatDate(value.end, format)}`;
}

/** Range-aware value parser. Splits on ` – ` and parses each half independently. */
function parseRangeValue(formatted: string, format: DateInputFormat): CalendarValue {
  const parts = formatted.split(RANGE_SEPARATOR);
  return {
    start: parts[0] ? parseDate(parts[0], format) : null,
    end: parts[1] ? parseDate(parts[1], format) : null,
  };
}

/** Build a placeholder that doubles up the mask for range mode. */
function placeholderFor(format: DateInputFormat, mode: DateInputMode): string {
  const single = FORMAT_SPEC[format].placeholder;
  return mode === 'range' ? `${single}${RANGE_SEPARATOR}${single}` : single;
}

/**
 * Inline-validation message for an unparseable date, naming the expected mask.
 * Shared with EditableCell's date field so both surface the identical wording.
 */
export function invalidDateMessage(format: DateInputFormat): string {
  return `Enter a valid date (${FORMAT_SPEC[format].placeholder})`;
}

export function DateInput({
  format = 'mdy',
  mode = 'single',
  className,
  placeholder,
  value,
  defaultValue,
  onChange,
  calendar = true,
  clearable = true,
  style,
  onFocus,
  onBlur,
  disabled,
  error,
  'aria-describedby': ariaDescribedBy,
  ...rest
}: DateInputProps) {
  // Initial state — same masker for single, plain string for range (typing
  // disabled in range mode so no need to mask).
  const [internal, setInternal] = useState<string>(() =>
    mode === 'single' ? maskDate(defaultValue ?? '', format) : defaultValue ?? '',
  );
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const [isOpen, setIsOpen] = useState(false);
  // Inline validity: flipped true on blur when the typed value is non-empty
  // but doesn't resolve to a real date (out-of-range like 06/36, or impossible
  // like Feb 30). Cleared the moment the user edits again and re-checked on the
  // next blur — mirrors EditableCell's date field so the two behave the same.
  const [invalid, setInvalid] = useState(false);
  const errorId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mode OR format switch resets the internal value — a range string is
  // invalid input in single mode (and vice versa), and an existing digit
  // string would otherwise be mis-parsed under a new format's segment
  // boundaries (e.g. "mdy" digits re-sliced as "ymd"). Also close the
  // popover so the user starts a fresh pick under the new mode/format.
  // Only touches uncontrolled state; if the consumer is driving `value`
  // they own the reset themselves.
  //
  // The ref guard skips the FIRST run of this effect so the `useState`
  // initializer (which masks `defaultValue`) doesn't get clobbered on mount.
  // Without the guard, `<DateInput defaultValue="01/01/2020" />` renders
  // empty because the effect fires once at mount and overwrites the
  // masked initial value with "".
  const isFirstModeEffect = useRef(true);
  useEffect(() => {
    if (isFirstModeEffect.current) {
      isFirstModeEffect.current = false;
      return;
    }
    setInternal('');
    setIsOpen(false);
    setInvalid(false);
  }, [mode, format]);

  // Close on click outside or Escape. Mounting only when `isOpen` is true
  // keeps the global listeners off when the popover is closed.
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  // No focus restoration on close: the field opens the popover on input
  // `onFocus`, so restoring focus to the input after an outside-click close
  // would immediately re-fire `onFocus` and reopen the popover — the same
  // reopen loop TimeInput opts out of. Dismissal paths (outside click on
  // another surface, Escape while the input keeps focus) don't strand focus
  // on the removed panel because the panel itself never takes focus.
  useFocusOnMount({ active: isOpen, returnFocus: false });

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // Range mode is read-only; this guard prevents any sneaky programmatic edits.
      if (mode === 'range') return;
      const formatted = maskDate(e.target.value, format);
      if (!isControlled) setInternal(formatted);
      // Stop showing the error as soon as the user starts fixing the value;
      // it's re-evaluated on the next blur. (No-op re-render when already false.)
      setInvalid(false);
      onChange?.(formatted);
    },
    [mode, isControlled, onChange, format],
  );

  const handleCalendarChange = useCallback(
    (calValue: CalendarValue) => {
      if (!calValue.start) return;
      // A calendar pick is always a real date — clear any lingering typed-error.
      setInvalid(false);
      if (mode === 'range') {
        // Calendar fires after every click: end=null after first, end set after second.
        // Update the input either way (so the user sees the in-flight start) but only
        // close when the range is fully committed.
        const formatted = formatRangeValue(calValue, format);
        if (!isControlled) setInternal(formatted);
        onChange?.(formatted);
        if (calValue.end) setIsOpen(false);
      } else {
        // Single mode — first click commits and closes.
        const formatted = formatDate(calValue.start, format);
        if (!isControlled) setInternal(formatted);
        onChange?.(formatted);
        setIsOpen(false);
      }
    },
    [mode, isControlled, onChange, format],
  );

  // Clear owns its own reset: wipe the value in both single and range mode
  // and notify via onChange(""). Mirrors NumberInput / CurrencyInput — the
  // component holds its own state, so no onClear prop is needed.
  const handleClear = useCallback(() => {
    if (!isControlled) setInternal('');
    setInvalid(false);
    onChange?.('');
  }, [isControlled, onChange]);
  const showClear = clearable && (current ?? '').length > 0 && !disabled;

  // Validate when focus leaves the field. Empty is always fine; a non-empty
  // value that doesn't parse to a real date flips into the error state. Range
  // mode is read-only (filled only via the calendar, which never yields an
  // impossible date), so it never validates here. Chains the consumer's own
  // `onBlur` afterward so wiring it up stays possible.
  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      if (mode !== 'range') {
        const v = current ?? '';
        setInvalid(v !== '' && parseDate(v, format) === null);
      }
      onBlur?.(e);
    },
    [mode, current, format, onBlur],
  );

  // Mirror the input's current value into the Calendar so it highlights what
  // the user has selected. Range mode parses two halves; single mode parses one.
  // In single mode we set `end = start` (same-day "range") so Calendar's click
  // logic sees a *committed* selection, not an in-flight first-click. Otherwise
  // the next click would be treated as the second click of a range — exactly
  // the bug where switching back to single still drew range styling.
  const calendarValue: CalendarValue = (() => {
    if (mode === 'range') return parseRangeValue(current ?? '', format);
    const date = parseDate(current ?? '', format);
    return { start: date, end: date };
  })();

  // A consumer-supplied `error` wins; otherwise surface the internal
  // invalid-date message. Both drive the same visual: red border,
  // `aria-invalid`, and the message below the field.
  const shownError = error || (invalid ? invalidDateMessage(format) : undefined);

  return (
    <>
    <div
      className={cn(
        'uxm-date-input',
        calendar && 'uxm-date-input--has-calendar',
        clearable && 'uxm-date-input--clearable',
        shownError && 'uxm-date-input--error',
        className,
      )}
      ref={containerRef}
      style={style}
    >
      <input
        // `{...rest}` is spread FIRST so the managed props below always win —
        // notably `aria-describedby`, which must stay linked to our error
        // message and not be clobbered by a caller-supplied value.
        {...rest}
        type="text"
        inputMode="numeric"
        readOnly={mode === 'range'}
        className="uxm-date-input__input"
        placeholder={placeholder ?? placeholderFor(format, mode)}
        value={current}
        onChange={handleInputChange}
        onFocus={(e) => {
          if (calendar) setIsOpen(true);
          onFocus?.(e);
        }}
        onBlur={handleBlur}
        aria-invalid={shownError ? true : undefined}
        // Point at our error message while one shows AND keep any
        // caller-supplied `aria-describedby` (e.g. unrelated help text) —
        // both ids are announced, ours never clobbers theirs.
        aria-describedby={[shownError && errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined}
        disabled={disabled}
      />
      {showClear && (
        <IconButton
          className="uxm-field-clear uxm-date-input__clear"
          aria-label="Clear"
          // Prevent the button from stealing focus away from whatever's
          // currently focused — clearing must not re-open the calendar
          // popover via the input's onFocus handler.
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClear}
        >
          <Icon glyph="close" />
        </IconButton>
      )}
      {calendar && (
        <button
          type="button"
          className="uxm-date-input__icon"
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Open calendar"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <Icon glyph="calendar" />
        </button>
      )}
      {calendar && isOpen && (
        <div className="uxm-date-input__popover" role="dialog" aria-label="Choose date">
          {/* Swallow mousedown so a calendar click never blurs the input: blur
              now runs validation (handleBlur), and a partially-typed value
              would flash the error state for a frame before the pick lands.
              Focus-retention only — the interactive controls are the
              Calendar's own buttons. */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div onMouseDown={(e) => e.preventDefault()}>
            <Calendar value={calendarValue} onChange={handleCalendarChange} />
          </div>
        </div>
      )}
    </div>
    {shownError && (
      <FieldError id={errorId} className="uxm-date-input__error-message">{shownError}</FieldError>
    )}
    </>
  );
}
// Static marker so FormField only forwards its `error` prop into children
// that accept one (avoids React unknown-prop warnings on non-input children).
DateInput.hasError = true;
