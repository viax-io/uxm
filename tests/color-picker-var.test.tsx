import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ColorPicker } from '@/studio/editors/color-picker';

/**
 * Card's shadow knob defaults to `var(--shadow-card-color)`, a variable outside
 * the `--color-*` palette. The picker used to treat it as a literal: the custom
 * field opened on the `var(...)` text, which "Apply" rejects, and the native
 * input, which only takes `#rrggbb`, fell back to black.
 */
describe('ColorPicker with a variable outside the palette', () => {
  afterEach(() => {
    document.documentElement.style.removeProperty('--shadow-card-color');
  });

  it('opens the custom field on the resolved colour, alpha kept', () => {
    document.documentElement.style.setProperty('--shadow-card-color', 'rgba(0, 0, 0, 0.12)');
    const { container } = render(<ColorPicker label="Color" value="var(--shadow-card-color)" onChange={() => {}} />);
    fireEvent.click(container.querySelector('button[aria-haspopup]')!);
    fireEvent.click(screen.getByText(/Custom color/));
    expect(screen.getByPlaceholderText('#000000')).toHaveValue('#0000001f');
    expect(document.body.querySelector('input[type="color"]')).toHaveValue('#000000');
  });
});
