import type { PreviewProps } from '@/previews/types';
import { GridItem, ResponsiveGrid } from '@/ui';

import type { CSSProperties } from 'react';

const CELL: CSSProperties = {
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
};

/**
 * Drops placeholder cards into a ResponsiveGrid sized to the canvas: auto-fit
 * by default (resizing the Properties pane shows the wrapping), or one of the
 * `columns` modes — equal, weighted (2 : 1) or a bento with a spanning cell.
 */
export function ResponsiveGridPreview({ styles, variants }: PreviewProps) {
  const mode = (variants.columns as string) ?? 'auto';
  const min = (styles.min as string) ?? '200px';
  const gap = styles.gap as number;
  // Wrap to 100% width so the grid sees the canvas width as its container,
  // not its own intrinsic content width. Without this the auto-fit
  // collapses to one column at any viewport because the grid is
  // shrink-wrapped to its children.
  if (mode !== 'auto') {
    const bento = mode === 'bento';
    return (
      <div style={{ width: '100%', maxWidth: 720 }}>
        <ResponsiveGrid columns={bento || mode === '3' ? 3 : mode} gap={gap}>
          {bento && (
            <GridItem span={2} rowSpan={2} style={{ ...CELL, minHeight: 176 }}>
              Item 1 · span 2 × 2
            </GridItem>
          )}
          {Array.from({ length: bento ? 5 : 6 }).map((_, i) => (
            <div key={i} style={CELL}>
              Item {bento ? i + 2 : i + 1}
            </div>
          ))}
        </ResponsiveGrid>
      </div>
    );
  }
  return (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <ResponsiveGrid min={min} gap={gap}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={CELL}>
            Item {i + 1}
          </div>
        ))}
      </ResponsiveGrid>
    </div>
  );
}
