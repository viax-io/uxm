"use client";

import { useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface ViewSwitcherOption {
  value: string;
  icon: ReactNode;
  label: string;
}

export interface ViewSwitcherProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: ViewSwitcherOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function ViewSwitcher({
  options,
  value,
  defaultValue,
  onChange,
  className,
  ...rest
}: ViewSwitcherProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue ?? options[0]?.value ?? "");
  const active = isControlled ? value : internal;

  const select = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div role="group" className={cn("uxm-view-switcher", className)} {...rest}>
      {options.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isActive}
            aria-label={opt.label}
            className={cn(
              "uxm-view-switcher__button",
              isActive && "uxm-view-switcher__button--active",
            )}
            onClick={() => select(opt.value)}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}
