import { cn } from '@/helpers';

import { Icon } from '../icon';
import { IconTile } from '../icon-tile';

import type {
  AnchorHTMLAttributes,
  ChangeEvent,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  LabelHTMLAttributes,
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

/**
 * Forward the row's media-size knob into the size vars of the atoms that
 * plausibly fill the `media` slot, so each one sizes itself through its OWN
 * machinery — frame, border, radius and inner glyph / initials all scale with
 * it — instead of being stretched from the outside. Mirrors
 * `LIST_ITEM_ICON_TILE_STYLE` above, and is the only order-independent fix:
 * both `Thumbnail` (`.uxm-thumbnail`, 0,1,0 but imported AFTER list in
 * `styles.css`) and `Avatar` (double-class size presets at 0,2,0, deliberately
 * so per its own note) would otherwise win or lose the cascade against a slot
 * rule purely on stylesheet order. The generic `> *` stretch in `list.scss`
 * stays as the fallback for a bare `<img>` / `<svg>` or any atom with no size
 * var of its own; both mechanisms resolve to the same number. Kept as a module
 * constant so the studio preview can reuse the exact same forwarding.
 */
export const LIST_ITEM_MEDIA_STYLE = {
  '--uxm-thumbnail-size': 'var(--uxm-list-item-media-size, 36px)',
  '--uxm-avatar-size': 'var(--uxm-list-item-media-size, 36px)',
  '--uxm-avatar-small-size': 'var(--uxm-list-item-media-size, 36px)',
} as CSSProperties;

/** Container presentation. See `ListProps.variant`. */
export type ListVariant = 'card' | 'plain';

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * Container presentation. `card` (default) keeps the bordered, rounded
   * surface — right for a free-standing list on a page ground. `plain` drops
   * the background, border and radius for a list that is ALREADY inside a
   * surface (a flexpane body, a card body, a disclosure section), where a card
   * container reads as a card inside a card.
   *
   * `plain` also releases `overflow` to `visible`. The card has to clip so rows
   * cannot spill past its radius; with no radius there is nothing to clip to,
   * and `hidden` would only crop what a row deliberately renders OUTSIDE the
   * container box — an overhanging corner control, a focus ring with a positive
   * offset. Clipped, those are neither painted nor hit-testable.
   *
   * Row styling is untouched — every `--uxm-list-item-*` knob behaves
   * identically in both.
   */
  variant?: ListVariant;
}

