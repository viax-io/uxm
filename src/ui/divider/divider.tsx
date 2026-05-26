import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
}

export function Divider({ label, className, ...rest }: DividerProps) {
  if (label) {
    return (
      <div className={cn('uxm-divider', 'uxm-divider--with-label', className)} {...rest}>
        <span className="uxm-divider__line" />
        <span className="uxm-divider__label">{label}</span>
        <span className="uxm-divider__line" />
      </div>
    );
  }
  return <div role="separator" className={cn('uxm-divider', className)} {...rest} />;
}
