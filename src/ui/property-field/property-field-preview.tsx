import type { PreviewProps } from '@/previews/types';
import { PropertyField } from '@/ui';

import type { CSSProperties } from 'react';

/**
 * Single PropertyField — clean isolation of label/value styling.
 * The grid layout that arranges multiple fields is a separate atom
 * (PropertyGrid, with its own preview).
 */
export function PropertyFieldPreview({ styles }: PreviewProps) {
  const cssVars = {
    '--uxm-property-field-label-color': styles.labelColor as string,
    '--uxm-property-field-label-size': `${styles.labelSize}px`,
    '--uxm-property-field-value-color': styles.valueColor as string,
    '--uxm-property-field-value-size': `${styles.valueSize}px`,
    '--uxm-property-field-gap': `${styles.gap}px`,
  } as CSSProperties;

  return (
    <div style={{ minWidth: 200 }}>
      <PropertyField style={cssVars} label="Version">v1.4.2</PropertyField>
    </div>
  );
}
