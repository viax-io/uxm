import { readFileSync } from 'node:fs';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RangeBar } from '@/ui';
import { rangeBarPosition } from '@/ui/range-bar/range-bar';

const fill = (c: HTMLElement) => c.querySelector('.uxm-range-bar__fill') as HTMLElement;
const root = (c: HTMLElement) => c.querySelector('.uxm-range-bar') as HTMLElement;
/** The two unitless vars the CSS turns into `left` and `width`. */
const vars = (c: HTMLElement) => ({
  start: root(c).style.getPropertyValue('--uxm-range-bar-start'),
  end: root(c).style.getPropertyValue('--uxm-range-bar-end'),
});

describe('rangeBarPosition', () => {
  it('maps an interval onto its domain as percentages', () => {
    expect(rangeBarPosition([25, 75], 0, 100)).toEqual({ start: 25, end: 75 });
    expect(rangeBarPosition([50, 100], 0, 200)).toEqual({ start: 25, end: 50 });
  });

  it('respects a domain that does not start at zero', () => {
    // The consumer's own `pos()` divides by `max` alone, which silently assumes
    // a zero floor. An atom cannot.
    expect(rangeBarPosition([150, 200], 100, 300)).toEqual({ start: 25, end: 50 });
  });

  it('clamps at BOTH ends, not just the top', () => {
    // Clamping only the top is exactly how a negative offset gets through —
    // and a negative `left` paints off the track.
    expect(rangeBarPosition([-40, 160], 0, 100)).toEqual({ start: 0, end: 100 });
    expect(rangeBarPosition([-40, 50], 0, 100).start).toBe(0);
  });

  it('normalises an inverted interval instead of producing a negative width', () => {
    expect(rangeBarPosition([80, 20], 0, 100)).toEqual({ start: 20, end: 80 });
  });

  it.each([
    ['min === max divides by zero', [5, 10], 50, 50],
    ['an infinite max — a ladder derives it from spans that can BE infinite', [0, 500], 0, Infinity],
    ['an infinite value in an infinite domain', [0, Infinity], 0, Infinity],
    ['a doubly infinite domain', [0, 50], -Infinity, Infinity],
    ['a NaN domain', [0, 50], NaN, 100],
    ['a NaN in the value', [NaN, 50], 0, 100],
    ['a domain whose span overflows to Infinity', [0, 1e308], -1e308, 1e308],
  ])('never emits NaN for %s', (_label, value, min, max) => {
    // NaN is not an error anyone sees — the bar simply does not paint — which
    // is the whole failure class this function exists to close. The first case
    // used to be the only one guarded.
    const r = rangeBarPosition(value as [number, number], min as number, max as number);
    expect(Number.isFinite(r.start), `start: ${r.start}`).toBe(true);
    expect(Number.isFinite(r.end), `end: ${r.end}`).toBe(true);
  });

  it.each([
    ['an infinite max', [0, 500], 0, Infinity],
    ['a doubly infinite domain', [0, 50], -Infinity, Infinity],
    ['a span that overflows', [0, 1e308], -1e308, 1e308],
  ])('fills the track for %s, rather than collapsing to a stub', (_l, value, min, max) => {
    // Not just "finite": without the span guard every finite value maps to 0%
    // of an infinite domain, which is finite AND invisible. An unusable domain
    // is treated like the degenerate one — the whole track — so the row still
    // says something.
    expect(rangeBarPosition(value as [number, number], min as number, max as number)).toEqual({
      start: 0,
      end: 100,
    });
  });

  it('survives a missing or short value', () => {
    // Server JSON and unset spans are both real sources of this.
    expect(() => rangeBarPosition(undefined as never, 0, 100)).not.toThrow();
    const short = rangeBarPosition([5] as never, 0, 100);
    expect(Number.isFinite(short.start) && Number.isFinite(short.end)).toBe(true);
  });

  it('computes exact percentages for whole numbers', () => {
    // `((n - lo) / span) * 100` drifts: 55 came out as 55.00000000000001 and
    // landed in the DOM. The multiplication has to come first.
    expect(rangeBarPosition([55, 80], 0, 100).start).toBe(55);
    expect(rangeBarPosition([7, 14], 0, 100)).toEqual({ start: 7, end: 14 });
  });

  it('survives an inverted domain', () => {
    expect(rangeBarPosition([25, 75], 100, 0)).toEqual({ start: 25, end: 75 });
  });

  it('keeps a point interval as a zero-width position, for CSS to floor', () => {
    // The width is genuinely 0 here; `min-width` on the fill is what makes it
    // visible, so the maths must not fake a span.
    expect(rangeBarPosition([50, 50], 0, 100)).toEqual({ start: 50, end: 50 });
  });
});

