import { cn } from '@/helpers';

import type { CSSProperties, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  shadow?: boolean;
  /**
   * Inner padding of the card surface. Number → px (`24` → `24px`); string
   * passed through. Any value — no fixed scale. Sets `--uxm-card-padding`;
   * omitted, the CSS fallback (24px) applies.
   */
  padding?: number | string;
  /**
   * Vertical gap between the card's direct children — e.g. a header and the
   * content group below it. When set, the card lays its children out as a
   * column (the `uxm-card--gap` modifier) with this gap. Pass `true` to opt
   * into the column with the themed default gap (`--uxm-card-gap`, editable
   * in the workbench) instead of a per-instance value.
   *
   * The card does NOT own the arrangement *within* the content. If you want
   * rows, a horizontal cluster, or a grid, compose a `Stack`/`Cluster`/
   * `ResponsiveGrid` as a child — that layout applies to the content only and
   * leaves the header untouched.
   */
  gap?: number | string | boolean;
}

const toLen = (v: number | string): string => (typeof v === 'number' ? `${v}px` : v);

/**
 * `Card` — a surface primitive (background, border, radius, padding, optional
 * shadow) with an optional vertical `gap` between its direct children. It is
 * deliberately unopinionated about content layout: arrange the content by
 * composing `Stack`/`Cluster`/`ResponsiveGrid` inside, so the arrangement
 * scopes to the content and a header stacked above it stays put.
 */
export function Card({
  className,
  shadow,
  padding,
  gap,
  style,
  ...rest
}: CardProps) {
  const mergedStyle: CSSProperties = {
    ...(padding != null ? { ['--uxm-card-padding' as string]: toLen(padding) } : null),
    // Explicit gap value → per-instance override of the `--uxm-card-gap` var
    // the `--gap` modifier reads. `gap={true}` sets no var, so the themed
    // default (workbench knob / stylesheet) owns the rhythm.
    ...(gap != null && typeof gap !== 'boolean'
      ? { ['--uxm-card-gap' as string]: toLen(gap) }
      : null),
    ...style,
  };

  return (
    <div
      className={cn(
        'uxm-card',
        shadow && 'uxm-card--shadow',
        // A vertical column only when a gap is requested — otherwise a plain
        // block, so existing cards are unaffected.
        gap != null && gap !== false && 'uxm-card--gap',
        className,
      )}
      style={mergedStyle}
      {...rest}
    />
  );
}
