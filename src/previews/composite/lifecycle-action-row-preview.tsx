import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { IconButton } from '@/ui';

type ActionType = 'notify' | 'transform' | 'validate';

const actionConfig: Record<ActionType, { label: string; name: string; bg: string; color: string }> = {
  notify: { label: 'Notify', name: 'Email customer about status change', bg: 'rgba(144, 233, 184, 0.22)', color: 'var(--color-accent-bold)' },
  transform: { label: 'Transform', name: 'Recalculate totals with tax', bg: 'rgba(252, 208, 161, 0.3)', color: 'var(--color-on-highlight-warm)' },
  validate: { label: 'Validate', name: 'Check required fields present', bg: 'rgba(195, 190, 247, 0.25)', color: 'var(--color-on-highlight-cool)' },
};

export function LifecycleActionRowPreview({ styles, variants }: PreviewProps) {
  const t = (variants.actionType as ActionType) ?? 'notify';
  const cfg = actionConfig[t];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: styles.gap as number,
        minWidth: 320,
        paddingLeft: styles.paddingX as number,
        paddingRight: styles.paddingX as number,
        paddingTop: styles.paddingY as number,
        paddingBottom: styles.paddingY as number,
        border: `1px solid ${styles.borderColor}`,
        borderRadius: styles.borderRadius as number,
        backgroundColor: 'var(--color-card)',
      }}
    >
      <span
        style={{
          padding: '2px 10px',
          fontSize: styles.badgeSize as number,
          fontWeight: 500,
          borderRadius: styles.badgeRadius as number,
          backgroundColor: cfg.bg,
          color: cfg.color,
          whiteSpace: 'nowrap',
        }}
      >
        {cfg.label}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: styles.fontSize as number,
          color: styles.color as string,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {cfg.name}
      </span>
      <IconButton aria-label="Remove action">
        <Icon glyph="close" size={14} strokeWidth={2} />
      </IconButton>
    </div>
  );
}
