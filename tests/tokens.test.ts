import { describe, expect, it } from 'vitest';

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
