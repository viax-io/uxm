import { cn } from '@/helpers';

import type { CSSProperties } from 'react';

export interface RangeSliderProps {
  /** [start, end] — start ≤ end always (the atom clamps on drag). */
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Disable both thumbs and dim the wrapper via the shared --uxm-slider-disabled-opacity var. */
  disabled?: boolean;
  /** Show the start thumb's value above the slider (left-aligned). */
  showStart?: boolean;
  /** Show the end thumb's value above the slider (right-aligned). */
  showEnd?: boolean;
  /** Show the range (end − start) above the slider (centred). */
  showRange?: boolean;
  /** Optional unit shown alongside displayed values (e.g. "px"). */
  unit?: string;
  className?: string;
  style?: CSSProperties;
  /**
   * Names the control as a whole. Each thumb derives its own name from this
   * by appending `" (start)"` / `" (end)"` — English word order baked in, so
   * translate via `startLabel` / `endLabel` instead of relying on the suffix.
   */
  'aria-label'?: string;
  /**
   * Accessible name for the lower thumb, used verbatim. Defaults to
   * `` `${aria-label} (start)` `` when `aria-label` is set, else
   * `"Range start"`.
   */
  startLabel?: string;
  /**
   * Accessible name for the upper thumb, used verbatim. Defaults to
   * `` `${aria-label} (end)` `` when `aria-label` is set, else `"Range end"`.
   */
  endLabel?: string;
}

/**
 * Dual-thumb range slider — selects a sub-range [start, end] within
 * [min, max]. Built from two overlapped `<input type="range">`
 * elements; each input's thumb is independently focusable, draggable,
 * and keyboard-navigable. The track is a shared CSS gradient that
 * paints the filled portion between the two thumbs.
 *
 * Shares the `<Slider>` atom's theming surface — `--uxm-slider-track-
 * color`, `--uxm-slider-accent-color`, `--uxm-slider-thumb-*`, etc.
 * — so editor saves on the Slider registry flow into both single and
 * range modes uniformly. Adds two range-specific gradient stops
 * (`--uxm-range-slider-start` / `-end`) that the atom computes inline
 * from the current value.
 *
 * Display options: `showStart` / `showEnd` / `showRange` toggle the
 * value labels above the slider. Off by default so the bare atom is
 * a pure track-and-thumbs control; consumers (or the editor preview)
 * opt in.
 */
export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showStart = false,
  showEnd = false,
  showRange = false,
  unit,
  className,
  style,
  'aria-label': ariaLabel,
  startLabel,
  endLabel,
}: RangeSliderProps) {
  const [start, end] = value;
  const range = max - min;
  const startPct = range > 0 ? ((start - min) / range) * 100 : 0;
  const endPct = range > 0 ? ((end - min) / range) * 100 : 100;

  // Clamp on drag so start can never overtake end (and vice versa).
  // Without this, dragging the start thumb past the end would silently
  // swap the tuple semantics — surprising for consumers that read
  // `value[0]` as "the lower bound."
  const handleStart = (next: number) => {
    onChange([Math.min(next, end), end]);
  };
  const handleEnd = (next: number) => {
    onChange([start, Math.max(next, start)]);
  };

  const mergedStyle = {
    ...style,
    ['--uxm-range-slider-start' as string]: `${startPct}%`,
    ['--uxm-range-slider-end' as string]: `${endPct}%`,
  };

  const showAnyValues = showStart || showEnd || showRange;

  // Two thumbs on one control need two distinct names, and the composed
  // default only works in English — "(start)" trailing a noun is not how
  // every language qualifies it. `startLabel` / `endLabel` therefore replace
  // the whole name rather than the suffix.
  const resolvedStartLabel = startLabel ?? (ariaLabel ? `${ariaLabel} (start)` : 'Range start');
  const resolvedEndLabel = endLabel ?? (ariaLabel ? `${ariaLabel} (end)` : 'Range end');

  return (
    <div className={cn('uxm-range-slider', className)} style={mergedStyle}>
      {showAnyValues && (
        <div className="uxm-range-slider__values">
          <span className="uxm-range-slider__value uxm-range-slider__value--start">
            {showStart ? `${start}${unit ?? ''}` : ''}
          </span>
          <span className="uxm-range-slider__value uxm-range-slider__value--range">
            {showRange ? `${end - start}${unit ?? ''}` : ''}
          </span>
          <span className="uxm-range-slider__value uxm-range-slider__value--end">
            {showEnd ? `${end}${unit ?? ''}` : ''}
          </span>
        </div>
      )}
      <div className="uxm-range-slider__track">
        <input
          type="range"
          className="uxm-range-slider__input uxm-range-slider__input--start"
          value={start}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => handleStart(Number(e.target.value))}
          aria-label={resolvedStartLabel}
        />
        <input
          type="range"
          className="uxm-range-slider__input uxm-range-slider__input--end"
          value={end}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => handleEnd(Number(e.target.value))}
          aria-label={resolvedEndLabel}
        />
      </div>
    </div>
  );
}
