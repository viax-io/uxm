import { useLayoutEffect, useRef, useState } from 'react';

import { cn } from '@/helpers';

import type { RefObject, SVGAttributes } from 'react';

export type LifecycleConnectorState = 'idle' | 'active' | 'dashed';

export type LifecycleConnectorRouting = 'auto' | 'straight' | 'bezier' | 'orthogonal';

interface ConnectorPoint {
  x: number;
  y: number;
}

// `from` and `to` on SVG elements are string-typed SMIL animation attrs we
// don't use. Dropping them lets us reuse the names for the actual node-anchor
// coordinates.
export interface LifecycleConnectorProps extends Omit<SVGAttributes<SVGGElement>, 'from' | 'to'> {
  /** Source point (in the parent SVG's coordinate system). */
  from: ConnectorPoint;
  /** Destination point. The arrowhead is placed here. */
  to: ConnectorPoint;
  /**
   * Visual state. `idle` = thin grey, `active` = bolder accent + midpoint dot,
   * `dashed` = dashed (often used for "after deploy" / future branches).
   */
  state?: LifecycleConnectorState;
  /**
   * Route shape.
   *
   * - `auto` (default) — straight when the anchors are vertically aligned,
   *   cubic Bezier otherwise. This is the historical behaviour and stays
   *   byte-identical, so existing lifecycle canvases are untouched.
   * - `straight` — a single line, whatever the anchors are.
   * - `bezier` — always the swooping cubic, even on aligned anchors.
   * - `orthogonal` — an elbow: three axis-aligned runs (stem → cross → drop).
   *   Lets a caller draw a bus-style tree without splitting one edge into
   *   several connectors.
   */
  routing?: LifecycleConnectorRouting;
  /**
   * Where the elbow's cross segment sits along the vertical span, `0` (level
   * with `from`) → `1` (level with `to`). Only read when the resolved routing
   * is `orthogonal`.
   *
   * A caller placing labels or group pills on the cross bus generally has its
   * own level in mind, so this is a knob rather than a hardcoded midpoint.
   *
   * Deliberately not clamped: a value outside 0–1 puts the bus beyond the
   * anchors, which is the escape hatch for routing an edge around something
   * rather than between the two nodes. The studio's slider stays within 0–1.
   */
  crossAt?: number;
  /**
   * Corner rounding in px for the elbow's two turns; pass `0` for square
   * corners. Clamped per corner to half the shorter of the two runs meeting
   * there, so a tight elbow rounds as far as it can instead of overshooting.
   *
   * Defaults to a slight `4` rather than `0`: a bare right angle reads as a
   * drawing artifact next to the rounded node cards, and every elbow in a
   * diagram wants the same treatment anyway.
   *
   * `stroke-linejoin` alone can't do this — it only rounds by half the stroke
   * width, which is invisible at the 1.5px default.
   */
  cornerRadius?: number;
  /** Render the dot at the source anchor. Set `false` on the non-first edge of a shared fan-out so one bus shows one dot. */
  startDot?: boolean;
  /**
   * Arrowhead size in px. Defaults to the `connectorArrowSize` registry
   * default (7) so the editor knob has the same starting point as the
   * production component.
   */
  arrowSize?: number;
  /**
   * SVG `stroke-dasharray` pattern used when `state === "dashed"`. Defaults
   * to the `connectorDashPattern` registry default ("6 4").
   */
  dashPattern?: string;
}

/**
 * One `MutationObserver` for the whole document, shared by every mounted
 * connector, refcounted so it disconnects when the last one unmounts.
 *
 * A lifecycle canvas mounts many connectors at once, and each needs to know
 * when the theme flips. Giving each its own observer would put N of them on the
 * same node to watch one attribute. The *reads* stay per-element on purpose
 * (see `useThemedArrowSize`) — those are cheap once the style recalc has
 * happened, and they are what keeps a narrower selector working.
 *
 * Module-level mutable state is deliberate and safe here: it is only ever
 * touched from a layout effect, so it never runs during SSR.
 */
const themeChangeSubscribers = new Set<() => void>();
let themeChangeObserver: MutationObserver | null = null;

