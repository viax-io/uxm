import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Heading text — rendered uppercase by default. */
  children: ReactNode;
  /**
   * Optional trailing slot — typically an `<InlineAction>` like
   * "Reset section" or a small status indicator. Right-aligned.
   */
  trailing?: ReactNode;
  /**
   * Optional subtitle line below the heading — for context like
   * "Per Mode · Active value: 600." Shown only when provided.
   */
  subtitle?: ReactNode;
  /**
   * Heading level, 2–6. Defaults to `4` — unchanged from before this prop
   * existed. Only the consumer knows how deep this header sits, and an
   * `<h4>` under an `<h2>` skips a level, which leaves screen-reader users
   * navigating by heading unable to tell how the sections nest. Set it to
   * whatever follows the nearest heading above this one.
   *
   * Styling is identical at every level — the class does the visual work, so
   * changing this only moves the header in the document outline.
   */
  level?: 2 | 3 | 4 | 5 | 6;
}

/**
 * Small uppercase section header used in dense settings / properties /
 * forms panels — the "VARIANT" / "COLORS" / "STYLE" labels above
 * grouped fields. Distinct from `PageHeader` (page-level, larger,
 * larger heading + meta) and `DetailSection` (bordered card with
 * an icon and accent rail).
 *
 * The heading renders as `<h4>` by default and contributes to the document
 * outline — pass `level` when that is the wrong depth for the page. An
 * optional trailing slot is inline with the heading; an optional
 * subtitle drops below.
 */
export function SectionHeader({
  children,
  trailing,
  subtitle,
  level = 4,
  className,
  ...rest
}: SectionHeaderProps) {
  const Heading = `h${level}` as const;
  return (
    <div className={cn('uxm-section-header', className)} {...rest}>
      <div className="uxm-section-header__row">
        <Heading className="uxm-section-header__title">{children}</Heading>
        {trailing && (
          <span className="uxm-section-header__trailing">{trailing}</span>
        )}
      </div>
      {subtitle && (
        <div className="uxm-section-header__subtitle">{subtitle}</div>
      )}
    </div>
  );
}
