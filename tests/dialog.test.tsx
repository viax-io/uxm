import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Dialog, Modal } from '@/ui';

function Host({ onOpenChange = () => {} }: { onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open</button>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          onOpenChange(next);
          setOpen(next);
        }}
        aria-labelledby="dlg-title"
      >
        <Modal>
          <Modal.Header id="dlg-title">Add step</Modal.Header>
          <Modal.Body>
            <input aria-label="Name" />
          </Modal.Body>
          <Modal.Footer>
            <button type="button">Cancel</button>
            <button type="button">Save</button>
          </Modal.Footer>
        </Modal>
      </Dialog>
    </>
  );
}

describe('Dialog', () => {
  it('exposes a modal dialog and moves focus into it', async () => {
    render(<Host />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog', { name: 'Add step' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    // Initial focus is deferred one frame (Safari skips focus() on a node
    // that is not attached yet), so wait for it rather than assert at once.
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  });

  it('traps Tab inside the panel', async () => {
    render(<Host />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    for (let i = 0; i < 6; i += 1) {
      await userEvent.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    for (let i = 0; i < 6; i += 1) {
      await userEvent.tab({ shift: true });
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it('closes on Escape and restores focus to the opener', async () => {
    const onOpenChange = vi.fn();
    render(<Host onOpenChange={onOpenChange} />);
    const opener = screen.getByRole('button', { name: 'Open' });
    await userEvent.click(opener);
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(opener);
  });
});
