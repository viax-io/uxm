import type { PreviewProps } from '@/previews/types';
import { RangeBar, type RangeBarType } from '@/ui';

import type { CSSProperties } from 'react';

/**
 * A short ladder rather than one bar: the point of this atom is that several
 * intervals share a track geometry, and a single centred bar would show the
 * fill but not the thing it is for.
 */
const ROWS: { value: [number, number]; openEnd?: boolean }[] = [
  { value: [0, 20] },
  { value: [20, 55] },
  { value: [55, 80] },
  { value: [80, 100], openEnd: true },
];

export function RangeBarPreview({ styles, variants }: PreviewProps) {
  const type = (variants.type as RangeBarType) ?? 'accent';
  const open = variants.open ?? 'end';

  // Every registry knob maps to a CSS custom property — the same surface a
  // production consumer re-themes through, so what the editor saves is what
  // ships.
  const cssVars = {
    '--uxm-range-bar-height': `${styles.height}px`,
    '--uxm-range-bar-radius': `${styles.borderRadius}px`,
    '--uxm-range-bar-min-width': `${styles.minWidth}px`,
    '--uxm-range-bar-track-color': styles.trackColor as string,
    '--uxm-range-bar-fill-color': styles.fillColor as string,
  } as CSSProperties;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 280 }}>
      {ROWS.map((row, i) => (
        <RangeBar
          key={i}
          value={row.value}
          type={type}
          style={cssVars}
          // The open-ended variant applies to the last row only, which is where
          // an unbounded interval actually sits in a ladder.
          openEnd={row.openEnd && (open === 'end' || open === 'both')}
          openStart={i === 0 && (open === 'start' || open === 'both')}
        />
      ))}
    </div>
  );
}
