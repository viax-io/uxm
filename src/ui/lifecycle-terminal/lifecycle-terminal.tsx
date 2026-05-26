import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface LifecycleTerminalProps extends HTMLAttributes<HTMLDivElement> {
  /** Label shown inside — typically "Start" or "End". */
  label?: ReactNode;
}

/**
 * Pill marker for the entry / exit point of a BI lifecycle. Renders as a small
 * rounded pill (Start at the top of the canvas, End at the bottom). The label
 * defaults to "Start" so the most common case is a one-liner.
 */
export function LifecycleTerminal({ label = "Start", className, children, ...rest }: LifecycleTerminalProps) {
  return (
    <div {...rest} className={cn("uxm-lifecycle-terminal", className)}>
      {children ?? label}
    </div>
  );
}