function subscribeToThemeChange(onChange: () => void): () => void {
  themeChangeSubscribers.add(onChange);

  themeChangeObserver ??= (() => {
    const observer = new MutationObserver(() => {
      for (const notify of themeChangeSubscribers) notify();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return observer;
  })();

  return () => {
    themeChangeSubscribers.delete(onChange);
    if (themeChangeSubscribers.size === 0) {
      themeChangeObserver?.disconnect();
      themeChangeObserver = null;
    }
  };
}

/**
 * Read the themed arrow size back out of the cascade.
 *
 * Normally a themed value is *applied* by CSS and the component never looks —
 * that is how every other `--uxm-lifecycle-connector-*` var here works. Arrow
 * size can't be: it ends up as coordinates inside a `<polygon>`, which no CSS
 * property sets. Yet it is genuinely a theme decision (every arrowhead in an
 * app should agree) and the studio publishes it, so without reading it back the
 * published value is written to the stylesheet and silently ignored — which is
 * exactly what happened before this.
 *
 * Treat this as the narrow exception it is: if a value can be expressed as a
 * real CSS property, style it in the stylesheet and let the cascade do its job.
 * `crossAt` and `cornerRadius` deliberately have no var at all — where a bus
 * sits is per-edge layout, not theme.
 *
 * Re-reads when the document's `data-theme` flips so a themed size tracks a
 * theme switch the way a themed colour does, instead of freezing at its
 * mount-time value.
 *
 * The read is per-element, not shared: the var is published on the
 * `.uxm-lifecycle-connector` class, but a consumer can scope a narrower rule to
 * one branch of a diagram, and a cached document-wide value would silently
 * flatten that. The observer behind it *is* shared — see
 * `subscribeToThemeChange`.
 *
 * `useLayoutEffect`, not `useEffect`: the value feeds path geometry and the
 * arrowhead's pullback, so reading it after paint would show one frame at the
 * default before settling. This package is client-only, so there is no SSR
 * mismatch to weigh against that.
 */
function useThemedArrowSize(
  ref: RefObject<Element | null>,
  enabled: boolean,
): number | undefined {
  const [size, setSize] = useState<number>();

  useLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const read = () => {
      const raw = getComputedStyle(el)
        .getPropertyValue('--uxm-lifecycle-connector-arrow-size')
        .trim();
      const parsed = Number.parseFloat(raw);
      // `undefined` (not NaN) so the caller can fall through with `??`.
      setSize(Number.isFinite(parsed) ? parsed : undefined);
    };

    read();

    return subscribeToThemeChange(read);
  }, [ref, enabled]);

  return size;
}

/**
 * Drop points that repeat the previous one, so a degenerate run (a zero-length
 * stem when `crossAt` is 0, a zero-length drop when it is 1, a zero-length
 * cross when the anchors share an x) never becomes the segment the arrowhead
 * takes its angle from. Without this the elbow's head flips to an arbitrary
 * direction at the ends of the `crossAt` range.
 */
function dedupe(points: ConnectorPoint[]): ConnectorPoint[] {
  return points.filter((p, i) => i === 0 || p.x !== points[i - 1].x || p.y !== points[i - 1].y);
}

/**
 * Emit a polyline through `points`, rounding each interior corner with a
 * quadratic whose control point is the corner itself — for the right angles an
 * elbow makes, that reads as a clean fillet. `radius` is clamped per corner to
 * half of each adjoining run so two corners on a short middle segment can't
 * eat into one another.
 */
function polylineD(points: ConnectorPoint[], radius: number): string {
  if (points.length < 3 || radius <= 0) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }

  const round = (n: number) => Math.round(n * 100) / 100;
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const corner = points[i];
    const next = points[i + 1];
    const inLen = Math.hypot(corner.x - prev.x, corner.y - prev.y) || 1;
    const outLen = Math.hypot(next.x - corner.x, next.y - corner.y) || 1;
    const r = Math.min(radius, inLen / 2, outLen / 2);
    const entry = {
      x: round(corner.x - ((corner.x - prev.x) / inLen) * r),
      y: round(corner.y - ((corner.y - prev.y) / inLen) * r),
    };
    const exit = {
      x: round(corner.x + ((next.x - corner.x) / outLen) * r),
      y: round(corner.y + ((next.y - corner.y) / outLen) * r),
    };
    d += ` L ${entry.x} ${entry.y} Q ${corner.x} ${corner.y} ${exit.x} ${exit.y}`;
  }

  const last = points[points.length - 1];
  return `${d} L ${last.x} ${last.y}`;
}

/**
 * One edge between two lifecycle nodes. Returns an SVG `<g>` fragment so
 * callers can place many connectors inside one parent `<svg>` (typical for a
 * full lifecycle canvas). Routing is picked by the `routing` prop — see its
 * docs; the default `auto` keeps the original straight/Bezier split.
 *
 * Stroke colors / widths come from CSS custom properties on the
 * `.uxm-lifecycle-connector` class — consumers can re-theme by setting them
 * on a parent.
 */
