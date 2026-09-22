import { createContext, useContext, useId, useState } from 'react';

import { cn, mergeDescribedBy } from '@/helpers';
import { FieldError } from '@/ui/field-error';

import type { ChangeEvent, ReactNode } from 'react';

export type RadioGroupDirection = 'vertical' | 'horizontal';

/** Option presentation. See `RadioGroupProps.variant`. */
export type RadioGroupVariant = 'default' | 'card';

/** Where the radio dot goes in card mode. See `RadioGroupProps.indicator`. */
export type RadioGroupIndicator = 'hidden' | 'corner';

export interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  direction?: RadioGroupDirection;
  /**
   * Option presentation. `default` (unchanged) renders each option as a
   * `[circle] label` row. `card` renders each one as a selectable tile: the
   * option's `children` fill the card body and the selected state is an accent
   * frame around the whole tile — for a visual single-select (a layout picker,
   * plan tiers, theme swatches).
   *
   * The control stays a native radio group either way, so `role="radiogroup"`,
   * `aria-checked` and arrow-key selection are unaffected by this prop.
   */
  variant?: RadioGroupVariant;
  /**
   * Card mode only. `hidden` (default) drops the radio circle — the frame is
   * the affordance. `corner` keeps it, pinned to the tile's top-right, for
   * redundancy where a frame alone is too subtle.
   *
   * Ignored when `variant` is `default`.
   */
  indicator?: RadioGroupIndicator;
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
  // Presentation travels down the same channel as `name`/`value` so an option
  // never has to be told twice what group it is in.
  variant: RadioGroupVariant;
  indicator: RadioGroupIndicator;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function RadioGroup({
  name,
  value: controlledValue,
  defaultValue,
  onChange,
  direction = 'vertical',
  variant = 'default',
  indicator = 'hidden',
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
          variant === 'card' && 'uxm-radio-group--card',
          error && 'uxm-radio-group--error',
          className,
        )}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={mergeDescribedBy(describedBy, error ? errorId : undefined)}
      >
        <RadioGroupContext.Provider
          value={{ name, value, hasValue, onChange: handleChange, variant, indicator }}
        >
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

  const isCard = group?.variant === 'card';
  const indicator = group?.indicator ?? 'hidden';

  return (
    <label
      className={cn(
        'uxm-radio',
        isCard && 'uxm-radio--card',
        isCard && indicator === 'corner' && 'uxm-radio--indicator-corner',
        disabled && 'uxm-radio--disabled',
        className,
      )}
    >
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
      {/* The circle stays a SIBLING of the input in both presentations, even
          in card mode where it is pinned to a corner by CSS. Nesting it inside
          the card body would have put it out of reach of every existing
          `__input:checked + __circle` / hover / focus rule, which would then
          need a parallel card-mode copy — two sets of state rules to keep in
          step. Card mode only moves it, or hides it. */}
      <span className="uxm-radio__circle" aria-hidden="true">
        <span className="uxm-radio__dot" />
      </span>
      {isCard ? (
        // The tile itself. A general-sibling selector off the input paints its
        // selected frame, so it works for a controlled option and an
        // uncontrolled one alike — the DOM, not React, knows which is checked.
        <span className="uxm-radio__card">{children}</span>
      ) : (
        children && <span className="uxm-radio__label">{children}</span>
      )}
    </label>
  );
}
