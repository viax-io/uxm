#!/usr/bin/env node
// Regenerate `src/studio/i18n/source-catalog.json` — the English key list that
// every studio dictionary is measured against.
//
// Two sources, because the studio's copy lives in two different shapes:
//
//   1. THE REGISTRY (`src/studio/lib/registry/`) carries its strings as DATA —
//      `name`, `category`, and the `label` on every style property, layout
//      variant and variant option. Those are read by bundling the registry with
//      esbuild and walking the real objects, not by grepping: a label built by
//      a helper or spread in from a shared constant is invisible to a regex and
//      very visible on screen.
//
//   2. THE EDITOR-STYLE PREVIEWS (`src/previews/`) carry chrome too — but only
//      the ones that are real editors, which receive a one-argument `t` through
//      the preview shell rather than importing the studio (the layer boundary
//      forbids that). Their call shape is `t('<literal>')`, and it lands in
//      `chrome`. Demo previews have no `t` and their sample copy stays English
//      deliberately — see `PreviewTranslate` in `src/previews/types.ts`.
//
//   3. THE SHELL AND EDITORS carry theirs as `t('<ns>', '<literal>')` calls in
//      JSX. Those are scanned out of the source. Only string LITERALS are
//      matched, which is the rule: `t('chrome', `Step ${n}`)` extracts nothing
//      and must be written as an interpolated key instead.
//
// Keys are the English source strings themselves — see `src/studio/i18n/types.ts`
// for why. Run after touching the registry or adding a `t()` call; the gate
// (`npm run check:studio-i18n`) fails when this file and the dictionaries disagree.
//
// Usage: node scripts/extract-studio-i18n.mjs [--check]
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { CATALOG_PATH, readDataModule } from './_i18n-shared.mjs';

// eslint-disable-next-line no-console -- CLI summary output; this IS the program's output
const say = (msg) => console.log(msg);

const NAMESPACES = ['chrome', 'category', 'component', 'label', 'section', 'token', 'description'];
/**
 * Namespaces every locale must cover in full — see `check-studio-i18n.mjs`.
 *
 * `description` joined them once the blurbs were actually translated: an
 * ungated namespace that IS filled rots silently, because the fallback renders
 * English and nothing reports the gap. Gating costs a wording tweak 10 files;
 * not gating costs the translations themselves, one refactor at a time.
 */
const GATED = ['chrome', 'category', 'component', 'label', 'section', 'token', 'description'];

function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(p, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(p);
  }
  return out;
}

