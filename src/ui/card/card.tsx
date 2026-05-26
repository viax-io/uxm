import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  shadow?: boolean;
}

export function Card({ className, shadow, ...rest }: CardProps) {
  return <div className={cn("uxm-card", shadow && "uxm-card--shadow", className)} {...rest} />;
}
