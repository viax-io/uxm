import type { PreviewProps } from '@/previews/types';

export function TooltipPreview({ styles }: PreviewProps) {
  const showArrow = styles.showArrow as boolean;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {/* Tooltip */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div
          style={{
            backgroundColor: styles.backgroundColor as string,
            color: styles.color as string,
            borderRadius: styles.borderRadius as number,
            padding: `${styles.paddingY}px ${styles.paddingX}px`,
            fontSize: styles.fontSize as number,
            whiteSpace: 'nowrap',
          }}
        >
          Copy to clipboard
        </div>
        {showArrow && (
          <div
            style={{
              position: 'absolute',
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: 10,
              height: 10,
              backgroundColor: styles.backgroundColor as string,
            }}
          />
        )}
      </div>

      {/* Trigger element */}
      <button
        style={{
          marginTop: 8,
          padding: '8px 16px',
          fontSize: 13,
          fontWeight: 500,
          color: 'var(--color-text)',
          backgroundColor: 'var(--color-surface-alt)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Hover target
      </button>
    </div>
  );
}
