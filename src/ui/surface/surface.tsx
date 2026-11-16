import { cn } from '@/helpers';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

/** The theme a Surface paints in, whatever the page around it. */
export type SurfaceTheme = 'dark' | 'light';

/** The element a Surface renders as. */
export type SurfaceElement = 'div' | 'section' | 'aside' | 'header' | 'footer' | 'nav' | 'article';

export interface SurfaceProps extends HTMLAttributes<HTMLElement> {
  /**
   * Paint this panel, and every atom inside it, in `'dark'` or `'light'`
   * whatever the page's theme: a dark header or dock on a light page, a light
   * card area in a dark app. Sets `data-theme` on the element, so the theme's
   * tokens apply to the whole subtree. Omitted, the panel follows the page.
   */
  theme?: SurfaceTheme;
  /** The element to render. Default `'div'`; a header strip reads better as `'header'`. */
  as?: SurfaceElement;
  /**
   * Inner padding. Number → px (`24` → `24px`); a string is passed through.
   * Sets `--uxm-surface-padding`; omitted, the themed default (24px) applies.
   */
  padding?: number | string;
  children?: ReactNode;
}

/**
 * A panel that sets its own theme: a dark header strip or "what happens next"
 * dock on a light page, or a light area inside a dark app. It paints its
 * background and text colour from the theme's tokens, so plain text inside it
 * reads too, and every atom inside follows the same tokens. Knobs that are
 * tokens (the defaults) follow the panel; a knob saved as a fixed colour is
 * the same in every panel.
 */
export function Surface({
  theme,
  as: Tag = 'div',
  padding,
  className,
  style,
  children,
  ...rest
}: SurfaceProps) {
  // Only the two themes tokens.css scopes; anything else (an untyped caller's
  // 'auto') sets no scope rather than an attribute nothing matches.
  const scope = theme === 'dark' || theme === 'light' ? theme : undefined;
  const vars: CSSProperties = {
    ...(padding != null
      ? { ['--uxm-surface-padding' as string]: typeof padding === 'number' ? `${padding}px` : padding }
      : null),
    ...style,
  };
  return (
    <Tag
      className={cn('uxm-surface', scope && `uxm-surface--${scope}`, className)}
      style={vars}
      {...rest}
      // After the spread: the attribute must agree with the class (and its
      // color-scheme), so a stray data-theme in rest can't split them.
      data-theme={scope}
    >
      {children}
    </Tag>
  );
}
