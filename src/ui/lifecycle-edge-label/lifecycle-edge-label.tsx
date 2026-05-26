import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/helpers";

export type LifecycleEdgeLabelVariant = "true" | "false" | "neutral";

export interface LifecycleEdgeLabelProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color variant — `true` (green) / `false` (warm) / `neutral` (border-only). */
  variant?: LifecycleEdgeLabelVariant;
  /** Label content. */
  children: ReactNode;
}

/**
 * Floating pill rendered on the midpoint of a lifecycle connector. Color
 * variant communicates the semantic, not the literal text — a connector
 * labelled "approved" can still be `variant="true"` to render in green.
 *
 * Positioning is the consumer's responsibility (typical pattern: wrap in an
 * absolutely-positioned div pinned to the edge midpoint).
 */
export function LifecycleEdgeLabel({
  variant = "neutral",
  className,
  children,
  ...rest
}: LifecycleEdgeLabelProps) {
  return (
    <span
      {...rest}
      className={cn(
        "uxm-lifecycle-edge-label",
        `uxm-lifecycle-edge-label--${variant}`,
        className,
      )}
    >
      {children}
    </span>
  );
}
