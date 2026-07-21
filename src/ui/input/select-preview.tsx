import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Select } from '@/ui';

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
  // Searchability is NOT a Select variant: the trigger (all this entry
  // themes) looks identical with or without search, and the search box
  // itself is previewed + themed in the `listbox` entry. So there's
  // nothing Select-specific to toggle here — `searchable` stays a runtime
  // prop (default "auto").
  const multiSelect = (variants.multiSelect as string) === 'multi';
  return <SelectDemo key={state} state={state} styles={styles} multiSelect={multiSelect} />;
}

// Keyed by state in the parent so changing the State knob remounts this
// sub-component and `useState` re-seeds — no effect needed to sync.
function SelectDemo({
  state,
  styles,
  multiSelect,
}: {
  state: string;
  styles: Styles;
  multiSelect: boolean;
}) {
  const isError = state === 'error';

  // Pre-select a value (except disabled) so the clear affordance is visible in
  // the preview — the atom renders its ✕ on the trigger AND a "Clear" in the
  // dropdown once something is picked (needs the placeholder option below).
  const [value, setValue] = useState(state === 'disabled' ? '' : SAMPLE[0]);

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
        <MultiSelectPreviewInstance disabled={state === 'disabled'} />
      ) : (
        // The Select trigger is what this entry themes. `searchable` defaults
        // to "auto"; the full country list is past the threshold, so opening
        // the panel shows the search box — the searchable Select in action
        // (the search box's own theming lives in the `listbox` entry).
        <Select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={state === 'disabled'}
          className={forcedClass || undefined}
          error={isError ? SELECT_ERROR : undefined}
        >
          <option value="" disabled>
            Select a country
          </option>
          {SAMPLE.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      )}
    </div>
  );
}

// Multi-select variant — now the real atom: `<Select mode="multi">`. Same
// trigger chrome + `<option>` children as single, an array value + "N selected"
// trigger, clear on the trigger ✕ AND in the panel.
function MultiSelectPreviewInstance({ disabled }: { disabled: boolean }) {
  const [value, setValue] = useState<string[]>([]);
  return (
    <Select
      mode="multi"
      value={value}
      onChange={setValue}
      disabled={disabled}
      clearable
      aria-label="Countries"
    >
      <option value="" disabled>
        Select countries
      </option>
      {SAMPLE.map((c) => (
        <option key={c}>{c}</option>
      ))}
    </Select>
  );
}
