import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { AnchorHTMLAttributes, ElementType, ReactNode } from 'react';

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
  /**
   * Element type used for the anchor. Defaults to `'a'`. Pass the router's
   * link component (`next/link`'s `Link`) so going back navigates on the
   * client instead of reloading the document — the same knob as
   * `AppSidebar`'s `linkAs`. It receives `href`, `className`, `children` and
   * the rest of the anchor props; React Router's `Link` reads `to`, so wrap
   * it in an `href` → `to` adapter.
   */
  linkAs?: ElementType;
}

export function BackLink({ children, className, linkAs: Component = 'a', ...rest }: BackLinkProps) {
  return (
    <Component className={cn('uxm-back-link', className)} {...rest}>
      <Icon
        glyph="arrow-left"
        size={14}
        strokeWidth={2}
        className="uxm-back-link__arrow"
      />
      {children}
    </Component>
  );
}
