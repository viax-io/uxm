import { cn } from '@/helpers';

import { Icon } from '../icon';
import { SidebarNavItem } from '../sidebar-nav-item';

import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface AppSidebarBrand {
  /** Wide logo (shown when expanded). */
  logoUrl?: string;
  /** Compact icon (shown when collapsed). */
  iconUrl?: string;
  /** Alt text for both logo and icon. */
  alt?: string;
}

export interface AppSidebarNavItem {
  href: string;
  label: string;
  icon?: ReactNode;
  active?: boolean;
  /** Per-item icon-tile background (e.g. model-type accent). */
  iconBg?: string;
  /** Per-item icon foreground color. */
  iconColor?: string;
  /**
   * Persistent, always-visible marker after the label (a "configured ✓", a
   * count, a small pill). Unlike `trailing` it is NOT hidden on hover, and it
   * stays visible when the sidebar is collapsed. Forwarded to `SidebarNavItem`.
   */
  badge?: ReactNode;
  /**
   * Trailing content rendered after the label (e.g. a hover-revealed × button
   * on removable nav items). Forwarded to `SidebarNavItem`. Hidden while the
   * sidebar is collapsed.
   */
  trailing?: ReactNode;
}

export interface AppSidebarSection {
  heading?: string;
  items: AppSidebarNavItem[];
}

/** One icon-tile colour pair for the `autoIconColors` palette. */
export interface AppSidebarIconColor {
  /** Icon-tile background. */
  bg: string;
  /** Icon (foreground) colour — must read on `bg`. */
  color: string;
}

/**
 * Default palette for `autoIconColors` — four design-system hue pairs (tile bg +
 * readable foreground: warm / cool / accent / indigo), cycled by item position.
 * Exported so a consumer can extend, reorder, or replace it.
 *
 * Every pair clears the 3:1 non-text-contrast floor in **both** themes — the
 * lowest is warm at 3.64:1 light / 4.10:1 dark. That "both themes" part is the
 * real constraint: a tile and its ink are separate tokens that flip
 * independently, so a pair can be comfortable in one theme and fail in the
 * other. `--color-category-composite` on `--color-text-inverse` is exactly that
 * case — 10.85:1 dark but **2.65:1 light**, because the pink tile is mid-tone
 * while the ink turns white. It is deliberately NOT in this palette. If you
 * replace these, measure both themes, not just the one you are looking at.
 */
export const DEFAULT_SIDEBAR_ICON_COLORS: AppSidebarIconColor[] = [
  { bg: 'var(--color-highlight-warm)', color: 'var(--color-on-highlight-warm)' },  // 3.64 / 4.10
  { bg: 'var(--color-highlight-cool)', color: 'var(--color-on-highlight-cool)' },  // 3.74 / 4.62
  { bg: 'var(--color-accent-subtle)', color: 'var(--color-accent-bold)' },         // 5.54 / 8.54
  { bg: 'var(--color-category-diagram)', color: 'var(--color-text-inverse)' },     // 4.47 / 6.60
];

export interface AppSidebarProps extends HTMLAttributes<HTMLElement> {
  brand: AppSidebarBrand;
  sections: AppSidebarSection[];
  collapsed?: boolean;
  onCollapseToggle?: () => void;
  footer?: ReactNode;
  /**
   * Element type used for each nav item's outer link. Defaults to plain
   * `'a'`. In a Next.js app, pass `next/link`'s `Link` so clicks do
   * client-side navigation instead of a full page reload — otherwise every
   * sidebar click tears down providers and visibly re-hydrates the
   * sidebar's contents.
   *
   * Kept as a knob (rather than hardcoded) so this library stays
   * framework-neutral. The consumer plugs in the routing primitive.
   */
  linkAs?: ElementType;
  /**
   * Auto-assign a distinct icon colour to each nav item from a palette,
   * cycling by position — a categorical scheme that makes the sidebar
   * scannable instead of a wall of same-coloured icons. `true` uses the
   * built-in {@link DEFAULT_SIDEBAR_ICON_COLORS} (four design-system hues);
   * pass an array of `{ bg, color }` to supply your own. Off by default. An
   * item that sets either `iconColor` or `iconBg` opts out of auto entirely
   * (the unset half falls to the component default), so a pinned colour is
   * never mixed with an auto half meant for a different tile — one item can
   * pin its own colour while the rest auto-fill.
   */
  autoIconColors?: boolean | AppSidebarIconColor[];
  /**
   * Whether the mobile drawer is open. Only meaningful below the 768px
   * breakpoint — at desktop widths the sidebar is always in-flow and this
   * flag is ignored. Defaults to false.
   */
  mobileOpen?: boolean;
  /** Called when the user dismisses the mobile drawer (backdrop click). */
  onMobileClose?: () => void;
  /** Accessible name for the mobile drawer's close button. Default `"Close navigation"`. */
  closeLabel?: string;
  /** Accessible name for the collapse toggle while collapsed. Default `"Expand sidebar"`. */
  expandLabel?: string;
  /** Accessible name for the collapse toggle while expanded. Default `"Collapse sidebar"`. */
  collapseLabel?: string;
}

