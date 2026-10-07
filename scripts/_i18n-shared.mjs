// Shared helpers for the studio-i18n scripts: bundling a TS data module so the
// real objects can be read, and the locale catalog itself.
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { build } from 'esbuild';

export const LOCALES_DIR = 'src/studio/i18n/locales';
export const CATALOG_PATH = 'src/studio/i18n/source-catalog.json';

/** Bundle a studio/tokens TS module and import the real exports. */
export async function readDataModule(entry, name) {
  const dir = mkdtempSync(path.join(tmpdir(), 'uxm-i18n-'));
  const outfile = path.join(dir, `${name}.mjs`);
  try {
    await build({
      entryPoints: [entry],
      bundle: true,
      format: 'esm',
      platform: 'node',
      outfile,
      logLevel: 'error',
      alias: { '@': path.resolve('src') },
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      // Registry/editor modules drag in components and their styles; only the
      // data matters here.
      loader: { '.svg': 'empty', '.css': 'empty', '.scss': 'empty' },
    });
    return await import(`file://${outfile}`);
  } finally {
    setTimeout(() => rmSync(dir, { recursive: true, force: true }), 0);
  }
}

/** The shipped locale list, read from the single source of truth. */
export async function readLocales() {
  const { STUDIO_LOCALES, STUDIO_SOURCE_LOCALE } = await readDataModule(
    'src/studio/i18n/catalog.ts', 'catalog',
  );
  return {
    all: STUDIO_LOCALES,
    source: STUDIO_SOURCE_LOCALE,
    translated: STUDIO_LOCALES.filter((l) => l.tag !== STUDIO_SOURCE_LOCALE),
  };
}

/**
 * The plural categories a locale actually uses, e.g. `['one','other']` for
 * German and `['one','few','many','other']` for Ukrainian. Keeps a dictionary
 * from being forced into English's two-form shape.
 */
export function pluralCategories(tag) {
  return new Intl.PluralRules(tag).resolvedOptions().pluralCategories;
}

/** Expand a canonical plural key into the per-locale `key#category` keys. */
export function expandPluralKeys(canonical, tag) {
  return pluralCategories(tag).map((cat) => `${canonical}#${cat}`);
}

/** A TS string literal, single-quoted, with the few escapes that matter. */
export function tsString(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}
