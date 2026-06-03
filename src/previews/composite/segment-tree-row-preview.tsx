import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';

export function SegmentTreeRowPreview({ styles, variants }: PreviewProps) {
  const expanded = (variants.state as string) !== 'collapsed';

  return (
    <div
      style={{
        width: 460,
        backgroundColor: styles.backgroundColor as string,
        border: `1px solid ${styles.borderColor}`,
        borderRadius: styles.borderRadius as number,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: `${styles.paddingY}px ${styles.paddingX}px`,
          userSelect: 'none',
        }}
      >
        {/* Drag handle */}
        <span style={{ color: 'var(--color-text-subtle)', display: 'inline-flex' }}>
          <Icon glyph="drag-handle" size={14} />
        </span>

        {/* Accent rail */}
        <div
          style={{
            width: styles.accentWidth as number,
            height: styles.accentHeight as number,
            borderRadius: 999,
            backgroundColor: styles.accentColor as string,
          }}
        />

        {/* Chevron */}
        <button
          type="button"
          style={{
            width: 22,
            height: 22,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            borderRadius: 4,
          }}
        >
          <Icon
            glyph="chevron-right"
            size={14}
            strokeWidth={2}
            style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}
          />
        </button>

        {/* Title */}
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: styles.titleSize as number,
            fontWeight: 600,
            color: styles.titleColor as string,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Practice Information
        </span>

        {/* Count badge */}
        <span
          style={{
            flexShrink: 0,
            padding: '1px 9px',
            borderRadius: 999,
            backgroundColor: styles.countBadgeBg as string,
            color: styles.countBadgeText as string,
            fontSize: 11,
            fontWeight: 500,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          6 items
        </span>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--color-border)', padding: '8px 12px' }}>
          {['Practice Name', 'Practice Type', 'Number of Operatories'].map((c, i) => (
            <div
              key={c}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 8px',
                borderRadius: 6,
                color: 'var(--color-text)',
                fontSize: 13,
              }}
            >
              <span
                style={{
                  width: 22, height: 22,
                  borderRadius: 4,
                  backgroundColor: i === 1 ? 'var(--color-highlight-cool)' : 'var(--color-accent-subtle)',
                  color: i === 1 ? 'var(--color-on-highlight-cool)' : 'var(--color-accent-bold)',
                  fontSize: 11, fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {i === 0 ? 'Aa' : i === 1 ? '≡' : '#'}
              </span>
              <span style={{ flex: 1 }}>{c}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>
                {i === 0 ? 'Text' : i === 1 ? 'Options' : 'Number'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