const unescape = (raw) => raw.replace(/\\(['"\\])/g, '$1');

/**
 * Collect `t('<ns>', '<literal>')` and `tp('<ns>', { one, other }, n)` from the
 * studio sources. Only string LITERALS match: a key built by interpolation
 * cannot be extracted and cannot be translated, so a counted string must be
 * written with a `{count}` placeholder rather than assembled in JSX.
 */
function scanTranslateCalls() {
  const found = Object.fromEntries(NAMESPACES.map((n) => [n, new Set()]));
  const plurals = Object.fromEntries(NAMESPACES.map((n) => [n, new Set()]));
  const ns = NAMESPACES.join('|');
  const call = new RegExp(
    `\\bt\\(\\s*['"](${ns})['"]\\s*,\\s*(['"])((?:[^'"\\\\]|\\\\.)*?)\\2\\s*[,)]`,
    'g',
  );
  const pluralCall = new RegExp(
    `\\btp\\(\\s*['"](${ns})['"]\\s*,\\s*\\{\\s*one:\\s*(['"])(?:[^'"\\\\]|\\\\.)*?\\2\\s*,`
      + `\\s*other:\\s*(['"])((?:[^'"\\\\]|\\\\.)*?)\\3\\s*,?\\s*\\}`,
    'g',
  );
  for (const file of walkFiles('src/studio')) {
    if (file.includes(`${path.sep}i18n${path.sep}`)) continue;
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(call)) found[m[1]].add(unescape(m[3]));
    // `other` is the canonical key; per-locale categories hang off it as
    // `<other>#one`, `<other>#few`, … and are expanded by the gate.
    for (const m of src.matchAll(pluralCall)) plurals[m[1]].add(unescape(m[4]));
  }

  // The editor-style previews get a ONE-argument `t` through the shell, so
  // their calls look different and always mean `chrome`.
  const previewCall = /\bt\(\s*(['"])((?:[^'"\\]|\\.)*?)\1\s*[,)]/g;
  for (const file of walkFiles('src/previews')) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(previewCall)) found.chrome.add(unescape(m[2]));
  }

  return { found, plurals };
}

const { registry, categories } = await readDataModule('src/studio/lib/registry/index.ts', 'registry');
const { SECTION_LABELS } = await readDataModule('src/studio/lib/section-labels.ts', 'sections');
const { COLOR_GROUP_LABELS } = await readDataModule('src/studio/lib/color-group-labels.ts', 'colorGroups');
const brandOptions = await readDataModule(
  'src/previews/composite/brand-settings-options.ts', 'brandOptions',
);
const { themeTokens } = await readDataModule('src/tokens/index.ts', 'tokens');
const { found: scanned, plurals } = scanTranslateCalls();

const buckets = Object.fromEntries(NAMESPACES.map((n) => [n, new Set(scanned[n])]));
for (const c of categories) buckets.category.add(c);
for (const title of Object.values(SECTION_LABELS)) buckets.section.add(title);
for (const title of Object.values(COLOR_GROUP_LABELS)) buckets.label.add(title);

// Brand Settings' closed option sets. Font NAMES are proper nouns and never
// translate — only the one label carrying a real word does. Numeric weights
// ('500', '600') are numbers, not copy, and are filtered out the same way.
const isWord = (v) => typeof v === 'string' && /[A-Za-z]{2}/.test(v);
for (const label of brandOptions.TRANSLATABLE_FONT_LABELS) buckets.chrome.add(label);
for (const set of [brandOptions.SCALE_OPTIONS, brandOptions.WEIGHT_OPTIONS,
  brandOptions.LINE_HEIGHT_OPTIONS]) {
  for (const o of set) if (isWord(o.label)) buckets.chrome.add(o.label);
}
// `label`/`short` are chrome; `sample` is specimen text and stays English.
for (const role of brandOptions.ROLES) {
  buckets.chrome.add(role.label);
  buckets.chrome.add(role.short);
}
// Brand asset rows — `title` and `hint` are chrome; the paths and geometry are not.
for (const asset of brandOptions.ASSETS) {
  buckets.chrome.add(asset.title);
  buckets.chrome.add(asset.hint);
}
for (const tok of themeTokens) buckets.token.add(tok.name);
for (const def of registry) {
  buckets.component.add(def.name);
  if (def.description) buckets.description.add(def.description);
  buckets.category.add(def.category);
  for (const p of def.styleProperties ?? []) buckets.label.add(p.label);
  for (const v of def.layoutVariants ?? []) {
    buckets.label.add(v.label);
    for (const o of v.options ?? []) buckets.label.add(typeof o === 'string' ? o : o.label);
  }
}

// A key written with a `\uXXXX` or `\n` escape in the source reads as that
// escape here but as the real character at runtime, so the lookup silently
// misses in all 24 locales. Catch it where it is cheap to fix.
for (const ns of NAMESPACES) {
  for (const key of buckets[ns]) {
    if (/\\[a-zA-Z0-9]/.test(key)) {
      console.error(`✗ ${ns} key contains a backslash escape — write the literal character instead:\n    ${key}`);
      process.exit(1);
    }
  }
}

const catalog = { _gated: GATED, _plurals: {} };
for (const ns of NAMESPACES) {
  catalog[ns] = [...buckets[ns]].filter(Boolean).sort((a, b) => a.localeCompare(b, 'en'));
}
for (const ns of NAMESPACES) {
  const forms = [...(plurals[ns] ?? [])].sort((a, b) => a.localeCompare(b, 'en'));
  if (forms.length > 0) catalog._plurals[ns] = forms;
}

const serialized = `${JSON.stringify(catalog, null, 2)}\n`;
const total = NAMESPACES.reduce((n, ns) => n + catalog[ns].length, 0);

if (process.argv.includes('--check')) {
  let current = '';
  try {
    current = readFileSync(CATALOG_PATH, 'utf8');
  } catch {
    console.error(`✗ ${CATALOG_PATH} is missing — run: node scripts/extract-studio-i18n.mjs`);
    process.exit(1);
  }
  if (current !== serialized) {
    console.error(`✗ ${CATALOG_PATH} is stale — run: node scripts/extract-studio-i18n.mjs`);
    process.exit(1);
  }
  say(`✓ source catalog current — ${total} keys`);
} else {
  writeFileSync(CATALOG_PATH, serialized);
  for (const ns of NAMESPACES) say(`  ${ns.padEnd(10)} ${catalog[ns].length}`);
  say(`✓ wrote ${CATALOG_PATH} — ${total} keys`);
}
