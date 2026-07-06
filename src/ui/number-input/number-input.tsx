import { useCallback, useState } from 'react';

import { cn } from '@/helpers';

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
}

/**
 * Mask raw input down to a valid numeric string. Strips non-digits
 * except an optional leading `-` (when `allowNegative`) and a single
 * `.` (when `allowDecimal`). Caps decimal places at `decimals`.
 * Permissive about partial states like `"-"` or `"12."` so the user
 * can type naturally; the empty string is a legal value.
 */
function maskNumeric(
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
  className,
  onBlur,
  ...rest
}: NumberInputProps) {
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

  return (
    <input
      // `type="text"` with `inputMode="numeric"` (not `type="number"`)
      // for the same reasons as PhoneInput: native number inputs ship
      // browser spinner UI we'd have to suppress, trigger autofill /
      // smart-keypad heuristics that fight controlled values, and
      // disagree across browsers on what characters they accept. Our
      // mask is the source of truth.
      type="text"
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
      autoComplete="off"
      className={cn('uxm-number-input', className)}
      value={current}
      onChange={handleChange}
      onBlur={handleBlur}
      {...rest}
    />
  );
}
