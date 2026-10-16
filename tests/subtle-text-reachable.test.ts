import { globSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import postcss from 'postcss';
import * as sass from 'sass';
import { describe, expect, it } from 'vitest';

import { contrastRatio, parseColor } from '@/lib/contrast';
import { themeTokens } from '@/tokens';

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
 *
 * The rule has **no exemption list**, deliberately. An earlier version excused
 * `:disabled` selectors, since WCAG exempts inactive controls — but deciding
 * that from a selector string is a trap: `:hover:not(:disabled)` and
 * `.x:not(.x--disabled)` both read as "disabled", and a comma list exempted
 * every branch when only one was inactive. Knobbing the single disabled
 * declaration that lacked one (`Calendar`'s today button) removed the need to
 * classify at all, and Constitution I wanted that knob regardless.
 */
const UI_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../src/ui');

/**
 * Properties that paint text. `-webkit-text-fill-color` is included because it
 * WINS over `color` where both are set, so a label could be re-coloured through
 * it and slip past a `color`-only rule.
 */
const TEXT_PROPS = new Set(['color', '-webkit-text-fill-color']);

interface SubtleUse {
  file: string;
  selector: string;
  prop: string;
  knobbed: boolean;
}

function collect(): { uses: SubtleUse[]; fileCount: number } {
  const uses: SubtleUse[] = [];
  // Forward slashes so a Windows checkout produces the same snapshot keys.
  const files = globSync('**/*.scss', { cwd: UI_DIR }).map((f) => f.replaceAll('\\', '/')).sort();
  for (const file of files) {
    // Compiled, not read raw: postcss cannot parse SCSS nesting or `//`
    // comments, and compiling is what resolves `&:disabled` and `&__trailing`
    // into the real selectors.
    const css = sass.compile(resolve(UI_DIR, file)).css;
    postcss.parse(css).walkDecls((decl) => {
      // Word-boundary on the close, so a future `--color-text-subtle-2` is not
      // swept up as if it were this token.
      if (!/var\(\s*--color-text-subtle\s*[,)]/.test(decl.value)) return;
      const rule = decl.parent;
      uses.push({
        file,
        // Collapsed: sass preserves source line breaks inside a selector list,
        // so an unrelated reflow would otherwise churn the snapshot.
        selector:
          rule && rule.type === 'rule'
            ? (rule as postcss.Rule).selector.replace(/\s+/g, ' ')
            : '(at-rule)',
        prop: decl.prop,
        knobbed: /var\(\s*--uxm-[a-z0-9-]+\s*,/.test(decl.value),
      });
    });
  }
  return { uses, fileCount: files.length };
}

describe('--color-text-subtle used as text', () => {
  const { uses, fileCount } = collect();

  it('actually compiled the stylesheets (a silent zero would pass everything below)', () => {
    expect(fileCount, 'src/ui stylesheets found').toBeGreaterThan(50);
    expect(uses.length, 'declarations reading the subtle token').toBeGreaterThan(20);
  });

  it('is reachable from outside wherever it paints text', () => {
    // Not "no atom may use it" — the defaults are deliberately unchanged. The
    // invariant is weaker and more useful: an app must always be ABLE to fix it.
    const unreachable = uses
      .filter((u) => TEXT_PROPS.has(u.prop) && !u.knobbed)
      .map((u) => `${u.file} — ${u.selector} { ${u.prop} }`);
    expect(
      unreachable,
      'these paint text with a 3:1 token and expose no --uxm-* knob, so a consumer cannot ' +
        'clear AA without overriding --color-text-subtle globally and dragging every separator ' +
        'and disabled mark with it. Add a knob with the current value as fallback.',
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
    // change. A PLUS line is a new use of a 3:1 token that wants a second look.
    //
    // Sorted, so moving a rule within a file or between files is not a diff.
    expect(
      uses
        .map((u) => `${u.file} — ${u.selector} { ${u.prop} }${u.knobbed ? '' : '  [NO KNOB]'}`)
        .sort(),
    ).toMatchSnapshot();
  });

  it('pins why this matters: the token is below the text floor on every ground', () => {
    // Read from `themeTokens` rather than hardcoded hexes, so a token revision
    // that lifts subtle past 4.5:1 fails here — and this file, along with the
    // doc section it guards, can be retired.
    // By `cssVar`, not `findToken`, which keys on the `var(...)` wrapper.
    const byVar = (cssVar: string) => themeTokens.find((t) => t.cssVar === cssVar);
    const subtle = byVar('--color-text-subtle');
    expect(subtle, '--color-text-subtle missing from themeTokens').toBeTruthy();

    const rgb = (hex: string) => {
      const c = parseColor(hex);
      expect(c, hex).not.toBeNull();
      return c!;
    };

    for (const name of ['--color-card', '--color-surface', '--color-surface-alt'] as const) {
      const ground = byVar(name);
      expect(ground, `${name} missing from themeTokens`).toBeTruthy();
      for (const theme of ['hex', 'darkHex'] as const) {
        const ratio = contrastRatio(rgb(subtle![theme]), rgb(ground![theme]));
        expect(ratio, `${theme} — subtle on ${name}`).toBeLessThan(4.5);
      }
    }
  });
});
