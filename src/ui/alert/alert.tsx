import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";
import { Icon } from "./icon";

export type AlertVariant = "success" | "info" | "warning" | "error";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  title?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
}

// Map each alert variant to its glyph in the Icon registry. Callers that
// want a custom icon can still pass `icon={...}` to override.
const VARIANT_GLYPH: Record<AlertVariant, string> = {
  success: "check-circle",
  info: "info",
  warning: "exclamation-triangle",
  error: "exclamation-circle",
};

export function Alert({
  variant = "info",
  title,
  icon,
  children,
  className,
  ...rest
}: AlertProps) {
  return (
    <div role="alert" className={cn("uxm-alert", `uxm-alert--${variant}`, className)} {...rest}>
      <span className="uxm-alert__icon" aria-hidden="true">
        {icon ?? <Icon glyph={VARIANT_GLYPH[variant]} size={20} strokeWidth={1.5} />}
      </span>
      <div className="uxm-alert__body">
        {title && <p className="uxm-alert__title">{title}</p>}
        <div className="uxm-alert__content">{children}</div>
      </div>
    </div>
  );
}
