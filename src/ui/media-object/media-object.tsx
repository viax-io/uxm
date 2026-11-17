import { cn } from '@/helpers';

import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react';

/** Container widths at which the media stacks above (or below) the content. */
export type MediaObjectStackAt = 480 | 640 | 768 | 960;

// `ComponentPropsWithRef`, not `HTMLAttributes`: React 19 passes `ref` as a
// plain prop and the rest spread already delivers it, but `HTMLAttributes`
// doesn't declare it, so `<MediaObject ref={…}>` was a type error (button.tsx).
export interface MediaObjectProps extends ComponentPropsWithRef<'div'> {
  /** The image, illustration, avatar or chart beside the content. */
  media: ReactNode;
  /** Which side the media sits on. Default `'start'` (left in LTR). */
  mediaPosition?: 'start' | 'end';
  /**
   * The media column's width as a grid track: `'auto'` (default, the media's
   * own width, as for an avatar), `'40%'`, `'320px'` or `'1fr'` (half and half).
   */
  mediaWidth?: string;
  /** Vertical alignment of media and content. Default `'center'`. */
  align?: 'start' | 'center' | 'end';
  /** Gap between media and content. Default 24px. */
  gap?: string | number;
  /**
   * The component's own container width at or below which it stacks to one
   * column (media first when `mediaPosition` is start, last when end).
   * Default `640`; `false` never stacks.
   */
  stackAt?: MediaObjectStackAt | false;
  children?: ReactNode;
}

/**
 * Media beside content: a hero with its illustration, a row with an avatar, a
 * card with a chart. Two columns that stack to one when the component's own
 * container is narrow, measured on the component rather than the viewport. The
 * DOM follows the visual order, so reading order and Tab order match.
 */
export function MediaObject({
  media,
  mediaPosition = 'start',
  mediaWidth,
  align = 'center',
  gap,
  stackAt = 640,
  className,
  style,
  children,
  ...rest
}: MediaObjectProps) {
  const vars: CSSProperties = {
    ...(mediaWidth !== undefined ? { ['--uxm-media-object-media-width' as string]: mediaWidth } : null),
    ...(gap !== undefined
      ? { ['--uxm-media-object-gap' as string]: typeof gap === 'number' ? `${gap}px` : gap }
      : null),
    ...style,
  };
  const mediaCell = <div className="uxm-media-object__media">{media}</div>;
  const body = <div className="uxm-media-object__body">{children}</div>;
  return (
    <div
      className={cn(
        'uxm-media-object',
        `uxm-media-object--${mediaPosition}`,
        `uxm-media-object--align-${align}`,
        stackAt !== false && `uxm-media-object--stack-${stackAt}`,
        className,
      )}
      style={vars}
      {...rest}
    >
      <div className="uxm-media-object__inner">
        {mediaPosition === 'start' ? (
          <>
            {mediaCell}
            {body}
          </>
        ) : (
          <>
            {body}
            {mediaCell}
          </>
        )}
      </div>
    </div>
  );
}
