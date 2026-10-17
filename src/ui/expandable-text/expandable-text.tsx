import { cn } from '@/helpers';

import { ExpandableTextToggle } from './expandable-text-toggle';
import { useExpandableText } from './use-expandable-text';

import type { HTMLAttributes, ReactNode } from 'react';

export interface ExpandableTextProps extends HTMLAttributes<HTMLDivElement> {
  /** The text. Paragraph breaks (`\n`) survive — the content is `white-space: pre-wrap`. */
  children: ReactNode;
  /** Lines shown before the text clamps behind the toggle. Defaults to `4`. */
  lines?: number;
  /** Controlled expanded state. */
  expanded?: boolean;
  /** Initial expanded state when uncontrolled. Defaults to `false`. */
  defaultExpanded?: boolean;
  /** Fires with the next state when the toggle is pressed. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Toggle label while collapsed. Default `"Show more"`. */
  moreLabel?: string;
  /** Toggle label while expanded. Default `"Show less"`. */
  lessLabel?: string;
}

/**
 * Display-only long text for side panes and detail views: wraps in full up to
 * `lines` lines, then clamps behind a "Show more" / "Show less" link. The link
 * is rendered only when the text actually overflows (or while expanded, so it
 * can be collapsed again) — short text shows nothing extra.
 *
 * For text the user can also edit in place, see `EditableCell type="textarea"`,
 * which shares this clamp and toggle.
 */
export function ExpandableText({
  children,
  lines,
  expanded: controlledExpanded,
  defaultExpanded = false,
  onExpandedChange,
  moreLabel = 'Show more',
  lessLabel = 'Show less',
  className,
  ...rest
}: ExpandableTextProps) {
  const { expanded, toggle, contentId, contentRef, clamped, clampStyle, showToggle } = useExpandableText<HTMLDivElement>({
    lines,
    expanded: controlledExpanded,
    defaultExpanded,
    onExpandedChange,
    measureKey: children,
  });

  return (
    <div
      className={cn('uxm-expandable-text', expanded && 'uxm-expandable-text--expanded', className)}
      {...rest}
    >
      <div
        ref={contentRef}
        id={contentId}
        className={cn('uxm-expandable-text__content', clamped && 'uxm-expandable-text__content--clamped')}
        style={clampStyle}
      >
        {children}
      </div>
      {showToggle && (
        <ExpandableTextToggle
          expanded={expanded}
          contentId={contentId}
          moreLabel={moreLabel}
          lessLabel={lessLabel}
          onToggle={toggle}
        />
      )}
    </div>
  );
}
