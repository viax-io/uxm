import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { AppSidebar } from '@/ui';
import type { AppSidebarProps } from '@/ui';

const sections: AppSidebarProps['sections'] = [
  { items: [{ href: '/inbox', label: 'Inbox' }, { href: '/orders', label: 'Orders' }] },
];

const flyout = () => document.body.querySelector('.uxm-app-sidebar__flyout');

function renderRail(props: Partial<AppSidebarProps> = {}) {
  render(<AppSidebar brand={{}} sections={sections} collapsed collapsedFlyout {...props} />);
  return screen.getByRole('link', { name: 'Inbox' });
}

describe('AppSidebar collapsedFlyout', () => {
  it('opens a hidden-from-AT flyout in <body> on focus and closes it on blur', () => {
    const item = renderRail();
    expect(flyout()).toBeNull();

    fireEvent.focus(item);
    const el = flyout();
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el?.parentElement).toBe(document.body);
    expect(el).toHaveTextContent('Inbox');

    fireEvent.blur(item);
    expect(flyout()).toBeNull();
  });

  it('opens on hover and closes on mouse leave', () => {
    const item = renderRail();
    fireEvent.mouseEnter(item);
    expect(flyout()).toHaveTextContent('Inbox');
    fireEvent.mouseLeave(item);
    expect(flyout()).toBeNull();
  });

  it('closes on Escape without moving focus', async () => {
    const item = renderRail();
    act(() => item.focus());
    expect(flyout()).not.toBeNull();
    await userEvent.keyboard('{Escape}');
    expect(flyout()).toBeNull();
    expect(item).toHaveFocus();
  });

  it('drops the native title only when the flyout is on', () => {
    const { unmount } = render(<AppSidebar brand={{}} sections={sections} collapsed />);
    expect(screen.getByRole('link', { name: 'Inbox' })).toHaveAttribute('title', 'Inbox');
    unmount();
    expect(renderRail()).not.toHaveAttribute('title');
  });

  it('does nothing while expanded', () => {
    const item = renderRail({ collapsed: false });
    fireEvent.focus(item);
    expect(flyout()).toBeNull();
  });
});
