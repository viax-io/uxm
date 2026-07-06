import { useState } from 'react';

import { cn } from '@/helpers';

import { useRovingTabIndex } from '../../hooks/use-roving-tab-index';

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

  // Roving tabindex: only the active tab is a Tab stop; ArrowLeft/Right +
  // Home/End move (and select) within the group, matching the ARIA tabs
  // pattern's "automatic activation" model — the same thing a click does.
  const activeIndex = Math.max(0, options.findIndex((opt) => opt.value === active));
  const { getItemRef, onItemKeyDown } = useRovingTabIndex({
    count: options.length,
    activeIndex,
    isDisabled: (i) => !!options[i]?.disabled,
    onNavigate: (i) => select(options[i].value),
  });

  return (
    <div role="tablist" className={cn('uxm-filter-tabs', className)} {...rest}>
      {options.map((opt, i) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            ref={getItemRef(i)}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={i === activeIndex ? 0 : -1}
            disabled={opt.disabled}
            className={cn(
              'uxm-filter-tabs__tab',
              isActive && 'uxm-filter-tabs__tab--active',
            )}
            onClick={() => select(opt.value)}
            onKeyDown={(e) => onItemKeyDown(e, i)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
