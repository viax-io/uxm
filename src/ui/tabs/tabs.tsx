"use client";

import { useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface TabsOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: TabsOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function Tabs({
  options,
  value,
  defaultValue,
  onChange,
  className,
  ...rest
}: TabsProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue ?? options[0]?.value ?? "");
  const active = isControlled ? value : internal;

  const select = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div role="tablist" className={cn("uxm-tabs", className)} {...rest}>
      {options.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn("uxm-tabs__tab", isActive && "uxm-tabs__tab--active")}
            onClick={() => select(opt.value)}
          >
            {opt.icon && <span className="uxm-tabs__icon">{opt.icon}</span>}
            <span className="uxm-tabs__label">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
