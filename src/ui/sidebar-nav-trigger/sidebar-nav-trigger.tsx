import { cn } from '@/helpers';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type SidebarNavTriggerVariant = 'plain' | 'outlined';

export type SidebarNavTriggerCaptionPlacement = 'above' | 'below';

export interface SidebarNavTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The mark on the left — a bare `Icon` in a workspace switcher, an `Avatar`
   * in an account row. The atom draws NO tile behind it: no surface, no
   * rounding, no background. It reserves the slot, sizes it, aligns it, and
   * paints nothing. (`SidebarNavItem` does paint a tile — that difference is
   * deliberate, a trigger is chrome for what it opens, not a destination.)
   */
  icon?: ReactNode;
  /**
   * The small line beside the value — "WORKSPACE" over a workspace name,
   * "Tenant owner" under a signed-in address. Above the value it labels the
   * level this control changes; below it, it qualifies the value. See
   * `captionPlacement`.
   *
   * It lives inside the button, so it joins the accessible name
   * ("Workspace order-processing"), which usually reads well. Pass an explicit
   * `aria-label` if a particular pairing does not.
   */
  caption?: ReactNode;
  /**
   * Which side of the value the caption sits on. `above` (default) labels the
   * level — a switcher's "WORKSPACE". `below` qualifies the value instead — an
   * account row's "Tenant owner" under the address.
   *
   * Implemented by swapping the two in the MARKUP, not with
   * `flex-direction: column-reverse`. Reversing visually while leaving the DOM
   * alone would split reading order from visual order (WCAG 1.3.2) and would
   * keep announcing "Tenant owner dan@acme.com" for a row that reads the other
   * way round. Every caption knob keeps working either way — this changes
   * order only.
   */
  captionPlacement?: SidebarNavTriggerCaptionPlacement;
  /** The value — the workspace name, the signed-in address. */
  children?: ReactNode;
  /**
   * The chevron. Visible at rest, with no reveal-on-hover behaviour: a control
   * that opens something has to advertise it before you point at it.
   * (`SidebarNavItem` hides its trailing slot until hover — that slot holds
   * optional affordances like a × , not the affordance itself.)
   */
  trailing?: ReactNode;
  /**
   * `plain` — nothing at rest; the account row at the foot of the rail.
   * `outlined` — a hairline plus the card surface; the switcher, which stands
   * in a box because it names the level everything below it belongs to.
   */
  variant?: SidebarNavTriggerVariant;
  /**
   * Render for a COLLAPSED rail — the 64px icon column. The row becomes a 46px
   * tile, `trailing` is dropped (a chevron does not fit), and `caption` +
   * `children` stay in the DOM but are visually hidden — so the button keeps
   * the SAME accessible name it had expanded. Dropping the text outright is the
   * trap here: a row whose mark is a decorative `Icon` would become a nameless
   * button.
   *
   * 46px is deliberately NOT the 32px `AppSidebar` gives its collapsed nav
   * items. A trigger is not a nav row — it opens something — and at rail width
   * it has lost both its chevron and its text, so footprint is the only signal
   * of that difference left.
   *
   * It is a composition choice too: the tile is a surface AROUND the mark, not
   * a frame hugging it. A 32px mark (`Avatar size="small"`) leaves ~7px on every
   * side — the same relationship `SidebarNavItem` has between its 32px tile and
   * the smaller icon inside. Size the mark for the tile, not the tile for the
   * mark; `--uxm-sidebar-nav-trigger-collapsed-size` is there if you want the
   * switcher flush with the nav tiles instead.
   *
   * The tile is a MINIMUM, not a clamp — the row never squeezes or clips a mark
   * that brings its own size, the same guarantee the `icon` slot makes. A
   * larger mark grows the row rather than being cut off.
   *
   * A prop, and not an ancestor selector on `.uxm-app-sidebar--collapsed`: a
   * trigger is placed by the CONSUMER in a slot, so the shell never owns its
   * node — and no atom in this kit reaches into another's internals from its
   * own stylesheet. (`SidebarNavItem` has no collapsed mode for the opposite
   * reason: `AppSidebar` composes it directly and can drive it with props.)
   *
   * The affordance cost is real and CSS cannot pay it: with the chevron gone,
   * only position and the mark still say this row opens something. Pass
   * `title` — it lands on the button through `...rest` — so hover carries the
   * value, the way `AppSidebar` does for its own collapsed items.
   */
  collapsed?: boolean;
}

