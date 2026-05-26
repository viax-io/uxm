import { cn } from '@/helpers';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** SVG content (use the Icon component or a raw <svg>). */
  children: ReactNode;
  /** Required for accessibility on icon-only buttons. */
  'aria-label': string;
}

export function ButtonIcon({ children, className, type = 'button', ...rest }: ButtonIconProps) {
  return (
    <button type={type} className={cn('uxm-button-icon', className)} {...rest}>
      {children}
    </button>
  );
}
