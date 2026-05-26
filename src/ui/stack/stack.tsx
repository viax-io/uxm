import type { HTMLAttributes, ReactNode, CSSProperties } from "react";
import { cn } from "@/helpers";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap between stacked items. Defaults to 16px. */
  gap?: string | number;
  /**
   * Cross-axis alignment of items (left/right/center within the stack's
   * width). Defaults to "stretch" so children naturally span the container.
   */
  align?: "start" | "center" | "end" | "stretch";
  children?: ReactNode;
}

/**
 * Vertical flex column with a consistent gap. The boring building block
 * that replaces ad-hoc `flex flex-col gap-N` div soup across page layouts.
 *
 * Why an atom: page authors and AI page-generation pipelines need a vocab
 * for "items, stacked, with a consistent rhythm" without picking a
 * tailwind gap-N value every time. Editor knob themes the gap once.
 */
export function Stack({
  gap,
  align = "stretch",
  className,
  style,
  ...rest
}: StackProps) {
  const mergedStyle: CSSProperties = {
    ...(gap !== undefined
      ? { ["--uxm-stack-gap" as string]: typeof gap === "number" ? `${gap}px` : gap }
      : null),
    ...style,
  };
  return (
    <div
      className={cn("uxm-stack", `uxm-stack--${align}`, className)}
      style={mergedStyle}
      {...rest}
    />
  );
}
