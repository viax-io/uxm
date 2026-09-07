# SidebarNavTrigger

A rail row that **opens** something rather than navigating to it — a workspace switcher, an account menu, an environment picker.

It is a `<button type="button">` extending `ButtonHTMLAttributes`, so the `triggerProps` a `Menu` or `Listbox` hands to `renderTrigger` spread straight onto it, ref and ARIA included.

## Usage

```tsx
import { Menu, SidebarNavTrigger, Icon, type MenuEntry } from '@viax.io/uxm/ui';

<Menu
  items={workspaces}
  aria-label="Switch workspace"
  placement="bottom-start"
  matchAnchorWidth="min"
  renderTrigger={({ triggerProps }) => (
    <SidebarNavTrigger
      {...triggerProps}
      variant="outlined"
      caption="Workspace"
      icon={<Icon glyph="product" size={18} />}
      trailing={<Icon glyph="chevron-down" size={16} />}
    >
      {currentWorkspace}
    </SidebarNavTrigger>
  )}
/>;
```

The account row at the foot of the rail is the same component with different slots:

```tsx
<SidebarNavTrigger
  {...triggerProps}
  icon={<Avatar initials="DR" />}
  caption="Tenant owner"
  trailing={<Icon glyph="chevron-down" size={16} />}
>
  dan@acme.com
</SidebarNavTrigger>
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `icon` | `ReactNode` | — | The mark on the left. A bare `Icon` in a switcher, an `Avatar` in an account row. |
| `caption` | `ReactNode` | — | The small line beside the value. See [Caption](#caption). |
| `captionPlacement` | `"above" \| "below"` | `"above"` | Which side of the value it sits on. |
| `children` | `ReactNode` | — | The value — the workspace name, the signed-in address. |
| `trailing` | `ReactNode` | — | The chevron. Shown as soon as it is passed — no hover-reveal. |
| `variant` | `"plain" \| "outlined"` | `"plain"` | See below. |
| `collapsed` | `boolean` | `false` | Render for a 64px rail. See [Collapsed rail](#collapsed-rail). |

Everything else lands on the `<button>`: `onClick`, `disabled`, `aria-*`, `ref`.

## What it does not draw

**No tile behind the icon** — no surface, no rounding, no background. The atom reserves the slot, sizes it, aligns it, and paints nothing. (`SidebarNavItem` *does* paint a tile; that difference is the point.)

The slot's size is a **minimum**, not a fixed box (`min-width`/`min-height`), so it reserves and aligns without squeezing a child that brings its own size — an `Avatar` keeps its dimensions.

**It reserves nothing it was not given.** No `icon` and the text starts at the padding edge; no `caption` and the value centres on one line; no `trailing` and there is no gap where a chevron would have been. Each slot is rendered only when passed — none are empty placeholders holding space.

## Caption

**Above** the value (default) the caption *labels the level* this control changes — a switcher's `WORKSPACE` over a workspace name. **Below** it *qualifies the value* instead — an account row's `Tenant owner` under the signed-in address. Same slot, same knobs; only the reading changes.

```tsx
<SidebarNavTrigger icon={<Avatar initials="DR" />} caption="Tenant owner" captionPlacement="below">
  dan@acme.com
