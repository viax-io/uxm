import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { HTMLAttributes, ReactNode } from 'react';

export interface AppTopBarProps extends HTMLAttributes<HTMLElement> {
  /** Search input (use TextInput / InputWithIcon). */
  search?: ReactNode;
  /** Right-side actions (theme toggle, primary button, avatar, etc.). */
  actions?: ReactNode;
  /** Mobile-only menu trigger. Hidden on desktop via CSS. */
  onMobileMenuClick?: () => void;
}

export function AppTopBar({
  search,
  actions,
  onMobileMenuClick,
  className,
  ...rest
}: AppTopBarProps) {
  return (
    <header className={cn('uxm-app-top-bar', className)} {...rest}>
      <div className="uxm-app-top-bar__left">
        {onMobileMenuClick && (
          <button
            type="button"
            className="uxm-app-top-bar__menu"
            aria-label="Open navigation"
            onClick={onMobileMenuClick}
          >
            <Icon glyph="menu" size={20} />
          </button>
        )}
        {search && <div className="uxm-app-top-bar__search">{search}</div>}
      </div>
      {actions && <div className="uxm-app-top-bar__actions">{actions}</div>}
    </header>
  );
}
