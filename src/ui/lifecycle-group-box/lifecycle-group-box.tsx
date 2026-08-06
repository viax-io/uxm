import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export interface LifecycleGroupBoxProps extends HTMLAttributes<HTMLDivElement> {
  /** Drop-target highlight while a drag is over this group. */
  target?: boolean;
  /** Can receive pointer events / drops. Read-only diagrams pass false. */
  interactive?: boolean;
  /** Usually none — the box is a frame behind the cards, not a container. */
  children?: ReactNode;
}

/**
 * The frame drawn around the sibling nodes of one lifecycle group. On an
 * editable diagram it doubles as the drop zone for adding a member to that
 * group. Visual language of a region — no business logic.
 *
 * Position and size come from the consumer (the box is `position: absolute`),
 * the same contract `LifecycleEdgeLabel` documents: the canvas owns geometry,
 * the atom owns look and states.
 *
 * Three decisions worth keeping:
 *
 * - **Frosted, not solid.** A translucent card tint over the blurred canvas
 *   reads as a region; a solid fill makes the nodes inside look *nested*,
 *   which is a different semantic.
 * - **`pointer-events: none` by default.** The frame paints over its own
 *   members, so on a read-only diagram it must not swallow their hover or
 *   clicks. `interactive` is what turns it into a target.
 * - **No title slot.** A group's name is an editable, clickable pill on the
 *   frame's edge (a `Chip` the canvas positions above the box) — this atom is
 *   the frame, and grows no title zone.
 *
 * Extending `HTMLAttributes<HTMLDivElement>` is part of the contract, not
 * boilerplate: the consumer hangs `onDragEnter` / `onDragOver` /
 * `onDragLeave` / `onDrop` and its own `data-*` straight on the box.
 */
export function LifecycleGroupBox({
  target = false,
  interactive = false,
  className,
  children,
  ...rest
}: LifecycleGroupBoxProps) {
  return (
    <div
      {...rest}
      className={cn(
        'uxm-lifecycle-group-box',
        interactive && 'uxm-lifecycle-group-box--interactive',
        target && 'uxm-lifecycle-group-box--target',
        className,
      )}
    >
      {children}
    </div>
  );
}
