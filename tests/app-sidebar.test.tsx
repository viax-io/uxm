import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

// jsdom never matches `:focus-visible`, so every focus would read as a
// pointer focus. Model keyboard focus: the focused element is focus-visible
// unless a test flips `pointerFocus` to mimic the focus a tap leaves behind.
let pointerFocus = false;
const nativeMatches = Element.prototype.matches;

describe('AppSidebar collapsedFlyout', () => {
  beforeEach(() => {
    pointerFocus = false;
    vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector: string) {
      if (selector === ':focus-visible') return !pointerFocus && this === document.activeElement;
      return nativeMatches.call(this, selector);
    });
  });
  afterEach(() => vi.restoreAllMocks());

  it('opens a hidden-from-AT flyout in <body> on focus and closes it on blur', () => {
    const item = renderRail();
    expect(flyout()).toBeNull();

    act(() => item.focus());
    const el = flyout();
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el?.parentElement).toBe(document.body);
    expect(el).toHaveTextContent('Inbox');

    act(() => item.blur());
    expect(flyout()).toBeNull();
  });

  it('opens on mouse hover and closes on leave', () => {
    const item = renderRail();
    fireEvent.pointerEnter(item, { pointerType: 'mouse' });
    expect(flyout()).toHaveTextContent('Inbox');
    fireEvent.pointerLeave(item, { pointerType: 'mouse' });
    expect(flyout()).toBeNull();
  });

  it('ignores touch hover, which never gets a matching leave', () => {
    const item = renderRail();
    fireEvent.pointerEnter(item, { pointerType: 'touch' });
    expect(flyout()).toBeNull();
  });

  it('ignores a focus that is not :focus-visible (the one a tap or click leaves)', () => {
    const item = renderRail();
    pointerFocus = true;
    act(() => item.focus());
    expect(flyout()).toBeNull();
  });

  it('drops an open flyout when the rail expands, so it cannot resurface on re-collapse', () => {
    const { rerender } = render(<AppSidebar brand={{}} sections={sections} collapsed collapsedFlyout />);
    const item = screen.getByRole('link', { name: 'Inbox' });
    act(() => item.focus());
    expect(flyout()).not.toBeNull();

    // Focus stays on the row (no blur) — e.g. a shortcut toggled `collapsed`.
    rerender(<AppSidebar brand={{}} sections={sections} collapsed={false} collapsedFlyout />);
    expect(flyout()).toBeNull();
    rerender(<AppSidebar brand={{}} sections={sections} collapsed collapsedFlyout />);
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
    act(() => item.focus());
    expect(flyout()).toBeNull();
  });
});
