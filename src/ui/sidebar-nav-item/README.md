# SidebarNavItem

A nav-row primitive for app sidebars — an icon tile, a label, an optional persistent `badge` slot (a status marker), an optional `trailing` slot for hover-reveal affordances, and built-in active / hover states.

`SidebarNavItem` renders an `<a>` by default but accepts an `as` override so consumers can drop in a router-aware `Link` (e.g. `next/link`'s `Link`) — keeping the UXM library framework-neutral while still avoiding full-reload navigations. The icon tile supports per-item background and foreground overrides (`iconBg` / `iconColor`) so model-type accents or category colours can travel through to the sidebar without forking the component.

## Usage

```tsx
import { SidebarNavItem, Icon } from '@viax/uxm';
import { IconButton } from '@viax/uxm';
import Link from 'next/link';

function ProjectRow({ project, onRemove, isActive }) {
  return (
    <SidebarNavItem
      as={Link}
      href={`/projects/${project.id}`}
      icon={<Icon glyph="folder" />}
      active={isActive}
      iconBg={project.accent}
      iconColor="#fff"
      trailing={
        <IconButton aria-label="Remove" onClick={onRemove}>
          <Icon glyph="close" />
        </IconButton>
      }
    >
      {project.name}
    </SidebarNavItem>
  );
}
```

## Props

Extends `AnchorHTMLAttributes<HTMLAnchorElement>` — any standard anchor attribute (`href`, `target`, `rel`, etc.) is forwarded to the root element.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Label content. |
| `icon` | `ReactNode` | – | Leading icon node, rendered inside a fixed-size tile. Typically `<Icon glyph="..." />`. |
| `active` | `boolean` | – | Marks the item as the current route; adds `--active` modifier and `aria-current="page"`. |
| `disabled` | `boolean` | `false` | Adds `aria-disabled="true"` and `tabIndex={-1}` so the row is announced as unavailable and removed from the tab order. No bundled visual disabled style. |
| `iconBg` | `string` | – | Inline background colour for the icon tile (overrides `--uxm-sidebar-nav-item-icon-bg`). |
| `iconColor` | `string` | – | Inline foreground colour for the icon (overrides `--uxm-sidebar-nav-item-icon-color`). |
| `badge` | `ReactNode` | – | **Persistent** after-label marker — a "configured ✓", count, or small pill. Unlike `trailing` it shows at rest (no hover gate). Rendered before `trailing`, so a row can carry both. (No collapsed mode here; in `AppSidebar`'s collapsed rail the inline badge is dropped in favour of `statusDot`.) |
| `statusDot` | `boolean` | `false` | Overlay a small status dot on the icon-tile corner (a `Badge` in `dot` mode, `accent` tone). The compact stand-in for `badge` where there's no room for inline content — `AppSidebar` turns it on in its collapsed rail. Requires `icon` (anchors to the tile). |
| `trailing` | `ReactNode` | – | Right-side slot — hidden by default, fades in on row hover / focus-within. Typical use: a remove `×` button on user-generated nav items. |
| `as` | `ElementType` | `'a'` | Outer element type. Pass a router `Link` to avoid full page reloads. |
| `className` | `string` | – | Merged with `uxm-sidebar-nav-item` via `cn`. |
| _(any anchor attribute)_ | – | – | Spread onto the root element. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-sidebar-nav-item-icon-bg` | `color-mix(--color-text 6%, transparent)` | – | Icon tile background (when `iconBg` prop unset). |
| `--uxm-sidebar-nav-item-icon-color` | `--color-text` | – | Icon foreground colour. |
| `--uxm-sidebar-nav-item-icon-box-size` | – | `24px` | Icon tile width + height. |
| `--uxm-sidebar-nav-item-icon-radius` | – | `6px` | Icon tile corner radius. |
| `--uxm-sidebar-nav-item-icon-size` | – | `14px` | Inner SVG icon size. |
| `--uxm-sidebar-nav-item-badge-color` | `--color-text-muted` | – | Persistent `badge` slot colour (when the badge content doesn't set its own). |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text` | Text / Text | Active state text + icon (fallback). |
| `--color-text-strong` | Text / Text Strong | Idle row text. |
| `--color-surface` | Surfaces / Surface | Active row background; mixed for hover background. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Idle | – | Text `--color-text-strong`, no background. |
| Hover | `:hover` | Background `color-mix(--color-surface 60%, transparent)`, text `--color-text`. |
| Active | `active` prop | Background `--color-surface`, text `--color-text`, `aria-current="page"`. |
| Disabled | `disabled` prop | `aria-disabled="true"`, removed from tab order. No bundled visual dim — rely on consumer styles or the `pointer-events: none` rule on the `[aria-disabled]` selector if added downstream. |
| Trailing reveal | `:hover` / `:focus-within` on row | Trailing slot fades from `opacity: 0` to `1` over 0.15s. |
| Persistent badge | `badge` prop | Shows at rest after the label (no opacity gate), unlike the hover-reveal `trailing`. (In `AppSidebar`'s collapsed rail it's replaced by `statusDot`.) |
| Status dot | `statusDot` prop | `Badge` dot (accent) overlaid on the icon-tile corner — the collapsed-rail stand-in for `badge`. Sized via `--uxm-badge-dot-size` (8px here). |
| With icon overrides | `iconBg` / `iconColor` props | Inline `style` on the icon tile wins over the `--uxm-sidebar-nav-item-icon-*` vars. |

## Accessibility

- Active state uses `aria-current="page"` — assistive tech announces the row as the current location.
- Disabled state uses `aria-disabled="true"` + `tabIndex={-1}` to remove the row from the tab order while keeping it focusable programmatically. (Note: there's no bundled CSS rule that visually dims it — add a `[aria-disabled='true']` opacity rule at the consumer level if a dimmed look is needed.)
- Renders a real `<a>` by default — keyboard activation (Enter), screen-reader semantics, middle-click / cmd-click open-in-new-tab all come from the native anchor.
- When `as` is set to a router `Link`, the underlying element may render differently — verify it still resolves to an `<a>` for screen-reader semantics; many router primitives do.
- The trailing slot starts at `opacity: 0` and reveals on `:hover` / `:focus-within`. Focus-within means keyboard users tabbing into the trailing control will see it appear before they interact with it — there's no separate "always visible on focus" knob for the row itself.
- Icon tile contents carry no `aria-hidden`; if the icon is decorative, pass an `<Icon>` that handles its own hiding.
