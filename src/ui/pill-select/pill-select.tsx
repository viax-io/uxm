'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/helpers';

import { Chip } from '../chip';
import { FieldError } from '../field-error';
import { Icon } from '../icon';
import { MultiListbox } from '../listbox';

import type { HTMLAttributes } from 'react';

export interface PillSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: string[];
  value?: string[];
  defaultValue?: string[];
  placeholder?: string;
  onChange?: (next: string[]) => void;
  /** When true, the field is non-interactive — no menu toggle, no chip
   *  removal, no tab stop. `aria-disabled="true"` on the field drives the
   *  CSS disabled visual; child chips also receive `disabled` so their ×
   *  buttons go inert and lose their tab stops. */
  disabled?: boolean;
  /**
   * Where to render the selected chips.
   *
   *   - `'inside'` — chips live inside the trigger field (tag-input
   *     style). The field expands vertically as chips accumulate.
   *     Best for compact tag/keyword inputs ("To:" fields, label
   *     authoring). Matches Material UI Autocomplete / Mantine
   *     MultiSelect defaults.
   *   - `'below'` (default) — trigger stays a compact "N selected"
   *     button; chips render as a separate row underneath. Best for
   *     filter UIs and property selectors where chip overflow is a
   *     risk. Matches Linear, JIRA, GitHub label-picker patterns.
   */
  chipsPosition?: 'inside' | 'below';
  /**
   * When set to a non-empty string, the field renders in its error state:
   * red border on the trigger field (`.uxm-pill-select__field--error`),
   * `aria-invalid` on the combobox field, and the message below. Omit (or
   * pass an empty string) for the normal state.
   */
  error?: string;
}

type Item = { value: string; label: string };

/**
 * Multi-select with chips, backed by the shared `<MultiListbox>` atom.
 * Two layout variants:
 *
 *   - `chipsPosition='inside'` — selected values render as `<Chip>`s
 *     inline within the field. The field is the trigger; clicking
 *     anywhere (other than a chip's × button) toggles the dropdown.
 *   - `chipsPosition='below'` — trigger is a compact Select-shaped
 *     button reading "N selected" / placeholder; the chips render as
 *     a separate row below the trigger.
 *
 * Either way, the dropdown PANEL is the same MultiListbox surface —
 * panel chrome, search, keyboard nav, ARIA roles flow from the
 * `listbox` registry entry. PillSelect ships only the field +
 * chip-row chrome.
 */
export function PillSelect({
  options,
  value,
  defaultValue = [],
  placeholder = 'Add…',
  onChange,
  disabled = false,
  chipsPosition = 'below',
  className,
  error,
  ...rest
}: PillSelectProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const selected = isControlled ? value : internal;

  const setSelected = (next: string[]) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const remove = (tag: string) => setSelected(selected.filter((t) => t !== tag));

  // MultiListbox is generic over T; convert the string[] options +
  // selection to {value,label} items.
  const items = useMemo<Item[]>(() => options.map((o) => ({ value: o, label: o })), [options]);
  const selectedItems = useMemo<Item[]>(
    () => selected.map((s) => ({ value: s, label: s })),
    [selected],
  );

  const handleChange = (next: Item[]) => {
    setSelected(next.map((n) => n.value));
  };

  return (
    <div
      className={cn(
        'uxm-pill-select',
        `uxm-pill-select--chips-${chipsPosition}`,
        disabled && 'uxm-pill-select--disabled',
        className,
      )}
      {...rest}
    >
      <MultiListbox<Item>
        items={items}
        getKey={(o) => o.value}
        getLabel={(o) => o.label}
        value={selectedItems}
        onChange={handleChange}
        disabled={disabled}
        // Original PillSelect UX: selected items vanish from the
        // dropdown (chips below/inside are the canonical selection
        // surface). Showing checkboxes here would duplicate the chip
        // signal — and items would never APPEAR checked because they
        // leave the list the moment they're picked.
        excludeSelected
        showCheckbox={false}
        renderTrigger={({ open, triggerProps }) => (
          // Trigger is a `<div role="combobox">` so chip × buttons can
          // nest inside without invalid HTML (chips-inside mode). The
          // existing PillSelect convention — same DOM, same aria wiring.
          // eslint-disable-next-line jsx-a11y/role-has-required-aria-props -- aria-expanded (always) and aria-controls (while open) arrive via the triggerProps spread; the rule can't see through it
          <div role="combobox"
            {...triggerProps}
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled || undefined}
            aria-invalid={error ? true : undefined}
            className={cn(
              'uxm-pill-select__field',
              error && 'uxm-pill-select__field--error',
            )}
            onKeyDown={(e) => {
              // Forward the listbox-trigger keyboard activation
              // (Enter/Space/ArrowDown) to MultiListbox via the
              // spread `onKeyDown`. But guard chip-removal bubbling
              // — when a chip × is keyboard-focused, Enter on that
              // button bubbles up to this handler BEFORE the browser
              // converts it to a click. Without this guard, Enter on
              // × would toggle the dropdown instead of removing the
              // chip.
              if (e.target !== e.currentTarget) return;
              triggerProps.onKeyDown(e);
            }}
          >
            {chipsPosition === 'inside' ? (
              <>
                {selected.map((tag) => (
                  // Forward disabled so chip × buttons lose their tab
                  // stops and become click-inert. Chip's onClick gates
                  // on its own `disabled` already.
                  <Chip key={tag} disabled={disabled} onRemove={() => remove(tag)}>
                    {tag}
                  </Chip>
                ))}
                {selected.length === 0 && (
                  <span className="uxm-pill-select__placeholder">{placeholder}</span>
                )}
              </>
            ) : (
              // Chips-below mode — trigger is a compact label + chevron.
              // "N selected" when populated, placeholder otherwise.
              <span
                className={cn(
                  'uxm-pill-select__placeholder',
                  selected.length > 0 && 'uxm-pill-select__placeholder--filled',
                )}
              >
                {selected.length === 0 ? placeholder : `${selected.length} selected`}
              </span>
            )}
            <Icon
              glyph="chevron-down"
              size={14}
              className="uxm-pill-select__chevron"
              style={{ transform: open ? 'rotate(180deg)' : 'none' }}
              aria-hidden
            />
          </div>
        )}
        renderItem={(o) => o.label}
      />
      {chipsPosition === 'below' && selected.length > 0 && (
        <div className="uxm-pill-select__chips-row">
          {selected.map((tag) => (
            <Chip key={tag} disabled={disabled} onRemove={() => remove(tag)}>
              {tag}
            </Chip>
          ))}
        </div>
      )}
      {error && <FieldError className="uxm-pill-select__error-message">{error}</FieldError>}
    </div>
  );
}
PillSelect.hasError = true;
