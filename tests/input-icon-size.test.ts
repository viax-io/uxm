import { existsSync, globSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import postcss from 'postcss';
import * as sass from 'sass';
import { describe, expect, it } from 'vitest';

import { registry } from '@/studio/lib/registry';
import type { BrandConfig } from '@/studio/lib/types';
import { generateOverridesCss } from '@/studio/persistence/generate-css';

/**
 * An `iconSize` knob that reserves room for a glyph must size the glyph too.
 *
 * InputWithIcon's Icon Size emitted `--uxm-input-with-icon-icon-size`, which
 * fed only the input's left padding. Its `icon` is a consumer's ReactNode,
 * typically an `<Icon>` at its 24px default, so the README's own usage drew a
 * 24px glyph in a 16px slot, and the knob moved the text but never the glyph.
 * The Studio preview hid it by passing `size={iconSize}` to the Icon itself.
 *
 * So for every atom whose `iconSize` var (from the real emitter) appears in a
 * padding declaration of its own stylesheet, a rule on an `svg` must read the
 * same var for both `width` and `height`. DateInput, TimeInput and
 * PasswordInput already did; this pins them alongside.
 */
const UI_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/ui');
const brand = {} as BrandConfig;
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * The `uxm-*` class names an atom's own source actually renders.
 *
 * Without this the scoping check below is satisfied by ANY rule mentioning an
 * svg — moving the sizing rule to `& .nope svg` (a class the component never
 * renders) kept the suite green while the glyph went unsized. Same defect class
 * as the repo's "A styled class nobody renders is invisible in review" gotcha.
 */
function renderedClasses(folder: string) {
  const names = new Set<string>();
  for (const file of globSync('*.{ts,tsx}', { cwd: resolve(UI_DIR, folder) })) {
    if (file.includes('-preview')) continue;
    const src = readFileSync(resolve(UI_DIR, folder, file), 'utf8');
    for (const [, name] of src.matchAll(/['"`]([a-z][\w-]*uxm-[\w-]+|uxm-[\w-]+)['"`\s]/g)) names.add(name);
    for (const [, name] of src.matchAll(/(uxm-[a-z0-9_-]+)/g)) names.add(name);
  }
  return names;
}

function declarations(folder: string) {
  const decls: { selector: string; prop: string; value: string }[] = [];
  for (const file of globSync('*.scss', { cwd: resolve(UI_DIR, folder) })) {
    postcss.parse(sass.compile(resolve(UI_DIR, folder, file)).css).walkDecls((decl) => {
      const rule = decl.parent;
      if (rule?.type === 'rule') decls.push({ selector: (rule as postcss.Rule).selector, prop: decl.prop, value: decl.value });
    });
  }
  return decls;
}

describe('icon-size knobs', () => {
  const slots: string[] = [];
  const unsized: string[] = [];

  for (const def of registry) {
    const knob = def.styleProperties.find((p) => p.key === 'iconSize');
    if (!knob || !existsSync(resolve(UI_DIR, def.id))) continue;
    const css = generateOverridesCss({ [def.id]: { iconSize: knob.defaultValue } }, brand);
    const cssVar = css.match(/^\s*(--uxm-[a-z0-9-]+):/m)?.[1];
    if (!cssVar) continue;
    const reads = new RegExp(`var\\(\\s*${escape(cssVar)}\\s*[,)]`);
    const decls = declarations(def.id);
    if (!decls.some((d) => d.prop.startsWith('padding') && reads.test(d.value))) continue;
    slots.push(def.id);
    // The rule must sit on an svg INSIDE an element this atom renders. A bare
    // "mentions svg" check passed with the rule moved to `& .nope svg`, which
    // sizes nothing. `svg(?![\w-])` so a custom element like `<svg-foo>` can't
    // stand in for the real one.
    const rendered = renderedClasses(def.id);
    const scoped = (selector: string) => {
      const classes = [...selector.matchAll(/\.([a-zA-Z_][\w-]*)/g)].map((m) => m[1]);
      return classes.length > 0 && classes.every((c) => rendered.has(c));
    };
    const sized = (prop: string) =>
      decls.some(
        (d) =>
          /(^|[\s>+~,])svg(?![\w-])/.test(d.selector) &&
          scoped(d.selector) &&
          d.prop === prop &&
          reads.test(d.value),
      );
    if (!sized('width') || !sized('height')) unsized.push(`${def.id}: ${cssVar} pads the glyph's slot but sizes no svg`);
  }

  it('finds the input family (a silent zero would pass the check below)', () => {
    expect(slots).toEqual(expect.arrayContaining(['input-with-icon', 'date-input', 'time-input', 'password-input']));
  });

  it('sizes the glyph with the var that reserves its room', () => {
    expect(unsized).toEqual([]);
  });
});
