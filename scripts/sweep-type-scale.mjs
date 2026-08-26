#!/usr/bin/env node
/**
 * One-shot, idempotent sweep: make every `font-size` in `src/ui` respond to the
 * global `--type-scale` knob by wrapping its existing value in a calc().
 *
 *   font-size: var(--uxm-button-primary-font-size, 14px);
 *   → font-size: calc(var(--uxm-button-primary-font-size, 14px) * var(--type-scale, 1));
 *
 * The multiplication goes OUTSIDE the var(), never inside its fallback: studio
 * previews project knob defaults as inline vars, so a scale inside the fallback
 * would be shadowed in the canvas for most components. Outside, both a projected
 * default and a saved per-component override still scale.
 *
 * The six heading surfaces additionally carry their role factor, keyed by var
 * NAME (line numbers move; names don't). Run `--write` to apply; default is a
 * dry run. Re-running is a no-op — already-wrapped lines are skipped.
 *
 * The classifier FAILS CLOSED: anything it cannot categorise aborts the whole
 * run rather than half-rewriting the tree.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const WRITE = process.argv.includes('--write');
/** CI mode: succeed only when every font-size is already wrapped. */
const CHECK = process.argv.includes('--check');

/**
 * The six heading surfaces already carry their role factor plus --type-scale
 * (added by hand in 4.28.0). The sweep must NOT touch them; it asserts each is
 * present and already wrapped, so a future edit that drops a role factor turns
 * into a failed sweep rather than a silently unscaled heading.
 */
const ROLE_VARS = [
  '--uxm-stat-card-value-size',
  '--uxm-error-page-code-size',
  '--uxm-page-header-title-size',
  '--uxm-error-page-title-size',
  '--uxm-detail-section-title-size',
  '--uxm-segment-row-title-size',
];

/**
 * Never touch: declarations that FORWARD a font-size into another atom's custom
 * property. `color-input.scss` assigns `--uxm-select-dropdown-font-size`, whose
 * consumer in `input.scss` does get wrapped — wrapping here too would apply the
 * scale twice (measured: 56px instead of 28px at scale 2).
 *
 * Keyed by the assigned property NAME, not `file:line`: line numbers move, and
 * this guard never fires while the `^\s*font-size` anchor holds, so a stale key
 * would be invisible until the anchor is loosened — which is the only scenario
 * the guard exists for.
 */
const SKIP_FORWARDED_PROPS = ['--uxm-select-dropdown-font-size'];

//                        indent      value (no trailing ;)
const DECL = /^(\s*)font-size:[ \t]*(.+?);[ \t]*$/;
const VAR_PX = /^var\((--[a-z0-9-]+),\s*(\d+(?:\.\d+)?px)\)$/;
const BARE_PX = /^\d+(?:\.\d+)?px$/;

const stats = { wrapVar: 0, wrapBare: 0, skipEm: 0, skipInherit: 0, skipForwarded: 0, manualCalc: 0, already: 0 };
const roleHits = Object.fromEntries(ROLE_VARS.map((k) => [k, 0]));
const changes = [];
const manual = [];

/**
 * Every `font-size:` in the source, ignoring comments and custom-property
 * assignments whose name merely ends in `-font-size`. The classifier below must
 * account for exactly this many — otherwise a declaration it failed to match is
 * neither wrapped nor reported, and `--check` would pass on unwrapped code.
 */
function countFontSizes(text) {
  return [...text.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(?<![-\w])font-size\s*:/g)].length;
}
let seen = 0;

