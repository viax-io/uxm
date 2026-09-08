import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Popover } from '@/ui';

function Host({ onOpenChange, open = true }: { onOpenChange: (o: boolean) => void; open?: boolean }) {
  const anchor = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button type="button" ref={anchor}>Anchor</button>
      <p>Outside</p>
      <Popover open={open} onOpenChange={onOpenChange} anchor={anchor} aria-label="Options">
        <button type="button">Inside</button>
      </Popover>
    </>
  );
}

describe('Popover', () => {
  it('renders a named dialog panel while open', async () => {
    render(<Host onOpenChange={vi.fn()} />);
    expect(await screen.findByRole('dialog', { name: 'Options' })).toBeInTheDocument();
  });

  it('asks to close on Escape', async () => {
    const onOpenChange = vi.fn();
    render(<Host onOpenChange={onOpenChange} />);
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('asks to close on an outside mousedown but not on the anchor or the panel', async () => {
    const onOpenChange = vi.fn();
    render(<Host onOpenChange={onOpenChange} />);
    await screen.findByRole('dialog');
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Anchor' }));
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Inside' }));
    expect(onOpenChange).not.toHaveBeenCalled();
    fireEvent.mouseDown(screen.getByText('Outside'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
