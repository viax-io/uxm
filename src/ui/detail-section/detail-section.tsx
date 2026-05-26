import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";
import { IconTile } from "./icon-tile";

export interface DetailSectionProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}

// Project DetailSection's icon-tile theming surface onto IconTile.
// `--uxm-detail-section-icon-{bg,color}` flow through the section's CSS
// (set by editor saves or consumer inline style) into IconTile's own vars.
const ICON_TILE_STYLE: CSSProperties = {
  ["--uxm-icon-tile-bg" as string]: "var(--uxm-detail-section-icon-bg, var(--color-surface-alt))",
  ["--uxm-icon-tile-color" as string]: "var(--uxm-detail-section-icon-color, var(--color-text-muted))",
  ["--uxm-icon-tile-size" as string]: "32px",
  ["--uxm-icon-tile-radius" as string]: "6px",
};

export function DetailSection({
  icon,
  title,
  subtitle,
  children,
  className,
  ...rest
}: DetailSectionProps) {
  return (
    <section className={cn("uxm-detail-section", className)} {...rest}>
      <span className="uxm-detail-section__accent" aria-hidden="true" />
      <div className="uxm-detail-section__inner">
        <header className="uxm-detail-section__header">
          {icon && <IconTile style={ICON_TILE_STYLE}>{icon}</IconTile>}
          <div className="uxm-detail-section__heading">
            <h3 className="uxm-detail-section__title">{title}</h3>
            {subtitle && <p className="uxm-detail-section__subtitle">{subtitle}</p>}
          </div>
        </header>
        {children && <div className="uxm-detail-section__body">{children}</div>}
      </div>
    </section>
  );
}
