import type { PreviewProps } from '@/previews/types';
import { MetaRow } from '@/ui';

import type { CSSProperties } from 'react';

export function MetaRowPreview({ styles }: PreviewProps) {
  const cssVars = {
    '--uxm-meta-row-font-size': `${styles.fontSize}px`,
    '--uxm-meta-row-color': styles.color as string,
    '--uxm-meta-row-gap': `${styles.gap}px`,
    '--uxm-meta-row-dot-size': `${styles.dotSize}px`,
    '--uxm-meta-row-dot-color': styles.dotColor as string,
  } as CSSProperties;
  return (
    <MetaRow style={cssVars}>
      <span>v1.2.0</span>
      <span>3 days ago</span>
      <span>Sarah Chen</span>
    </MetaRow>
  );
}
