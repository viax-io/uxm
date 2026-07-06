import { TextInput as UxmTextInput } from '@/ui';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string | number | boolean) => void;
}

export function TextInput({ label, value, onChange }: TextInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] text-text-strong">{label}</span>
      <UxmTextInput value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} />
    </div>
  );
}
