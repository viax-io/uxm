import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/helpers";
import { Icon } from "@/ui/icon";
import { IconTile } from "@/ui/icon-tile";

export interface TypeOverviewCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Required label, e.g. "Revenue Motions". */
  label: ReactNode;
  /** Required value, typically a count. */
  value: ReactNode;
  /** Icon node — `<Icon glyph="..." />` is the typical fit. */
  icon?: ReactNode;
  /** Override the icon tile background color. */
  iconBg?: string;
  /** Override the icon foreground color. */
  iconColor?: string;
  /** Override the accent stripe color. */
  accent?: string;
  /** Trailing affordance shown on hover. Defaults to "View all" + arrow when omitted. */
  trailing?: ReactNode;
}

// IconTile's CSS variables are bridged to TypeOverviewCard's own
// (`--uxm-typeoverview-icon-*`) so the editor's per-instance icon knobs and
// the `iconBg` / `iconColor` props on this component continue to work unchanged.
const ICON_TILE_STYLE: CSSProperties = {
  ["--uxm-icon-tile-bg" as string]: "var(--uxm-typeoverview-icon-bg, var(--color-accent-subtle))",
  ["--uxm-icon-tile-color" as string]: "var(--uxm-typeoverview-icon-color, var(--color-accent-bold))",
  ["--uxm-icon-tile-size" as string]: "var(--uxm-typeoverview-icon-tile-size, 32px)",
  ["--uxm-icon-tile-radius" as string]: "var(--uxm-typeoverview-icon-tile-radius, 8px)",
};

export function TypeOverviewCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  accent,
  trailing,
  className,
  style,
  ...rest
}: TypeOverviewCardProps) {
  const cssVars: CSSProperties = {
    ...style,
    ...(iconBg && { ["--uxm-typeoverview-icon-bg" as string]: iconBg }),
    ...(iconColor && { ["--uxm-typeoverview-icon-color" as string]: iconColor }),
    ...(accent && { ["--uxm-typeoverview-accent-color" as string]: accent }),
  };
  return (
    <div className={cn("uxm-type-overview-card", className)} style={cssVars} {...rest}>
      <span aria-hidden="true" className="uxm-type-overview-card__accent" />
      {icon && <IconTile style={ICON_TILE_STYLE}>{icon}</IconTile>}
      <p className="uxm-type-overview-card__label">{label}</p>
      <p className="uxm-type-overview-card__value">{value}</p>
      {trailing !== null && (
        <span className="uxm-type-overview-card__trailing">
          {trailing ?? (
            <>
              View all
              <Icon glyph="arrow-right" size={12} strokeWidth={2} aria-hidden="true" />
            </>
          )}
        </span>
      )}
    </div>
  );
}
