import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Viewport widths at or below which the bar moves its `search` slot onto a
 * second row. A closed set: each value is its own media query in the
 * stylesheet (a breakpoint can't come from a custom property).
 */
export type AppTopBarCollapseAt = 640 | 768 | 960 | 1024;

export interface AppTopBarProps extends HTMLAttributes<HTMLElement> {
  /** Leading brand (a logo link), first in the left column. Pair with
      `PageShell topBarPlacement="above"` and an `AppSidebar` without a brand. */
  brand?: ReactNode;
  /** Search input (use TextInput / InputWithIcon). */
  search?: ReactNode;
  /** Right-side actions (theme toggle, primary button, avatar, etc.). */
  actions?: ReactNode;
  /** Mobile-only menu trigger. Hidden on desktop via CSS. */
  onMobileMenuClick?: () => void;
  /** Accessible name for that trigger. Default `"Open navigation"`. */
  menuLabel?: string;
  /**
   * Viewport width at or below which the bar grows a second row and moves
   * the `search` slot onto it, so tabs or a wide search there stop squeezing
   * the brand and the actions. The first row keeps the bar's height. Unset,
   * the bar stays one row at every width.
   */
  collapseAt?: AppTopBarCollapseAt;
}

export function AppTopBar({
  brand,
  search,
  actions,
  onMobileMenuClick,
  menuLabel = 'Open navigation',
  collapseAt,
  className,
  ...rest
}: AppTopBarProps) {
  return (
    <header
      className={cn('uxm-app-top-bar', collapseAt !== undefined && `uxm-app-top-bar--collapse-${collapseAt}`, className)}
      {...rest}
    >
      <div className="uxm-app-top-bar__left">
        {onMobileMenuClick && (
          <button
            type="button"
            className="uxm-app-top-bar__menu"
            aria-label={menuLabel}
            onClick={onMobileMenuClick}
          >
            <Icon glyph="menu" size={20} />
          </button>
        )}
        {brand && <div className="uxm-app-top-bar__brand">{brand}</div>}
        {search && <div className="uxm-app-top-bar__search">{search}</div>}
      </div>
      {actions && <div className="uxm-app-top-bar__actions">{actions}</div>}
    </header>
  );
}
