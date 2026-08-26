import { cloneElement, isValidElement, useId } from 'react';

import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export type FormFieldLabelPosition = 'top' | 'side';

export type FormFieldLabelTint = 'default' | 'muted' | 'strong';

export type FormFieldLabelVariant = 'default' | 'overline';

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
   * Label colour emphasis (the tint). `"strong"` (default) keeps the
   * strong-text label; `"default"` uses normal text; `"muted"` dims it — for
   * detail panels where the label is secondary to the value. Applies to BOTH
   * label variants: the variant owns typography, the tint owns colour. Each
   * tint's colour is themable via `--uxm-form-field-label-tint-*`.
   */
  labelTint?: FormFieldLabelTint;
  /**
   * Label typography. `"default"` keeps the normal label; `"overline"` is the
   * small uppercase, letter-spaced "eyebrow" treatment for caps labels above
   * editable fields. Its defaults match `PropertyField`'s look but it has its
   * own `--uxm-form-field-overline-*` tokens (nothing shared). Typography
   * only — the colour comes from `labelTint`.
   */
  labelVariant?: FormFieldLabelVariant;
  /**
   * Associates the rendered `<label>` with the control via `htmlFor`.
   * Optional — when omitted and `children` is a single element, FormField
   * generates an id itself and injects it into the child automatically
   * (unless the child already declares its own `id`), so the label stays
   * accessible without any extra props in the common case.
   */
  htmlFor?: string;
  /**
   * The input control — typically `<TextInput />`, `<Textarea />`, `<Select />`,
   * `<ToggleSwitch />`, or any other UXM input. Anything ReactNode is accepted.
   */
  children: ReactNode;
}

/**
 * `FormField` — pairs a label with any UXM input. Sole owner of label
 * theming across the form family: edit FormField's per-tint label colours,
 * `labelSize` / `labelWeight`, or the `labelPosition` / `labelVariant` /
 * `labelTint` variants in the workbench
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
  labelTint = 'strong',
  labelVariant = 'default',
  htmlFor,
  children,
  className,
  ...rest
}: FormFieldProps) {
  // Associate the label with the control so labeled inputs have an
  // accessible name. Prefer an explicit `htmlFor`; otherwise, when the
  // child is a single element, reuse its own `id` if it already declares
  // one, or generate one and inject it via `cloneElement`.
  const generatedId = useId();
  const childElement = isValidElement<{ id?: string; 'aria-describedby'?: string }>(children)
    ? children
    : null;
  const childId = childElement?.props.id;
  const controlId = htmlFor ?? childId ?? generatedId;
  // The hint explains the control, so point the control at it — a bare <span>
  // next to an input is invisible to assistive tech, which is how a hint like
  // "Default keeps each component's own weight" goes unread.
  const hintId = hint ? `${controlId}-hint` : undefined;
  // MERGE, never overwrite: a control may already describe itself (Select and
  // the input family wire their error message this way), and replacing that
  // would silence the error.
  const describedBy = [childElement?.props['aria-describedby'], hintId]
    .filter(Boolean)
    .join(' ') || undefined;
  const control = childElement
    ? cloneElement(childElement, {
        ...(childId ? {} : { id: controlId }),
        ...(describedBy ? { 'aria-describedby': describedBy } : {}),
      })
    : children;

  return (
    <div
      className={cn(
        'uxm-form-field',
        `uxm-form-field--${labelPosition}`,
        `uxm-form-field--label-${labelTint}`,
        labelVariant === 'overline' && 'uxm-form-field--label-overline',
        className,
      )}
      {...rest}
    >
      <label htmlFor={controlId} className="uxm-form-field__label">
        {label}
      </label>
      <div className="uxm-form-field__control">{control}</div>
      {hint && <span id={hintId} className="uxm-form-field__hint">{hint}</span>}
    </div>
  );
}
