import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { FixedColorHint } from '@/studio/editors/fixed-color-hint';
import { isFixedColor, isTranslucent, nearestColor, sameColorValue } from '@/studio/lib/fixed-color';
import { PropertyRow } from '@/studio/shell/properties-panel/property-row';

/**
 * A colour knob saved as a fixed value paints the same in a dark panel, a
 * light panel and the page; a token follows each. Studio says so under the
 * knob and offers the nearest token. What needs pinning: which values count
 * as fixed (and which it stays quiet on), that the library's own fixed
 * defaults and translucent shadows stay quiet, that the offer writes the
 * token, and that the hint sits outside the box the reset button centres on.
 */
describe('fixed colour detection', () => {
  it('treats a value that names no var as fixed', () => {
    for (const v of ['#FFFFFF', '#fff', '  #1e1e1e  ', 'rgb(10, 20, 30)', 'hsl(0 0% 20%)', 'white']) {
      expect(isFixedColor(v)).toBe(true);
    }
    expect(isFixedColor('var(--color-text)')).toBe(false);
    expect(isFixedColor('var( --color-text )')).toBe(false);
    expect(isFixedColor(12)).toBe(false);
  });

  it('stays quiet on what follows the theme or what it cannot judge', () => {
    for (const v of ['', 'none', 'transparent', 'inherit', 'currentColor', 'Canvas', 'CanvasText',
      'light-dark(#fff, #000)', 'color-mix(in srgb, #000 20%, transparent)',
      'color-mix(in srgb, var(--color-accent) 20%, transparent)']) {
      expect(isFixedColor(v)).toBe(false);
    }
  });

  it('spots translucent values, the shadows and overlays', () => {
    expect(isTranslucent('rgba(0, 0, 0, 0.12)')).toBe(true);
    expect(isTranslucent('rgb(0 0 0 / 40%)')).toBe(true);
    expect(isTranslucent('rgb(0 0 0 / .4)')).toBe(true);
    expect(isTranslucent('#0000001F')).toBe(true);
    expect(isTranslucent('#000F')).toBe(false);
    expect(isTranslucent('rgba(0, 0, 0, 1)')).toBe(false);
    expect(isTranslucent('#FFFFFF')).toBe(false);
  });

  it('compares values ignoring case and spacing', () => {
    expect(sameColorValue('rgba(0,0,0,0.12)', ' RGBA(0, 0, 0, 0.12) ')).toBe(true);
    expect(sameColorValue('#fff', '#ffffff')).toBe(false);
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
    expect(nearestColor('hsl(0 0% 20%)', candidates)).toBeUndefined();
  });
});

describe('FixedColorHint', () => {
  it('explains a picked fixed colour and swaps in the nearest token', () => {
    const onChange = vi.fn();
    render(<FixedColorHint label="Text Color" value="#202020" defaultValue="var(--color-text)" onChange={onChange} />);
    expect(screen.getByText(/Fixed color: it won’t follow a dark or light panel\./)).toBeInTheDocument();
    const use = screen.getByRole('button', { name: 'Use Text for Text Color' });
    expect(use).toHaveTextContent('Use Text');
    fireEvent.click(use);
    expect(onChange).toHaveBeenCalledWith('var(--color-text)');
  });

  it('explains a fixed colour it cannot match, with no offer', () => {
    render(<FixedColorHint label="Text Color" value="white" defaultValue={undefined} onChange={() => {}} />);
    expect(screen.getByText(/Fixed color/)).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('stays quiet for tokens, the registry default and translucent shadows', () => {
    const { container, rerender } = render(<FixedColorHint label="Background" value="var(--color-card)" defaultValue="var(--color-card)" onChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<FixedColorHint label="Color" value="#123456" defaultValue=" #123456" onChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<FixedColorHint label="Color" value="rgba(0, 0, 0, 0.2)" defaultValue="var(--shadow-card-color)" onChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('sits under the row, outside the box the reset button centres on', () => {
    render(
      <PropertyRow cascadeCount={0} onCascade={() => {}} category="Display" propLabel="Text Color" synced={false}
        justMatched={false} isOverridden onReset={() => {}} below={<p data-testid="hint">hint</p>}>
        <span>picker</span>
      </PropertyRow>,
    );
    const reset = screen.getByRole('button', { name: 'Reset Text Color to default' });
    expect(reset.parentElement).not.toContainElement(screen.getByTestId('hint'));
    expect(reset.parentElement).toHaveTextContent('picker');
  });
});
