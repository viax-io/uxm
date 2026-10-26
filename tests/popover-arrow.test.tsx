import { render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Popover } from '@/ui';

/**
 * The anchor-offset contract.
 *
 * A panel's arrow has to point at the thing the panel describes, and the only
 * honest source for that is the panel's FINAL position — `Popover` flips
 * start/end and clamps to the viewport, and both of those move the panel
 * independently of the anchor. So the offset is published as a measurement
 * (`--_uxm-popover-arrow-offset`, px from the panel's own left edge) rather
 * than inferred by the arrow's stylesheet, which can only ever guess 50%.
 *
 * What that guess cost: `HoverTooltip` aligns `top-start`, so the arrow at 50%
 * of the panel missed the anchor's centre by (panelWidth - anchorWidth) / 2 —
 * 199px on a 182px table cell, which put it clear of the trigger entirely.
 */
type Rect = { left: number; width: number; top?: number; height?: number };

const ANCHOR_ATTR = 'data-arrow-anchor';

function stubGeometry({
  anchor,
  panel,
  viewportW,
}: {
  anchor: Rect;
  panel: Rect;
  viewportW: number;
}) {
  const origRect = HTMLElement.prototype.getBoundingClientRect;
  const origW = Object.getOwnPropertyDescriptor(window, 'innerWidth');

  const toRect = (r: Rect) => {
    const top = r.top ?? 0;
    const height = r.height ?? 20;
    return {
      left: r.left,
      right: r.left + r.width,
      width: r.width,
      top,
      bottom: top + height,
      height,
      x: r.left,
      y: top,
      toJSON: () => ({}),
    } as DOMRect;
  };

  HTMLElement.prototype.getBoundingClientRect = function getRect(this: HTMLElement) {
    if (this.classList.contains('uxm-popover')) return toRect(panel);
    if (this.hasAttribute(ANCHOR_ATTR)) return toRect(anchor);
    return toRect({ left: 0, width: 0 });
  };
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: viewportW });

  return () => {
    HTMLElement.prototype.getBoundingClientRect = origRect;
    if (origW) Object.defineProperty(window, 'innerWidth', origW);
  };
}

function Host({ placement }: { placement?: 'top-start' | 'top-end' }) {
  const anchor = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button type="button" ref={anchor} {...{ [ANCHOR_ATTR]: 'true' }}>
        Anchor
      </button>
      <Popover
        open
        onOpenChange={vi.fn()}
        anchor={anchor}
        placement={placement}
        aria-label="Panel"
      >
        content
      </Popover>
    </>
  );
}

const arrowOffsetOf = () =>
  screen.getByRole('dialog', { name: 'Panel' }).style.getPropertyValue('--_uxm-popover-arrow-offset');

let restore: (() => void) | undefined;
afterEach(() => {
  restore?.();
  restore = undefined;
});

describe('Popover arrow offset', () => {
  it('points at the anchor centre, not the panel centre', () => {
    // The real case: a 200px trigger with a 600px tooltip. Start-aligned, so
    // panel.left === anchor.left and the anchor's centre is 100px in. A 50%
    // arrow would sit at 300px — 200px wide of the trigger.
    restore = stubGeometry({
      anchor: { left: 100, width: 200 },
      panel: { left: 100, width: 600 },
      viewportW: 1400,
    });
    render(<Host />);
    expect(arrowOffsetOf()).toBe('100px');
  });

  it('tracks the anchor through the viewport clamp', () => {
    // Near the right edge the panel is re-anchored to its right (popover.tsx:
    // `left = triggerRect.right - panelRect.width`), which decouples it from
    // the anchor's left edge entirely. Measuring against the FINAL left is the
    // only reason the arrow survives this: anchor centre 730, panel left 360.
    restore = stubGeometry({
      anchor: { left: 700, width: 60 },
      panel: { left: 0, width: 400 },
      viewportW: 800,
    });
    render(<Host />);
    expect(arrowOffsetOf()).toBe('370px');
  });

  it('follows an end-aligned panel too', () => {
    // `top-end` puts panel.right at anchor.right: left = 760 - 400 = 360,
    // so the anchor centre lands 370px in — same as the clamped case, which
    // is the point: one measurement covers every alignment.
    restore = stubGeometry({
      anchor: { left: 700, width: 60 },
      panel: { left: 0, width: 400 },
      viewportW: 1400,
    });
    render(<Host placement="top-end" />);
    expect(arrowOffsetOf()).toBe('370px');
  });

  it('can report an offset outside the panel, which CSS clamps', () => {
    // A tiny panel beside a huge anchor: the anchor's centre is genuinely off
    // the panel. The measurement stays honest rather than being silently
    // snapped here — `tooltip.scss` clamps it to the body's radius plus half
    // the arrow's diagonal, so the arrow parks at the corner instead of
    // sliding off it. Asserting the raw value pins WHERE the clamp lives.
    //
    // 496, not 500: the anchor starts at 0, so the `left < 4` guard nudges the
    // panel onto the 4px viewport margin and the offset is measured from there.
    restore = stubGeometry({
      anchor: { left: 0, width: 1000 },
      panel: { left: 0, width: 80 },
      viewportW: 1400,
    });
    render(<Host />);
    expect(arrowOffsetOf()).toBe('496px');
  });
});
