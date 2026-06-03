import type { PreviewProps } from '@/previews/types';
import { LifecycleZoomControl } from '@/ui';

import type { CSSProperties } from 'react';

export function LifecycleZoomControlPreview({ styles }: PreviewProps) {
  // Each registry knob maps to a CSS custom property. The component reads
  // them all directly — no descendant-selector hacks, no inline color
  // overrides. Production consumers re-theme through the same surface.
  const cssVars = {
    '--uxm-lifecycle-zoom-radius': `${styles.borderRadius}px`,
    '--uxm-lifecycle-zoom-button-size': `${styles.buttonSize}px`,
    '--uxm-lifecycle-zoom-font-size': `${styles.fontSize}px`,
    '--uxm-lifecycle-zoom-bg': styles.backgroundColor as string,
    '--uxm-lifecycle-zoom-border-color': styles.borderColor as string,
    '--uxm-lifecycle-zoom-color': styles.color as string,
    '--uxm-lifecycle-zoom-icon-color': styles.iconColor as string,
  } as CSSProperties;

  return <LifecycleZoomControl value={100} style={cssVars} />;
}
