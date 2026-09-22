import { cn } from '@/helpers';

import type { ComponentPropsWithRef, ReactNode } from 'react';

export type IconButtonVariant = 'ghost' | 'filled';

export interface IconButtonProps extends ComponentPropsWithRef<'button'> {
  /** SVG content (use the Icon component or a raw <svg>). */
  children: ReactNode;
  /** Required for accessibility on icon-only buttons. */
  'aria-label': string;
  /**
   * `ghost` (default) — 32px, transparent, for toolbars, row ⋮ and inline
   * chrome. `filled` — 40px, `--color-surface-alt` fill, radius 8, for a
   * standalone action ("add", "create"). `filled` is the successor of the
   * deprecated `ButtonIcon` atom and paints exactly what it painted.
   */
  variant?: IconButtonVariant;
}

export function IconButton({
  children,
  className,
  type = 'button',
  variant = 'ghost',
  ref,
  ...rest
}: IconButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn('uxm-icon-button', variant === 'filled' && 'uxm-icon-button--filled', className)}
      {...rest}
    >
      {children}
    </button>
  );
}
