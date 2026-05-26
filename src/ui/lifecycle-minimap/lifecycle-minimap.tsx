import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export interface LifecycleMinimapNode {
  /** Position in 0–1 space (relative to the minimap frame). */
  x: number;
  y: number;
  /** Size in 0–1 space. */
  w: number;
  h: number;
}

export interface LifecycleMinimapViewport {
  /** Top-left in 0–1 space. */
  x: number;
  y: number;
  /** Width / height in 0–1 space. */
  w: number;
  h: number;
}

export interface LifecycleMinimapProps extends HTMLAttributes<HTMLDivElement> {
  /** Total width in pixels. */
  width?: number;
  /** Total height in pixels. */
  height?: number;
  /** Nodes to render as small filled rectangles. */
  nodes: LifecycleMinimapNode[];
  /** Pairs of node indices `[a, b]` to draw a line between. */
  edges: [number, number][];
  /** Optional viewport-frame overlay showing where the user is currently scrolled. */
  viewport?: LifecycleMinimapViewport;
}

/**
 * Birds-eye overview of a lifecycle canvas. Coordinates are normalised (0–1)
 * so the same data works at any minimap size — the consumer picks dimensions
 * and the component scales. Visuals (node fill, edge stroke, viewport frame)
 * are themed via CSS custom properties on `.uxm-lifecycle-minimap`.
 */
export function LifecycleMinimap({
  // Defaults match the `lifecycle-minimap` registry entry (240×104) so the
  // editor preview and consumers that don't override start from the same
  // baseline.
  width = 240,
  height = 104,
  nodes,
  edges,
  viewport,
  className,
  style,
  ...rest
}: LifecycleMinimapProps) {
  const center = (i: number) => ({ cx: nodes[i].x * width, cy: nodes[i].y * height });

  return (
    <div
      {...rest}
      className={cn("uxm-lifecycle-minimap", className)}
      style={{ width, height, ...style }}
    >
      <svg width={width} height={height} className="uxm-lifecycle-minimap__svg">
        {edges.map(([a, b], i) => {
          const A = center(a);
          const B = center(b);
          return (
            <line
              key={i}
              x1={A.cx}
              y1={A.cy}
              x2={B.cx}
              y2={B.cy}
              className="uxm-lifecycle-minimap__edge"
            />
          );
        })}
        {nodes.map((n, i) => (
          <rect
            key={i}
            x={(n.x - n.w / 2) * width}
            y={(n.y - n.h / 2) * height}
            width={n.w * width}
            height={n.h * height}
            rx={2}
            className="uxm-lifecycle-minimap__node"
          />
        ))}
      </svg>
      {viewport && (
        <div
          className="uxm-lifecycle-minimap__viewport"
          style={{
            left: viewport.x * width,
            top: viewport.y * height,
            width: viewport.w * width,
            height: viewport.h * height,
          }}
        />
      )}
    </div>
  );
}
