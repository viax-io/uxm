'use client';

import { Children, useId, useState } from 'react';

import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { HTMLAttributes, ReactNode } from 'react';

export interface SegmentTreeRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Segment title (primary text). */
  name: ReactNode;
  /**
   * Item count — renders a trailing "N items" badge. Omit for no badge.
   * (Pass a fully custom trailing via `actions` instead when you need more.)
   */
  count?: number;
  /** Controlled open state. When omitted the row manages its own. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. Ignored when `open` is set. Default `true`. */
  defaultOpen?: boolean;
  /** Fires with the next open state whenever the header toggle is clicked. */
  onOpenChange?: (open: boolean) => void;
  /** Expanded body — typically the segment's component rows. */
  children?: ReactNode;
  /** Show a leading drag-handle affordance (visual only; wire your own DnD). */
  dragHandle?: boolean;
  /** Trailing slot for hover/row actions (kept outside the toggle button). */
  actions?: ReactNode;
}

/**
 * A collapsible tree node for a configuration model's segment: a header row
 * (optional drag handle · accent rail · chevron · title · item-count badge ·
 * optional actions) over a body that reveals the segment's components when
 * open. Controlled or uncontrolled, mirroring `Disclosure` / `ExplorerSection`.
 *
 * Every colour/dimension reads a `--uxm-segment-tree-row-*` custom property
 * (with a token fallback) so the UXM studio knobs re-theme it.
 */
export function SegmentTreeRow({
  name,
  count,
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
  children,
  dragHandle = false,
  actions,
  className,
  ...rest
}: SegmentTreeRowProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const bodyId = useId();
  // Only render (and advertise) a body when there's real content — an empty
  // array of children would otherwise draw an empty bordered strip.
  const hasBody = Children.count(children) > 0;

  const toggle = () => {
    const next = !open;
    onOpenChange?.(next);
    if (!isControlled) setUncontrolledOpen(next);
  };

  return (
    <div
      className={cn('uxm-segment-tree-row', open && 'uxm-segment-tree-row--open', className)}
      {...rest}
    >
      <div className="uxm-segment-tree-row__head">
        {dragHandle && (
          <span className="uxm-segment-tree-row__drag" aria-hidden="true">
            <Icon glyph="drag-handle" size={14} />
          </span>
        )}
        <span className="uxm-segment-tree-row__rail" aria-hidden="true" />
        {/* The toggle owns the caret/title/count; actions stay a sibling so we
            never nest interactive controls inside a button. */}
        <button
          type="button"
          className="uxm-segment-tree-row__toggle"
          aria-expanded={open}
          aria-controls={open && hasBody ? bodyId : undefined}
          onClick={toggle}
        >
          <span className="uxm-segment-tree-row__chevron" aria-hidden="true">
            <Icon glyph="chevron-right" size={14} strokeWidth={2} />
          </span>
          <span className="uxm-segment-tree-row__title">{name}</span>
          {count !== undefined && (
            <span className="uxm-segment-tree-row__count">
              {count} item{count === 1 ? '' : 's'}
            </span>
          )}
        </button>
        {actions && <span className="uxm-segment-tree-row__actions">{actions}</span>}
      </div>
      {open && hasBody && (
        <div id={bodyId} className="uxm-segment-tree-row__body">
          {children}
        </div>
      )}
    </div>
  );
}
