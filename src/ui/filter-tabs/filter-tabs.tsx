'use client';

import { useState } from 'react';

import { cn } from '@/helpers';

import { useRovingTabIndex } from '../../hooks/use-roving-tab-index';

import type { ElementType, HTMLAttributes, MouseEvent } from 'react';

export interface FilterTabsOption {
  value: string;
  label: string;
  /** Disabled tabs are inert and paint the disabled styling (opacity +
   *  disabled text color). Selecting one is a no-op. */
  disabled?: boolean;
  /**
   * Where the option navigates. Setting it on any option makes the bar
   * navigation: a `<nav>` of links with `aria-current="page"` on the active
   * one, instead of a `tablist`. Pass `value` as the current route.
   */
  href?: string;
}

export interface FilterTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: FilterTabsOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /**
   * The router's link component for options with an `href` (`next/link`, or
   * an `href` → `to` adapter for React Router), so a click navigates on the
   * client instead of reloading the document. Default `'a'`. Same prop as
   * `Link`, `BackLink`, `Breadcrumb` and `AppSidebar`.
   */
  linkAs?: ElementType;
}

export function FilterTabs({
  options,
  value,
  defaultValue,
  onChange,
  linkAs: LinkComponent = 'a',
  className,
  ...rest
}: FilterTabsProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue ?? options[0]?.value ?? '');
  const active = isControlled ? value : internal;

  const select = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  // Roving tabindex: only the active tab is a Tab stop; ArrowLeft/Right +
  // Home/End move (and select) within the group, matching the ARIA tabs
  // pattern's "automatic activation" model — the same thing a click does.
  const activeIndex = Math.max(0, options.findIndex((opt) => opt.value === active));
  // Runs in navigation mode too, unused there: hooks run unconditionally.
  const { getItemRef, onItemKeyDown } = useRovingTabIndex({
    count: options.length,
    activeIndex,
    isDisabled: (i) => !!options[i]?.disabled,
    onNavigate: (i) => select(options[i].value),
  });

  // Navigation: links, not tabs. A `tablist` of links is an ARIA error (a tab
  // shows a panel; a link goes somewhere), so the bar is a `<nav>`, the active
  // option carries `aria-current="page"`, and every link is its own Tab stop
  // as in any nav. Name it with `aria-label`.
  if (options.some((opt) => opt.href !== undefined)) {
    return (
      <nav className={cn('uxm-filter-tabs', className)} {...rest}>
        {options.map((opt) => {
          const isActive = opt.value === active;
          const cls = cn('uxm-filter-tabs__tab', isActive && 'uxm-filter-tabs__tab--active');
          if (opt.href === undefined) {
            return (
              <button key={opt.value} type="button" disabled={opt.disabled} className={cls} onClick={() => select(opt.value)}>
                {opt.label}
              </button>
            );
          }
          // A disabled destination isn't a link anyone can follow: no `href`,
          // out of the Tab order, announced as a dimmed link, and
          // `aria-disabled` paints the disabled styling.
          return opt.disabled ? (
            <span key={opt.value} role="link" aria-disabled="true" className={cls}>
              {opt.label}
            </span>
          ) : (
            <LinkComponent
              key={opt.value}
              href={opt.href}
              aria-current={isActive ? 'page' : undefined}
              className={cls}
              onClick={(e: MouseEvent) => {
                // A modified click opens the link elsewhere; this page stays put.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                select(opt.value);
              }}
            >
              {opt.label}
            </LinkComponent>
          );
        })}
      </nav>
    );
  }

  return (
    <div role="tablist" className={cn('uxm-filter-tabs', className)} {...rest}>
      {options.map((opt, i) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            ref={getItemRef(i)}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={i === activeIndex ? 0 : -1}
            disabled={opt.disabled}
            className={cn(
              'uxm-filter-tabs__tab',
              isActive && 'uxm-filter-tabs__tab--active',
            )}
            onClick={() => select(opt.value)}
            onKeyDown={(e) => onItemKeyDown(e, i)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
