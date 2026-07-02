import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { ViewSwitcher } from '@/ui';

type Styles = PreviewProps['styles'];
type View = 'grid' | 'list';

// `list-lines` (4 horizontal lines) is the right glyph here — registry's
// `list` has bullets, which is a different visual.
const VIEW_GLYPH: Record<View, string> = {
  grid: 'grid',
  list: 'list-lines',
};

/**
 * Project every registry knob as a `--uxm-view-switcher-*` custom
 * property on the wrapper. Both the static showcase and the interactive
 * instance below read from the same vars; the showcase is inert so the
 * forced state isn't overridden by real input, while the interactive
 * instance exercises the production `:hover` / `:focus-visible` /
 * `:disabled` rules on real pointer + keyboard.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-view-switcher-track-bg': styles.trackBg as string,
    '--uxm-view-switcher-track-border': styles.trackBorder as string,
    '--uxm-view-switcher-track-radius': `${styles.trackRadius}px`,
    '--uxm-view-switcher-track-padding': `${styles.trackPadding}px`,
    '--uxm-view-switcher-gap': `${styles.gap}px`,
    '--uxm-view-switcher-inactive-icon': styles.inactiveIcon as string,
    '--uxm-view-switcher-hover-bg': styles.hoverBg as string,
    '--uxm-view-switcher-hover-icon': styles.hoverIcon as string,
    '--uxm-view-switcher-focus-icon': styles.focusIcon as string,
    '--uxm-view-switcher-focus-ring': styles.focusRing as string,
    '--uxm-view-switcher-active-bg': styles.activeBg as string,
    '--uxm-view-switcher-active-icon': styles.activeIcon as string,
    '--uxm-view-switcher-disabled-icon': styles.disabledIcon as string,
    '--uxm-view-switcher-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-view-switcher-button-size': `${styles.buttonSize}px`,
    '--uxm-view-switcher-button-radius': `${styles.buttonRadius}px`,
    '--uxm-view-switcher-icon-size': `${styles.iconSize}px`,
  } as CSSProperties;
}

/**
 * Static showcase — ONE icon button wrapped in the track surface so the
 * full styling context reads (track bg/border + button interior). Inert:
 * `pointer-events: none` blocks the production `:hover` from firing on
 * mouse-over, and `tabIndex={-1}` keeps the button out of the focus
 * order so `:focus-visible` can't fire from a real Tab press.
 *
 * Hand-rendered (not the real `<ViewSwitcher>` atom) because the atom
 * doesn't expose per-option `className` for the forced-state class.
 */
function StaticShowcase({ state }: { state: string }) {
  return (
    <div className="uxm-view-switcher" role="group" style={{ pointerEvents: 'none' }}>
      <button
        type="button"
        aria-pressed={state === 'active'}
        aria-label="Grid view"
        tabIndex={-1}
        className={cn(
          'uxm-view-switcher__button',
          state === 'active' && 'uxm-view-switcher__button--active',
          state === 'hover' && 'uxm-view-switcher__button--state-hover',
          state === 'focus' && 'uxm-view-switcher__button--state-focus',
        )}
        disabled={state === 'disabled'}
      >
        <Icon glyph={VIEW_GLYPH.grid} />
      </button>
    </div>
  );
}

export function ViewSwitcherPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const [view, setView] = useState<View>('grid');
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

      {/* Interactive instance — full <ViewSwitcher> atom with two icon
          buttons. Real `:hover` / `:focus-visible` / selection toggles
          exercise the production CSS via the projected vars above. The
          State dropdown only carries through to `disabled` here; the
          rest are exercised by real pointer + keyboard. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <ViewSwitcher
          value={view}
          onChange={(v) => setView(v as View)}
          options={[
            {
              value: 'grid',
              label: 'Grid view',
              icon: <Icon glyph={VIEW_GLYPH.grid} />,
              disabled: state === 'disabled',
            },
            {
              value: 'list',
              label: 'List view',
              icon: <Icon glyph={VIEW_GLYPH.list} />,
              disabled: state === 'disabled',
            },
          ]}
        />
      </div>
    </div>
  );
}
