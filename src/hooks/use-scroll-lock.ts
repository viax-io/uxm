'use client';

import { useEffect } from 'react';

/**
 * Lock `document.body` scrolling while `active` is true. Compensates for
 * the disappearing scrollbar by reserving its width as right-side padding
 * so the page behind the lock doesn't shift horizontally.
 *
 * v1 assumes single-modal usage (asserted by Dialog itself). If we ever
 * need to support stacks, this hook needs a refcount keyed at module
 * scope so the LAST close — not every close — restores body styles.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [active]);
}
