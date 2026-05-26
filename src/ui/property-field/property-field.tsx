import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export interface PropertyFieldProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  children: ReactNode;
}

export function PropertyField({ label, children, className, ...rest }: PropertyFieldProps) {
  return (
    <div className={cn('uxm-property-field', className)} {...rest}>
      <span className="uxm-property-field__label">{label}</span>
      <span className="uxm-property-field__value">{children}</span>
    </div>
  );
}

export interface PropertyGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PropertyGrid({ children, className, ...rest }: PropertyGridProps) {
  return (
    <div className={cn('uxm-property-grid', className)} {...rest}>
      {children}
    </div>
  );
}
