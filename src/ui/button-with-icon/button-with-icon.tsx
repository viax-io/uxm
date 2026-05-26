import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/helpers";

export interface ButtonWithIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Leading icon (SVG element or Icon component). */
  icon: ReactNode;
  children: ReactNode;
}

export function ButtonWithIcon({
  icon,
  children,
  className,
  type = "button",
  ...rest
}: ButtonWithIconProps) {
  return (
    <button type={type} className={cn("uxm-button-with-icon", className)} {...rest}>
      <span className="uxm-button-with-icon__icon">{icon}</span>
      <span className="uxm-button-with-icon__label">{children}</span>
    </button>
  );
}
