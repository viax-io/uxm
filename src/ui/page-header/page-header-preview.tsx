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
        gap: `var(--uxm-page-header-gap, ${styles.gap}px)`,
        padding: `var(--uxm-page-header-padding-y, ${styles.paddingY}px) var(--uxm-page-header-padding-x, ${styles.paddingX}px)`,
      }}
    >
      <span style={{
        width: `var(--uxm-page-header-icon-size, ${iconSize}px)`,
        height: `var(--uxm-page-header-icon-size, ${iconSize}px)`,
        flexShrink: 0,
        borderRadius: 8,
        backgroundColor: `var(--uxm-page-header-icon-bg, ${styles.iconBg as string})`,
        color: `var(--uxm-page-header-icon-color, ${styles.iconColor as string})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon glyph="chat-bubble" size={iconSize * 0.55} strokeWidth={1.5} />
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{
            // Mirrors the atom's own chain (page-header.scss) so the canvas
            // reflects a brand heading face/weight the way the shipped
            // component does — this preview hand-rolls its markup.
            fontFamily: 'var(--uxm-page-header-title-font, var(--type-page-title-font, var(--brand-heading-font, inherit)))',
            fontSize: `calc(${styles.titleSize}px * var(--type-page-title-scale, 1) * var(--type-scale, 1))`,
            fontWeight: 'var(--uxm-page-header-title-weight, var(--type-page-title-weight, var(--brand-heading-weight, 600)))',
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
