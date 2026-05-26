import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface IconTileProps extends HTMLAttributes<HTMLSpanElement> {
  /** The icon to render — typically `<Icon glyph="..." size={14} />`. */
  children: ReactNode;
  /** Tile size in px. Defaults to 28 (the small "row icon" size used in cards/lists). */
  size?: number;
  /** Background color for the tile. Falls back to `--color-surface-alt`. */
  iconBg?: string;
  /** Foreground color for the tile (passed to the icon via `color`). Falls back to `--color-text-muted`. */
  iconColor?: string;
}

/**
 * A small rounded tile that wraps an icon with a colored background — the
 * accent square seen in front of every row card / list item / type chip
 * across modo. Built as its own component because the same 6 lines of JSX
 * (rounded square + flex centering + colored bg + icon) appeared in 5
 * templates with copy-paste subtle drift.
 *
 * The tile and the inner icon are independent: callers pass the icon they
 * want as children, so the consumer controls icon glyph + size.
 */
export function IconTile({
  children,
  size = 28,
  iconBg,
  iconColor,
  className,
  style,
  ...rest
}: IconTileProps) {
  // Project the per-instance overrides into CSS custom properties the
  // class rule reads. Default tokens live in `.uxm-icon-tile` in styles.css.
  const cssVars: CSSProperties = {
    "--uxm-icon-tile-size": `${size}px`,
    ...(iconBg ? { "--uxm-icon-tile-bg": iconBg } : {}),
    ...(iconColor ? { "--uxm-icon-tile-color": iconColor } : {}),
    ...style,
  } as CSSProperties;
  return (
    <span {...rest} className={cn("uxm-icon-tile", className)} style={cssVars}>
      {children}
    </span>
  );
}
