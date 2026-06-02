'use client';

import { useId, useState } from 'react';

import { cn } from '@/helpers';

import { Chip } from '../chip';
import { Icon } from '../icon';

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
}

/**
 * Multi-select tag input. Selected values render as `<Chip mode="input">`
 * (Chip auto-infers input mode from `onRemove`), so all chip theming flows
 * through Chip's own registry — this shell owns the field shape and
 * state visuals (default / hover / focus / disabled).
 *
 * Field surface reads `--uxm-pill-select-{bg, border-color, hover-bg,
 * hover-border, focus-border, focus-ring, disabled-bg, disabled-border,
 * disabled-opacity, placeholder-color, radius, chip-gap}` with token
 * fallbacks. The dropdown menu uses semantic surface tokens directly.
 */
export function PillSelect({
  options,
  value,
  defaultValue = [],
  placeholder = 'Add…',
  onChange,
  disabled = false,
  className,
  ...rest
}: PillSelectProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const selected = isControlled ? value : internal;
  const [open, setOpen] = useState(false);
  const menuId = useId();

  const setSelected = (next: string[]) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const remove = (tag: string) => setSelected(selected.filter((t) => t !== tag));
  const add = (tag: string) => {
    if (selected.includes(tag)) return;
    setSelected([...selected, tag]);
    setOpen(false);
  };

  const available = options.filter((o) => !selected.includes(o));

  return (
    <div className={cn('uxm-pill-select', className)} {...rest}>
      <div
        className="uxm-pill-select__field"
        onClick={() => {
          if (disabled) return;
          setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          // Combobox-style activation: Enter or Space toggles the menu.
          // Guard against bubbled keydowns from focused descendants — when
          // a chip's × button is keyboard-focused, Enter on that button
          // bubbles up here BEFORE the browser converts it to a click on
          // the button (which is where `onRemove` actually runs). Without
          // this guard, Enter on × would toggle the dropdown instead of
          // removing the chip. `stopPropagation` on the chip side doesn't
          // help — that's on the `click` event, but the keydown bubbles
          // first. Escape is also gated so chip-level Esc handlers (if
          // any are ever added) keep ownership.
          if (e.target !== e.currentTarget) return;
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            // preventDefault on Space stops the page from scrolling when
            // the field has keyboard focus.
            e.preventDefault();
            setOpen((v) => !v);
          } else if (e.key === 'Escape' && open) {
            setOpen(false);
          }
        }}
        // Omit tab stop when disabled so keyboard users skip the field
        // entirely (matches `<button disabled>` native behavior).
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-disabled={disabled || undefined}
      >
        {selected.map((tag) => (
          // Forward disabled to each chip so the × buttons lose their tab
          // stops and become click-inert (chip's onClick already gates on
          // its own `disabled` prop).
          <Chip key={tag} disabled={disabled} onRemove={() => remove(tag)}>
            {tag}
          </Chip>
        ))}
        {selected.length === 0 && (
          <span className="uxm-pill-select__placeholder">{placeholder}</span>
        )}
        {/* Chevron — visual affordance that this is a dropdown trigger.
            Inline as the last flex item in the field (margin-left: auto
            in CSS pushes it to the right edge regardless of how many
            chips fill the row). Rotates 180° when the menu is open,
            mirroring search-dropdown's pattern. */}
        <Icon
          glyph="chevron-down"
          size={14}
          className="uxm-pill-select__chevron"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          aria-hidden
        />
      </div>
      {!disabled && open && available.length > 0 && (
        <div id={menuId} className="uxm-pill-select__menu" role="listbox">
          {available.map((opt) => (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={false}
              className="uxm-pill-select__option"
              onClick={() => add(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
