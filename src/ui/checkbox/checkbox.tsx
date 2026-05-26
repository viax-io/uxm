"use client";

import type { ChangeEvent, ReactNode } from "react";
import { cn } from "@/helpers";
import { Icon } from "@/ui/icon";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
  className?: string;
  name?: string;
  value?: string;
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
}: CheckboxProps) {
  return (
    <label className={cn("uxm-checkbox", disabled && "uxm-checkbox--disabled", className)}>
      <input
        type="checkbox"
        className="uxm-checkbox__input"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        name={name}
        value={value}
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
  );
}
