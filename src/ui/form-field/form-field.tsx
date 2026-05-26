import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** The field label (e.g. "Name", "Time zone"). */
  label: ReactNode;
  /** Optional helper text shown below the input. */
  hint?: ReactNode;
  /**
   * The input control — typically `<TextInput />`, `<Textarea />`, `<Select />`,
   * `<ToggleSwitch />`, or any other UXM input. Anything ReactNode is accepted.
   */
  children: ReactNode;
}

/**
 * `FormField` — a label-above-input layout used in settings panels and forms
 * where the field has an actual editable control. Distinct from
 * `<PropertyField>`, which is for read-only metadata (label + monospace
 * value). Promote-from-pattern molecule: this label/input stack was being
 * hand-rolled in the Configuration template's edit pane and previously
 * across other panels.
 *
 * Compose with any input:
 *   <FormField label="Name"><TextInput defaultValue="..." /></FormField>
 *   <FormField label="Email" hint="We'll never share this">
 *     <TextInput type="email" />
 *   </FormField>
 */
export function FormField({ label, hint, children, className, ...rest }: FormFieldProps) {
  return (
    <div className={cn('uxm-form-field', className)} {...rest}>
      <span className="uxm-form-field__label">{label}</span>
      <div className="uxm-form-field__control">{children}</div>
      {hint && <span className="uxm-form-field__hint">{hint}</span>}
    </div>
  );
}
