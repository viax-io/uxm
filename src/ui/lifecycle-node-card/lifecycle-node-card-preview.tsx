import type { PreviewProps } from '@/previews/types';
import {
  Icon,
  IconButton,
  LifecycleNodeCard,
  type LifecycleNodeKind,
} from '@/ui';

import type { CSSProperties } from 'react';

const SAMPLE: Record<LifecycleNodeKind, { title: string; badge?: string }> = {
  state: { title: 'In Cart', badge: '2' },
  condition: { title: 'Validate Price', badge: '$data.price > 100' },
  task: { title: 'Send Notification' },
  // A BI is an object, so the sample is an entity name rather than a step —
  // and a generic one: this preview ships and renders in every consumer's
  // studio, so a tenant or vendor name has no business in it.
  interaction: { title: 'SalesOrder' },
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
    '--uxm-lifecycle-node-card-target-color': styles.targetColor as string,
    '--uxm-lifecycle-node-card-target-width': `${styles.targetWidth}px`,
    '--uxm-lifecycle-node-card-target-offset': `${styles.targetOffset}px`,
    '--uxm-lifecycle-node-card-actions-offset': `${styles.actionsOffset}px`,
    '--uxm-lifecycle-node-card-actions-gap': `${styles.actionsGap}px`,
  } as CSSProperties;

  const state = (variants.state as string) ?? 'default';
  const actionsMode = (variants.actions as string) ?? 'hidden';

  return (
    <LifecycleNodeCard
      kind={kind}
      title={sample.title}
      badge={sample.badge}
      active={state === 'active'}
      target={state === 'target'}
      // `hover` is the atom's own default; the canvas here has no pointer of
      // its own, so the Always option is what makes the slot inspectable in
      // the workbench — the hover path is exercised by really hovering the card.
      actionsVisible={actionsMode === 'always' ? 'always' : 'hover'}
      actions={
        actionsMode === 'hidden' ? undefined : (
          <>
            <IconButton variant="filled" aria-label="Edit node">
              <Icon glyph="pencil" />
            </IconButton>
            <IconButton variant="filled" aria-label="Delete node">
              <Icon glyph="trash" />
            </IconButton>
          </>
        )
      }
      style={cssVars}
    />
  );
}