export function LifecycleConnector({
  from,
  to,
  state = 'idle',
  routing = 'auto',
  crossAt = 0.5,
  cornerRadius = 4,
  startDot = true,
  arrowSize: arrowSizeProp,
  dashPattern = '6 4',
  className,
  ...rest
}: LifecycleConnectorProps) {
  const rootRef = useRef<SVGGElement>(null);
  // Skip the DOM read when the caller pinned the value — a canvas that passes
  // `arrowSize` (the studio preview does) never touches `getComputedStyle`.
  const themedArrowSize = useThemedArrowSize(rootRef, arrowSizeProp === undefined);

  // An explicit prop always wins over a published theme; the literal is the
  // last resort, and matches the registry default.
  const arrowSize = arrowSizeProp ?? themedArrowSize ?? 7;

  const isStraight = from.x === to.x;
  const mode = routing === 'auto' ? (isStraight ? 'straight' : 'bezier') : routing;

  // Stop the path/line a bit short of the destination so the arrowhead sits
  // cleanly on the node edge instead of disappearing behind the polygon.
  const pullback = arrowSize;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const tipX = to.x;
  const tipY = to.y;
  const lineEndX = to.x - (dx / len) * pullback;
  const lineEndY = to.y - (dy / len) * pullback;

  let pathD: string;
  // Arrow direction — the unit vector of the path's LAST run. On straight and
  // Bezier routes that is the whole-edge vector (the historical approximation,
  // close enough for these gentle curves); on an elbow it must come from the
  // final axis-aligned run, or a vertical drop would get a diagonal head.
  let ux: number;
  let uy: number;

  if (mode === 'orthogonal') {
    const crossY = from.y + (to.y - from.y) * crossAt;
    const corners = dedupe([
      { x: from.x, y: from.y },
      { x: from.x, y: crossY },
      { x: to.x, y: crossY },
      { x: to.x, y: to.y },
    ]);

    // A fully degenerate route (from === to) leaves a single point; fall back
    // to the whole-edge vector so the arrowhead still has a direction.
    const last = corners[corners.length - 1];
    const prev = corners[corners.length - 2] ?? { x: from.x - dx, y: from.y - dy };
    const segDx = last.x - prev.x;
    const segDy = last.y - prev.y;
    const segLen = Math.hypot(segDx, segDy) || 1;
    ux = segDx / segLen;
    uy = segDy / segLen;

    // Clamp the pullback to the final run: a cross level close to `to` leaves a
    // drop shorter than the arrowhead, and an unclamped pullback would reverse
    // that segment and kink the elbow.
    const segPullback = Math.min(pullback, segLen);
    const end = { x: last.x - ux * segPullback, y: last.y - uy * segPullback };
    // Dedupe AGAIN after the pullback: a cross level within `arrowSize` of the
    // destination collapses the final run onto the corner, which would leave a
    // zero-length command (and, with rounding on, a corner with nothing to
    // turn into).
    const routed = dedupe([...corners.slice(0, -1), end]);
    pathD = polylineD(routed, cornerRadius);
  } else {
    ux = dx / len;
    uy = dy / len;
    if (mode === 'straight') {
      pathD = `M ${from.x} ${from.y} L ${lineEndX} ${lineEndY}`;
    } else {
      // Cubic with control points pulled vertically — produces a smooth S/curve
      // that reads as "branch from parent down to sibling column".
      const midY = (from.y + to.y) / 2;
      pathD = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${lineEndX} ${lineEndY}`;
    }
  }

  // Arrowhead points: a triangle whose tip is at (tipX, tipY) pointing along
  // the last run's direction.
  const ax = tipX;
  const ay = tipY;
  const px = -uy;
  const py = ux;
  const arrow = [
    `${ax},${ay}`,
    `${ax - ux * arrowSize + px * arrowSize * 0.55},${ay - uy * arrowSize + py * arrowSize * 0.55}`,
    `${ax - ux * arrowSize - px * arrowSize * 0.55},${ay - uy * arrowSize - py * arrowSize * 0.55}`,
  ].join(' ');

  return (
    <g
      {...rest}
      // After the spread on purpose: the geometry read needs this ref, and the
      // props interface doesn't expose one for a caller to supply.
      ref={rootRef}
      className={cn(
        'uxm-lifecycle-connector',
        `uxm-lifecycle-connector--${state}`,
        className,
      )}
    >
      {startDot && (
        <circle className="uxm-lifecycle-connector__start" cx={from.x} cy={from.y} r={3} />
      )}
      {/* Only an elbow has joins to round. Gated rather than always-on so the
          single-segment routes emit the exact attribute set they always did —
          `undefined` makes React omit it — and `auto` stays byte-identical
          down to the rendered DOM, not just the path data. */}
      <path
        className="uxm-lifecycle-connector__path"
        d={pathD}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin={mode === 'orthogonal' ? 'round' : undefined}
        strokeDasharray={state === 'dashed' ? dashPattern : undefined}
      />
      <polygon className="uxm-lifecycle-connector__arrow" points={arrow} />
    </g>
  );
}
