#!/usr/bin/env node
// Every name exported from `src/ui/index.ts` has to appear in the skill's
// component catalog.
//
// The catalog opens by claiming it lists "All N components exported from
// `@viax.io/uxm/ui`". Nothing enforced that claim, and two gates that look
// like they would both miss it:
//
//   - `tests/public-api.test.ts` snapshots the RUNTIME export names. A
//     type-only export is erased at build, so it never enters the snapshot —
//     `DataTableStackAt` (4.78.0) shipped, was advertised in SKILL.md's
//     release note, and was absent from the catalog row that lists DataTable's
//     exports. Every other DataTable type is listed there, so the omission
//     read as "this type does not exist" to anything working from the skill.
//   - `check:drift` gates CSS knobs, the type scale, tokens and studio i18n.
//     None of them read the skill's prose.
//
// The skill is what an agent reads INSTEAD of the source. A missing name there
// is not a documentation nicety — it is the library telling a consumer that a
// public export is not available.
//
// What this checks, precisely: every exported name appears somewhere in
// `component-catalog.md` inside backticks. It does NOT check that the name
// sits in the right row's "Key exports" cell — exports are spread across the
// component tables, the hooks table and the constants prose, and pinning each
// one to a cell would be brittle without catching much more. The failure this
// closes is "added an export, never mentioned it", which is the one that
// actually happens.
//
// Usage: node scripts/check-skill-catalog.mjs   (exits 1 on any omission)
import { readFileSync } from 'node:fs';

const BARREL = 'src/ui/index.ts';
const CATALOG = 'skills/viax-uxm/references/component-catalog.md';

/** Strip comments first — a name inside one is not an export. */
const strip = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');

const barrel = strip(readFileSync(BARREL, 'utf8'));

/**
 * Names from `export { … }` and `export type { … }` blocks. `a as b` exports
 * `b`, so take the right-hand side; an inline `type` qualifier is a modifier,
 * not part of the name.
 */
const exported = new Set();
for (const block of barrel.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g)) {
  for (const entry of block[1].split(',')) {
    const name = entry.trim().replace(/^type\s+/, '').split(/\s+as\s+/).pop()?.trim();
    if (name) exported.add(name);
  }
}

if (exported.size === 0) {
  console.error(`✗ no exports parsed from ${BARREL} — the check would pass vacuously`);
  process.exit(1);
}

// Underscores matter: ICON_IDS and SEARCHABLE_AUTO_THRESHOLD are exports.
const mentioned = new Set(
  [...readFileSync(CATALOG, 'utf8').matchAll(/`([A-Za-z_][A-Za-z0-9_]*)`/g)].map((m) => m[1]),
);

const missing = [...exported].filter((name) => !mentioned.has(name)).sort();

if (missing.length > 0) {
  console.error(`✗ ${missing.length} export(s) in ${BARREL} are not in the skill catalog:\n`);
  for (const name of missing) console.error(`    ${name}`);
  console.error(`\n  Add each to its component's "Key exports" cell in ${CATALOG}.`);
  console.error('  A type-only export counts: the snapshot test cannot see it, so this is the only gate that will.');
  process.exit(1);
}

// eslint-disable-next-line no-console -- CLI summary line; this IS the program's output
console.log(`OK — all ${exported.size} ui exports appear in the skill catalog`);
