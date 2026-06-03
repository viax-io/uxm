import type { PreviewProps } from '@/previews/types';
import { ResponsiveGrid } from '@/ui';

/**
 * Drops 6 placeholder cards into a ResponsiveGrid sized to the canvas.
 * Resizing the Properties pane (which narrows/widens the canvas) shows
 * the grid wrapping in real time — the whole point of `auto-fit`.
 */
export function ResponsiveGridPreview({ styles }: PreviewProps) {
  const min = (styles.min as string) ?? '200px';
  const gap = styles.gap as number;
  // Wrap to 100% width so the grid sees the canvas width as its container,
  // not its own intrinsic content width. Without this the auto-fit
  // collapses to one column at any viewport because the grid is
  // shrink-wrapped to its children.
  return (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <ResponsiveGrid min={min} gap={gap}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              padding: 16,
              minHeight: 80,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              color: 'var(--color-text-muted)',
            }}
          >
            Item {i + 1}
          </div>
        ))}
      </ResponsiveGrid>
    </div>
  );
}
