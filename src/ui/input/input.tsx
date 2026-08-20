import {
  Children,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

import { cn, mergeRefs } from '@/helpers';

import { ButtonGhost } from '../button';
import { FieldError } from '../field-error';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { DEFAULT_MULTI_REQUIRED_MESSAGE, Listbox, MultiListbox } from '../listbox';

import { clearFieldValue } from './clear-field-value';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * When set to a non-empty string, the field renders in its error state:
   * red border (`.uxm-input-text--error`), `aria-invalid`, and the message
   * rendered below the input. Omit (or pass an empty string) for the normal
   * state. The atom owns the message so it works standalone — search bars,
   * inline edits, custom layouts — without requiring a `FormField` wrapper.
   */
  error?: string;
  /**
   * Show a clear (✕) button at the trailing edge when the input has content.
   * **Defaults to `true`** — a free-text field is always safe to clear (you
   * can type/delete anyway), so the affordance is on by default; pass
   * `clearable={false}` to opt out. The ✕ self-clears (resets the field and
   * fires `onChange` with ""), so no `onClear` is needed — any controlled
   * `value` + `onChange` usage gets it for free.
   */
  clearable?: boolean;
  /**
   * Optional override for the clear action. By default the field clears
   * itself (and notifies via `onChange`); pass `onClear` only when you need
   * custom reset logic beyond emptying the value.
   */
  onClear?: () => void;
  /** Accessible name for the clear button. Default `"Clear"`. */
  clearLabel?: string;
  /**
   * Handle to the underlying `<input>` element, merged with the atom's own
   * internal ref (the self-clear keeps working). Use this to focus, select,
   * measure, or insert text at the caret from a consumer. A plain React `ref`
   * on `<TextInput>` does NOT reach the element — it's consumed by `{...rest}`
   * and overridden by the managed ref — so pass `inputRef` instead.
   */
  inputRef?: Ref<HTMLInputElement>;
}

