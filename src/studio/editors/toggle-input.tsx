import { ToggleSwitch } from '@/ui';

interface ToggleInputProps {
  label: string;
  value: boolean;
  onChange: (value: string | number | boolean) => void;
}

export function ToggleInput({ label, value, onChange }: ToggleInputProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] text-text-strong flex-1 min-w-0 truncate">{label}</span>
      <div className="w-44 shrink-0 flex justify-end">
        <ToggleSwitch checked={value} onChange={(checked) => onChange(checked)} />
      </div>
    </div>
  );
}
