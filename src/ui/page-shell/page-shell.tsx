import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export type PageShellVariant = 'standard' | 'canvas';

export interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Layout variant — controls the content area only. The sidebar and top bar
   * always render whatever you pass.
   *
   * - `standard`: padded, scrollable content area for normal product pages.
   * - `canvas`: full-bleed, non-scrolling content area for diagram surfaces
   *   and lifecycle modelers. Pass a lighter context-specific top bar
   *   (Back + title + diagram actions) instead of the full AppTopBar.
   */
  variant?: PageShellVariant;
  /** Left navigation. Typically <AppSidebar /> from @viax.io/uxm/ui. */
  sidebar?: ReactNode;
  /** Top header — anything you want, or omit/null to render no header. */
  topBar?: ReactNode;
  /** Page content. */
  children: ReactNode;
}

export function PageShell({
  variant = 'standard',
  sidebar,
  topBar,
  children,
  className,
  ...rest
}: PageShellProps) {
  return (
    <div className={cn('uxm-page-shell', `uxm-page-shell--${variant}`, className)} {...rest}>
      {sidebar && <div className="uxm-page-shell__sidebar">{sidebar}</div>}
      <div className="uxm-page-shell__body">
        {topBar && <div className="uxm-page-shell__top-bar">{topBar}</div>}
        <main className="uxm-page-shell__content">{children}</main>
      </div>
    </div>
  );
}
