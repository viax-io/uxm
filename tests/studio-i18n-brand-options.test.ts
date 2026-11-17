import { describe, expect, it } from 'vitest';

import * as brandOptions from '@/previews/composite/brand-settings-options';
import catalog from '@/studio/i18n/source-catalog.json';

/**
 * Brand Settings renders its closed option sets through `t(o.label)`, a
 * dynamic key `check:studio-i18n` can't see. The extractor harvests them from a
 * hand-kept list in scripts/extract-studio-i18n.mjs, and the heading Case and
 * Tracking sets were added to the editor without being added there — so
 * 'Capitalize', 'Slight', 'Wide' and 'Wider' showed English in every locale.
 *
 * Any exported `*_OPTIONS` set whose labels are words must land in the catalog.
 * Font names are proper nouns and stay English (TRANSLATABLE_FONT_LABELS covers
 * the one that isn't), so FONT_OPTIONS is the deliberate exception.
 */
const UNTRANSLATED_SETS = new Set(['FONT_OPTIONS']);
const isWord = (v: unknown): v is string => typeof v === 'string' && /[A-Za-z]{2}/.test(v);

describe('Brand Settings option labels', () => {
  it('every word label of every *_OPTIONS set is in the studio catalog', () => {
    const chrome = new Set(catalog.chrome);
    const sets = Object.entries(brandOptions).filter(
      ([name, value]) => name.endsWith('_OPTIONS') && !UNTRANSLATED_SETS.has(name) && Array.isArray(value),
    );
    expect(sets.length, 'option sets examined').toBeGreaterThan(5);

    const missing = sets.flatMap(([name, set]) =>
      (set as { label?: unknown }[])
        .map((o) => o.label)
        .filter(isWord)
        .filter((label) => !chrome.has(label))
        .map((label) => `${name}: ${label}`),
    );
    expect(missing).toEqual([]);
  });
});
