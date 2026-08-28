import { useId } from 'react';

import { cn, mergeDescribedBy } from '@/helpers';

import { FieldError } from '../field-error';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';

import type { CSSProperties } from 'react';

export interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Optional unit displayed as a small suffix (e.g. "px"). */
  unit?: string;
  /**
   * Disables the input and both step buttons. `aria-disabled` on the
   * wrapper drives the dimmed treatment across the whole field (CSS
   * reads the `disabled-*` vars + applies the disabled-opacity).
   */
  disabled?: boolean;
  /**
   * When set to a non-empty string, marks the field invalid: adds the
   * `--error` modifier to the wrapper (which paints the error-state
   * border + bg via the registry's error knobs), sets `aria-invalid`,
   * and renders the message below the field. Use for out-of-range
   * values typed past the buttons' clamp, server-side rejection, or any
   * custom validation that fails. The ± buttons stay visually unchanged
   * — error is the field's concern, not the affordance's. Omit (or pass
   * an empty string) for the normal state.
   */
  error?: string;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
  /**
   * Forwarded to the field wrapper (the inner `<input>` keeps the accessible name). `FormField` injects both — `id` for its
   * label association, `aria-describedby` for the hint — so wiring these
   * makes the atom hint-associable; the describedby is merged with the
   * atom's own error-message id, consumer ids first.
   */
  id?: string;
  'aria-describedby'?: string;

  /**
   * Accessible name for the − button. Default `"Decrement"`. The buttons
   * carry no visible text, so this label is the ONLY thing assistive tech
   * announces for them — it has to be translatable.
   */
  decrementLabel?: string;
  /** Accessible name for the + button. Default `"Increment"`. */
  incrementLabel?: string;
}

/**
 * A themable numeric input with explicit `−` / `+` step buttons and an
 * optional unit suffix. Suppresses the native browser spinner
 * unconditionally — the explicit buttons own the increment/decrement
 * affordance.
 *
 * The ± buttons compose the `IconButton` atom rather than rendering
 * bespoke `<button>` elements: visual treatment (bg, hover, active,
 * focus-ring, radius, size) flows from IconButton's own registry
 * knobs, so icon buttons look the same everywhere in the app. This
 * atom owns the semantic wiring — `onClick` handlers do the +/− math
 * and clamp to min/max; aria-labels identify the operation to AT.
 * IconButton has zero knowledge of numbers; NumberStepper has zero
 * knowledge of how a button looks.
 *
 * Bare control — no label. The editor's `NumberInput` knob wraps this
 * to add the label row.
 *
 * Sister atoms in the Inputs family:
 *   - `NumberInput`  — plain typing-only numeric field (no buttons).
 *                      Use when an unbounded value or a value the user
 *                      types directly (IDs, raw digits) doesn't benefit
 *                      from step affordances.
 *   - `CurrencyInput` — typing + locale formatting + currency picker.
 *                      Use for monetary values.
 */
export function NumberStepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  disabled = false,
  error,
  className,
  style,
  'aria-label': ariaLabel,
  id,
  'aria-describedby': describedBy,
  decrementLabel = 'Decrement',
  incrementLabel = 'Increment',
}: NumberStepperProps) {
  const errorId = useId();
  const adjust = (delta: number) => {
    let next = value + delta;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    onChange(next);
  };

  return (
    <>
      <div
        className={cn(
          'uxm-number-stepper',
          error && 'uxm-number-stepper--error',
          className,
        )}
        style={style}
        id={id}
        {...(disabled ? { 'aria-disabled': true as const } : {})}
        {...(error ? { 'aria-invalid': true as const } : {})}
        aria-describedby={mergeDescribedBy(describedBy, error ? errorId : undefined)}
      >
        <IconButton
          onClick={() => adjust(-step)}
          disabled={disabled}
          aria-label={decrementLabel}
        >
          <Icon glyph="minus" size={12} strokeWidth={2} />
        </IconButton>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-label={ariaLabel}
          className="uxm-number-stepper__input"
        />
        <IconButton
          onClick={() => adjust(step)}
          disabled={disabled}
          aria-label={incrementLabel}
        >
          <Icon glyph="plus" size={12} strokeWidth={2} />
        </IconButton>
        {unit && <span className="uxm-number-stepper__unit">{unit}</span>}
      </div>
      {error && (
        <FieldError id={errorId} className="uxm-number-stepper__error-message">
          {error}
        </FieldError>
      )}
    </>
  );
}
NumberStepper.hasError = true;
