# PageHeader

A page-top header row pairing an optional icon tile, a title (`<h1>`), an optional meta line, and an optional actions slot.

The icon tile is delegated to the `IconTile` atom — PageHeader's `--uxm-page-header-icon-{bg,color,size}` variables are bridged onto IconTile's own CSS-variable surface via an inline style object so per-instance icon theming flows through without hand-rolled `__icon` CSS. Title and meta defaults match the `page-header` registry entry; each knob (`titleColor`, `titleSize`, `metaColor`, `metaSize`, `iconBg`, `iconColor`, `iconSize`, `gap`, `paddingX`, `paddingY`) maps to a CSS custom property the class rule reads.

## Usage

```tsx
import { PageHeader, ButtonPrimary, Icon } from '@viax/uxm';

function UsersPage() {
  return (
    <PageHeader
      icon={<Icon glyph="users" />}
      title="Users"
      meta="42 active members"
      actions={<ButtonPrimary>Invite</ButtonPrimary>}
    />
  );
}
```

## Props

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` — any standard div attribute is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | – | Glyph node rendered inside an `IconTile`. When omitted, the tile slot collapses. |
| `title` | `ReactNode` | – | **Required.** Rendered inside `<h1>`. |
| `meta` | `ReactNode` | – | Secondary line below the title (`<p>`). Hidden when omitted. |
| `actions` | `ReactNode` | – | Trailing action slot (typically buttons). Hidden when omitted. |
| `className` | `string` | – | Merged with `uxm-page-header`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-page-header-gap` | – | `16px` | Horizontal gap between icon, body, and actions. |
| `--uxm-page-header-padding-y` | – | `0px` | Vertical padding on the row. |
| `--uxm-page-header-padding-x` | – | `0px` | Horizontal padding on the row. |
| `--uxm-page-header-title-color` | `--color-text` | – | Title colour. |
| `--uxm-page-header-title-size` | – | `22px` | Title font size. |
| `--uxm-page-header-meta-color` | `--color-text-muted` | – | Meta text colour. |
| `--uxm-page-header-meta-size` | – | `13px` | Meta font size. |
| `--uxm-page-header-icon-bg` | `--color-accent-subtle` | – | Icon tile background (bridged to `--uxm-icon-tile-bg`). |
| `--uxm-page-header-icon-color` | `--color-accent-bold` | – | Icon tile glyph colour (bridged to `--uxm-icon-tile-color`). |
| `--uxm-page-header-icon-size` | – | `40px` | Icon tile size (bridged to `--uxm-icon-tile-size`). |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text` | Text / Text | Default title colour. |
| `--color-text-muted` | Text / Text Muted | Default meta colour. |
| `--color-accent-subtle` | Accent / Accent Subtle | Default icon tile background. |
| `--color-accent-bold` | Accent / Accent Bold | Default icon tile glyph colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`).

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Icon (if any) + title + optional meta + optional actions row. |
| Icon-less | `icon` omitted | Title body sits flush-left; no tile slot. |
| Meta-less | `meta` omitted | Title-only single-line body. |
| Actions-less | `actions` omitted | No trailing slot; body flexes to fill the row. |

## Accessibility

- Title renders inside `<h1>` — only one `PageHeader` per page in normal use; for sub-page headers (e.g. detail panes) demote semantically with a wrapping landmark or replace the heading at the consumer level.
- The icon tile is presentational; the `IconTile` atom decides on `aria-hidden` based on glyph metadata.
- Meta uses `<p>` — screen readers will announce it as a paragraph after the heading.
- Actions inherit their own semantics (provide proper button labels / `aria-label` on icon buttons).
- No focus management is performed; tab order follows source order (icon → title → meta → actions).
