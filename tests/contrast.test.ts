import { describe, expect, it } from 'vitest';

import {
  contrastRatio,
  hexToHsl,
  hslToHex,
  hslToRgb,
  parseColor,
  relativeLuminance,
  resolveCssColor,
  retintHue,
  rgbToHex,
  rgbToHsl,
  suggestAccessibleColor,
  suggestAccessibleToken,
  wcagLevel,
} from '@/index';
import type { HSL, RGB } from '@/lib/contrast';

// The WCAG helpers ship from the package root; a regression here is a
// consumer's contrast audit going wrong with nothing visual to show for it.

const BLACK: RGB = { r: 0, g: 0, b: 0 };
const WHITE: RGB = { r: 255, g: 255, b: 255 };

function scopeWithVars(vars: Record<string, string>): HTMLElement {
  const el = document.createElement('div');
  for (const [name, value] of Object.entries(vars)) el.style.setProperty(name, value);
  document.body.appendChild(el);
  return el;
}

describe('parseColor', () => {
  it('reads 3-, 4-, 6- and 8-digit hex, ignoring alpha and case', () => {
    expect(parseColor('#abc')).toEqual({ r: 170, g: 187, b: 204 });
    expect(parseColor('#abcf')).toEqual({ r: 170, g: 187, b: 204 });
    expect(parseColor('#AABBCC')).toEqual({ r: 170, g: 187, b: 204 });
    expect(parseColor('#aabbcc80')).toEqual({ r: 170, g: 187, b: 204 });
  });

  it('reads rgb() / rgba() in comma and space syntax, including percentages', () => {
    expect(parseColor('rgb(1, 2, 3)')).toEqual({ r: 1, g: 2, b: 3 });
    expect(parseColor('rgba(1, 2, 3, 0.5)')).toEqual({ r: 1, g: 2, b: 3 });
    expect(parseColor('rgb(1 2 3 / 50%)')).toEqual({ r: 1, g: 2, b: 3 });
    expect(parseColor('rgb(100%, 0%, 50%)')).toEqual({ r: 255, g: 0, b: 128 });
  });

  it('returns null for anything it cannot read', () => {
    expect(parseColor('')).toBeNull();
    expect(parseColor('red')).toBeNull();
    expect(parseColor('#12')).toBeNull();
    expect(parseColor('#12345')).toBeNull();
    expect(parseColor('hsl(0 0% 0%)')).toBeNull();
    expect(parseColor('rgb(1, 2)')).toBeNull();
  });

  it('resolves var() through the scope element, following nested vars and the fallback', () => {
    const scope = scopeWithVars({ '--a': '#0000ff', '--b': 'var(--a)' });
    expect(parseColor('var(--a)', scope)).toEqual({ r: 0, g: 0, b: 255 });
    expect(parseColor('var(--b)', scope)).toEqual({ r: 0, g: 0, b: 255 });
    expect(parseColor('var(--missing, #ff0000)', scope)).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColor('var(--missing)', scope)).toBeNull();
    expect(resolveCssColor('  #fff  ')).toBe('#fff');
  });
});

describe('contrastRatio / wcagLevel', () => {
  it('is 21 for black on white, 1 for a colour on itself, and symmetric', () => {
    expect(contrastRatio(BLACK, WHITE)).toBeCloseTo(21, 5);
    expect(contrastRatio(WHITE, BLACK)).toBeCloseTo(21, 5);
    const grey: RGB = { r: 119, g: 119, b: 119 };
    expect(contrastRatio(grey, grey)).toBe(1);
    expect(contrastRatio(grey, WHITE)).toBeCloseTo(contrastRatio(WHITE, grey), 10);
    expect(relativeLuminance(WHITE)).toBeCloseTo(1, 10);
    expect(relativeLuminance(BLACK)).toBe(0);
  });

  it('grades on the WCAG thresholds, inclusive at each boundary', () => {
    expect(wcagLevel(21)).toBe('AAA');
    expect(wcagLevel(7)).toBe('AAA');
    expect(wcagLevel(6.99)).toBe('AA');
    expect(wcagLevel(4.5)).toBe('AA');
    expect(wcagLevel(4.49)).toBe('AA-large');
    expect(wcagLevel(3)).toBe('AA-large');
    expect(wcagLevel(2.99)).toBe('fail');
    expect(wcagLevel(1)).toBe('fail');
  });
});

