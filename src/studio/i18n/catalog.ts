import type { StudioLocaleMeta } from './types';

/**
 * The locales the studio ships dictionaries for — a **closed, library-owned
 * list**, not something a realm or a backend configures.
 *
 * This is the whole difference between studio copy and app copy. An app's
 * locale list comes from its realm (`getSupportedLocales`) because its copy is
 * its own; the studio's furniture ships inside the library, so the library is
 * the only thing that can translate it and the only thing that knows which
 * languages it has. A host asking for a tag that isn't here degrades to the
 * base language or to English — it never fails, and it never makes the list
 * longer.
 *
 * A locale appears here **only once its dictionary is complete**. The gate
 * enforces that, and it is the reason the list is short rather than
 * aspirational: a half-filled locale is worse than an absent one, because the
 * fallback makes the gaps invisible — the user picks their language, gets a
 * panel that is two-thirds English, and nothing anywhere says why. An absent
 * tag degrades to English predictably and is honest about it.
 *
 * `en` is the source language: every key's English text IS its key, so `en`
 * needs no dictionary and can never be missing.
 *
 * Adding one is three steps — a row here, a file under `locales/`, and a
 * loader entry — plus filling it. `npm run check:studio-i18n` fails until all
 * four agree.
 *
 * `dir` is honoured end to end (the studio root carries it), but no RTL locale
 * ships today. Adding Arabic or Persian means auditing the workbench's own
 * layout, not just dropping in a dictionary.
 */
export const STUDIO_LOCALES: readonly StudioLocaleMeta[] = [
  { tag: 'en', endonym: 'English', dir: 'ltr' },
  { tag: 'de', endonym: 'Deutsch', dir: 'ltr' },
  { tag: 'es', endonym: 'Español', dir: 'ltr' },
  { tag: 'fr', endonym: 'Français', dir: 'ltr' },
  { tag: 'it', endonym: 'Italiano', dir: 'ltr' },
  { tag: 'ja', endonym: '日本語', dir: 'ltr' },
  { tag: 'nl', endonym: 'Nederlands', dir: 'ltr' },
  { tag: 'pl', endonym: 'Polski', dir: 'ltr' },
  { tag: 'pt-BR', endonym: 'Português (Brasil)', dir: 'ltr' },
  { tag: 'tr', endonym: 'Türkçe', dir: 'ltr' },
  { tag: 'uk', endonym: 'Українська', dir: 'ltr' },
];

/** The source language. Its text IS the key, so it needs no dictionary. */
export const STUDIO_SOURCE_LOCALE = 'en';

const BY_TAG = new Map(STUDIO_LOCALES.map((l) => [l.tag.toLowerCase(), l]));

/** Metadata for a shipped tag, or `undefined` if the studio has no such locale. */
export function getStudioLocaleMeta(tag: string): StudioLocaleMeta | undefined {
  return BY_TAG.get(tag.toLowerCase());
}
