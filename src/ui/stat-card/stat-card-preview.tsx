import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';

import type { CSSProperties } from 'react';

const stats = [
  { label: 'Total Revenue', value: '$48.2K', trend: '+12.5%', up: true },
  { label: 'Active Users', value: '2,847', trend: '+8.2%', up: true },
  { label: 'Churn Rate', value: '3.1%', trend: '+0.4%', up: false },
];

export function StatCardPreview({ styles }: PreviewProps) {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            '--uxm-stat-card-background-color': styles.backgroundColor as string,
            '--uxm-stat-card-border-color': styles.borderColor as string,
            '--uxm-stat-card-border-radius': `${styles.borderRadius}px`,
            '--uxm-stat-card-padding': `${styles.padding}px`,
            backgroundColor: 'var(--uxm-stat-card-background-color)',
            border: '1px solid var(--uxm-stat-card-border-color)',
            borderRadius: 'var(--uxm-stat-card-border-radius)',
            padding: 'var(--uxm-stat-card-padding)',
            minWidth: 160,
          } as CSSProperties}
        >
          <p style={{ fontSize: styles.labelSize as number, color: 'var(--color-text-muted)', fontWeight: 500, margin: 0 }}>
            {stat.label}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: styles.valueSize as number, fontWeight: 700, color: 'var(--color-text)' }}>
              {stat.value}
            </span>
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: stat.up ? (styles.trendUpColor as string) : (styles.trendDownColor as string),
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
            }}>
              <Icon
                glyph="arrow-up"
                size={12}
                strokeWidth={2.5}
                style={{ transform: stat.up ? 'none' : 'rotate(180deg)' }}
              />
              {stat.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
