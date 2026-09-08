import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RadioGroup, RadioOption } from '@/ui';

describe('RadioGroup', () => {
  it('is a radiogroup that forwards id and aria-describedby (FormField wires the label)', () => {
    render(
      <>
        <p id="plan-hint">Pick one</p>
        <RadioGroup name="plan" id="plan" aria-describedby="plan-hint">
          <RadioOption name="plan" value="free">Free</RadioOption>
          <RadioOption name="plan" value="pro">Pro</RadioOption>
        </RadioGroup>
      </>,
    );
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAttribute('id', 'plan');
    expect(group).toHaveAttribute('aria-describedby', 'plan-hint');
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('reports the picked value from the option', async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup name="plan">
        <RadioOption name="plan" value="free" onChange={onChange}>Free</RadioOption>
        <RadioOption name="plan" value="pro" onChange={onChange}>Pro</RadioOption>
      </RadioGroup>,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(onChange).toHaveBeenCalledWith('pro', expect.anything());
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
  });
});
