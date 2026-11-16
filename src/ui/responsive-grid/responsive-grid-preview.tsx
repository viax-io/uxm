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
  // An explicit width, not `100%`: the canvas centres its content in a
  // shrink-to-fit box, so a percentage resolves to the content's own width
  // (one 200px column in auto-fit), and a `columns` grid, a size container,
  // has none at all.
  if (mode !== 'auto') {
    const bento = mode === 'bento';
    return (
      <div style={{ width: 720, maxWidth: '100%' }}>
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
    <div style={{ width: 720, maxWidth: '100%' }}>
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
