import type { InputHTMLAttributes } from "react";
import { cn } from "@/helpers";

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type" | "value"> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * A themable range slider — wraps a native `<input type="range">` so
 * accessibility and keyboard interaction (arrows, Home/End, PageUp/Dn)
 * come for free. Track height/colour, thumb size/colour, and the
 * filled-portion accent are all editor-tunable through `--uxm-slider-*`
 * custom properties.
 *
 * Bare control — no label. Compose with `<FormField>` when you need a
 * label-above-input stack, or wrap manually for label-with-current-
 * value layouts (the editor's `SliderInput` knob does the latter).
 */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  style,
  ...rest
}: SliderProps) {
  // Compute the filled-portion percentage and inject as a CSS custom
  // property. The CSS uses this as a gradient stop so the track has a
  // visible "value-so-far / value-remaining" split — Webkit doesn't
  // render a native filled portion for `<input type="range">` (and
  // `accent-color` only tints it in Firefox), so we paint it ourselves
  // via linear-gradient. Cross-browser, repaints fluidly on drag.
  const range = max - min;
  const progress = range > 0 ? ((value - min) / range) * 100 : 0;
  const mergedStyle = {
    ...style,
    ["--uxm-slider-progress" as string]: `${progress}%`,
  };

  return (
    <input
      {...rest}
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
      className={cn("uxm-slider", className)}
      style={mergedStyle}
    />
  );
}
