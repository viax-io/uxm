#!/usr/bin/env node
/**
 * Proof that the type-scale sweep changed nothing but the wrapping.
 *
 * Compiles every stylesheet and extracts (selector, property) → value from the
 * COMPILED css, so it also proves no rule was added, removed, reordered or
 * re-selectored — the only other ways a wrap could alter rendering.
 *
 *   node scripts/verify-type-scale.mjs <git-ref>      # e.g. origin/master
 *   npm run verify:type-scale
 *
 * The "before" stylesheets are read from the git ref, not from a stash: stashing
 * would also revert THIS script, so snapshot and compare would run different
 * versions of the parser. Reading from a ref keeps it reproducible after merge
 * too — `verify-type-scale.mjs v4.28.0` works forever.
 *
 * `compare` asserts every value is either unchanged, or exactly the old value
 * wrapped in `calc(... * var(--type-scale, 1))` (optionally with a role factor).
 */
import { execFileSync } from 'node:child_process';
import { globSync, readFileSync } from 'node:fs';

import * as sass from 'sass';

const ref = process.argv[2];
if (!ref) {
  console.error('usage: verify-type-scale.mjs <git-ref>   (e.g. origin/master, v4.28.0)');
  process.exit(2);
}

/** File contents at a git ref, or null when the file did not exist there. */
function atRef(file) {
  try {
    return execFileSync('git', ['show', `${ref}:${file}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

/**
 * Depth-aware scan of the compiled CSS. A regex over `sel { ... }` silently
 * DROPS declarations nested inside at-rules (@container / @media), which makes
 * the verifier under-report and still say PASS — so this walks braces instead
 * and keys each declaration by its full selector path.
 */
function declarations(source) {
  const map = {};
  let total = 0;
  for (const file of globSync('src/ui/**/*.scss').sort()) {
    const scss = source === 'work' ? readFileSync(file, 'utf8') : atRef(file);
    if (scss === null) continue;                    // file is new on this branch
    // Strip comments first: several stylesheets discuss `font-size:` in prose,
    // and a comment's braces/semicolons would also corrupt the brace walk.
    const css = sass.compileString(scss, { style: 'expanded' }).css.replace(/\/\*[\s\S]*?\*\//g, '');
    const stack = [];
    let buf = '';
    let n = 0;
    const record = () => {
      const m = /^\s*(font-size|line-height)\s*:\s*(.+)$/s.exec(buf);
      if (m) { map[`${file}#${n++}|${stack.join(' >> ')}|${m[1]}`] = m[2].trim(); total++; }
      buf = '';
    };
    for (const ch of css) {
      if (ch === '{') { stack.push(buf.replace(/\s+/g, ' ').trim()); buf = ''; }
      // A block's LAST declaration may legally omit its semicolon, so a
      // `;`-only parser silently drops it — and silent under-coverage is how a
      // verifier reports PASS on work it never checked.
      else if (ch === '}') { record(); stack.pop(); }
      else if (ch === ';') record();
      else buf += ch;
    }
  }
  return { map, total };
}

const { map: before } = declarations(ref);
const { map: after, total: afterTotal } = declarations('work');

// Independent count: if the parser and a dumb regex disagree, the parser is
// skipping declarations and every result below is unreliable.
let independent = 0;
for (const file of globSync('src/ui/**/*.scss').sort()) {
  const css = sass.compileString(readFileSync(file, 'utf8'), { style: 'expanded' })
    .css.replace(/\/\*[\s\S]*?\*\//g, '');
  // Lookbehind excludes CUSTOM PROPERTIES whose name merely ends in the
  // property: `--uxm-select-dropdown-font-size: …` is an assignment, not a
  // font-size declaration (color-input.scss forwards one that way).
  independent += [...css.matchAll(/(?<![-\w])(?:font-size|line-height)\s*:\s*[^;}]+[;}]/g)].length;
}
if (afterTotal !== independent) {
  console.error(`COVERAGE GAP: parser saw ${afterTotal}, regex counted ${independent} — refusing to report.`);
  process.exit(1);
}

const bKeys = Object.keys(before), aKeys = Object.keys(after);
const problems = [];
if (bKeys.length !== aKeys.length) problems.push(`declaration COUNT changed: ${bKeys.length} → ${aKeys.length}`);
for (const k of bKeys) if (!(k in after)) problems.push(`MISSING after: ${k}`);
for (const k of aKeys) if (!(k in before)) problems.push(`NEW after: ${k}`);

const SCALE = String.raw`\s*\*\s*var\(--type-scale,\s*1\)`;
const ROLE = String.raw`(?:\s*\*\s*var\(--type-[a-z-]+-scale,\s*1\))?`;
let wrapped = 0, identical = 0;
for (const k of bKeys) {
  if (!(k in after)) continue;
  const b = before[k], a = after[k];
  if (a === b) { identical++; continue; }
  const ok = new RegExp(`^calc\\(${b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${ROLE}${SCALE}\\)$`).test(a);
  if (ok) wrapped++;
  else problems.push(`NOT A PURE WRAP: ${k}\n    before: ${b}\n    after:  ${a}`);
}

// eslint-disable-next-line no-console -- CLI tool; stdout IS the interface
console.log(`identical: ${identical}   purely wrapped: ${wrapped}   declarations compared: ${bKeys.length}`);
if (problems.length) {
  console.error(`\n${problems.length} PROBLEM(S):\n  ${problems.slice(0, 20).join('\n  ')}`);
  process.exit(1);
}
// eslint-disable-next-line no-console -- CLI tool; stdout IS the interface
console.log(`\nPASS — every declaration is unchanged or a pure calc() wrap (vs ${ref}).`);
