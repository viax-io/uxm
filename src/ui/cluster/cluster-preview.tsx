import type { PreviewProps } from '@/previews/types';
import { Cluster } from '@/ui';

type ClusterAlign = 'center' | 'start' | 'end' | 'baseline';
type ClusterJustify = 'start' | 'center' | 'end' | 'between';

const ITEMS = ['filter', 'tag', 'chip', 'item', 'label', 'category'];

export function ClusterPreview({ styles, variants }: PreviewProps) {
  const gap = styles.gap as number;
  const align = (variants.align as ClusterAlign) ?? 'center';
  const justify = (variants.justify as ClusterJustify) ?? 'start';
  return (
    <div style={{ width: 360 }}>
      <Cluster gap={gap} align={align} justify={justify}>
        {ITEMS.map((label, i) => (
          <span
            key={label}
            style={{
              padding: `6px ${10 + i * 2}px`,
              borderRadius: 999,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              fontSize: 12,
              color: 'var(--color-text-muted)',
              // Mixed font sizes give `baseline` align something to anchor.
              lineHeight: 1 + (i % 3) * 0.15,
            }}
          >
            {label}
          </span>
        ))}
      </Cluster>
    </div>
  );
}
