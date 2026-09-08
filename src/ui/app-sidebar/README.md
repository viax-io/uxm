# AppSidebar

The left-rail chrome for a logged-in application — renders a brand mark, an optional slot at the head of the rail, a stack of grouped nav sections, an optional footer slot, and a collapse toggle. Supports a mobile drawer with backdrop dismiss.

> **Behaviour change:** the `footer` slot now renders when `collapsed` is true. It used to be dropped, which took the account row — and any switcher parked there — out of the collapsed rail entirely. If you were using the footer for a caption ("v1.4.0"), that caption now appears in the 64px rail; swap it for rail-appropriate content on `collapsed`, which you already hold. The footer's padding also changed from `12px 24px` to `8px` so a control in it aligns with the nav rows — a caption shifts 16px left — and the slot is now a flex column, so a bare `<span>` caption stretches to the slot width instead of sitting inline (identical for plain text). No prop changed.

`AppSidebar` is a controlled shell: it owns layout (`<aside>` root, `<nav>` interior) but defers each nav item to `SidebarNavItem` and lets the consumer plug in their router primitive via `linkAs`. State (collapsed flag, mobile-open flag) is passed in via props — the component is stateless. The `linkAs` knob keeps the library framework-neutral; in a Next.js app pass `next/link`'s `Link` to avoid full-page reloads on sidebar clicks.

## Usage

```tsx
import { AppSidebar } from '@viax.io/uxm';
import Link from 'next/link';

function Shell() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AppSidebar
      brand={{ logoUrl: '/logo.svg', iconUrl: '/icon.svg', alt: 'Acme' }}
      sections={[
        {
          heading: 'Workspace',
          items: [
            { href: '/dashboard', label: 'Dashboard', icon: <Icon glyph="grid" />, active: true },
            { href: '/models', label: 'Models', icon: <Icon glyph="cube" /> },
          ],
        },
      ]}
      collapsed={collapsed}
      onCollapseToggle={() => setCollapsed((c) => !c)}
      linkAs={Link}
      footer={<span>v1.4.0</span>}
    />
  );
}
```

## Props

### `AppSidebarProps`

Extends `HTMLAttributes<HTMLElement>` — any standard attribute (id, style, data-*, aria-*) is forwarded to the `<aside>` root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `brand` | `AppSidebarBrand` | – | **Required.** Logo + collapsed-icon descriptor. |
| `sections` | `AppSidebarSection[]` | – | **Required.** Ordered list of nav groups. |
| `collapsed` | `boolean` | `false` | When true, applies `--collapsed` modifier and hides labels / headings. Both slots still render. |
| `onCollapseToggle` | `() => void` | – | Click handler for the chevron toggle; also reused as the click handler on the collapsed brand button. |
| `header` | `ReactNode` | – | Slot at the head of the rail — under the brand row, above the nav. Rendered into `uxm-app-sidebar__lead`. Renders in **both** rail states. See [Slots](#slots). |
| `footer` | `ReactNode` | – | Slot at the foot of the rail. Rendered into `uxm-app-sidebar__footer`. Renders in **both** rail states — this changed, see the note at the top. |
| `linkAs` | `ElementType` | `'a'` | Element type used for each nav item's outer link (e.g. `next/link`'s `Link`). |
| `autoIconColors` | `boolean \| AppSidebarIconColor[]` | `false` | Auto-assign a distinct icon colour to each item from a palette, **cycling by position** — a categorical scheme for scannability instead of a wall of same-coloured icons. `true` uses the exported `DEFAULT_SIDEBAR_ICON_COLORS` (four DS hue pairs — warm / cool / accent / indigo — each clearing 3:1 non-text contrast in **both** themes, lowest 3.64:1); an array supplies your own `{ bg, color }`. Replacing the palette means measuring both themes: a tile and its ink are separate tokens that flip independently, so a pair can pass in one and fail in the other. An item that sets either `iconColor` or `iconBg` opts out of auto entirely (the unset half falls to the component default), so a pinned colour is never paired with an auto half chosen for a different tile — one item can pin its colour while the rest auto-fill. The cycle runs unbroken across section boundaries. |
| `mobileOpen` | `boolean` | `false` | Controls the mobile drawer state. Adds `--mobile-open` modifier and renders the backdrop. |
| `onMobileClose` | `() => void` | – | Backdrop click handler. |
| `className` | `string` | – | Merged with the `<aside>` root class via `cn`. |
| `closeLabel` | `string` | `'Close navigation'` | Accessible name for the mobile drawer's close button. |
| `expandLabel` | `string` | `'Expand sidebar'` | Accessible name for the collapse toggle while collapsed. |
| `collapseLabel` | `string` | `'Collapse sidebar'` | Accessible name for the collapse toggle while expanded. |

