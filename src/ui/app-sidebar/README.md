# AppSidebar

The left-rail chrome for a logged-in application — renders a brand mark, a stack of grouped nav sections, an optional footer slot, and a collapse toggle. Supports a mobile drawer with backdrop dismiss.

`AppSidebar` is a controlled shell: it owns layout (`<aside>` root, `<nav>` interior) but defers each nav item to `SidebarNavItem` and lets the consumer plug in their router primitive via `linkAs`. State (collapsed flag, mobile-open flag) is passed in via props — the component is stateless. The `linkAs` knob keeps the library framework-neutral; in a Next.js app pass `next/link`'s `Link` to avoid full-page reloads on sidebar clicks.

## Usage

```tsx
import { AppSidebar } from '@viax/uxm';
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
| `collapsed` | `boolean` | `false` | When true, applies `--collapsed` modifier and hides labels / headings / footer. |
| `onCollapseToggle` | `() => void` | – | Click handler for the chevron toggle; also reused as the click handler on the collapsed brand button. |
| `footer` | `ReactNode` | – | Rendered into `uxm-app-sidebar__footer`. Hidden while `collapsed` is true. |
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
| `badge` | `ReactNode` | no | Persistent after-label marker (a "configured ✓", count, pill). Always visible — **stays shown while collapsed**, unlike `trailing`. Forwarded to `SidebarNavItem`. |
| `trailing` | `ReactNode` | no | Trailing slot (e.g. hover-revealed remove button). Hidden while collapsed. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-app-sidebar-expanded-width` | – | `256px` | Root width when expanded. |
| `--uxm-app-sidebar-collapsed-width` | – | `64px` | Root width when `--collapsed` is applied. |
| `--uxm-app-sidebar-border-color` | `--color-border` | – | Right-edge border + footer top border. |
| `--uxm-app-sidebar-heading-color` | `--color-text-muted` | – | Section heading colour. |
| `--uxm-app-sidebar-footer-color` | `--color-text-muted` | – | Footer text colour. |

## Design tokens (MODO-configurable)

When the component-scoped variables above are not overridden, AppSidebar resolves colour through the global design-token layer exported by `@viax/uxm/tokens`. These tokens are the customization surface exposed to MODO's brand-settings editor.

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
| Collapsed | `collapsed={true}` | Narrow width (`--collapsed-width`); brand swaps to icon button, labels & headings hide, footer hides, `trailing` slots hide, item width clamps to 32×32. |
| Mobile drawer open | `mobileOpen={true}` | Adds `--mobile-open` modifier and renders the backdrop button as a sibling. |
| Toggle button | `onCollapseToggle` provided | Chevron-left icon rendered in the header; clickable to flip state. |
| Heading hidden | `collapsed` truthy or `section.heading` undefined | Section heading paragraph is not rendered. |

## Accessibility

- Root is a semantic `<aside>` with an interior `<nav>` — screen readers announce a landmark.
- Collapse toggle is a real `<button>` with `aria-label="Collapse sidebar"`; the collapsed brand button doubles as expand control with `aria-label="Expand sidebar"`.
- Mobile backdrop is a real `<button type="button">` with `aria-label="Close navigation"` — focusable and keyboard-activatable; click forwards to `onMobileClose`.
- Each nav item, when collapsed, gets `title={item.label}` so hover tooltips substitute for the hidden label; this is **not** a true accessible name for the link — pair with an `aria-label` upstream if you need screen-reader parity in collapsed mode.
- The component does not manage focus when toggling collapsed / mobile state; consumers should move focus to the drawer on open if needed.
- The SCSS does not currently ship a media query for the `--mobile-*` modifier classes or the backdrop — consumers must layer their own responsive rules if they need a drawer at `< 768px`.
