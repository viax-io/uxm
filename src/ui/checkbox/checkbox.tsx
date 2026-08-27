import { useId } from 'react';

import { cn, mergeDescribedBy } from '@/helpers';
import { FieldError } from '@/ui/field-error';
import { Icon } from '@/ui/icon';

import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'checked' | 'defaultChecked' | 'onChange' | 'type' | 'value'> {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  className?: string;
  name?: string;
  value?: string;
  /**
   * When set to a non-empty string, marks the control invalid: `aria-invalid`
   * lands on the `<input>` and the message renders below in the error color.
   * Per the input family's small-control convention the box AND the label
   * both stay neutral (the box is too small to read as an error, and a red
   * label would compete with the message) — the message is the sole signal.
   * The `.uxm-checkbox--error` class still rides on the root as a state hook.
   * Omit (or pass an empty string) for the normal state.
   */
  error?: string;
}

export function Checkbox({
  checked,
  defaultChecked,
  disabled,
  onChange,
  children,
  className,
  name,
  value,
  error,
  ...rest
}: CheckboxProps) {
  const errorId = useId();
  return (
    <>
      <label
        className={cn(
          'uxm-checkbox',
          disabled && 'uxm-checkbox--disabled',
          error && 'uxm-checkbox--error',
          className,
        )}
      >
        <input
          {...rest}
          type="checkbox"
          className="uxm-checkbox__input"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          name={name}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={mergeDescribedBy(rest['aria-describedby'], error ? errorId : undefined)}
          onChange={(e) => onChange?.(e.target.checked, e)}
        />
        <span className="uxm-checkbox__box" aria-hidden="true">
          {/* CSS rule `.uxm-checkbox__box > svg { width/height: 70% }`
              sizes the icon responsively to the box; the `size` prop on
              Icon is overridden by that CSS, so we don't pass one. */}
          <Icon glyph="check" strokeWidth={3} />
        </span>
        {children && <span className="uxm-checkbox__label">{children}</span>}
      </label>
      {error && (
        <FieldError id={errorId} className="uxm-checkbox__error-message">
          {error}
        </FieldError>
      )}
    </>
  );
}
// Static marker so FormField only forwards its `error` prop into children that
// accept one (avoids React unknown-prop warnings on non-input children).
Checkbox.hasError = true;
