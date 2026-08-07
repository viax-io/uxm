import { useCallback, useRef, useState } from 'react';

import { cn } from '@/helpers';

import {
  CURATED_CURRENCIES,
  findCurrency,
  type Currency,
} from '../../lib/currencies';
import { FieldError } from '../field-error';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Listbox } from '../listbox';

import type { ChangeEvent, FocusEvent, InputHTMLAttributes } from 'react';

/** CurrencyInput value: split into ISO 4217 code and the raw amount string. */
export interface CurrencyValue {
  /** ISO 4217 currency code (e.g. "USD"). */
  currency: string;
  /** Amount as a raw digit string with optional `.` decimal (e.g. "1234.56"). */
  amount: string;
}

export interface CurrencyInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value' | 'defaultValue' | 'type' | 'min' | 'max' | 'style'
  > {
  /** Controlled value. Pair with `onChange`. */
  value?: CurrencyValue;
  /** Initial value for uncontrolled usage. */
  defaultValue?: CurrencyValue;
  /** Fires on every keystroke or currency pick with the next value. */
  onChange?: (next: CurrencyValue) => void;
  /**
   * Currency list shown in the picker. Defaults to ~20 curated entries
   * covering the regions most B2B / fintech apps transact in. Pass a
   * custom list to extend or restrict (e.g. pass a single-entry array
   * to effectively lock currency selection at design time).
   */
  currencies?: Currency[];
  /**
   * BCP-47 locale tag (e.g. `"en-US"`, `"de-DE"`). Drives thousands
   * separator style on the blur-display format. Defaults to `"en-US"`.
   * Does NOT drive symbol position — the symbol always sits in the
   * leading picker slot, mirroring PhoneInput's country-code shape.
   */
  locale?: string;
  /** Clamp the committed amount down to this minimum on blur. */
  min?: number;
  /** Clamp the committed amount up to this maximum on blur. */
  max?: number;
  /** Allow a leading `-` sign for refunds / credits. Defaults to `false`. */
  allowNegative?: boolean;
  /**
   * Show a clear (✕) button at the trailing edge when the amount has a
   * value. On by default (opt out with `clearable={false}`). The component
   * owns the reset — it wipes its own uncontrolled state and fires `onChange`
   * with an empty amount (keeping the selected currency), so no separate
   * `onClear` is needed (mirrors NumberInput / PhoneInput).
   */
  clearable?: boolean;
  /** Accessible name for the clear button. Default `"Clear"`. */
  clearLabel?: string;
  /** Accessible name for the currency picker trigger. Default `"Choose currency"`. */
  chooseCurrencyLabel?: string;
  /**
   * Inline style applied to the WRAPPER (not the inner <input>). CSS
   * custom properties set here cascade to the inner field AND the
   * popover so theming knobs reach all parts.
   */
  style?: React.CSSProperties;
  /**
   * When set to a non-empty string, the field renders in its error state:
   * red border (`.uxm-currency-input--error`), `aria-invalid` on the
   * amount input, and the message rendered below the field. Omit (or pass
   * an empty string) for the normal state.
   */
  error?: string;
}

/** Strip non-digit-non-dot and cap decimals to the active currency's precision. */
function maskAmount(raw: string, allowNegative: boolean, decimals: number): string {
  if (raw === '') return '';
  let negative = false;
  let body = raw;
  if (allowNegative && body.startsWith('-')) {
    negative = true;
    body = body.slice(1);
  }
  body = body.replace(/[^\d.]/g, '');
  if (decimals === 0) {
    body = body.replace(/\./g, '');
  } else {
    const firstDot = body.indexOf('.');
    if (firstDot !== -1) {
      body = body.slice(0, firstDot + 1) + body.slice(firstDot + 1).replace(/\./g, '');
      const [intPart, decPart = ''] = body.split('.');
      body = intPart + '.' + decPart.slice(0, decimals);
    }
  }
  return negative ? '-' + body : body;
}

