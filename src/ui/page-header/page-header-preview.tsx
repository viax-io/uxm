import type { PreviewProps } from '@/previews/types';
import { ButtonPrimary, ButtonTertiary } from '@/ui';
import { Icon } from '@/ui';
import { Tag } from '@/ui';

export function PageHeaderPreview({ styles }: PreviewProps) {
  const iconSize = styles.iconSize as number;
  return (
    <div
      style={{
        width: 520,
        display: 'flex', alignItems: 'flex-start',
        gap: styles.gap as number,
        padding: `${styles.paddingY}px ${styles.paddingX}px`,
      }}
    >
      <span style={{
        width: iconSize, height: iconSize, flexShrink: 0,
        borderRadius: 8,
        backgroundColor: styles.iconBg as string,
        color: styles.iconColor as string,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon glyph="chat-bubble" size={iconSize * 0.55} strokeWidth={1.5} />
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{
            fontSize: styles.titleSize as number, fontWeight: 600,
            color: styles.titleColor as string,
            margin: 0,
          }}>Billing Automation</h1>
          <Tag type="accent" size="small">Active</Tag>
        </div>
        <p style={{
          fontSize: styles.metaSize as number,
          color: styles.metaColor as string,
          margin: '2px 0 0',
        }}>End-to-end invoicing across subscription and usage plans</p>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <ButtonTertiary>Edit</ButtonTertiary>
        <ButtonPrimary>Publish</ButtonPrimary>
      </div>
    </div>
  );
}