</SidebarNavTrigger>
```

The two are swapped **in the markup**, not with `flex-direction: column-reverse`. Reversing visually while leaving the DOM alone would split reading order from visual order (WCAG 1.3.2) and would keep announcing "Tenant owner dan@acme.com" for a row that reads the other way round.

Uppercase is the **default, not the definition** — `--uxm-sidebar-nav-trigger-caption-text-transform` takes `none` / `capitalize` / `lowercase` too. A brand font may not carry caps well, and a `below` caption is often sentence case. Note the pairing: the `0.06em` tracking exists to open up caps, so turning the transform off usually means turning the tracking down with it.

## Colouring the mark

The mark is a **node**, so its colour is yours — there is no `iconColor` prop, and adding one would be a second way to do the same thing that would not work for an `Avatar` anyway (it paints itself).

```tsx
// A workspace whose colour the user picked at creation time.
icon={<Icon glyph="product" size={18} style={{ color: workspace.color }} />}
```

`--uxm-sidebar-nav-trigger-icon-color` (default `--color-text-strong`) sits on the wrapper and the glyph inherits it through `currentColor`, so the default holds until you override it on the node itself.

Prefer a token reference (`var(--color-category-composite)`) so MODO re-tinting still reaches it. A raw hex is legitimate **only** when the colour is entity *data* — a workspace colour chosen by a user and stored on the record. Note that a user-picked hex has one value and does not invert for the dark theme; the kit has no identity-colour palette yet, so if arbitrary colours are on the table, check both themes.

> This is deliberately not how `Menu` does it. There a row is *data* (`MenuEntry`), so a consumer cannot hand it a pre-coloured node and `MenuItem.iconColor` has to exist. Here the slot is a node. Same question, different API shape, different answer.

## Variants

- **`plain`** — nothing at rest. The account row at the foot of the rail.
- **`outlined`** — a hairline and the card surface. The switcher, which stands in a box because it names the level everything below it belongs to.

## States

Hover and open paint the **same surface**, in both variants — they mean the same thing to the eye: this row is what you are dealing with. `outlined` keeps its own neutral border throughout; a border that moved too would be a second signal for a fact the surface already carries.

**Open has no prop.** It is read from `[aria-expanded="true"]`, which `Menu` and `Listbox` already set through `triggerProps`. A second source of truth for the same fact is a bug waiting to disagree with itself.

Focus takes the kit's ring (`outline: 2px var(--color-accent)`, offset 2px).

**Disabled** dims the row (`--uxm-sidebar-nav-trigger-disabled-opacity`, default `0.45`) and sets `cursor: not-allowed`. It is dimmed rather than recoloured, so a disabled `outlined` trigger still reads as the same box, and one opacity covers both variants.

Both spellings paint: the native `disabled` attribute, which blocks activation itself, and `aria-disabled="true"`, for when the row must stay focusable and announced — there **you** still own ignoring the activation, which is the whole difference between the two. Hover opts out of both, so a disabled row does not light up under the pointer.

There is deliberately no `pointer-events: none` (which `SidebarNavItem` needs, being an `<a>` that cannot carry a native `disabled`): it would suppress `cursor: not-allowed` too, throwing away the one affordance that tells the user why nothing happens.

## Collapsed rail

`collapsed` renders the row for `AppSidebar`'s 64px icon column. Three things change, and each one is a decision:

- **The row becomes a 46px tile** (`--uxm-sidebar-nav-trigger-collapsed-size`).
- **`trailing` is dropped** — not hidden. A chevron does not fit, and leaving the node in place would reserve a gap the atom's own rule ("reserves nothing it was not given") says it must not.
- **`caption` and `children` stay in the DOM, visually clipped.** They are *not* `display: none` — that would take them out of the accessible tree, and the row would announce as a nameless button whenever its mark is a decorative `Icon` or an `Avatar` with no alt. Clipped, the row announces **identically** collapsed and expanded.

```tsx
<SidebarNavTrigger collapsed variant="outlined" title="order-processing"
  icon={<Icon glyph="product" size={18} />} caption="Workspace">
  order-processing
</SidebarNavTrigger>
```

**Pass `title`.** With the chevron gone, only position and the mark still say the row opens something — the tooltip is what carries the value on hover, the same way `AppSidebar` handles its own collapsed items. It lands on the button through `...rest`.

### Why 46 and not 32

`AppSidebar` gives its collapsed nav items 32x32, and the tile deliberately does **not** match that. A trigger is not a nav row — it opens something — and at rail width it has lost both its chevron and its text, so footprint is the only signal of that difference still available.

It is a composition choice as much as a size. The tile is a surface **around** the mark, not a frame hugging it: a 32px mark leaves ~7px on every side, the same relationship `SidebarNavItem` has between its 32px tile and the smaller icon inside it. A tile sized to hug its mark reads as a border on the avatar rather than a control containing one. In a 64px rail it leaves 9px each side.

So **size the mark for the tile**, not the tile for the mark — `Avatar` at `size="small"` (32px, see the Avatar README) rather than its 40px default:

```tsx
<SidebarNavTrigger collapsed variant="plain" title="dan@acme.com"
  icon={<Avatar initials="DR" size="small" />} caption="Tenant owner" captionPlacement="below">
  dan@acme.com
