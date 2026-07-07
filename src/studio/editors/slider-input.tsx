import { Slider } from '@/ui';

export interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: string | number | boolean) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

/**
 * Editor knob — wraps the `<Slider>` atom with the panel's label-with-
 * current-value layout. The slider itself is themable through the
 * Slider atom's registry; the surrounding label/value-display chrome
 * is properties-panel-specific UX (showing the current numeric value
 * inline next to the label is a knob-editor convention).
 */
export function SliderInput({ label, value, onChange, min, max, step, unit }: SliderInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] text-text-strong">{label}</span>
        <span className="text-[12px] font-mono text-text-muted">
          {value}{unit}
        </span>
      </div>
      <Slider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        aria-label={label}
      />
    </div>
  );
}
