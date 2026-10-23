import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import postcss from 'postcss';
import * as sass from 'sass';
import { describe, expect, it } from 'vitest';

/**
 * The Checkbox reads two generations of variable names for its resting box:
 * the registry's (`-unchecked-*`, `-checked-*`, `-check-glyph-color`, what
 * Studio saves) and the older `-border-color` / `-check-color`, kept in each
 * chain so overrides written against them still paint. The Listbox's checkbox
 * marker reads the same chains. These cases resolve the compiled `var()`
 * chains the way a browser would, so dropping a middle alias — which the
 * drift script still accepts, since the innermost token is unchanged — fails
 * here instead of silently un-theming a consumer.
 */
const UI_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/ui');

type Vars = Record<string, string>;

function declarations(file: string) {
  const decls: { selector: string; prop: string; value: string }[] = [];
  postcss.parse(sass.compile(resolve(UI_DIR, file)).css).walkDecls((decl) => {
    const rule = decl.parent;
    if (rule?.type === 'rule') decls.push({ selector: (rule as postcss.Rule).selector, prop: decl.prop, value: decl.value });
  });
  return decls;
}

/** Substitute every `var(--name, fallback)`, leaving undeclared tokens as `var(--name)`. */
function resolveVars(value: string, vars: Vars): string {
  const at = value.indexOf('var(');
  if (at === -1) return value;
  let depth = 0;
  let comma = -1;
  let end = at + 4;
  for (; end < value.length; end++) {
    const ch = value[end];
    if (ch === '(') depth++;
    else if (ch === ')') {
      if (depth === 0) break;
      depth--;
    } else if (ch === ',' && depth === 0 && comma === -1) comma = end;
  }
  const name = value.slice(at + 4, comma === -1 ? end : comma).trim();
  const fallback = comma === -1 ? undefined : value.slice(comma + 1, end).trim();
  const substituted = vars[name] ?? (fallback === undefined ? `var(${name})` : resolveVars(fallback, vars));
  return value.slice(0, at) + substituted + resolveVars(value.slice(end + 1), vars);
}

/**
 * Resolve ONE rule's `var()` chain, as if that rule were the winning one.
 *
 * This is not a cascade: it finds the declaration by exact selector text and
 * substitutes variables into it, so it answers "what does this rule compute
 * to", not "what does the browser paint on that element". A second rule that
 * overrides this one — a later `background-color` on the same box, a shorthand
 * clobbering a longhand — is invisible here, and `find` would quietly take the
 * first of two same-selector rules. That is deliberate: the contract under test
 * is the chain itself (which alias wins, what the innermost token is), and the
 * real cascade is what the portal check covers.
 */
function paint(decls: ReturnType<typeof declarations>, selector: string, prop: string, vars: Vars = {}) {
  const decl = decls.find((d) => d.selector === selector && d.prop === prop);
  expect(decl, `${selector} { ${prop} }`).toBeDefined();
  return resolveVars(decl!.value, vars);
}

