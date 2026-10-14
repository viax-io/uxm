import type { PreviewProps } from '@/previews/types';
import { RangeBar, type RangeBarType } from '@/ui';

import type { CSSProperties } from 'react';

/**
 * A short ladder rather than one bar: the point of this atom is that several
 * intervals share a track geometry, and a single centred bar would show the
 * fill but not the thing it is for.
 */
const ROWS: [number, number][] = [
  [0, 20],
  [20, 55],
  [55, 80],
  [80, 100],
];
/**
 * The row the Open Ends picker acts on. A middle one, so both fades are visible
 * at once — an open start on a bar already sitting at 0 shows nothing.
 */
const DEMO_ROW = 1;

export function RangeBarPreview({ styles, variants }: PreviewProps) {
  const type = (variants.type as RangeBarType) ?? 'accent';
  const open = variants.open ?? 'end';

  // Every registry knob maps to a CSS custom property — the same surface a
  // production consumer re-themes through. Note the preview feeds these vars
  // DIRECTLY, so it cannot tell you whether a save publishes them correctly;
  // that is what the generate-css mapping and its test are for.
  const cssVars = {
    '--uxm-range-bar-height': `${styles.height}px`,
    '--uxm-range-bar-radius': `${styles.borderRadius}px`,
    '--uxm-range-bar-min-width': `${styles.minWidth}px`,
    '--uxm-range-bar-track-color': styles.trackColor as string,
    '--uxm-range-bar-fill-color': styles.fillColor as string,
  } as CSSProperties;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 280 }}>
      {ROWS.map((value, i) => (
        <RangeBar
          key={i}
          value={value}
          type={type}
          style={cssVars}
          // The picker drives one row, so each option looks different from the
          // others — `both` included, whose combined gradient has a selector of
          // its own and would otherwise never be seen.
          openStart={i === DEMO_ROW && (open === 'start' || open === 'both')}
          openEnd={i === DEMO_ROW && (open === 'end' || open === 'both')}
        />
      ))}
    </div>
  );
}
