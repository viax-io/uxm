'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';

import { cn } from '@/helpers';

import { Icon } from '../icon';

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
 * Keyboard: ArrowUp/Down move highlight, Enter selects, Escape closes.
 * Click-outside closes. Focus moves to the search input on open.
 *
 * Themable through `--uxm-search-dropdown-*` custom properties: trigger
 * bg/border/radius/padding/font, popover bg/border/radius/shadow, item
 * hover/active bg + colour, and the search input chrome.
 */
export function SearchDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  disabled = false,
  className,
  style,
  'aria-label': ariaLabel,
}: SearchDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlight, setHighlight] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(() => options.find((o) => o.value === value), [options, value]);

  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  // Reset search on open + auto-focus the search input. Click-outside
  // closes the popover. Highlight resets to 0 so Enter picks the top
  // match consistently.
  useEffect(() => {
    if (!open) return;
    setSearch('');
    setHighlight(0);
    setTimeout(() => searchRef.current?.focus(), 0);
    function onClick(e: MouseEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || popoverRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // Keep highlight in range when the filtered list changes (e.g. after
  // typing). Without this, ArrowDown past a now-shorter list would
  // wrap unexpectedly.
  useEffect(() => {
    if (highlight >= filtered.length) setHighlight(Math.max(0, filtered.length - 1));
  }, [filtered, highlight]);

  const select = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = filtered[highlight];
      if (opt) select(opt.value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div className={cn('uxm-search-dropdown', className)} style={style}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'uxm-search-dropdown__trigger',
          open && 'uxm-search-dropdown__trigger--open',
          !selected && 'uxm-search-dropdown__trigger--empty',
        )}
      >
        <span className="uxm-search-dropdown__trigger-label">
          {selected ? selected.label : placeholder}
        </span>
        <Icon
          glyph="chevron-down"
          size={14}
          className="uxm-search-dropdown__trigger-chevron"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>
      {open && (
        <div ref={popoverRef} className="uxm-search-dropdown__popover" role="listbox">
          <div className="uxm-search-dropdown__search">
            <Icon
              glyph="search"
              size={14}
              className="uxm-search-dropdown__search-icon"
            />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={searchPlaceholder}
              className="uxm-search-dropdown__search-input"
            />
          </div>
          <div className="uxm-search-dropdown__list">
            {filtered.length === 0 ? (
              <div className="uxm-search-dropdown__empty">No matches</div>
            ) : (
              filtered.map((opt, i) => {
                const active = opt.value === value;
                const highlighted = i === highlight;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    // mouseDown vs click prevents the trigger button from
                    // re-stealing focus + closing before the click fires.
                    onMouseDown={(e) => { e.preventDefault(); select(opt.value); }}
                    onMouseEnter={() => setHighlight(i)}
                    className={cn(
                      'uxm-search-dropdown__option',
                      active && 'uxm-search-dropdown__option--active',
                      highlighted && 'uxm-search-dropdown__option--highlighted',
                    )}
                  >
                    {opt.icon && (
                      <span className="uxm-search-dropdown__option-icon" aria-hidden="true">
                        {opt.icon}
                      </span>
                    )}
                    <span className="uxm-search-dropdown__option-label">{opt.label}</span>
                    {opt.meta && (
                      <span className="uxm-search-dropdown__option-meta">{opt.meta}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
