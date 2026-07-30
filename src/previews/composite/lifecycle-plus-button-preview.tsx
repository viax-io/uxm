import type { PreviewProps } from '@/previews/types';
import { Icon, IconButton } from '@/ui';

import type { CSSProperties } from 'react';

export function LifecyclePlusButtonPreview({ styles }: PreviewProps) {
  // Compose the shipped IconButton atom instead of hand-rolling a <button>.
  // Every plus-button knob maps onto one of IconButton's --uxm-icon-button-*
  // custom properties; a 999px radius makes it the round canvas affordance,
  // and the resting shadow rides through IconButton's style pass-through.
  // (The old hand-rolled hover scale is dropped — IconButton owns its hover
  // surface, and re-theming flows through the same vars consumers use.)
  const cssVars = {
    '--uxm-icon-button-size': `${styles.size}px`,
    '--uxm-icon-button-icon-size': `${styles.iconSize}px`,
    '--uxm-icon-button-stroke-width': 2.5,
    '--uxm-icon-button-radius': '999px',
    '--uxm-icon-button-bg': styles.backgroundColor as string,
    '--uxm-icon-button-hover-bg': styles.hoverBackgroundColor as string,
    // Pressed keeps the darker hover fill instead of IconButton's default
    // surface-alt, so the accent FAB doesn't flash grey on mousedown.
    '--uxm-icon-button-active-bg': styles.hoverBackgroundColor as string,
    '--uxm-icon-button-color': styles.color as string,
    '--uxm-icon-button-hover-color': styles.color as string,
    '--uxm-icon-button-active-color': styles.color as string,
    boxShadow: 'var(--shadow-xs)',
  } as CSSProperties;

  return (
    <IconButton aria-label="Add step" style={cssVars}>
      <Icon glyph="plus" />
    </IconButton>
  );
}
