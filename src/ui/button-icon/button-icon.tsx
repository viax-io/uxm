import { cn } from '@/helpers';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * @deprecated Since 4.39 — use `<IconButton variant="filled">`, which paints
 * exactly this (40px, surface-alt fill, radius 8) under
 * `--uxm-icon-button-filled-*`. `ButtonIcon` and its `--uxm-button-icon-*`
 * vars are removed in the next major.
 */
export interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** SVG content (use the Icon component or a raw <svg>). */
  children: ReactNode;
  /** Required for accessibility on icon-only buttons. */
  'aria-label': string;
}

/**
 * @deprecated Since 4.39 — use `<IconButton variant="filled">` (see
 * `ButtonIconProps`). Removed in the next major.
 */
export function ButtonIcon({ children, className, type = 'button', ...rest }: ButtonIconProps) {
  return (
    <button type={type} className={cn('uxm-button-icon', className)} {...rest}>
      {children}
    </button>
  );
}