describe('colour-space conversions', () => {
  it('rgbToHex zero-pads, rounds and clamps each channel', () => {
    expect(rgbToHex({ r: 0, g: 10, b: 255 })).toBe('#000aff');
    expect(rgbToHex({ r: 1.4, g: 1.6, b: 300 })).toBe('#0102ff');
    expect(rgbToHex({ r: -5, g: 0, b: 0 })).toBe('#000000');
  });

  it('maps the primaries and greys to the expected HSL', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
    expect(rgbToHsl({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 100, l: 50 });
    expect(rgbToHsl({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 100, l: 50 });
    expect(rgbToHsl({ r: 128, g: 128, b: 128 })).toEqual({ h: 0, s: 0, l: (128 / 255) * 100 });
  });

  it('round-trips rgb → hsl → rgb and hex → hsl → hex within one step per channel', () => {
    const samples: RGB[] = [
      { r: 12, g: 200, b: 99 },
      { r: 255, g: 254, b: 0 },
      { r: 3, g: 3, b: 4 },
      { r: 180, g: 20, b: 220 },
    ];
    for (const rgb of samples) {
      const back = hslToRgb(rgbToHsl(rgb));
      expect(Math.abs(back.r - rgb.r)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.g - rgb.g)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.b - rgb.b)).toBeLessThanOrEqual(1);
    }
    for (const hex of ['#0cc863', '#fffe00', '#030304', '#b414dc']) {
      const hsl = hexToHsl(hex);
      expect(hsl).not.toBeNull();
      expect(hslToHex(hsl as HSL)).toBe(hex);
    }
    expect(hexToHsl('nope')).toBeNull();
  });

  it('hslToRgb wraps hue and clamps saturation / lightness', () => {
    expect(rgbToHex(hslToRgb({ h: 360, s: 100, l: 50 }))).toBe('#ff0000');
    expect(rgbToHex(hslToRgb({ h: -120, s: 100, l: 50 }))).toBe('#0000ff');
    expect(rgbToHex(hslToRgb({ h: 0, s: 150, l: 150 }))).toBe('#ffffff');
  });
});

describe('retintHue', () => {
  it('moves the hue and keeps saturation and lightness', () => {
    const tinted = hexToHsl(retintHue('#3366cc', 120)) as HSL;
    const source = hexToHsl('#3366cc') as HSL;
    expect(tinted.h).toBeCloseTo(120, 0);
    expect(tinted.s).toBeCloseTo(source.s, 0);
    expect(tinted.l).toBeCloseTo(source.l, 0);
  });

  it('leaves greys grey and passes unparseable input through', () => {
    expect(retintHue('#808080', 200)).toBe('#808080');
    expect(retintHue('not-a-colour', 200)).toBe('not-a-colour');
  });
});

describe('suggestAccessibleColor', () => {
  it('returns the input unchanged when it already meets the target', () => {
    expect(suggestAccessibleColor(BLACK, WHITE)).toEqual(BLACK);
    expect(suggestAccessibleColor(BLACK, WHITE, 7)).toEqual(BLACK);
  });

  it('nudges a failing colour until it meets the target ratio', () => {
    const fg: RGB = { r: 150, g: 150, b: 150 };
    for (const target of [3, 4.5, 7]) {
      const result = suggestAccessibleColor(fg, WHITE, target);
      expect(result).not.toBeNull();
      expect(contrastRatio(result as RGB, WHITE)).toBeGreaterThanOrEqual(target);
      const rgb = result as RGB;
      expect(Number.isInteger(rgb.r) && Number.isInteger(rgb.g) && Number.isInteger(rgb.b)).toBe(true);
    }
  });

  it('returns null when no colour can reach the target', () => {
    const mid: RGB = { r: 128, g: 128, b: 128 };
    expect(suggestAccessibleColor(mid, mid, 22)).toBeNull();
  });
});

describe('suggestAccessibleToken', () => {
  const candidates = [
    { variable: 'var(--light)', name: 'Light', rgb: { r: 200, g: 200, b: 200 } },
    { variable: 'var(--mid)', name: 'Mid', rgb: { r: 90, g: 90, b: 90 } },
    { variable: 'var(--dark)', name: 'Dark', rgb: { r: 20, g: 20, b: 20 } },
  ];

  it('picks the passing candidate closest to the original colour', () => {
    const fg: RGB = { r: 60, g: 60, b: 60 };
    expect(suggestAccessibleToken(fg, WHITE, 4.5, candidates)?.name).toBe('Mid');
    expect(suggestAccessibleToken(fg, WHITE, 12, candidates)?.name).toBe('Dark');
  });

  it('returns null when no candidate passes', () => {
    expect(suggestAccessibleToken(BLACK, WHITE, 22, candidates)).toBeNull();
    expect(suggestAccessibleToken(BLACK, WHITE, 4.5, [])).toBeNull();
  });
});
