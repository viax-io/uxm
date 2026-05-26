import type { SVGAttributes } from "react";
import { cn } from "./cn";

export type LifecycleConnectorState = "idle" | "active" | "dashed";

// `from` and `to` on SVG elements are string-typed SMIL animation attrs we
// don't use. Dropping them lets us reuse the names for the actual node-anchor
// coordinates.
export interface LifecycleConnectorProps extends Omit<SVGAttributes<SVGGElement>, "from" | "to"> {
  /** Source point (in the parent SVG's coordinate system). */
  from: { x: number; y: number };
  /** Destination point. The arrowhead is placed here. */
  to: { x: number; y: number };
  /**
   * Visual state. `idle` = thin grey, `active` = bolder accent + midpoint dot,
   * `dashed` = dashed (often used for "after deploy" / future branches).
   */
  state?: LifecycleConnectorState;
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
 * One edge between two lifecycle nodes. Returns an SVG `<g>` fragment so
 * callers can place many connectors inside one parent `<svg>` (typical for a
 * full lifecycle canvas). Routing:
 *
 *   - vertically aligned (same `from.x` and `to.x`) → straight line
 *   - otherwise → cubic Bezier with control points pulled vertically toward
 *     the midpoint, giving the smooth swooping shape used by v1's lifecycle
 *     modeler for branches.
 *
 * Stroke colors / widths / arrow size come from CSS custom properties on the
 * `.uxm-lifecycle-connector` class — consumers can re-theme by setting them
 * on a parent.
 */
export function LifecycleConnector({
  from,
  to,
  state = "idle",
  arrowSize = 7,
  dashPattern = "6 4",
  className,
  ...rest
}: LifecycleConnectorProps) {
  const isStraight = from.x === to.x;

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
  if (isStraight) {
    pathD = `M ${from.x} ${from.y} L ${lineEndX} ${lineEndY}`;
  } else {
    // Cubic with control points pulled vertically — produces a smooth S/curve
    // that reads as "branch from parent down to sibling column".
    const midY = (from.y + to.y) / 2;
    pathD = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${lineEndX} ${lineEndY}`;
  }

  // Arrowhead points: a triangle whose tip is at (tipX, tipY) pointing in the
  // direction of the path's last segment. For curved paths we approximate by
  // pointing toward `to` from the second-to-last control point — close enough
  // for our gentle curves.
  const ax = tipX;
  const ay = tipY;
  const norm = Math.hypot(dx, dy) || 1;
  const ux = dx / norm;
  const uy = dy / norm;
  const px = -uy;
  const py = ux;
  const arrow = [
    `${ax},${ay}`,
    `${ax - ux * arrowSize + px * arrowSize * 0.55},${ay - uy * arrowSize + py * arrowSize * 0.55}`,
    `${ax - ux * arrowSize - px * arrowSize * 0.55},${ay - uy * arrowSize - py * arrowSize * 0.55}`,
  ].join(" ");

  return (
    <g
      {...rest}
      className={cn(
        "uxm-lifecycle-connector",
        `uxm-lifecycle-connector--${state}`,
        className,
      )}
    >
      <circle className="uxm-lifecycle-connector__start" cx={from.x} cy={from.y} r={3} />
      <path
        className="uxm-lifecycle-connector__path"
        d={pathD}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={state === "dashed" ? dashPattern : undefined}
      />
      <polygon className="uxm-lifecycle-connector__arrow" points={arrow} />
    </g>
  );
}
