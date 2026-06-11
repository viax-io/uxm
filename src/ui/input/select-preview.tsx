import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Icon, IconButton, MultiListbox, SearchDropdown, Select } from '@/ui';

type Styles = PreviewProps['styles'];

const SAMPLE = [
  'United States',
  'United Kingdom',
  'Germany',
  'Japan',
  'France',
  'Spain',
  'Italy',
  'Canada',
  'Australia',
  'Brazil',
];

/**
 * The preview shows the bare select atom — no label. Labels are owned
 * entirely by `<FormField>`; wrap with FormField when you want a label.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-select-dropdown-bg': styles.backgroundColor as string,
    '--uxm-select-dropdown-border-color': styles.borderColor as string,
    '--uxm-select-dropdown-color': styles.color as string,
    '--uxm-select-dropdown-border-radius': `${styles.borderRadius}px`,
    '--uxm-select-dropdown-padding-x': `${styles.paddingX}px`,
    '--uxm-select-dropdown-padding-y': `${styles.paddingY}px`,
    '--uxm-select-dropdown-font-size': `${styles.fontSize}px`,
    '--uxm-select-dropdown-hover-bg': styles.hoverBg as string,
    '--uxm-select-dropdown-hover-border': styles.hoverBorder as string,
    '--uxm-select-dropdown-focus-border': styles.focusBorder as string,
    '--uxm-select-dropdown-focus-ring': styles.focusRing as string,
    '--uxm-select-dropdown-disabled-bg': styles.disabledBg as string,
    '--uxm-select-dropdown-disabled-border': styles.disabledBorder as string,
    '--uxm-select-dropdown-disabled-color': styles.disabledColor as string,
    '--uxm-select-dropdown-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-select-dropdown-error-bg': styles.errorBg as string,
    '--uxm-select-dropdown-error-border': styles.errorBorder as string,
    '--uxm-select-dropdown-error-color': styles.errorColor as string,
    '--uxm-select-dropdown-error-message-size':
      styles.errorMessageSize != null ? `${styles.errorMessageSize}px` : undefined,
  } as CSSProperties;
}

// Shared error copy for the Select preview's error state, passed to the
// native branch so the atom renders its own icon + message via FieldError.
const SELECT_ERROR = "Shipping isn't available to this country yet.";

export function SelectPreview({ styles, variants }: PreviewProps & { componentId: string }) {
  const state = (variants.state as string) ?? 'default';
  // Behavioral variants — read from `variants`, not `styles`. They're
  // discrete options (on/off, single/multi), not tuneable values.
  const searchable = (variants.searchable as string) === 'on';
  const clearable = (variants.clearable as string) === 'on';
  const multiSelect = (variants.multiSelect as string) === 'multi';
  return (
    <SelectDemo
      key={state}
      state={state}
      styles={styles}
      searchable={searchable}
      clearable={clearable}
      multiSelect={multiSelect}
    />
  );
}

// Keyed by state in the parent so changing the State knob remounts this
// sub-component and `useState` re-seeds — no effect needed to sync.
function SelectDemo({
  state,
  styles,
  searchable,
  clearable,
  multiSelect,
}: {
  state: string;
  styles: Styles;
  searchable: boolean;
  clearable: boolean;
  multiSelect: boolean;
}) {
  const isError = state === 'error';

  // Error state pre-selects the first real option so the field reads
  // "you picked this, and it's wrong" rather than "you haven't picked yet."
  const [value, setValue] = useState(isError ? SAMPLE[0] : '');

  const cssVars = buildVars(styles);

  // `--error` is driven by the real `error` prop on the native branch, so
  // the atom renders its production error message (icon + text via
  // FieldError).
  const forcedClass = cn(
    state === 'hover' && 'uxm-select-dropdown--state-hover',
    state === 'focus' && 'uxm-select-dropdown--state-focus',
  );

  return (
    <div style={{ width: 280, ...cssVars } as CSSProperties}>
      {multiSelect ? (
        <MultiSelectPreviewInstance
          styles={styles}
          searchable={searchable}
          clearable={clearable}
          disabled={state === 'disabled'}
        />
      ) : searchable ? (
        <SearchableSelect styles={styles} error={isError ? SELECT_ERROR : undefined} />
      ) : (
        <Select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={state === 'disabled'}
          clearable={clearable}
          className={forcedClass || undefined}
          error={isError ? SELECT_ERROR : undefined}
        >
          <option value="" disabled>
            Select a country
          </option>
          {SAMPLE.slice(0, 4).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      )}
    </div>
  );
}

// SearchDropdown variant: its trigger chrome lives in the SearchDropdown
// atom (which has its own state coverage), so we don't force state visuals
// here — just project the shared shape knobs onto the trigger and let
// SearchDropdown's own CSS handle interaction.
function SearchableSelect({ styles, error }: { styles: Styles; error?: string }) {
  const [value, setValue] = useState('');
  const triggerVars = {
    '--uxm-search-dropdown-trigger-bg': styles.backgroundColor as string,
    '--uxm-search-dropdown-trigger-border': styles.borderColor as string,
    '--uxm-search-dropdown-trigger-radius': `${styles.borderRadius}px`,
    '--uxm-search-dropdown-trigger-padding-x': `${styles.paddingX}px`,
    '--uxm-search-dropdown-trigger-padding-y': `${styles.paddingY}px`,
    '--uxm-search-dropdown-trigger-font-size': `${styles.fontSize}px`,
  } as CSSProperties;

  return (
    <SearchDropdown
      value={value}
      onChange={setValue}
      options={SAMPLE.map((s) => ({ value: s, label: s }))}
      placeholder="Select a country"
      searchPlaceholder={styles.searchPlaceholder as string}
      style={triggerVars}
      error={error}
    />
  );
}

// Multi-select preview variant — demonstrates what consumers get when
// they want a "N selected" count pattern (distinct from PillSelect's
// chip-in-trigger pattern). The Select atom itself stays single-only;
// this preview just visualizes the multi UX for designers tuning the
// trigger chrome. Production consumers wire `<MultiListbox>` directly
// with a Select-styled trigger like the one below.
type MultiItem = { value: string; label: string };
const MULTI_ITEMS: MultiItem[] = SAMPLE.map((s) => ({ value: s, label: s }));

function MultiSelectPreviewInstance({
  styles,
  searchable,
  clearable,
  disabled,
}: {
  styles: Styles;
  searchable: boolean;
  clearable: boolean;
  disabled: boolean;
}) {
  const [value, setValue] = useState<MultiItem[]>([]);

  // Trigger reads the same `--uxm-select-dropdown-*` vars the native
  // and searchable branches above project, so tuning the Select
  // registry updates this variant consistently.
  const triggerStyle: CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding:
      'var(--uxm-select-dropdown-padding-y, 10px) var(--uxm-select-dropdown-padding-x, 12px)',
    background: 'var(--uxm-select-dropdown-bg, var(--color-card))',
    border: '1px solid var(--uxm-select-dropdown-border-color, var(--color-border))',
    borderRadius: 'var(--uxm-select-dropdown-border-radius, 8px)',
    color: 'var(--uxm-select-dropdown-color, var(--color-text))',
    fontSize: 'var(--uxm-select-dropdown-font-size, 14px)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    textAlign: 'left',
    outline: 'none',
    opacity: disabled ? 0.6 : undefined,
  };

  return (
    <MultiListbox<MultiItem>
      items={MULTI_ITEMS}
      getKey={(o) => o.value}
      getLabel={(o) => o.label}
      value={value}
      onChange={setValue}
      searchable={searchable}
      searchPlaceholder={styles.searchPlaceholder as string}
      disabled={disabled}
      renderTrigger={({ open, triggerProps }) => (
        // eslint-disable-next-line jsx-a11y/role-has-required-aria-props -- aria-expanded (always) and aria-controls (while open) arrive via the triggerProps spread; the rule can't see through it
        <div role="combobox"
          {...triggerProps}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          style={triggerStyle}
        >
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: value.length === 0 ? 'var(--color-text-muted)' : undefined,
            }}
          >
            {value.length === 0 ? 'Select countries' : `${value.length} selected`}
          </span>
          {clearable && value.length > 0 && !disabled && (
            <IconButton
              aria-label="Clear all selections"
              onClick={(e) => {
                // Stop click + mousedown bubbling so clearing all
                // doesn't ALSO toggle the popover (Popover's
                // click-outside fires on mousedown).
                e.stopPropagation();
                setValue([]);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                }
              }}
              style={{
                ['--uxm-icon-button-size' as string]: '22px',
                ['--uxm-icon-button-icon-size' as string]: '12px',
                flexShrink: 0,
              }}
            >
              <Icon glyph="close" />
            </IconButton>
          )}
          <Icon
            glyph="chevron-down"
            size={14}
            style={{
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s',
              color: 'var(--color-text-muted)',
              flexShrink: 0,
            }}
          />
        </div>
      )}
      renderItem={(o) => o.label}
    />
  );
}
