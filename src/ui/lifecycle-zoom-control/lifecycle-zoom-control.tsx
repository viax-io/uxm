import type { HTMLAttributes } from "react";
import { cn } from "./cn";
import { Icon } from "./icon";

export interface LifecycleZoomControlProps extends HTMLAttributes<HTMLDivElement> {
  /** Current zoom percentage shown between the +/− buttons. */
  value?: number;
  /** Optional handlers — when omitted, buttons render in a "decorative" disabled-looking state. */
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  /** Size of each button in px. CSS-token-driven by default. */
  buttonSize?: number;
}

/**
 * The compact −/percent/+ cluster that lives in the corner of a lifecycle
 * canvas. Inert if no handlers passed (useful for static demos / templates).
 */
export function LifecycleZoomControl({
  value = 100,
  onZoomIn,
  onZoomOut,
  buttonSize,
  className,
  style,
  ...rest
}: LifecycleZoomControlProps) {
  const sizeStyle = buttonSize ? { ["--uxm-lifecycle-zoom-button-size" as string]: `${buttonSize}px` } : undefined;
  return (
    <div
      {...rest}
      className={cn("uxm-lifecycle-zoom-control", className)}
      style={{ ...sizeStyle, ...style }}
    >
      <button
        type="button"
        className="uxm-lifecycle-zoom-control__btn"
        aria-label="Zoom out"
        onClick={onZoomOut}
        disabled={!onZoomOut}
      >
        <Icon glyph="minus" size={14} strokeWidth={2.5} />
      </button>
      <div className="uxm-lifecycle-zoom-control__value">
        <span className="uxm-lifecycle-zoom-control__num">{value}</span>
        <span className="uxm-lifecycle-zoom-control__unit">%</span>
      </div>
      <button
        type="button"
        className="uxm-lifecycle-zoom-control__btn"
        aria-label="Zoom in"
        onClick={onZoomIn}
        disabled={!onZoomIn}
      >
        <Icon glyph="plus" size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
