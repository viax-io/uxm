import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Icon, MenuButton } from '@/ui';

const ITEMS = [
  { key: 'draft', label: 'Draft', onSelect: vi.fn() },
  { key: 'open', label: 'Open', onSelect: vi.fn() },
];

/**
 * MenuButton is a composition, so what needs pinning is the wiring it exists
 * to stop consumers re-deriving: the trigger's ARIA, the ref reaching the
 * button (the menu anchors to it — a silent failure if it does not), and the
 * keyboard path. The button's own look belongs to Button*, the panel's to Menu.
 */
describe('MenuButton', () => {
  it('renders a button trigger with menu ARIA', () => {
    render(<MenuButton items={ITEMS}>Status</MenuButton>);
    const trigger = screen.getByRole('button', { name: /Status/ });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveClass('uxm-menu-button');
  });

  it('opens on click and flips aria-expanded', () => {
    render(<MenuButton items={ITEMS}>Status</MenuButton>);
    const trigger = screen.getByRole('button', { name: /Status/ });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Draft' })).toBeInTheDocument();
  });

  it('selects an item by pointer', () => {
    const onSelect = vi.fn();
    render(
      <MenuButton items={[{ key: 'a', label: 'Archive', onSelect }]}>Actions</MenuButton>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Actions/ }));
    // `mousedown`, not `click`: Menu activates rows on mousedown on purpose,
    // so focus stays on the panel and a pointer pick cannot blur-then-reopen.
    fireEvent.mouseDown(screen.getByRole('menuitem', { name: 'Archive' }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('selects an item by keyboard', () => {
    const onSelect = vi.fn();
    render(
      <MenuButton items={[{ key: 'a', label: 'Archive', onSelect }]}>Actions</MenuButton>,
    );
    const trigger = screen.getByRole('button', { name: /Actions/ });
    fireEvent.click(trigger);
    // The key router sits on the inner `.uxm-menu__list`, not on the element
    // carrying role="menu" (that is the Popover). Events bubble up, so a
    // keydown aimed at the outer node never reaches the inner handler.
    const list = screen.getByRole('menuitem', { name: 'Archive' }).closest('.uxm-menu__list');
    fireEvent.keyDown(list!, { key: 'ArrowDown' });
    fireEvent.keyDown(list!, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('renders the chevron by default and omits it on chevron={false}', () => {
    const { container, rerender } = render(<MenuButton items={ITEMS}>Status</MenuButton>);
    expect(container.querySelector('.uxm-menu-button__chevron')).not.toBeNull();
    rerender(
      <MenuButton items={ITEMS} chevron={false}>
        Status
      </MenuButton>,
    );
    expect(container.querySelector('.uxm-menu-button__chevron')).toBeNull();
  });

  it('marks the chevron open so it can rotate', () => {
    const { container } = render(<MenuButton items={ITEMS}>Status</MenuButton>);
    expect(container.querySelector('.uxm-menu-button__chevron--open')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Status/ }));
    expect(container.querySelector('.uxm-menu-button__chevron--open')).not.toBeNull();
  });

  it('picks the shipped button for the variant', () => {
    const { container, rerender } = render(<MenuButton items={ITEMS}>S</MenuButton>);
    expect(container.querySelector('.uxm-button-secondary')).not.toBeNull();
    rerender(<MenuButton items={ITEMS} variant="primary">S</MenuButton>);
    expect(container.querySelector('.uxm-button-primary')).not.toBeNull();
  });

  it('renders a leading icon before the label', () => {
    const { container } = render(
      <MenuButton items={ITEMS} icon={<Icon glyph="refresh" />}>
        Status
      </MenuButton>,
    );
    expect(container.querySelector('.uxm-menu-button svg')).not.toBeNull();
  });

  it('does not open when disabled', () => {
    render(<MenuButton items={ITEMS} disabled>Status</MenuButton>);
    const trigger = screen.getByRole('button', { name: /Status/ });
    expect(trigger).toBeDisabled();
    fireEvent.click(trigger);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
