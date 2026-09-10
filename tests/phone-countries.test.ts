import { describe, expect, it } from 'vitest';

import { CURATED_COUNTRIES, findCountry, maskNumber, maxDigitsFor } from '@/lib/phone-countries';
import type { PhoneCountry } from '@/lib/phone-countries';

// The country list and digit mask behind PhoneInput. Consumers pass their own
// `countries`, so the helpers must honour a custom list, not only the curated one.

describe('CURATED_COUNTRIES', () => {
  it('has unique ISO codes, a +-prefixed dial code and a flag on every entry', () => {
    const isos = CURATED_COUNTRIES.map((c) => c.iso);
    expect(new Set(isos).size).toBe(isos.length);
    for (const c of CURATED_COUNTRIES) {
      expect(c.iso, c.name).toMatch(/^[A-Z]{2}$/);
      expect(c.dial, c.name).toMatch(/^\+\d{1,4}$/);
      expect(c.flag, c.name).toHaveLength(4); // two regional-indicator symbols
      if (c.format !== undefined) expect(c.format, c.name).toMatch(/X/);
    }
  });
});

describe('findCountry', () => {
  it('finds a curated country by its exact ISO code and nothing else', () => {
    expect(findCountry('US')?.name).toBe('United States');
    expect(findCountry('GB')?.dial).toBe('+44');
    expect(findCountry('us')).toBeUndefined();
    expect(findCountry('+1')).toBeUndefined();
    expect(findCountry('ZZ')).toBeUndefined();
  });

  it('searches a custom list when one is given', () => {
    const custom: PhoneCountry[] = [{ iso: 'XX', name: 'Test', dial: '+999', flag: '🏳️' }];
    expect(findCountry('XX', custom)?.name).toBe('Test');
    expect(findCountry('US', custom)).toBeUndefined();
  });
});

describe('maskNumber / maxDigitsFor', () => {
  const us = findCountry('US') as PhoneCountry; // (XXX) XXX-XXXX
  const gb = findCountry('GB') as PhoneCountry; // XXXX XXX XXXX
  const de = findCountry('DE') as PhoneCountry; // no format

  it('inserts the mask literals between digits as they arrive', () => {
    expect(maskNumber('', us)).toBe('');
    expect(maskNumber('4', us)).toBe('(4');
    expect(maskNumber('415', us)).toBe('(415');
    expect(maskNumber('4155', us)).toBe('(415) 5');
    expect(maskNumber('4155551234', us)).toBe('(415) 555-1234');
    expect(maskNumber('20712345678', gb)).toBe('2071 234 5678');
  });

  it('strips non-digits first so a pasted formatted number re-masks cleanly', () => {
    expect(maskNumber('(415) 555-1234', us)).toBe('(415) 555-1234');
    expect(maskNumber('415.555.1234 ext', us)).toBe('(415) 555-1234');
  });

  it('stops at the mask length', () => {
    expect(maskNumber('41555512349999', us)).toBe('(415) 555-1234');
    expect(maxDigitsFor(us)).toBe(10);
    expect(maxDigitsFor(gb)).toBe(11);
  });

  it('returns raw digits with no format or no country, capped at the E.164 maximum', () => {
    expect(de.format).toBeUndefined();
    expect(maskNumber('+49 (30) 1234', de)).toBe('49301234');
    expect(maskNumber('+49 (30) 1234', undefined)).toBe('49301234');
    expect(maxDigitsFor(de)).toBe(15);
    expect(maxDigitsFor(undefined)).toBe(15);
  });
});
