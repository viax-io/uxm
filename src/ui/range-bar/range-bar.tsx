import { cn } from '@/helpers';

import type { CSSProperties, HTMLAttributes } from 'react';

export type RangeBarType = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface RangeBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /**
   * The interval this bar covers, in domain units. Clamped into `[min, max]`,
   * and normalised if the two are the wrong way round.
   */
  value: [number, number];
  /** Low end of the track's domain. Default `0`. */
  min?: number;
  /** High end of the track's domain. Default `100`. */
  max?: number;
  /**
   * Fade the fill out at that edge instead of stopping hard — an interval with
   * no bound on that side (`500 – ∞`, `under 120`).
   */
  openStart?: boolean;
  openEnd?: boolean;
  /** Semantic colour of the fill. Same vocabulary as `Tag` and `Badge`. */
  type?: RangeBarType;
}

/**
 * Where the fill sits on the track, as two percentages.
 *
 * Every guard here is a case a consumer's own version gets to assume away and an
 * atom cannot:
 *
 * - **A degenerate domain (`min === max`)** divides by zero. `NaN%` is not an
 *   error anyone sees — the bar simply does not paint — so it resolves to the
 *   full track instead.
 * - **An inverted value** (`[80, 20]`) would otherwise produce a negative width,
 *   which paints nothing.
 * - **A value outside the domain** is clamped at both ends. (A consumer clamping
 *   only the top is exactly how a negative offset gets through.)
 */
export function rangeBarPosition(
  value: [number, number],
  min: number,
  max: number,
): { start: number; end: number } {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  const span = hi - lo;
  if (span === 0) return { start: 0, end: 100 };

  const [rawStart, rawEnd] = value;
  const from = Math.min(rawStart, rawEnd);
  const to = Math.max(rawStart, rawEnd);
  const pct = (n: number) => ((Math.max(lo, Math.min(hi, n)) - lo) / span) * 100;
  return { start: pct(from), end: pct(to) };
}

/**
 * A read-only interval on a shared track — the display-only counterpart to
 * `ProgressBar`, which always fills from 0, and the semantic alternative to
 * `RangeSlider`, which is an input and announces itself as one.
 *
 * The atom owns the track, the offset maths and the open-ended fade; labels,
 * axis ticks and whatever the intervals *mean* belong to the consumer.
 *
 * It renders no text of its own, deliberately: the words for an interval
 * ("500 – ∞", "under 120") are the app's, so pass `title` or `aria-label`
 * through and they will be used as-is.
 */
export function RangeBar({
  value,
  min = 0,
  max = 100,
  openStart,
  openEnd,
  type = 'accent',
  className,
  style,
  ...rest
}: RangeBarProps) {
  const { start, end } = rangeBarPosition(value, min, max);

  /**
   * A graphic that carries meaning needs a role to be announced — but only when
   * it has a name to announce. `aria-label` on a role-less `<div>` is prohibited
   * by ARIA and dropped by most screen readers, so claiming the role without a
   * name would trade a silent label for a nameless image. Unnamed, the bar stays
   * decorative and the row around it carries the meaning.
   */
  const named = rest['aria-label'] != null || rest['aria-labelledby'] != null;
  const role = rest.role ?? (named ? 'img' : undefined);

  const mergedStyle = {
    ...style,
    // Unitless, consumed as `calc(var(…) * 1%)` — the same shape ProgressBar
    // uses, so a saved (px-suffixed) declaration stays inert and the runtime
    // value always wins.
    ['--uxm-range-bar-start']: start,
    ['--uxm-range-bar-end']: end,
  } as CSSProperties;

  return (
    <div
      {...rest}
      role={role}
      className={cn('uxm-range-bar', `uxm-range-bar--${type}`, className)}
      style={mergedStyle}
    >
      <div
        className="uxm-range-bar__fill"
        data-open-start={openStart || undefined}
        data-open-end={openEnd || undefined}
      />
    </div>
  );
}
