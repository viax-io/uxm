import { describe, expect, it } from 'vitest';

import { contrastRatio, parseColor } from '@/lib/contrast';
import { findToken, isTokenValue, resolveHex, themeTokens } from '@/tokens';

// `@viax.io/uxm/tokens` is the brand layer consumers and the studio both read.
// Parity between `themeTokens` and `tokens/index.css` is `check:tokens`' job;
// here only the catalog's own invariants and its lookup helpers.

describe('themeTokens', () => {
  it('has a unique cssVar per entry and a variable that wraps it', () => {
    const cssVars = themeTokens.map((t) => t.cssVar);
    expect(new Set(cssVars).size).toBe(cssVars.length);
    for (const token of themeTokens) {
      expect(token.cssVar, token.name).toMatch(/^--color-[a-z0-9-]+$/);
      expect(token.variable, token.name).toBe(`var(${token.cssVar})`);
    }
  });

  it('carries a six-digit light and dark hex on every entry', () => {
    for (const token of themeTokens) {
      expect(token.hex, token.name).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(token.darkHex, token.name).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(token.name.length, token.cssVar).toBeGreaterThan(0);
    }
  });
});

describe('findToken / isTokenValue / resolveHex', () => {
  const first = themeTokens[0];

  it('finds a token by its var() string only', () => {
    expect(findToken(first.variable)).toBe(first);
    expect(findToken(first.cssVar)).toBeUndefined();
    expect(findToken(first.hex)).toBeUndefined();
    expect(findToken('var(--color-does-not-exist)')).toBeUndefined();
  });

  it('treats only var(--color-…) strings as token references', () => {
    expect(isTokenValue('var(--color-accent)')).toBe(true);
    expect(isTokenValue('var(--color-does-not-exist)')).toBe(true);
    expect(isTokenValue('var(--uxm-button-primary-background-color)')).toBe(false);
    expect(isTokenValue('#ffffff')).toBe(false);
    expect(isTokenValue('')).toBe(false);
  });

  it('resolves a known token to its light hex and passes anything else through', () => {
    expect(resolveHex(first.variable)).toBe(first.hex);
    expect(resolveHex('#123456')).toBe('#123456');
    expect(resolveHex('var(--color-does-not-exist)')).toBe('var(--color-does-not-exist)');
  });
});

// ── Contrast contract ────────────────────────────────────────────────────────
// Nothing else in the repo checks what these values MEASURE. `check:tokens`
// compares the catalog hex to tokens.css and stops there; the axe pass has
// `color-contrast` disabled because jsdom has no CSS. That gap is how
// --color-text-muted shipped at 2.37:1 and --color-text-subtle at 1.39:1 —
// both under even the 3:1 floor — with every gate green.
//
// This is a contract, not coverage: a handful of pairings that must hold for
// the library to be usable at all. Ratios are floors, not exact values, so a
// deliberate palette move doesn't churn the test; only a REGRESSION fails it.
describe('token contrast floors', () => {
  const hex = (h: string) => {
    const rgb = parseColor(h);
    if (!rgb) throw new Error(`unparseable hex: ${h}`);
    return rgb;
  };
  const ratio = (fg: string, bg: string) => contrastRatio(hex(fg), hex(bg));
  const pick = (cssVar: string) => {
    const t = themeTokens.find((x) => x.cssVar === cssVar);
    if (!t) throw new Error(`missing token: ${cssVar}`);
    return t;
  };

  // All THREE light grounds. surface-alt is the worst case and the one an
  // earlier draft of this contract missed: subtle measured 2.999:1 on it while
  // passing on surface and card.
  const LIGHT_GROUNDS = ['--color-surface', '--color-surface-alt', '--color-card'] as const;
  const DARK_GROUNDS = ['--color-surface', '--color-card'] as const;

  it('keeps --color-text-muted at the 4.5:1 AA text floor on every light ground', () => {
    const fg = pick('--color-text-muted').hex;
    for (const ground of LIGHT_GROUNDS) {
      expect(ratio(fg, pick(ground).hex), `muted on ${ground}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps --color-text-subtle at the 3:1 non-text floor on every light ground', () => {
    const fg = pick('--color-text-subtle').hex;
    for (const ground of LIGHT_GROUNDS) {
      expect(ratio(fg, pick(ground).hex), `subtle on ${ground}`).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps subtle BELOW the text floor, so it cannot quietly become a content colour', () => {
    const fg = pick('--color-text-subtle').hex;
    // Not a floor but a ceiling: if subtle ever clears 4.5:1 it has stopped
    // being the quiet level and collapsed into muted's role. That is a design
    // decision, not something to arrive at by drift.
    expect(ratio(fg, pick('--color-card').hex)).toBeLessThan(4.5);
  });

  it('keeps the accent glyph readable on the accent tint in both themes', () => {
    const bold = pick('--color-accent-bold');
    const subtle = pick('--color-accent-subtle');
    expect(ratio(bold.hex, subtle.hex), 'light').toBeGreaterThanOrEqual(4.5);
    expect(ratio(bold.darkHex, subtle.darkHex), 'dark').toBeGreaterThanOrEqual(4.5);
  });

  it('keeps dark text levels at their floors', () => {
    const muted = pick('--color-text-muted').darkHex;
    const subtle = pick('--color-text-subtle').darkHex;
    for (const ground of DARK_GROUNDS) {
      const bg = pick(ground).darkHex;
      expect(ratio(muted, bg), `dark muted on ${ground}`).toBeGreaterThanOrEqual(4.5);
      expect(ratio(subtle, bg), `dark subtle on ${ground}`).toBeGreaterThanOrEqual(3);
    }
    // NOT asserted: dark subtle on --color-surface-alt, which measures 2.85:1.
    // That is a real pre-existing miss, left visible here rather than papered
    // over — see the Unreleased note in skills/viax-uxm/SKILL.md.
  });
});
