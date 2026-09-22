import { cn } from '@/helpers';
import {
  ButtonGhost,
  ButtonPrimary,
  ButtonSecondary,
  ButtonTertiary,
} from '@/ui/button';
import { Icon } from '@/ui/icon';
import type { PopoverPlacement } from '@/ui/popover';

import { Menu } from './menu';

import type { MenuEntry } from './menu';
import type { ComponentPropsWithRef, ReactNode } from 'react';

/** Which shipped button renders the trigger. */
export type MenuButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost';

const TRIGGER: Record<
  MenuButtonVariant,
  (props: ComponentPropsWithRef<'button'>) => ReactNode
> = {
  primary: ButtonPrimary,
  secondary: ButtonSecondary,
  tertiary: ButtonTertiary,
  ghost: ButtonGhost,
};

export interface MenuButtonProps {
  /** Menu entries — the same `MenuEntry[]` `Menu` takes. */
  items: MenuEntry[];
  /** Button label. */
  children: ReactNode;
  /** Which shipped button renders the trigger. Default `secondary`. */
  variant?: MenuButtonVariant;
  /** Optional leading icon, before the label. */
  icon?: ReactNode;
  /**
   * Trailing dropdown affordance. Default a `chevron-down` that rotates while
   * the menu is open; pass `false` to omit it (for a trigger whose label
   * already reads as a menu, or where space is tight).
   */
  chevron?: boolean;
  /** Forwarded to `Menu`. Default `bottom-end`, as `Menu`'s own default. */
  placement?: PopoverPlacement;
  /** Disables the trigger. The menu cannot be opened. */
  disabled?: boolean;
  /** Accessible name for the menu panel. Forwarded to `Menu`. */
  'aria-label'?: string;
  /** Class on the trigger button. */
  className?: string;
}

/**
 * The labelled dropdown button — a `Menu` whose trigger is one of the shipped
 * `Button*` atoms, with the chevron, the ARIA and the trigger ref already
 * wired.
 *
 * `Menu` is deliberately trigger-agnostic: `renderTrigger` is required so a ⋮
 * `IconButton`, an avatar or a field can all open one. That is the right
 * primitive, but it means the single most common shape — a button that says
 * what it does and drops a menu — is re-derived at every call site, along with
 * a hand-added chevron and the `triggerProps` plumbing. This is that shape,
 * shipped once.
 *
 * It is a composition, not a new visual primitive: the button is a real
 * `Button*`, the menu is a real `Menu`. Anything this does not expose —
 * controlled `open`, `matchAnchorWidth`, a bespoke trigger — is a sign to drop
 * to `Menu` + `renderTrigger`, which is unchanged and always available.
 */
export function MenuButton({
  items,
  children,
  variant = 'secondary',
  icon,
  chevron = true,
  placement,
  disabled,
  'aria-label': ariaLabel,
  className,
}: MenuButtonProps) {
  const Trigger = TRIGGER[variant];

  return (
    <Menu
      items={items}
      placement={placement}
      aria-label={ariaLabel}
      renderTrigger={({ open, triggerProps }) => (
        // `triggerProps` spreads straight onto the button — its `ref` included.
        // Before 4.45.0 the button family did not declare `ref`, which is why
        // consumers wrapped the trigger in a `<span ref>`; that wrapper is what
        // this composite exists to stop re-deriving.
        <Trigger
          {...triggerProps}
          disabled={disabled}
          className={cn('uxm-menu-button', className)}
        >
          {icon}
          {children}
          {chevron && (
            <Icon
              glyph="chevron-down"
              size={14}
              className={cn(
                'uxm-menu-button__chevron',
                open && 'uxm-menu-button__chevron--open',
              )}
            />
          )}
        </Trigger>
      )}
    />
  );
}
