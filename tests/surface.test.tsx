import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';

import { Surface } from '@/ui';

/**
 * Surface's contract is the scope it sets: `data-theme` on its own element,
 * which is what makes tokens.css re-declare the theme's tokens for the subtree.
 * Without a theme it must set no attribute, so it follows the page.
 */
describe('Surface', () => {
  it('sets the theme scope on its own element', () => {
    render(<Surface theme="dark" data-testid="panel"><p>What happens next</p></Surface>);
    const panel = screen.getByTestId('panel');
    expect(panel).toHaveAttribute('data-theme', 'dark');
    expect(panel).toHaveClass('uxm-surface', 'uxm-surface--dark');
    expect(panel.tagName).toBe('DIV');
  });

  it('sets no scope without a theme, so the page theme applies', () => {
    render(<Surface data-testid="panel">x</Surface>);
    const panel = screen.getByTestId('panel');
    expect(panel).not.toHaveAttribute('data-theme');
    expect(panel.className).toBe('uxm-surface');
  });

  it('keeps the scope and the class in step: an unknown theme or a stray data-theme sets neither apart', () => {
    const { rerender } = render(<Surface data-testid="panel" theme={'auto' as never}>x</Surface>);
    expect(screen.getByTestId('panel')).not.toHaveAttribute('data-theme');
    expect(screen.getByTestId('panel').className).toBe('uxm-surface');
    rerender(<Surface data-testid="panel" theme="dark" {...{ 'data-theme': 'light' }}>x</Surface>);
    expect(screen.getByTestId('panel')).toHaveAttribute('data-theme', 'dark');
  });

  it('renders the requested element and writes padding to its variable', () => {
    render(<Surface theme="light" as="header" padding={12} aria-label="Store">x</Surface>);
    const header = screen.getByRole('banner', { name: 'Store' });
    expect(header).toHaveAttribute('data-theme', 'light');
    expect(header.style.getPropertyValue('--uxm-surface-padding')).toBe('12px');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Surface theme="dark" as="aside" aria-label="Next steps">
        <h2>What happens next</h2>
        <p>Your order ships in two days.</p>
      </Surface>,
    );
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
