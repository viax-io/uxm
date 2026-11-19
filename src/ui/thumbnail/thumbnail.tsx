'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export type ThumbnailFit = 'cover' | 'contain';

/** How the image is doing: still coming in, shown, or failed (the placeholder shows). */
export type ThumbnailStatus = 'loading' | 'loaded' | 'error';

export interface ThumbnailProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fit?: ThumbnailFit;
  fallback?: ReactNode;
  /**
   * Give the frame a shape instead of a square: `'16 / 9'` or `1.5`. The
   * height then follows the width (`--uxm-thumbnail-width`, default the size
   * knob), so `style={{ '--uxm-thumbnail-width': '100%' }}` with
   * `aspectRatio="16 / 9"` is a picture as wide as its card.
   */
  aspectRatio?: string | number;
  /**
   * Called as the image starts loading, loads or fails, once per status per
   * `src`, including a load or failure that happened before hydration. Not
   * called without a `src`. Use it to show something other than the
   * placeholder when the image fails (a row's icon tile, nothing at all).
   */
  onStatusChange?: (status: ThumbnailStatus) => void;
}

/**
 * A bounded image frame with a placeholder when there is no image or it
 * fails. The failure is remembered for the address that failed, so a new
 * `src` gets a fresh try without re-keying the component. After mount it also
 * asks the `<img>` whether the browser already finished with it: on a page
 * rendered on the server the image can load or fail before React attaches
 * `onLoad` / `onError`.
 */
export function Thumbnail({
  src,
  alt,
  fit = 'cover',
  fallback,
  aspectRatio,
  onStatusChange,
  className,
  style,
  ...rest
}: ThumbnailProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;
  const imgRef = useRef<HTMLImageElement>(null);

  // The latest callback, read when reporting, so an inline arrow from the
  // caller never re-runs the image check. Declared before the check's effect,
  // so it is current when that runs in the same commit.
  const onStatusRef = useRef(onStatusChange);
  useEffect(() => {
    onStatusRef.current = onStatusChange;
  });
  const lastReport = useRef<{ src: string; status: ThumbnailStatus } | null>(null);

  const report = useCallback((forSrc: string, status: ThumbnailStatus) => {
    const last = lastReport.current;
    if (last && last.src === forSrc && last.status === status) return;
    lastReport.current = { src: forSrc, status };
    onStatusRef.current?.(status);
  }, []);

  const fail = useCallback(
    (forSrc: string) => {
      setFailedSrc(forSrc);
      report(forSrc, 'error');
    },
    [report],
  );

  useEffect(() => {
    const img = imgRef.current;
    if (!src || !img) return;
    if (!img.complete) {
      report(src, 'loading');
      return;
    }
    // Already finished before this effect ran: loaded or broken. `decode()`
    // tells them apart (it rejects for a broken image); `naturalWidth` alone
    // would call an SVG without a width or height broken in some browsers.
    let current = true;
    if (typeof img.decode === 'function') {
      img.decode().then(
        () => current && report(src, 'loaded'),
        () => current && fail(src),
      );
    } else if (img.naturalWidth === 0) {
      fail(src);
    } else {
      report(src, 'loaded');
    }
    return () => {
      current = false;
    };
  }, [src, report, fail]);

  const rootStyle: CSSProperties | undefined =
    aspectRatio != null
      ? ({ ['--uxm-thumbnail-aspect-ratio' as string]: String(aspectRatio), ...style } as CSSProperties)
      : style;

  return (
    <div
      className={cn(
        'uxm-thumbnail',
        `uxm-thumbnail--${fit}`,
        aspectRatio != null && 'uxm-thumbnail--ratio',
        className,
      )}
      style={rootStyle}
      {...rest}
    >
      {showImage ? (
        <img
          ref={imgRef}
          className="uxm-thumbnail__image"
          src={src}
          alt={alt ?? ''}
          onLoad={() => src && report(src, 'loaded')}
          onError={() => src && fail(src)}
        />
      ) : (
        <span className="uxm-thumbnail__placeholder" aria-hidden>
          {fallback ?? <Icon glyph="image" />}
        </span>
      )}
    </div>
  );
}
