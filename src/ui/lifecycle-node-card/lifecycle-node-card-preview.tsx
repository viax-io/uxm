import type { PreviewProps } from '@/previews/types';
import {
  LifecycleNodeCard,
  type LifecycleNodeKind,
} from '@/ui';

import type { CSSProperties } from 'react';

const SAMPLE: Record<LifecycleNodeKind, { title: string; badge?: string }> = {
  state: { title: 'In Cart', badge: '2' },
  condition: { title: 'Validate Price', badge: '$data.price > 100' },
  task: { title: 'Send Notification' },
};

export function LifecycleNodeCardPreview({ styles, variants }: PreviewProps) {
  const kind = (variants.type as LifecycleNodeKind) ?? 'state';
  const sample = SAMPLE[kind];

  // Every registry knob maps to a CSS custom property — same surface a
  // production consumer would re-theme through, so what the editor saves
  // is what ships.
  const cssVars = {
    '--uxm-lifecycle-node-card-width': `${styles.width}px`,
    '--uxm-lifecycle-node-card-min-height': `${styles.minHeight}px`,
    '--uxm-lifecycle-node-card-padding-x': `${styles.paddingX}px`,
    '--uxm-lifecycle-node-card-padding-y': `${styles.paddingY}px`,
    '--uxm-lifecycle-node-card-radius': `${styles.borderRadius}px`,
    '--uxm-lifecycle-node-card-icon-size': `${styles.iconSize}px`,
    '--uxm-lifecycle-node-card-kind-size': `${styles.kindSize}px`,
    '--uxm-lifecycle-node-card-title-size': `${styles.titleSize}px`,
    '--uxm-lifecycle-node-card-bg': styles.backgroundColor as string,
    '--uxm-lifecycle-node-card-border-color': styles.borderColor as string,
  } as CSSProperties;

  return (
    <LifecycleNodeCard
      kind={kind}
      title={sample.title}
      badge={sample.badge}
      style={cssVars}
    />
  );
}
