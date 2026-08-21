import type { PreviewProps } from '@/previews/types';
import { PropertyField } from '@/ui';

import type { CSSProperties } from 'react';

/**
 * Single PropertyField — clean isolation of label/value styling.
 * The grid layout that arranges multiple fields is a separate atom
 * (PropertyGrid, with its own preview).
 */
const MONO_STACK = 'ui-monospace, SFMono-Regular, Menlo, monospace';
// The body/brand typeface for the "proportional" preset. An explicit stack,
// NOT the keyword `inherit`: a CSS-wide keyword as a custom-property value makes
// the *property* inherit (a no-op here) rather than passing `inherit` through to
// font-family, so `var(--…-value-font, mono)` would just fall back to mono.
const BODY_STACK = 'var(--brand-font, var(--font-sans, sans-serif))';

export function PropertyFieldPreview({ styles, variants }: PreviewProps) {
  // Guided presets → the raw label-case / value-font vars. Uppercase carries
  // the 0.06em "eyebrow" tracking; sentence drops both. Monospace is today's
  // data look; proportional is the inherited body typeface for prose grids.
  const sentence = variants.labelCase === 'sentence';
  const proportional = variants.valueFont === 'proportional';
  const cssVars = {
    '--uxm-property-field-label-color': styles.labelColor as string,
    '--uxm-property-field-label-size': `${styles.labelSize}px`,
    '--uxm-property-field-label-transform': sentence ? 'none' : 'uppercase',
    '--uxm-property-field-label-tracking': sentence ? 'normal' : '0.06em',
    '--uxm-property-field-value-color': styles.valueColor as string,
    '--uxm-property-field-value-size': `${styles.valueSize}px`,
    '--uxm-property-field-value-font': proportional ? BODY_STACK : MONO_STACK,
    '--uxm-property-field-gap': `${styles.gap}px`,
  } as CSSProperties;

  // Sentence-case + proportional reads as a prose grid; uppercase + monospace
  // is the default data readout — swap the sample so each preset looks apt.
  const label = sentence ? 'Owner' : 'Version';
  const value = proportional ? 'Ada Lovelace' : 'v1.4.2';

  return (
    <div style={{ minWidth: 200 }}>
      <PropertyField style={cssVars} label={label}>{value}</PropertyField>
    </div>
  );
}
