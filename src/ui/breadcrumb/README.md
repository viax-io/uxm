# Breadcrumb

A trail navigation component — renders a `<nav aria-label="Breadcrumb">` containing an ordered list of crumbs separated by a configurable glyph (chevron, slash, dot, or dash). The last crumb is the current page and is not rendered as a link.

`Breadcrumb` composes the library's `Link` for clickable crumbs and uses descendant-scoped selectors (`.uxm-breadcrumb .uxm-link`) so its own styling wins over Link's globally saved overrides. Disabled crumbs are still rendered as `Link` with `aria-disabled` so the CSS disabled rule paints; pointer events are blocked. Custom `--uxm-breadcrumb-*` variables cover typography, gap, and per-slot colour without falling back to the underlying Link's knobs.

## Usage

```tsx
import { Breadcrumb } from '@viax.io/uxm';

function PageHeader() {
  return (
    <Breadcrumb
      separator="chevron"
      items={[
        { label: 'Home', href: '/' },
        { label: 'Models', href: '/models' },
        { label: 'Acme V2' },
      ]}
    />
  );
}
```

## Props

### `BreadcrumbProps`

Extends `HTMLAttributes<HTMLElement>` — any standard attribute (id, style, data-*, aria-*) is forwarded to the `<nav>` root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbCrumb[]` | – | **Required.** Ordered crumbs; the last one is rendered as the current page. |
| `separator` | `'slash' \| 'chevron' \| 'dot' \| 'dash'` | `'chevron'` | Glyph rendered between crumbs. `chevron` uses the `chevron-right` `Icon`; the others render their character inside a `<span>`. |
| `className` | `string` | – | Merged with the `<nav>` root class via `cn`. |
| _(any native nav attribute)_ | – | – | Spread onto the `<nav>`. |

### `BreadcrumbCrumb`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `ReactNode` | yes | Visible crumb content. |
| `href` | `string` | no | When present (and not the last crumb), the crumb renders as a `Link`. The last crumb always renders as a `<span aria-current="page">` even with `href` set. |
| `disabled` | `boolean` | no | Forwarded to `Link`; renders with `aria-disabled` and CSS-disabled styling. Has no effect on the last (current-page) crumb. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-breadcrumb-font-size` | – | `13px` | Root font size + per-link font size. |
| `--uxm-breadcrumb-link-color` | `--color-text-muted` | – | Resting link colour. |
| `--uxm-breadcrumb-link-hover-color` | `--color-text` | – | Link hover colour. |
| `--uxm-breadcrumb-link-weight` | – | `500` | Link font weight. |
| `--uxm-breadcrumb-underline-thickness` | – | `1px` | Link underline thickness. |
| `--uxm-breadcrumb-underline-offset` | – | `3px` | Link underline offset. |
| `--uxm-breadcrumb-gap` | – | `6px` | Gap between crumbs in the list, and between label + separator inside an item. |
| `--uxm-breadcrumb-current-color` | `--color-text` | – | Current-page (last crumb) text colour. |
| `--uxm-breadcrumb-current-weight` | – | `600` | Current-page font weight. |
| `--uxm-breadcrumb-separator-color` | `--color-text-subtle` | – | Separator colour. |
| `--uxm-breadcrumb-separator-size` | – | `13px` | Separator font size + icon dimensions. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text-muted` | Text / Text Muted | Resting link colour. |
| `--color-text` | Text / Text | Link hover colour + current-page colour. |
| `--color-text-subtle` | Text / Text Subtle | Separator colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default crumb | `item.href` set, not last | Renders as a `Link` with `underline="hover"`. |
| Current page | Last item in `items` | Renders as `<span aria-current="page">`, bolder weight. |
| Disabled | `item.disabled` | Crumb is a `Link` with `aria-disabled`; CSS suppresses pointer events. |
| Separator: chevron | `separator="chevron"` (or omitted) | `chevron-right` icon sized via `--uxm-breadcrumb-separator-size`. |
| Separator: slash | `separator="slash"` | `/` glyph in a `<span aria-hidden>`. |
| Separator: dot | `separator="dot"` | `·` glyph. |
| Separator: dash | `separator="dash"` | `—` glyph. |
| Last item separator | Structural | Separator is suppressed after the final crumb. |
| Wrapping | List wraps | `__list` uses `flex-wrap: wrap` — crumbs reflow onto the next line on narrow widths. |

## Accessibility

- Root is a `<nav aria-label="Breadcrumb">` — screen readers announce the landmark with its purpose without consumers needing to do anything. That default takes **no prop to override**: `...rest` is spread after it, so passing `aria-label` replaces it — do that in a localised UI, or when a page carries more than one trail.
- The trail is an ordered list (`<ol>`) — listeners get position-in-set semantics ("item 2 of 3").
- The final crumb is marked `aria-current="page"` and is **not** a link — assistive tech correctly identifies the current page.
- Separator nodes carry `aria-hidden` so they're skipped by screen readers.
- Disabled crumbs use `aria-disabled` (via `Link`) rather than removing them from the DOM — the position in the trail is preserved.
- For very long trails, consumers may want to render a truncation crumb (e.g. `"…"`) themselves — Breadcrumb does not collapse items.
