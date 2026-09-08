import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Disclosure } from '@/ui';

describe('Disclosure', () => {
  it('wires aria-expanded and aria-controls per the WAI-ARIA disclosure pattern', () => {
    render(<Disclosure id="sec" label="Details" />);
    const button = screen.getByRole('button', { name: 'Details' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'sec-panel');
  });

  it('toggles itself when uncontrolled and reports the change', async () => {
    const onOpenChange = vi.fn();
    render(<Disclosure label="Details" onOpenChange={onOpenChange} />);
    const button = screen.getByRole('button', { name: 'Details' });
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveClass('uxm-disclosure--open');
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('does not change on its own when controlled', async () => {
    const onOpenChange = vi.fn();
    render(<Disclosure label="Details" open={false} onOpenChange={onOpenChange} />);
    const button = screen.getByRole('button', { name: 'Details' });
    await userEvent.click(button);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
