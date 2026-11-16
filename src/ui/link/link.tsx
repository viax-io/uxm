import { cn } from '@/helpers';

import { Icon } from '../icon';

import type { AnchorHTMLAttributes, ElementType, ReactNode } from 'react';

export type LinkUnderline = 'none' | 'hover' | 'always';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  underline?: LinkUnderline;
  external?: boolean;
  /** Disabled links render with `aria-disabled` so the CSS disabled rule
   *  paints (and `pointer-events: none` blocks hover/active). */
  disabled?: boolean;
  /**
   * Element type used for the anchor. Defaults to `'a'`. Pass the router's
   * link component (`next/link`'s `Link`) so an in-app click navigates on the
   * client instead of reloading the document — the same knob as
   * `AppSidebar`'s `linkAs`.
   *
   * It receives `href`, `className`, `children` and every other prop the
   * native `<a>` would get. React Router's `Link` reads `to`, not `href`, so
   * wrap it in an `href` → `to` adapter rather than passing it directly.
   * Ignored when `external` is set: a link that leaves the app, in a new tab,
   * has nothing for a router to do, so it always renders a plain `<a>`.
   */
  linkAs?: ElementType;
}

export function Link({
  children,
  underline = 'hover',
  external = false,
  disabled = false,
  linkAs,
  className,
  ...rest
}: LinkProps) {
  const Component: ElementType = external ? 'a' : (linkAs ?? 'a');
  return (
    <Component
      className={cn(
        'uxm-link',
        `uxm-link--underline-${underline}`,
        external && 'uxm-link--external',
        className,
      )}
      {...(disabled ? { 'aria-disabled': true as const } : {})}
      {...rest}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external && (
        <Icon
          glyph="arrow-up-right"
          className="uxm-link__external-icon"
          aria-hidden
        />
      )}
    </Component>
  );
}
