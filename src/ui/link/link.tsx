import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";
import { Icon } from "./icon";

export type LinkUnderline = "none" | "hover" | "always";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  underline?: LinkUnderline;
  external?: boolean;
}

export function Link({
  children,
  underline = "hover",
  external = false,
  className,
  ...rest
}: LinkProps) {
  return (
    <a
      className={cn(
        "uxm-link",
        `uxm-link--underline-${underline}`,
        external && "uxm-link--external",
        className,
      )}
      {...rest}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {external && (
        <Icon
          glyph="arrow-up-right"
          className="uxm-link__external-icon"
          aria-hidden
        />
      )}
    </a>
  );
}
