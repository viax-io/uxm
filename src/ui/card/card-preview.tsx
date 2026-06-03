import type { PreviewProps } from '@/previews/types';
import { Card } from '@/ui';
import { Icon } from '@/ui';

export function CardPreview({ styles }: PreviewProps) {
  return (
    <Card
      shadow={Boolean(styles.shadow)}
      style={{
        width: 320,
        // Each registry knob → matching `--uxm-card-*` variable. Same
        // surface a production consumer would re-theme through.
        ['--uxm-card-bg' as string]: styles.backgroundColor as string,
        ['--uxm-card-border-color' as string]: styles.borderColor as string,
        ['--uxm-card-radius' as string]: `${styles.borderRadius}px`,
        ['--uxm-card-padding' as string]: `${styles.padding}px`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: 'var(--color-accent-subtle)',
            color: 'var(--color-accent-bold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon glyph="bolt" size={18} />
        </div>
        <div>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
            Analytics Dashboard
          </h4>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, marginTop: 2 }}>
            Updated 2 hours ago
          </p>
        </div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
        Track key metrics and monitor performance across all active revenue motions in real time.
      </p>
    </Card>
  );
}
