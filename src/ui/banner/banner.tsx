import { cn } from '@/helpers';

import { Icon } from '../icon';

import type { HTMLAttributes, ReactNode } from 'react';

export type BannerVariant = 'success' | 'info' | 'warning' | 'error';

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: BannerVariant;
  title?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  /**
   * When set, renders a close affordance (X icon, right-aligned) that
   * calls this handler. Banners are persistent by design — they stay
   * until the user dismisses, or until the consumer removes them from
   * state. They do NOT auto-disappear; for transient feedback use
   * `toast.*()` instead (`Toast` rendered by `Toaster`).
   */
  onDismiss?: () => void;
  /** Accessible label for the close affordance. Default `"Dismiss"`. */
  dismissLabel?: string;
}

// Map each banner variant to its glyph in the Icon registry. Callers
// that want a custom icon can still pass `icon={...}` to override.
const VARIANT_GLYPH: Record<BannerVariant, string> = {
  success: 'check-circle',
  info: 'info',
  warning: 'exclamation-triangle',
  error: 'exclamation-circle',
};

/**
 * Banner — a full-width persistent strip rendered inline in page flow.
 * Stays visible until the user acts (via `onDismiss`) or the consumer
 * removes it from state. Doesn't block the rest of the page.
 *
 * Use for system states / announcements: "Maintenance at 02:00",
 * "Subscription expiring", "Q1 forecast beat target". For transient
 * after-the-fact feedback ("Saved", "Copied") use the Toast atom via
 * the `toast.*()` API instead — Banner stays persistent, Toast
 * auto-dismisses in a corner.
 */
export function Banner({
  variant = 'info',
  title,
  icon,
  children,
  onDismiss,
  dismissLabel = 'Dismiss',
  className,
  ...rest
}: BannerProps) {
  return (
    <div role="alert" className={cn('uxm-banner', `uxm-banner--${variant}`, className)} {...rest}>
      <span className="uxm-banner__icon" aria-hidden="true">
        {icon ?? <Icon glyph={VARIANT_GLYPH[variant]} size={20} strokeWidth={1.5} />}
      </span>
      <div className="uxm-banner__body">
        {title && <p className="uxm-banner__title">{title}</p>}
        {children && <div className="uxm-banner__content">{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="uxm-banner__close"
          aria-label={dismissLabel}
          onClick={onDismiss}
        >
          <Icon glyph="close" size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
