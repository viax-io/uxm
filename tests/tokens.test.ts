import { readdirSync, readFileSync } from 'node:fs';

import postcss from 'postcss';
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
    const out: { file: string; name: string; fallback: number | null }[] = [];
    const walk = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const full = `${dir}/${e.name}`;
        if (e.isDirectory()) walk(full);
        else if (e.name.endsWith('.scss') || e.name.endsWith('.css')) {
          const src = strip(readFileSync(full, 'utf8'));
          // The fallback is OPTIONAL in this match on purpose. It used to be
          // required, which meant `var(--z-popover)` — a reader with no
          // fallback, which is exactly how an opt-in is written — slipped
          // past the very test meant to catch it.
          for (const m of src.matchAll(/var\(\s*--z-([a-z]+)\s*(?:,\s*(\d+)\s*)?\)/g)) {
            out.push({ file: full, name: m[1], fallback: m[2] === undefined ? null : Number(m[2]) });
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
      // A reader with no fallback is an opt-in, not a component default; the
      // scoping rule below is what governs those.
      if (r.fallback === null) continue;
      expect(r.fallback, `${r.file}: var(--z-${r.name}, ${r.fallback}) drifted from the declared ${tier(r.name)}`).toBe(tier(r.name));
    }
  });

  it('lets exactly ONE place take an opt-in tier, under exactly one scoped selector', () => {
    // An ALLOWLIST, not a denylist. The previous shape of this test rejected
    // `:root` and allowed everything else, which let five regressions through:
    // a `:root` nested in `@media`, an `html` selector, a second read later in
    // the same file, and — worst — a component stylesheet taking the tier as
    // its own default (`.x { z-index: var(--z-popover) }`), which the ORIGINAL
    // "read by nobody" test had caught. Enumerate what is allowed instead, so
    // anything new has to be added here deliberately.
    //
    // Parsed with postcss rather than regex: the selector is `rule.selector`
    // and the at-rule chain is walkable, so `@media { :root { … } }` cannot be
    // mistaken for a scoped rule the way string slicing did.
    const ALLOWED = [
      { file: 'src/studio/studio-shell.css', selector: 'body.uxm-studio-pane-open' },
    ];

    const found: { file: string; selector: string; atRules: string[] }[] = [];
    const walkDir = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const full = `${dir}/${e.name}`;
        if (e.isDirectory()) { walkDir(full); continue; }
        if (!e.name.endsWith('.css') && !e.name.endsWith('.scss')) continue;
        let root;
        try { root = postcss.parse(readFileSync(full, 'utf8'), { from: full }); }
        catch { continue; } // scss the CSS parser can't take — none read these tiers
        root.walkDecls((decl) => {
          if (!/var\(\s*--z-(popover|panel)\b/.test(decl.value)) return;
          const atRules: string[] = [];
          let node: postcss.Container | postcss.Document | undefined = decl.parent;
          let selector = '';
          while (node) {
            if (node.type === 'rule' && !selector) {
              selector = (node as postcss.Rule).selector.replace(/\s+/g, ' ').trim();
            }
            if (node.type === 'atrule') {
              const at = node as postcss.AtRule;
              atRules.unshift(`@${at.name} ${at.params}`.trim());
            }
            node = node.parent;
          }
          found.push({ file: full, selector, atRules });
        });
      }
    };
    walkDir('src');

    // Nothing may hide inside an at-rule, where a root selector reads as scoped.
    for (const f of found) {
      expect(f.atRules, `${f.file}: opt-in tier taken inside ${f.atRules.join(' > ')}`).toEqual([]);
    }

    // The set must match the allowlist EXACTLY — every entry, every selector.
    const norm = (x: { file: string; selector: string }) => `${x.file} :: ${x.selector}`;
    expect(
      found.map(norm).sort(),
      'a stylesheet takes --z-popover/--z-panel somewhere new. That moves default stacking, which the constitution calls a major-release decision — add it here only if that is the intent.',
    ).toEqual(ALLOWED.map(norm).sort());
  });

  it('never pins the popover tier at a root selector with a literal', () => {
    // The sibling hole: `:root { --uxm-popover-z-index: 90 }` moves the same
    // default without mentioning --z-* at all, so the tier-reader scan above
    // cannot see it.
    const walkDir = (dir: string, out: string[] = []): string[] => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const full = `${dir}/${e.name}`;
        if (e.isDirectory()) walkDir(full, out);
        else if (e.name.endsWith('.css') || e.name.endsWith('.scss')) out.push(full);
      }
      return out;
    };
    for (const file of walkDir('src')) {
      let root;
      try { root = postcss.parse(readFileSync(file, 'utf8'), { from: file }); } catch { continue; }
      root.walkDecls('--uxm-popover-z-index', (decl) => {
        const selector = decl.parent?.type === 'rule' ? decl.parent.selector : '';
        expect(
          /(^|,)\s*(:where\()?\s*(:root|html|\*)\b/.test(selector),
          `${file}: --uxm-popover-z-index set at "${selector}" — that moves every host's stacking`,
        ).toBe(false);
      });
    }
  });
});
