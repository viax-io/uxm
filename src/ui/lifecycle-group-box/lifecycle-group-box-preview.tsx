import type { PreviewProps } from '@/previews/types';
import { LifecycleGroupBox, LifecycleNodeCard } from '@/ui';

import type { CSSProperties } from 'react';

// Two members, because the box only makes sense as a frame around siblings —
// in isolation neither the frost nor the point of `pointer-events: none` can be
// judged. The studio canvas already paints the dot grid behind the preview
// (`canvasBackground` defaults to on), which is what the backdrop blur samples.
// Short titles so the members read at their preview width without ellipsing.
const MEMBERS = ['Fulfillment', 'Invoice'];

// Sizing is handed to the row rather than pinned per card, so the two members
// split the frame evenly whatever `GROUP_WIDTH` is.
const MEMBER_STYLE = {
  '--uxm-lifecycle-node-card-width': 'auto',
  flex: '1 1 0',
  minWidth: 0,
} as CSSProperties;

// Two 220px members plus the group padding and their gap — a DEFINITE width, not
// a fluid one, and that is a compromise worth knowing about.
//
// The studio wraps every preview in an event-capture div that is a flex item
// sized by its own content (no `min-w-0` / `w-full` on it), so a percentage or
// flexible width here has nothing definite to resolve against and collapses the
// row to the cards' text width — wrong at every canvas size. A definite width is
// right at the widths the studio actually runs at; below roughly a 500px canvas
// the frame overflows and the canvas scrolls to it, which is at least reachable.
// The fluid version becomes possible once that wrapper can shrink.
const GROUP_WIDTH = 496;

export function LifecycleGroupBoxPreview({ styles, variants }: PreviewProps) {
  const target = (variants.state ?? 'default') === 'target';

  // `interactive` is deliberately NOT projected: it changes only hit-testing,
  // never paint, so it has no knob (a variant that moves zero pixels reads as a
  // broken toggle in the panel). The preview keeps the atom's read-only default
  // so the frame can't intercept the members' own hover in the studio canvas.

  // Every registry knob maps to a CSS custom property — the same surface a
  // production consumer re-themes through, so what the editor saves is what
  // ships.
  const cssVars = {
    '--uxm-lifecycle-group-box-bg': styles.backgroundColor as string,
    '--uxm-lifecycle-group-box-border-color': styles.borderColor as string,
    '--uxm-lifecycle-group-box-border-width': `${styles.borderWidth}px`,
    '--uxm-lifecycle-group-box-radius': `${styles.borderRadius}px`,
    '--uxm-lifecycle-group-box-padding': `${styles.padding}px`,
    '--uxm-lifecycle-group-box-blur': `${styles.blur}px`,
    '--uxm-lifecycle-group-box-target-color': styles.targetColor as string,
    '--uxm-lifecycle-group-box-target-width': `${styles.targetWidth}px`,
    '--uxm-lifecycle-group-box-target-offset': `${styles.targetOffset}px`,
  } as CSSProperties;

  return (
    // The Padding knob is the group's single spacing number: the canvas insets
    // its members by it and derives the box rect from it. The preview stands in
    // for that canvas, so it reads the same value here.
    <div
      style={{
        boxSizing: 'border-box',
        padding: `${styles.padding}px`,
        position: 'relative',
        width: `${GROUP_WIDTH}px`,
      }}
    >
      <LifecycleGroupBox style={{ ...cssVars, inset: 0 }} target={target} />
      {/* Positioned, so DOM order decides the paint order against the
          absolutely-positioned frame — a static row would paint UNDER it and
          the members would show through the frost. On a real canvas the node
          cards are positioned for the same reason. */}
      <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
        {MEMBERS.map((title) => (
          <LifecycleNodeCard key={title} kind="state" title={title} style={MEMBER_STYLE} />
        ))}
      </div>
    </div>
  );
}
