'use client';

import {
  Children,
  isValidElement,
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

import { cn } from '@/helpers';

import { FieldError } from '../field-error';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Listbox } from '../listbox';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * When set to a non-empty string, the field renders in its error state:
   * red border (`.uxm-input-text--error`), `aria-invalid`, and the message
   * rendered below the input. Omit (or pass an empty string) for the normal
   * state. The atom owns the message so it works standalone — search bars,
   * inline edits, custom layouts — without requiring a `FormField` wrapper.
   */
  error?: string;
}

export function TextInput({ className, type = 'text', error, ...rest }: TextInputProps) {
  return (
    <>
      <input
        type={type}
        className={cn('uxm-input-text', error && 'uxm-input-text--error', className)}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error && <FieldError className="uxm-input-text__error-message">{error}</FieldError>}
    </>
  );
}
// Static marker so FormField only forwards its `error` prop into children
// that accept one (avoids React unknown-prop warnings on non-input children).
TextInput.hasError = true;

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** See `TextInputProps.error`. */
  error?: string;
}

export function Textarea({ className, error, ...rest }: TextareaProps) {
  return (
    <>
      <textarea
        className={cn('uxm-textarea', error && 'uxm-textarea--error', className)}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error && <FieldError className="uxm-textarea__error-message">{error}</FieldError>}
    </>
  );
}
Textarea.hasError = true;

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * Show a clear (✕) button inside the trigger when a value is
   * selected. Off by default — matches native `<select>` semantics
   * where one option is always picked. Turn it on for filter selects,
   * optional form fields, or anywhere returning to the no-selection
   * state via UI is a legitimate user action. Mirrors Mantine /
   * Ant Design conventions; consumers that need clearable opt in.
   */
  clearable?: boolean;
  /**
   * When set to a non-empty string, the trigger renders in its error
   * state: red border (`.uxm-select-dropdown--error`), `aria-invalid` on
   * the combobox, and the message below the trigger. Omit (or pass an
   * empty string) for the normal state.
   */
  error?: string;
  /**
   * Whether the dropdown panel includes a search box. Forwarded to the
   * internal Listbox: `true`/`false` force it, `"auto"` (the default)
   * shows it only once the option count crosses the shared threshold —
   * short lists stay a plain picker, long ones become filterable, with no
   * change to the trigger. (For a search-first combobox with its own
   * trigger chrome — icon glyphs, dial codes — use SearchDropdown.)
   */
  searchable?: boolean | 'auto';
}

interface SelectItem {
  value: string;
  label: string;
  disabled: boolean;
}

/**
 * Parse `<option>` children into Listbox-friendly items. HTML semantics:
 *   - `<option value="x">Label</option>` → value "x", label "Label"
 *   - `<option>Label</option>` → value "Label", label "Label" (label IS the value)
 *   - `<option value="" disabled>Placeholder</option>` → reserved as the
 *     trigger placeholder text, not added to items (matches the common
 *     React Select pattern).
 */
function parseSelectOptions(children: ReactNode): {
  items: SelectItem[];
  placeholder: string | undefined;
} {
  const items: SelectItem[] = [];
  let placeholder: string | undefined;

  Children.forEach(children, (child) => {
    if (
      !isValidElement<{
        value?: string | number;
        children?: ReactNode;
        disabled?: boolean;
      }>(child)
    ) {
      return;
    }
    if (child.type !== 'option') return;

    const text = String(child.props.children ?? '');
    const val = child.props.value !== undefined ? String(child.props.value) : text;
    const label = text || val;
    const disabled = child.props.disabled ?? false;

    if (val === '' && disabled && placeholder === undefined) {
      placeholder = label;
      return;
    }
    items.push({ value: val, label, disabled });
  });

  return { items, placeholder };
}

/**
 * Select / Dropdown — internally a Listbox-backed picker. Its public
 * API stays compatible with the previous native-`<select>` shape:
 * pass `<option>` children, controlled (`value`) or uncontrolled
 * (`defaultValue`) state, and an `onChange(e)` handler that reads
 * `e.target.value`.
 *
 * The visible trigger keeps the same `.uxm-select-dropdown` class
 * (and all its registry-tuned visual chrome — bg, border, radius,
 * padding, font, per-state colors). The OPEN-state UI swaps from the
 * browser's native dropdown to a `<Listbox>` panel so it looks
 * identical across browsers and inherits the shared panel theming
 * from the `listbox` registry entry.
 *
 * `onChange` receives a synthetic `ChangeEvent` shape — most React
 * callers only read `e.target.value`, which is set correctly. For
 * new code, consider using `<Listbox>` directly with its native
 * `(item: T | null) => void` callback.
 */
