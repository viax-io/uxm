import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { RadioGroup, RadioOption } from '@/ui';

/**
 * The card variant is a presentation change on a native radio group. What has
 * to survive it is the part consumers were losing when they hand-wired
 * clickable Cards instead: the radiogroup role, the checked state, and native
 * single-select. Those are pinned here; the tile chrome is verified in the
 * portal.
 */
function Picker({ variant }: { variant?: 'default' | 'card' }) {
  const [value, setValue] = useState('main-left');
  return (
    <RadioGroup name="layout" variant={variant} value={value} onChange={setValue}>
      <RadioOption value="main-left">Main left</RadioOption>
      <RadioOption value="main-right">Main right</RadioOption>
    </RadioGroup>
  );
}

describe('RadioGroup card variant', () => {
  it('keeps the radiogroup role and native radio semantics', () => {
    render(<Picker variant="card" />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).toBeChecked();
    expect(radios[1]).not.toBeChecked();
  });

  it('selects on click and deselects the sibling', async () => {
    render(<Picker variant="card" />);
    const [first, second] = screen.getAllByRole('radio');
    second.click();
    expect(second).toBeChecked();
    expect(first).not.toBeChecked();
  });

  it('renders the tile body and hides the circle by default', () => {
    const { container } = render(<Picker variant="card" />);
    expect(container.querySelectorAll('.uxm-radio__card')).toHaveLength(2);
    expect(container.querySelector('.uxm-radio--indicator-corner')).toBeNull();
    // The circle stays in the DOM as a sibling of the input — CSS hides it —
    // so every existing checked/hover/focus rule keeps its selector.
    expect(container.querySelectorAll('.uxm-radio__circle')).toHaveLength(2);
  });

  it('marks the corner indicator when asked', () => {
    const { container } = render(
      <RadioGroup name="l2" variant="card" indicator="corner" value="a" onChange={() => {}}>
        <RadioOption value="a">A</RadioOption>
      </RadioGroup>,
    );
    expect(container.querySelector('.uxm-radio--indicator-corner')).not.toBeNull();
  });

  it('leaves the default presentation untouched', () => {
    const { container } = render(<Picker />);
    expect(container.querySelector('.uxm-radio-group--card')).toBeNull();
    expect(container.querySelector('.uxm-radio__card')).toBeNull();
    expect(container.querySelectorAll('.uxm-radio__label')).toHaveLength(2);
  });
});
