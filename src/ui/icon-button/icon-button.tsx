import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/helpers";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** SVG content (use the Icon component or a raw <svg>). */
  children: ReactNode;
  /** Required for accessibility on icon-only buttons. */
  "aria-label": string;
}

export function IconButton({ children, className, type = "button", ...rest }: IconButtonProps) {
  return (
    <button type={type} className={cn("uxm-icon-button", className)} {...rest}>
      {children}
    </button>
  );
}
