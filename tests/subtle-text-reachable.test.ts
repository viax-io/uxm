import { globSync } from 'node:fs';

import postcss from 'postcss';
import * as sass from 'sass';
import { describe, expect, it } from 'vitest';

import { contrastRatio, parseColor } from '@/lib/contrast';

/**
 * `--color-text-subtle` is a **3:1** token by design — separators, idle strokes,
 * disabled marks — and `tokens/index.css` annotates it as such. Several atoms
 * nonetheless default their *label* text to it, and at 10–11px the large-text
 * exemption does not apply, so those are real 1.4.3 failures.
 *
 * Darkening the defaults is a major-release decision, so the library's answer is
 * that **every one of them is reachable from outside**: an app sets the knob and
 * clears AA without overriding the global token, which would drag every
 * separator and disabled mark along with it.
 *
 * That promise is written in `skills/viax-uxm/references/design-tokens.md`
 * ("Small labels that fail AA"). This file is what keeps it true — prose cannot
 * notice an eighth unreachable label being added.
 */
const UI_DIR = 'src/ui';

/** A `color:` declaration that resolves to the subtle token, with its selector. */
interface SubtleUse {
  file: string;
  selector: string;
  value: string;
  knobbed: boolean;
}

function collect(): SubtleUse[] {
  const out: SubtleUse[] = [];
  for (const file of globSync('**/*.scss', { cwd: UI_DIR }).sort()) {
    // Compiled, not read raw: postcss cannot parse SCSS nesting or `//`
    // comments, and compiling is what resolves `&:disabled` and `&__trailing`
    // into the real selectors this test has to tell apart.
    const css = sass.compile(`${UI_DIR}/${file}`).css;
    const root = postcss.parse(css);
    root.walkDecls('color', (decl) => {
      if (!decl.value.includes('--color-text-subtle')) return;
      const rule = decl.parent;
      out.push({
        file,
        selector: rule && rule.type === 'rule' ? (rule as postcss.Rule).selector : '(at-rule)',
        value: decl.value,
        knobbed: /var\(\s*--uxm-[a-z0-9-]+\s*,/.test(decl.value),
      });
    });
  }
  return out;
}

/**
 * WCAG 1.4.3 exempts text in an inactive control. These selectors are those —
 * and only those; anything else painting text with the subtle token is a label
 * a user is meant to read.
 */
const EXEMPT = /(:disabled|\[disabled\]|--disabled|\bdisabled\b)/;

describe('--color-text-subtle used as text', () => {
  const uses = collect();

  it('finds the declarations at all (a silent zero would pass every test below)', () => {
    expect(uses.length).toBeGreaterThan(10);
  });

  it('is reachable from outside wherever it paints a label', () => {
    // Not "no atom may use it" — the defaults are deliberately unchanged. The
    // invariant is weaker and more useful: an app must always be ABLE to fix it.
    const unreachable = uses
      .filter((u) => !u.knobbed && !EXEMPT.test(u.selector))
      .map((u) => `${u.file} — ${u.selector}`);
    expect(
      unreachable,
      'these paint label text with a 3:1 token and expose no --uxm-* knob, so a consumer ' +
        'cannot clear AA without overriding --color-text-subtle globally and dragging every ' +
        'separator and disabled mark with it. Add a knob with the current value as fallback.',
    ).toEqual([]);
  });

  it('pins which declarations default to the subtle token', () => {
    // A plain "the fallback did not drift" assertion cannot see the drift that
    // matters: change a fallback from subtle to muted and the declaration stops
    // being collected at all, so there is nothing left to check. A snapshot sees
    // both directions.
    //
    // Read the diff the way the public-API snapshot is read. A MINUS line is a
    // default that moved — the major-release decision this whole arrangement is
    // deferring, so it should arrive deliberately and not inside an unrelated
    // change. A PLUS line is a new label on a 3:1 token, which wants a knob and
    // a second look at whether subtle is right for it at all.
    expect(uses.map((u) => `${u.file} — ${u.selector}${u.knobbed ? '' : '  [NO KNOB]'}`)).toMatchSnapshot();
  });

  it('pins why this matters: the token is below the text floor in both themes', () => {
    // If a future token revision lifts subtle past 4.5:1, this fails — and the
    // whole exercise, including the doc section, can be retired.
    const rgb = (hex: string) => {
      const c = parseColor(hex);
      expect(c, hex).not.toBeNull();
      return c!;
    };
    const light = contrastRatio(rgb('#8A857D'), rgb('#FFFFFF'));
    const dark = contrastRatio(rgb('#6E6E6E'), rgb('#1B1A18'));
    expect(light, 'light: subtle on card').toBeLessThan(4.5);
    expect(dark, 'dark: subtle on card').toBeLessThan(4.5);
  });
});