</SidebarNavTrigger>
```

`--uxm-sidebar-nav-trigger-collapsed-size` is the lever if you want the switcher flush with the nav tiles instead.

**The tile size is a minimum, not a clamp.** The row never squeezes or clips a mark that brings its own size — the same guarantee the `icon` slot makes. A mark larger than the tile grows the row rather than being cut off. Note the border sits outside the mark, so the outer measurement is the mark plus 2px whenever the mark is the larger of the two.

`outlined` deliberately keeps its border and surface at this size: the box is then the only thing left telling a switcher apart from a plain account row.

**Why a prop and not an ancestor selector** on `.uxm-app-sidebar--collapsed`: a trigger sits in a slot the *consumer* owns, so the shell never has its node to rewrite — and no atom in this kit styles another atom's internals from its own sheet. (`SidebarNavItem` has no collapsed mode for the opposite reason: `AppSidebar` composes it directly, so it can drive it with props.)

## CSS variables

Row: `--uxm-sidebar-nav-trigger-{padding-x,padding-y,gap,border-radius,bg,hover-bg,focus-ring,disabled-opacity}`.

Collapsed: `--uxm-sidebar-nav-trigger-collapsed-size` (default `46px`, a minimum — see [Collapsed rail](#collapsed-rail)). `padding-*` and `gap` stop applying there: the tile sets `padding: 0` and has one in-flow child left.

Outlined: `--uxm-sidebar-nav-trigger-outlined-{bg,border}`.

Value: `--uxm-sidebar-nav-trigger-{font-size,font-weight,value-color}`.

Caption: `--uxm-sidebar-nav-trigger-caption-{font-size,font-weight,letter-spacing,text-transform,color,gap}`.

Mark and chevron: `--uxm-sidebar-nav-trigger-icon-{size,color}`, `--uxm-sidebar-nav-trigger-trailing-color`.

The caption defaults to `--color-text-muted`, which measures 2.54:1 on `--color-card` in the light theme — under the 4.5:1 AA floor for text. That is acceptable **only** because a caption names the control rather than carrying content: the value beneath it is the content, and nothing is lost if the caption goes unread. Swap to `--color-text-strong` if a consumer ever gives the slot real meaning.

## Accessibility

- A real `<button type="button">`, so Enter/Space and focus come for free.
- `aria-haspopup` / `aria-expanded` / `aria-controls` come from the popup's `triggerProps` — do not add your own, they would override the wiring.
- **Collapsed keeps the accessible name.** The caption and value are clipped, not removed, so the row announces the same collapsed as expanded — see [Collapsed rail](#collapsed-rail). Pair it with `title` for the sighted hover case; note that `title` is not a substitute for the name, it is the tooltip.
- The caption lives **inside** the button, so it joins the accessible name: "Workspace order-processing" — or "dan@acme.com Tenant owner" with `captionPlacement="below"`, since the markup order follows the visual one. That usually reads well. Pass an explicit `aria-label` when a particular pairing does not.

## Why its own atom, not knobs on `SidebarNavItem`

That one renders an `<a>` (it navigates), hides `trailing` until hover, paints an icon tile, and has a single-line label. Four disagreements, none cosmetic — folding both into one component would mean four mutually-exclusive knobs and a prop that turns half of them at once.

The kit already has this precedent: `ExplorerListItem` sits beside `SidebarNavItem` for the same kind of reason.
