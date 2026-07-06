import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';

export function ContentTooltipPreview({ styles }: PreviewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      {/* Rich tooltip */}
      <div
        style={{
          ['--uxm-content-tooltip-background-color' as string]: styles.backgroundColor as string,
          ['--uxm-content-tooltip-border-color' as string]: styles.borderColor as string,
          ['--uxm-content-tooltip-border-radius' as string]: `${styles.borderRadius}px`,
          ['--uxm-content-tooltip-padding' as string]: `${styles.padding}px`,
          ['--uxm-content-tooltip-max-width' as string]: `${styles.maxWidth}px`,
          backgroundColor: 'var(--uxm-content-tooltip-background-color)',
          border: '1px solid var(--uxm-content-tooltip-border-color)',
          borderRadius: 'var(--uxm-content-tooltip-border-radius)',
          padding: 'var(--uxm-content-tooltip-padding)',
          maxWidth: 'var(--uxm-content-tooltip-max-width)',
          boxShadow: styles.shadow
            ? '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)'
            : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
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
              flexShrink: 0,
            }}
          >
            <Icon glyph="sparkle" size={18} strokeWidth={1.5} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: styles.titleSize as number, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
              Quick Actions
            </h4>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '4px 0 12px', lineHeight: 1.5 }}>
              Use keyboard shortcuts to speed up your workflow. Press <kbd style={{ fontSize: 11, padding: '1px 5px', borderRadius: 4, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>?</kbd> to see all available shortcuts.
            </p>
            <button
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--color-accent-bold)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              Learn more →
            </button>
          </div>
        </div>
      </div>

      {/* Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 12 }}>
        <Icon glyph="arrow-up" size={14} strokeWidth={1.5} />
        Hover trigger above
      </div>
    </div>
  );
}
