import type { PreviewProps } from '@/previews/types';
import { LifecycleMinimap } from '@/ui';

import type { CSSProperties } from 'react';

// Illustrative layout (coords in 0–1 space). Same shape the minimap accepts
// at runtime, just hardcoded for the preview canvas.
const NODES = [
  { x: 0.5, y: 0.12, w: 0.18, h: 0.12 },
  { x: 0.5, y: 0.34, w: 0.3, h: 0.14 },
  { x: 0.5, y: 0.58, w: 0.3, h: 0.14 },
  { x: 0.2, y: 0.82, w: 0.3, h: 0.14 },
  { x: 0.8, y: 0.82, w: 0.3, h: 0.14 },
];
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [2, 4],
];

export function LifecycleMinimapPreview({ styles }: PreviewProps) {
  // Map every registry knob onto the component's CSS custom properties.
  // Both the preview and any production consumer re-theme through the same
  // surface — what the editor saves is what ships.
  const cssVars = {
    '--uxm-lifecycle-minimap-bg': styles.backgroundColor as string,
    '--uxm-lifecycle-minimap-border-color': styles.borderColor as string,
    '--uxm-lifecycle-minimap-node-color': styles.nodeColor as string,
    '--uxm-lifecycle-minimap-edge-color': styles.edgeColor as string,
    '--uxm-lifecycle-minimap-viewport-border': styles.viewportBorder as string,
    '--uxm-lifecycle-minimap-viewport-fill': styles.viewportFill as string,
    '--uxm-lifecycle-minimap-radius': `${styles.borderRadius}px`,
    '--uxm-lifecycle-minimap-width': `${styles.width}px`,
    '--uxm-lifecycle-minimap-height': `${styles.height}px`,
  } as CSSProperties;

  return (
    <LifecycleMinimap
      width={styles.width as number}
      height={styles.height as number}
      nodes={NODES}
      edges={EDGES}
      viewport={{ x: 0.22, y: 0.18, w: 0.55, h: 0.5 }}
      style={cssVars}
    />
  );
}
