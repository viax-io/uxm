# DetailSection

A bordered card with a left accent rail, an icon tile, a title/subtitle header, and an optional body slot. Used for grouping read-only or composite content in detail pages and side panels.

`DetailSection` renders as a `<section>` with three structural pieces: a positioned `&__accent` rail along the left edge, an inner `&__inner` block whose left padding is computed (`padding + rail-width + 4px`) so toggling the rail doesn't reflow content, and a `<header>` containing an optional `IconTile` and an `<h3>` title + optional `<p>` subtitle. The icon tile theming is bridged: the component projects `--uxm-detail-section-icon-{bg,color}` onto `IconTile`'s own `--uxm-icon-tile-{bg,color}` vars via inline style, so editor saves at the section level flow through to the nested tile.

## Usage

```tsx
import { DetailSection, Icon } from '@viax/uxm';

function Example() {
  return (
    <DetailSection
      icon={<Icon glyph="info" />}
      title="Billing details"
      subtitle="Active subscription"
    >
      Renews on the 1st of every month.
    </DetailSection>
  );
}
```

## Props

### `DetailSectionProps`

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` — any standard HTML attribute (`id`, `style`, `data-*`, `aria-*`) is forwarded to the root `<section>`. `title` is shadowed because the component repurposes it as a `ReactNode` heading.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | – | **Required.** Rendered into `<h3>` inside the header. |
| `icon` | `ReactNode` | – | Rendered inside an `IconTile`. When omitted, the tile is not rendered. |
| `subtitle` | `ReactNode` | – | Optional muted line below the title. |
| `children` | `ReactNode` | – | Body content. When omitted, the `&__body` slot is not rendered. |
| `className` | `string` | – | Merged onto the root `<section>` via `cn`. |
| _(any native section attribute)_ | – | – | Spread onto the root `<section className="uxm-detail-section">`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-detail-section-bg` | `--color-card` | – | Section background. |
| `--uxm-detail-section-border-color` | `--color-border` | – | Section border. |
| `--uxm-detail-section-radius` | – | `4px` | Section corner radius. |
| `--uxm-detail-section-padding` | – | `20px` | Inner padding (left is `padding + accent-width + 4px`). |
| `--uxm-detail-section-accent-color` | `--color-accent` | – | Left rail fill. |
| `--uxm-detail-section-accent-width` | – | `3px` | Left rail width. |
| `--uxm-detail-section-icon-bg` | `--color-surface-alt` | – | Icon tile background (bridged into `--uxm-icon-tile-bg`). |
| `--uxm-detail-section-icon-color` | `--color-text-muted` | – | Icon tile foreground (bridged into `--uxm-icon-tile-color`). |
| `--uxm-detail-section-title-size` | – | `15px` | Title font size. |
| `--uxm-detail-section-subtitle-color` | `--color-text-muted` | – | Subtitle text color. |

The icon tile is also pinned at `--uxm-icon-tile-size: 32px` and `--uxm-icon-tile-radius: 6px` via the in-component `ICON_TILE_STYLE` constant — these are not editable through DetailSection's own vars.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Section background. |
| `--color-border` | Borders / Border | Section border. |
| `--color-accent` | Accent / Accent | Left rail. |
| `--color-surface-alt` | Surfaces / Surface Alt | Icon tile background. |
| `--color-text` | Text / Text | Title text (hardcoded `var(--color-text)` — not behind a `--uxm-*` knob). |
| `--color-text-muted` | Text / Text Muted | Icon tile foreground, subtitle text, body text. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| With icon | `icon` prop provided | Renders an `IconTile` before the heading column. |
| Without icon | `icon` omitted | Heading column starts at the inner padding edge. |
| With subtitle | `subtitle` prop provided | Muted 12px `<p>` rendered 2px below the title. |
| With body | `children` provided | `&__body` block rendered 12px below the header in muted 13px text. |
| Header-only | `children` omitted | No body slot; section collapses to header height. |

## Accessibility

- Renders a semantic `<section>` with an `<h3>` title — screen readers announce the heading and group via standard landmark/heading navigation. The component does **not** wire `aria-labelledby` on the section to the title; consumers can add `id` + `aria-labelledby` via `...rest` if needed.
- The accent rail is `aria-hidden="true"` — purely decorative.
- Body text uses `--color-text-muted` at 13px — verify contrast against `--color-card` when consumers override either token.
- No interactive elements are baked in; if `children` contains controls, their own accessibility (focus, labels, keyboard) is the consumer's responsibility.
