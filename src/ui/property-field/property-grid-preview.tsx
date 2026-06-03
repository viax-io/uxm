import type { PreviewProps } from '@/previews/types';
import { PropertyField, PropertyGrid } from '@/ui';

import type { CSSProperties } from 'react';

const FIELDS = [
  { label: 'ID', value: 'BI-2026-001' },
  { label: 'Version', value: 'v1.4.2' },
  { label: 'Owner', value: 'emily.zhao' },
  { label: 'Updated', value: '2h ago' },
];

/**
 * PropertyGrid wraps multiple PropertyFields in an auto-fill grid.
 * The grid owns row/column spacing only; field-shape knobs (label/
 * value colour and size) flow through PropertyField's own registry
 * and update independently — atomic-design composition.
 */
export function PropertyGridPreview({ styles }: PreviewProps) {
  const cssVars = {
    '--uxm-property-grid-row-gap': `${styles.rowGap}px`,
    '--uxm-property-grid-column-gap': `${styles.columnGap}px`,
  } as CSSProperties;

  return (
    <PropertyGrid style={cssVars}>
      {FIELDS.map((f) => (
        <PropertyField key={f.label} label={f.label}>
          {f.value}
        </PropertyField>
      ))}
    </PropertyGrid>
  );
}
