import type { HTMLAttributes, ReactNode, CSSProperties } from "react";
import { cn } from "@/helpers";

export interface ClusterProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap between items. Defaults to 12px. */
  gap?: string | number;
  /**
   * Vertical alignment of items relative to each other. Most useful when
   * children have mixed heights (e.g., a label + a button). Defaults to
   * "center".
   */
  align?: "start" | "center" | "end" | "baseline";
  /**
   * Horizontal distribution. "start" keeps items packed left; "between"
   * pushes the first/last to the edges (toolbar pattern). Defaults to
   * "start".
   */
  justify?: "start" | "center" | "end" | "between";
  /**
   * Allow items to wrap onto a second row when they don't fit. The whole
   * point of Cluster is that it's wrap-friendly, so default true; pass
   * false only for explicit single-row toolbars.
   */
  wrap?: boolean;
  children?: ReactNode;
}

/**
 * Horizontal row of items with a consistent gap, wrapping by default when
 * there's not enough room. The classic "tag list" / "filter chips" /
 * "button row" container — replaces hand-rolled `flex flex-wrap items-center
 * gap-N` div soup across the codebase.
 */
export function Cluster({
  gap,
  align = "center",
  justify = "start",
  wrap = true,
  className,
  style,
  ...rest
}: ClusterProps) {
  const mergedStyle: CSSProperties = {
    ...(gap !== undefined
      ? { ["--uxm-cluster-gap" as string]: typeof gap === "number" ? `${gap}px` : gap }
      : null),
    ...style,
  };
  return (
    <div
      className={cn(
        "uxm-cluster",
        `uxm-cluster--align-${align}`,
        `uxm-cluster--justify-${justify}`,
        wrap && "uxm-cluster--wrap",
        className,
      )}
      style={mergedStyle}
      {...rest}
    />
  );
}
