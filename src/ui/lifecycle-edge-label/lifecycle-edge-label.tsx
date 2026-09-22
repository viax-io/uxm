import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export type LifecycleEdgeLabelVariant = 'true' | 'false' | 'neutral' | 'accent';

export interface LifecycleEdgeLabelProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Color variant. `true` (green) / `false` (warm) name the two branches of a
   * condition; `neutral` (border-only) is the quietest thing on the canvas, for
   * an ordinary transition label. `accent` is the odd one out: it carries no
   * branch semantics, it carries HIERARCHY — the entry pill of a diagram, or
   * the one naming the model itself — and is the only variant that reads as
   * primary against a sunken canvas.
   */
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
  variant = 'neutral',
  className,
  children,
  ...rest
}: LifecycleEdgeLabelProps) {
  return (
    <span
      {...rest}
      className={cn(
        'uxm-lifecycle-edge-label',
        `uxm-lifecycle-edge-label--${variant}`,
        className,
      )}
    >
      {children}
    </span>
  );
}
