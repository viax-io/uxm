import { cn } from '@/helpers';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/**
 * Container widths at which a `columns` grid collapses to one column. A closed
 * set because a size container query can't read a custom property: each value
 * is its own `@container` block in the stylesheet (as `DataTable`'s `stackAt`).
 */
export type ResponsiveGridStackAt = 480 | 640 | 768 | 960;

export interface ResponsiveGridProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Minimum column width before the grid wraps a child onto the next row.
   * Drives `grid-template-columns: repeat(auto-fit, minmax(min, 1fr))` —
   * the browser figures out how many columns fit, no media queries required.
   * Accepts any CSS length: "200px", "20rem", "20ch", etc. Defaults to 200px.
   * Ignored when `columns` is set.
   */
  min?: string;
  /** Gap between cells. Defaults to 16px. */
  gap?: string | number;
  /**
   * Fixed columns instead of auto-fit: a count (`3` → three equal columns) or
   * a track list (`"2fr 1fr"`, `"240px 1fr"`). Children span tracks with
   * `GridItem`. The grid collapses to one column at `stackAt`.
   */
  columns?: number | string;
  /**
   * With `columns`, the width of the grid's own container at or below which it
   * collapses to one column (and every `GridItem` span resets). Default `480`;
   * `false` never collapses. Ignored without `columns`.
   */
  stackAt?: ResponsiveGridStackAt | false;
  children?: ReactNode;
}

/**
 * The responsive workhorse — drop N children inside, the browser lays them
 * out as many-columns when there's room and single-column when there isn't,
 * with no breakpoint scaffolding. The same instance behaves correctly inside
 * a wide dashboard pane and inside a narrow side flexpane.
 *
 * With `columns` it lays out fixed or weighted tracks instead (`"2fr 1fr"`, a
 * bento of spans), and collapses to one column in a narrow container. That
 * mode measures its own width, so it renders a container root around the grid
 * track; the default auto-fit mode keeps its single element.
 *
 * Theming knobs live on `--uxm-responsive-grid-{min,gap}` so the editor can
 * tune the wrap point and gap globally. The component's own props win when
 * present (the editor overrides serve as defaults).
 */
export function ResponsiveGrid({
  min,
  gap,
  columns,
  stackAt = 480,
  className,
  style,
  children,
  ...rest
}: ResponsiveGridProps) {
  const mergedStyle: CSSProperties = {
    ...(min !== undefined ? { ['--uxm-responsive-grid-min' as string]: min } : null),
    ...(gap !== undefined
      ? { ['--uxm-responsive-grid-gap' as string]: typeof gap === 'number' ? `${gap}px` : gap }
      : null),
    ...(columns !== undefined
      ? {
          ['--uxm-responsive-grid-columns' as string]:
            typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns,
        }
      : null),
    ...style,
  };

  if (columns === undefined) {
    return (
      <div className={cn('uxm-responsive-grid', className)} style={mergedStyle} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'uxm-responsive-grid',
        'uxm-responsive-grid--columns',
        stackAt !== false && `uxm-responsive-grid--stack-${stackAt}`,
        className,
      )}
      style={mergedStyle}
      {...rest}
    >
      <div className="uxm-responsive-grid__track">{children}</div>
    </div>
  );
}

export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns this item spans in a `columns` grid; `'full'` spans every track. */
  span?: number | 'full';
  /** Rows this item spans. */
  rowSpan?: number;
  children?: ReactNode;
}

/**
 * One cell of a `ResponsiveGrid` with `columns` that spans more than one track
 * (a wide hero card, a tall side panel). Plain children are single cells; use
 * this only where a cell spans. Put it directly in the grid: the spans reset
 * when the grid collapses. In an auto-fit grid (no `columns`) nothing resets
 * them, so a span can overflow a container that fits one column.
 */
export function GridItem({ span, rowSpan, className, style, ...rest }: GridItemProps) {
  const spanStyle: CSSProperties = {
    ...(span !== undefined
      ? { ['--uxm-grid-item-column' as string]: span === 'full' ? '1 / -1' : `span ${span}` }
      : null),
    ...(rowSpan !== undefined ? { ['--uxm-grid-item-row' as string]: `span ${rowSpan}` } : null),
    ...style,
  };
  return <div className={cn('uxm-grid-item', className)} style={spanStyle} {...rest} />;
}
