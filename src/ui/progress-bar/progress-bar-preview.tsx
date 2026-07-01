
import type { PreviewProps } from '@/previews/types';
import { ProgressBar, type ProgressBarVariant } from '@/ui';

import type { CSSProperties } from 'react';

type Styles = PreviewProps['styles'];

// Map the registry knobs onto the atom's `--uxm-progress-bar-*` custom
// properties. `value` is NOT emitted here — it rides the component's `value`
// prop (set inline as the unitless `--uxm-progress-bar-value`), so the editor
// slider drives the live fill directly and the saved rule stays inert.
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-progress-bar-fill-color': styles.fillColor as string,
    '--uxm-progress-bar-track-color': styles.trackColor as string,
    '--uxm-progress-bar-bar-height': `${styles.barHeight}px`,
    '--uxm-progress-bar-bar-radius': `${styles.barRadius}px`,
    '--uxm-progress-bar-ring-size': `${styles.ringSize}px`,
    '--uxm-progress-bar-ring-thickness': `${styles.ringThickness}px`,
    '--uxm-progress-bar-value-color': styles.valueColor as string,
    '--uxm-progress-bar-value-size': `${styles.valueSize}px`,
    '--uxm-progress-bar-label-color': styles.labelColor as string,
    '--uxm-progress-bar-label-size': `${styles.labelSize}px`,
    '--uxm-progress-bar-stack-gap': `${styles.stackGap}px`,
  } as CSSProperties;
}

export function ProgressBarPreview({ styles, variants }: PreviewProps & { componentId: string }) {
  const variant = (variants.variant as ProgressBarVariant) ?? 'linear';
  const value = Math.max(0, Math.min(100, (styles.value as number) ?? 0));
  const label = ((styles.label as string) ?? '').trim() || undefined;

  return <ProgressBar variant={variant} value={value} label={label} style={buildVars(styles)} />;
}
