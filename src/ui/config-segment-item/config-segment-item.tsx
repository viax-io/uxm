import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/helpers";

// `name` here is the visible segment label (ReactNode). The native HTML
// `name` attribute on <button> is a form-control name — not what we want
// surfaced. Strip it from the props surface; consumers don't put buttons in
// forms here.
export interface ConfigSegmentItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "name"> {
  /** Segment name (primary text). */
  name: ReactNode;
  /**
   * Optional small line below the name. Typical use: "{n} components" so the
   * segment row carries a quick gauge of how full this segment is.
   */
  meta?: ReactNode;
  /** Render the active (selected) state. */
  active?: boolean;
}

/**
 * Left-pane row in a Configuration model's segment list. A segment groups a
 * set of components (Account Profile → Account Name, Account Type, …); the
 * user selects one segment at a time and edits its components in the middle
 * pane. Active state is "selected" (not navigated-to), so this renders as a
 * `<button>` rather than a link.
 */
export function ConfigSegmentItem({
  name,
  meta,
  active,
  className,
  type = "button",
  ...rest
}: ConfigSegmentItemProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        "uxm-config-segment-item",
        active && "uxm-config-segment-item--active",
        className,
      )}
      {...rest}
    >
      <span className="uxm-config-segment-item__name">{name}</span>
      {meta && <span className="uxm-config-segment-item__meta">{meta}</span>}
    </button>
  );
}
