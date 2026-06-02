import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export type FormFieldLabelPosition = 'top' | 'side';

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** The field label (e.g. "Name", "Time zone"). */
  label: ReactNode;
  /** Optional helper text shown below the input. */
  hint?: ReactNode;
  /**
   * Where the label sits relative to the input. Defaults to "top".
   * - `"top"` — label above input (column stack)
   * - `"side"` — label left of input (grid: label column + input column);
   *   hint sits below the input, aligned with the input column.
   */
  labelPosition?: FormFieldLabelPosition;
  /**
   * The input control — typically `<TextInput />`, `<Textarea />`, `<Select />`,
   * `<ToggleSwitch />`, or any other UXM input. Anything ReactNode is accepted.
   */
  children: ReactNode;
}

/**
 * `FormField` — pairs a label with any UXM input. Sole owner of label
 * theming across the form family: edit FormField's `labelColor` /
 * `labelSize` / `labelWeight` / `labelPosition` knobs in the workbench
 * and the change propagates to every labeled field across the project.
 * Input atoms (TextInput, Textarea, Select, etc.) do NOT own labels —
 * wrap them in FormField when you want one.
 *
 * Distinct from `<PropertyField>`, which is for read-only metadata
 * (label + monospace value).
 *
 * Compose with any input:
 *   <FormField label="Name"><TextInput defaultValue="..." /></FormField>
 *   <FormField label="Email" labelPosition="side" hint="We'll never share">
 *     <TextInput type="email" />
 *   </FormField>
 */
export function FormField({
  label,
  hint,
  labelPosition = 'top',
  children,
  className,
  ...rest
}: FormFieldProps) {
  return (
    <div
      className={cn('uxm-form-field', `uxm-form-field--${labelPosition}`, className)}
      {...rest}
    >
      <span className="uxm-form-field__label">{label}</span>
      <div className="uxm-form-field__control">{children}</div>
      {hint && <span className="uxm-form-field__hint">{hint}</span>}
    </div>
  );
}