export function TextInput({
  className,
  type = 'text',
  error,
  clearable = true,
  onClear,
  clearLabel = 'Clear',
  value,
  defaultValue,
  onChange,
  disabled,
  inputRef,
  ...rest
}: TextInputProps) {
  const errorId = useId();
  const innerRef = useRef<HTMLInputElement>(null);
  const isControlled = value !== undefined;
  const [hasTextUncontrolled, setHasTextUncontrolled] = useState(
    () => typeof defaultValue === 'string' && defaultValue.length > 0,
  );
  const hasValue = isControlled ? String(value).length > 0 : hasTextUncontrolled;
  const showClear = !!clearable && hasValue && !disabled;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setHasTextUncontrolled(e.target.value.length > 0);
    onChange?.(e);
  };
  const handleClear = () => {
    // Self-clear path (clearFieldValue) already refocuses the field; only the
    // onClear-override path needs an explicit focus. Avoids a double focus().
    if (onClear) {
      onClear();
      innerRef.current?.focus();
    } else {
      clearFieldValue(innerRef.current);
    }
    if (!isControlled) setHasTextUncontrolled(false);
  };

  // Merge the consumer's `inputRef` with the atom's `innerRef` (the self-clear
  // relies on `innerRef`), so both get the element. Memoised on `inputRef` so
  // the callback identity is stable and React doesn't detach/reattach.
  const setInputRef = useMemo(() => mergeRefs(innerRef, inputRef), [inputRef]);

  const input = (
    // `{...rest}` is spread FIRST so the managed props below always win — a raw
    // consumer `ref` can't clobber the merged ref (which the self-clear relies
    // on); the sanctioned handle is `inputRef`, merged in via `setInputRef`.
    // `defaultValue` is only forwarded when uncontrolled, so value+defaultValue
    // are never both set.
    <input
      {...rest}
      ref={setInputRef}
      type={type}
      value={value}
      defaultValue={isControlled ? undefined : defaultValue}
      onChange={handleChange}
      disabled={disabled}
      className={cn(
        'uxm-input-text',
        error && 'uxm-input-text--error',
        clearable && 'uxm-input-text--clearable',
        className,
      )}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
    />
  );

  return (
    <>
      {clearable ? (
        // Layout-only wrapper so the clear button can sit absolutely at the
        // trailing edge. The visible chrome stays on `.uxm-input-text` (the
        // input itself), so save-emitted `--uxm-input-text-*` vars still land.
        <div className="uxm-input-text__wrap">
          {input}
          {showClear && (
            <IconButton
              onClick={handleClear}
              className="uxm-field-clear uxm-input-text__clear"
              aria-label={clearLabel}
            >
              <Icon glyph="close" />
            </IconButton>
          )}
        </div>
      ) : (
        input
      )}
      {error && (
        <FieldError id={errorId} className="uxm-input-text__error-message">
          {error}
        </FieldError>
      )}
    </>
  );
}
// Static marker so FormField only forwards its `error` prop into children
// that accept one (avoids React unknown-prop warnings on non-input children).
TextInput.hasError = true;

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** See `TextInputProps.error`. */
  error?: string;
  /** See `TextInputProps.clearable`. Defaults to `true`; ✕ sits at the top-right corner. */
  clearable?: boolean;
  /** See `TextInputProps.onClear` — optional override; the field self-clears otherwise. */
  onClear?: () => void;
  /** See `TextInputProps.clearLabel`. Default `"Clear"`. */
  clearLabel?: string;
  /**
   * Handle to the underlying `<textarea>` element, merged with the atom's own
   * internal ref (the self-clear keeps working). Use it to focus, select, or
   * insert text at the caret (e.g. drop-a-variable-into-a-formula). A plain
   * React `ref` on `<Textarea>` does NOT reach the element — pass
   * `textareaRef` instead.
   */
  textareaRef?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  className,
  error,
  clearable = true,
  onClear,
  clearLabel = 'Clear',
  value,
  defaultValue,
  onChange,
  disabled,
  textareaRef,
  ...rest
}: TextareaProps) {
  const errorId = useId();
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const isControlled = value !== undefined;
  const [hasTextUncontrolled, setHasTextUncontrolled] = useState(
    () => typeof defaultValue === 'string' && defaultValue.length > 0,
  );
  const hasValue = isControlled ? String(value).length > 0 : hasTextUncontrolled;
  const showClear = !!clearable && hasValue && !disabled;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setHasTextUncontrolled(e.target.value.length > 0);
    onChange?.(e);
  };
  const handleClear = () => {
    // See TextInput: clearFieldValue refocuses; only onClear needs explicit focus.
    if (onClear) {
      onClear();
      innerRef.current?.focus();
    } else {
      clearFieldValue(innerRef.current);
    }
    if (!isControlled) setHasTextUncontrolled(false);
  };

  // Merge the consumer's `textareaRef` with the atom's `innerRef` — see TextInput.
  const setTextareaRef = useMemo(() => mergeRefs(innerRef, textareaRef), [textareaRef]);

  const textarea = (
    // `{...rest}` first so managed props win; the sanctioned element handle is
    // `textareaRef`, merged in via `setTextareaRef`. `defaultValue` only when
    // uncontrolled — never both value+defaultValue.
    <textarea
      {...rest}
      ref={setTextareaRef}
      value={value}
      defaultValue={isControlled ? undefined : defaultValue}
      onChange={handleChange}
      disabled={disabled}
      className={cn(
        'uxm-textarea',
        error && 'uxm-textarea--error',
        clearable && 'uxm-textarea--clearable',
        className,
      )}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
    />
  );

  return (
    <>
      {clearable ? (
        <div className="uxm-textarea__wrap">
          {textarea}
          {showClear && (
            <IconButton
              onClick={handleClear}
              className="uxm-field-clear uxm-textarea__clear"
              aria-label={clearLabel}
            >
              <Icon glyph="close" />
            </IconButton>
          )}
        </div>
      ) : (
        textarea
      )}
      {error && (
        <FieldError id={errorId} className="uxm-textarea__error-message">
          {error}
        </FieldError>
      )}
    </>
  );
}
Textarea.hasError = true;

/**
 * Native `<select>` attributes the atom still accepts verbatim. The five
 * omitted keys are the ones `mode` re-shapes: `value` / `defaultValue` /
 * `onChange` differ per mode, `required` gains its own message prop, and
 * `multiple` is replaced by `mode="multi"`. Keeping this base means existing
 * `<Select onBlur={…} autoFocus data-testid={…}>` call sites — and any
 * `Omit<SelectProps, …>` in consumer code — keep compiling.
 */
type SelectNativeProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'value' | 'defaultValue' | 'onChange' | 'required' | 'multiple'
>;

