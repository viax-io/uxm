'use client';

import { cn } from '@/helpers';

import type { ChangeEvent, CSSProperties, ReactNode } from 'react';

export interface ToggleSwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  className?: string;
  name?: string;
  /** Inline style on the wrapping label — used to project `--uxm-toggle-switch-*` overrides. */
  style?: CSSProperties;
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
}: ToggleSwitchProps) {
  return (
    <label
      className={cn('uxm-toggle-switch', disabled && 'uxm-toggle-switch--disabled', className)}
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
        onChange={(e) => onChange?.(e.target.checked, e)}
      />
      <span className="uxm-toggle-switch__track" aria-hidden="true">
        <span className="uxm-toggle-switch__thumb" />
      </span>
      {children && <span className="uxm-toggle-switch__label">{children}</span>}
    </label>
  );
}
