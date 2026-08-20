import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { SidebarNavItem } from '@/ui';

type Styles = PreviewProps['styles'];

const INTERACTIVE_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', glyph: 'grid' },
  { key: 'motions', label: 'Revenue Motions', glyph: 'sparkle' },
  { key: 'history', label: 'Business Interactions', glyph: 'history' },
];

/**
 * Project every registry knob as a `--uxm-sidebar-nav-item-*` custom
 * property on the wrapper. Both the static showcase and the interactive
 * list below read from the same vars; the showcase is inert so the
 * forced state isn't overridden by real input, and the interactive
 * list exercises `:hover` / `:focus-visible` / `:disabled` / `--active`
 * on real pointer + keyboard.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-sidebar-nav-item-inactive-bg': styles.inactiveBg as string,
    '--uxm-sidebar-nav-item-inactive-text': styles.inactiveText as string,
    '--uxm-sidebar-nav-item-hover-bg': styles.hoverBg as string,
    '--uxm-sidebar-nav-item-hover-text': styles.hoverText as string,
    '--uxm-sidebar-nav-item-focus-text': styles.focusText as string,
    '--uxm-sidebar-nav-item-focus-ring': styles.focusRing as string,
    '--uxm-sidebar-nav-item-active-bg': styles.activeBg as string,
    '--uxm-sidebar-nav-item-active-text': styles.activeText as string,
    '--uxm-sidebar-nav-item-disabled-bg': styles.disabledBg as string,
    '--uxm-sidebar-nav-item-disabled-text': styles.disabledText as string,
    '--uxm-sidebar-nav-item-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-sidebar-nav-item-border-radius': `${styles.borderRadius}px`,
    '--uxm-sidebar-nav-item-padding-x': `${styles.paddingX}px`,
    '--uxm-sidebar-nav-item-padding-y': `${styles.paddingY}px`,
    '--uxm-sidebar-nav-item-gap': `${styles.gap}px`,
    '--uxm-sidebar-nav-item-font-size': `${styles.fontSize}px`,
    '--uxm-sidebar-nav-item-font-weight': styles.fontWeight as string,
    '--uxm-sidebar-nav-item-icon-bg': styles.iconBg as string,
    '--uxm-sidebar-nav-item-icon-color': styles.iconColor as string,
    '--uxm-sidebar-nav-item-icon-box-size': `${styles.iconBoxSize}px`,
    '--uxm-sidebar-nav-item-icon-radius': `${styles.iconRadius}px`,
    '--uxm-sidebar-nav-item-icon-size': `${styles.iconSize}px`,
  } as CSSProperties;
}

/**
 * Static showcase — ONE nav item rendered with the forced-state class
 * matching the State dropdown. Inert: `pointer-events: none` blocks
 * `:hover` from firing on mouse-over and `tabIndex={-1}` keeps the
 * anchor out of the focus order so `:focus-visible` can't fire from
 * real keyboard input. Hand-rendered (not the real `<SidebarNavItem>`
 * atom) because the atom doesn't expose a way to set the showcase-only
 * `--state-*` modifier class.
 */
function StaticShowcase({ state }: { state: string }) {
  const isActive = state === 'active';
  const isDisabled = state === 'disabled';
  return (
    <a
      href="#preview"
      onClick={(e) => e.preventDefault()}
      tabIndex={-1}
      aria-current={isActive ? 'page' : undefined}
      {...(isDisabled ? { 'aria-disabled': true } : {})}
      className={cn(
        'uxm-sidebar-nav-item',
        isActive && 'uxm-sidebar-nav-item--active',
        state === 'hover' && 'uxm-sidebar-nav-item--state-hover',
        state === 'focus' && 'uxm-sidebar-nav-item--state-focus',
      )}
      style={{ pointerEvents: 'none' }}
    >
      <span className="uxm-sidebar-nav-item__icon">
        <Icon glyph="grid" />
      </span>
      <span className="uxm-sidebar-nav-item__label">Dashboard</span>
    </a>
  );
}

export function SidebarNavItemPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const badgeVariant = (variants.badge as string) ?? 'off';
  const [activeKey, setActiveKey] = useState(INTERACTIVE_ITEMS[0].key);
  const cssVars = buildVars(styles);

  // Sample content for the persistent `badge` slot, driven by the Badge knob.
  // A checkmark (status marker) or a small count pill — both render inline via
  // `currentColor`, so the `--uxm-sidebar-nav-item-badge-color` default shows.
  const badgeFor = (i: number) => {
    if (badgeVariant === 'check') return <Icon glyph="check" size={14} />;
    if (badgeVariant === 'count') {
      return (
        <span style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>{[3, 1, 8][i] ?? 0}</span>
      );
    }
    return undefined;
  };

  const sectionLabel = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 260, ...cssVars } as CSSProperties}>
      <div>
        <div style={sectionLabel}>{state} state</div>
        <StaticShowcase state={state} />
      </div>

      {/* Interactive instance — three real <SidebarNavItem> atoms in a
          vertical list. Real `:hover` / `:focus-visible` and the
          aria-current="page" active styling exercise the production
          CSS via the projected vars above. Clicking a row makes it the
          active item. The State dropdown only carries through to
          `disabled` here (applied to the second item so the disabled
          styling reads alongside enabled rows); the rest are exercised
          by real pointer + keyboard. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {INTERACTIVE_ITEMS.map((it, i) => (
            <SidebarNavItem
              key={it.key}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveKey(it.key);
              }}
              active={it.key === activeKey}
              disabled={state === 'disabled' && i === 1}
              icon={<Icon glyph={it.glyph} />}
              badge={badgeFor(i)}
            >
              {it.label}
            </SidebarNavItem>
          ))}
        </div>
      </div>
    </div>
  );
}
