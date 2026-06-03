import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';

const variantDefaults: Record<string, { bg: string; color: string; border: string; glyph: string }> = {
  success: { bg: 'var(--color-success-bg)', color: 'var(--color-success-text)', border: 'var(--color-success-border)', glyph: 'check-circle' },
  info: { bg: 'var(--color-info-bg)', color: 'var(--color-info-text)', border: 'var(--color-info-border)', glyph: 'info' },
  warning: { bg: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', border: 'var(--color-warning-border)', glyph: 'exclamation-triangle' },
  error: { bg: 'var(--color-danger-bg)', color: 'var(--color-danger-text)', border: 'var(--color-danger-border)', glyph: 'exclamation-circle' },
};

export function AlertPreview({ styles, variants }: PreviewProps) {
  const variant = variants.variant ?? 'success';
  const defaults = variantDefaults[variant] ?? variantDefaults.success;

  const bg = styles.backgroundColor !== 'var(--color-success-bg)' ? (styles.backgroundColor as string) : defaults.bg;
  const color = styles.color !== 'var(--color-success-text)' ? (styles.color as string) : defaults.color;
  const border = styles.borderColor !== 'var(--color-success-border)' ? (styles.borderColor as string) : defaults.border;

  return (
    <div
      style={{
        width: 380,
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        borderRadius: styles.borderRadius as number,
        padding: `${styles.paddingY}px ${styles.paddingX}px`,
        fontSize: styles.fontSize as number,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <Icon glyph={defaults.glyph} size={20} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
      <div>
        <p style={{ fontWeight: 600, margin: '0 0 4px' }}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)} alert
        </p>
        <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.5 }}>
          This is an example {variant} message to inform the user about something important.
        </p>
      </div>
    </div>
  );
}