export function List({ children, className, variant = 'card', ...rest }: ListProps) {
  return (
    <div
      className={cn('uxm-list', variant === 'plain' && 'uxm-list--plain', className)}
      {...rest}
    >
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
  /** Leading media rendered as-is (a <Thumbnail>, <img>, avatar…) — NOT
   *  wrapped in the accent `IconTile` the `icon` slot uses. Mutually
   *  exclusive with `icon`: when both are passed, `media` wins. The slot
   *  box is `--uxm-list-item-media-size` (36px) square; a `Thumbnail` or
   *  `Avatar` gets that size forwarded into its own size var (see
   *  `LIST_ITEM_MEDIA_STYLE`) and anything else is stretched to fill, so
   *  rows stay on one leading grid either way.
   *
   *  Prefer decorative media in a row whose title already names the thing
   *  (`alt=""`): the slot sits INSIDE the row's `<button>`/`<a>`, so a
   *  described image is concatenated into the row's accessible name.
   *
   *  Note: this shadows the native `media` attribute of `<a>` for the
   *  anchor form of the row — pass it through `className`/a wrapper if
   *  you genuinely need the HTML attribute. */
  media?: ReactNode;
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
  /**
   * Controlled selection state. Passing `selected` OR `onSelectedChange` puts
   * the row in **selectable** mode: it renders as a `<label>` around a real
   * checkbox, so activating anywhere on the row toggles it natively — the
   * shape for "tick several, then commit" lists (a product picker, recipients,
   * file selection).
   *
   * Distinct from `active`, which is a *toggle button* (`aria-pressed`) —
   * the wrong semantic for a member of a checkable set. The two can still
   * combine if a consumer wants the row-fill as well as the tick.
   *
   * Mutually exclusive with `interactive` / `href`: a row either navigates or
   * is ticked, and selectable mode wins if both are passed (dev warning).
   */
  selected?: boolean;
  /** Toggle handler for selectable mode; `next` is the new checked state. */
  onSelectedChange?: (next: boolean, e: ChangeEvent<HTMLInputElement>) => void;
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
// Selectable rows render a <label>, whose handlers are typed to
// HTMLLabelElement — a DivRest cast does not fit it.
type LabelRest = Omit<LabelHTMLAttributes<HTMLLabelElement>, keyof ListItemProps>;

export function ListItem({
  icon,
  media,
  value,
  trailing,
  children,
  interactive,
  active,
  disabled,
  href,
  selected,
  onSelectedChange,
  className,
  ...rest
}: ListItemProps & (AnchorRest | ButtonRest | DivRest | LabelRest)) {
  const isSelectable = selected !== undefined || onSelectedChange !== undefined;
  const classes = cn(
    'uxm-list-item',
    active && 'uxm-list-item--active',
    isSelectable && 'uxm-list-item--selectable',
    className,
  );
  const isInteractive = (interactive || href !== undefined) && !isSelectable;

  if (
    process.env.NODE_ENV !== 'production' &&
    isSelectable &&
    (interactive || href !== undefined)
  ) {
     
    console.warn(
      '[uxm] ListItem: `selected`/`onSelectedChange` cannot be combined with `interactive`/`href` — ' +
        'a row is either a navigate/activate row or a member of a checkable set. Selectable mode wins.',
    );
  }
  const inner = (
    <>
      {/* Selection affordance, before the leading slot. It renders `Checkbox`'s
          OWN classes rather than nesting the component: `Checkbox` is itself a
          `<label>`, and a `<label>` inside the row `<label>` is invalid HTML
          (Chrome tolerates it — measured, one change event either way — but the
          spec does not, and assistive tech is not guaranteed to). Reusing the
          classes keeps the box pixel-identical and re-tints with the checkbox's
          own knobs, at the cost of a coupling to its internals: `list-item.test`
          asserts these classes still match what `Checkbox` renders, so a change
          there fails here rather than shipping an unstyled box. */}
      {isSelectable && (
        <span className="uxm-list-item__check">
          <input
            type="checkbox"
            className="uxm-checkbox__input"
            // `?? false`, never a bare `undefined`: selectable mode is
            // documented as controlled, and a consumer deriving it from async
            // data (`selected={data?.picked.includes(id)}`) would otherwise
            // hand React an uncontrolled input that turns controlled the
            // moment the data lands — React warns, and until it does the DOM
            // owns the checked state, so a tick made while loading is taken
            // over instead of reported. `RadioGroup` pins its own mode for the
            // component's lifetime for exactly this reason.
            checked={selected ?? false}
            disabled={disabled}
            onChange={(e) => onSelectedChange?.(e.target.checked, e)}
          />
          <span className="uxm-checkbox__box" aria-hidden="true">
            <Icon glyph="check" strokeWidth={3} />
          </span>
        </span>
      )}
      {/* Leading slot. `media` renders as-is so a product photo / avatar
          keeps its own frame; `icon` keeps the accent IconTile treatment.
          `media` wins when both are passed — a row has one leading grid
          position, and the as-is rendering is the more specific intent. */}
      {media ? (
        <span className="uxm-list-item__media" style={LIST_ITEM_MEDIA_STYLE}>
          {media}
        </span>
      ) : (
        icon && (
          <IconTile className="uxm-list-item__icon" style={LIST_ITEM_ICON_TILE_STYLE}>
            {icon}
          </IconTile>
        )
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

  if (isSelectable) {
    // A real `<label>`: whole-row activation is the browser's, not a click
    // handler's, so it works for pointer and keyboard and needs no ARIA of its
    // own. The row is NOT `aria-pressed` — that is a toggle button, the wrong
    // semantic for one member of a checkable set.
    return (
      <label
        className={classes}
        {...(disabled ? { 'aria-disabled': true as const } : {})}
        {...(rest as LabelRest)}
      >
        {inner}
      </label>
    );
  }

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
