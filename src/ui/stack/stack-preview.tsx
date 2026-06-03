import type { PreviewProps } from '@/previews/types';
import { Stack } from '@/ui';

type StackAlign = 'stretch' | 'start' | 'center' | 'end';

export function StackPreview({ styles, variants }: PreviewProps) {
  const gap = styles.gap as number;
  const align = (variants.align as StackAlign) ?? 'stretch';
  return (
    <div style={{ width: 320 }}>
      <Stack gap={gap} align={align}>
        {['First', 'Second', 'Third'].map((label, i) => (
          <div
            key={label}
            style={{
              padding: 12,
              // Three different widths so the `align` variant has something
              // visible to anchor — stretch fills the column, start hugs
              // left, end hugs right.
              width: align === 'stretch' ? '100%' : 120 + i * 40,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              fontSize: 13,
              color: 'var(--color-text-muted)',
            }}
          >
            {label}
          </div>
        ))}
      </Stack>
    </div>
  );
}
