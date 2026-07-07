import { useId, useState } from 'react';

import { cn } from '@/helpers';

import { Icon } from '../icon';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ExplorerSectionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Section heading text. */
  children: ReactNode;
  /**
   * Whether the section is currently expanded — controls chevron rotation.
   * Omit for uncontrolled usage (pair with `defaultOpen`); pass it (with
   * `onOpenChange`) to fully control the open state, same as `Disclosure`.
   */
  open?: boolean;
  /** Initial open state for uncontrolled usage. Ignored when `open` is passed. Default `false`. */
  defaultOpen?: boolean;
  /** Fires with the next open state on every click (controlled or uncontrolled), before the native `onClick`. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Optional leading indicator slot — typically a category color dot, but
   * accepts any ReactNode (small icon, swatch, etc.).
   */
  indicator?: ReactNode;
  /**
   * Optional trailing content — typically a count or status, rendered
   * right-aligned with muted styling.
   */
  trailing?: ReactNode;
  /** Disabled sections render `disabled` natively on the button — CSS
   *  `:disabled` paints the dimmed treatment and clicks are blocked. */
  disabled?: boolean;
}

/**
 * Disclosure-style section header used to group rows in a navigation list
 * (e.g. component-explorer categories, file-tree folders). Renders a
 * chevron that rotates with `open`, an optional indicator slot, the
 * heading, and an optional trailing slot.
 *
 * Renders as a `<button>` since clicking toggles the section. Supports the
 * same controlled/uncontrolled `open`/`defaultOpen`/`onOpenChange` pair as
 * `Disclosure` — pass `open` (with `onOpenChange`) when the caller owns the
 * state (e.g. to persist it to localStorage), or omit `open` and let the
 * atom track it internally via `defaultOpen`. `onClick` still fires either
 * way for callers that only need the toggle notification.
 *
 * Theming flows through the `explorer-section` registry. The chevron
 * size/colour, label colour, hover bg, and trailing styling are all
 * separately editable.
 */
export function ExplorerSection({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  indicator,
  trailing,
  className,
  type = 'button',
  onClick,
  id,
  ...rest
}: ExplorerSectionProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  // ExplorerSection is header-only — the collapsible body (the grouped
  // rows) lives outside this component, owned by the consumer. We can't
  // set an id on an element we don't render, so we generate a stable
  // `-panel` id (derived from a caller-supplied `id` when present,
  // otherwise from `useId`) and expose it via `aria-controls` per
  // WAI-ARIA's disclosure pattern (§F2). Give your rendered body the
  // matching `id` to complete the wiring.
  const generatedId = useId();
  const panelId = `${id ?? generatedId}-panel`;

  return (
    <button
      type={type}
      id={id}
      aria-expanded={open}
      aria-controls={panelId}
      className={cn(
        'uxm-explorer-section',
        open && 'uxm-explorer-section--open',
        className,
      )}
      onClick={(e) => {
        const next = !open;
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
        onClick?.(e);
      }}
      {...rest}
    >
      <Icon
        glyph="chevron-down"
        size={12}
        strokeWidth={2.5}
        className="uxm-explorer-section__chevron"
        aria-hidden="true"
      />
      {indicator && (
        <span className="uxm-explorer-section__indicator" aria-hidden="true">
          {indicator}
        </span>
      )}
      <span className="uxm-explorer-section__label">{children}</span>
      {trailing && (
        <span className="uxm-explorer-section__trailing">{trailing}</span>
      )}
    </button>
  );
}
