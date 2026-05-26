import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/helpers";

export type TimelineDotState = "active" | "idle";

export interface TimelineEntryProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  meta?: ReactNode;
  trailing?: ReactNode;
  state?: TimelineDotState;
  /** Whether to render the connector line above this entry. */
  lineBefore?: boolean;
  /** Whether to render the connector line below this entry. */
  lineAfter?: boolean;
  children?: ReactNode;
}

export function TimelineEntry({
  title,
  meta,
  trailing,
  state = "active",
  lineBefore = true,
  lineAfter = true,
  children,
  className,
  ...rest
}: TimelineEntryProps) {
  return (
    <div
      className={cn("uxm-timeline-entry", `uxm-timeline-entry--${state}`, className)}
      {...rest}
    >
      <div className="uxm-timeline-entry__rail" aria-hidden="true">
        {lineBefore && <span className="uxm-timeline-entry__line uxm-timeline-entry__line--before" />}
        <span className="uxm-timeline-entry__dot" />
        {lineAfter && <span className="uxm-timeline-entry__line uxm-timeline-entry__line--after" />}
      </div>
      <div className="uxm-timeline-entry__content">
        <div className="uxm-timeline-entry__row">
          <span className="uxm-timeline-entry__title">{title}</span>
          {trailing && <span className="uxm-timeline-entry__trailing">{trailing}</span>}
        </div>
        {meta && <p className="uxm-timeline-entry__meta">{meta}</p>}
        {children && <div className="uxm-timeline-entry__body">{children}</div>}
      </div>
    </div>
  );
}
