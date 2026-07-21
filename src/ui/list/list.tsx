import { cn } from '@/helpers';

import { IconTile } from '../icon-tile';

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from 'react';

/**
 * Forward the studio icon knobs (projected as `--uxm-list-item-icon-*` on the
 * row) into the `IconTile` atom's own var namespace, so the accent-tile
 * pattern lives in one place — the `IconTile` atom — instead of being
 * re-implemented in `list.scss`. The glyph tracks the tile at 0.6× (the
 * row-icon proportion used across the design system). Kept as a module
 * constant so the studio preview can reuse the exact same forwarding.
 */
export const LIST_ITEM_ICON_TILE_STYLE = {
  '--uxm-icon-tile-bg': 'var(--uxm-list-item-icon-bg, var(--color-accent))',
  '--uxm-icon-tile-color': 'var(--uxm-list-item-icon-color, var(--color-card))',
  '--uxm-icon-tile-size': 'var(--uxm-list-item-icon-size, 24px)',
  '--uxm-icon-tile-radius': 'var(--uxm-list-item-icon-radius, 6px)',
  '--uxm-icon-tile-icon-size': 'calc(var(--uxm-list-item-icon-size, 24px) * 0.6)',
} as CSSProperties;

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function List({ children, className, ...rest }: ListProps) {
  return (
    <div className={cn('uxm-list', className)} {...rest}>
      {children}
    </div>
  );
}

/**
 * ListItem renders as one of three element types depending on `interactive`:
 *   - `<div>` (default) — display row, no state styling, not focusable
 *   - `<button>` — interactive without navigation; emits click events
 *   - `<a>` — interactive with navigation; pass `href`
 *
 * The state knobs (hover / focus / active / disabled) in the `list-item`
 * registry only paint when the row renders as button or anchor — the CSS
 * scopes them to element-type selectors so display-only divs stay inert.
 */
export interface ListItemProps {
  /** Leading icon — typically <Icon ... /> from @modo/uxm/ui. */
  icon?: ReactNode;
  /** Secondary text shown under the title (e.g. a value). */
  value?: ReactNode;
  /** Trailing content — meta text, chevron icon, or a custom node. */
  trailing?: ReactNode;
  /** Primary label. */
  children: ReactNode;
  /** Render as a clickable element. When false (default), renders as a
   *  static `<div>` with no state styling. When true, renders as
   *  `<button>` (or `<a>` if `href` is also passed). */
  interactive?: boolean;
  /** Show the selected/active treatment (only meaningful when
   *  `interactive` is true). Adds the `--active` modifier class. */
  active?: boolean;
  /** Disable interaction — only meaningful when `interactive`.
   *  Forwards to the native `disabled` attribute on `<button>`, or
   *  sets `aria-disabled` on `<a>`. */
  disabled?: boolean;
  /** Navigate to this URL on click. Implies `interactive`. */
  href?: string;
  className?: string;
}

type AnchorRest = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof ListItemProps
>;
type ButtonRest = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  keyof ListItemProps
>;
type DivRest = Omit<HTMLAttributes<HTMLDivElement>, keyof ListItemProps>;

export function ListItem({
  icon,
  value,
  trailing,
  children,
  interactive,
  active,
  disabled,
  href,
  className,
  ...rest
}: ListItemProps & (AnchorRest | ButtonRest | DivRest)) {
  const classes = cn(
    'uxm-list-item',
    active && 'uxm-list-item--active',
    className,
  );
  const isInteractive = interactive || href !== undefined;
  const inner = (
    <>
      {icon && (
        <IconTile className="uxm-list-item__icon" style={LIST_ITEM_ICON_TILE_STYLE}>
          {icon}
        </IconTile>
      )}
      <span className="uxm-list-item__content">
        <span className="uxm-list-item__title">{children}</span>
        {value !== undefined && value !== null && (
          <span className="uxm-list-item__value">{value}</span>
        )}
      </span>
      {trailing && <span className="uxm-list-item__trailing">{trailing}</span>}
    </>
  );

  if (href !== undefined) {
    return (
      <a
        href={href}
        className={classes}
        {...(disabled ? { 'aria-disabled': true as const, tabIndex: -1 } : {})}
        {...(rest as AnchorRest)}
      >
        {inner}
      </a>
    );
  }
  if (isInteractive) {
    return (
      <button
        type="button"
        className={classes}
        disabled={disabled}
        aria-pressed={active}
        {...(rest as ButtonRest)}
      >
        {inner}
      </button>
    );
  }
  return (
    <div
      className={classes}
      {...(disabled ? { 'aria-disabled': true as const } : {})}
      {...(rest as DivRest)}
    >
      {inner}
    </div>
  );
}
