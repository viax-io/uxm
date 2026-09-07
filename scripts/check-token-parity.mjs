#!/usr/bin/env node
// Keep `src/tokens/index.css` and the `themeTokens` catalog in
// `src/tokens/index.ts` in lockstep.
//
// The two are hand-maintained mirrors: the stylesheet is what every consumer
// paints with, the catalog is what Brand Settings edits and what the skill's
// token table is generated from. Nothing else ties them together, so a token
// added to one and not the other is invisible until a tenant tries to theme
// it (catalog-only → paints nothing) or the studio can't (CSS-only → not
// themable). The 07-09-2026 audit found 46 `--color-*` in CSS against 31 in
// the catalog.
//
// Checks:
//   1. every catalog entry is declared on `:root` with the catalog `hex`, and
//      under `[data-theme="dark"]` with `darkHex` (case-insensitive);
//   2. every `--color-*` on `:root` is either a catalog entry or listed in
//      INTERNAL below with a reason — nothing slips in unnamed;
//   3. every `--color-*` that exists ONLY inside the Tailwind `@theme inline`
//      block is listed in DEPRECATED_ALIASES (browsers drop that block, so a
//      name declared there alone is never defined for a plain-CSS host);
//   4. the dark block declares nothing `:root` doesn't.
//
// Usage: node scripts/check-token-parity.mjs   (exits 1 on any mismatch)
import { readFileSync } from 'node:fs';

const css = readFileSync('src/tokens/index.css', 'utf8');
const ts = readFileSync('src/tokens/index.ts', 'utf8');

/**
 * `--color-*` vars that are deliberately declared in CSS but NOT in the
 * catalog. Each needs a reason; a new one without an entry here fails the
 * check on purpose — decide whether it is a brand token (add to the catalog)
 * or an internal (add here, say why).
 */
const INTERNAL = {
  '--color-drop-target': 'semantic alias of --color-accent; a catalog entry would pin a hex and freeze it away from accent (see skill design-tokens.md)',
  '--color-canvas-dot': 'studio canvas dot-grid colour; workbench chrome, not a brand token',
  '--color-preview-bg-light': 'theme-agnostic swatch for the Brand Settings light/dark preview tiles',
  '--color-preview-bg-dark': 'theme-agnostic swatch for the Brand Settings light/dark preview tiles',
  '--color-preview-border-light': 'theme-agnostic swatch for the Brand Settings light/dark preview tiles',
  '--color-preview-border-dark': 'theme-agnostic swatch for the Brand Settings light/dark preview tiles',
};

/**
 * Names that live ONLY in the `@theme inline` block. They were Tailwind theme
 * keys from the repo's first commit, have no utility usages anywhere, and are
 * invisible to a non-Tailwind host. Deprecated in 4.37 — remove the block and
 * this list together in the next major.
 */
const DEPRECATED_ALIASES = [
  '--color-cream', '--color-warm-gray', '--color-ink', '--color-green', '--color-mint',
  '--color-forest', '--color-peach', '--color-lavender', '--color-lime',
];

/** `--color-*: value;` declarations inside the first block opened by `selector`. */
function block(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`block not found: ${selector}`);
  const open = css.indexOf('{', start);
  let depth = 0;
  let i = open;
  for (; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}' && (depth -= 1) === 0) break;
  }
  const body = css.slice(open + 1, i).replace(/\/\*[\s\S]*?\*\//g, '');
  const out = new Map();
  for (const m of body.matchAll(/(--color-[a-z0-9-]+)\s*:\s*([^;]+);/g)) out.set(m[1], m[2].trim());
  return out;
}

const root = block(':root');
const dark = block('[data-theme="dark"]');
const theme = block('@theme inline');

const catalog = [...ts.matchAll(/cssVar:\s*'(--color-[a-z0-9-]+)',\s*hex:\s*'(#[0-9A-Fa-f]{6})',\s*darkHex:\s*'(#[0-9A-Fa-f]{6})'/g)]
  .map((m) => ({ cssVar: m[1], hex: m[2], darkHex: m[3] }));
if (catalog.length === 0) throw new Error('no themeTokens entries parsed from src/tokens/index.ts');

const problems = [];
const eq = (a, b) => a.toUpperCase() === b.toUpperCase();

// 1. catalog → CSS
for (const { cssVar, hex, darkHex } of catalog) {
  if (!root.has(cssVar)) problems.push(`${cssVar}: in catalog, not declared on :root`);
  else if (!eq(root.get(cssVar), hex)) problems.push(`${cssVar}: catalog hex ${hex} ≠ :root ${root.get(cssVar)}`);
  if (!dark.has(cssVar)) problems.push(`${cssVar}: in catalog, no [data-theme="dark"] override`);
  else if (!eq(dark.get(cssVar), darkHex)) problems.push(`${cssVar}: catalog darkHex ${darkHex} ≠ dark ${dark.get(cssVar)}`);
}

// 2. CSS → catalog | INTERNAL
const inCatalog = new Set(catalog.map((t) => t.cssVar));
for (const name of root.keys()) {
  if (!inCatalog.has(name) && !(name in INTERNAL)) {
    problems.push(`${name}: declared on :root but neither in themeTokens nor in INTERNAL (scripts/check-token-parity.mjs)`);
  }
}
for (const name of Object.keys(INTERNAL)) {
  if (!root.has(name)) problems.push(`${name}: listed in INTERNAL but no longer declared on :root — drop the entry`);
}

// 3. @theme-only names must be the known deprecated aliases
for (const name of theme.keys()) {
  if (!root.has(name) && !DEPRECATED_ALIASES.includes(name)) {
    problems.push(`${name}: exists only inside @theme inline (invisible to plain-CSS hosts) and is not a known deprecated alias`);
  }
}
for (const name of DEPRECATED_ALIASES) {
  if (!theme.has(name)) problems.push(`${name}: listed as a deprecated alias but no longer in @theme inline — drop the entry`);
}

// 4. dark ⊆ root
for (const name of dark.keys()) {
  if (!root.has(name)) problems.push(`${name}: overridden in [data-theme="dark"] but never declared on :root`);
}

if (problems.length) {
  console.error(`${problems.length} token parity problem(s):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
// eslint-disable-next-line no-console -- CLI summary line; this IS the program's output
console.log(`OK — ${catalog.length} catalog tokens match tokens.css; ${Object.keys(INTERNAL).length} internal, ${DEPRECATED_ALIASES.length} deprecated aliases accounted for`);
