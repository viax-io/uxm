import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NumberStepper } from '@/ui';

// An empty NumberStepper: `null` shows the placeholder, the buttons start
// from 0 (clamped), and emptying the field calls `onEmpty` — or, without it,
// reports 0 as before.
describe('NumberStepper — empty value', () => {
  it('shows the placeholder, not 0, while the value is null', () => {
    render(<NumberStepper value={null} onChange={vi.fn()} placeholder="Not set" aria-label="Voltage" />);
    const input = screen.getByRole('spinbutton', { name: 'Voltage' }) as HTMLInputElement;
    expect(input.value).toBe('');
    expect(input.placeholder).toBe('Not set');
  });

  it('steps from 0 when empty, clamped to min', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<NumberStepper value={null} onChange={onChange} aria-label="Voltage" />);
    await userEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(onChange).toHaveBeenLastCalledWith(1);
    rerender(<NumberStepper value={null} onChange={onChange} min={5} aria-label="Voltage" />);
    await userEvent.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(onChange).toHaveBeenLastCalledWith(5);
  });

  it('calls onEmpty when the field is emptied, and reports 0 without it', () => {
    const onChange = vi.fn();
    const onEmpty = vi.fn();
    const { rerender } = render(<NumberStepper value={12} onChange={onChange} onEmpty={onEmpty} aria-label="Voltage" />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '' } });
    expect(onEmpty).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
    rerender(<NumberStepper value={12} onChange={onChange} aria-label="Voltage" />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '' } });
    expect(onChange).toHaveBeenLastCalledWith(0);
  });
});
