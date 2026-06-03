import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { Tabs } from '@/ui';

type Styles = PreviewProps['styles'];

const INTERACTIVE_TABS = [
  { key: 'visual', label: 'Visual', glyph: 'list' },
  { key: 'code', label: 'Code', glyph: 'code' },
  { key: 'events', label: 'Events', glyph: 'bolt' },
];

/**
 * Project every registry knob as a `--uxm-tabs-*` custom property on the
 * wrapper. Both the static showcase and the interactive instance below
 * read from the same vars, so live editor changes flow into both views
 * and the production `:hover` / `:focus-visible` / `:disabled` rules
 * exercise on real pointer / keyboard interaction in the interactive
 * panel.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-tabs-track-bg': styles.trackBg as string,
    '--uxm-tabs-track-border': styles.trackBorder as string,
    '--uxm-tabs-track-radius': `${styles.trackRadius}px`,
    '--uxm-tabs-track-padding': `${styles.trackPadding}px`,
    '--uxm-tabs-gap': `${styles.gap}px`,
    '--uxm-tabs-inactive-text': styles.inactiveText as string,
    '--uxm-tabs-hover-bg': styles.hoverBg as string,
    '--uxm-tabs-hover-text': styles.hoverText as string,
    '--uxm-tabs-focus-text': styles.focusText as string,
    '--uxm-tabs-focus-ring': styles.focusRing as string,
    '--uxm-tabs-active-bg': styles.activeBg as string,
    '--uxm-tabs-active-text': styles.activeText as string,
    '--uxm-tabs-disabled-text': styles.disabledText as string,
    '--uxm-tabs-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-tabs-tab-radius': `${styles.tabRadius}px`,
    '--uxm-tabs-padding-x': `${styles.paddingX}px`,
    '--uxm-tabs-padding-y': `${styles.paddingY}px`,
    '--uxm-tabs-font-size': `${styles.fontSize}px`,
    '--uxm-tabs-font-weight': styles.fontWeight as string,
    '--uxm-tabs-icon-size': `${styles.iconSize}px`,
    '--uxm-tabs-icon-gap': `${styles.iconGap}px`,
  } as CSSProperties;
}

/**
 * Static showcase — ONE tab item wrapped in the track surface so the
 * full styling context reads (track bg/border + tab interior). The
 * forced state mirrors the State variant: hover/focus engage the
 * `--state-*` modifier classes (which mirror the `:hover` / `:focus-
 * visible` rules), active engages the existing `--active` class, and
 * disabled engages the HTML `disabled` attribute (which drives the
 * `:disabled` rule).
 *
 * Hand-rendered (not the real `<Tabs>` atom) because Tabs doesn't expose
 * per-option `className` for the showcase's forced-state class. The
 * interactive instance below uses the real atom — so the production CSS
 * still exercises on real interaction.
 */
function StaticShowcase({ state }: { state: string }) {
  // Inert: `pointer-events: none` blocks the production `:hover` rule
  // from firing on mouse-over, and `tabIndex={-1}` keeps the button out
  // of the focus order so `:focus-visible` can't fire from a real Tab
  // press. Without these, the default-state showcase would paint hover
  // styling whenever the cursor crossed it, defeating the purpose of
  // the "forced state" mock. The interactive instance below is where
  // real pointer/keyboard interaction is supposed to exercise.
  return (
    <div className="uxm-tabs" role="tablist" style={{ width: 200, pointerEvents: 'none' }}>
      <button
        type="button"
        role="tab"
        aria-selected={state === 'active'}
        tabIndex={-1}
        className={cn(
          'uxm-tabs__tab',
          state === 'active' && 'uxm-tabs__tab--active',
          state === 'hover' && 'uxm-tabs__tab--state-hover',
          state === 'focus' && 'uxm-tabs__tab--state-focus',
        )}
        disabled={state === 'disabled'}
      >
        <span className="uxm-tabs__icon">
          <Icon glyph="list" />
        </span>
        <span className="uxm-tabs__label">Visual</span>
      </button>
    </div>
  );
}

export function TabsPreview({ styles, variants }: PreviewProps) {
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

      {/* Interactive instance — full <Tabs> atom with three options.
          Real `:hover` / `:focus-visible` / selection toggles exercise
          the production CSS via the projected vars above. The State
          dropdown only carries through for the `disabled` case — the
          remaining states (hover, focus, active) are exercised by
          actually hovering, tabbing, and clicking the tabs. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <Tabs
          value={active}
          onChange={setActive}
          options={INTERACTIVE_TABS.map((t) => ({
            value: t.key,
            label: t.label,
            icon: <Icon glyph={t.glyph} />,
            disabled: state === 'disabled',
          }))}
          style={{ width: 320 }}
        />
      </div>
    </div>
  );
}
