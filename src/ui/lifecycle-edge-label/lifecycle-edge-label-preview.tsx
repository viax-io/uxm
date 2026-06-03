import type { PreviewProps } from '@/previews/types';
import {
  LifecycleEdgeLabel,
  type LifecycleEdgeLabelVariant,
} from '@/ui';

import type { CSSProperties } from 'react';

const VARIANT_LABEL: Record<LifecycleEdgeLabelVariant, string> = {
  true: 'true',
  false: 'false',
  neutral: 'on approve',
};

export function LifecycleEdgeLabelPreview({ styles, variants }: PreviewProps) {
  const variant = (variants.variant as LifecycleEdgeLabelVariant) ?? 'true';

  const cssVars = {
    '--uxm-lifecycle-edge-label-padding-x': `${styles.paddingX}px`,
    '--uxm-lifecycle-edge-label-padding-y': `${styles.paddingY}px`,
    '--uxm-lifecycle-edge-label-radius': `${styles.borderRadius}px`,
    '--uxm-lifecycle-edge-label-font-size': `${styles.fontSize}px`,
    borderWidth: styles.borderWidth as number,
    fontWeight: styles.fontWeight as string,
  } as CSSProperties;

  return (
    <LifecycleEdgeLabel variant={variant} style={cssVars}>
      {VARIANT_LABEL[variant]}
    </LifecycleEdgeLabel>
  );
}
