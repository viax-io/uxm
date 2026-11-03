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
// Two guards keep that check honest:
//
//   - The barrel parser reads `export { … }` and `export type { … }` only,
//     which is every form `src/ui/index.ts` uses. Any other form — `export *`,
//     `export const`, `export function`, `export default` — would have its names
//     silently skipped, so the check would pass while missing them. Such a line
//     fails the run instead: teach the parser the form, or keep the barrel to
//     named re-exports.
//   - The reverse direction, scoped to where it is exact: every name in a
//     component row's "Key exports" cell has to still be exported. A removed or
//     renamed type-only export otherwise stays advertised — the runtime
//     snapshot cannot see it, for the same reason as above. Prose elsewhere in
//     the catalog is not checked this way: it backticks props, CSS variables
//     and removed names in breaking-change notes, which are meant to be there.
//
// Usage: node scripts/check-skill-catalog.mjs   (exits 1 on any failure)
import { readFileSync } from 'node:fs';

const BARREL = 'src/ui/index.ts';
const CATALOG = 'skills/viax-uxm/references/component-catalog.md';

/** Strip comments first — a name inside one is not an export. */
const strip = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');

const barrel = strip(readFileSync(BARREL, 'utf8'));

const unsupported = barrel
  .split('\n')
  .map((line, i) => ({ line: line.trim(), no: i + 1 }))
  .filter(({ line }) => /^export\b/.test(line) && !/^export\s+(?:type\s+)?\{/.test(line));

if (unsupported.length > 0) {
  console.error(`✗ ${BARREL} uses an export form this check cannot read:\n`);
  for (const { line, no } of unsupported) console.error(`    ${no}: ${line}`);
  console.error('\n  Its names would be skipped and the check would pass without them.');
  console.error('  Re-export by name (`export { … } from`), or teach scripts/check-skill-catalog.mjs the form.');
  process.exit(1);
}

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

const catalog = readFileSync(CATALOG, 'utf8');

// Underscores matter: ICON_IDS and SEARCHABLE_AUTO_THRESHOLD are exports.
const mentioned = new Set([...catalog.matchAll(/`([A-Za-z_][A-Za-z0-9_]*)`/g)].map((m) => m[1]));

/**
 * Names in the second cell of each component row (`| **Name** | `A`, `B` | …`).
 * The first cell can carry a parenthesised version but never a pipe.
 */
const advertised = [...catalog.matchAll(/^\| \*\*[^|\n]*\|([^|\n]*)\|/gm)].flatMap((row) =>
  [...row[1].matchAll(/`([^`]+)`/g)].map((m) => m[1]),
);

if (advertised.length === 0) {
  console.error(`✗ no "Key exports" cells parsed from ${CATALOG} — the stale check would pass vacuously`);
  process.exit(1);
}

const advertisedNames = new Set(advertised);
const stale = [...advertisedNames].filter((name) => !exported.has(name)).sort();

const missing = [...exported].filter((name) => !mentioned.has(name)).sort();

if (missing.length > 0) {
  console.error(`✗ ${missing.length} export(s) in ${BARREL} are not in the skill catalog:\n`);
  for (const name of missing) console.error(`    ${name}`);
  console.error(`\n  Add each to its component's "Key exports" cell in ${CATALOG}.`);
  console.error('  A type-only export counts: the snapshot test cannot see it, so this is the only gate that will.');
  process.exit(1);
}

if (stale.length > 0) {
  console.error(`✗ ${stale.length} name(s) in the catalog's "Key exports" cells are not exported from ${BARREL}:\n`);
  for (const name of stale) console.error(`    ${name}`);
  console.error('\n  Removed or renamed? Drop the name from its row, or rename it there too.');
  console.error('  A removal belongs in a breaking-change note, not in a row listing what you can import.');
  process.exit(1);
}

// eslint-disable-next-line no-console -- CLI summary line; this IS the program's output
console.log(
  `OK — all ${exported.size} ui exports appear in the skill catalog, and all ${advertisedNames.size} Key exports names resolve`,
);
