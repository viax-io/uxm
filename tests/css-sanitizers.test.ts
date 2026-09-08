import { describe, expect, it } from 'vitest';

import {
  safeFontFamily,
  safeFontWeight,
  safeLineHeight,
  safeTokenKey,
  safeTokenValue,
  safeTypeScale,
  safeUrl,
} from '@/studio/persistence/css-sanitizers';

// The generated stylesheet is served to every browser session, so each
// sanitizer's job is to make "break out of the declaration" impossible.
describe('css sanitizers', () => {
  it('safeUrl accepts http(s) and root-relative URLs only', () => {
    expect(safeUrl('https://cdn.example/logo.svg')).toBe('https://cdn.example/logo.svg');
    expect(safeUrl('/assets/icon.svg')).toBe('/assets/icon.svg');
    expect(safeUrl('javascript:alert(1)')).toBeUndefined();
    expect(safeUrl('data:image/svg+xml;base64,AAA')).toBeUndefined();
    expect(safeUrl('https://x/a.svg") } body { display: none } /*')).toBeUndefined();
    expect(safeUrl(42)).toBeUndefined();
  });

  it('safeFontFamily allows only a plain family name', () => {
    expect(safeFontFamily('  Space Grotesk ')).toBe('Space Grotesk');
    expect(safeFontFamily('Inter"; } body { display: none }')).toBeUndefined();
  });

  it('safeFontWeight is a closed set, numbers accepted', () => {
    expect(safeFontWeight(600)).toBe('600');
    expect(safeFontWeight('700')).toBe('700');
    expect(safeFontWeight('900')).toBeUndefined();
    expect(safeFontWeight('bold')).toBeUndefined();
  });

  it('scales and line height are ranged plain numbers', () => {
    expect(safeTypeScale('1.25')).toBe('1.25');
    expect(safeTypeScale(0.5)).toBe('0.5');
    expect(safeTypeScale('3')).toBeUndefined();
    expect(safeTypeScale('1.2px')).toBeUndefined();
    expect(safeTypeScale('abc')).toBeUndefined();
    expect(safeLineHeight(1.5)).toBe('1.5');
    expect(safeLineHeight('0.9')).toBeUndefined();
  });

  it('token keys and values cannot close a block or declaration', () => {
    expect(safeTokenKey('--color-accent')).toBe(true);
    expect(safeTokenKey('color')).toBe(false);
    expect(safeTokenKey('--x; } body {')).toBe(false);
    expect(safeTokenValue('#123456')).toBe('#123456');
    expect(safeTokenValue('var(--color-accent)')).toBe('var(--color-accent)');
    expect(safeTokenValue('red; } body { display: none }')).toBeUndefined();
    expect(safeTokenValue('a\nb')).toBeUndefined();
  });
});
