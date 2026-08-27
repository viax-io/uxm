import { useCallback, useId, useState } from 'react';

import { cn, mergeDescribedBy } from '@/helpers';
import { FieldError } from '@/ui/field-error';
import { Icon } from '@/ui/icon';
import { IconButton } from '@/ui/icon-button';

import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from 'react';

export interface NumberInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value' | 'defaultValue' | 'type' | 'min' | 'max'
  > {
  /** Current value as a digit string (controlled). E.g. `"1234"` or `"-12.5"`. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /**
   * Called on every keystroke with the masked, digit-only string. The
   * value is sanitized — non-digit characters are stripped, only the
   * configured sign / decimal characters survive. Clamping to `min`/
   * `max` happens on blur, not per-keystroke, so the user can type
   * freely without the value being yanked mid-typing.
   */
  onChange?: (value: string) => void;
  /** Clamp the committed value down to this minimum on blur. */
  min?: number;
  /** Clamp the committed value up to this maximum on blur. */
  max?: number;
  /** Allow a leading `-` sign. Defaults to `false` (unsigned). */
  allowNegative?: boolean;
  /** Allow a single `.` decimal separator. Defaults to `false` (integer-only). */
  allowDecimal?: boolean;
  /**
   * Maximum number of decimal places. Only meaningful when
   * `allowDecimal` is true. Excess digits are dropped during masking.
   * Defaults to 2 (e.g. "12.34" max, "12.345" → "12.34").
   */
  decimals?: number;
  /**
   * Show a clear (✕) button at the trailing edge when the field has a value.
   * On by default (opt out with `clearable={false}`). The component owns the
   * reset — it clears its own uncontrolled state and fires `onChange("")`, so
   * no separate `onClear` is needed (mirrors Select / DateInput).
   */
  clearable?: boolean;
  /** Accessible name for the clear button. Default `"Clear"`. */
  clearLabel?: string;
  /**
   * When set to a non-empty string, the field renders in its error state:
   * red border (`.uxm-number-input--error`), `aria-invalid`, and the message
   * below the input. Omit (or pass an empty string) for the normal state.
   */
  error?: string;
}

/**
 * Mask raw input down to a valid numeric string. Strips non-digits
 * except an optional leading `-` (when `allowNegative`) and a single
 * `.` (when `allowDecimal`). Caps decimal places at `decimals`.
 * Permissive about partial states like `"-"` or `"12."` so the user
 * can type naturally; the empty string is a legal value.
 */
export function maskNumeric(
  raw: string,
  allowNegative: boolean,
  allowDecimal: boolean,
  decimals: number,
): string {
  if (raw === '') return '';
  let negative = false;
  let body = raw;
  if (allowNegative && body.startsWith('-')) {
    negative = true;
    body = body.slice(1);
  }
  // Drop any non-digit, non-`.` characters from the body.
  body = body.replace(/[^\d.]/g, '');
  if (!allowDecimal) {
    body = body.replace(/\./g, '');
  } else {
    // Keep only the first `.` — additional dots are typos.
    const firstDot = body.indexOf('.');
    if (firstDot !== -1) {
      body = body.slice(0, firstDot + 1) + body.slice(firstDot + 1).replace(/\./g, '');
      const [intPart, decPart = ''] = body.split('.');
      body = intPart + '.' + decPart.slice(0, decimals);
    }
  }
  return negative ? '-' + body : body;
}

/** Clamp a numeric string to [min, max]. Returns the clamped digit string. */
function clampNumeric(value: string, min?: number, max?: number): string {
  if (value === '' || value === '-' || value === '.') return value;
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  let clamped = n;
  if (min !== undefined && clamped < min) clamped = min;
  if (max !== undefined && clamped > max) clamped = max;
  // Preserve the user's "12." typing intent if they paused at a decimal
  // — re-stringifying via Number would round trip "12." back to "12".
  if (clamped === n) return value;
  return String(clamped);
}

/**
 * A themable typing-only numeric input. No `−` / `+` buttons (use
 * the `NumberStepper` atom for that), no currency
 * formatting (use `CurrencyInput`). Mask strips non-digits in real
 * time; `min`/`max` clamping fires on blur so typing isn't yanked
 * mid-character.
 *
 * Architecturally mirrors `TextInput`: the root `<input>` IS the
 * visible surface (no positioning wrapper), so theming flows through
 * `.uxm-number-input` directly and the state pseudos / forced-state
 * modifiers live on the same element.
 */
export function NumberInput({
  value,
  defaultValue,
  onChange,
  min,
  max,
  allowNegative = false,
  allowDecimal = false,
  decimals = 2,
  clearable = true,
  clearLabel = 'Clear',
  className,
  error,
  disabled,
  onBlur,
  ...rest
}: NumberInputProps) {
  const errorId = useId();
  const [internal, setInternal] = useState<string>(
    () => maskNumeric(defaultValue ?? '', allowNegative, allowDecimal, decimals),
  );
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = maskNumeric(e.target.value, allowNegative, allowDecimal, decimals);
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [allowNegative, allowDecimal, decimals, isControlled, onChange],
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      // Clamp on blur — the user has stopped typing, now we enforce
      // the bounds. Doing this per-keystroke would yank values out
      // from under the cursor as they type, which feels broken.
      const clamped = clampNumeric(current ?? '', min, max);
      if (clamped !== current) {
        if (!isControlled) setInternal(clamped);
        onChange?.(clamped);
      }
      onBlur?.(e);
    },
    [current, min, max, isControlled, onChange, onBlur],
  );

  // Clear owns its own reset: wipe uncontrolled state and notify via
  // onChange(""). Mirrors Select / DateInput (components that hold their own
  // value state, unlike TextInput which needs an onClear).
  const handleClear = useCallback(() => {
    if (!isControlled) setInternal('');
    onChange?.('');
  }, [isControlled, onChange]);
  const showClear = clearable && !!current && !disabled;

  const input = (
    // `{...rest}` is spread FIRST so the managed props below always win
    // (same rule as TextInput) — a consumer prop can't clobber the mask's
    // value/onChange or the computed error state.
    <input
      {...rest}
      // `type="text"` with `inputMode` (not `type="number"`) for the same
      // reasons as PhoneInput: native number inputs ship browser spinner UI
      // we'd have to suppress, trigger autofill / smart-keypad heuristics that
      // fight controlled values, and disagree across browsers on accepted
      // characters. Our mask is the source of truth.
      type="text"
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
      autoComplete="off"
      className={cn(
        'uxm-number-input',
        error && 'uxm-number-input--error',
        clearable && 'uxm-number-input--clearable',
        className,
      )}
      aria-invalid={error ? true : undefined}
      aria-describedby={mergeDescribedBy(rest['aria-describedby'], error ? errorId : undefined)}
      value={current}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
    />
  );

  return (
    <>
      {clearable ? (
        // Layout-only wrapper so the clear button sits at the trailing edge;
        // visible chrome stays on `.uxm-number-input` so saved --uxm vars apply.
        <div className="uxm-number-input-wrap">
          {input}
          {showClear && (
            <IconButton
              className="uxm-field-clear uxm-number-input__clear"
              aria-label={clearLabel}
              // Keep focus in the input so the clear-click doesn't trigger a
              // blur-clamp on the about-to-be-wiped value first.
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
            >
              <Icon glyph="close" />
            </IconButton>
          )}
        </div>
      ) : (
        input
      )}
      {error && (
        <FieldError id={errorId} className="uxm-number-input__error-message">
          {error}
        </FieldError>
      )}
    </>
  );
}
NumberInput.hasError = true;
