import { readFileSync } from 'node:fs';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LifecycleNodeCard } from '@/ui';

import type { ReactNode } from 'react';

const meta = (c: HTMLElement) => c.querySelector('.uxm-lifecycle-node-card__meta');
const titleP = (c: HTMLElement) => c.querySelector('p.uxm-lifecycle-node-card__title');

describe('LifecycleNodeCard meta slot', () => {
  it('renders no meta region when the prop is absent', () => {
    // The additive promise: a card that does not use the slot must emit the DOM
    // it emitted before the slot existed, or a consumer's structural override
    // (`.uxm-lifecycle-node-card__body > p:last-child`, a nth-child rule) breaks
    // on upgrade.
    const { container } = render(<LifecycleNodeCard kind="state" title="In Cart" />);
    expect(meta(container)).toBeNull();
  });

  // Every value React itself renders as nothing. `false` is the one that bit:
  // `meta={cond && <X/>}` is how a conditional slot is written, it evaluates to
  // `false`, and a `!= null` gate let it through — painting an empty region that
  // still carried its own margin.
  it.each([
    ['null', null],
    ['undefined', undefined],
    ['false — the `cond && <X/>` conditional', false],
    ['true', true],
    ['an empty string', ''],
  ])('treats %s as absent', (_label, value) => {
    const { container } = render(
      <LifecycleNodeCard kind="state" title="In Cart" meta={value as ReactNode} />,
    );
    expect(meta(container)).toBeNull();
  });

  it('keeps rendering a zero, which is a real value and not "nothing"', () => {
    // The trap on the other side of the same gate: excluding everything falsy
    // would silently drop a count of 0 — exactly what a numeric slot exists for.
    const { container } = render(<LifecycleNodeCard kind="state" title="In Cart" meta={0} />);
    expect(meta(container)).toHaveTextContent('0');
  });

  it('applies the same gate to badge, which had the identical flaw', () => {
    const { container } = render(
      <LifecycleNodeCard kind="state" title="In Cart" badge={false as unknown as ReactNode} />,
    );
    expect(container.querySelector('.uxm-lifecycle-node-card__badge')).toBeNull();
    const zero = render(<LifecycleNodeCard kind="state" title="In Cart" badge={0} />);
    expect(
      zero.container.querySelector('.uxm-lifecycle-node-card__badge'),
      'badge={0} is an action count, not an absent badge',
    ).toHaveTextContent('0');
  });

  it('renders meta content OUTSIDE the title paragraph', () => {
    // The whole point of the slot. Asserting only "the content is in the
    // document" would pass against the overload it replaces — where consumers
    // put the same node INSIDE `title` — so the containment check is the test.
    const { container } = render(
      <LifecycleNodeCard
        kind="interaction"
        title="SalesOrder"
        meta={<span data-testid="participants">Buyer +2</span>}
      />,
    );
    const node = screen.getByTestId('participants');
    expect(meta(container), 'meta region missing').toContainElement(node);
    expect(
      titleP(container)?.contains(node),
      'meta content is inside the title paragraph — the overload this slot exists to replace',
    ).toBe(false);
    expect(titleP(container)).toHaveTextContent('SalesOrder');
  });

  it('keeps the meta region inside the card body, after the title', () => {
    // Indented with the title rather than spanning under the icon tile — the
    // reason it is a body child and not a card child.
    const { container } = render(
      <LifecycleNodeCard kind="task" title="Validate" meta="2 owners" />,
    );
    const body = container.querySelector('.uxm-lifecycle-node-card__body');
    expect(body).toContainElement(meta(container) as HTMLElement);
    expect(titleP(container)?.nextElementSibling).toBe(meta(container));
  });
});

describe('LifecycleNodeCard meta styles', () => {
  // The `__meta` rule, comments stripped, so a `/* no overflow here */` comment
  // cannot satisfy the assertion below by accident.
  const block = (() => {
    const scss = readFileSync('src/ui/lifecycle-node-card/lifecycle-node-card.scss', 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    const at = scss.indexOf('&__meta');
    expect(at, '`&__meta` rule not found').toBeGreaterThan(-1);
    return scss.slice(at, scss.indexOf('}', at));
  })();

  it('never clips its content', () => {
    // A consumer's avatar stack draws ring box-shadows and this region is where
    // that content moved TO — clipping here reinstates the exact bug the slot
    // removes, and nothing in jsdom or the type system would catch it.
    // Scoped to the clipping values: a bare /overflow\s*:/ would also reject
    // `overflow-wrap`, which this rule may legitimately want.
    expect(block, 'the meta region must not clip').not.toMatch(
      /overflow(-[xy])?\s*:\s*(hidden|clip|auto|scroll)/,
    );
  });

  it('wraps, so content that cannot shrink grows the card instead of leaving it', () => {
    // The other half of "not clipped". Without this, a non-shrinking avatar
    // stack escapes the card through the visible overflow and runs under the
    // trailing badge — measured at 164px past the border on the 280px card.
    // jsdom has no layout, so the declaration is the only thing a test can pin;
    // the behaviour itself is verified in the portal.
    expect(block, 'the meta row must wrap').toMatch(/flex-wrap:\s*wrap/);
  });

  it('forwards its size knob into a nested MetaRow', () => {
    // MetaRow declares its own font size, so without this the card's knob — and
    // the studio slider bound to it — silently does nothing to the composition
    // the README recommends.
    expect(block).toContain(
      '--uxm-meta-row-font-size: var(--uxm-lifecycle-node-card-meta-size, 12px)',
    );
  });

  it('reads both knobs with the documented defaults', () => {
    // The README promises 12px / 4px; a drifting fallback is invisible in the
    // studio, which projects the registry defaults as inline vars.
    expect(block).toContain('var(--uxm-lifecycle-node-card-meta-size, 12px)');
    expect(block).toContain('var(--uxm-lifecycle-node-card-meta-gap, 4px)');
  });

  it('scales its font size with --type-scale, as the sweep gate requires', () => {
    expect(block).toMatch(/font-size:\s*calc\([^;]*var\(--type-scale, 1\)\)/);
  });
});
