'use client';

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
   * Trailing content rendered after the label (e.g. a hover-revealed × button
   * on removable nav items). Forwarded to `SidebarNavItem`.
   */
  trailing?: ReactNode;
}

export interface AppSidebarSection {
  heading?: string;
  items: AppSidebarNavItem[];
}

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
   * Whether the mobile drawer is open. Only meaningful below the 768px
   * breakpoint — at desktop widths the sidebar is always in-flow and this
   * flag is ignored. Defaults to false.
   */
  mobileOpen?: boolean;
  /** Called when the user dismisses the mobile drawer (backdrop click). */
  onMobileClose?: () => void;
}

export function AppSidebar({
  brand,
  sections,
  collapsed = false,
  onCollapseToggle,
  footer,
  linkAs,
  mobileOpen = false,
  onMobileClose,
  className,
  ...rest
}: AppSidebarProps) {
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
          aria-label="Close navigation"
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
            aria-label="Expand sidebar"
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
                aria-label="Collapse sidebar"
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
            {section.items.map((item) => (
              <SidebarNavItem
                key={item.href}
                as={linkAs}
                href={item.href}
                icon={item.icon}
                active={item.active}
                iconBg={item.iconBg}
                iconColor={item.iconColor}
                trailing={collapsed ? undefined : item.trailing}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'uxm-app-sidebar__item',
                  collapsed && 'uxm-app-sidebar__item--collapsed',
                )}
              >
                {collapsed ? '' : item.label}
              </SidebarNavItem>
            ))}
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
