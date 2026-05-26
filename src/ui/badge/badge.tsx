import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export type BadgeMode = "dot" | "count";
export type BadgeType = "accent" | "success" | "warning" | "danger" | "info" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  mode?: BadgeMode;
  type?: BadgeType;
  count?: number;
  max?: number;
}

export function Badge({
  mode = "count",
  type = "danger",
  count,
  max = 99,
  className,
  children,
  ...rest
}: BadgeProps) {
  const isDot = mode === "dot";
  const rootClass = cn(
    "uxm-badge",
    `uxm-badge--${mode}`,
    `uxm-badge--${type}`,
    className,
  );

  if (isDot) {
    return (
      <span
        className={rootClass}
        role={children ? undefined : "status"}
        {...rest}
      >
        <span className="uxm-badge__dot" aria-hidden={children ? true : undefined} />
        {children !== undefined && children !== null && (
          <span className="uxm-badge__label">{children}</span>
        )}
      </span>
    );
  }

  const display =
    children !== undefined ? children
    : typeof count === "number" ? (count > max ? `${max}+` : String(count))
    : null;

  return (
    <span className={rootClass} {...rest}>
      {display}
    </span>
  );
}