/**
 * A rail row that OPENS something rather than navigating to it — a workspace
 * switcher, an account menu, an environment picker.
 *
 * It is a `<button type="button">` extending `ButtonHTMLAttributes`, so the
 * `triggerProps` a `Menu` or `Listbox` hands to `renderTrigger` spread straight
 * onto it, ref and ARIA included:
 *
 * ```tsx
 * <Menu items={workspaces} matchAnchorWidth="min" placement="bottom-start"
 *   renderTrigger={({ triggerProps }) => (
 *     <SidebarNavTrigger {...triggerProps} variant="outlined" caption="Workspace"
 *       icon={<Icon glyph="product" size={18} />} trailing={<Icon glyph="chevron-down" size={16} />}>
 *       {current}
 *     </SidebarNavTrigger>
 *   )}
 * />
 * ```
 *
 * It reserves nothing it was not given: no `icon` and the text starts at the
 * padding edge, no `caption` and the value centres on one line, no `trailing`
 * and there is no gap where a chevron would have been. Every slot is rendered
 * only when passed — none are empty placeholders.
 *
 * The open state has no prop. It is read from `[aria-expanded="true"]`, which
 * `Menu` and `Listbox` already set through `triggerProps` — a second source of
 * truth for the same fact is a bug waiting to disagree with itself.
 *
 * Its own atom rather than knobs on `SidebarNavItem`: that one renders an `<a>`
 * (it navigates), hides `trailing` until hover, paints an icon tile, and has a
 * single-line label. Four disagreements, none of them cosmetic. The kit already
 * has this precedent — `ExplorerListItem` sits beside `SidebarNavItem` for the
 * same kind of reason.
 */
export function SidebarNavTrigger({
  icon,
  caption,
  captionPlacement = 'above',
  children,
  trailing,
  variant = 'plain',
  collapsed = false,
  className,
  type = 'button',
  ...rest
}: SidebarNavTriggerProps) {
  return (
    <button
      type={type}
      className={cn(
        'uxm-sidebar-nav-trigger',
        `uxm-sidebar-nav-trigger--${variant}`,
        collapsed && 'uxm-sidebar-nav-trigger--collapsed',
        className,
      )}
      {...rest}
    >
      {icon && <span className="uxm-sidebar-nav-trigger__icon">{icon}</span>}
      {(caption != null || children != null) && (
        <span
          className={cn(
            'uxm-sidebar-nav-trigger__text',
            collapsed && 'uxm-sidebar-nav-trigger__text--collapsed',
          )}
        >
          {caption != null && captionPlacement === 'above' && (
            <span className="uxm-sidebar-nav-trigger__caption">{caption}</span>
          )}
          {children != null && (
            <span className="uxm-sidebar-nav-trigger__value">{children}</span>
          )}
          {caption != null && captionPlacement === 'below' && (
            <span className="uxm-sidebar-nav-trigger__caption">{caption}</span>
          )}
        </span>
      )}
      {/* Dropped, not hidden: the 32x32 collapsed row has no room for a
          chevron, and leaving the node in place would only reserve a gap the
          atom's own rule ("reserves nothing it was not given") says it must
          not. */}
      {trailing && !collapsed && (
        <span className="uxm-sidebar-nav-trigger__trailing">{trailing}</span>
      )}
    </button>
  );
}
