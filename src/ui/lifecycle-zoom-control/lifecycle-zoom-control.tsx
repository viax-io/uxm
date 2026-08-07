import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { HTMLAttributes } from 'react';

export interface LifecycleZoomControlProps extends HTMLAttributes<HTMLDivElement> {
  /** Current zoom percentage shown between the +/− buttons. */
  value?: number;
  /** Optional handlers — when omitted, buttons render in a "decorative" disabled-looking state. */
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  /** Size of each button in px. CSS-token-driven by default. */
  buttonSize?: number;
  /** Accessible name for the − button. Default `"Zoom out"`. */
  zoomOutLabel?: string;
  /** Accessible name for the + button. Default `"Zoom in"`. */
  zoomInLabel?: string;
}

/**
 * The compact −/percent/+ cluster that lives in the corner of a lifecycle
 * canvas. Inert if no handlers passed (useful for static demos / templates).
 */
export function LifecycleZoomControl({
  value = 100,
  onZoomIn,
  onZoomOut,
  buttonSize,
  zoomOutLabel = 'Zoom out',
  zoomInLabel = 'Zoom in',
  className,
  style,
  ...rest
}: LifecycleZoomControlProps) {
  const sizeStyle = buttonSize ? { ['--uxm-lifecycle-zoom-button-size' as string]: `${buttonSize}px` } : undefined;
  return (
    <div
      {...rest}
      className={cn('uxm-lifecycle-zoom-control', className)}
      style={{ ...sizeStyle, ...style }}
    >
      <button
        type="button"
        className="uxm-lifecycle-zoom-control__btn"
        aria-label={zoomOutLabel}
        onClick={onZoomOut}
        disabled={!onZoomOut}
      >
        <Icon glyph="minus" size={14} strokeWidth={2.5} />
      </button>
      <div className="uxm-lifecycle-zoom-control__value">
        <span className="uxm-lifecycle-zoom-control__num">{value}</span>
        <span className="uxm-lifecycle-zoom-control__unit">%</span>
      </div>
      <button
        type="button"
        className="uxm-lifecycle-zoom-control__btn"
        aria-label={zoomInLabel}
        onClick={onZoomIn}
        disabled={!onZoomIn}
      >
        <Icon glyph="plus" size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
