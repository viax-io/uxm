import { createContext, useContext, useId, useState } from 'react';

import { cn, mergeDescribedBy } from '@/helpers';
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
  /**
   * Forwarded to the `role="radiogroup"` root. `FormField` injects both — `id` for its
   * label association, `aria-describedby` for the hint — so wiring these
   * makes the atom hint-associable; the describedby is merged with the
   * atom's own error-message id, consumer ids first.
   */
  id?: string;
  'aria-describedby'?: string;
}

// Carries the group-level `name` / selected `value` / change handler down to
// each `RadioOption` without forcing every consumer to repeat `name` and wire
// `checked`/`onChange` by hand on every option. `RadioOption` still accepts
// its own `name` / `checked` / `defaultChecked` / `onChange` so existing call
// sites that set those directly (bypassing the group) keep working unchanged.
//
// `hasValue` is fixed for the lifetime of the group (derived from whether
// `value`/`defaultValue` was passed at all, not from the current value) so a
// `RadioOption` that defers to the group never flips between an
// uncontrolled (`checked={undefined}`) and controlled (`checked={boolean}`)
// input across renders — that flip is what triggers React's "changing an
// uncontrolled input to be controlled" warning.
interface RadioGroupContextValue {
  name?: string;
  value?: string;
  hasValue: boolean;
  onChange: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function RadioGroup({
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  direction = 'vertical',
  className,
  children,
  error,
  id,
  'aria-describedby': describedBy,
}: RadioGroupProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  const hasValue = controlledValue !== undefined || defaultValue !== undefined;
  const errorId = useId();

  function handleChange(nextValue: string, e: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setUncontrolledValue(nextValue);
    onChange?.(nextValue, e);
  }

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
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={mergeDescribedBy(describedBy, error ? errorId : undefined)}
      >
        <RadioGroupContext.Provider value={{ name, value, hasValue, onChange: handleChange }}>
          {children}
        </RadioGroupContext.Provider>
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
  name?: string;
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
  const group = useContext(RadioGroupContext);
  const resolvedName = name ?? group?.name;
  // Only defer to the group's selected value when this option doesn't
  // already manage its own checked state (explicit `checked`/`defaultChecked`
  // always wins, matching the controlled/uncontrolled convention) AND the
  // group was actually given a `value`/`defaultValue` to manage — otherwise
  // `checked` stays `undefined` so the input remains a plain native
  // uncontrolled radio (as it always has been for consumers who only use
  // `RadioGroup` for the shared `name` + layout, not selection state).
  const resolvedChecked =
    checked !== undefined
      ? checked
      : defaultChecked !== undefined || !group?.hasValue
        ? undefined
        : group.value === value;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange?.(value, e);
    group?.onChange?.(value, e);
  }

  return (
    <label className={cn('uxm-radio', disabled && 'uxm-radio--disabled', className)}>
      <input
        type="radio"
        className="uxm-radio__input"
        name={resolvedName}
        value={value}
        checked={resolvedChecked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className="uxm-radio__circle" aria-hidden="true">
        <span className="uxm-radio__dot" />
      </span>
      {children && <span className="uxm-radio__label">{children}</span>}
    </label>
  );
}
