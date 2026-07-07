import { NumberStepper } from '@/ui';

export interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: string | number | boolean) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

/**
 * Editor knob — wraps the `<NumberStepper>` atom with the panel's label-
 * left, control-right layout. NumberStepper provides the input + step
 * buttons + unit suffix and handles min/max clamping; this wrapper
 * adds the truncating label and the fixed-width slot the properties
 * pane uses for visual alignment of editor knobs.
 */
export function NumberInput({ label, value, onChange, min, max, step = 1, unit }: NumberInputProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] text-text-strong flex-1 min-w-0 truncate">{label}</span>
      <div className="w-44 shrink-0 flex items-center justify-end">
        <NumberStepper
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          unit={unit}
          aria-label={label}
        />
      </div>
    </div>
  );
}
