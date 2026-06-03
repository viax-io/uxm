import type { PreviewProps } from '@/previews/types';
import { ConfigSegmentItem } from '@/ui';

import type { CSSProperties } from 'react';

const segments: { name: string; meta: string; active?: boolean }[] = [
  { name: 'Account Profile', meta: '4 components', active: true },
  { name: 'Plan & Billing', meta: '4 components' },
  { name: 'Add-ons', meta: '3 components' },
];

export function ConfigSegmentItemPreview({ styles }: PreviewProps) {
  // Project the editor's style knobs onto the CSS custom properties the
  // component reads. Both forms have sensible fallbacks in styles.css.
  const cssVars = {
    '--uxm-config-segment-item-padding-x': `${styles.paddingX}px`,
    '--uxm-config-segment-item-padding-y': `${styles.paddingY}px`,
    '--uxm-config-segment-item-radius': `${styles.borderRadius}px`,
    '--uxm-config-segment-item-name-size': `${styles.nameSize}px`,
    '--uxm-config-segment-item-meta-size': `${styles.metaSize}px`,
  } as CSSProperties;

  // Apply cssVars per-item (inline on each ConfigSegmentItem). A
  // wrapper-level projection would lose to saved overrides on
  // `.uxm-config-segment-item` — inline-on-element wins over class-on-
  // element for custom properties, so live slider drags flash through
  // even with published overrides in place.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 240 }}>
      {segments.map((s) => (
        <ConfigSegmentItem
          key={s.name}
          style={cssVars}
          name={s.name}
          meta={s.meta}
          active={s.active}
        />
      ))}
    </div>
  );
}
