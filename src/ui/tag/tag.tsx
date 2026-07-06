import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export type TagType = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type TagSize = 'small' | 'medium';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  type?: TagType;
  /**
   * Preset size. `medium` (default) is the standalone tag — what
   * registry knobs like paddingX / fontSize tune. `small` is a fixed
   * tighter preset for dense contexts (e.g. status pills inside a
   * data-table row).
   */
  size?: TagSize;
  iconLeft?: ReactNode;
}

/**
 * Tag — read-only status label, six semantic types (accent / success /
 * warning / danger / info / neutral) × two sizes (small / medium).
 * Styled via `.uxm-tag` + `.uxm-tag--{type}` + `.uxm-tag--{size}` CSS
 * reading `--uxm-tag-*` custom properties.
 */
export function Tag({ children, type = 'neutral', size = 'medium', iconLeft, className, ...rest }: TagProps) {
  return (
    <span className={cn('uxm-tag', `uxm-tag--${type}`, `uxm-tag--${size}`, className)} {...rest}>
      {iconLeft && (
        <span className="uxm-tag__icon-left" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      <span className="uxm-tag__label">{children}</span>
    </span>
  );
}
