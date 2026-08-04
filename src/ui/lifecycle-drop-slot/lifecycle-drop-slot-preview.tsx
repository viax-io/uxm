import type { PreviewProps } from '@/previews/types';
import { LifecycleDropSlot, type LifecycleDropSlotShape } from '@/ui';

import type { CSSProperties } from 'react';

// A card slot takes its width from the canvas, like every other lifecycle atom;
// the preview stands in for that canvas at the width a real member would have.
// A pill sizes itself from its label, so only the card needs this.
const CARD_WIDTH = 200;

export function LifecycleDropSlotPreview({ styles, variants }: PreviewProps) {
  const shape = (variants.shape as LifecycleDropSlotShape) ?? 'card';

  // `interactive` is deliberately NOT projected and has no knob: it changes
  // hit-testing only, never paint, and the canvas has no drag to demonstrate it
  // with. The slot keeps the atom's inert default, which also stops it from
  // intercepting the canvas's own event capture.
  // Every registry knob maps to a CSS custom property — the same surface a
  // production consumer re-themes through, so what the editor saves is what
  // ships.
  const cssVars = {
    '--uxm-lifecycle-drop-slot-border-color': styles.borderColor as string,
    '--uxm-lifecycle-drop-slot-color': styles.color as string,
    '--uxm-lifecycle-drop-slot-bg': styles.bg as string,
    // Keyword, not a length — no `px` suffix.
    '--uxm-lifecycle-drop-slot-border-style': styles.borderStyle as string,
    '--uxm-lifecycle-drop-slot-border-width': `${styles.borderWidth}px`,
    '--uxm-lifecycle-drop-slot-card-radius': `${styles.cardRadius}px`,
    '--uxm-lifecycle-drop-slot-card-padding-x': `${styles.cardPaddingX}px`,
    '--uxm-lifecycle-drop-slot-card-font-size': `${styles.cardFontSize}px`,
    '--uxm-lifecycle-drop-slot-card-min-width': `${styles.cardMinWidth}px`,
    '--uxm-lifecycle-drop-slot-pill-radius': `${styles.pillRadius}px`,
    '--uxm-lifecycle-drop-slot-pill-padding-y': `${styles.pillPaddingY}px`,
    '--uxm-lifecycle-drop-slot-pill-padding-x': `${styles.pillPaddingX}px`,
    '--uxm-lifecycle-drop-slot-pill-font-size': `${styles.pillFontSize}px`,
  } as CSSProperties;

  // The selected shape, on the dot grid the studio canvas paints behind every
  // preview (`canvasBackground` defaults to on) — the fill is flat, so what the
  // grid shows is how much of the canvas a slot covers rather than tints. A card
  // carries the plus glyph (its empty state), a pill the label it always has in
  // production.
  return shape === 'pill' ? (
    <LifecycleDropSlot style={cssVars} shape="pill" label="New group" />
  ) : (
    <LifecycleDropSlot style={{ ...cssVars, width: `${CARD_WIDTH}px` }} />
  );
}
