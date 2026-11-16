import type { PreviewProps } from '@/previews/types';
import { Stepper } from '@/ui';

import type { StepperStep } from './stepper';
import type { CSSProperties } from 'react';


/**
 * An order's lifecycle in the workbench: two steps done, the current one
 * ringed, two ahead, and (on the Skipped variant) one step skipped. Every knob
 * is projected as the var the stylesheet reads.
 */
export function StepperPreview({ styles, variants }: PreviewProps) {
  const withSkipped = (variants.skipped ?? 'off') === 'on';
  const steps: StepperStep[] = [
    { label: 'Quoted', state: 'done', meta: '12 Oct' },
    { label: 'Approved', state: 'done', meta: '14 Oct' },
    { label: 'Ordered', state: 'current', meta: 'Today' },
    { label: 'Credit check', state: withSkipped ? 'off' : 'ahead' },
    { label: 'Delivered', state: 'ahead' },
    { label: 'Invoiced', state: 'ahead' },
  ];
  const vars = {
    '--uxm-stepper-marker-size': `${styles.markerSize}px`,
    '--uxm-stepper-line-width': `${styles.lineWidth}px`,
    '--uxm-stepper-line-color': styles.lineColor as string,
    '--uxm-stepper-done-color': styles.doneColor as string,
    '--uxm-stepper-done-icon-color': styles.doneIconColor as string,
    '--uxm-stepper-current-color': styles.currentColor as string,
    '--uxm-stepper-current-ring': styles.currentRing as string,
    '--uxm-stepper-ahead-color': styles.aheadColor as string,
    '--uxm-stepper-marker-bg': styles.markerBg as string,
    '--uxm-stepper-label-color': styles.labelColor as string,
    '--uxm-stepper-muted-label-color': styles.mutedLabelColor as string,
    '--uxm-stepper-label-size': `${styles.labelSize}px`,
    '--uxm-stepper-meta-color': styles.metaColor as string,
    '--uxm-stepper-meta-size': `${styles.metaSize}px`,
    '--uxm-stepper-step-min-width': `${styles.stepMinWidth}px`,
    '--uxm-stepper-focus-ring': styles.focusRing as string,
    width: '100%',
    maxWidth: 720,
  } as CSSProperties;
  return <Stepper aria-label="Order progress" steps={steps} style={vars} tabIndex={-1} />;
}
