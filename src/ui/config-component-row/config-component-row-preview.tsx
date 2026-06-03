import type { PreviewProps } from '@/previews/types';
import { ConfigComponentRow } from '@/ui';
import { Icon } from '@/ui';
import { Tag } from '@/ui';

import type { CSSProperties } from 'react';

const rows: { name: string; type: string; required?: boolean; active?: boolean }[] = [
  { name: 'Account Name', type: 'TEXT', required: true, active: true },
  { name: 'Account Type', type: 'OPTIONS', required: true },
  { name: 'Primary Contact Email', type: 'EMAIL', required: true },
  { name: 'Billing Country', type: 'OPTIONS' },
];

export function ConfigComponentRowPreview({ styles }: PreviewProps) {
  const cssVars = {
    '--uxm-config-component-row-padding': `${styles.padding}px`,
    '--uxm-config-component-row-radius': `${styles.borderRadius}px`,
    '--uxm-config-component-row-icon-tile-size': `${styles.iconTileSize}px`,
    '--uxm-config-component-row-icon-tile-radius': `${styles.iconTileRadius}px`,
    '--uxm-config-component-row-name-size': `${styles.nameSize}px`,
    '--uxm-config-component-row-type-size': `${styles.typeSize}px`,
  } as CSSProperties;

  // Apply cssVars per-row (inline on each ConfigComponentRow), not on
  // the wrapper. Saved overrides on `.uxm-config-component-row` would
  // otherwise win over an ancestor-cascaded value — inline-on-element
  // wins over class-on-element, so the editor's slider drags flash
  // through even when overrides have been published.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 480 }}>
      {rows.map((r) => (
        <ConfigComponentRow
          key={r.name}
          style={cssVars}
          icon={<Icon glyph="grid" size={14} />}
          name={r.name}
          type={r.type}
          active={r.active}
          trailing={r.required ? <Tag type="accent">Required</Tag> : undefined}
        />
      ))}
    </div>
  );
}
