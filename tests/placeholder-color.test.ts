import { globSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import postcss from 'postcss';
import * as sass from 'sass';
import { describe, expect, it } from 'vitest';

import { registry } from '@/studio/lib/registry';
import type { BrandConfig } from '@/studio/lib/types';
import { generateOverridesCss } from '@/studio/persistence/generate-css';

/**
 * Every text-entry field paints its placeholder from a knob of its own.
 *
 * InputWithIcon had no `::placeholder` rule, so the browser's grey (#757575 in
 * Chrome) painted, and a theme that darkened the field (a search box in a dark
 * top bar) left the placeholder at 1.6–2.9:1. TextInput and its siblings read
 * the global `--color-text-muted` only, so the one fix was moving the token
 * for the whole app. Three checks:
 *
 * 1. Every `<input>` / `<textarea>` an atom renders with a placeholder has a
 *    `::placeholder` rule (the InputWithIcon gap was a MISSING rule).
 * 2. Every `::placeholder` rule reads a `--uxm-*` var, falling back to a token.
 * 3. Each field's Placeholder knob, through the real `generateOverridesCss`,
 *    emits the var its own stylesheet reads for the placeholder's colour.
 */
const UI_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/ui');
const brand = {} as BrandConfig;
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** `<input>` / `<textarea>` classes that show a placeholder but deliberately
 *  have no rule yet, each with its reason. */
const EXEMPT: Record<string, string> = {
  // The edit-mode input of an EditableCell. Its `placeholderColor` knob paints
  // the display-mode empty state at `--color-text-subtle` (3.66:1 on card);
  // reusing it here would drop the input below Chrome's 4.61:1. Separate fix.
  'uxm-editable-cell__input': 'display-mode knob is a 3:1 token',
};

/** Placeholders that are not a `::placeholder`: the label a trigger shows
 *  while nothing is selected. Selector → registry id. */
const TRIGGER_PLACEHOLDERS: Record<string, string> = {
  '.uxm-select-dropdown__trigger-label--empty': 'select-dropdown',
  '.uxm-search-dropdown__trigger--empty': 'search-dropdown',
};

function rules() {
  const out: { selector: string; prop: string; value: string }[] = [];
  for (const file of globSync('*/*.scss', { cwd: UI_DIR })) {
    postcss.parse(sass.compile(resolve(UI_DIR, file)).css).walkDecls((decl) => {
      const rule = decl.parent;
      if (rule?.type !== 'rule') return;
      for (const selector of (rule as postcss.Rule).selectors) out.push({ selector, prop: decl.prop, value: decl.value });
    });
  }
  return out;
}

/** Literal class of each `<input>` / `<textarea>` that can show a placeholder:
 *  it sets `placeholder` or spreads the caller's props, which may carry one. */
function placeholderFields() {
  const out: string[] = [];
  for (const file of globSync('*/*.tsx', { cwd: UI_DIR })) {
    if (file.includes('-preview')) continue;
    // Comments mention `<input>` in prose; drop them so only JSX is scanned.
    const src = readFileSync(resolve(UI_DIR, file), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
    for (const [tag] of src.matchAll(/<(input|textarea)\s[\s\S]*?\/>/g)) {
      if (/type=["'](checkbox|radio|range|file|color)["']/.test(tag)) continue;
      if (!/\bplaceholder\b|\{\s*\.\.\.(rest|props|inputProps)\s*\}/.test(tag)) continue;
      const cls = tag.match(/className=["']([\w-]+)["']/)?.[1] ?? tag.match(/className=\{cn\(\s*['"]([\w-]+)['"]/)?.[1];
      if (cls) out.push(cls);
    }
  }
  return [...new Set(out)].sort();
}

describe('placeholder colour', () => {
  const all = rules();
  const placeholderRules = all.filter((r) => r.selector.endsWith('::placeholder') && r.prop === 'color');

  it('finds the input family (a silent zero would pass the checks below)', () => {
    expect(placeholderFields()).toEqual(
      expect.arrayContaining([
        'uxm-input-text',
        'uxm-textarea',
        'uxm-input-with-icon__input',
        'uxm-password-input__input',
        'uxm-date-input__input',
        'uxm-time-input__input',
        'uxm-number-input',
        'uxm-currency-input__input',
        'uxm-phone-input__input',
        'uxm-code-editor__input',
      ]),
    );
  });

  it('gives every field that shows a placeholder a ::placeholder rule', () => {
    const missing = placeholderFields().filter(
      (cls) => !EXEMPT[cls] && !placeholderRules.some((r) => r.selector === `.${cls}::placeholder`),
    );
    expect(missing).toEqual([]);
  });

  it('paints every ::placeholder from a --uxm-* var over a token', () => {
    const bare = placeholderRules.filter((r) => !/^var\(\s*--uxm-[\w-]+\s*,\s*var\(\s*--color-[\w-]+\s*\)\s*\)$/.test(r.value));
    expect(bare.map((r) => `${r.selector} { color: ${r.value} }`)).toEqual([]);
  });

  it("reads each field's Placeholder knob where its placeholder is painted", () => {
    const checked: string[] = [];
    const unwired: string[] = [];
    for (const def of registry) {
      const knob = def.styleProperties.find((p) => /^placeholderColor$|PlaceholderColor$/.test(p.key));
      if (!knob) continue;
      const trigger = Object.keys(TRIGGER_PLACEHOLDERS).find((s) => TRIGGER_PLACEHOLDERS[s] === def.id);
      const own = new RegExp(`^\\.uxm-${escape(def.id)}(__[\\w-]+)?::placeholder$`);
      const painted = all.filter((r) => r.prop === 'color' && (trigger ? r.selector === trigger : own.test(r.selector)));
      // Thumbnail / PillSelect / EditableCell knobs paint an empty-state label,
      // not a text field's placeholder; they have no rule here to check.
      if (painted.length === 0) continue;
      checked.push(def.id);
      const css = generateOverridesCss({ [def.id]: { [knob.key]: '#123456' } }, brand);
      const cssVar = css.match(/^\s*(--uxm-[a-z0-9-]+):\s*#123456/m)?.[1];
      const reads = cssVar ? new RegExp(`^var\\(\\s*${escape(cssVar)}\\s*,`) : null;
      if (!reads || !painted.some((r) => reads.test(r.value))) {
        unwired.push(`${def.id}: ${knob.key} emits ${cssVar ?? 'nothing'}, which its placeholder rule doesn't read`);
      }
    }
    expect(checked).toEqual(
      expect.arrayContaining([
        'input-text', 'textarea', 'select-dropdown', 'input-with-icon', 'password-input', 'date-input',
        'time-input', 'number-input', 'currency-input', 'phone-input', 'code-editor', 'search-dropdown', 'listbox',
      ]),
    );
    expect(unwired).toEqual([]);
  });
});
