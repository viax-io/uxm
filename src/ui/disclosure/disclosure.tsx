'use client';

import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/helpers';

import { Icon } from '../icon';

export interface DisclosureProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  icon?: ReactNode;
  label: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Disabled disclosures render `disabled` natively on the button —
   *  CSS `:disabled` paints the dimmed treatment and clicks are
   *  blocked. `aria-disabled` selector also matches for symmetry with
   *  the rest of the family. */
  disabled?: boolean;
}

/**
 * Header-only collapsible row — icon + label + right chevron that rotates
 * 90° on open. No body slot: the consumer renders whatever content lives
 * beneath this row based on the open state. Pair with side-panel form
 * sections, settings rows that expand to reveal details, etc.
 */
export function Disclosure({
  icon,
  label,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  className,
  type = 'button',
  onClick,
  ...rest
}: DisclosureProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  return (
    <button
      type={type}
      className={cn('uxm-disclosure', open && 'uxm-disclosure--open', className)}
      aria-expanded={open}
      onClick={(e) => {
        const next = !open;
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
        onClick?.(e);
      }}
      {...rest}
    >
      {icon && <span className="uxm-disclosure__icon">{icon}</span>}
      <span className="uxm-disclosure__content">
        <span className="uxm-disclosure__label">{label}</span>
      </span>
      <Icon
        glyph="chevron-right"
        className="uxm-disclosure__chevron"
        size={16}
        aria-hidden="true"
      />
    </button>
  );
}
