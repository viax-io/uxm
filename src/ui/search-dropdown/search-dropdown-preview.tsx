import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { ICONS } from '@/ui';
import { Icon } from '@/ui';
import { SearchDropdown, type SearchDropdownOption } from '@/ui';

type Styles = PreviewProps['styles'];

const DEMO_OPTIONS: SearchDropdownOption[] = ICONS.slice(0, 24).map((g) => ({
  value: g.id,
  label: g.label,
  icon: <Icon glyph={g.id} size={14} />,
}));

function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-search-dropdown-trigger-bg': styles.triggerBg as string,
    '--uxm-search-dropdown-trigger-border': styles.triggerBorder as string,
    '--uxm-search-dropdown-trigger-color': styles.triggerColor as string,
    '--uxm-search-dropdown-trigger-radius': `${styles.triggerRadius}px`,
    '--uxm-search-dropdown-trigger-padding-x': `${styles.triggerPaddingX}px`,
    '--uxm-search-dropdown-trigger-padding-y': `${styles.triggerPaddingY}px`,
    '--uxm-search-dropdown-trigger-font-size': `${styles.triggerFontSize}px`,
    '--uxm-search-dropdown-trigger-hover-bg': styles.triggerHoverBg as string,
    '--uxm-search-dropdown-trigger-hover-border': styles.triggerHoverBorder as string,
    '--uxm-search-dropdown-trigger-focus-border': styles.triggerFocusBorder as string,
    '--uxm-search-dropdown-trigger-focus-ring': styles.triggerFocusRing as string,
    '--uxm-search-dropdown-trigger-disabled-bg': styles.triggerDisabledBg as string,
    '--uxm-search-dropdown-trigger-disabled-border': styles.triggerDisabledBorder as string,
    '--uxm-search-dropdown-trigger-disabled-color': styles.triggerDisabledColor as string,
    '--uxm-search-dropdown-trigger-disabled-opacity':
      styles.triggerDisabledOpacity != null ? String(styles.triggerDisabledOpacity) : undefined,
    '--uxm-search-dropdown-trigger-error-bg': styles.triggerErrorBg as string,
    '--uxm-search-dropdown-trigger-error-border': styles.triggerErrorBorder as string,
    '--uxm-search-dropdown-trigger-error-color': styles.triggerErrorColor as string,
    '--uxm-search-dropdown-trigger-error-message-size':
      styles.triggerErrorMessageSize != null ? `${styles.triggerErrorMessageSize}px` : undefined,
    // Popover + option-row vars live on the Listbox atom now —
    // SearchDropdown is a thin wrapper that consumes them. Tune via
    // the `listbox` registry entry.
    width: 280,
  } as CSSProperties;
}

export function SearchDropdownPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  return <SearchDropdownDemo key={state} state={state} styles={styles} />;
}

// Keyed by state in the parent so changing the State knob remounts this
// sub-component and `useState` re-seeds — no effect needed to sync.
function SearchDropdownDemo({ state, styles }: { state: string; styles: Styles }) {
  const isError = state === 'error';

  // Error state pre-selects an icon so the trigger reads as "you picked
  // something invalid" — paired with the error message below.
  const [value, setValue] = useState(isError ? DEMO_OPTIONS[0]?.value ?? '' : 'search');

  const cssVars = buildVars(styles);

  // Forced-state modifier classes live on the wrapper; CSS descendant
  // selectors paint the inner trigger button. Disabled engages via the
  // actual `disabled` prop on SearchDropdown (which sets the button's
  // disabled attribute, blocking the popover open).
  const forcedClass = cn(
    state === 'hover' && 'uxm-search-dropdown--state-hover',
    state === 'focus' && 'uxm-search-dropdown--state-focus',
  );

  return (
    <div style={cssVars}>
      {/* `--error` is driven by the real `error` prop (not a forced-state
          class), so the atom renders its production error message — icon
          + text via the shared FieldError — instead of a preview-only mock. */}
      <SearchDropdown
        value={value}
        onChange={setValue}
        options={DEMO_OPTIONS}
        placeholder="Pick an icon…"
        searchPlaceholder="Search icons…"
        disabled={state === 'disabled'}
        className={forcedClass || undefined}
        error={isError ? "That icon isn't available in this context." : undefined}
      />
    </div>
  );
}
