import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import {
  ButtonDanger, ButtonGhost, ButtonPrimary, ButtonSecondary, ButtonTertiary, Icon, IconButton,
} from '@/ui';

/**
 * The button family is the most common trigger for a `HoverTooltip` / `Popover`,
 * both of which anchor to a ref on the child. React 19 passes `ref` as an
 * ordinary prop, so these atoms are plain functions with `ref` placed on the
 * element — no `forwardRef`. What is pinned here is that the ref reaches the
 * real `<button>`: the tooltip has nothing to position against otherwise, and
 * the failure is silent (it just never appears).
 */
describe('button family forwards its ref', () => {
  it('IconButton', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<IconButton aria-label="Download" ref={ref}><Icon glyph="arrow-down" /></IconButton>);
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Download' }));
  });

  it.each([
    ['ButtonPrimary', ButtonPrimary],
    ['ButtonSecondary', ButtonSecondary],
    ['ButtonTertiary', ButtonTertiary],
    ['ButtonGhost', ButtonGhost],
    ['ButtonDanger', ButtonDanger],
  ] as const)('%s', (name, Component) => {
    const ref = createRef<HTMLButtonElement>();
    render(<Component ref={ref}>{name}</Component>);
    expect(ref.current).toBe(screen.getByRole('button', { name }));
  });

  it('keeps the ref off the DOM as an attribute', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ButtonPrimary ref={ref}>Save</ButtonPrimary>);
    expect(screen.getByRole('button').hasAttribute('ref')).toBe(false);
  });
});
