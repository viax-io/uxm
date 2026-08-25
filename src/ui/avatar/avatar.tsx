import { useEffect, useState } from 'react';

import { cn } from '@/helpers';

import type { HTMLAttributes } from 'react';

export type AvatarType = 'text' | 'image';

export type AvatarSize = 'small' | 'medium';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  type?: AvatarType;
  /**
   * Preset size. `medium` (default) is the 40px avatar — a top-bar or list row.
   * `small` is 32px, sized to sit in a collapsed sidebar rail beside 32x32 nav
   * tiles.
   *
   * A preset and not a number, because the diameter and the initials are two
   * separate variables (`--uxm-avatar-size`, `--uxm-avatar-font-size`) that do
   * NOT scale together: shrink the circle alone and the 16px initials stay put.
   * Measured, a two-character run is 22.1px wide at 16px — 0.55 of a 40px
   * circle, 0.69 of a 32px one, 0.92 of a 24px one, i.e. text against the rim.
   * `small` pairs 32px with 13px, holding the ratio at 0.57. The preset moves
   * both at once so they cannot drift.
   */
  size?: AvatarSize;
  initials?: string;
  src?: string;
  alt?: string;
}

export function Avatar({
  type = 'text',
  size = 'medium',
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
      className={cn('uxm-avatar', `uxm-avatar--${type}`, `uxm-avatar--${size}`, className)}
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
