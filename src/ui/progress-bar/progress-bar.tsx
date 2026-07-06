import { cn } from '@/helpers';

import type { CSSProperties, HTMLAttributes } from 'react';


export type ProgressBarVariant = 'linear' | 'ring';

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** Completion, 0–100. Clamped into range. */
  value: number;
  /** Linear track or circular ring. Both are determinate. */
  variant?: ProgressBarVariant;
  /** Optional caption — above the bar (linear) / below the ring (ring). */
  label?: string;
  /** Override the percentage text (defaults to `${Math.round(value)}%`). */
  valueText?: string;
}

/**
 * Determinate progress — the companion to Loader's indeterminate states.
 * Use for uploads, batch operations, and stepped flows where the share of
 * work done is known. For "something is happening, no ETA" use Loader.
 *
 * Theming flows through `--uxm-progress-bar-*` custom properties on inner
 * elements (root is layout-only), so editor saves route via the kebab
 * fallback path — no PER_COMPONENT_MAPPING entry needed. The single
 * `--uxm-progress-bar-value` var drives BOTH the linear fill width and the
 * ring's conic sweep; it is set inline here from the `value` prop so the
 * live (runtime) value always wins over any saved rule.
 */
export function ProgressBar({
  value,
  variant = 'linear',
  label,
  valueText,
  className,
  style,
  ...rest
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const text = valueText ?? `${Math.round(clamped)}%`;
  const mergedStyle = {
    ...style,
    // Unitless — consumed via `calc(var(--…-value) * 1%)`. Inline so the
    // runtime value overrides any (px-suffixed, inert) saved declaration.
    ['--uxm-progress-bar-value']: clamped,
  } as CSSProperties;

  const a11y = {
    role: 'progressbar' as const,
    'aria-valuenow': Math.round(clamped),
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-label': label || undefined,
  };

  if (variant === 'ring') {
    return (
      <div
        className={cn('uxm-progress-bar', 'uxm-progress-bar--ring', className)}
        style={mergedStyle}
        {...a11y}
        {...rest}
      >
        <div className="uxm-progress-bar__ring">
          <div className="uxm-progress-bar__ring-fill" aria-hidden="true" />
          <span className="uxm-progress-bar__value">{text}</span>
        </div>
        {label && <span className="uxm-progress-bar__label">{label}</span>}
      </div>
    );
  }

  return (
    <div
      className={cn('uxm-progress-bar', 'uxm-progress-bar--linear', className)}
      style={mergedStyle}
      {...a11y}
      {...rest}
    >
      <div className="uxm-progress-bar__head">
        {label && <span className="uxm-progress-bar__label">{label}</span>}
        <span className="uxm-progress-bar__value">{text}</span>
      </div>
      <div className="uxm-progress-bar__track">
        <div className="uxm-progress-bar__fill" />
      </div>
    </div>
  );
}
