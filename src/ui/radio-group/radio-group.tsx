'use client';

import { useId } from 'react';

import { cn } from '@/helpers';
import { FieldError } from '@/ui/field-error';

import type { ChangeEvent, ReactNode } from 'react';

export type RadioGroupDirection = 'vertical' | 'horizontal';

export interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  direction?: RadioGroupDirection;
  className?: string;
  children: ReactNode;
  /**
   * When set to a non-empty string, marks the group invalid: `aria-invalid`
   * lands on the group and the message renders below in the error color. Per
   * the input family's small-control convention the circles AND the option
   * labels all stay neutral — the message is the sole signal. The
   * `.uxm-radio-group--error` class still rides on the root as a state hook.
   * Omit (or pass an empty string) for normal.
   */
  error?: string;
}

export function RadioGroup({
  direction = 'vertical',
  className,
  children,
  error,
}: RadioGroupProps) {
  const errorId = useId();
  return (
    <>
      <div
        role="radiogroup"
        className={cn(
          'uxm-radio-group',
          `uxm-radio-group--${direction}`,
          error && 'uxm-radio-group--error',
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        {children}
      </div>
      {error && (
        <FieldError id={errorId} className="uxm-radio-group__error-message">
          {error}
        </FieldError>
      )}
    </>
  );
}
// Static marker so FormField only forwards its `error` prop into children that
// accept one (avoids React unknown-prop warnings on non-input children).
RadioGroup.hasError = true;

export interface RadioOptionProps {
  name: string;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  className?: string;
}

export function RadioOption({
  name,
  value,
  checked,
  defaultChecked,
  disabled,
  onChange,
  children,
  className,
}: RadioOptionProps) {
  return (
    <label className={cn('uxm-radio', disabled && 'uxm-radio--disabled', className)}>
      <input
        type="radio"
        className="uxm-radio__input"
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => onChange?.(value, e)}
      />
      <span className="uxm-radio__circle" aria-hidden="true">
        <span className="uxm-radio__dot" />
      </span>
      {children && <span className="uxm-radio__label">{children}</span>}
    </label>
  );
}