### `AppSidebarBrand`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `logoUrl` | `string` | no | Wide logo; shown only when expanded. |
| `iconUrl` | `string` | no | Compact icon; shown only when collapsed. |
| `alt` | `string` | no | Alt text shared by both image variants. Defaults to `''`. |

### `AppSidebarSection`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `heading` | `string` | no | Optional section label (uppercase, muted). Hidden while collapsed. |
| `items` | `AppSidebarNavItem[]` | yes | Nav entries in render order. |

### `AppSidebarNavItem`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `href` | `string` | yes | Target URL — passed through to `SidebarNavItem` (and the rendered `linkAs` element). Also used as the React key. |
| `label` | `string` | yes | Visible label; falls back to `title` tooltip in collapsed mode. |
| `icon` | `ReactNode` | no | Leading icon node. |
| `active` | `boolean` | no | Marks the item as the current page (forwarded to `SidebarNavItem`). |
| `iconBg` | `string` | no | Per-item icon-tile background colour (e.g. model-type accent). |
| `iconColor` | `string` | no | Per-item icon foreground colour. |
| `badge` | `ReactNode` | no | Persistent after-label marker (a "configured ✓", count, pill). Shows at rest (no hover gate), unlike `trailing`. When collapsed the inline marker is dropped and stands in as a small **status dot** on the icon-tile corner (the full content wouldn't fit the 32×32 tile). Forwarded to `SidebarNavItem`. |
| `trailing` | `ReactNode` | no | Trailing slot (e.g. hover-revealed remove button). Hidden while collapsed. |

## Slots

Two slots, and which one you reach for is a hierarchy question rather than a taste one.

**`header` — the head of the rail.** Where a tenant or workspace switcher belongs. A control that names the level everything below it sits in has to be *above* that everything; putting it at the foot inverts the relationship. Before this slot existed the footer was the only option, which is exactly how switchers ended up down there.

**`footer` — the foot of the rail.** The signed-in account row, or a version caption. The account row belongs here legitimately: it names the *person*, not a level the nav sits inside.

```tsx
<AppSidebar
  brand={brand}
  sections={sections}
  collapsed={collapsed}
  header={
    <SidebarNavTrigger
      variant="outlined"
      collapsed={collapsed}
      caption={collapsed ? undefined : 'Workspace'}
      icon={<Icon glyph="product" size={18} />}
      trailing={<Icon glyph="chevron-down" size={16} />}
      title={collapsed ? 'Default' : undefined}
    >
      Default
    </SidebarNavTrigger>
  }
  footer={
    <SidebarNavTrigger
      variant="plain"
      collapsed={collapsed}
      caption={collapsed ? undefined : 'Tenant owner'}
      captionPlacement="below"
      icon={<Avatar initials="DR" size={collapsed ? 'small' : 'medium'} />}
    >
      dan@acme.com
    </SidebarNavTrigger>
  }
/>
```

### The slots stack their own children

Both slots are flex columns with an **8px gap**, so a slot handed more than one control spaces them itself — you pass controls, not a layout. A head slot commonly holds two (a tenant switcher over a workspace one), and two bordered cards butted together read as one control with a line through it.

8px matches each slot's own padding and the trigger's vertical padding, so the rhythm is uniform rather than a third spacing value. `--uxm-app-sidebar-{lead,footer}-gap` if you need it different — deliberately *not* a workbench knob, since a slider for a value that should track the padding is a way for the two to drift.

One consequence in the footer: a bare `<span>` caption is now a flex item, so it stretches to the slot's width instead of sitting inline. For plain text that renders identically; a caption carrying its own background or border will fill the row.

### The rail state is yours to pass down

Both slots hold an **opaque node**, so this component cannot adapt what is inside them. It can turn a nav item's `badge` into a corner status dot because it owns the item's shape; it has no such handle on a slot. So the consumer passes `collapsed` into the child, and sizes the marks — note `Avatar size="small"` above, since a 40px avatar leaves only 3px of ring inside the trigger's 46px collapsed tile.

A slot that ignores the rail state looks right expanded and breaks at 64px.

### Alignment

Both slots use the nav's **8px** padding, so a control in either lands at 8 + its own 12 = **20px** — exactly where a `SidebarNavItem` label starts, and the switcher and account row line up with the rows between them.

The footer used to carry a 24px caption inset. That was fine while the slot only held an 11px caption, but it put a **control** at 36px — a visible 16px step against every nav row — and cost it 32px of width, which pushed a signed-in address into an ellipsis for no reason. A caption now shifts 16px left and lines up with the nav labels too. Both paddings are variables if you want the deeper inset back: `--uxm-app-sidebar-lead-padding`, `--uxm-app-sidebar-footer-padding`.

Unlike the footer, `__lead` imposes **no** `font-size` or `color` — the footer sets both, having been built for an 11px caption, and drops the `font-size` when collapsed.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-app-sidebar-expanded-width` | – | `256px` | Root width when expanded. |
| `--uxm-app-sidebar-collapsed-width` | – | `64px` | Root width when `--collapsed` is applied. |
| `--uxm-app-sidebar-border-color` | `--color-border` | – | Right-edge border + footer top border. |
| `--uxm-app-sidebar-heading-color` | `--color-text-muted` | – | Section heading colour. |
| `--uxm-app-sidebar-footer-color` | `--color-text-muted` | – | Footer text colour. |
| `--uxm-app-sidebar-lead-padding` | – | `8px` | Header-slot padding. Matches `__nav` so a control aligns with the nav rows. |
| `--uxm-app-sidebar-footer-padding` | – | `8px` | Footer padding, in both rail states. Was `12px 24px`; see [Alignment](#alignment). |
| `--uxm-app-sidebar-lead-gap` | – | `8px` | Row gap between controls in the header slot. |
| `--uxm-app-sidebar-footer-gap` | – | `8px` | Row gap between controls in the footer slot. |

## Design tokens (MODO-configurable)

When the component-scoped variables above are not overridden, AppSidebar resolves colour through the global design-token layer exported by `@viax.io/uxm/tokens`. These tokens are the customization surface exposed to MODO's brand-settings editor.

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-surface-alt` | Surfaces / Surface Alt | Root background. |
| `--color-border` | Borders / Border | Right-edge border, footer top border. |
| `--color-text-muted` | Text / Text Muted | Section heading, toggle icon, footer text. |
| `--color-text` | Text / Text | Collapsed brand-button hover bg (via `color-mix`), toggle hover text. |
| `--color-surface` | Surfaces / Surface | Toggle hover background. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Expanded | `collapsed={false}` | Full width (`--expanded-width`), labels + headings + footer visible. |
| Collapsed | `collapsed={true}` | Narrow width (`--collapsed-width`); brand swaps to icon button, labels & headings hide, `trailing` hides, `badge` collapses to a corner status dot on the icon tile, item width clamps to 32×32. **Both slots still render**; the footer stops imposing its caption `font-size`. |
| Mobile drawer open | `mobileOpen={true}` | Adds `--mobile-open` modifier and renders the backdrop button as a sibling. |
| Toggle button | `onCollapseToggle` provided | Chevron-left icon rendered in the header; clickable to flip state. |
| Heading hidden | `collapsed` truthy or `section.heading` undefined | Section heading paragraph is not rendered. |

## Accessibility

- Root is a semantic `<aside>` with an interior `<nav>` — screen readers announce a landmark.
- Collapse toggle is a real `<button>` with `aria-label="Collapse sidebar"`; the collapsed brand button doubles as expand control with `aria-label="Expand sidebar"`.
- Mobile backdrop is a real `<button type="button">` with `aria-label="Close navigation"` — focusable and keyboard-activatable; click forwards to `onMobileClose`.
- Each nav item announces **identically collapsed and expanded**: the label and the inline `badge` stay in the accessibility tree when collapsed (visually clipped, not removed), so "Inbox 3" reads the same in both states. The corner status dot that visually stands in for the badge is `aria-hidden` — a sighted-only cue backed by the clipped badge text. `title={item.label}` is additionally set when collapsed for the pointer-hover tooltip; it is not the accessible name (the clipped content is). The interactive `trailing` slot IS dropped when collapsed — a clipped focusable control would be an invisible tab stop.
- The component does not manage focus when toggling collapsed / mobile state; consumers should move focus to the drawer on open if needed.
- The SCSS does not currently ship a media query for the `--mobile-*` modifier classes or the backdrop — consumers must layer their own responsive rules if they need a drawer at `< 768px`.
