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

describe('AppSidebar edge toggle', () => {
  it('names the action in its label and carries no aria-expanded', () => {
    // Label + aria-expanded together read as "Collapse sidebar, expanded".
    const onCollapseToggle = vi.fn();
    const { rerender } = render(
      <AppSidebar sections={sections} toggle="edge" onCollapseToggle={onCollapseToggle} />,
    );
    const collapse = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(collapse).not.toHaveAttribute('aria-expanded');
    fireEvent.click(collapse);
    expect(onCollapseToggle).toHaveBeenCalledOnce();

    rerender(<AppSidebar sections={sections} toggle="edge" collapsed onCollapseToggle={onCollapseToggle} />);
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).not.toHaveAttribute('aria-expanded');
  });
});

describe('AppSidebar item count', () => {
  const glyph = <svg aria-hidden />;
  const renderCount = (item: Partial<AppSidebarProps['sections'][number]['items'][number]>, collapsed: boolean) => {
    const { container } = render(
      <AppSidebar
        brand={{}}
        collapsed={collapsed}
        sections={[{ items: [{ href: '/inbox', label: 'Inbox', icon: glyph, ...item }] }]}
      />,
    );
    return {
      tileCount: () => container.querySelector('.uxm-sidebar-nav-item__icon-count'),
      inline: () => container.querySelector('.uxm-sidebar-nav-item__badge'),
      dot: () => container.querySelector('.uxm-sidebar-nav-item__icon-dot'),
    };
  };

  it('keeps the number on the collapsed tile, hidden from AT, and in the row name', () => {
    const { tileCount, dot } = renderCount({ count: 12 }, true);
    expect(screen.getByRole('link', { name: /^Inbox ?12$/ })).toBeTruthy();
    expect(tileCount()?.textContent).toBe('12');
    expect(tileCount()?.getAttribute('aria-hidden')).toBe('true');
    expect(dot()).toBeNull();
  });

  it('shows the count inline while expanded, with no tile badge', () => {
    const { tileCount, inline } = renderCount({ count: 12 }, false);
    expect(screen.getByRole('link', { name: /^Inbox ?12$/ })).toBeTruthy();
    expect(inline()?.textContent).toBe('12');
    expect(tileCount()).toBeNull();
  });

  it('shows nothing for 0 or no count, in either state', () => {
    for (const collapsed of [true, false]) {
      for (const count of [0, undefined]) {
        const { tileCount, inline, dot } = renderCount({ count }, collapsed);
        expect([tileCount(), inline(), dot()]).toEqual([null, null, null]);
        document.body.innerHTML = '';
      }
    }
  });

  it('caps the number at countMax (99 by default)', () => {
    expect(renderCount({ count: 150 }, true).tileCount()?.textContent).toBe('99+');
    document.body.innerHTML = '';
    expect(renderCount({ count: 12, countMax: 9 }, true).tileCount()?.textContent).toBe('9+');
  });

  it('lets badge win over count, keeping the dot when collapsed', () => {
    const { tileCount, inline, dot } = renderCount({ count: 12, badge: <span>new</span> }, true);
    expect(inline()?.textContent).toBe('new');
    expect(dot()).toBeTruthy();
    expect(tileCount()).toBeNull();
  });
});
