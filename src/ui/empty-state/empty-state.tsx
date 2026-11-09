import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export type EmptyStateVariant = 'default' | 'first-run' | 'no-results';
export type EmptyStateSize = 'default' | 'compact';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /**
   * `first-run` frames the block (dashed border on the surface) to invite a
   * first action; `no-results` is a quieter, unframed in-place message.
   * `default` is the original look.
   */
  variant?: EmptyStateVariant;
  /** `compact` tightens padding, icon, gap and type for cards and tiles. */
  size?: EmptyStateSize;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  size = 'default',
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'uxm-empty-state',
        variant !== 'default' && `uxm-empty-state--${variant}`,
        size === 'compact' && 'uxm-empty-state--compact',
        className,
      )}
      {...rest}
    >
      {icon && <div className="uxm-empty-state__icon">{icon}</div>}
      <div className="uxm-empty-state__title">{title}</div>
      {description && <div className="uxm-empty-state__description">{description}</div>}
      {action && <div className="uxm-empty-state__action">{action}</div>}
    </div>
  );
}
