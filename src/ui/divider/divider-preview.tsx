import type { PreviewProps } from '@/previews/types';

export function DividerPreview({ styles }: PreviewProps) {
  const showLabel = styles.showLabel as boolean;
  const thickness = styles.thickness as number;
  return (
    <div style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 28 }}>
      {!showLabel && (
        <div style={{
          height: thickness,
          backgroundColor: styles.color as string,
          borderRadius: thickness > 1 ? thickness / 2 : 0,
        }} />
      )}
      {showLabel && (
        <div style={{ display: 'flex', alignItems: 'center', gap: styles.gap as number }}>
          <div style={{ flex: 1, height: thickness, backgroundColor: styles.color as string }} />
          <span style={{
            fontSize: styles.labelSize as number,
            fontWeight: 600,
            color: styles.labelColor as string,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>Section</span>
          <div style={{ flex: 1, height: thickness, backgroundColor: styles.color as string }} />
        </div>
      )}
    </div>
  );
}
