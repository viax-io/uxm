'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

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
  // The address that failed. Cleared whenever `src` changes (adjusted during
  // render, React's pattern for state derived from a prop), so every new
  // address, including one that failed before (A fails, B, then A again),
  // gets a fresh try.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [seenSrc, setSeenSrc] = useState(src);
  if (seenSrc !== src) {
    setSeenSrc(src);
    setFailedSrc(null);
  }
  const showImage = Boolean(src) && failedSrc !== src;
  const imgRef = useRef<HTMLImageElement>(null);

  // The latest callback, read when reporting, so an inline arrow from the
  // caller never re-runs the image check. A layout effect declared before the
  // check's, so it is current for the check and for any onLoad / onError
  // after this commit.
  const onStatusRef = useRef(onStatusChange);
  useLayoutEffect(() => {
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

  // A layout effect, so an image the browser failed before hydration is
  // swapped for the placeholder before the next paint.
  useLayoutEffect(() => {
    if (!src) {
      // Nothing to report; forget the last report so the same address coming
      // back is reported again.
      lastReport.current = null;
      return;
    }
    const img = imgRef.current;
    if (!img) return;
    if (!img.complete) {
      report(src, 'loading');
      return;
    }
    // Already finished before this effect ran. With a width it loaded. With
    // none it is either broken or an SVG without a width or height (0 in some
    // browsers), and `decode()` tells them apart: it rejects for a broken one.
    if (img.naturalWidth > 0) {
      report(src, 'loaded');
      return;
    }
    let current = true;
    if (typeof img.decode === 'function') {
      img.decode().then(
        () => current && report(src, 'loaded'),
        () => current && fail(src),
      );
    } else {
      fail(src);
    }
    return () => {
      current = false;
    };
  }, [src, report, fail]);

  // An empty ratio would set an invalid aspect-ratio with the height already
  // handed to it: a frame with no height. Treat it as no ratio.
  const ratio = aspectRatio != null && String(aspectRatio).trim() !== '' ? String(aspectRatio) : undefined;
  const rootStyle: CSSProperties | undefined = ratio
    ? ({ ['--uxm-thumbnail-aspect-ratio' as string]: ratio, ...style } as CSSProperties)
    : style;

  return (
    <div
      className={cn(
        'uxm-thumbnail',
        `uxm-thumbnail--${fit}`,
        ratio && 'uxm-thumbnail--ratio',
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