export function Select({
  className,
  children,
  value,
  defaultValue,
  onChange,
  disabled,
  style,
  name,
  id,
  clearable = false,
  error,
  searchable = 'auto',
  'aria-label': ariaLabel,
}: SelectProps) {
  // Uncontrolled state — only used when `value` is not provided. Matches
  // the native `<select>`'s controlled/uncontrolled duality.
  const [internal, setInternal] = useState<string>(() => String(defaultValue ?? ''));
  const isControlled = value !== undefined;
  const current = String(isControlled ? value : internal);

  const { items, placeholder } = useMemo(() => parseSelectOptions(children), [children]);
  const selected = useMemo(() => items.find((o) => o.value === current) ?? null, [items, current]);

  const commit = useCallback(
    (nextValue: string) => {
      if (!isControlled) setInternal(nextValue);
      if (onChange) {
        // Synthesize a ChangeEvent so callers using
        // `onChange={(e) => set(e.target.value)}` keep working. Listbox
        // doesn't fire native events; we fabricate the minimum surface
        // most React callers actually read (`target.value`,
        // `currentTarget.value`, `type`, `name`).
        const target = { value: nextValue, name } as unknown as EventTarget & HTMLSelectElement;
        const event = {
          target,
          currentTarget: target,
          type: 'change',
          bubbles: true,
          cancelable: false,
          defaultPrevented: false,
          preventDefault() {},
          stopPropagation() {},
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
          persist() {},
          timeStamp: 0,
          nativeEvent: {} as Event,
        } as unknown as ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }
    },
    [isControlled, onChange, name],
  );

  return (
    <>
    <Listbox<SelectItem>
      items={items}
      getKey={(o) => o.value}
      getLabel={(o) => o.label}
      value={selected}
      onChange={(next) => {
        // Listbox's onChange is `(T | null) => void` to support
        // consumer-driven clearing. Select doesn't expose a clear
        // affordance — defensive ignore if null arrives.
        if (next) commit(next.value);
      }}
      isItemDisabled={(o) => o.disabled}
      disabled={disabled}
      searchable={searchable}
      aria-label={ariaLabel}
      renderTrigger={({ open, triggerProps }) => (
        // Trigger uses `<div role="combobox">` — gives us a focusable
        // surface that can carry the same `.uxm-select-dropdown` chrome
        // the native `<select>` had. `aria-disabled` drives the disabled
        // visual (CSS targets the attribute since `<div>` doesn't honor
        // `:disabled`).
        // eslint-disable-next-line jsx-a11y/role-has-required-aria-props -- aria-expanded (always) and aria-controls (while open) arrive via the triggerProps spread; the rule can't see through it
        <div role="combobox"
          {...triggerProps}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-invalid={error ? true : undefined}
          id={id}
          style={style}
          className={cn(
            'uxm-select-dropdown',
            open && 'uxm-select-dropdown--open',
            error && 'uxm-select-dropdown--error',
            className,
          )}
        >
          <span
            className={cn(
              'uxm-select-dropdown__trigger-label',
              !selected && 'uxm-select-dropdown__trigger-label--empty',
            )}
          >
            {selected ? selected.label : (placeholder ?? '')}
          </span>
          {clearable && selected && !disabled && (
            <IconButton
              aria-label="Clear selection"
              onClick={(e) => {
                // Stop click from bubbling to the trigger div (which
                // would toggle the popover back open).
                e.stopPropagation();
                commit('');
              }}
              onMouseDown={(e) => {
                // Stop mousedown too — the atom's Popover wires its
                // click-outside detection to mousedown.
                e.stopPropagation();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                }
              }}
              className="uxm-select-dropdown__trigger-clear"
            >
              <Icon glyph="close" />
            </IconButton>
          )}
          <Icon
            glyph="chevron-down"
            size={14}
            className="uxm-select-dropdown__trigger-chevron"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          />
        </div>
      )}
      renderItem={(o) => o.label}
    />
    {error && <FieldError className="uxm-select-dropdown__error-message">{error}</FieldError>}
    </>
  );
}
Select.hasError = true;
