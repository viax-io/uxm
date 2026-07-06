import { useId, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';

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
  id,
  ...rest
}: DisclosureProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  // Disclosure is header-only — the collapsible body lives outside this
  // component, owned by the consumer. We can't set an id on an element we
  // don't render, so we generate a stable `-panel` id (derived from a
  // caller-supplied `id` when present, otherwise from `useId`) and expose
  // it via `aria-controls` per WAI-ARIA's disclosure pattern (§F2). Give
  // your rendered body the matching `id` to complete the wiring.
  const generatedId = useId();
  const panelId = `${id ?? generatedId}-panel`;

  return (
    <button
      type={type}
      id={id}
      className={cn('uxm-disclosure', open && 'uxm-disclosure--open', className)}
      aria-expanded={open}
      aria-controls={panelId}
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
