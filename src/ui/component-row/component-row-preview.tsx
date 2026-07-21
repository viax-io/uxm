import type { PreviewProps } from '@/previews/types';
import { ComponentRow, Icon } from '@/ui';

import type { CSSProperties } from 'react';

/**
 * Preview renders the real shipped `<ComponentRow>` atom, projecting each
 * registry knob onto its `--uxm-component-row-*` custom property. Badge tints
 * come from the per-type visual dictionary at runtime in MODO; sample tints
 * are used here for the editor canvas.
 */
const ROWS = [
  {
    name: 'Practice Type',
    type: 'Predefined Options',
    glyph: 'list',
    chevron: true,
    iconBg: 'color-mix(in srgb, var(--color-highlight-cool) 20%, transparent)',
    iconColor: 'var(--color-on-highlight-cool)',
  },
  {
    name: 'Practice Name',
    type: 'Text',
    glyph: 'square',
    chevron: false,
    iconBg: 'color-mix(in srgb, var(--color-accent-light) 24%, transparent)',
    iconColor: 'var(--color-accent-bold)',
  },
  {
    name: 'Number of Operatories',
    type: 'Number',
    glyph: 'grid',
    chevron: false,
    iconBg: 'color-mix(in srgb, var(--color-highlight-warm) 28%, transparent)',
    iconColor: 'var(--color-on-highlight-warm)',
  },
];

export function ComponentRowPreview({ styles }: PreviewProps) {
  const vars = {
    '--uxm-component-row-padding-x': `${styles.paddingX}px`,
    '--uxm-component-row-padding-y': `${styles.paddingY}px`,
    '--uxm-component-row-gap': `${styles.gap}px`,
    '--uxm-component-row-drag-color': styles.dragColor,
    '--uxm-component-row-drag-hover-color': styles.dragHoverColor,
    '--uxm-component-row-icon-badge-size': `${styles.iconBadgeSize}px`,
    '--uxm-component-row-icon-badge-radius': `${styles.iconBadgeRadius}px`,
    '--uxm-component-row-icon-badge-padding': `${styles.iconBadgePadding}px`,
    '--uxm-component-row-name-color': styles.nameColor,
    '--uxm-component-row-name-size': `${styles.nameSize}px`,
    '--uxm-component-row-name-weight': styles.nameWeight,
    '--uxm-component-row-type-label-color': styles.typeLabelColor,
    '--uxm-component-row-type-label-size': `${styles.typeLabelSize}px`,
    '--uxm-component-row-type-label-weight': styles.typeLabelWeight,
    '--uxm-component-row-chevron-color': styles.chevronColor,
    '--uxm-component-row-chevron-size': `${styles.chevronSize}px`,
    '--uxm-component-row-row-hover-bg': styles.rowHoverBg,
    '--uxm-component-row-row-hover-radius': `${styles.rowHoverRadius}px`,
  } as CSSProperties;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 480 }}>
      {ROWS.map((r) => (
        <ComponentRow
          key={r.name}
          style={vars}
          icon={<Icon glyph={r.glyph} size={14} />}
          name={r.name}
          type={r.type}
          chevron={r.chevron}
          iconBg={r.iconBg}
          iconColor={r.iconColor}
          dragHandle
        />
      ))}
    </div>
  );
}
