import type { PreviewProps } from '@/previews/types';
import {
  LifecycleEdgeLabel,
  type LifecycleEdgeLabelVariant,
} from '@/ui';

import type { CSSProperties } from 'react';

const VARIANT_LABEL: Record<LifecycleEdgeLabelVariant, string> = {
  true: 'true',
  false: 'false',
  neutral: 'on approve',
  accent: 'Order lifecycle',
};

/**
 * The canvas, not the panel, is where these pills live: `neutral` is card-on-
 * card and `accent`'s fill shares a luminance with the surface, so both are
 * judged by their border. Previewing them on the flat panel background flatters
 * exactly the thing that is hard to get right, so the swatch carries the same
 * sunken dot-grid the diagram canvas uses.
 */
const CANVAS_STYLE: CSSProperties = {
  backgroundColor: 'var(--color-surface)',
  backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
  backgroundSize: '12px 12px',
  borderRadius: 8,
  display: 'inline-flex',
  padding: 24,
};

export function LifecycleEdgeLabelPreview({ styles, variants }: PreviewProps) {
  const variant = (variants.variant as LifecycleEdgeLabelVariant) ?? 'true';

  const cssVars = {
    '--uxm-lifecycle-edge-label-padding-x': `${styles.paddingX}px`,
    '--uxm-lifecycle-edge-label-padding-y': `${styles.paddingY}px`,
    '--uxm-lifecycle-edge-label-radius': `${styles.borderRadius}px`,
    '--uxm-lifecycle-edge-label-font-size': `${styles.fontSize}px`,
    '--uxm-lifecycle-edge-label-border-width': `${styles.borderWidth}px`,
    '--uxm-lifecycle-edge-label-font-weight': styles.fontWeight as string,
  } as CSSProperties;

  return (
    <div style={CANVAS_STYLE}>
      <LifecycleEdgeLabel variant={variant} style={cssVars}>
        {VARIANT_LABEL[variant]}
      </LifecycleEdgeLabel>
    </div>
  );
}
