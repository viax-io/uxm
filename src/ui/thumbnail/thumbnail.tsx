'use client';

import { useState } from 'react';

import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { HTMLAttributes, ReactNode } from 'react';

export type ThumbnailFit = 'cover' | 'contain';

export interface ThumbnailProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fit?: ThumbnailFit;
  fallback?: ReactNode;
}

export function Thumbnail({
  src,
  alt,
  fit = 'cover',
  fallback,
  className,
  ...rest
}: ThumbnailProps) {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(src) && !errored;

  return (
    <div
      className={cn('uxm-thumbnail', `uxm-thumbnail--${fit}`, className)}
      {...rest}
    >
      {showImage ? (
        <img
          className="uxm-thumbnail__image"
          src={src}
          alt={alt ?? ''}
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="uxm-thumbnail__placeholder" aria-hidden>
          {fallback ?? <Icon glyph="image" />}
        </span>
      )}
    </div>
  );
}
