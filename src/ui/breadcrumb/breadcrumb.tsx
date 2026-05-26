import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";
import { Icon } from "./icon";
import { Link } from "./link";

export type BreadcrumbSeparator = "slash" | "chevron" | "dot" | "dash";

export interface BreadcrumbCrumb {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbCrumb[];
  separator?: BreadcrumbSeparator;
}

const SEPARATOR_GLYPH: Record<Exclude<BreadcrumbSeparator, "chevron">, string> = {
  slash: "/",
  dot: "·",
  dash: "—",
};

export function Breadcrumb({
  items,
  separator = "chevron",
  className,
  ...rest
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("uxm-breadcrumb", className)} {...rest}>
      <ol className="uxm-breadcrumb__list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const showSeparator = !isLast;
          return (
            <li key={i} className="uxm-breadcrumb__item">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  underline="hover"
                  className="uxm-breadcrumb__link"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="uxm-breadcrumb__current"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              {showSeparator &&
                (separator === "chevron" ? (
                  <Icon
                    glyph="chevron-right"
                    className="uxm-breadcrumb__separator uxm-breadcrumb__separator--icon"
                    aria-hidden
                  />
                ) : (
                  <span className="uxm-breadcrumb__separator" aria-hidden>
                    {SEPARATOR_GLYPH[separator]}
                  </span>
                ))}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