for (const file of globSync('src/ui/**/*.scss').sort()) {
  const source = readFileSync(file, 'utf8');
  seen += countFontSizes(source);
  const lines = source.split('\n');
  let touched = false;

  lines.forEach((line, i) => {
    const m = DECL.exec(line);
    if (!m) return;                                  // not a font-size declaration
    const where = `${file}:${i + 1}`;
    if (SKIP_FORWARDED_PROPS.some((prop) => line.includes(`${prop}:`))) {
      stats.skipForwarded++; return;
    }

    const [, indent, value] = m;

    if (value.includes('var(--type-')) {                                   // idempotence
      stats.already++;
      for (const rv of ROLE_VARS) if (value.includes(`var(${rv},`)) roleHits[rv]++;
      return;
    }
    if (value === 'inherit') { stats.skipInherit++; return; }
    // `em` is relative to the PARENT, so it already scales — but `rem` is
    // relative to the ROOT and never would, so it must not be quietly skipped.
    if (/(?<![a-z])rem$/.test(value) || /,\s*[\d.]+rem\)$/.test(value)) {
      throw new Error(
        `rem font-size at ${where}: ${JSON.stringify(value)} — rem is root-relative and would `
        + 'silently ignore --type-scale. Use px (the sweep will wrap it) or em. Aborting.',
      );
    }
    if (/(?<!r)em$/.test(value) || /,\s*[\d.]+em\)$/.test(value)) {        // relative: already scales
      stats.skipEm++; return;
    }
    if (value.startsWith('calc(')) { stats.manualCalc++; manual.push(`${where}  ${value}`); return; }

    let factors;
    const varMatch = VAR_PX.exec(value);
    if (varMatch) {
      if (ROLE_VARS.includes(varMatch[1])) {
        throw new Error(`Role surface ${varMatch[1]} at ${where} lost its role factor — aborting.`);
      }
      stats.wrapVar++; factors = ' * var(--type-scale, 1)';
    } else if (BARE_PX.test(value)) {
      stats.wrapBare++; factors = ' * var(--type-scale, 1)';
    } else {
      throw new Error(`UNCLASSIFIED font-size at ${where}: ${JSON.stringify(value)} — aborting without writing.`);
    }

    const next = `${indent}font-size: calc(${value}${factors});`;
    changes.push({ where, from: line.trim(), to: next.trim() });
    lines[i] = next;
    touched = true;
  });

  if (touched && WRITE) writeFileSync(file, lines.join('\n'));
}

// Reconciliation gate. Anything the classifier did not see is invisible to
// `--check`, which is how a gate reports green over unwrapped declarations.
const classified = Object.values(stats).reduce((a, b) => a + b, 0);
if (classified !== seen) {
  throw new Error(
    `COVERAGE GAP: ${seen} font-size declarations in source, but only ${classified} were `
    + 'classified. Some line shape (a trailing comment, a multi-line value) is slipping past '
    + 'the DECL pattern and would be silently left unwrapped — aborting rather than reporting.',
  );
}

const missedRoles = Object.entries(roleHits).filter(([, n]) => n !== 1);
if (missedRoles.length) {
  throw new Error(
    `Each role surface must appear exactly once, already wrapped; got `
    + `${JSON.stringify(Object.fromEntries(missedRoles))} — aborting.`,
  );
}

for (const c of changes) console.log(`${c.where}\n  - ${c.from}\n  + ${c.to}`);
if (manual.length) console.log(`\nMANUAL (skipped, hand-edit separately):\n  ${manual.join('\n  ')}`);
console.log(`\n${JSON.stringify(stats, null, 2)}`);
console.log(`rewritten: ${changes.length}   declarations classified: ${classified}/${seen}`);
if (CHECK) {
  if (changes.length) {
    console.error(
      `\n${changes.length} font-size declaration(s) are not wrapped in the type scale.\n`
      + 'Run `node scripts/sweep-type-scale.mjs --write`, or add an intentional exception\n'
      + 'to SKIP_FORWARDED_PROPS with a comment saying why.',
    );
    process.exit(1);
  }
  console.log('\nOK — every font-size responds to --type-scale.');
} else {
  console.log(WRITE ? '\nWROTE changes.' : '\nDRY RUN — pass --write to apply.');
}
