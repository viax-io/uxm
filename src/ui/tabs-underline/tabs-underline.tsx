"use client";

import { useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/helpers";

export interface TabsUnderlineOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Disabled tabs are inert and paint the disabled styling (opacity +
   *  disabled text color). Selecting one is a no-op. */
  disabled?: boolean;
}

export interface TabsUnderlineProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: TabsUnderlineOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function TabsUnderline({
  options,
  value,
  defaultValue,
  onChange,
  className,
  ...rest
}: TabsUnderlineProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue ?? options[0]?.value ?? "");
  const active = isControlled ? value : internal;

  const select = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div role="tablist" className={cn("uxm-tabs-underline", className)} {...rest}>
      {options.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={opt.disabled}
            className={cn(
              "uxm-tabs-underline__tab",
              isActive && "uxm-tabs-underline__tab--active",
            )}
            onClick={() => select(opt.value)}
          >
            {opt.icon && <span className="uxm-tabs-underline__icon">{opt.icon}</span>}
            <span className="uxm-tabs-underline__label">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