export function AppSidebar({
  brand,
  sections,
  collapsed = false,
  onCollapseToggle,
  footer,
  linkAs,
  autoIconColors = false,
  mobileOpen = false,
  onMobileClose,
  closeLabel = 'Close navigation',
  expandLabel = 'Expand sidebar',
  collapseLabel = 'Collapse sidebar',
  className,
  ...rest
}: AppSidebarProps) {
  // Resolve the auto-colour palette once: `true` → the built-in hues, an array
  // → the caller's, anything falsy → none (icons stay monochromatic).
  const iconPalette: AppSidebarIconColor[] =
    autoIconColors === true
      ? DEFAULT_SIDEBAR_ICON_COLORS
      : Array.isArray(autoIconColors)
        ? autoIconColors
        : [];
  // Global item offset per section so the palette cycles unbroken across
  // section boundaries — adjacent items differ even over a heading.
  const sectionOffset: number[] = [];
  sections.reduce((n, section, i) => {
    sectionOffset[i] = n;
    return n + section.items.length;
  }, 0);

  return (
    <>
      {/* Mobile-only backdrop: rendered as a sibling so the consumer's
          page-shell slot still receives exactly one element (the aside)
          via fragment fall-through. Both elements are `position: fixed`,
          so they don't disrupt the consumer's flex layout. CSS hides
          both `--mobile-*` chrome at min-width: 768px. */}
      {mobileOpen && (
        <button
          type="button"
          className="uxm-app-sidebar__mobile-backdrop"
          aria-label={closeLabel}
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          'uxm-app-sidebar',
          collapsed && 'uxm-app-sidebar--collapsed',
          mobileOpen && 'uxm-app-sidebar--mobile-open',
          className,
        )}
        {...rest}
      >
      <div className="uxm-app-sidebar__header">
        {collapsed ? (
          <button
            type="button"
            className="uxm-app-sidebar__brand uxm-app-sidebar__brand--icon"
            onClick={onCollapseToggle}
            aria-label={expandLabel}
          >
            {brand.iconUrl && (
              <img src={brand.iconUrl} alt={brand.alt ?? ''} />
            )}
          </button>
        ) : (
          <>
            <span className="uxm-app-sidebar__brand">
              {brand.logoUrl && (
                <img src={brand.logoUrl} alt={brand.alt ?? ''} />
              )}
            </span>
            {onCollapseToggle && (
              <button
                type="button"
                className="uxm-app-sidebar__toggle"
                onClick={onCollapseToggle}
                aria-label={collapseLabel}
              >
                <Icon glyph="chevron-left" size={16} strokeWidth={1.5} />
              </button>
            )}
          </>
        )}
      </div>

      <nav className="uxm-app-sidebar__nav">
        {sections.map((section, idx) => (
          <div key={idx} className="uxm-app-sidebar__section">
            {section.heading && !collapsed && (
              <p className="uxm-app-sidebar__heading">{section.heading}</p>
            )}
            {section.items.map((item, itemIdx) => {
              // A per-item colour opts the item out of auto entirely: setting
              // either `iconBg` or `iconColor` suppresses the palette pair, so
              // the manual half is never spliced onto an auto half chosen for a
              // different tile (which could pair, e.g., a light bg with a light
              // foreground). Auto-fill only when the item pins neither.
              const hasManualColor = item.iconBg != null || item.iconColor != null;
              const auto =
                !hasManualColor && iconPalette.length
                  ? iconPalette[(sectionOffset[idx] + itemIdx) % iconPalette.length]
                  : undefined;
              return (
              <SidebarNavItem
                key={item.href}
                as={linkAs}
                href={item.href}
                icon={item.icon}
                active={item.active}
                iconBg={item.iconBg ?? auto?.bg}
                iconColor={item.iconColor ?? auto?.color}
                // Persistent badge stays visible even when collapsed — it's an
                // at-a-glance status marker, the opposite of the hover-reveal
                // `trailing` (which is dropped in the narrow rail).
                badge={item.badge}
                trailing={collapsed ? undefined : item.trailing}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'uxm-app-sidebar__item',
                  collapsed && 'uxm-app-sidebar__item--collapsed',
                )}
              >
                {collapsed ? '' : item.label}
              </SidebarNavItem>
              );
            })}
          </div>
        ))}
      </nav>

      {footer && !collapsed && (
        <div className="uxm-app-sidebar__footer">{footer}</div>
      )}
    </aside>
    </>
  );
}
