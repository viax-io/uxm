import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div className={cn("uxm-empty-state", className)} {...rest}>
      {icon && <div className="uxm-empty-state__icon">{icon}</div>}
      <div className="uxm-empty-state__title">{title}</div>
      {description && <div className="uxm-empty-state__description">{description}</div>}
      {action && <div className="uxm-empty-state__action">{action}</div>}
    </div>
  );
}
