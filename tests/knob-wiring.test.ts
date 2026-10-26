import { existsSync, globSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { registry } from '@/studio/lib/registry';
import type { BrandConfig } from '@/studio/lib/types';
import { generateOverridesCss } from '@/studio/persistence/generate-css';

/**
 * A Studio knob must paint the atom it belongs to — not just *some* atom.
 *
 * The Checkbox's resting knobs (uncheckedBg, checkedBg, …) emitted
 * `--uxm-checkbox-unchecked-bg` etc., which its own checkbox.scss never read,
 * while listbox.scss read the same names for its checkbox marker. Every check
 * that asked "does any stylesheet read this var?" passed, and a saved
 * checkedBg painted nothing on the real Checkbox.
 *
 * So each knob of an atom with its own `src/ui/<id>/` folder goes through the
 * real emitter (`generateOverridesCss`, so mapped names and literal-property
 * knobs come out exactly as Studio saves them), and every `--uxm-*` var it
 * emits that SOME atom reads must be read by its own folder too — stylesheet
 * or non-preview source (some atoms bridge a knob to a child through inline
 * style). A var nobody reads at all is a different, noisier defect class
 * (behaviour knobs, composites) and is not checked here.
 */
const UI_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/ui');

/** Registry entries that deliberately drive a second atom's folder. */
const SHARED: Record<string, string[]> = {
  // The slider entry's range mode is RangeSlider (no registry entry of its own).
  slider: ['range-slider'],
};

/**
 * Registry ids whose styles live in a differently named folder.
 *
 * Without these the gate silently skipped them — 19 of 110 ids, including every
 * Button variant, `input-text`, `textarea` and `select-dropdown`. That is not a
 * harmless gap: "the id is not the folder name" is the exact shape that let the
 * Checkbox's knobs emit into the void, so the atoms most likely to repeat it
 * were the ones not being checked.
 */
const FOLDER_OF: Record<string, string[]> = {
  'button-primary': ['button'],
  'button-secondary': ['button'],
  'button-tertiary': ['button'],
  'button-ghost': ['button'],
  'button-danger': ['button'],
  'input-text': ['input'],
  textarea: ['input'],
  'select-dropdown': ['listbox', 'input', 'popover'],
  'list-item': ['list'],
  'content-tooltip': ['tooltip'],
};

/**
 * Registry ids with no folder of their own: composites that style through the
 * atoms they host, and knob groups that belong to another entry's component.
 *
 * Listed rather than skipped, so a NEW id has to be classified deliberately —
 * an unknown one fails the test below instead of quietly dropping out of it.
 */
const NO_FOLDER = new Set([
  'brand-settings',
  'form-login',
  'form-contact',
  'form-multirow',
  'login-page',
  'property-grid',
  'lifecycle-plus-button',
  'lifecycle-connector-knobs',
  'lifecycle-action-row',
]);

const brand = {} as BrandConfig;
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"])\/\/.*$/gm, '$1');
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sources = globSync('**/*.{scss,ts,tsx}', { cwd: UI_DIR })
  .map((f) => f.replaceAll('\\', '/'))
  .filter((f) => !f.includes('-preview'))
  .map((f) => ({ folder: f.split('/')[0], file: f, text: stripComments(readFileSync(resolve(UI_DIR, f), 'utf8')) }));

function readersOf(cssVar: string) {
  const reads = new RegExp(`var\\(\\s*${escape(cssVar)}\\s*[,)]`);
  return sources.filter(({ text }) => reads.test(text));
}

describe('Studio knob wiring', () => {
  it('classifies every registry id — no silent skips', () => {
    // The gate is only worth what it covers, and the previous version dropped
    // any id without a same-named folder without saying so.
    const unclassified = registry
      .filter((d) => !existsSync(resolve(UI_DIR, d.id)) && !FOLDER_OF[d.id] && !NO_FOLDER.has(d.id))
      .map((d) => d.id);
    expect(
      unclassified,
      'registry ids with no src/ui folder of their own: map each to its folder in FOLDER_OF, ' +
        'or add it to NO_FOLDER if it is a composite that styles through other atoms',
    ).toEqual([]);
  });

  it('actually iterates the library (a silent zero would pass the check below)', () => {
    expect(sources.length, 'src/ui source files').toBeGreaterThan(200);
    expect(registry.length, 'registry entries').toBeGreaterThan(100);
  });

  it('every emitted var another atom reads is read by its own atom too', () => {
    const masked: string[] = [];
    let checked = 0;
    for (const def of registry) {
      if (NO_FOLDER.has(def.id)) continue;
      const home = new Set([def.id, ...(FOLDER_OF[def.id] ?? []), ...(SHARED[def.id] ?? [])]);
      for (const prop of def.styleProperties) {
        if (prop.defaultValue === undefined || prop.defaultValue === null) continue;
        const css = generateOverridesCss({ [def.id]: { [prop.key]: prop.defaultValue } }, brand);
        for (const [, cssVar] of css.matchAll(/^\s*(--uxm-[a-z0-9-]+):/gm)) {
          checked += 1;
          const readers = readersOf(cssVar);
          if (readers.length && !readers.some((r) => home.has(r.folder))) {
            masked.push(`${def.id}.${prop.key} → ${cssVar} (only ${readers.map((r) => r.file).join(', ')})`);
          }
        }
      }
    }
    expect(masked).toEqual([]);
    // Non-vacuity: if the registry, the glob or the generator ever came back
    // empty, `masked` would also be empty and this would pass green.
    expect(checked, 'emitted vars examined').toBeGreaterThan(1000);
  });

  it('every var a preview projects is read by some atom', () => {
    // ButtonGroup's Border Radius emitted `--uxm-button-group-border-radius`,
    // its preview projected the same name, and button-group.scss hard-coded
    // `border-radius: 8px`, so the knob painted nothing anywhere. The check
    // above can't see it (no atom reads the var at all), and neither can the
    // drift script (a frame knob, and it skips unread vars). A preview projects
    // a var to drive the production stylesheet, so a projected name that no
    // atom reads is either a dead knob or a typo. Previews also project other
    // atoms' vars (a Tag inside a composite), so any reader counts.
    const previews = [
      ...globSync('**/*-preview.tsx', { cwd: UI_DIR }).map((f) => resolve(UI_DIR, f)),
      ...globSync('**/*.tsx', { cwd: resolve(UI_DIR, '../previews') }).map((f) => resolve(UI_DIR, '../previews', f)),
    ];
    const unread: string[] = [];
    let projected = 0;
    for (const file of previews) {
      const text = stripComments(readFileSync(file, 'utf8'));
      // Object keys only (`'--uxm-x': …`, `['--uxm-x' as string]: …`); a
      // template-built name (`--uxm-${id}-…`) has no closing quote here.
      for (const [, cssVar] of text.matchAll(/['"`](--uxm-[a-z0-9-]+)['"`]\s*(?:as string\s*)?\]?\s*:/g)) {
        projected += 1;
        if (!readersOf(cssVar).length) unread.push(`${cssVar} (${file.slice(file.indexOf('src/'))})`);
      }
    }
    expect(unread).toEqual([]);
    expect(projected, 'projected vars examined').toBeGreaterThan(1000);
  });
});