/** `1234.5` → `1,234.50` (locale-aware). Empty / partial inputs pass through. */
function formatForDisplay(raw: string, locale: string, decimals: number): string {
  if (raw === '' || raw === '-' || raw === '.') return raw;
  const n = Number(raw);
  if (!Number.isFinite(n)) return raw;
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/** Parse a locale-formatted display string back into the raw digit form. */
function parseFromDisplay(formatted: string, allowNegative: boolean, decimals: number): string {
  let body = formatted;
  // Normalize a European `,` decimal (`1.234,56`) into our internal `.`
  // form so the same mask works regardless of locale on input.
  if (!body.includes('.') && body.includes(',')) {
    const lastComma = body.lastIndexOf(',');
    body = body.slice(0, lastComma) + '.' + body.slice(lastComma + 1);
  }
  return maskAmount(body, allowNegative, decimals);
}

function clampNumeric(value: string, min?: number, max?: number): string {
  if (value === '' || value === '-' || value === '.') return value;
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  let clamped = n;
  if (min !== undefined && clamped < min) clamped = min;
  if (max !== undefined && clamped > max) clamped = max;
  if (clamped === n) return value;
  return String(clamped);
}

/** Case-insensitive currency filter — matches name, ISO code, or symbol. */
function filterCurrencies(items: Currency[], query: string): Currency[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q),
  );
}

/**
 * A monetary input with a leading interactive currency picker. Mirrors
 * PhoneInput's architecture: the leading slot is a clickable button
 * that opens a searchable popover; the inner field handles the value.
 * Value is an object `{ currency, amount }` — `currency` is the ISO
 * 4217 code, `amount` is the raw digit string (no thousands
 * separators or symbol).
 *
 * Display behavior is the standard finance UX pattern:
 *   - On focus → show raw digits (easy to edit)
 *   - On blur → show locale-formatted (`1,234.56`, easy to read)
 *
 * Pass a single-entry `currencies` array to effectively lock the
 * currency at design time (the picker still renders but only offers
 * one option). For non-monetary numeric input use `NumberInput`; for
 * integer values with step buttons use `NumberStepper`.
 */
