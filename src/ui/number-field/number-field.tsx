import type { CSSProperties } from "react";
import { cn } from "@/helpers";
import { Icon } from "../icon";

export interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Optional unit displayed as a small suffix (e.g. "px"). */
  unit?: string;
  /**
   * Show explicit `−` / `+` step buttons either side of the input.
   * Default `true` — the native browser spinner is always suppressed,
   * so set this to `false` only if you want a clean number input
   * with keyboard-arrow editing only.
   */
  withSteppers?: boolean;
  /**
   * Disables the input and both steppers. `aria-disabled` on the
   * wrapper drives the dimmed treatment across the whole field
   * (CSS reads the `disabled-*` vars + applies the disabled-opacity).
   */
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

/**
 * A themable numeric input with optional step buttons and unit suffix.
 * Suppresses the native browser spinner unconditionally; explicit
 * `−` / `+` buttons render via the `withSteppers` prop (default true).
 *
 * Bare control — no label. The editor's `NumberInput` knob wraps this
 * to add the label row.
 */
export function NumberField({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  withSteppers = true,
  disabled = false,
  className,
  style,
  "aria-label": ariaLabel,
}: NumberFieldProps) {
  const adjust = (delta: number) => {
    let next = value + delta;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    onChange(next);
  };

  return (
    <div
      className={cn("uxm-number-field", className)}
      style={style}
      {...(disabled ? { "aria-disabled": true as const } : {})}
    >
      {withSteppers && (
        <button
          type="button"
          onClick={() => adjust(-step)}
          disabled={disabled}
          className="uxm-number-field__stepper"
          aria-label="Decrement"
        >
          <Icon glyph="minus" size={12} strokeWidth={2} />
        </button>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-label={ariaLabel}
        className="uxm-number-field__input"
      />
      {withSteppers && (
        <button
          type="button"
          onClick={() => adjust(step)}
          disabled={disabled}
          className="uxm-number-field__stepper"
          aria-label="Increment"
        >
          <Icon glyph="plus" size={12} strokeWidth={2} />
        </button>
      )}
      {unit && <span className="uxm-number-field__unit">{unit}</span>}
    </div>
  );
}
