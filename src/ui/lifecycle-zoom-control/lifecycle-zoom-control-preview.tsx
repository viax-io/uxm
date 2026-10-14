import { useState } from 'react';

import type { PreviewProps } from '@/previews/types';
import { LifecycleZoomControl } from '@/ui';
import { Icon } from '@/ui/icon';
import { IconButton } from '@/ui/icon-button';


import type { CSSProperties } from 'react';

/** Matches modo's canvas, which is where the editing shape came from. */
const PRESETS = [25, 50, 75, 100, 125, 150, 200];
const MIN = 25;
const MAX = 200;

export function LifecycleZoomControlPreview({ styles, variants }: PreviewProps) {
  // Each registry knob maps to a CSS custom property. The component reads
  // them all directly — no descendant-selector hacks, no inline color
  // overrides. Production consumers re-theme through the same surface.
  const cssVars = {
    '--uxm-lifecycle-zoom-radius': `${styles.borderRadius}px`,
    '--uxm-lifecycle-zoom-button-size': `${styles.buttonSize}px`,
    '--uxm-lifecycle-zoom-font-size': `${styles.fontSize}px`,
    '--uxm-lifecycle-zoom-divider-height': `${styles.dividerHeight}px`,
    '--uxm-lifecycle-zoom-bg': styles.backgroundColor as string,
    '--uxm-lifecycle-zoom-border-color': styles.borderColor as string,
    '--uxm-lifecycle-zoom-color': styles.color as string,
    '--uxm-lifecycle-zoom-icon-color': styles.iconColor as string,
  } as CSSProperties;

  // Live state, not a fixed number: the editing shape is a controlled field,
  // and a preview that could not actually commit a value would hide the one
  // behaviour worth looking at — a typed 9999 clamping back to 200.
  const [zoom, setZoom] = useState(100);
  const [minimap, setMinimap] = useState(false);
  const clamp = (percent: number) => Math.round(Math.min(MAX, Math.max(MIN, percent)));

  if (variants.mode !== 'editing') {
    return <LifecycleZoomControl value={100} style={cssVars} />;
  }

  return (
    <LifecycleZoomControl
      value={zoom}
      style={cssVars}
      onZoomOut={() => setZoom((z) => clamp(z - 10))}
      onZoomIn={() => setZoom((z) => clamp(z + 10))}
      onValueChange={(percent) => setZoom(clamp(percent))}
      presets={PRESETS}
      onFit={() => setZoom(100)}
      trailing={
        <IconButton
          aria-label={minimap ? 'Hide minimap' : 'Show minimap'}
          aria-pressed={minimap}
          onClick={() => setMinimap((open) => !open)}
        >
          <Icon glyph="dock-bottom" size={15} />
        </IconButton>
      }
    />
  );
}
