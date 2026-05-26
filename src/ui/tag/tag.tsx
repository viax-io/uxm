'use client';

import { cn } from '@/helpers';

import type { CSSProperties, ReactNode } from 'react';

export type TagType = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type TagSize = 'small' | 'medium';

export interface TagProps {
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
  className?: string;
  /**
   * Inline style on the rendered tag element. Used by the editor preview
   * to project draft `--uxm-tag-*` CSS variables directly onto the tag,
   * since inline styles take precedence over saved-overrides at the
   * `.uxm-tag` class level.
   */
  style?: CSSProperties;
}

/**
 * Tag — read-only status label, six semantic types (accent / success /
 * warning / danger / info / neutral) × two sizes (small / medium).
 * Styled via `.uxm-tag` + `.uxm-tag--{type}` + `.uxm-tag--{size}` CSS
 * reading `--uxm-tag-*` custom properties.
 */
export function Tag({ children, type = 'neutral', size = 'medium', iconLeft, className, style }: TagProps) {
  return (
    <span className={cn('uxm-tag', `uxm-tag--${type}`, `uxm-tag--${size}`, className)} style={style}>
      {iconLeft && (
        <span className="uxm-tag__icon-left" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      <span className="uxm-tag__label">{children}</span>
    </span>
  );
}
