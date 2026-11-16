import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ColorPicker } from '@/studio/editors/color-picker';
import { isFixedColor, isTranslucent, nearestColor } from '@/studio/lib/fixed-color';

/**
 * A colour knob saved as a fixed value paints the same in a dark panel, a
 * light panel and the page; a token follows each. Studio says so under the
 * picker and offers the nearest token. What needs pinning: which values count
 * as fixed, that the library's own fixed defaults and translucent shadows stay
 * quiet, and that the offer writes the token.
 */
describe('fixed colour detection', () => {
  it('treats a value that names no var as fixed', () => {
    expect(isFixedColor('#FFFFFF')).toBe(true);
    expect(isFixedColor('rgb(10, 20, 30)')).toBe(true);
    expect(isFixedColor('white')).toBe(true);
    expect(isFixedColor('var(--color-text)')).toBe(false);
    expect(isFixedColor('color-mix(in srgb, var(--color-accent) 20%, transparent)')).toBe(false);
    for (const keyword of ['', 'none', 'transparent', 'inherit', 'currentColor']) expect(isFixedColor(keyword)).toBe(false);
    expect(isFixedColor(12)).toBe(false);
  });

  it('spots translucent values, the shadows and overlays', () => {
    expect(isTranslucent('rgba(0, 0, 0, 0.12)')).toBe(true);
    expect(isTranslucent('rgb(0 0 0 / 40%)')).toBe(true);
    expect(isTranslucent('#0000001F')).toBe(true);
    expect(isTranslucent('#000F')).toBe(false);
    expect(isTranslucent('rgba(0, 0, 0, 1)')).toBe(false);
    expect(isTranslucent('#FFFFFF')).toBe(false);
  });

  it('finds the nearest opaque candidate, and none for what it cannot parse', () => {
    const candidates = [
      { item: 'white', color: '#FFFFFF' },
      { item: 'ink', color: '#1E1E1E' },
      { item: 'accent', color: '#3ECC87' },
    ];
    expect(nearestColor('#F4F4F4', candidates)).toBe('white');
    expect(nearestColor('rgb(40, 40, 40)', candidates)).toBe('ink');
    expect(nearestColor('#40C080', candidates)).toBe('accent');
    expect(nearestColor('rgba(0, 0, 0, 0.5)', candidates)).toBeUndefined();
    expect(nearestColor('rebeccapurple', candidates)).toBeUndefined();
  });
});

describe('ColorPicker fixed colour hint', () => {
  it('explains a picked fixed colour and swaps in the nearest token', () => {
    const onChange = vi.fn();
    render(<ColorPicker label="Text Color" value="#202020" defaultValue="var(--color-text)" onChange={onChange} />);
    expect(screen.getByText(/Fixed color: it won’t follow a dark or light panel\./)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Use Text' }));
    expect(onChange).toHaveBeenCalledWith('var(--color-text)');
  });

  it('stays quiet for tokens, the registry default and translucent shadows', () => {
    const { rerender } = render(<ColorPicker label="Background" value="var(--color-card)" defaultValue="var(--color-card)" onChange={() => {}} />);
    expect(screen.queryByText(/Fixed color/)).toBeNull();
    rerender(<ColorPicker label="Color" value="#123456" defaultValue="#123456" onChange={() => {}} />);
    expect(screen.queryByText(/Fixed color/)).toBeNull();
    rerender(<ColorPicker label="Color" value="rgba(0, 0, 0, 0.2)" defaultValue="var(--shadow-card-color)" onChange={() => {}} />);
    expect(screen.queryByText(/Fixed color/)).toBeNull();
  });
});
