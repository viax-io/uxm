#!/usr/bin/env node
// Diff every studio-registry state knob (hover / active / pressed / disabled)
// against the SCSS fallback that the compiled CSS actually ships.
//
// The defect class this guards (see .claude/memory/gotchas.md → "A per-state
// var whose fallback is the resting value ships a dead rule"): the studio
// previews registry defaultValues as inline vars, so a fallback that drifts
// from the registry — or repeats the resting look where the registry declares
// a distinct state value — passes every visual check in the workbench and
// only fails in a bare consumer. Eyeballing found 5 of the first 19 drifts;
// this script found all of them.
//
// Usage: node scripts/check-state-var-drift.mjs   (exits 1 on any drift)
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');
const kebab = (k) => k.replace(/(?<!^)(?=[A-Z])/g, '-').toLowerCase();
// Normalise whitespace so a fallback that spans multiple lines (ButtonPrimary's
// color-mix hover) matches the same as a single-line one — the false-positive
// shape the gotchas entry warns about.
const squash = (s) => s.replace(/\s+/g, ' ').replace(/\(\s/g, '(').replace(/\s\)/g, ')').trim();

// 1. knob → var overrides from generate-css.ts
const gc = read('src/studio/persistence/generate-css.ts');
const mapping = {};
for (const m of gc.matchAll(/'([a-z0-9-]+)':\s*\{([^}]*)\}/g)) {
  const entries = Object.fromEntries([...m[2].matchAll(/(\w+):\s*'(--[\w-]+)'/g)].map((e) => [e[1], e[2]]));
  if (Object.keys(entries).length) mapping[m[1]] = { ...(mapping[m[1]] ?? {}), ...entries };
}

// 2. registry state knobs
const registryFiles = globSync('src/studio/lib/registry/*.ts');
const knobs = [];
for (const f of registryFiles) {
  const src = read(f);
  const ids = [...src.matchAll(/id:\s*'([a-z0-9-]+)'/g)].map((m) => ({ cid: m[1], at: m.index + m[0].length }));
  ids.forEach(({ cid, at }, i) => {
    const block = src.slice(at, ids[i + 1] ? ids[i + 1].at - 20 : src.length);
    for (const km of block.matchAll(/key:\s*'(\w+)'[^}]*?defaultValue:\s*(?:'([^']*)'|([\d.]+))[^}]*?state:\s*'(hover|active|pressed|disabled)'/g)) {
      const [, key, strDefault, numDefault] = km;
      knobs.push({ cid, key, def: strDefault ?? numDefault });
    }
  });
}

// 3. compare against every SCSS fallback
const scss = globSync('src/ui/**/*.scss').map((f) => ({ f, text: squash(read(f)) }));
let drift = 0;
for (const { cid, key, def } of knobs) {
  const cssVar = mapping[cid]?.[key] ?? `--uxm-${cid}-${kebab(key)}`;
  const reads = scss.filter(({ text }) => text.includes(`var(${cssVar}`));
  if (reads.length === 0) continue; // knob has no CSS read — a different defect class (dead emitted var)
  // Numeric knobs are emitted with a px suffix by generate-css, so a CSS
  // fallback of `2px` against a registry default of `2` is agreement, not drift.
  // Legacy-alias chains — var(--uxm-x-new, var(--uxm-x-old, <token>)) — are
  // agreement too when the INNERMOST token matches the registry default: the
  // middle var is an unset alias hook, so the final token is what paints.
  const defs = [squash(def)];
  if (/^[\d.]+$/.test(def)) defs.push(`${def}px`);
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `var\\(${escape(cssVar)}, (?:var\\(--uxm-[\\w-]+, )*(?:${defs.map(escape).join('|')})\\)+`,
  );
  if (!reads.some(({ text }) => pattern.test(text))) {
    drift += 1;
    console.error(`DRIFT ${cid}.${key}: registry says ${def}; no SCSS reads var(${cssVar}, ${defs[0]}) (${reads.map((r) => r.f).join(', ')})`);
  }
}
// eslint-disable-next-line no-console -- CLI summary line; this IS the program's output
console.log(drift === 0 ? 'OK — zero state-knob drift' : `${drift} drifting declaration(s)`);
process.exit(drift === 0 ? 0 : 1);
