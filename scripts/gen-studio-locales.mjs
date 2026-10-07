#!/usr/bin/env node
// Scaffold or re-sync the studio dictionaries in `src/studio/i18n/locales/`.
//
// Idempotent and merge-aware: existing translations are preserved verbatim,
// keys the source catalog has gained appear as `null` (which renders the
// English source), and keys it has lost are dropped. So a registry change is
// followed by `extract` then `gen`, and the only thing left to do is fill the
// new nulls.
//
// Dictionaries are `.ts`, not `.json`, because tsup runs with `bundle: false`
// over a `src/**/*.ts` glob: a `.ts` module is compiled to ESM + CJS and typed
// by the existing DTS pass for free, where a `.json` would need a loader, a
// copy step and an import attribute to survive Node ESM.
//
// Usage:
//   node scripts/gen-studio-locales.mjs [tag ...]
//   node scripts/gen-studio-locales.mjs <tag> --from translations.json
//
// `--from` merges a flat `{ "<namespace>": { "<english source>": "<translation>" } }`
// file over what the dictionary already has — the shape a translator hands back.
// Keys absent from the JSON keep their current value, so a partial batch is a
// safe no-risk merge rather than a reset.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import {
  CATALOG_PATH, LOCALES_DIR, expandPluralKeys, readDataModule, readLocales, tsString,
} from './_i18n-shared.mjs';

// eslint-disable-next-line no-console -- CLI summary output; this IS the program's output
const say = (msg) => console.log(msg);

const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));
const namespaces = Object.keys(catalog).filter((k) => !k.startsWith('_'));
const { translated } = await readLocales();

const argv = process.argv.slice(2);
const fromIdx = argv.indexOf('--from');
const fromFile = fromIdx === -1 ? null : argv[fromIdx + 1];
const incoming = fromFile ? JSON.parse(readFileSync(fromFile, 'utf8')) : null;
const only = fromIdx === -1 ? argv : argv.slice(0, fromIdx);
const targets = only.length > 0 ? translated.filter((l) => only.includes(l.tag)) : translated;
if (targets.length === 0) {
  console.error(`✗ no matching locales. Known: ${translated.map((l) => l.tag).join(', ')}`);
  process.exit(1);
}

/** Keys a locale must carry for one namespace, plurals expanded for that locale. */
function keysFor(ns, tag) {
  const keys = [...catalog[ns]];
  for (const canonical of catalog._plurals?.[ns] ?? []) keys.push(...expandPluralKeys(canonical, tag));
  return keys.sort((a, b) => a.localeCompare(b, 'en'));
}

for (const meta of targets) {
  const file = path.join(LOCALES_DIR, `${meta.tag}.ts`);
  let existing = {};
  if (existsSync(file)) {
    ({ messages: existing = {} } = await readDataModule(file, `locale-${meta.tag}`));
  }

  const body = namespaces.map((ns) => {
    const rows = keysFor(ns, meta.tag).map((key) => {
      const current = incoming?.[ns]?.[key] ?? existing[ns]?.[key];
      const value = typeof current === 'string' && current !== '' ? tsString(current) : 'null';
      return `    ${tsString(key)}: ${value},`;
    });
    return `  ${ns}: {\n${rows.join('\n')}\n  },`;
  }).join('\n');

  const valueOf = (ns, k) => incoming?.[ns]?.[k] ?? existing[ns]?.[k];
  const filled = namespaces.reduce(
    (n, ns) => n + keysFor(ns, meta.tag).filter((k) => {
      const v = valueOf(ns, k);
      return typeof v === 'string' && v !== '';
    }).length,
    0,
  );
  const total = namespaces.reduce((n, ns) => n + keysFor(ns, meta.tag).length, 0);

  const out = `// ${meta.endonym} (${meta.tag}) — studio UI copy.
//
// Keys are the ENGLISH SOURCE STRINGS. A \`null\` value renders the key itself,
// so an untranslated entry shows readable English rather than a dotted code.
// Re-sync after a registry change with:
//   node scripts/extract-studio-i18n.mjs && node scripts/gen-studio-locales.mjs ${meta.tag}
import type { StudioLocaleMeta, StudioMessages } from '../types';

export const meta: StudioLocaleMeta = ${JSON.stringify({ tag: meta.tag, endonym: meta.endonym, dir: meta.dir })
    .replace(/"(\w+)":/g, '$1: ')
    .replace(/"/g, "'")
    .replace(/,/g, ', ')
    .replace(/\{/g, '{ ')
    .replace(/\}/g, ' }')};

export const messages: StudioMessages = {
${body}
};
`;
  writeFileSync(file, out);
  say(`  ${meta.tag.padEnd(6)} ${String(filled).padStart(4)}/${total} translated`);
}
say(`✓ ${targets.length} dictionar${targets.length === 1 ? 'y' : 'ies'} synced`);
