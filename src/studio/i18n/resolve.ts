import { STUDIO_LOCALES, STUDIO_SOURCE_LOCALE } from './catalog';

/** Which link of the chain produced the answer — makes a surprise debuggable from one log line. */
export type StudioLocaleSource = 'exact' | 'base-language' | 'region-sibling' | 'source';

export interface ResolvedStudioLocale {
  /** A tag that is guaranteed to be in {@link STUDIO_LOCALES}. */
  tag: string;
  source: StudioLocaleSource;
}

const baseOf = (tag: string) => tag.toLowerCase().split(/[-_]/)[0];

/**
 * Map a host-supplied BCP-47 tag onto a locale the studio actually ships.
 *
 * Deliberately only three links — the studio's list is closed and
 * library-owned, so there is nothing to negotiate with a backend:
 *
 * 1. **exact** — `de` → `de`, `pt-BR` → `pt-BR` (case-insensitive).
 * 2. **base language** — `de-AT` → `de`: the region has no dictionary but the
 *    language does, and a German workbench beats an English one.
 * 3. **region sibling** — `pt-PT` → `pt-BR`: the studio ships only one region
 *    for this language, so it is the best available answer. Picks the first
 *    shipped sibling in catalog order, which is why the catalog lists the
 *    dominant region first.
 * 4. **source** — anything else falls to English. Never throws, never returns
 *    a tag with no dictionary behind it.
 *
 * Pure: no storage, no network, no `navigator`. The host decides what locale
 * the user is in; this only decides what the studio can render it as.
 */
export function resolveStudioLocale(requested: string | undefined | null): ResolvedStudioLocale {
  const tag = (requested ?? '').trim();
  if (!tag) return { tag: STUDIO_SOURCE_LOCALE, source: 'source' };

  const lower = tag.toLowerCase();
  const exact = STUDIO_LOCALES.find((l) => l.tag.toLowerCase() === lower);
  if (exact) return { tag: exact.tag, source: 'exact' };

  const base = baseOf(tag);
  const baseMatch = STUDIO_LOCALES.find((l) => l.tag.toLowerCase() === base);
  if (baseMatch) return { tag: baseMatch.tag, source: 'base-language' };

  const sibling = STUDIO_LOCALES.find((l) => baseOf(l.tag) === base);
  if (sibling) return { tag: sibling.tag, source: 'region-sibling' };

  return { tag: STUDIO_SOURCE_LOCALE, source: 'source' };
}
