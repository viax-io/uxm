import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function List({ children, className, ...rest }: ListProps) {
  return (
    <div className={cn("uxm-list", className)} {...rest}>
      {children}
    </div>
  );
}

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  value?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
}

export function ListItem({ icon, value, trailing, children, className, ...rest }: ListItemProps) {
  return (
    <div className={cn("uxm-list-item", className)} {...rest}>
      {icon && <span className="uxm-list-item__icon">{icon}</span>}
      <span className="uxm-list-item__content">
        <span className="uxm-list-item__title">{children}</span>
        {value !== undefined && value !== null && (
          <span className="uxm-list-item__value">{value}</span>
        )}
      </span>
      {trailing && <span className="uxm-list-item__trailing">{trailing}</span>}
    </div>
  );
}
