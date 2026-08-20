import { cn } from '@/helpers';

import { Badge } from '../badge';

import type { AnchorHTMLAttributes, CSSProperties, ElementType, ReactNode } from 'react';

export interface SidebarNavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Icon node — typically <Icon glyph="..." /> from @modo/uxm/ui. */
  icon?: ReactNode;
  active?: boolean;
  /** Disabled items render `aria-disabled` so the CSS disabled rule
   *  paints and `pointer-events: none` blocks interaction. */
  disabled?: boolean;
  /** Override the icon-tile background color for this item (e.g. model-type accent). */
  iconBg?: string;
  /** Override the icon (foreground) color for this item. */
  iconColor?: string;
  /**
   * Persistent content after the label — for a status marker (a "configured ✓",
   * a count, a small pill). Unlike `trailing` it does not fade on hover: it
   * shows at rest, always. Renders before `trailing`, so a row can carry both a
   * persistent badge and a hover-reveal × without them colliding. (This atom has
   * no collapsed mode of its own; `AppSidebar` drops the inline badge in its
   * collapsed rail and shows `statusDot` instead, since an inline marker
   * wouldn't fit the icon tile.)
   */
  badge?: ReactNode;
  /**
   * Show a small status dot overlaid on the icon-tile corner (a `Badge` in
   * `dot` mode). This is the compact stand-in for `badge` when there's no room
   * for inline content — `AppSidebar` turns it on in its collapsed icon rail,
   * where the full `badge` is dropped. Requires `icon` (it anchors to the tile).
   */
  statusDot?: boolean;
  /**
   * Optional trailing content rendered after the label — used for hover-reveal
   * affordances like a × button on user-generated nav items. Hidden by default,
   * fades in on row hover via CSS.
   */
  trailing?: ReactNode;
  /**
   * Element type used for the outer link. Defaults to `'a'`. Pass a router
   * Link component (e.g. `next/link`'s `Link`) so clicks navigate without
   * a full page reload — full reloads tear down providers and visibly
   * re-hydrate sidebar state.
   *
   * Kept as a knob (rather than a hardcoded next/link import) so the UXM
   * library stays framework-neutral. The consumer wires the routing primitive.
   */
  as?: ElementType;
  children: ReactNode;
}

export function SidebarNavItem({
  as: Component = 'a',
  icon,
  active,
  disabled = false,
  iconBg,
  iconColor,
  badge,
  statusDot = false,
  trailing,
  children,
  className,
  ...rest
}: SidebarNavItemProps) {
  const tileStyle: CSSProperties | undefined = (iconBg || iconColor)
    ? { backgroundColor: iconBg, color: iconColor }
    : undefined;
  return (
    <Component
      aria-current={active ? 'page' : undefined}
      {...(disabled ? { 'aria-disabled': true as const, tabIndex: -1 } : {})}
      className={cn('uxm-sidebar-nav-item', active && 'uxm-sidebar-nav-item--active', className)}
      {...rest}
    >
      {icon && (
        <span className="uxm-sidebar-nav-item__icon" style={tileStyle}>
          {icon}
          {statusDot && (
            <Badge
              mode="dot"
              type="accent"
              aria-hidden
              className="uxm-sidebar-nav-item__icon-dot"
            />
          )}
        </span>
      )}
      {children && <span className="uxm-sidebar-nav-item__label">{children}</span>}
      {badge && <span className="uxm-sidebar-nav-item__badge">{badge}</span>}
      {trailing && <span className="uxm-sidebar-nav-item__trailing">{trailing}</span>}
    </Component>
  );
}
