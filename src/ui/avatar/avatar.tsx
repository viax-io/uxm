import { useEffect, useState } from 'react';

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
  // A later valid `src` should get a fresh chance to load — without this,
  // a failed image permanently pins the avatar to initials even after the
  // `src` prop changes to a working URL.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset of the failed-image flag when `src` changes
    setErrored(false);
  }, [src]);
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
