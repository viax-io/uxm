"use client";

import { useState } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export interface FilterTabsOption {
  value: string;
  label: string;
}

export interface FilterTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: FilterTabsOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function FilterTabs({
  options,
  value,
  defaultValue,
  onChange,
  className,
  ...rest
}: FilterTabsProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue ?? options[0]?.value ?? "");
  const active = isControlled ? value : internal;

  const select = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div role="tablist" className={cn("uxm-filter-tabs", className)} {...rest}>
      {options.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={cn(
              "uxm-filter-tabs__tab",
              isActive && "uxm-filter-tabs__tab--active",
            )}
            onClick={() => select(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
