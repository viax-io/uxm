'use client';

import { useState } from 'react';

import { cn } from '@/helpers';

import type { HTMLAttributes } from 'react';

export type AvatarType = 'text' | 'image';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  type?: AvatarType;
  initials?: string;
  src?: string;
  alt?: string;
}

export function Avatar({
  type = 'text',
  initials,
  src,
  alt,
  className,
  ...rest
}: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = type === 'image' && Boolean(src) && !errored;
  const text = initials ? initials.slice(0, 2).toUpperCase() : null;

  return (
    <span
      className={cn('uxm-avatar', `uxm-avatar--${type}`, className)}
      aria-hidden={alt || initials ? undefined : 'true'}
      {...rest}
    >
      {showImage ? (
        <img
          className="uxm-avatar__image"
          src={src}
          alt={alt ?? ''}
          onError={() => setErrored(true)}
        />
      ) : (
        text
      )}
    </span>
  );
}
