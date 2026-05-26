import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/helpers";

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Heading text — rendered uppercase by default. */
  children: ReactNode;
  /**
   * Optional trailing slot — typically an `<InlineAction>` like
   * "Reset section" or a small status indicator. Right-aligned.
   */
  trailing?: ReactNode;
  /**
   * Optional subtitle line below the heading — for context like
   * "Per Mode · Active value: 600." Shown only when provided.
   */
  subtitle?: ReactNode;
}

/**
 * Small uppercase section header used in dense settings / properties /
 * forms panels — the "VARIANT" / "COLORS" / "STYLE" labels above
 * grouped fields. Distinct from `PageHeader` (page-level, larger,
 * larger heading + meta) and `DetailSection` (bordered card with
 * an icon and accent rail).
 *
 * The heading itself renders as `<h4>` for semantic grouping. An
 * optional trailing slot is inline with the heading; an optional
 * subtitle drops below.
 */
export function SectionHeader({
  children,
  trailing,
  subtitle,
  className,
  ...rest
}: SectionHeaderProps) {
  return (
    <div className={cn("uxm-section-header", className)} {...rest}>
      <div className="uxm-section-header__row">
        <h4 className="uxm-section-header__title">{children}</h4>
        {trailing && (
          <span className="uxm-section-header__trailing">{trailing}</span>
        )}
      </div>
      {subtitle && (
        <div className="uxm-section-header__subtitle">{subtitle}</div>
      )}
    </div>
  );
}
