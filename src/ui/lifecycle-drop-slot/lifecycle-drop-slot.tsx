import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { HTMLAttributes, ReactNode } from 'react';

export type LifecycleDropSlotShape = 'card' | 'pill';

export interface LifecycleDropSlotProps extends HTMLAttributes<HTMLDivElement> {
  /** `card` = node-sized rectangle, `pill` = group-pill sized. */
  shape?: LifecycleDropSlotShape;
  /** Text; without it a card shows the plus glyph alone. */
  label?: ReactNode;
  /** Accepts drops. The card slot passes true; a preview placeholder stays false. */
  interactive?: boolean;
}

/**
 * The dashed slot that shows where a dragged node can land. Two shapes:
 * card-sized, standing in for the node a drop would create, and pill-sized,
 * standing in for the group.
 *
 * **One appearance, no states.** The slot exists only while it *is* the target:
 * it is created for the hovered zone and removed when the cursor leaves. Its
 * appearance is the signal, so there is no quiet variant to fall back to — and
 * nothing on the canvas has to stay legible at a contrast a placeholder can't
 * carry.
 *
 * `interactive` is off by default: a card slot standing in a real drop zone
 * passes `true`, while a preview placeholder — the pill showing the group a drop
 * would mint, sitting under the cursor — stays `false` so the drag can't flicker
 * between it and the real slot.
 *
 * Position, size and the drag handlers are the consumer's, the same contract
 * `LifecycleEdgeLabel` documents: `HTMLAttributes<HTMLDivElement>` is extended
 * so `onDragOver` / `onDrop` and `data-*` go straight on the slot.
 */
export function LifecycleDropSlot({
  shape = 'card',
  label,
  interactive = false,
  className,
  ...rest
}: LifecycleDropSlotProps) {
  return (
    <div
      {...rest}
      className={cn(
        'uxm-lifecycle-drop-slot',
        `uxm-lifecycle-drop-slot--${shape}`,
        interactive && 'uxm-lifecycle-drop-slot--interactive',
        className,
      )}
    >
      {/* Nullish, not falsy: `label={0}` is a legitimate label, and an empty
          string is a caller mistake worth seeing rather than papering over. */}
      {label ?? <Icon glyph="plus" size={16} aria-hidden="true" />}
    </div>
  );
}
