import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Icon, Menu, ViewSwitcher, type MenuEntry } from '@/ui';

/**
 * A MenuControlRow hosts a control inside the menu. What needs pinning is the
 * line between the two: the control keeps its own clicks and keys (picking does
 * not close the menu, Enter inside it never selects a menu row), and the menu's
 * arrow nav steps over the row.
 */
function Harness({ onArchive }: { onArchive: () => void }) {
  const [mode, setMode] = useState('light');
  const items: MenuEntry[] = [
    {
      key: 'theme',
      label: 'Theme',
      control: (
        <ViewSwitcher
          value={mode}
          onChange={setMode}
          options={[
            { value: 'light', label: 'Light', icon: <Icon glyph="sun" size={14} /> },
            { value: 'dark', label: 'Dark', icon: <Icon glyph="moon" size={14} /> },
          ]}
        />
      ),
    },
    { separator: true },
    { key: 'archive', label: 'Archive', onSelect: onArchive },
  ];
  return (
    <>
      <output data-testid="mode">{mode}</output>
      <Menu items={items} renderTrigger={({ triggerProps }) => <button {...triggerProps}>Open</button>} />
    </>
  );
}

describe('Menu control row', () => {
  it('renders the row as a named group with its control', () => {
    render(<Harness onArchive={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const group = screen.getByRole('group', { name: 'Theme' });
    expect(group).toHaveClass('uxm-menu__control');
    expect(screen.getAllByRole('menuitem')).toHaveLength(1);
  });

  it('keeps the menu open when the control is used', () => {
    render(<Harness onArchive={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dark' }));
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('leaves a key pressed inside the control to the control', () => {
    const onArchive = vi.fn();
    render(<Harness onArchive={onArchive} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.keyDown(screen.getByRole('button', { name: 'Dark' }), { key: 'Enter' });
    expect(onArchive).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('still lets a Tab-focused menu item drive the menu with its keys', () => {
    // The control row's key guard must not swallow keys from the item buttons,
    // which Tab reaches from the list: ArrowDown + Enter on a focused item has
    // to move and select, as it did before control rows existed.
    const onAlpha = vi.fn();
    const onBeta = vi.fn();
    const items: MenuEntry[] = [
      { key: 'alpha', label: 'Alpha', onSelect: onAlpha },
      { key: 'beta', label: 'Beta', onSelect: onBeta },
    ];
    render(<Menu items={items} renderTrigger={({ triggerProps }) => <button {...triggerProps}>Open</button>} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const alpha = screen.getByRole('menuitem', { name: 'Alpha' });
    alpha.focus();
    fireEvent.keyDown(alpha, { key: 'ArrowDown' });
    fireEvent.keyDown(alpha, { key: 'Enter' });
    expect(onBeta).toHaveBeenCalledOnce();
    expect(onAlpha).not.toHaveBeenCalled();
  });

  it('steps arrow nav over the control row', () => {
    const onArchive = vi.fn();
    render(<Harness onArchive={onArchive} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const list = screen.getByRole('menuitem', { name: 'Archive' }).closest('.uxm-menu__list')!;
    fireEvent.keyDown(list, { key: 'ArrowDown' });
    fireEvent.keyDown(list, { key: 'Enter' });
    expect(onArchive).toHaveBeenCalledOnce();
  });
});
