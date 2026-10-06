import { readdirSync, readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { contrastRatio, parseColor } from '@/lib/contrast';
import { findToken, isTokenValue, resolveHex, themeTokens } from '@/tokens';

// `@viax.io/uxm/tokens` is the brand layer consumers and the studio both read.
// Parity between `themeTokens` and `tokens/index.css` is `check:tokens`' job;
// here only the catalog's own invariants and its lookup helpers.

describe('themeTokens', () => {
  it('has a unique cssVar per entry and a variable that wraps it', () => {
    const cssVars = themeTokens.map((t) => t.cssVar);
    expect(new Set(cssVars).size).toBe(cssVars.length);
    for (const token of themeTokens) {
      expect(token.cssVar, token.name).toMatch(/^--color-[a-z0-9-]+$/);
      expect(token.variable, token.name).toBe(`var(${token.cssVar})`);
    }
  });

  it('carries a six-digit light and dark hex on every entry', () => {
    for (const token of themeTokens) {
      expect(token.hex, token.name).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(token.darkHex, token.name).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(token.name.length, token.cssVar).toBeGreaterThan(0);
    }
  });
});

describe('findToken / isTokenValue / resolveHex', () => {
  const first = themeTokens[0];

  it('finds a token by its var() string only', () => {
    expect(findToken(first.variable)).toBe(first);
    expect(findToken(first.cssVar)).toBeUndefined();
    expect(findToken(first.hex)).toBeUndefined();
    expect(findToken('var(--color-does-not-exist)')).toBeUndefined();
  });

  it('treats only var(--color-…) strings as token references', () => {
    expect(isTokenValue('var(--color-accent)')).toBe(true);
    expect(isTokenValue('var(--color-does-not-exist)')).toBe(true);
    expect(isTokenValue('var(--uxm-button-primary-background-color)')).toBe(false);
    expect(isTokenValue('#ffffff')).toBe(false);
    expect(isTokenValue('')).toBe(false);
  });

  it('resolves a known token to its light hex and passes anything else through', () => {
    expect(resolveHex(first.variable)).toBe(first.hex);
    expect(resolveHex('#123456')).toBe('#123456');
    expect(resolveHex('var(--color-does-not-exist)')).toBe('var(--color-does-not-exist)');
  });
});

// ── Contrast contract ────────────────────────────────────────────────────────
// Nothing else in the repo checks what these values MEASURE. `check:tokens`
// compares the catalog hex to tokens.css and stops there; the axe pass has
// `color-contrast` disabled because jsdom has no CSS. That gap is how
// --color-text-muted shipped at 2.37:1 and --color-text-subtle at 1.39:1 —
// both under even the 3:1 floor — with every gate green.
//
// This is a contract, not coverage: a handful of pairings that must hold for
// the library to be usable at all. Ratios are floors, not exact values, so a
// deliberate palette move doesn't churn the test; only a REGRESSION fails it.
describe('token contrast floors', () => {
  const hex = (h: string) => {
    const rgb = parseColor(h);
    if (!rgb) throw new Error(`unparseable hex: ${h}`);
    return rgb;
  };
  const ratio = (fg: string, bg: string) => contrastRatio(hex(fg), hex(bg));
  const pick = (cssVar: string) => {
    const t = themeTokens.find((x) => x.cssVar === cssVar);
    if (!t) throw new Error(`missing token: ${cssVar}`);
    return t;
  };

  // All THREE light grounds. surface-alt is the worst case and the one an
  // earlier draft of this contract missed: subtle measured 2.999:1 on it while
  // passing on surface and card.
  const LIGHT_GROUNDS = ['--color-surface', '--color-surface-alt', '--color-card'] as const;
  const DARK_GROUNDS = ['--color-surface', '--color-card'] as const;

  it('keeps --color-text-muted at the 4.5:1 AA text floor on every light ground', () => {
    const fg = pick('--color-text-muted').hex;
    for (const ground of LIGHT_GROUNDS) {
      expect(ratio(fg, pick(ground).hex), `muted on ${ground}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps --color-text-subtle at the 3:1 non-text floor on every light ground', () => {
    const fg = pick('--color-text-subtle').hex;
    for (const ground of LIGHT_GROUNDS) {
      expect(ratio(fg, pick(ground).hex), `subtle on ${ground}`).toBeGreaterThanOrEqual(3);
    }
  });

  it('keeps subtle BELOW the text floor, so it cannot quietly become a content colour', () => {
    const fg = pick('--color-text-subtle').hex;
    // Not a floor but a ceiling: if subtle ever clears 4.5:1 it has stopped
    // being the quiet level and collapsed into muted's role. That is a design
    // decision, not something to arrive at by drift.
    expect(ratio(fg, pick('--color-card').hex)).toBeLessThan(4.5);
  });

  it('keeps the accent glyph readable on the accent tint in both themes', () => {
    const bold = pick('--color-accent-bold');
    const subtle = pick('--color-accent-subtle');
    expect(ratio(bold.hex, subtle.hex), 'light').toBeGreaterThanOrEqual(4.5);
    expect(ratio(bold.darkHex, subtle.darkHex), 'dark').toBeGreaterThanOrEqual(4.5);
  });

  it('keeps dark text levels at their floors', () => {
    const muted = pick('--color-text-muted').darkHex;
    const subtle = pick('--color-text-subtle').darkHex;
    for (const ground of DARK_GROUNDS) {
      const bg = pick(ground).darkHex;
      expect(ratio(muted, bg), `dark muted on ${ground}`).toBeGreaterThanOrEqual(4.5);
      expect(ratio(subtle, bg), `dark subtle on ${ground}`).toBeGreaterThanOrEqual(3);
    }
    // NOT asserted: dark subtle on --color-surface-alt, which measures 2.85:1.
    // That is a real pre-existing miss, left visible here rather than papered
    // over — see the Unreleased note in skills/viax-uxm/SKILL.md.
  });
});

// ── Layering contract ────────────────────────────────────────────────────────
// The `--z-*` scale is a published ordering, and this change's whole promise is
// that declaring it moved nothing. Both halves are pinned here because neither
// is reachable from jsdom: there is no CSS cascade in the test environment, so
// these read the stylesheets as text.
//
// Comments are stripped FIRST, and the tiers are read only from their own
// block. The first version of this test did neither, and a planted
// `/* --z-dialog: 60; */` above a real `--z-dialog: 99;` passed all 13 cases —
// the same bug the parity script had.
describe('layering scale', () => {
  const strip = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');
  const tokensCss = strip(readFileSync('src/tokens/index.css', 'utf8'));

  /** The `:where(:root)` block that declares the scale — not any other block. */
  const scaleBlock = (() => {
    const m = /:where\(:root\)\s*\{([^}]*)\}/.exec(tokensCss);
    if (!m) throw new Error('the :where(:root) layering block is gone');
    return m[1];
  })();

  const tier = (name: string) => {
    const m = new RegExp(String.raw`--z-${name}:\s*(\d+);`).exec(scaleBlock);
    if (!m) throw new Error(`--z-${name} is not declared in the layering block`);
    return Number(m[1]);
  };

  /** Every `var(--z-NAME, FALLBACK)` across the shipped stylesheets. */
  const readers = (() => {
    const out: { file: string; name: string; fallback: number }[] = [];
    const walk = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const full = `${dir}/${e.name}`;
        if (e.isDirectory()) walk(full);
        else if (e.name.endsWith('.scss') || e.name.endsWith('.css')) {
          const src = strip(readFileSync(full, 'utf8'));
          for (const m of src.matchAll(/var\(\s*--z-([a-z]+)\s*,\s*(\d+)\s*\)/g)) {
            out.push({ file: full, name: m[1], fallback: Number(m[2]) });
          }
        }
      }
    };
    walk('src');
    return out;
  })();

  it('declares the tiers in a strict order', () => {
    // panel and drawer share 40 on purpose — alternatives, never both on screen.
    expect(tier('panel')).toBe(tier('drawer'));
    expect(tier('drawer')).toBeLessThan(tier('dialog'));
    expect(tier('dialog')).toBeLessThan(tier('toast'));
    expect(tier('toast')).toBeLessThan(tier('popover'));
  });

  it('leaves the Popover default BELOW the dialog tier', () => {
    // The compatibility promise: Popover keeps its shipped fallback, so no
    // consumer's stacking moves until they opt in. Raising it is a
    // major-release decision — if this fails, that is the question being
    // answered, not a number to update.
    const popoverScss = strip(readFileSync('src/ui/popover/popover.scss', 'utf8'));
    const fallback = /--uxm-popover-z-index,\s*(\d+)\)/.exec(popoverScss);
    expect(fallback, 'popover.scss no longer reads --uxm-popover-z-index with a fallback').not.toBeNull();
    expect(Number(fallback![1])).toBe(50);
    expect(Number(fallback![1])).toBeLessThan(tier('dialog'));
  });

  it('keeps EVERY reader\'s fallback equal to the tier it reads', () => {
    // Globbed, not a hard-coded list: a tier declared at a value different from
    // some reader's fallback restacks that component silently, and a new reader
    // added later must not slip past this.
    expect(readers.length, 'no --z-* readers found — the glob is broken').toBeGreaterThan(0);
    for (const r of readers) {
      expect(Number.isNaN(tier(r.name)), `${r.file} reads undeclared --z-${r.name}`).toBe(false);
      expect(r.fallback, `${r.file}: var(--z-${r.name}, ${r.fallback}) drifted from the declared ${tier(r.name)}`).toBe(tier(r.name));
    }
  });

  it('keeps the opt-in tiers read by nobody', () => {
    // `--z-popover` and `--z-panel` are opt-in/reserved. The moment a stylesheet
    // reads one, the default stacking HAS moved and this stops being additive.
    for (const name of ['popover', 'panel']) {
      const found = readers.filter((r) => r.name === name);
      expect(found.map((r) => r.file), `--z-${name} is now read by the library — that changes a default`).toEqual([]);
    }
  });
});
