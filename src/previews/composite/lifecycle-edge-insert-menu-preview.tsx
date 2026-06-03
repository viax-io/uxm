import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';

type ItemKind = 'state' | 'condition' | 'task';

const items: { kind: ItemKind; glyph: string; label: string; iconBg: string; iconColor: string }[] = [
  { kind: 'state', glyph: 'check-circle', label: 'State', iconBg: 'rgba(144, 233, 184, 0.25)', iconColor: 'var(--color-accent-bold)' },
  { kind: 'condition', glyph: 'question-mark-circle', label: 'Condition', iconBg: 'rgba(252, 208, 161, 0.3)', iconColor: 'var(--color-on-highlight-warm)' },
  { kind: 'task', glyph: 'cog-6-tooth', label: 'Task', iconBg: 'rgba(195, 190, 247, 0.25)', iconColor: 'var(--color-on-highlight-cool)' },
];

export function LifecycleEdgeInsertMenuPreview({ styles }: PreviewProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        minWidth: 180,
        paddingLeft: styles.paddingX as number,
        paddingRight: styles.paddingX as number,
        paddingTop: styles.paddingY as number,
        paddingBottom: styles.paddingY as number,
        backgroundColor: styles.backgroundColor as string,
        border: `1px solid ${styles.borderColor}`,
        borderRadius: styles.borderRadius as number,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
      }}
    >
      {items.map((it) => (
        <button
          key={it.label}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            paddingLeft: styles.itemPaddingX as number,
            paddingRight: styles.itemPaddingX as number,
            paddingTop: styles.itemPaddingY as number,
            paddingBottom: styles.itemPaddingY as number,
            background: 'transparent',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: styles.fontSize as number,
            color: styles.color as string,
          }}
        >
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              backgroundColor: it.iconBg,
              color: it.iconColor,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon glyph={it.glyph} size={12} />
          </span>
          {it.label}
        </button>
      ))}
    </div>
  );
}
