'use client';

import { useState } from 'react';

import { cn } from '@/helpers';

import type { HTMLAttributes } from 'react';

export interface FilterTabsOption {
  value: string;
  label: string;
  /** Disabled tabs are inert and paint the disabled styling (opacity +
   *  disabled text color). Selecting one is a no-op. */
  disabled?: boolean;
}

export interface FilterTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
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
  const [internal, setInternal] = useState<string>(defaultValue ?? options[0]?.value ?? '');
  const active = isControlled ? value : internal;

  const select = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div role="tablist" className={cn('uxm-filter-tabs', className)} {...rest}>
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
              'uxm-filter-tabs__tab',
              isActive && 'uxm-filter-tabs__tab--active',
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
