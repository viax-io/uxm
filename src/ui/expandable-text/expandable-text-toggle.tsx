import { cn } from '@/helpers';

import { Icon } from '../icon';

export interface ExpandableTextToggleProps {
  expanded: boolean;
  /** Id of the clamped element this button discloses. */
  contentId: string;
  moreLabel: string;
  lessLabel: string;
  onToggle: () => void;
  className?: string;
}

/**
 * The "Show more" / "Show less" link. Internal: `ExpandableText` and
 * `EditableCell type="textarea"` render it so the two never drift apart — it is
 * not exported from the package.
 */
export function ExpandableTextToggle({
  expanded,
  contentId,
  moreLabel,
  lessLabel,
  onToggle,
  className,
}: ExpandableTextToggleProps) {
  return (
    <button
      type="button"
      className={cn('uxm-expandable-text__toggle', className)}
      aria-expanded={expanded}
      aria-controls={contentId}
      onClick={onToggle}
    >
      {expanded ? lessLabel : moreLabel}
      <Icon glyph={expanded ? 'chevron-up' : 'chevron-down'} size={13} />
    </button>
  );
}
