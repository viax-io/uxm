import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';
import { IconTile } from '@/ui';

import type { CSSProperties } from 'react';

export function IconTilePreview({ styles }: PreviewProps) {
  // Every registry knob maps to a CSS custom property the component reads.
  const cssVars = {
    '--uxm-icon-tile-size': `${styles.size}px`,
    '--uxm-icon-tile-radius': `${styles.borderRadius}px`,
    '--uxm-icon-tile-bg': styles.iconBg as string,
    '--uxm-icon-tile-color': styles.iconColor as string,
  } as CSSProperties;
  return (
    <IconTile style={cssVars}>
      <Icon glyph="grid" size={styles.iconSize as number} />
    </IconTile>
  );
}
