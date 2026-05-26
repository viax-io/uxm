import { cn } from '@/helpers';

import { Icon } from '../icon';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ExplorerSectionProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Section heading text. */
  children: ReactNode;
  /** Whether the section is currently expanded — controls chevron rotation. */
  open: boolean;
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
 * Renders as a `<button>` since clicking toggles the section. The
 * caller owns the open/close state and provides `onClick` — keeps the
 * atom controlled and testable, and lets the consumer persist state
 * (e.g. to localStorage) without the atom needing storage knowledge.
 *
 * Theming flows through the `explorer-section` registry. The chevron
 * size/colour, label colour, hover bg, and trailing styling are all
 * separately editable.
 */
export function ExplorerSection({
  children,
  open,
  indicator,
  trailing,
  className,
  type = 'button',
  ...rest
}: ExplorerSectionProps) {
  return (
    <button
      type={type}
      aria-expanded={open}
      className={cn(
        'uxm-explorer-section',
        open && 'uxm-explorer-section--open',
        className,
      )}
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
