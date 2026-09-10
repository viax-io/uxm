import { describe, expect, it } from 'vitest';

import { CURATED_CURRENCIES, findCurrency } from '@/lib/currencies';
import type { Currency } from '@/lib/currencies';

// The currency list behind CurrencyInput. `decimals` drives both the
// Intl.NumberFormat output and the input mask, so it must stay a small integer.

describe('CURATED_CURRENCIES', () => {
  it('has unique ISO 4217 codes with a symbol and 0–3 decimals on every entry', () => {
    const codes = CURATED_CURRENCIES.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const c of CURATED_CURRENCIES) {
      expect(c.code, c.name).toMatch(/^[A-Z]{3}$/);
      expect(c.symbol.length, c.code).toBeGreaterThan(0);
      expect(Number.isInteger(c.decimals), c.code).toBe(true);
      expect(c.decimals, c.code).toBeGreaterThanOrEqual(0);
      expect(c.decimals, c.code).toBeLessThanOrEqual(3);
    }
  });

  it('keeps the zero-decimal currencies at zero', () => {
    expect(findCurrency('JPY')?.decimals).toBe(0);
    expect(findCurrency('KRW')?.decimals).toBe(0);
    expect(findCurrency('USD')?.decimals).toBe(2);
  });
});

describe('findCurrency', () => {
  it('finds a curated currency by its exact code and nothing else', () => {
    expect(findCurrency('EUR')?.symbol).toBe('€');
    expect(findCurrency('eur')).toBeUndefined();
    expect(findCurrency('€')).toBeUndefined();
    expect(findCurrency('XXX')).toBeUndefined();
  });

  it('searches a custom list when one is given', () => {
    const custom: Currency[] = [{ code: 'XTS', name: 'Test', symbol: 'T', decimals: 2 }];
    expect(findCurrency('XTS', custom)?.name).toBe('Test');
    expect(findCurrency('USD', custom)).toBeUndefined();
  });
});
