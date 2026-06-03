import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { TabsUnderline } from '@/ui';

type Styles = PreviewProps['styles'];

const INTERACTIVE_TABS = [
  { key: 'overview', label: 'Overview', glyph: 'list' },
  { key: 'activity', label: 'Activity', glyph: 'clock' },
  { key: 'settings', label: 'Settings', glyph: 'settings' },
];

/**
 * Project every registry knob as a `--uxm-tabs-underline-*` custom
 * property on the wrapper. Both views below read from the same vars —
 * the static showcase is inert (pointer-events: none + tabIndex={-1}),
 * while the interactive instance below exercises the production
 * `:hover` / `:focus-visible` / `:disabled` rules on real input.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-tabs-underline-track-border-color': styles.trackBorderColor as string,
    '--uxm-tabs-underline-track-border-width': `${styles.trackBorderWidth}px`,
    '--uxm-tabs-underline-gap': `${styles.gap}px`,
    '--uxm-tabs-underline-inactive-text': styles.inactiveText as string,
    '--uxm-tabs-underline-hover-text': styles.hoverText as string,
    '--uxm-tabs-underline-focus-text': styles.focusText as string,
    '--uxm-tabs-underline-focus-ring': styles.focusRing as string,
    '--uxm-tabs-underline-active-text': styles.activeText as string,
    '--uxm-tabs-underline-bar-color': styles.barColor as string,
    '--uxm-tabs-underline-disabled-text': styles.disabledText as string,
    '--uxm-tabs-underline-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-tabs-underline-bar-height': `${styles.barHeight}px`,
    '--uxm-tabs-underline-bar-radius': `${styles.barRadius}px`,
    '--uxm-tabs-underline-padding-x': `${styles.paddingX}px`,
    '--uxm-tabs-underline-padding-y': `${styles.paddingY}px`,
    '--uxm-tabs-underline-font-size': `${styles.fontSize}px`,
    '--uxm-tabs-underline-font-weight': styles.fontWeight as string,
    '--uxm-tabs-underline-icon-size': `${styles.iconSize}px`,
    '--uxm-tabs-underline-icon-gap': `${styles.iconGap}px`,
  } as CSSProperties;
}

/**
 * Static showcase — ONE tab item under the track's bottom rule, with the
 * forced state mirroring the State dropdown. Inert: `pointer-events:
 * none` blocks the production `:hover` from firing on mouse-over and
 * `tabIndex={-1}` keeps the button out of the focus order so
 * `:focus-visible` can't fire from a real Tab press. The interactive
 * instance below is where real pointer/keyboard interaction exercises.
 *
 * Hand-rendered (not the real `<TabsUnderline>` atom) because the atom
 * doesn't expose per-option `className` for the forced-state class.
 */
function StaticShowcase({ state }: { state: string }) {
  // Suppress the track's bottom rule in the showcase. The track is
  // shared across all states (the State dropdown doesn't affect it),
  // so it doesn't belong in a per-state mock — and under a single tab
  // the short rule reads as ambiguous (easily mistaken for the active-
  // state underline bar). The interactive instance below shows the
  // full track context across three tabs.
  return (
    <div
      className="uxm-tabs-underline"
      role="tablist"
      style={{ pointerEvents: 'none', borderBottom: 'none' }}
    >
      <button
        type="button"
        role="tab"
        aria-selected={state === 'active'}
        tabIndex={-1}
        className={cn(
          'uxm-tabs-underline__tab',
          state === 'active' && 'uxm-tabs-underline__tab--active',
          state === 'hover' && 'uxm-tabs-underline__tab--state-hover',
          state === 'focus' && 'uxm-tabs-underline__tab--state-focus',
        )}
        disabled={state === 'disabled'}
      >
        <span className="uxm-tabs-underline__icon">
          <Icon glyph="list" />
        </span>
        <span className="uxm-tabs-underline__label">Overview</span>
      </button>
    </div>
  );
}

export function TabsUnderlinePreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const [active, setActive] = useState(INTERACTIVE_TABS[0].key);
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

      {/* Interactive instance — full <TabsUnderline> atom with three
          options. Real `:hover` / `:focus-visible` / selection toggles
          exercise the production CSS via the projected vars above. The
          State dropdown only carries through to `disabled` here; the
          remaining states are exercised by real pointer + keyboard. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <TabsUnderline
          value={active}
          onChange={setActive}
          options={INTERACTIVE_TABS.map((t) => ({
            value: t.key,
            label: t.label,
            icon: <Icon glyph={t.glyph} />,
            disabled: state === 'disabled',
          }))}
        />
      </div>
    </div>
  );
}
