import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ICONS } from '@/lib/icons';
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
