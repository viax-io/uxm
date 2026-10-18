import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Listbox } from '@/ui';

const items = [
  { code: 'ua', name: 'Ukraine' },
  { code: 'pl', name: 'Poland' },
  { code: 'de', name: 'Germany' },
];
type Item = (typeof items)[number];

function Host({ onChange }: { onChange: (item: Item | null) => void }) {
  return (
    <Listbox<Item>
      items={items}
      value={null}
      onChange={onChange}
      getKey={(c) => c.code}
      getLabel={(c) => c.name}
      searchable={false}
      aria-label="Country"
      renderTrigger={({ triggerProps, selected }) => (
        <button {...triggerProps}>{selected?.name ?? 'Pick a country'}</button>
      )}
      renderItem={(c) => c.name}
    />
  );
}

describe('Listbox', () => {
  it('wires the trigger as a collapsed listbox opener', () => {
    render(<Host onChange={vi.fn()} />);
    const trigger = screen.getByRole('button', { name: 'Pick a country' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens on click, exposes the options, and selects with the keyboard', async () => {
    const onChange = vi.fn();
    render(<Host onChange={onChange} />);
    const trigger = screen.getByRole('button', { name: 'Pick a country' });
    await userEvent.click(trigger);
    const list = await screen.findByRole('listbox');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', list.id);
    expect(screen.getAllByRole('option')).toHaveLength(3);

    // Focus lands in the panel one frame after it mounts (see useFocusOnMount);
    // the arrow keys must be delivered there, not to the trigger.
    await waitFor(() => expect(list.contains(document.activeElement)).toBe(true));
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    // The panel opens with the first option active, so two ArrowDowns land on
    // the third; the commit is reported after the panel closes.
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(onChange.mock.calls[0][0]).toEqual(items[2]);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes on Escape without selecting', async () => {
    const onChange = vi.fn();
    render(<Host onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Pick a country' }));
    await screen.findByRole('listbox');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  describe('empty state means "nothing to show", not "nothing pickable"', () => {
    function EmptyHost({ list, disabled }: { list: Item[]; disabled?: boolean }) {
      return (
        <Listbox<Item>
          items={list}
          value={null}
          onChange={vi.fn()}
          getKey={(c) => c.code}
          getLabel={(c) => c.name}
          isItemDisabled={disabled ? () => true : undefined}
          searchable={false}
          emptyState="Nothing here"
          aria-label="Country"
          renderTrigger={({ triggerProps }) => <button {...triggerProps}>Pick</button>}
          renderItem={(c) => c.name}
        />
      );
    }

    it('renders every option of an all-disabled list, with no empty state', async () => {
      render(<EmptyHost list={items} disabled />);
      await userEvent.click(screen.getByRole('button', { name: 'Pick' }));
      const options = await screen.findAllByRole('option');
      expect(options).toHaveLength(items.length);
      expect(screen.queryByText('Nothing here')).not.toBeInTheDocument();
    });

    it('shows the empty state when there are no options at all', async () => {
      render(<EmptyHost list={[]} />);
      await userEvent.click(screen.getByRole('button', { name: 'Pick' }));
      expect(await screen.findByText('Nothing here')).toBeInTheDocument();
      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });
  });
});
