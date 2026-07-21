import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { HTMLAttributes, Key, ReactNode } from 'react';

export interface OptionListItem {
  /** Stable React key; falls back to the array index when omitted. */
  id?: Key;
  /** Option display label. */
  label: ReactNode;
}

export interface OptionListProps extends HTMLAttributes<HTMLDivElement> {
  /** The options to list, in display order. */
  options: OptionListItem[];
  /** Show a leading drag-handle affordance on each row (visual only). Default `true`. */
  dragHandle?: boolean;
}

/**
 * The list of options nested under a "Predefined Options" configuration
 * component: a bordered, indented container of rows, each with a drag handle,
 * a bullet, and a label. The bullet colour inherits from the parent
 * component's icon tint at runtime — set `--uxm-option-list-bullet-color` on
 * (or above) the list to match.
 *
 * Every colour/dimension reads a `--uxm-option-list-*` custom property (with a
 * token fallback) so the UXM studio knobs re-theme it.
 */
export function OptionList({ options, dragHandle = true, className, ...rest }: OptionListProps) {
  return (
    <div className={cn('uxm-option-list', className)} {...rest}>
      {options.map((opt, i) => (
        <div className="uxm-option-list__row" key={opt.id ?? i}>
          {dragHandle && (
            <span className="uxm-option-list__drag" aria-hidden="true">
              <Icon glyph="drag-handle" size={14} />
            </span>
          )}
          <span className="uxm-option-list__bullet" aria-hidden="true" />
          <span className="uxm-option-list__name">{opt.label}</span>
        </div>
      ))}
    </div>
  );
}
