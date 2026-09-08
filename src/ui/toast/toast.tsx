import { cn } from '../../helpers/cn';
import { Icon } from '../icon';

import type { ToastAction, ToastVariant } from '../../hooks/use-toast-store';
import type { HTMLAttributes } from 'react';

export type { ToastVariant };

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: ToastVariant;
  message: string;
  /**
   * Inline action affordance — single button rendered between the
   * message and the dismiss X. Styled as an underlined link in the
   * variant's accent color. Clicking fires `action.onClick` AND
   * dismisses the toast (so the consumer doesn't need to track
   * post-action state).
   */
  action?: ToastAction;
  /**
   * Renders a close affordance (X icon). Toasts are dismissable by
   * design — when called via the `toast.*` API, Toaster always wires
   * this up. Direct `<Toast>` consumers can opt out by omitting the
   * handler, but transient corner notifications should almost always
   * be dismissable.
   */
  onDismiss?: () => void;
  /** Accessible label for the close affordance. Default `"Dismiss"`. */
  dismissLabel?: string;
}

// Same glyph vocabulary as Banner for consistency — green check = success
// everywhere in the DS, info-circle = info, etc.
const VARIANT_GLYPH: Record<ToastVariant, string> = {
  success: 'check-circle',
  info: 'info',
  warning: 'exclamation-triangle',
  error: 'exclamation-circle',
};

/**
 * Toast — compact transient notification rendered inside `<Toaster />`
 * in a screen corner. Neutral surface (theme-aware: white card in
 * light, raised-dark in dark) with a colored left-edge accent + icon
 * communicating the variant. Optional inline action button between
 * the message and the dismiss X.
 *
 * Used internally by `Toaster` when consumers fire `toast.success("…")`.
 * Direct JSX use (`<Toast variant="success" message="…" />`) is supported
 * but rare — the imperative API is the primary entry point.
 */
export function Toast({
  variant = 'info',
  message,
  action,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  ...rest
}: ToastProps) {
  return (
    <div
      // role="status" + the Toaster's aria-live="polite" container
      // means screen readers announce each toast politely on arrival
      // without interrupting the current utterance. role="alert" would
      // be assertive — too disruptive for transient feedback.
      role="status"
      className={cn('uxm-toast', `uxm-toast--${variant}`, className)}
      {...rest}
    >
      <span className="uxm-toast__icon" aria-hidden="true">
        <Icon glyph={VARIANT_GLYPH[variant]} size={16} strokeWidth={1.8} />
      </span>
      <span className="uxm-toast__message">{message}</span>
      {action && (
        <button
          type="button"
          className="uxm-toast__action"
          onClick={() => {
            action.onClick();
            // Auto-dismiss on action click — user took the action, no
            // reason to keep the toast around. If the consumer wants
            // to keep showing something afterward they can fire a
            // new toast from their handler.
            onDismiss?.();
          }}
        >
          {action.label}
        </button>
      )}
      {onDismiss && (
        <button
          type="button"
          className="uxm-toast__close"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <Icon glyph="close" size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