describe('RangeBar', () => {
  it('projects the position as unitless custom properties', () => {
    const { container } = render(<RangeBar value={[25, 75]} />);
    expect(vars(container)).toEqual({ start: '25', end: '75' });
    expect(fill(container)).not.toBeNull();
  });

  it('never writes NaN into the style, whatever the domain', () => {
    const { container } = render(<RangeBar value={[5, 10]} min={50} max={50} />);
    const { start, end } = vars(container);
    expect(`${start}${end}`).not.toContain('NaN');
  });

  it('applies the type modifier', () => {
    const { container } = render(<RangeBar value={[0, 50]} type="danger" />);
    expect(root(container)).toHaveClass('uxm-range-bar--danger');
    expect(root(container), 'default type should not be applied too').not.toHaveClass(
      'uxm-range-bar--accent',
    );
  });

  it('flags open ends on the fill, and only the ones asked for', () => {
    const { container } = render(<RangeBar value={[0, 50]} openEnd />);
    expect(fill(container)).toHaveAttribute('data-open-end');
    expect(fill(container)).not.toHaveAttribute('data-open-start');
  });

  it('leaves a closed interval with neither flag', () => {
    // Asserting the flag only on a bar that HAS it would pass just as well if
    // the attribute were unconditional — in which case every bar would fade.
    const { container } = render(<RangeBar value={[0, 50]} />);
    expect(fill(container)).not.toHaveAttribute('data-open-end');
    expect(fill(container)).not.toHaveAttribute('data-open-start');
  });

  it('flags both ends when both are open', () => {
    const { container } = render(<RangeBar value={[0, 50]} openStart openEnd />);
    expect(fill(container)).toHaveAttribute('data-open-start');
    expect(fill(container)).toHaveAttribute('data-open-end');
  });

  it('opens an edge from an infinite bound, with no second flag to keep in step', () => {
    const { container } = render(<RangeBar value={[500, Infinity]} max={1000} />);
    expect(fill(container)).toHaveAttribute('data-open-end');
    expect(fill(container)).not.toHaveAttribute('data-open-start');
    expect(vars(container)).toEqual({ start: '50', end: '100' });
  });

  it('lets an explicit flag override an infinite bound', () => {
    // A consumer that has already clamped its own bound still needs to say so.
    const { container } = render(<RangeBar value={[500, Infinity]} max={1000} openEnd={false} />);
    expect(fill(container)).not.toHaveAttribute('data-open-end');
  });

  it('renders no text of its own', () => {
    // Principle VI: the words for an interval are the app's. If the atom ever
    // composes "0 – 50", this is what should fail.
    const { container } = render(<RangeBar value={[0, 50]} openEnd />);
    expect(container.textContent).toBe('');
  });
});

describe('RangeBar accessible name', () => {
  it('takes role="img" when the consumer names it', () => {
    // A name on a role-less <div> is prohibited by ARIA and dropped by most
    // screen readers, so a named bar has to claim a role to be announced.
    render(<RangeBar value={[0, 50]} aria-label="0 to 50" />);
    expect(screen.getByRole('img', { name: '0 to 50' })).toBeInTheDocument();
  });

  it('takes the role for aria-labelledby too', () => {
    const { container } = render(
      <>
        <span id="rb-label">Covers 0 to 50</span>
        <RangeBar value={[0, 50]} aria-labelledby="rb-label" />
      </>,
    );
    expect(root(container)).toHaveAttribute('role', 'img');
  });

  it.each([
    ['an empty aria-label', { 'aria-label': '' }],
    ['a blank aria-label', { 'aria-label': '   ' }],
    ['an empty aria-labelledby', { 'aria-labelledby': '' }],
  ])('does not claim the role for %s', (_label, props) => {
    // `aria-label={label ?? ''}` is an everyday shape. Claiming role="img" here
    // produces exactly the nameless image the rule exists to avoid, and axe
    // reports it as role-img-alt.
    const { container } = render(<RangeBar value={[0, 50]} {...props} />);
    expect(root(container)).not.toHaveAttribute('role');
  });

  it('stays decorative when it has no name', () => {
    // A nameless `role="img"` is worse than no role: it announces an image and
    // then has nothing to say about it.
    const { container } = render(<RangeBar value={[0, 50]} />);
    expect(root(container)).not.toHaveAttribute('role');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('never overrides a role the consumer chose', () => {
    const { container } = render(
      <RangeBar value={[0, 50]} role="presentation" aria-label="ignored" />,
    );
    expect(root(container)).toHaveAttribute('role', 'presentation');
  });
});

describe('RangeBar fill tokens', () => {
  const scss = readFileSync('src/ui/range-bar/range-bar.scss', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  it('fills accent with the BOLD token', () => {
    // The fill is the content, so SC 1.4.11's 3:1 applies to it against its own
    // track. Measured on the light theme: `--color-accent` is 1.76:1 and
    // `--color-accent-bold` is 5.08:1. Swapping this back would look like a
    // harmless tidy-up and would quietly make the chart unreadable.
    expect(scss).toContain('--range-bar-tint: var(--color-accent-bold)');
    expect(scss, 'the plain accent token does not clear 3:1 on the track').not.toMatch(
      /--range-bar-tint:\s*var\(--color-accent\)/,
    );
  });

  it('caps the fill so a floored interval cannot leave the track', () => {
    // `min-width` raises the used width but the box still grows rightward from
    // `left`, so `[100, 100]` would sit entirely past the track and be eaten by
    // the root's `overflow: hidden` — showing nothing, in the one case the
    // floor exists for. jsdom has no layout, so the declaration is the only
    // thing a test can hold; the behaviour itself is a portal check.
    expect(scss).toMatch(/left:\s*min\(/);
    expect(scss).toContain('calc(100% - var(--uxm-range-bar-min-width, 4px))');
  });

  it('gives every type its own tint', () => {
    for (const type of ['accent', 'success', 'warning', 'danger', 'info', 'neutral']) {
      expect(scss, `no tint for type="${type}"`).toMatch(
        new RegExp(`&--${type}\\s*\\{\\s*--range-bar-tint:`),
      );
    }
  });
});
