import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';

import { FilterTabs } from '@/ui';

import { compiledCss } from './compiled-css';

import type { AnchorHTMLAttributes } from 'react';

/**
 * Options with an `href` turn FilterTabs into navigation. Links aren't tabs, so
 * what needs pinning is the switch of semantics: a `<nav>` of links with
 * `aria-current="page"`, no `tablist` / `tab` roles left behind, the router's
 * link used when one is passed, and the tab mode untouched when no option has
 * an `href`.
 */
const SECTIONS = [
  { value: 'home', label: 'Home', href: '/' },
  { value: 'orders', label: 'Orders', href: '/orders' },
  { value: 'gear', label: 'Your equipment', href: '/gear', disabled: true },
];

function RouterLink({ href, onClick, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      data-router-link=""
      href={href}
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault();
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

describe('FilterTabs navigation', () => {
  it('renders a nav of links, the active one marked as the current page', () => {
    render(<FilterTabs aria-label="Sections" options={SECTIONS} value="orders" />);
    const nav = screen.getByRole('navigation', { name: 'Sections' });
    expect(nav).toHaveClass('uxm-filter-tabs');
    expect(screen.queryByRole('tablist')).toBeNull();
    expect(screen.queryByRole('tab')).toBeNull();
    const orders = screen.getByRole('link', { name: 'Orders' });
    expect(orders).toHaveAttribute('href', '/orders');
    expect(orders).toHaveAttribute('aria-current', 'page');
    expect(orders).toHaveClass('uxm-filter-tabs__tab', 'uxm-filter-tabs__tab--active');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('renders a disabled destination as a dimmed link that cannot be followed', () => {
    render(<FilterTabs aria-label="Sections" options={SECTIONS} value="home" />);
    const gear = screen.getByRole('link', { name: 'Your equipment' });
    expect(gear.tagName).toBe('SPAN');
    expect(gear).toHaveAttribute('aria-disabled', 'true');
    expect(gear).not.toHaveAttribute('href');
  });

  it('goes through the router link and still reports the pick', () => {
    const onChange = vi.fn();
    render(<FilterTabs aria-label="Sections" options={SECTIONS} defaultValue="home" linkAs={RouterLink} onChange={onChange} />);
    const orders = screen.getByRole('link', { name: 'Orders' });
    expect(orders).toHaveAttribute('data-router-link');
    fireEvent.click(orders);
    expect(onChange).toHaveBeenCalledWith('orders');
    // Uncontrolled: the clicked link becomes the current page.
    expect(orders).toHaveAttribute('aria-current', 'page');
  });

  it('leaves the selection alone on a modified click, which opens the link elsewhere', () => {
    const onChange = vi.fn();
    render(<FilterTabs aria-label="Sections" options={SECTIONS} defaultValue="home" onChange={onChange} />);
    fireEvent.click(screen.getByRole('link', { name: 'Orders' }), { metaKey: true });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('has no axe violations', async () => {
    const { container } = render(<FilterTabs aria-label="Sections" options={SECTIONS} value="orders" />);
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  it('keeps the tab mode when no option has an href', () => {
    render(<FilterTabs aria-label="Filter" options={[{ value: 'all', label: 'All' }, { value: 'open', label: 'Open' }]} />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.queryByRole('navigation')).toBeNull();
    // A tablist still selects the first tab when nothing is passed.
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
  });

  it('marks no link current without value or defaultValue', () => {
    // It can't know the route, and the first link used to be announced as the
    // current page whatever page the user was on.
    render(<FilterTabs aria-label="Sections" options={SECTIONS} />);
    for (const link of screen.getAllByRole('link')) {
      expect(link).not.toHaveAttribute('aria-current');
      expect(link).not.toHaveClass('uxm-filter-tabs__tab--active');
    }
    fireEvent.click(screen.getByRole('link', { name: 'Orders' }));
    expect(screen.getByRole('link', { name: 'Orders' })).toHaveAttribute('aria-current', 'page');
  });

  it('marks a picked button in a nav as current, not only by its styling', () => {
    const mixed = [...SECTIONS, { value: 'help', label: 'Help' }];
    render(<FilterTabs aria-label="Sections" options={mixed} value="help" />);
    const help = screen.getByRole('button', { name: 'Help' });
    expect(help).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('keeps a host link rule from underlining the tabs', () => {
    // The plain `.uxm-filter-tabs__tab` reset is (0,1,0) and lost to a host's
    // `a:hover { text-decoration: underline }` (0,1,1).
    const css = compiledCss('src/ui/filter-tabs/filter-tabs.scss');
    expect(css).toMatch(/\.uxm-filter-tabs \.uxm-filter-tabs__tab\s*\{\s*text-decoration:\s*none/);
  });
});
