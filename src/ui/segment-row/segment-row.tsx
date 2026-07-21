import { useState } from 'react';

import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { HTMLAttributes, ReactNode } from 'react';

export interface SegmentRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onToggle'> {
  /** Segment title (primary text). */
  name: ReactNode;
  /** Item count — renders a trailing "N items" badge. Omit for no badge. */
  count?: number;
  /** Controlled expanded state (drives chevron direction). When omitted the row manages its own. */
  open?: boolean;
  /** Initial expanded state for uncontrolled usage. Ignored when `open` is set. Default `true`. */
  defaultOpen?: boolean;
  /** Fires with the next expanded state whenever the title toggle is clicked. */
  onToggle?: (open: boolean) => void;
  /** Show a leading drag-handle affordance (visual only; wire your own DnD). */
  dragHandle?: boolean;
  /**
   * Trailing action controls (typically `IconButton`s), revealed on row hover
   * or keyboard focus, after the count badge. Kept outside the toggle button so
   * the action buttons aren't nested inside a button.
   */
  actions?: ReactNode;
}

/**
 * Header row of a configuration segment: an optional drag handle, an accent
 * line, an expand chevron, the segment name, and a count badge. The same row
 * is used at every depth — nesting/indent is owned by the wrapping
 * `SegmentCard`, not this row.
 *
 * Every colour/dimension reads a `--uxm-segment-row-*` custom property (with a
 * token fallback) so the UXM studio knobs re-theme it.
 */
export function SegmentRow({
  name,
  count,
  open: controlledOpen,
  defaultOpen = true,
  onToggle,
  dragHandle = false,
  actions,
  className,
  ...rest
}: SegmentRowProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const toggle = () => {
    const next = !open;
    onToggle?.(next);
    if (!isControlled) setUncontrolledOpen(next);
  };

  return (
    <div className={cn('uxm-segment-row', open && 'uxm-segment-row--open', className)} {...rest}>
      {dragHandle && (
        <span className="uxm-segment-row__drag" aria-hidden="true">
          <Icon glyph="drag-handle" size={14} />
        </span>
      )}
      <span className="uxm-segment-row__accent" aria-hidden="true" />
      <button
        type="button"
        className="uxm-segment-row__toggle"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="uxm-segment-row__chevron" aria-hidden="true">
          <Icon glyph="chevron-right" size={14} strokeWidth={2} />
        </span>
        <span className="uxm-segment-row__title">{name}</span>
        {count !== undefined && (
          <span className="uxm-segment-row__count">
            {count} item{count === 1 ? '' : 's'}
          </span>
        )}
      </button>
      {actions && <span className="uxm-segment-row__actions">{actions}</span>}
    </div>
  );
}
