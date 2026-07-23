import type { PreviewProps } from '@/previews/types';
import {
  FormField,
  type FormFieldLabelPosition,
  type FormFieldLabelTone,
  type FormFieldLabelVariant,
} from '@/ui';
import { TextInput } from '@/ui';

import type { CSSProperties } from 'react';

/**
 * The preview gives FormField a 480px-wide container so the demo
 * reflects realistic usage — FormField has no width of its own; the
 * inner input fills the available width via the grid's `1fr` column.
 * Bumping `sideLabelWidth` shrinks the input proportionally, matching
 * how FormField behaves when nested inside a real sidebar / modal /
 * card.
 */
export function FormFieldPreview({ styles, variants }: PreviewProps) {
  // Each registry knob → matching `--uxm-form-field-*` CSS variable.
  // The preview consumes the real component (with a TextInput inside)
  // rather than reimplementing the markup.
  const labelPosition = ((variants.labelPosition as string) ?? 'top') as FormFieldLabelPosition;
  const labelVariant = ((variants.labelVariant as string) ?? 'default') as FormFieldLabelVariant;
  const labelTone = ((variants.labelTone as string) ?? 'strong') as FormFieldLabelTone;
  const cssVars = {
    // Per-tint colours — each knob themes what its tint MEANS; the active
    // tint (a variant) picks which one the label reads.
    '--uxm-form-field-label-tint-strong': styles.tintStrongColor as string,
    '--uxm-form-field-label-tint-default': styles.tintDefaultColor as string,
    '--uxm-form-field-label-tint-muted': styles.tintMutedColor as string,
    '--uxm-form-field-label-size': `${styles.labelSize}px`,
    '--uxm-form-field-label-weight': styles.labelWeight as string,
    '--uxm-form-field-hint-color': styles.hintColor as string,
    '--uxm-form-field-hint-size': `${styles.hintSize}px`,
    '--uxm-form-field-gap': `${styles.gap}px`,
    '--uxm-form-field-side-gap': `${styles.sideGap ?? 16}px`,
    '--uxm-form-field-hint-gap': `${styles.hintGap}px`,
    '--uxm-form-field-side-label-width': `${styles.sideLabelWidth ?? 120}px`,
    '--uxm-form-field-side-label-align': (styles.sideLabelAlign as string) ?? 'start',
    // Overline variant's own typography knob (colour comes from the tint).
    '--uxm-form-field-overline-size': `${styles.overlineSize ?? 11}px`,
  } as CSSProperties;
  return (
    <div style={{ width: 480 }}>
      <FormField
        labelPosition={labelPosition}
        labelVariant={labelVariant}
        labelTone={labelTone}
        style={cssVars}
        label="Display name"
        hint="Shown to teammates in the sidebar and recent activity."
      >
        <TextInput defaultValue="Lucas Reyes" />
      </FormField>
    </div>
  );
}
