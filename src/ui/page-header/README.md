# PageHeader

A page-top header row pairing an optional icon tile, a title (`<h1>`), an optional meta line, and an optional actions slot.

The icon tile is delegated to the `IconTile` atom — PageHeader's `--uxm-page-header-icon-{bg,color,size}` variables are bridged onto IconTile's own CSS-variable surface via an inline style object so per-instance icon theming flows through without hand-rolled `__icon` CSS. Title and meta defaults match the `page-header` registry entry; each knob (`titleColor`, `titleSize`, `metaColor`, `metaSize`, `iconBg`, `iconColor`, `iconSize`, `gap`, `paddingX`, `paddingY`) maps to a CSS custom property the class rule reads.

## Usage

```tsx
import { PageHeader, ButtonPrimary, Icon } from '@viax.io/uxm';

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
| `--uxm-page-header-body-min` | – | `10rem` | Width floor for the body. Below it the row wraps and the actions drop to their own line instead of the title/meta being squeezed. Capped by `min(100%, …)` so it never overflows a narrower container. |
| `--uxm-page-header-padding-y` | – | `0px` | Vertical padding on the row. |
| `--uxm-page-header-padding-x` | – | `0px` | Horizontal padding on the row. |
| `--uxm-page-header-title-color` | `--color-text` | – | Title colour. |
| `--uxm-page-header-title-size` | – | `22px` | Title font size. |
| `--uxm-page-header-title-font` | `--type-page-title-font` → `--brand-heading-font` | `inherit` | Title typeface (**h1** role). Unset = inherits the body face. |
| `--uxm-page-header-title-weight` | `--type-page-title-weight` → `--brand-heading-weight` | `600` | Title weight (**h1** role). |
| `--uxm-page-header-title-size` | – | `22px` | Title size; multiplied by `--type-page-title-scale` and `--type-scale`. |
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

## Narrow widths

The row wraps. `actions` is `flex-shrink: 0`, so without this the body (formerly `min-width: 0`) was crushed instead: at 343px with four actions the header rendered **244px tall**, the body 14px wide and the meta line stacked over nine rows. With `flex-wrap` plus the `--uxm-page-header-body-min` floor the same header is **122px** — title and meta at full width, actions on their own row beneath, flush with the body's left edge.

This is width-driven, not a breakpoint: a `PageHeader` is as likely to be squeezed inside a docked flexpane at desktop width as on a phone, and neither a media nor a container query catches both. Wide layouts are untouched — at 1100px it is still a single 55px row.

The floor is what decides *when* to wrap, and it is decided against the floor rather than against the title's own width — CSS `min()` takes lengths, so `max-content` cannot go in there. That makes too generous a floor its own problem: at `16rem` a header with a short title and two actions wrapped at 460 / 420 / 380px, standing 88px tall where a single 40px row had been perfectly legible. The default is **`10rem`**, which moves that threshold to about 400px while still giving a long title 160px at 343px. Raise `--uxm-page-header-body-min` if your headers carry long titles and you would rather they wrap sooner.

With an `icon`, the icon shares the first line with the body down to **216px** (`40px` icon + `16px` gap + the `10rem` floor); below that the icon takes a line of its own and the header stacks in three rows. Every common phone viewport is well above that.

## Accessibility

- Title renders inside `<h1>` — only one `PageHeader` per page in normal use; for sub-page headers (e.g. detail panes) demote semantically with a wrapping landmark or replace the heading at the consumer level.
- The icon tile is presentational; the `IconTile` atom decides on `aria-hidden` based on glyph metadata.
- Meta uses `<p>` — screen readers will announce it as a paragraph after the heading.
- Actions inherit their own semantics (provide proper button labels / `aria-label` on icon buttons).
- No focus management is performed; tab order follows source order (icon → title → meta → actions).
