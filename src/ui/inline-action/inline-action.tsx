import { cn } from '@/helpers';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface InlineActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional leading icon — typically a small SVG (12px-ish). */
  icon?: ReactNode;
  /** Action label. */
  children: ReactNode;
}

/**
 * Tertiary text-with-optional-icon button for dense UI — "Reset section,"
 * "Match in 4 other Inputs," "Edit," etc. Sized small by design (~10px),
 * muted by default with a hover transition to an accent colour. Use
 * where the action is contextual and shouldn't compete with primary
 * CTAs but still needs to be visibly tappable.
 *
 * Distinct from `BackLink` (breadcrumb navigation, larger and arrow-
 * led) and from `ButtonGhost` (regular button-shaped, padded). This
 * atom is meant to read as inline text first and a button second.
 */
export function InlineAction({
  icon,
  children,
  className,
  type = 'button',
  ...rest
}: InlineActionProps) {
  return (
    <button
      type={type}
      className={cn('uxm-inline-action', className)}
      {...rest}
    >
      {icon && (
        <span className="uxm-inline-action__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="uxm-inline-action__label">{children}</span>
    </button>
  );
}
