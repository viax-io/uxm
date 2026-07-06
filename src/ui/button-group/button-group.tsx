import { useState } from 'react';

import { cn } from '@/helpers';

import type { HTMLAttributes } from 'react';

export interface ButtonGroupOption {
  value: string;
  label: string;
  /** Disabled items are inert and paint the disabled styling (opacity +
   *  disabled bg/text). Selecting one is a no-op. */
  disabled?: boolean;
}

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: ButtonGroupOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function ButtonGroup({
  options,
  value,
  defaultValue,
  onChange,
  className,
  ...rest
}: ButtonGroupProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue ?? options[0]?.value ?? '');
  const active = isControlled ? value : internal;

  const select = (next: string) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div role="group" className={cn('uxm-button-group', className)} {...rest}>
      {options.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isActive}
            disabled={opt.disabled}
            className={cn(
              'uxm-button-group__item',
              isActive && 'uxm-button-group__item--active',
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
