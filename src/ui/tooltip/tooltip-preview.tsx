import type { PreviewProps } from '@/previews/types';

export function TooltipPreview({ styles }: PreviewProps) {
  const showArrow = styles.showArrow as boolean;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {/* Tooltip */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div
          style={{
            ['--uxm-tooltip-background-color' as string]: styles.backgroundColor as string,
            ['--uxm-tooltip-color' as string]: styles.color as string,
            ['--uxm-tooltip-border-radius' as string]: `${styles.borderRadius}px`,
            ['--uxm-tooltip-padding-y' as string]: `${styles.paddingY}px`,
            ['--uxm-tooltip-padding-x' as string]: `${styles.paddingX}px`,
            ['--uxm-tooltip-font-size' as string]: `${styles.fontSize}px`,
            backgroundColor: 'var(--uxm-tooltip-background-color)',
            color: 'var(--uxm-tooltip-color)',
            borderRadius: 'var(--uxm-tooltip-border-radius)',
            padding: 'var(--uxm-tooltip-padding-y) var(--uxm-tooltip-padding-x)',
            fontSize: 'var(--uxm-tooltip-font-size)',
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
