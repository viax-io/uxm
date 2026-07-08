import { useCallback, useMemo, useRef, useState } from 'react';

import { cn } from '@/helpers';

import { useRovingTabIndex } from '../../hooks/use-roving-tab-index';
import {
  CURATED_COUNTRIES,
  findCountry,
  maskNumber,
  maxDigitsFor,
  type PhoneCountry,
} from '../../lib/phone-countries';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Popover } from '../popover';

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
   * Inline style applied to the WRAPPER (and forwarded to the country
   * popover panel). CSS custom properties set here cascade to the inner
   * field, and — because the popover portals out to document.body and so
   * can't inherit the wrapper cascade — are forwarded onto the popover
   * panel too, so theming knobs still reach every part. In production the
   * studio emits popover overrides on the `.uxm-phone-input__popover`
   * selector directly (see PER_COMPONENT_SELECTOR in generate-css).
   */
  style?: React.CSSProperties;
}

/** Default value for uncontrolled mounts that don't pass `defaultValue`. */
const EMPTY_VALUE: PhoneValue = { country: 'US', number: '' };

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

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const country = findCountry(current.country, countries) ?? countries[0];

  const closePopover = useCallback(() => {
    setIsOpen(false);
    setSearch('');
  }, []);

  // Dismissal (outside-click + Escape), portal mounting, positioning, and
  // opening focus are all owned by the shared `Popover` primitive in the
  // JSX below — the country list portals to document.body so an ancestor's
  // `overflow: hidden` can't clip it, and `initialFocus={searchRef}` focuses
  // the search box on open so the user can filter immediately. The `anchor`
  // is the OUTER wrapper (`containerRef`) so clicks on the trigger toggle via
  // its own handler rather than being treated as an outside click.

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
      closePopover();
    },
    [countries, current.number, commit, closePopover],
  );

  // Clear owns its own reset: wipe the national number but KEEP the selected
  // country (the country picker is a separate affordance — clearing the field
  // shouldn't reset it to a default). Mirrors NumberInput / Select which hold
  // their own value state, so no `onClear` prop is needed.
  const handleClear = useCallback(() => {
    commit({ country: current.country, number: '' });
  }, [commit, current.country]);
  const showClear = clearable && current.number.length > 0 && !disabled;

  // Filter the country list by search query. Match against both the
  // country name (case-insensitive) and the dial code so a user typing
  // "+44" or "United" lands on the right entry quickly.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase().includes(q),
    );
  }, [countries, search]);

  // Roving tabindex across the country list — ARIA listbox pattern: only
  // one option is a Tab stop; ArrowUp/Down move the highlight. Enter/Space
  // and Escape are already covered for free — the options are real
  // <button>s (native Enter/Space activation) and Escape is wired above
  // (closes the whole popover, same as an outside click).
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const safeHighlightedIndex = Math.min(highlightedIndex, filtered.length - 1);
  const { getItemRef, onItemKeyDown } = useRovingTabIndex({
    count: filtered.length,
    activeIndex: safeHighlightedIndex,
    orientation: 'vertical',
    onNavigate: setHighlightedIndex,
  });

  const masked = maskNumber(current.number, country);

  return (
    <div
      className={cn('uxm-phone-input', disabled && 'uxm-phone-input--disabled', className)}
      style={style}
      ref={containerRef}
    >
      <button
        type="button"
        className="uxm-phone-input__country"
        onClick={() => (isOpen ? closePopover() : setIsOpen(true))}
        disabled={disabled}
        aria-label={`Country: ${country.name}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="uxm-phone-input__flag" aria-hidden="true">{country.flag}</span>
        <span className="uxm-phone-input__dial">{country.dial}</span>
        <span className="uxm-phone-input__caret" aria-hidden="true">
          <Icon glyph="chevron-down" size={12} strokeWidth={2.2} />
        </span>
      </button>
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
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) closePopover();
        }}
        anchor={containerRef}
        placement="bottom-start"
        matchAnchorWidth
        initialFocus={searchRef}
        className="uxm-phone-input__popover"
        style={style}
        aria-label="Choose country"
      >
        <div className="uxm-phone-input__search">
            <Icon glyph="search" size={14} strokeWidth={2} />
            <input
              ref={searchRef}
              type="text"
              autoComplete="off"
              className="uxm-phone-input__search-input"
              placeholder="Search countries"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search countries"
            />
          </div>
          <ul className="uxm-phone-input__list" role="listbox">
            {filtered.length === 0 ? (
              <li className="uxm-phone-input__empty">No countries match.</li>
            ) : (
              filtered.map((c, i) => (
                <li key={c.iso}>
                  <button
                    type="button"
                    role="option"
                    ref={getItemRef(i)}
                    tabIndex={i === safeHighlightedIndex ? 0 : -1}
                    className={cn(
                      'uxm-phone-input__row',
                      c.iso === current.country && 'uxm-phone-input__row--selected',
                    )}
                    onClick={() => handleCountryPick(c.iso)}
                    onKeyDown={(e) => onItemKeyDown(e, i)}
                    aria-selected={c.iso === current.country}
                  >
                    <span className="uxm-phone-input__row-flag" aria-hidden="true">{c.flag}</span>
                    <span className="uxm-phone-input__row-name">{c.name}</span>
                    <span className="uxm-phone-input__row-dial">{c.dial}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
      </Popover>
    </div>
  );
}