export function CurrencyInput({
  value,
  defaultValue,
  onChange,
  currencies = CURATED_CURRENCIES,
  locale = 'en-US',
  min,
  max,
  allowNegative = false,
  clearable = true,
  clearLabel = 'Clear',
  chooseCurrencyLabel = 'Choose currency',
  className,
  style,
  disabled,
  onFocus,
  onBlur,
  placeholder,
  error,
  ...rest
}: CurrencyInputProps) {
  // Uncontrolled default currency must match what's actually displayed —
  // `currencies[0]` when the consumer restricts the list, `'USD'` only when
  // no list is given at all. Hardcoding `'USD'` here would desync every
  // `onChange` from the displayed currency whenever `currencies` excludes it.
  const [internal, setInternal] = useState<CurrencyValue>(
    () => defaultValue ?? { currency: currencies[0]?.code ?? 'USD', amount: '' },
  );
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const [focused, setFocused] = useState(false);
  // The field wrapper is the picker's popover anchor: the clickable trigger is
  // the small currency button, but the panel spans the full field width.
  const containerRef = useRef<HTMLDivElement>(null);

  const currency = findCurrency(current.currency, currencies) ?? currencies[0];
  const decimals = currency.decimals;

  const commit = useCallback(
    (next: CurrencyValue) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const handleAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // Focused → input shows raw digits, mask treats input as raw.
      // Blurred → input shows formatted text; parse-from-display
      // strips separators first (rare path — users typically focus
      // before typing).
      const next = focused
        ? maskAmount(e.target.value, allowNegative, decimals)
        : parseFromDisplay(e.target.value, allowNegative, decimals);
      commit({ currency: current.currency, amount: next });
    },
    [focused, allowNegative, decimals, current.currency, commit],
  );

  const handleCurrencyPick = useCallback(
    (code: string) => {
      // Switching currency may invalidate the current decimal count
      // (USD/2 → JPY/0). Re-mask the amount under the new precision
      // so the displayed value matches what the new currency allows.
      const nextCurrency = findCurrency(code, currencies);
      const nextDecimals = nextCurrency?.decimals ?? 2;
      const reMasked = maskAmount(current.amount, allowNegative, nextDecimals);
      commit({ currency: code, amount: reMasked });
    },
    [currencies, current.amount, allowNegative, commit],
  );

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      const clamped = clampNumeric(current.amount, min, max);
      if (clamped !== current.amount) {
        commit({ currency: current.currency, amount: clamped });
      }
      onBlur?.(e);
    },
    [current.amount, current.currency, min, max, commit, onBlur],
  );

  // Clear owns its own reset: wipe the amount but KEEP the selected currency
  // (the picker is a separate affordance — clearing the value shouldn't reset
  // it). Mirrors NumberInput / PhoneInput which hold their own value state,
  // so no `onClear` prop is needed.
  const handleClear = useCallback(() => {
    commit({ currency: current.currency, amount: '' });
  }, [commit, current.currency]);
  const showClear = clearable && current.amount !== '' && !disabled;

  // Focus toggle drives whether the input shows raw digits or the
  // locale-formatted display value. Same pattern as standard finance
  // inputs (Stripe, Wise, etc.).
  const displayValue = focused
    ? current.amount
    : formatForDisplay(current.amount, locale, decimals);

  return (
    <>
    <div
      className={cn(
        'uxm-currency-input',
        disabled && 'uxm-currency-input--disabled',
        error && 'uxm-currency-input--error',
        className,
      )}
      style={style}
      ref={containerRef}
    >
      {/* Currency picker — the shared Listbox owns the popover (positioning,
          portal, dismiss, keyboard nav, search, ARIA). `anchorRef` points at
          the field wrapper so the panel spans the full width; `showCheckmark`
          is off because each row already carries its ISO code on the right. */}
      <Listbox<Currency>
        items={currencies}
        getKey={(c) => c.code}
        getLabel={(c) => c.name}
        filterItems={filterCurrencies}
        value={currency}
        onChange={(next) => next && handleCurrencyPick(next.code)}
        disabled={disabled}
        anchorRef={containerRef}
        placement="bottom-start"
        searchPlaceholder="Search currencies"
        searchAriaLabel="Search currencies"
        showCheckmark={false}
        panelClassName="uxm-currency-input__panel"
        panelStyle={style}
        className="uxm-currency-input__picker-wrap"
        aria-label={chooseCurrencyLabel}
        renderTrigger={({ open, triggerProps }) => (
          <button
            {...triggerProps}
            type="button"
            className="uxm-currency-input__picker"
            aria-label={`Currency: ${currency.name}`}
          >
            <span className="uxm-currency-input__symbol" aria-hidden="true">{currency.symbol}</span>
            <span className="uxm-currency-input__code">{currency.code}</span>
            <span className="uxm-currency-input__caret" aria-hidden="true">
              <Icon
                glyph="chevron-down"
                size={12}
                strokeWidth={2.2}
                style={{ transform: open ? 'rotate(180deg)' : 'none' }}
              />
            </span>
          </button>
        )}
        renderItem={(c) => (
          <>
            <span className="uxm-currency-input__row-symbol" aria-hidden="true">{c.symbol}</span>
            <span className="uxm-currency-input__row-name">{c.name}</span>
            <span className="uxm-currency-input__row-code">{c.code}</span>
          </>
        )}
      />
      <input
        // Same `type="text"` + `inputMode="decimal"` rationale as
        // PhoneInput / NumberInput: native `type="number"` ships
        // browser spinners + autofill heuristics that fight our mask.
        type="text"
        inputMode={decimals > 0 ? 'decimal' : 'numeric'}
        autoComplete="off"
        className={cn(
          'uxm-currency-input__input',
          clearable && 'uxm-currency-input__input--clearable',
        )}
        value={displayValue}
        onChange={handleAmountChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder ?? (decimals > 0 ? '0.00' : '0')}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {showClear && (
        <IconButton
          className="uxm-field-clear uxm-currency-input__clear"
          aria-label={clearLabel}
          // Prevent the button from stealing focus away from whatever's
          // currently focused — a blur here would clamp the about-to-be-wiped
          // value first (same guard as NumberInput).
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClear}
        >
          <Icon glyph="close" />
        </IconButton>
      )}
    </div>
    {error && <FieldError className="uxm-currency-input__error-message">{error}</FieldError>}
    </>
  );
}
// Static marker so FormField only forwards its `error` prop into children
// that accept one (avoids React unknown-prop warnings on non-input children).
CurrencyInput.hasError = true;
