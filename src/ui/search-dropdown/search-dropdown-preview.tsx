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
    '--uxm-search-dropdown-popover-bg': styles.popoverBg as string,
    '--uxm-search-dropdown-popover-border': styles.popoverBorder as string,
    '--uxm-search-dropdown-popover-radius': `${styles.popoverRadius}px`,
    '--uxm-search-dropdown-popover-max-height': `${styles.popoverMaxHeight}px`,
    '--uxm-search-dropdown-option-padding-x': `${styles.optionPaddingX}px`,
    '--uxm-search-dropdown-option-padding-y': `${styles.optionPaddingY}px`,
    '--uxm-search-dropdown-option-font-size': `${styles.optionFontSize}px`,
    '--uxm-search-dropdown-option-radius': `${styles.optionRadius}px`,
    '--uxm-search-dropdown-option-hover-bg': styles.optionHoverBg as string,
    '--uxm-search-dropdown-option-active-bg': styles.optionActiveBg as string,
    '--uxm-search-dropdown-option-active-color': styles.optionActiveColor as string,
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
    state === 'error' && 'uxm-search-dropdown--error',
  );

  return (
    <div style={cssVars}>
      <SearchDropdown
        value={value}
        onChange={setValue}
        options={DEMO_OPTIONS}
        placeholder="Pick an icon…"
        searchPlaceholder="Search icons…"
        disabled={state === 'disabled'}
        className={forcedClass || undefined}
      />
      {isError && (
        <p
          style={{
            fontSize: (styles.triggerErrorMessageSize as number) ?? 12,
            color: styles.triggerErrorColor as string,
            marginTop: 4,
          }}
        >
          That icon isn&apos;t available in this context.
        </p>
      )}
    </div>
  );
}
