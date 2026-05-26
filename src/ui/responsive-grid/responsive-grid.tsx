import type { HTMLAttributes, ReactNode, CSSProperties } from "react";
import { cn } from "@/helpers";

export interface ResponsiveGridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Minimum column width before the grid wraps a child onto the next row.
   * Drives `grid-template-columns: repeat(auto-fit, minmax(min, 1fr))` —
   * the browser figures out how many columns fit, no media queries required.
   * Accepts any CSS length: "200px", "20rem", "20ch", etc. Defaults to 200px.
   */
  min?: string;
  /** Gap between cells. Defaults to 16px. */
  gap?: string | number;
  children?: ReactNode;
}

/**
 * The responsive workhorse — drop N children inside, the browser lays them
 * out as many-columns when there's room and single-column when there isn't,
 * with no breakpoint scaffolding. The same instance behaves correctly inside
 * a wide dashboard pane and inside a narrow side flexpane.
 *
 * Theming knobs live on `--uxm-responsive-grid-{min,gap}` so the editor can
 * tune the wrap point and gap globally. The component's own props win when
 * present (the editor overrides serve as defaults).
 */
export function ResponsiveGrid({
  min,
  gap,
  className,
  style,
  ...rest
}: ResponsiveGridProps) {
  const mergedStyle: CSSProperties = {
    ...(min !== undefined ? { ["--uxm-responsive-grid-min" as string]: min } : null),
    ...(gap !== undefined
      ? { ["--uxm-responsive-grid-gap" as string]: typeof gap === "number" ? `${gap}px` : gap }
      : null),
    ...style,
  };
  return (
    <div className={cn("uxm-responsive-grid", className)} style={mergedStyle} {...rest} />
  );
}
