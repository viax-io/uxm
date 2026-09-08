import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Icon, IconButton } from '@/ui';

describe('IconButton', () => {
  it('is a ghost button by default', () => {
    render(<IconButton aria-label="Close"><Icon glyph="close" /></IconButton>);
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button).toHaveClass('uxm-icon-button');
    expect(button).not.toHaveClass('uxm-icon-button--filled');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('adds the filled modifier for variant="filled"', () => {
    render(<IconButton aria-label="Add" variant="filled"><Icon glyph="close" /></IconButton>);
    expect(screen.getByRole('button', { name: 'Add' })).toHaveClass('uxm-icon-button', 'uxm-icon-button--filled');
  });
});
