import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { ExplorerListItem } from '@/ui';

type Styles = PreviewProps['styles'];

const INTERACTIVE_ROWS = [
  { key: 'button-primary', name: 'Button — Primary', trailing: 'Buttons' },
  { key: 'tabs', name: 'Tabs', trailing: 'Composite' },
  { key: 'tag', name: 'Tag', trailing: 'Display' },
  { key: 'input-with-icon', name: 'Input with Icon', trailing: 'Inputs' },
];

/**
 * Project every registry knob as a `--uxm-explorer-list-item-*` custom
 * property on the wrapper. Both the static showcase and the interactive
 * list below read from the same vars; the showcase is inert so the
 * forced state isn't overridden by real input, and the interactive
 * list exercises `:hover` / `:focus-visible` / `:disabled` / `--active`
 * on real pointer + keyboard.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-explorer-list-item-inactive-bg': styles.inactiveBg as string,
    '--uxm-explorer-list-item-inactive-text': styles.inactiveText as string,
    '--uxm-explorer-list-item-hover-bg': styles.hoverBg as string,
    '--uxm-explorer-list-item-hover-text': styles.hoverText as string,
    '--uxm-explorer-list-item-focus-text': styles.focusText as string,
    '--uxm-explorer-list-item-focus-ring': styles.focusRing as string,
    '--uxm-explorer-list-item-active-bg': styles.activeBg as string,
    '--uxm-explorer-list-item-active-text': styles.activeText as string,
    '--uxm-explorer-list-item-disabled-bg': styles.disabledBg as string,
    '--uxm-explorer-list-item-disabled-text': styles.disabledText as string,
    '--uxm-explorer-list-item-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-explorer-list-item-border-radius': `${styles.borderRadius}px`,
    '--uxm-explorer-list-item-padding-x': `${styles.paddingX}px`,
    '--uxm-explorer-list-item-padding-y': `${styles.paddingY}px`,
    '--uxm-explorer-list-item-font-size': `${styles.fontSize}px`,
    '--uxm-explorer-list-item-font-weight': styles.fontWeight as string,
    '--uxm-explorer-list-item-gap': `${styles.gap}px`,
    '--uxm-explorer-list-item-rail-color': styles.railColor as string,
    '--uxm-explorer-list-item-rail-width': `${styles.railWidth}px`,
    '--uxm-explorer-list-item-rail-height': `${styles.railHeight}px`,
    '--uxm-explorer-list-item-rail-radius': `${styles.railRadius}px`,
    '--uxm-explorer-list-item-trailing-color': styles.trailingColor as string,
    '--uxm-explorer-list-item-trailing-size': `${styles.trailingSize}px`,
  } as CSSProperties;
}

/**
 * Static showcase — ONE explorer row rendered with the forced-state
 * class matching the State dropdown. Inert: `pointer-events: none`
 * blocks `:hover` from firing on mouse-over and `tabIndex={-1}` keeps
 * the button out of the focus order so `:focus-visible` can't fire
 * from real keyboard input. Hand-rendered (not the real
 * `<ExplorerListItem>` atom) because the atom doesn't expose a way to
 * set the showcase-only `--state-*` modifier class.
 */
function StaticShowcase({ state }: { state: string }) {
  const isActive = state === 'active';
  const isDisabled = state === 'disabled';
  return (
    <button
      type="button"
      aria-pressed={isActive}
      tabIndex={-1}
      disabled={isDisabled}
      className={cn(
        'uxm-explorer-list-item',
        isActive && 'uxm-explorer-list-item--active',
        state === 'hover' && 'uxm-explorer-list-item--state-hover',
        state === 'focus' && 'uxm-explorer-list-item--state-focus',
      )}
      style={{ pointerEvents: 'none' }}
    >
      {isActive && <span className="uxm-explorer-list-item__rail" aria-hidden="true" />}
      <span className="uxm-explorer-list-item__label">Tabs</span>
      <span className="uxm-explorer-list-item__trailing">Composite</span>
    </button>
  );
}

export function ExplorerListItemPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const [activeKey, setActiveKey] = useState(INTERACTIVE_ROWS[1].key);
  const cssVars = buildVars(styles);

  const sectionLabel = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 280, ...cssVars } as CSSProperties}>
      <div>
        <div style={sectionLabel}>{state} state</div>
        <StaticShowcase state={state} />
      </div>

      {/* Interactive instance — four real <ExplorerListItem> atoms in a
          vertical list. Real `:hover` / `:focus-visible` and the
          aria-pressed active styling exercise the production CSS via
          the projected vars above. Clicking a row makes it the active
          item. The State dropdown only carries through to `disabled`
          here (applied to the third row so the disabled styling reads
          alongside enabled rows); the rest are exercised by real
          pointer + keyboard. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {INTERACTIVE_ROWS.map((row, i) => (
            <ExplorerListItem
              key={row.key}
              name={row.name}
              trailing={row.trailing}
              active={row.key === activeKey}
              disabled={state === 'disabled' && i === 2}
              onClick={() => setActiveKey(row.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