/** Props shared by both single- and multi-select modes. */
interface SelectCommonProps extends SelectNativeProps {
  /** `<option>` children — parsed into items (and a placeholder from `<option value="" disabled>`). */
  children?: ReactNode;
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
  /**
   * Require a selection. Clearing to empty is still allowed (input-family,
   * live model) but flags the error immediately. An explicit `error` prop
   * takes precedence. Single mode is only clearable with a placeholder
   * option; multi mode uses `clearable`.
   */
  required?: boolean;
  /**
   * Override the default required message. Defaults are per-mode:
   * single → `"Select an option"`, multi → `"Select at least one option"`
   * (the shared `DEFAULT_MULTI_REQUIRED_MESSAGE`).
   */
  requiredMessage?: string;
  /**
   * Accessible name for the trigger's clear button. Defaults are per-mode:
   * single → `"Clear selection"`, multi → `"Clear all selections"`.
   */
  clearLabel?: string;
}

export interface SelectSingleProps extends SelectCommonProps {
  /** Single-choice (default) — one value, cleared only when a placeholder option exists. */
  mode?: 'single';
  value?: string;
  defaultValue?: string;
  /** Fires a synthesized `ChangeEvent` (native-`<select>`-compatible) so `e.target.value` works. */
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export interface SelectMultiProps extends SelectCommonProps {
  /** Multi-choice — an array value with a "N selected" trigger, live commit, checkbox rows. */
  mode: 'multi';
  value?: string[];
  defaultValue?: string[];
  /** Fires the full selected-value array on every toggle (live). */
  onChange?: (next: string[]) => void;
  /** Show a clear-all ✕ on the trigger AND a "Clear all" in the panel. */
  clearable?: boolean;
}

export type SelectProps = SelectSingleProps | SelectMultiProps;

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
 * Select Dropdown — internally a Listbox-backed picker. Its public
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
function SelectSingle({
  className,
  children,
  value,
  defaultValue,
  onChange,
  disabled,
  style,
  name,
  id,
  error,
  searchable = 'auto',
  required = false,
  requiredMessage,
  clearLabel = 'Clear selection',
  'aria-label': ariaLabel,
  ...rest
}: SelectSingleProps) {
  const errorId = useId();
  // Required is flagged (not blocked) on clear — input-family live model.
  // An explicit `error` prop wins over the internal required one.
  const [reqError, setReqError] = useState<string | null>(null);
  const shownError = error ?? reqError ?? undefined;
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
      if (required) setReqError(nextValue === '' ? (requiredMessage ?? 'Select an option') : null);
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
    [isControlled, onChange, name, required, requiredMessage],
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
      // Clear inside the panel (input-family convention: clear on the trigger
      // AND in the dropdown). Shown when a value is picked and the field can be
      // empty (has a placeholder option). Mirrors the trailing ✕ on the trigger.
      footer={selected && placeholder !== undefined && !disabled
        ? ({ close }: { close: () => void }) => (
            <ButtonGhost
              className="uxm-listbox__footer-clear-option"
              onClick={() => { commit(''); close(); }}
            >
              <Icon glyph="close" size={12} />
              Clear
            </ButtonGhost>
          )
        : undefined}
      renderTrigger={({ open, triggerProps }) => (
        // Trigger uses `<div role="combobox">` — gives us a focusable
        // surface that can carry the same `.uxm-select-dropdown` chrome
        // the native `<select>` had. `aria-disabled` drives the disabled
        // visual (CSS targets the attribute since `<div>` doesn't honor
        // `:disabled`).
        // `rest` = the leftover native-select attributes (`onBlur`, `autoFocus`,
        // `form`, `data-*`, …). It goes FIRST so `triggerProps` and the atom's
        // own props always win; the cast only bridges the element generic —
        // the trigger is a `<div>`, not a `<select>`.
        // eslint-disable-next-line jsx-a11y/role-has-required-aria-props -- aria-expanded (always) and aria-controls (while open) arrive via the triggerProps spread; the rule can't see through it
        <div role="combobox"
          {...(rest as HTMLAttributes<HTMLDivElement>)}
          {...triggerProps}
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-required={required || undefined}
          aria-invalid={shownError ? true : undefined}
          aria-describedby={shownError ? errorId : undefined}
          id={id}
          style={style}
          className={cn(
            'uxm-select-dropdown',
            open && 'uxm-select-dropdown--open',
            shownError && 'uxm-select-dropdown--error',
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
          {/* Clear ✕ shows only when the field CAN be empty — i.e. it has a
              placeholder option (`<option value="" disabled>`), which stands
              for the "no selection" state. A select without a placeholder is
              mandatory (a value is always picked, native-<select> style), so
              clearing to empty makes no sense and no ✕ is rendered. */}
          {selected && !disabled && placeholder !== undefined && (
            <IconButton
              aria-label={clearLabel}
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
              className="uxm-field-clear uxm-select-dropdown__trigger-clear"
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
    {shownError && (
      <FieldError id={errorId} className="uxm-select-dropdown__error-message">
        {shownError}
      </FieldError>
    )}
    </>
  );
}

/**
 * Multi-select mode — same `.uxm-select-dropdown` trigger chrome as single,
 * but backed by MultiListbox: an array value, a "N selected" trigger, checkbox
 * rows, live commit, and (input-family) a clear ✕ on the trigger AND in the
 * panel. Required flags an empty selection without blocking.
 */
function SelectMulti({
  className,
  children,
  value,
  defaultValue,
  onChange,
  disabled,
  style,
  id,
  error,
  searchable = 'auto',
  required = false,
  requiredMessage,
  clearable = false,
  clearLabel = 'Clear all selections',
  'aria-label': ariaLabel,
  ...rest
}: SelectMultiProps) {
  const errorId = useId();
  const [reqError, setReqError] = useState<string | null>(null);
  const shownError = error ?? reqError ?? undefined;
  const [internal, setInternal] = useState<string[]>(() => defaultValue ?? []);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const { items, placeholder } = useMemo(() => parseSelectOptions(children), [children]);
  const selectedItems = useMemo(
    () => items.filter((o) => current.includes(o.value)),
    [items, current],
  );

  const commit = useCallback(
    (next: string[]) => {
      if (!isControlled) setInternal(next);
      if (required) {
        setReqError(next.length === 0 ? (requiredMessage ?? DEFAULT_MULTI_REQUIRED_MESSAGE) : null);
      }
      onChange?.(next);
    },
    [isControlled, onChange, required, requiredMessage],
  );

  return (
    <>
      <MultiListbox<SelectItem>
        items={items}
        getKey={(o) => o.value}
        getLabel={(o) => o.label}
        value={selectedItems}
        onChange={(next) => commit(next.map((o) => o.value))}
        // Relies on MultiListbox's default `commitMode="change"` — the
        // "N selected" count has to track each toggle.
        isItemDisabled={(o) => o.disabled}
        disabled={disabled}
        searchable={searchable}
        aria-label={ariaLabel}
        footer={clearable
          ? ({ clear, selected }) =>
              selected.length > 0 ? (
                <ButtonGhost className="uxm-listbox__footer-clear-option" onClick={clear}>
                  <Icon glyph="close" size={12} />
                  Clear all
                </ButtonGhost>
              ) : null
          : undefined}
        renderTrigger={({ open, triggerProps }) => (
          // `rest` (leftover native-select attributes) goes first so
          // `triggerProps` and the atom's own props win — see SelectSingle.
          // eslint-disable-next-line jsx-a11y/role-has-required-aria-props -- aria-expanded/controls arrive via the triggerProps spread
          <div role="combobox"
            {...(rest as HTMLAttributes<HTMLDivElement>)}
            {...triggerProps}
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled || undefined}
            aria-required={required || undefined}
            aria-invalid={shownError ? true : undefined}
            aria-describedby={shownError ? errorId : undefined}
            id={id}
            style={style}
            className={cn(
              'uxm-select-dropdown',
              open && 'uxm-select-dropdown--open',
              shownError && 'uxm-select-dropdown--error',
              className,
            )}
          >
            <span
              className={cn(
                'uxm-select-dropdown__trigger-label',
                current.length === 0 && 'uxm-select-dropdown__trigger-label--empty',
              )}
            >
              {current.length === 0 ? (placeholder ?? '') : `${current.length} selected`}
            </span>
            {clearable && current.length > 0 && !disabled && (
              <IconButton
                aria-label={clearLabel}
                className="uxm-field-clear uxm-select-dropdown__trigger-clear"
                onClick={(e) => { e.stopPropagation(); commit([]); }}
                onMouseDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); }}
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
      {shownError && (
        <FieldError id={errorId} className="uxm-select-dropdown__error-message">
          {shownError}
        </FieldError>
      )}
    </>
  );
}

/**
 * Select dropdown atom. `mode="single"` (default) picks one value;
 * `mode="multi"` picks an array. Both share the same trigger chrome and
 * `<option>` children API — only the value/onChange shape differs.
 */
export function Select(props: SelectProps) {
  return props.mode === 'multi' ? <SelectMulti {...props} /> : <SelectSingle {...props} />;
}
Select.hasError = true;
