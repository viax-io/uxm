'use client';

import { useId, useMemo, type CSSProperties, type ReactNode } from 'react';

import { cn } from '@/helpers';

import { FieldError } from '../field-error';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Listbox } from '../listbox';

export interface SearchDropdownOption {
  value: string;
  label: string;
  /** Optional secondary text shown to the right of the label (e.g. category meta). */
  meta?: string;
  /** Optional leading visual — typically an `<Icon>` for icon-glyph pickers. */
  icon?: ReactNode;
}

export interface SearchDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: SearchDropdownOption[];
  /** Trigger placeholder when no value is selected. */
  placeholder?: string;
  /** Search input placeholder inside the popover. */
  searchPlaceholder?: string;
  /** Disabled state — trigger can't open and renders as inert. */
  disabled?: boolean;
  /**
   * When set to a non-empty string, the trigger renders in its error
   * state: red border (`.uxm-search-dropdown--error .uxm-search-dropdown__trigger`),
   * `aria-invalid` on the combobox trigger, and the message below it.
   * Omit (or pass an empty string) for the normal state.
   */
  error?: string;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

/**
 * Combobox-style dropdown — trigger button opens a popover with a
 * search input and a filtered list of options. Use for value pickers
 * with too many options to scan in a native `<select>` (icon glyphs,
 * country codes, large enums). For ≤12 options, prefer the native
 * `<Select>` atom.
 *
 * Internally a thin wrapper over the shared `<Listbox>` atom:
 *   - Listbox owns the popover (positioning + portal + flip-on-overflow),
 *     click-outside, Escape, keyboard nav (Arrow/Home/End/Enter),
 *     ARIA listbox/option roles, focus management, the right-edge ✓
 *     on the selected row.
 *   - SearchDropdown layers its own trigger chrome on top
 *     (`.uxm-search-dropdown__trigger` with `--uxm-search-dropdown-trigger-*`
 *     theming) and renders the icon + label + meta inside each row via
 *     `renderItem`.
 *
 * Panel theming (bg, border, radius, shadow, option states, group
 * headers) flows from the shared `listbox` registry entry — tune it
 * once and every dropdown in the app reflects the change. SearchDropdown's
 * own registry entry only themes the TRIGGER.
 */
export function SearchDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  disabled = false,
  error,
  className,
  style,
  'aria-label': ariaLabel,
}: SearchDropdownProps) {
  const errorId = useId();
  const selected = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value],
  );

  return (
    <>
    <Listbox<SearchDropdownOption>
      items={options}
      getKey={(o) => o.value}
      getLabel={(o) => o.label}
      value={selected}
      // The old SearchDropdown's `onChange(value: string)` signature stays
      // — coerce null (Listbox supports clear via the widened signature)
      // to empty string for backward compatibility with existing callers.
      // Consumers wanting actual null/clear semantics should migrate to
      // Listbox directly.
      onChange={(next) => onChange(next?.value ?? '')}
      searchPlaceholder={searchPlaceholder}
      disabled={disabled}
      className={cn('uxm-search-dropdown', error && 'uxm-search-dropdown--error', className)}
      style={style}
      aria-label={ariaLabel}
      renderTrigger={({ open, triggerProps }) => (
        // Trigger uses `<div role="combobox">` (not `<button>`) so the
        // clear ✕ — a real `<button>` — can sit inside without invalid
        // HTML nesting. tabIndex enables keyboard focus; the spread
        // `triggerProps` brings the open/close wiring + ARIA state.
        // Disabled state runs through `aria-disabled` (CSS targets the
        // attribute since `<div>` doesn't support `:disabled`).
        // eslint-disable-next-line jsx-a11y/role-has-required-aria-props -- aria-expanded (always) and aria-controls (while open) arrive via the triggerProps spread; the rule can't see through it
        <div role="combobox"
          {...triggerProps}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'uxm-search-dropdown__trigger',
            open && 'uxm-search-dropdown__trigger--open',
            !selected && 'uxm-search-dropdown__trigger--empty',
            // Activates the trigger's `:hover:not(--error)` guard so the
            // error border persists on hover. The border itself is painted
            // by `.uxm-search-dropdown--error .uxm-search-dropdown__trigger`
            // (wrapper class above).
            error && 'uxm-search-dropdown__trigger--error',
          )}
        >
          <span className="uxm-search-dropdown__trigger-label">
            {selected ? selected.label : placeholder}
          </span>
          {selected && !disabled && (
            <IconButton
              aria-label="Clear selection"
              onClick={(e) => {
                // Stop the click from bubbling to the trigger div
                // (which would toggle the popover back open).
                e.stopPropagation();
                onChange('');
              }}
              onMouseDown={(e) => {
                // Stop mousedown — the atom's Popover wires its
                // click-outside detection to mousedown.
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                // Don't let Enter/Space bubble into the trigger's
                // own keydown handler (which toggles the popover).
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                }
              }}
              className="uxm-search-dropdown__trigger-clear"
            >
              <Icon glyph="close" />
            </IconButton>
          )}
          <Icon
            glyph="chevron-down"
            size={14}
            className="uxm-search-dropdown__trigger-chevron"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          />
        </div>
      )}
      renderItem={(opt) => (
        <>
          {opt.icon && (
            <span className="uxm-search-dropdown__option-icon" aria-hidden="true">
              {opt.icon}
            </span>
          )}
          <span className="uxm-search-dropdown__option-label">{opt.label}</span>
          {opt.meta && (
            <span className="uxm-search-dropdown__option-meta">{opt.meta}</span>
          )}
        </>
      )}
    />
    {error && (
      <FieldError id={errorId} className="uxm-search-dropdown__error-message">
        {error}
      </FieldError>
    )}
    </>
  );
}
SearchDropdown.hasError = true;
