"use client";

import type { ChangeEvent, ReactNode } from "react";
import { cn } from "./cn";

export type RadioGroupDirection = "vertical" | "horizontal";

export interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  direction?: RadioGroupDirection;
  className?: string;
  children: ReactNode;
}

export function RadioGroup({
  direction = "vertical",
  className,
  children,
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn("uxm-radio-group", `uxm-radio-group--${direction}`, className)}
    >
      {children}
    </div>
  );
}

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
    <label className={cn("uxm-radio", disabled && "uxm-radio--disabled", className)}>
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
