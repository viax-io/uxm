import { Children } from 'react';

import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export interface SegmentCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The segment's header row — typically a `<SegmentRow>` or any
   * title/drag/count node. Rendered flush at the top of the card.
   */
  header?: ReactNode;
  /**
   * Show a hairline divider between the header and the inset body. Only drawn
   * when there is both a header and body content. Default `true`.
   */
  divider?: boolean;
  /** Inset child rows — the nested segment's component rows. */
  children?: ReactNode;
}

/**
 * Bordered card that wraps a nested configuration segment (depth ≥ 1): a
 * header slot, an optional divider, and an inset body holding the segment's
 * child rows. Top-level segments render their rows without this wrapper.
 *
 * Every colour/dimension reads a `--uxm-segment-card-*` custom property (with
 * a token fallback) so the UXM studio knobs re-theme it.
 */
export function SegmentCard({ header, divider = true, children, className, ...rest }: SegmentCardProps) {
  const hasBody = Children.count(children) > 0;

  return (
    <div className={cn('uxm-segment-card', className)} {...rest}>
      {header && <div className="uxm-segment-card__header">{header}</div>}
      {header && hasBody && divider && (
        <div className="uxm-segment-card__divider" aria-hidden="true" />
      )}
      {hasBody && <div className="uxm-segment-card__body">{children}</div>}
    </div>
  );
}
