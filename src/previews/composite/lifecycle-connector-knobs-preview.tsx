import type { PreviewProps } from '@/previews/types';
import { Icon, IconButton } from '@/ui';

import type { CSSProperties } from 'react';

export function LifecycleConnectorKnobsPreview({ styles, variants }: PreviewProps) {
  const size = styles.size as number;
  const borderWidth = styles.borderWidth as number;
  const orientation = (variants.orientation as string) ?? 'horizontal';
  const isVertical = orientation === 'vertical';
  const iconSize = Math.round(size * 0.45);

  // Both affordances compose the shipped IconButton atom instead of
  // hand-rolling <button>s. Size / bg / icon colour ride IconButton's
  // --uxm-icon-button-* knobs; the per-knob circle border (IconButton has no
  // var for it) and resting shadow go through its style pass-through. Circular
  // via a 50% radius; hover styling is IconButton's, not hand-tracked state.
  const circle = (border: string, icon: string, stroke: number): CSSProperties =>
    ({
      '--uxm-icon-button-size': `${size}px`,
      '--uxm-icon-button-icon-size': `${iconSize}px`,
      '--uxm-icon-button-stroke-width': stroke,
      '--uxm-icon-button-bg': styles.backgroundColor as string,
      // hover/active bg fall back to IconButton's surface-alt so the circle
      // gives a real hover cue (the old scale/shadow lift is gone); only the
      // icon tint is pinned across states so it keeps its insert/edit colour.
      '--uxm-icon-button-color': icon,
      '--uxm-icon-button-hover-color': icon,
      '--uxm-icon-button-active-color': icon,
      borderRadius: '50%',
      border: `${borderWidth}px solid ${border}`,
      boxShadow: 'var(--shadow-xs)',
    }) as CSSProperties;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: isVertical ? 'column' : 'row',
        gap: styles.gap as number,
        padding: 12,
      }}
    >
      <IconButton
        aria-label="Insert"
        style={circle(styles.insertBorderColor as string, styles.insertIconColor as string, 2.5)}
      >
        <Icon glyph="plus" />
      </IconButton>
      <IconButton
        aria-label="Rename"
        style={circle(styles.editBorderColor as string, styles.editIconColor as string, 1.75)}
      >
        {/* Visual delta accepted: registry has only the outline `pencil`. */}
        <Icon glyph="pencil" />
      </IconButton>
    </div>
  );
}
