import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export type PageShellVariant = 'standard' | 'canvas';

/** Where the top bar sits against the sidebar. */
export type PageShellTopBarPlacement = 'beside' | 'above';

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
  /**
   * Where the top bar sits.
   *
   * - `beside` (default): the sidebar runs the full height on the left and the
   *   top bar heads the column to its right — the brand lives in the sidebar.
   * - `above`: the top bar spans the full width and the sidebar starts under
   *   it — the brand (and an app or workspace switcher) lives at the left of
   *   the top bar, and the sidebar is navigation only (pair with an
   *   `AppSidebar` without `brand`, and `toggle="edge"`).
   */
  topBarPlacement?: PageShellTopBarPlacement;
  /** Page content. */
  children: ReactNode;
}

export function PageShell({
  variant = 'standard',
  sidebar,
  topBar,
  topBarPlacement = 'beside',
  children,
  className,
  ...rest
}: PageShellProps) {
  const sidebarSlot = sidebar && <div className="uxm-page-shell__sidebar">{sidebar}</div>;
  const topBarSlot = topBar && <div className="uxm-page-shell__top-bar">{topBar}</div>;
  const content = <main className="uxm-page-shell__content">{children}</main>;
  return (
    <div
      className={cn(
        'uxm-page-shell',
        `uxm-page-shell--${variant}`,
        topBarPlacement === 'above' && 'uxm-page-shell--top-bar-above',
        className,
      )}
      {...rest}
    >
      {topBarPlacement === 'above' ? (
        <>
          {topBarSlot}
          {/* Same class as `beside`'s column so `--canvas` / `--standard`
              rules on the content read identically; here it's the row of
              sidebar and content under the full-width top bar. */}
          <div className="uxm-page-shell__body">
            {sidebarSlot}
            {content}
          </div>
        </>
      ) : (
        <>
          {sidebarSlot}
          <div className="uxm-page-shell__body">
            {topBarSlot}
            {content}
          </div>
        </>
      )}
    </div>
  );
}
