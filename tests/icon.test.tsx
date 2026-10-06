import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ICONS, ICON_IDS, ICON_OPTIONS, getIcon, registerIcons } from '@/lib/icons';
import { Icon } from '@/ui';

// The accessible-name pollution this guards ("Kebab (More) Publish") was
// reported from a consumer, not caught here — hence the test.
describe('Icon', () => {
  it('is decorative by default', () => {
    const { container } = render(<Icon glyph="close" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
  });

  it('becomes an informative image when labelled', () => {
    const { getByRole } = render(<Icon glyph="close" aria-label="Close" />);
    expect(getByRole('img', { name: 'Close' })).toBeInTheDocument();
  });

  it('treats an empty label as decorative, not as an unnamed image', () => {
    const { container } = render(<Icon glyph="close" aria-label="" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders nothing for an unknown glyph', () => {
    const { container } = render(<Icon glyph="no-such-glyph" />);
    expect(container.firstChild).toBeNull();
  });
});

// ── Registry contract ───────────────────────────────────────────────────────
// `Icon` splits `def.path` on /(?=M)/ and emits one <path> per segment, so the
// string's shape is a real contract — and the one nothing else checks. A
// malformed path passes lint, typecheck, check:drift and every test here; it
// just renders wrong, or silently renders nothing. jsdom implements no SVG
// geometry, so these are structural assertions on the data, not on rendering.
//
// NOT asserted: the absence of a lowercase `m`. 44 icons use one as a
// continuation inside a single subpath, which is valid — the splitter only
// cares about uppercase boundaries.
describe('icon registry', () => {
  it('gives every icon exactly one of `path` or `body`', () => {
    for (const def of ICONS) {
      expect(Boolean(def.path) !== Boolean(def.body), def.id).toBe(true);
    }
  });

  it('never splits a `path` into a headless segment', () => {
    // NOT "every path starts with M": `search` opens with a relative `m`, which
    // is valid and splits to a single segment. What must hold is that no split
    // produces an empty or whitespace-only chunk, which would render <path d="">.
    for (const def of ICONS) {
      if (!def.path) continue;
      const segments = def.path.split(/(?=M)/);
      expect(segments.length, def.id).toBeGreaterThan(0);
      for (const seg of segments) {
        expect(seg.trim().length, `${def.id}: empty segment`).toBeGreaterThan(0);
      }
    }
  });

  it('parses every arc against the real SVG grammar', () => {
    // rx ry x-axis-rotation large-arc-flag sweep-flag dx dy, and the two flags
    // are SINGLE CHARACTERS that need no separator. `archive-x` writes them
    // packed as `a2.25 2.25 0 01-2.247 2.118` -- counting numbers there gives 6,
    // not 7, so a naive check fails on valid data. One `a` may also carry
    // several groups without repeating the letter (`check-circle` carries two).
    // This consumes each arc run with that grammar and requires it to be fully
    // eaten: a dropped or merged parameter leaves a remainder.
    const consumeArcRun = (run: string): boolean => {
      let i = 0;
      const ws = () => { while (i < run.length && /[\s,]/.test(run[i])) i += 1; };
      const num = () => {
        ws();
        const m = /^-?\d*\.?\d+(?:e-?\d+)?/.exec(run.slice(i));
        if (!m) return false;
        i += m[0].length;
        return true;
      };
      const flag = () => { ws(); if (run[i] !== '0' && run[i] !== '1') return false; i += 1; return true; };
      let groups = 0;
      for (;;) {
        ws();
        if (i >= run.length) break;
        if (!(num() && num() && num() && flag() && flag() && num() && num())) return false;
        groups += 1;
      }
      return groups > 0;
    };

    // `body` is markup, not path data -- scanning it for the letter `a` matches
    // inside attribute names (stroke-line*ca*p). Pull the d="..." values out.
    const pathData = (def: (typeof ICONS)[number]): string[] =>
      def.path
        ? [def.path]
        : [...(def.body ?? '').matchAll(/\sd="([^"]*)"/g)].map((m) => m[1]);

    for (const def of ICONS) {
      for (const d of pathData(def)) {
        for (const run of d.matchAll(/[aA]([^a-zA-Z]*)/g)) {
          expect(consumeArcRun(run[1]), `${def.id}: malformed arc "a${run[1].slice(0, 32)}"`).toBe(true);
        }
      }
    }
  });

  it('keeps ids unique', () => {
    const ids = ICONS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ── Registration API ─────────────────────────────────────────────────────────
// `registerIcons` mutates module-global state, so each test puts the registry
// back. The bug it exists to remove is a stale `ICON_OPTIONS`: it used to be a
// one-shot `.map()` taken at module load, so anything that extended the set
// left the studio's icon picker showing the old list.
describe('registerIcons', () => {
  const snapshot = () => ({ icons: [...ICONS], options: [...ICON_OPTIONS] });
  const restore = (s: ReturnType<typeof snapshot>) => {
    ICONS.length = 0; ICONS.push(...s.icons);
    ICON_OPTIONS.length = 0; ICON_OPTIONS.push(...s.options);
    // Nothing else to reset: `getIcon` reads ICONS directly. An earlier draft
    // kept a Map here and this line claimed to rebuild it, which it did not do
    // for a same-length replacement -- a latent cross-test leak.
  };

  it('appends a new glyph to ICONS, ICON_OPTIONS and lookup together', () => {
    const before = snapshot();
    try {
      const replaced = registerIcons([{ id: 'test-glyph', label: 'Test', path: 'M0 0h24' }]);
      expect(replaced).toBe(0);
      expect(getIcon('test-glyph')?.label).toBe('Test');
      expect(ICONS.at(-1)?.id).toBe('test-glyph');
      // The whole point: the picker list must not be stale.
      expect(ICON_OPTIONS.at(-1)).toEqual({ value: 'test-glyph', label: 'Test' });
      expect(ICON_OPTIONS).toHaveLength(ICONS.length);
    } finally { restore(before); }
  });

  it('replaces an existing id in place rather than duplicating the picker row', () => {
    const before = snapshot();
    try {
      const n = ICONS.length;
      const replaced = registerIcons([{ id: 'wrench', label: 'Our Wrench', path: 'M1 1h2' }]);
      expect(replaced).toBe(1);
      expect(ICONS).toHaveLength(n);
      expect(getIcon('wrench')?.label).toBe('Our Wrench');
      expect(ICON_OPTIONS.filter((o) => o.value === 'wrench')).toHaveLength(1);
      expect(ICON_OPTIONS.find((o) => o.value === 'wrench')?.label).toBe('Our Wrench');
    } finally { restore(before); }
  });

  it('keeps getIcon live when ICONS is replaced in place', () => {
    // The regression that killed an id->def Map: `ICONS[i] = {...}` leaves the
    // length unchanged, so any length-based cache invalidation misses it and
    // getIcon returns the old glyph. Direct mutation is out of contract, but it
    // was the ONLY way to extend the set before registerIcons existed, so it is
    // exactly the code most likely to be mid-migration.
    const before = snapshot();
    try {
      const at = ICONS.findIndex((i) => i.id === 'plus');
      ICONS[at] = { id: 'plus', label: 'Replaced', path: 'M0 0h1' };
      expect(getIcon('plus')?.label).toBe('Replaced');
    } finally { restore(before); }
  });

  it('keeps getIcon working when something pushes onto ICONS directly', () => {
    // Out of contract, but it was the only way to extend the set before this
    // API existed, so a stale index would punish exactly the code being migrated.
    const before = snapshot();
    try {
      ICONS.push({ id: 'smuggled', label: 'Smuggled', path: 'M0 0h1' });
      expect(getIcon('smuggled')?.label).toBe('Smuggled');
    } finally { restore(before); }
  });
});

describe('ICON_IDS', () => {
  it('matches ICONS exactly, in order', () => {
    // ICON_IDS is hand-maintained because a literal union needs const-ness that
    // `ICONS: IconDef[]` cannot give. This is what stops it drifting.
    expect([...ICON_IDS]).toEqual(ICONS.map((i) => i.id));
  });
});

// ── Findability ──────────────────────────────────────────────────────────────
// Ids follow this set's naming, not another library's, so a glyph people know
// under a different name is reachable through `keywords` instead. That only
// works if the studio's icon search actually consults the field — nothing else
// would fail if someone dropped it from the filter, and the labels were
// deliberately cleaned of those terms, so the fallback is gone.
describe('icon keywords', () => {
  // Mirrors the filter in src/ui/icon/icon-preview.tsx.
  const search = (q: string) => {
    const needle = q.trim().toLowerCase();
    return ICONS.filter(
      (d) =>
        d.id.toLowerCase().includes(needle) ||
        d.label.toLowerCase().includes(needle) ||
        d.keywords?.some((k) => k.toLowerCase().includes(needle)),
    ).map((d) => d.id);
  };

  it('finds a glyph by a name that ONLY `keywords` carries', () => {
    // Deliberately terms the id and label do NOT contain. An earlier version of
    // this test used "ban", which the label "No Symbol (Ban)" matches on its
    // own — so it passed even with the keywords deleted, proving nothing.
    const byIdOrLabel = (q: string) =>
      ICONS.filter(
        (d) => d.id.toLowerCase().includes(q) || d.label.toLowerCase().includes(q),
      ).map((d) => d.id);

    for (const [term, expected] of [
      ['scroll-text', 'document-text'],
      ['circle-dot', 'dot-circle'],
      ['arrow-down-up', 'arrows-up-down'],
      ['shield-alert', 'shield-exclamation'],
      ['credits', 'coins'],
      ['blocked', 'no-symbol'],
      ['logout', 'arrow-right-start-on-rectangle'],
    ] as const) {
      expect(byIdOrLabel(term), `"${term}" is reachable without keywords — pick a sharper term`)
        .not.toContain(expected);
      expect(search(term), `searching "${term}"`).toContain(expected);
    }
  });

  it('keeps labels as names, not keyword lists', () => {
    // The set's convention: at most ONE parenthetical disambiguator
    // ("Cog (6 Tooth)", "Archive (Empty)") — never a comma-separated synonym
    // list, which is what `keywords` is for.
    for (const d of ICONS) {
      const paren = /\(([^)]*)\)/.exec(d.label);
      expect(paren?.[1] ?? '', `${d.id}: "${d.label}" reads as a keyword list`).not.toContain(',');
    }
  });

  it('declares no keyword that merely repeats the id', () => {
    for (const d of ICONS) {
      for (const k of d.keywords ?? []) {
        expect(k.toLowerCase(), `${d.id}: keyword "${k}" is redundant`).not.toBe(d.id.toLowerCase());
      }
    }
  });
});
