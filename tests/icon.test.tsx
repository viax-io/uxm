import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ICONS, ICON_IDS, ICON_OPTIONS, getIcon, matchesIconQuery, registerIcons } from '@/lib/icons';
import { Icon, SearchDropdown } from '@/ui';
import { IconPreview } from '@/ui/icon/icon-preview';

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

  it('keeps house-drawn circles on the 0.375 half-grid', () => {
    // The house glyphs claim Heroicons' grid discipline. The claim is only
    // true of circle centres/radii and axis-aligned bars: the points where a
    // connector meets a circle tangentially are computed, and snapping them
    // visibly detaches the line. So pin the part that IS a rule, and let the
    // comment in icons.ts carry the exception — an unpinned prose claim about
    // `coins` and `webhook` was simply false for a release.
    const HOUSE = ['activity', 'dot-circle', 'coins', 'git-fork', 'plug', 'webhook'];
    const onGrid = (n: number) => Math.abs(n / 0.375 - Math.round(n / 0.375)) < 1e-9;
    for (const id of HOUSE) {
      const def = ICONS.find((d) => d.id === id);
      expect(def?.body, `${id} should be a house-drawn body glyph`).toBeTruthy();
      for (const circle of def!.body!.match(/<circle[^>]*>/g) ?? []) {
        for (const n of (circle.match(/-?\d*\.?\d+/g) ?? []).map(Number)) {
          expect(onGrid(n), `${id}: ${n} in ${circle} is off the 0.375 grid`).toBe(true);
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
// works if the pickers actually consult the field — the labels were
// deliberately cleaned of those terms, so there is no fallback.
describe('icon keywords', () => {
  // The REAL predicate, imported — not a copy. A copy of the filter lived here
  // once and all sixteen tests stayed green when the shipped filter lost its
  // `keywords` clause, which is the whole failure this suite exists to catch.
  const search = (q: string) => ICONS.filter((d) => matchesIconQuery(d, q)).map((d) => d.id);

  it('finds a glyph by a name that ONLY `keywords` carries', () => {
    // Deliberately terms the id and label do NOT contain. An earlier version of
    // this test used "ban" while the label still read "No Symbol (Ban)", which
    // matched on its own — so it passed with the keywords deleted, proving
    // nothing. The label is now just "No Symbol", so "ban" is a real probe.
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
      ['ban', 'no-symbol'],
      ['send', 'paper-airplane'],
    ] as const) {
      expect(byIdOrLabel(term), `"${term}" is reachable without keywords — pick a sharper term`)
        .not.toContain(expected);
      expect(search(term), `searching "${term}"`).toContain(expected);
    }
  });

  it('matches case- and whitespace-insensitively', () => {
    expect(search('  LOG OUT  ')).toContain('arrow-right-start-on-rectangle');
    expect(search('')).toHaveLength(ICONS.length);
  });

  it('carries keywords through to ICON_OPTIONS for the studio picker', () => {
    // The studio's glyph pickers render ICON_OPTIONS, not ICONS. Synonyms used
    // to ride along in the label; once they moved to `keywords`, dropping them
    // from this projection would silently cost those pickers every synonym.
    const noSymbol = ICON_OPTIONS.find((o) => o.value === 'no-symbol');
    expect(noSymbol?.keywords).toContain('ban');
    for (const d of ICONS.filter((i) => i.keywords?.length)) {
      expect(
        ICON_OPTIONS.find((o) => o.value === d.id)?.keywords,
        `${d.id}: keywords missing from ICON_OPTIONS`,
      ).toEqual(d.keywords);
    }
  });

  it('keeps labels as names, not keyword lists', () => {
    // The set's convention: at most ONE parenthetical disambiguator
    // ("Cog (6 Tooth)", "Archive (Empty)") — never a synonym list, which is
    // what `keywords` is for. Checks EVERY parenthetical, and both separators
    // a list would use: "(Ban; Blocked)" and "(Ban) (Blocked)" used to pass.
    for (const d of ICONS) {
      const parens = [...d.label.matchAll(/\(([^)]*)\)/g)].map((m) => m[1]);
      expect(parens.length, `${d.id}: "${d.label}" has ${parens.length} parentheticals`)
        .toBeLessThanOrEqual(1);
      for (const inner of parens) {
        expect(inner, `${d.id}: "${d.label}" reads as a keyword list`).not.toMatch(/[,;]/);
      }
    }
  });

  it('declares no keyword already reachable through the id or label', () => {
    // Not just equality — a keyword that is a SUBSTRING of either is dead
    // weight, because the filter is a substring test on all three. "archive"
    // on `archive-box` and "fork" on `git-fork` were exactly this.
    const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    for (const d of ICONS) {
      for (const k of d.keywords ?? []) {
        const reachable = norm(d.id).includes(norm(k)) || norm(d.label).includes(norm(k));
        expect(reachable, `${d.id}: keyword "${k}" is already found via id/label`).toBe(false);
      }
    }
  });
});

// The two consumers of the predicate, exercised through what they actually
// render — the unit tests above cannot tell whether either one calls it.
describe('icon search reaches both pickers', () => {
  it('filters the preview grid by a keyword-only term', async () => {
    const user = userEvent.setup();
    render(
      <IconPreview
        componentId="icon"
        styles={{ size: 24, strokeWidth: 1.75, color: 'currentColor' }}
        variants={{}}
      />,
    );
    expect(screen.getByText('no-symbol')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Search icons'), 'blocked');
    expect(screen.getByText('no-symbol')).toBeInTheDocument();
    expect(screen.queryByText('archive-box')).not.toBeInTheDocument();
  });

  it('filters a SearchDropdown of ICON_OPTIONS by a keyword-only term', async () => {
    const user = userEvent.setup();
    render(<SearchDropdown value="" onChange={() => {}} options={ICON_OPTIONS} aria-label="Glyph" />);
    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByPlaceholderText(/search/i), 'blocked');
    expect(screen.getByRole('option', { name: /no symbol/i })).toBeInTheDocument();
  });
});
