import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Select } from '@/ui';
import { SearchDropdown } from '@/ui';

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
  } as CSSProperties;
}

export function SelectPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  return <SelectDemo key={state} state={state} styles={styles} />;
}

// Keyed by state in the parent so changing the State knob remounts this
// sub-component and `useState` re-seeds — no effect needed to sync.
function SelectDemo({ state, styles }: { state: string; styles: Styles }) {
  const searchable = Boolean(styles.searchable);
  const isError = state === 'error';

  // Error state pre-selects the first real option so the field reads
  // "you picked this, and it's wrong" rather than "you haven't picked yet."
  const [value, setValue] = useState(isError ? SAMPLE[0] : '');

  const cssVars = buildVars(styles);

  const forcedClass = cn(
    state === 'hover' && 'uxm-select-dropdown--state-hover',
    state === 'focus' && 'uxm-select-dropdown--state-focus',
    state === 'error' && 'uxm-select-dropdown--error',
  );

  return (
    <div style={{ width: 280, ...cssVars } as CSSProperties}>
      {searchable ? (
        <SearchableSelect styles={styles} />
      ) : (
        <Select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={state === 'disabled'}
          className={forcedClass || undefined}
          style={{ paddingRight: ((styles.paddingX as number) ?? 12) + 24 }}
        >
          <option value="" disabled>
            Select a country
          </option>
          {SAMPLE.slice(0, 4).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      )}
      {isError && (
        <p
          style={{
            fontSize: (styles.errorMessageSize as number) ?? 12,
            color: styles.errorColor as string,
            marginTop: 4,
          }}
        >
          Shipping isn&apos;t available to this country yet.
        </p>
      )}
    </div>
  );
}

// SearchDropdown variant: its trigger chrome lives in the SearchDropdown
// atom (which has its own state coverage), so we don't force state visuals
// here — just project the shared shape knobs onto the trigger and let
// SearchDropdown's own CSS handle interaction.
function SearchableSelect({ styles }: { styles: Styles }) {
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
    />
  );
}
