import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";
import { Icon } from "./icon";

export interface BackLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export function BackLink({ children, className, ...rest }: BackLinkProps) {
  return (
    <a className={cn("uxm-back-link", className)} {...rest}>
      <Icon
        glyph="arrow-left"
        size={14}
        strokeWidth={2}
        className="uxm-back-link__arrow"
      />
      {children}
    </a>
  );
}
