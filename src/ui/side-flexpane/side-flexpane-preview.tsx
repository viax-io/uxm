import type { PreviewProps } from '@/previews/types';
import { ButtonPrimary, ButtonTertiary } from '@/ui';
import { Icon } from '@/ui';
import { IconButton } from '@/ui';

export function SideFlexpanePreview({ styles }: PreviewProps) {
  return (
    <div
      style={{
        width: styles.width as number,
        height: 360,
        backgroundColor: styles.backgroundColor as string,
        border: `1px solid ${styles.borderColor}`,
        borderRadius: styles.borderRadius as number,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${styles.borderColor}`,
          padding: `${styles.paddingY}px ${styles.paddingX}px`,
        }}
      >
        <div>
          <p style={{
            fontSize: 11, fontWeight: 600,
            color: styles.labelColor as string,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            margin: 0,
          }}>Edit</p>
          <h3 style={{
            fontSize: styles.titleSize as number, fontWeight: 600,
            color: 'var(--color-text)',
            margin: '2px 0 0',
          }}>Participants</h3>
        </div>
        <IconButton aria-label="Close">
          <Icon glyph="close" size={16} />
        </IconButton>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: `${styles.paddingY}px ${styles.paddingX}px` }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
          Panel body — scrolls independently of the header and footer. Drop form fields, lists,
          or read-only detail here.
        </p>
      </div>
      <div
        style={{
          display: 'flex', gap: 8,
          borderTop: `1px solid ${styles.borderColor}`,
          padding: `${(styles.paddingY as number) * 0.9}px ${styles.paddingX}px`,
        }}
      >
        <ButtonTertiary style={{ flex: 1 }}>Cancel</ButtonTertiary>
        <ButtonPrimary style={{ flex: 1 }}>Save</ButtonPrimary>
      </div>
    </div>
  );
}
