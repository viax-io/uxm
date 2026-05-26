import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  placement?: TooltipPlacement;
  showArrow?: boolean;
  children: ReactNode;
}

export function Tooltip({
  placement = 'top',
  showArrow = true,
  children,
  className,
  ...rest
}: TooltipProps) {
  return (
    <div
      role="tooltip"
      className={cn('uxm-tooltip', `uxm-tooltip--${placement}`, className)}
      {...rest}
    >
      <span className="uxm-tooltip__body">{children}</span>
      {showArrow && <span className="uxm-tooltip__arrow" aria-hidden="true" />}
    </div>
  );
}

export interface ContentTooltipProps extends HTMLAttributes<HTMLDivElement> {
  shadow?: boolean;
  children: ReactNode;
}

export function ContentTooltip({ shadow, children, className, ...rest }: ContentTooltipProps) {
  return (
    <div
      role="tooltip"
      className={cn('uxm-content-tooltip', shadow && 'uxm-content-tooltip--shadow', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
