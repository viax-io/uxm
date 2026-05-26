import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { InputHTMLAttributes, ReactNode } from 'react';

export interface InputWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Leading icon (SVG or Icon component). */
  icon: ReactNode;
  /**
   * Show a clear (✕) button at the trailing edge when the input has content.
   * Defaults to `true` for `type="search"` (the browser's native search clear
   * button is suppressed by CSS so we don't render two), `false` otherwise.
   */
  clearable?: boolean;
  /**
   * Called when the user clicks the clear button. Required when `clearable`
   * is true and the input is controlled — typically `() => setValue("")`.
   * The button is only rendered when both `onClear` and a non-empty `value`
   * are provided, since uncontrolled inputs can't be reset from the outside.
   */
  onClear?: () => void;
}

export function InputWithIcon({
  icon,
  className,
  type = 'text',
  clearable,
  onClear,
  value,
  ...rest
}: InputWithIconProps) {
  const isClearable = clearable ?? type === 'search';
  const hasValue = typeof value === 'string' && value.length > 0;
  const showClear = isClearable && hasValue && typeof onClear === 'function';

  return (
    <div
      className={cn(
        'uxm-input-with-icon',
        isClearable && 'uxm-input-with-icon--clearable',
        className,
      )}
    >
      <span className="uxm-input-with-icon__icon" aria-hidden="true">
        {icon}
      </span>
      <input
        type={type}
        className="uxm-input-with-icon__input"
        value={value}
        {...rest}
      />
      {showClear && (
        <button
          type="button"
          onClick={onClear}
          className="uxm-input-with-icon__clear"
          aria-label="Clear"
        >
          <Icon glyph="close" size={10} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
