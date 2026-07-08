import { useCallback, useRef, useState } from 'react';

import { cn } from '@/helpers';

import {
  CURATED_COUNTRIES,
  findCountry,
  maskNumber,
  maxDigitsFor,
  type PhoneCountry,
} from '../../lib/phone-countries';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Listbox } from '../listbox';

import type { ChangeEvent, InputHTMLAttributes } from 'react';

/** PhoneInput value: split into country code (ISO) and the national number. */
export interface PhoneValue {
  /** ISO-3166 alpha-2 country code (e.g. "US"). */
  country: string;
  /** National number as raw digits, no formatting. */
  number: string;
}

export interface PhoneInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value' | 'defaultValue' | 'type' | 'style'
  > {
  /** Controlled value. Pair with `onChange`. */
  value?: PhoneValue;
  /** Initial value for uncontrolled usage. */
  defaultValue?: PhoneValue;
  /** Fires with the next value after each keystroke or country pick. */
  onChange?: (next: PhoneValue) => void;
  /**
   * Country list shown in the picker. Defaults to a curated set of ~30
   * countries covering the regions most B2B apps ship to. Pass a custom
   * list (e.g. an extended global set or a region-restricted subset) to
   * override. Each country's `format` field controls the per-country
   * digit mask.
   */
  countries?: PhoneCountry[];
  /**
   * Show a clear (✕) button at the trailing edge when the national number
   * has a value. On by default (opt out with `clearable={false}`). The
   * component owns the reset — it wipes its own uncontrolled state and fires
   * `onChange` with an empty number (keeping the selected country), so no
   * separate `onClear` is needed (mirrors NumberInput / Select).
   */
  clearable?: boolean;
  /**
   * Inline style applied to the WRAPPER, and forwarded to the country
   * picker panel via `panelStyle` (the panel portals to document.body, so
   * it can't inherit the wrapper cascade). CSS custom properties set here
   * reach both the field and the popover.
   */
  style?: React.CSSProperties;
}

/** Default value for uncontrolled mounts that don't pass `defaultValue`. */
const EMPTY_VALUE: PhoneValue = { country: 'US', number: '' };

/** Case-insensitive country filter — matches name, dial code, or ISO. */
function filterCountries(items: PhoneCountry[], query: string): PhoneCountry[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase().includes(q),
  );
}

export function PhoneInput({
  value,
  defaultValue,
  onChange,
  countries = CURATED_COUNTRIES,
  clearable = true,
  className,
  placeholder,
  style,
  disabled,
  ...rest
}: PhoneInputProps) {
  const [internal, setInternal] = useState<PhoneValue>(() => defaultValue ?? EMPTY_VALUE);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  // The field wrapper is the popover anchor: the clickable trigger is the
  // small country button, but the panel should span the full field width.
  const containerRef = useRef<HTMLDivElement>(null);

  const country = findCountry(current.country, countries) ?? countries[0];

  const commit = useCallback(
    (next: PhoneValue) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const handleNumberChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // Strip non-digits and cap at the country's digit budget so the
      // stored value is always raw, normalized digits. Re-formatting for
      // display happens via `maskNumber` below.
      const digits = e.target.value.replace(/\D/g, '').slice(0, maxDigitsFor(country));
      commit({ country: current.country, number: digits });
    },
    [country, current.country, commit],
  );

  const handleCountryPick = useCallback(
    (iso: string) => {
      // Switching country may invalidate the current digit count (e.g.
      // moving from a 10-digit country to a 7-digit one). Truncate to
      // the new max so the displayed mask doesn't overflow its slots.
      const next = findCountry(iso, countries);
      const cap = maxDigitsFor(next);
      const trimmed = current.number.length > cap ? current.number.slice(0, cap) : current.number;
      commit({ country: iso, number: trimmed });
    },
    [countries, current.number, commit],
  );

  // Clear owns its own reset: wipe the national number but KEEP the selected
  // country (the country picker is a separate affordance — clearing the field
  // shouldn't reset it to a default). Mirrors NumberInput / Select which hold
  // their own value state, so no `onClear` prop is needed.
  const handleClear = useCallback(() => {
    commit({ country: current.country, number: '' });
  }, [commit, current.country]);
  const showClear = clearable && current.number.length > 0 && !disabled;

  const masked = maskNumber(current.number, country);

  return (
    <div
      className={cn('uxm-phone-input', disabled && 'uxm-phone-input--disabled', className)}
      style={style}
      ref={containerRef}
    >
      {/* Country picker — the shared Listbox owns the popover (positioning,
          portal, dismiss, keyboard nav, search, ARIA). `anchorRef` points at
          the field wrapper so the panel spans the full width; `showCheckmark`
          is off because each row already carries the dial code on its right
          edge. */}
      <Listbox<PhoneCountry>
        items={countries}
        getKey={(c) => c.iso}
        getLabel={(c) => c.name}
        filterItems={filterCountries}
        value={country}
        onChange={(next) => next && handleCountryPick(next.iso)}
        disabled={disabled}
        anchorRef={containerRef}
        placement="bottom-start"
        searchPlaceholder="Search countries"
        showCheckmark={false}
        panelClassName="uxm-phone-input__panel"
        panelStyle={style}
        className="uxm-phone-input__picker"
        aria-label="Choose country"
        renderTrigger={({ open, triggerProps }) => (
          <button
            {...triggerProps}
            type="button"
            className="uxm-phone-input__country"
            aria-label={`Country: ${country.name}`}
          >
            <span className="uxm-phone-input__flag" aria-hidden="true">{country.flag}</span>
            <span className="uxm-phone-input__dial">{country.dial}</span>
            <span className="uxm-phone-input__caret" aria-hidden="true">
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
            <span className="uxm-phone-input__row-flag" aria-hidden="true">{c.flag}</span>
            <span className="uxm-phone-input__row-name">{c.name}</span>
            <span className="uxm-phone-input__row-dial">{c.dial}</span>
          </>
        )}
      />
      <input
        // `type="text"` (not `tel`) is deliberate: `type="tel"` triggers
        // Chrome / Safari phone-autofill heuristics that can intercept
        // keystrokes, clear the field mid-typing, or render a stacking
        // autofill chip that fights our masked display. `inputMode="numeric"`
        // still pulls up the digit-only soft keyboard on mobile, which is
        // the only thing `type="tel"` was giving us. `autoComplete="off"`
        // belt-and-braces against browser autofill clobbering the value
        // (some browsers ignore `autoComplete` on tel-shaped fields, so
        // skipping the tel hint matters too).
        type="text"
        inputMode="numeric"
        autoComplete="off"
        className={cn(
          'uxm-phone-input__input',
          clearable && 'uxm-phone-input__input--clearable',
        )}
        placeholder={placeholder ?? country.format?.replace(/X/g, '0') ?? 'Phone number'}
        value={masked}
        onChange={handleNumberChange}
        disabled={disabled}
        {...rest}
      />
      {showClear && (
        <IconButton
          className="uxm-field-clear uxm-phone-input__clear"
          aria-label="Clear"
          // Prevent the button from stealing focus away from whatever's
          // currently focused — a blur here would land before the reset does.
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClear}
        >
          <Icon glyph="close" />
        </IconButton>
      )}
    </div>
  );
}
