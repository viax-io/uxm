import { cn } from '@/helpers';
import { FieldError } from '@/ui/field-error';

import type { ChangeEvent, CSSProperties, ReactNode } from 'react';

export interface ToggleSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  className?: string;
  name?: string;
  /** Accessible name for the switch when no visible `children` label is given. */
  'aria-label'?: string;
  /** Inline style on the wrapping label — used to project `--uxm-toggle-switch-*` overrides. */
  style?: CSSProperties;
  /**
   * When set to a non-empty string, marks the control invalid: `aria-invalid`
   * lands on the `<input>` and the message renders below in the error color.
   * Per the input family's small-control convention the track AND the label
   * both stay neutral — the message is the sole signal. The
   * `.uxm-toggle-switch--error` class still rides on the root as a state
   * hook. Omit (or pass an empty string) for normal.
   */
  error?: string;
}

export function ToggleSwitch({
  checked,
  defaultChecked,
  disabled,
  onChange,
  children,
  className,
  name,
  style,
  error,
  'aria-label': ariaLabel,
}: ToggleSwitchProps) {
  return (
    <>
      <label
        className={cn(
          'uxm-toggle-switch',
          disabled && 'uxm-toggle-switch--disabled',
          error && 'uxm-toggle-switch--error',
          className,
        )}
        style={style}
      >
        <input
          type="checkbox"
          role="switch"
          className="uxm-toggle-switch__input"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          name={name}
          aria-label={ariaLabel}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onChange?.(e.target.checked, e)}
        />
        <span className="uxm-toggle-switch__track" aria-hidden="true">
          <span className="uxm-toggle-switch__thumb" />
        </span>
        {children && <span className="uxm-toggle-switch__label">{children}</span>}
      </label>
      {error && <FieldError className="uxm-toggle-switch__error-message">{error}</FieldError>}
    </>
  );
}
// Static marker so FormField only forwards its `error` prop into children that
// accept one (avoids React unknown-prop warnings on non-input children).
ToggleSwitch.hasError = true;
