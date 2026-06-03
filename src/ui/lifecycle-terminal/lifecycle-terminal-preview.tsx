import type { PreviewProps } from '@/previews/types';
import { LifecycleTerminal } from '@/ui';

import type { CSSProperties } from 'react';

export function LifecycleTerminalPreview({ styles, variants }: PreviewProps) {
  const label = (variants.label as string) ?? 'Start';
  // Every registry knob maps to a CSS custom property the component reads.
  // Same surface a production consumer would use — what the editor saves
  // is what ships.
  const cssVars = {
    '--uxm-lifecycle-terminal-width': `${styles.width}px`,
    '--uxm-lifecycle-terminal-height': `${styles.height}px`,
    '--uxm-lifecycle-terminal-radius': `${styles.borderRadius}px`,
    '--uxm-lifecycle-terminal-font-size': `${styles.fontSize}px`,
    '--uxm-lifecycle-terminal-font-weight': styles.fontWeight as string,
    '--uxm-lifecycle-terminal-bg': styles.backgroundColor as string,
    '--uxm-lifecycle-terminal-border-color': styles.borderColor as string,
    '--uxm-lifecycle-terminal-color': styles.color as string,
  } as CSSProperties;
  return <LifecycleTerminal label={label} style={cssVars} />;
}
