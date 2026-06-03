import { useState } from 'react';

import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { Tag } from '@/ui';

export function TimelineEntryPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'active';
  const active = state === 'active';

  const dotSize = styles.dotSize as number;
  const dotColor = active ? (styles.dotColor as string) : (styles.dotIdleColor as string);
  const lineColor = styles.lineColor as string;
  const lineWidth = styles.lineWidth as number;
  const gap = styles.gap as number;

  const [hover, setHover] = useState(false);

  const sample = active
    ? { title: 'v0.7.0', meta: 'Today at 14:32 · Sarah Chen', count: '7n · 9t', badge: 'Live' }
    : { title: 'v0.6.2', meta: 'Yesterday at 09:15 · Marcus Rivera', count: '6n · 8t' };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        gap,
        width: 360,
        padding: 8,
        alignItems: 'stretch',
      }}
    >
      <div style={{ position: 'relative', width: dotSize, flexShrink: 0 }}>
        {/* Vertical line — segments above and below the dot */}
        <div style={{
          position: 'absolute',
          left: dotSize / 2 - lineWidth / 2,
          top: 0,
          height: 8,
          width: lineWidth,
          backgroundColor: lineColor,
        }} />
        <div style={{
          position: 'absolute',
          left: dotSize / 2 - lineWidth / 2,
          top: 8 + dotSize,
          bottom: 0,
          width: lineWidth,
          backgroundColor: lineColor,
        }} />
        {/* Dot */}
        <div style={{
          position: 'absolute',
          top: 8,
          left: 0,
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: dotColor,
          boxShadow: `0 0 0 2px ${styles.dotRingColor}`,
        }} />
      </div>
      <div style={{
        flex: 1,
        backgroundColor: styles.contentBg as string,
        border: `1px solid ${styles.contentBorderColor}`,
        borderRadius: styles.contentRadius as number,
        padding: `6px ${(styles.contentPadding as number) - 2}px`,
      }}>
        {/* Row 1: title + badge + count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{
            fontSize: styles.titleSize as number,
            color: styles.titleColor as string,
            fontWeight: 600,
            margin: 0,
            flex: '0 1 auto',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {sample.title}
          </p>
          {sample.badge && (
            <Tag type="accent" size="small">{sample.badge}</Tag>
          )}
          <span style={{
            marginLeft: 'auto',
            flexShrink: 0,
            fontSize: 10,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            color: 'var(--color-text-subtle)',
          }}>
            {sample.count}
          </span>
        </div>
        {/* Row 2: meta + actions */}
        <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <p style={{
            fontSize: styles.metaSize as number,
            color: styles.metaColor as string,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {sample.meta}
          </p>
          <div style={{
            display: 'flex',
            gap: 2,
            flexShrink: 0,
            opacity: hover ? 1 : 0,
            transition: 'opacity 0.12s',
          }}>
            {!active && (
              <button
                aria-label="Restore"
                title="Restore"
                style={{
                  width: 18,
                  height: 18,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-subtle)',
                  cursor: 'pointer',
                }}
              >
                <Icon glyph="refresh" size={11} />
              </button>
            )}
            <button
              aria-label="Delete"
              title="Delete"
              style={{
                width: 18,
                height: 18,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-subtle)',
                cursor: 'pointer',
              }}
            >
              <Icon glyph="trash" size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
