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
  it('every emitted var another atom reads is read by its own atom too', () => {
    const masked: string[] = [];
    for (const def of registry) {
      if (!existsSync(resolve(UI_DIR, def.id))) continue;
      const home = new Set([def.id, ...(SHARED[def.id] ?? [])]);
      for (const prop of def.styleProperties) {
        if (prop.defaultValue === undefined || prop.defaultValue === null) continue;
        const css = generateOverridesCss({ [def.id]: { [prop.key]: prop.defaultValue } }, brand);
        for (const [, cssVar] of css.matchAll(/^\s*(--uxm-[a-z0-9-]+):/gm)) {
          const readers = readersOf(cssVar);
          if (readers.length && !readers.some((r) => home.has(r.folder))) {
            masked.push(`${def.id}.${prop.key} → ${cssVar} (only ${readers.map((r) => r.file).join(', ')})`);
          }
        }
      }
    }
    expect(masked).toEqual([]);
  });
});
