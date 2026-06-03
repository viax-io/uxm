import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { TypeOverviewCard } from '@/ui';

import type { CSSProperties } from 'react';

export function TypeOverviewCardPreview({ styles }: PreviewProps) {
  // All 14 registry knobs flow through `--uxm-typeoverview-*` CSS
  // variables — same surface a production consumer would re-theme through.
  const cssVars = {
    '--uxm-typeoverview-bg': styles.backgroundColor as string,
    '--uxm-typeoverview-border-color': styles.borderColor as string,
    '--uxm-typeoverview-radius': `${styles.borderRadius}px`,
    '--uxm-typeoverview-padding': `${styles.padding}px`,
    '--uxm-typeoverview-accent-color': styles.accentColor as string,
    '--uxm-typeoverview-accent-width': `${styles.accentWidth}px`,
    '--uxm-typeoverview-icon-bg': styles.iconBg as string,
    '--uxm-typeoverview-icon-color': styles.iconColor as string,
    '--uxm-typeoverview-icon-tile-size': `${styles.iconBoxSize}px`,
    '--uxm-typeoverview-icon-tile-radius': `${styles.iconRadius}px`,
    '--uxm-typeoverview-label-size': `${styles.labelSize}px`,
    '--uxm-typeoverview-label-color': styles.labelColor as string,
    '--uxm-typeoverview-value-size': `${styles.valueSize}px`,
    '--uxm-typeoverview-value-color': styles.valueColor as string,
    width: 240,
  } as CSSProperties;

  return (
    <TypeOverviewCard
      style={cssVars}
      icon={<Icon glyph="model-revenue-motion" size={16} />}
      label="Revenue Motions"
      value={5}
    />
  );
}
