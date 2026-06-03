import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { FilterTabs } from '@/ui';

type Styles = PreviewProps['styles'];

const INTERACTIVE_TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

/**
 * Project every registry knob as a `--uxm-filter-tabs-*` custom property
 * on the wrapper. Both the static showcase and the interactive instance
 * below read from the same vars; the showcase is inert (`pointer-events:
 * none` + `tabIndex={-1}`) so the forced state isn't overridden by real
 * input, and the interactive instance exercises the production `:hover`
 * / `:focus-visible` / `:disabled` rules on real pointer + keyboard.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-filter-tabs-track-bg': styles.trackBg as string,
    '--uxm-filter-tabs-track-border': styles.trackBorder as string,
    '--uxm-filter-tabs-track-radius': `${styles.trackRadius}px`,
    '--uxm-filter-tabs-track-padding': `${styles.trackPadding}px`,
    '--uxm-filter-tabs-gap': `${styles.gap}px`,
    '--uxm-filter-tabs-inactive-text': styles.inactiveText as string,
    '--uxm-filter-tabs-hover-bg': styles.hoverBg as string,
    '--uxm-filter-tabs-hover-text': styles.hoverText as string,
    '--uxm-filter-tabs-focus-text': styles.focusText as string,
    '--uxm-filter-tabs-focus-ring': styles.focusRing as string,
    '--uxm-filter-tabs-active-bg': styles.activeBg as string,
    '--uxm-filter-tabs-active-text': styles.activeText as string,
    '--uxm-filter-tabs-disabled-text': styles.disabledText as string,
    '--uxm-filter-tabs-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-filter-tabs-tab-radius': `${styles.tabRadius}px`,
    '--uxm-filter-tabs-padding-x': `${styles.paddingX}px`,
    '--uxm-filter-tabs-padding-y': `${styles.paddingY}px`,
    '--uxm-filter-tabs-font-size': `${styles.fontSize}px`,
    '--uxm-filter-tabs-font-weight': styles.fontWeight as string,
  } as CSSProperties;
}

/**
 * Static showcase — ONE filter chip wrapped in the track surface so the
 * full styling context reads (track bg/border + chip interior). Inert:
 * `pointer-events: none` blocks the production `:hover` from firing on
 * mouse-over, and `tabIndex={-1}` keeps the button out of the focus
 * order so `:focus-visible` can't fire from a real Tab press.
 *
 * Hand-rendered (not the real `<FilterTabs>` atom) because the atom
 * doesn't expose per-option `className` for the forced-state class.
 */
function StaticShowcase({ state }: { state: string }) {
  return (
    <div className="uxm-filter-tabs" role="tablist" style={{ pointerEvents: 'none' }}>
      <button
        type="button"
        role="tab"
        aria-selected={state === 'active'}
        tabIndex={-1}
        className={cn(
          'uxm-filter-tabs__tab',
          state === 'active' && 'uxm-filter-tabs__tab--active',
          state === 'hover' && 'uxm-filter-tabs__tab--state-hover',
          state === 'focus' && 'uxm-filter-tabs__tab--state-focus',
        )}
        disabled={state === 'disabled'}
      >
        Active
      </button>
    </div>
  );
}

export function FilterTabsPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const [active, setActive] = useState(INTERACTIVE_TABS[0].value);
  const cssVars = buildVars(styles);

  const sectionLabel = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, ...cssVars } as CSSProperties}>
      <div>
        <div style={sectionLabel}>{state} state</div>
        <StaticShowcase state={state} />
      </div>

      {/* Interactive instance — full <FilterTabs> atom with four options.
          Real `:hover` / `:focus-visible` / selection toggles exercise
          the production CSS via the projected vars above. The State
          dropdown only carries through to `disabled` here; the rest are
          exercised by real pointer + keyboard. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <FilterTabs
          value={active}
          onChange={setActive}
          options={INTERACTIVE_TABS.map((t) => ({
            value: t.value,
            label: t.label,
            disabled: state === 'disabled',
          }))}
        />
      </div>
    </div>
  );
}
