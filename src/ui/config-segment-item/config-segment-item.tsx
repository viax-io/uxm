import { cn } from '@/helpers';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

// Drop two native button attributes from the props surface, mirroring
// ConfigComponentRow's sibling row atom:
//   - `type`: we always render `<button type="button">` so this row can
//     never accidentally submit a parent form — the native attribute isn't
//     a knob consumers should be able to override here.
//   - `name`: HTML form-control name; consumers mean the segment's display
//     name (ReactNode) when they say "name".
export interface ConfigSegmentItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'name'> {
  /** Segment name (primary text). */
  name: ReactNode;
  /**
   * Optional small line below the name. Typical use: "{n} components" so the
   * segment row carries a quick gauge of how full this segment is.
   */
  meta?: ReactNode;
  /** Render the active (selected) state. */
  active?: boolean;
}

/**
 * Left-pane row in a Configuration model's segment list. A segment groups a
 * set of components (Account Profile → Account Name, Account Type, …); the
 * user selects one segment at a time and edits its components in the middle
 * pane. Active state is "selected" (not navigated-to), so this renders as a
 * `<button>` rather than a link.
 */
export function ConfigSegmentItem({
  name,
  meta,
  active,
  className,
  ...rest
}: ConfigSegmentItemProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'uxm-config-segment-item',
        active && 'uxm-config-segment-item--active',
        className,
      )}
      {...rest}
    >
      <span className="uxm-config-segment-item__name">{name}</span>
      {meta && <span className="uxm-config-segment-item__meta">{meta}</span>}
    </button>
  );
}
