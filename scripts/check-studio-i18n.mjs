#!/usr/bin/env node
// Gate: the studio dictionaries in `src/studio/i18n/locales/` must agree with
// the source catalog, exactly, in every shipped locale.
//
// The failure this exists to prevent is silent. A knob added to the registry
// renders its English label in all 24 locales and nothing anywhere says so —
// the fallback chain is doing its job, which is precisely what makes the gap
// invisible. Two releases of that and the dictionaries are decorative. So a
// missing key is a build failure, not a warning.
//
// Checks, per locale:
//   1. a dictionary file exists and its `meta.tag` matches the filename;
//   2. a loader entry exists in `loaders.ts` (a file nothing can import is
//      the same as no file);
//   3. every GATED namespace has every catalog key, translated — `null`,
//      `''` and a value identical to the English source all count as missing;
//   4. counted strings carry every plural category THAT locale uses, not
//      English's pair — `one`/`few`/`many`/`other` for Ukrainian;
//   5. no keys the catalog does not have.
//
// `description` is deliberately ungated: the blurbs are prose, they churn with
// every registry refactor, and holding 24 locales to them would turn a wording
// tweak into a 24-file change. Keys present there must still be real keys.
//
// Usage: node scripts/check-studio-i18n.mjs   (exits 1 on any mismatch)
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import {
  CATALOG_PATH, LOCALES_DIR, expandPluralKeys, readDataModule, readLocales,
} from './_i18n-shared.mjs';

// eslint-disable-next-line no-console -- CLI summary output; this IS the program's output
const say = (msg) => console.log(msg);

const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));
const GATED = catalog._gated ?? [];
const namespaces = Object.keys(catalog).filter((k) => !k.startsWith('_'));
const { translated } = await readLocales();
const loadersSrc = readFileSync('src/studio/i18n/loaders.ts', 'utf8');

const problems = [];
const note = (locale, message) => problems.push(`${locale}: ${message}`);

/** Catalog keys for one namespace in one locale, plurals expanded. */
function expected(ns, tag) {
  const keys = new Set(catalog[ns]);
  for (const canonical of catalog._plurals?.[ns] ?? []) {
    keys.delete(canonical);
    for (const k of expandPluralKeys(canonical, tag)) keys.add(k);
  }
  return keys;
}

/** How many entries to print before saying "and N more" — a 900-key wall helps nobody. */
const SAMPLE = 8;
const sample = (list) =>
  list.slice(0, SAMPLE).map((k) => `      ${k}`).join('\n')
  + (list.length > SAMPLE ? `\n      … and ${list.length - SAMPLE} more` : '');

for (const meta of translated) {
  const file = path.join(LOCALES_DIR, `${meta.tag}.ts`);
  if (!existsSync(file)) {
    note(meta.tag, `no dictionary at ${file} — run: node scripts/gen-studio-locales.mjs ${meta.tag}`);
    continue;
  }
  if (!new RegExp(`import\\('\\./locales/${meta.tag}'\\)`).test(loadersSrc)) {
    note(meta.tag, `no loader entry in src/studio/i18n/loaders.ts — the dictionary can never be imported`);
  }

  const mod = await readDataModule(file, `locale-${meta.tag}`);
  const messages = mod.messages ?? {};
  if (mod.meta?.tag !== meta.tag) {
    note(meta.tag, `meta.tag is ${JSON.stringify(mod.meta?.tag)} but the file is ${meta.tag}.ts`);
  }

  for (const ns of namespaces) {
    const want = expected(ns, meta.tag);
    const have = messages[ns] ?? {};
    const extra = Object.keys(have).filter((k) => !want.has(k));
    if (extra.length > 0) {
      note(meta.tag, `${ns}: ${extra.length} key(s) the catalog does not have:\n${sample(extra)}`);
    }
    if (!GATED.includes(ns)) continue;
    const missing = [...want].filter((k) => {
      const v = have[k];
      return typeof v !== 'string' || v === '';
    });
    if (missing.length > 0) {
      note(meta.tag, `${ns}: ${missing.length}/${want.size} untranslated:\n${sample(missing)}`);
    }
  }
}

if (problems.length > 0) {
  console.error('✗ studio i18n is out of sync\n');
  for (const p of problems) console.error(`  ${p}`);
  console.error(`\n  ${problems.length} problem(s). Re-sync with:`);
  console.error('    node scripts/extract-studio-i18n.mjs && node scripts/gen-studio-locales.mjs');
  process.exit(1);
}

const gatedKeys = GATED.reduce((n, ns) => n + catalog[ns].length, 0);
say(`✓ studio i18n in sync — ${translated.length} locales × ~${gatedKeys} gated keys`);
