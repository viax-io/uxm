'use client';

import { useState } from 'react';

import { cn } from '@/helpers';

import { Icon } from '../icon';

import type { InputHTMLAttributes } from 'react';

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Render the trailing show/hide eye toggle. Defaults to true. Pass false
   * for a strict password field with no visibility affordance — used when
   * accessibility policy or kiosk-mode UX requires the value to stay masked.
   */
  toggle?: boolean;
  /** Initial visibility for uncontrolled toggle. */
  defaultVisible?: boolean;
  /**
   * Visibility (controlled). Pair with `onToggleVisible` to drive the eye
   * toggle externally (e.g. a form-level "show all" affordance toggling
   * many fields at once). If omitted, the component owns visibility state.
   */
  visible?: boolean;
  onToggleVisible?: (visible: boolean) => void;
}

export function PasswordInput({
  toggle = true,
  defaultVisible = false,
  visible,
  onToggleVisible,
  className,
  autoComplete = 'current-password',
  ...rest
}: PasswordInputProps) {
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const isControlled = visible !== undefined;
  const current = isControlled ? visible : internalVisible;

  const handleToggle = () => {
    const next = !current;
    if (!isControlled) setInternalVisible(next);
    onToggleVisible?.(next);
  };

  return (
    <div className={cn('uxm-password-input', className)}>
      <input
        type={current ? 'text' : 'password'}
        className="uxm-password-input__input"
        autoComplete={autoComplete}
        {...rest}
      />
      {toggle && (
        <button
          type="button"
          className="uxm-password-input__toggle"
          onClick={handleToggle}
          aria-label={current ? 'Hide password' : 'Show password'}
          aria-pressed={current}
        >
          <Icon glyph={current ? 'eye-slash' : 'eye'} />
        </button>
      )}
    </div>
  );
}
