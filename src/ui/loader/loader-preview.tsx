import { useEffect, useState, useMemo } from 'react';

import type { PreviewProps } from '@/previews/types';

export function LoaderPreview({ styles, variants }: PreviewProps) {
  const size = styles.size as number;
  const color = styles.color as string;
  const trackColor = styles.trackColor as string;
  const speed = styles.speed as number;
  const barWidth = styles.barWidth as number;
  const messageRaw = styles.message as string;
  const messageInterval = styles.messageInterval as number;
  const messageSize = styles.messageSize as number;
  const messageColor = styles.messageColor as string;
  const gap = styles.gap as number;
  const variant = (variants.variant as string) ?? 'spinner';
  const layout = (variants.layout as string) ?? 'stacked';

  const inline = layout === 'inline';

  // Split on `|` for cycling messages. Empty / single message → no cycle.
  const messages = useMemo(
    () => messageRaw.split('|').map((s) => s.trim()).filter(Boolean),
    [messageRaw],
  );
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (messages.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % messages.length), messageInterval);
    return () => clearInterval(id);
  }, [messages, messageInterval]);

  const currentMessage = messages.length === 0 ? '' : messages[idx % messages.length];

  return (
    <div
      style={{
        display: 'inline-flex',
        // Inline layout: animation on the LEFT, message on the RIGHT.
        flexDirection: inline ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap,
        padding: 12,
      }}
    >
      <style>{`
        @keyframes uxm-loader-spin { to { transform: rotate(360deg); } }
        @keyframes uxm-loader-dot {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes uxm-loader-bar {
          0%   { transform: translateX(-60%); }
          100% { transform: translateX(220%); }
        }
        @keyframes uxm-loader-msg {
          0%   { opacity: 0; transform: translateY(4px); }
          12%  { opacity: 1; transform: translateY(0); }
          88%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }
      `}</style>

      {variant === 'spinner' && (
        // Border is fully decomposed into longhands rather than mixing
        // `border` shorthand with `borderTopColor`. React applies inline
        // styles property-by-property on re-render and a shorthand can
        // clobber a longhand set in the same object (or vice versa),
        // which is what the "conflicting property" warning catches.
        <div
          role="status"
          aria-label={currentMessage || 'Loading'}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            borderWidth: Math.max(2, Math.round(size / 10)),
            borderStyle: 'solid',
            borderTopColor: color,
            borderRightColor: trackColor,
            borderBottomColor: trackColor,
            borderLeftColor: trackColor,
            animation: `uxm-loader-spin ${speed}ms linear infinite`,
          }}
        />
      )}

      {variant === 'dots' && (
        <div role="status" aria-label={currentMessage || 'Loading'} style={{ display: 'inline-flex', gap: Math.max(4, Math.round(size / 4)) }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: Math.max(4, Math.round(size / 3)),
                height: Math.max(4, Math.round(size / 3)),
                borderRadius: '50%',
                backgroundColor: color,
                animation: `uxm-loader-dot ${speed * 1.6}ms ease-in-out ${i * (speed / 6)}ms infinite both`,
              }}
            />
          ))}
        </div>
      )}

      {variant === 'bar' && (
        <div
          role="status"
          aria-label={currentMessage || 'Loading'}
          style={{
            position: 'relative',
            width: barWidth,
            height: Math.max(3, Math.round(size / 5)),
            borderRadius: 999,
            backgroundColor: trackColor,
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '40%',
              borderRadius: 999,
              backgroundColor: color,
              animation: `uxm-loader-bar ${speed * 2}ms cubic-bezier(0.65, 0.05, 0.36, 1) infinite`,
            }}
          />
        </div>
      )}

      {currentMessage && (
        <span
          style={{
            fontSize: messageSize,
            color: messageColor,
            fontWeight: 500,
            display: 'inline-block',
            minHeight: messageSize * 1.2,
          }}
        >
          {messages.length > 1 ? (
            <span
              key={idx}
              style={{
                display: 'inline-block',
                animation: `uxm-loader-msg ${messageInterval}ms ease-in-out`,
              }}
            >
              {currentMessage}
            </span>
          ) : (
            currentMessage
          )}
        </span>
      )}
    </div>
  );
}
