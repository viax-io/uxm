import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { HTMLAttributes, ReactNode } from 'react';

export type StatCardTrend = 'up' | 'down' | 'neutral';

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  trend?: ReactNode;
  trendDirection?: StatCardTrend;
}

export function StatCard({
  label,
  value,
  trend,
  trendDirection = 'neutral',
  className,
  ...rest
}: StatCardProps) {
  return (
    <div className={cn('uxm-stat-card', className)} {...rest}>
      <p className="uxm-stat-card__label">{label}</p>
      <div className="uxm-stat-card__row">
        <span className="uxm-stat-card__value">{value}</span>
        {trend && (
          <span
            className={cn(
              'uxm-stat-card__trend',
              `uxm-stat-card__trend--${trendDirection}`,
            )}
          >
            {trendDirection !== 'neutral' && (
              <Icon
                glyph="arrow-up"
                size={12}
                strokeWidth={2.5}
                className="uxm-stat-card__trend-icon"
              />
            )}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
