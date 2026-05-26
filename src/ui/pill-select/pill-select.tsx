"use client";

import { useState } from "react";
import type { HTMLAttributes } from "react";
import { Chip } from "./chip";
import { cn } from "./cn";

export interface PillSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: string[];
  value?: string[];
  defaultValue?: string[];
  placeholder?: string;
  onChange?: (next: string[]) => void;
}

/**
 * Multi-select tag input. Selected values render as `<Chip mode="input">`
 * (Chip auto-infers input mode from `onRemove`), so all chip theming flows
 * through Chip's own registry — this shell stays layout-only.
 *
 * Field shape (background, border, radius, gap) reads `--uxm-pill-select-*`
 * custom properties with token fallbacks; the dropdown menu uses semantic
 * surface tokens directly (no per-component theming knob).
 */
export function PillSelect({
  options,
  value,
  defaultValue = [],
  placeholder = "Add…",
  onChange,
  className,
  ...rest
}: PillSelectProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const selected = isControlled ? value : internal;
  const [open, setOpen] = useState(false);

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
    <div className={cn("uxm-pill-select", className)} {...rest}>
      <div
        className="uxm-pill-select__field"
        onClick={() => setOpen((v) => !v)}
      >
        {selected.map((tag) => (
          <Chip key={tag} onRemove={() => remove(tag)}>
            {tag}
          </Chip>
        ))}
        {selected.length === 0 && (
          <span className="uxm-pill-select__placeholder">{placeholder}</span>
        )}
      </div>
      {open && available.length > 0 && (
        <div className="uxm-pill-select__menu">
          {available.map((opt) => (
            <button
              key={opt}
              type="button"
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
