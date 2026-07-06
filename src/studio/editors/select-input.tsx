import { Select } from '@/ui';
import { SearchDropdown } from '@/ui';

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string | number | boolean) => void;
  options: { value: string; label: string }[];
}

// When the option count exceeds this, the editor switches from the
// native <Select> to the <SearchDropdown> atom so users don't have to
// scroll a long native dropdown. The Icon component's `glyph` variant
// has ~46 options and is the obvious case; tag/chip/tabs variants stay
// on native Select.
const SEARCH_THRESHOLD = 12;

export function SelectInput({ label, value, onChange, options }: SelectInputProps) {
  const useSearch = options.length > SEARCH_THRESHOLD;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] text-text-strong flex-1 min-w-0 truncate">{label}</span>
      <div className="w-44 shrink-0">
        {useSearch ? (
          <SearchDropdown
            value={value}
            onChange={onChange}
            options={options}
            aria-label={label}
            placeholder={label}
            searchPlaceholder={`Search ${label.toLowerCase()}…`}
          />
        ) : (
          <Select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        )}
      </div>
    </div>
  );
}
