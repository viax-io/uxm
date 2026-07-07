import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { AnchorHTMLAttributes, ReactNode } from 'react';

export interface BackLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * `href` is inherited from `AnchorHTMLAttributes` and therefore optional,
   * but an `<a>` without an `href` is not keyboard-focusable and is not
   * exposed as a link to assistive tech. Always provide `href` (or an
   * `onClick`-driven navigation target) so BackLink stays operable via
   * Tab + Enter.
   */
  href?: string;
  children: ReactNode;
}

export function BackLink({ children, className, ...rest }: BackLinkProps) {
  return (
    <a className={cn('uxm-back-link', className)} {...rest}>
      <Icon
        glyph="arrow-left"
        size={14}
        strokeWidth={2}
        className="uxm-back-link__arrow"
      />
      {children}
    </a>
  );
}