describe('Checkbox resting knobs', () => {
  const css = declarations('checkbox/checkbox.scss');
  const box = '.uxm-checkbox__box';
  const checked = '.uxm-checkbox__input:checked + .uxm-checkbox__box';
  const glyph = '.uxm-checkbox__box > svg';
  const hover = '.uxm-checkbox:not(.uxm-checkbox--disabled):hover';
  const hoverUnchecked = `${hover} .uxm-checkbox__input:not(:checked) + .uxm-checkbox__box`;
  const hoverChecked = `${hover} .uxm-checkbox__input:checked + .uxm-checkbox__box`;
  const hoverGlyph = `${hover} .uxm-checkbox__input:checked + .uxm-checkbox__box > svg`;

  it('keeps the unset defaults', () => {
    expect(paint(css, box, 'background-color')).toBe('transparent');
    expect(paint(css, box, 'border')).toBe('1.5px solid var(--color-border)');
    expect(paint(css, glyph, 'color')).toBe('var(--color-text-inverse)');
    expect(paint(css, checked, 'background-color')).toBe('var(--color-accent)');
    expect(paint(css, checked, 'border-color')).toBe('var(--color-accent)');
  });

  it('paints the registry vars Studio saves', () => {
    const vars = {
      '--uxm-checkbox-unchecked-bg': 'lavender',
      '--uxm-checkbox-unchecked-border': 'gray',
      '--uxm-checkbox-checked-bg': 'green',
      '--uxm-checkbox-checked-border': 'black',
      '--uxm-checkbox-check-glyph-color': 'yellow',
    };
    expect(paint(css, box, 'background-color', vars)).toBe('lavender');
    expect(paint(css, box, 'border', vars)).toBe('1.5px solid gray');
    expect(paint(css, glyph, 'color', vars)).toBe('yellow');
    expect(paint(css, checked, 'background-color', vars)).toBe('green');
    expect(paint(css, checked, 'border-color', vars)).toBe('black');
  });

  it('still honours the older names, and lets the registry names win', () => {
    const legacy = { '--uxm-checkbox-check-color': 'red', '--uxm-checkbox-border-color': 'blue' };
    expect(paint(css, checked, 'background-color', legacy)).toBe('red');
    expect(paint(css, checked, 'border-color', legacy)).toBe('red');
    expect(paint(css, box, 'border', legacy)).toBe('1.5px solid blue');
    // Every chain, not just one: with precedence asserted on `checked-bg`
    // alone, reordering either border's chain so the legacy name won passed.
    expect(paint(css, checked, 'background-color', { ...legacy, '--uxm-checkbox-checked-bg': 'green' })).toBe('green');
    expect(paint(css, checked, 'border-color', { ...legacy, '--uxm-checkbox-checked-border': 'black' })).toBe('black');
    expect(paint(css, box, 'border', { ...legacy, '--uxm-checkbox-unchecked-border': 'gray' })).toBe('1.5px solid gray');
  });

  it('leaves the checked fill and borders on their hover defaults — the deliberate limit', () => {
    // Shipped on purpose: hover deepens to the registry's own hover defaults
    // even over a themed resting colour, so a themed checkbox goes accent-bold
    // under the pointer unless Hover › Checked Background is set too.
    //
    // Pinned because the opposite is a one-line "improvement" that reads like a
    // bug fix — chaining `hover-checked-bg` through `checked-bg` passed every
    // other assertion in this file. Changing it is a design decision, so it
    // should have to change this test and say why.
    const themed = {
      '--uxm-checkbox-checked-bg': 'green',
      '--uxm-checkbox-checked-border': 'black',
      '--uxm-checkbox-unchecked-border': 'gray',
    };
    expect(paint(css, hoverChecked, 'background-color', themed)).toBe('var(--color-accent-bold)');
    expect(paint(css, hoverChecked, 'border-color', themed)).toBe('var(--color-accent-bold)');
    expect(paint(css, hoverUnchecked, 'border-color', themed)).toBe('var(--color-text-strong)');
  });

  it('keeps the unset hover defaults', () => {
    expect(paint(css, hoverUnchecked, 'background-color')).toBe('transparent');
    expect(paint(css, hoverUnchecked, 'border-color')).toBe('var(--color-text-strong)');
    expect(paint(css, hoverChecked, 'background-color')).toBe('var(--color-accent-bold)');
    expect(paint(css, hoverGlyph, 'color')).toBe('var(--color-text-inverse)');
  });

  it('holds a themed unchecked bg and glyph under the pointer', () => {
    const vars = { '--uxm-checkbox-unchecked-bg': 'lavender', '--uxm-checkbox-check-glyph-color': 'black' };
    expect(paint(css, hoverUnchecked, 'background-color', vars)).toBe('lavender');
    expect(paint(css, hoverGlyph, 'color', vars)).toBe('black');
    expect(paint(css, hoverUnchecked, 'background-color', { ...vars, '--uxm-checkbox-hover-unchecked-bg': 'pink' })).toBe('pink');
  });
});

describe('Listbox checkbox marker', () => {
  const css = declarations('listbox/listbox.scss');
  const marker = '.uxm-listbox__option-checkbox';
  const checked = '.uxm-listbox__option-checkbox--checked';

  it('reads the same chains as the Checkbox', () => {
    const legacy = { '--uxm-checkbox-check-color': 'red', '--uxm-checkbox-border-color': 'blue' };
    expect(paint(css, checked, 'background-color', legacy)).toBe('red');
    expect(paint(css, checked, 'border-color', legacy)).toBe('red');
    expect(paint(css, marker, 'border', legacy)).toBe('1.5px solid blue');
    expect(paint(css, checked, 'background-color', { ...legacy, '--uxm-checkbox-checked-bg': 'green' })).toBe('green');
    expect(paint(css, checked, 'border-color', { ...legacy, '--uxm-checkbox-checked-border': 'black' })).toBe('black');
    expect(paint(css, marker, 'border', { ...legacy, '--uxm-checkbox-unchecked-border': 'gray' })).toBe('1.5px solid gray');
  });
});
