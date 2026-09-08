import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { Toaster, toast } from '@/ui';

// Module-level store: clear between tests so one suite's leftovers never
// leak into the next assertion.
afterEach(() => toast.clear());

describe('Toaster + toast()', () => {
  it('renders a fired toast and removes it on dismiss', async () => {
    render(<Toaster />);
    act(() => {
      toast.success('Saved', { duration: Infinity });
    });
    expect(await screen.findByText('Saved')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
  });

  it('keeps at most `max` toasts, dropping the oldest', async () => {
    render(<Toaster max={2} />);
    act(() => {
      toast.info('one', { duration: Infinity });
      toast.info('two', { duration: Infinity });
      toast.info('three', { duration: Infinity });
    });
    expect(await screen.findByText('three')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
    expect(screen.queryByText('one')).not.toBeInTheDocument();
  });

  it('fires the inline action and dismisses', async () => {
    render(<Toaster />);
    let undone = false;
    act(() => {
      toast.info('Archived', { duration: Infinity, action: { label: 'Undo', onClick: () => { undone = true; } } });
    });
    await userEvent.click(await screen.findByRole('button', { name: 'Undo' }));
    expect(undone).toBe(true);
    expect(screen.queryByText('Archived')).not.toBeInTheDocument();
  });
});
