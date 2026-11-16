# ResponsiveGrid

A breakpoint-free CSS grid layout — drop N children inside and the browser fits as many columns as the available width allows, single-column otherwise.

`ResponsiveGrid` renders a single `<div>` with `grid-template-columns: repeat(auto-fit, minmax(min, 1fr))`. There's no media-query scaffolding, no `useResizeObserver`, no per-breakpoint prop ladder — the layout reacts to container width purely via CSS. Theming knobs live on `--uxm-responsive-grid-{min,gap}` so the MODO editor can tune the wrap point and gap globally; per-instance `min` / `gap` props override per render.

## Usage

```tsx
import { ResponsiveGrid } from '@viax.io/uxm';

function CardGrid({ items }) {
  return (
    <ResponsiveGrid min="240px" gap={20}>
      {items.map((item) => (
        <Card key={item.id} {...item} />
      ))}
    </ResponsiveGrid>
  );
}
```

### Fixed or weighted columns

Set `columns` for tracks the auto-fit can't express: a count (`3` → three equal columns) or a track list (`"2fr 1fr"`, `"240px 1fr"`). Wrap a cell in `GridItem` to span tracks, for a wide hero card or a bento layout:

```tsx
import { GridItem, ResponsiveGrid } from '@viax.io/uxm/ui';

<ResponsiveGrid columns={3} stackAt={640}>
  <GridItem span={2} rowSpan={2}><Hero /></GridItem>
  <StatCard … />
  <StatCard … />
</ResponsiveGrid>
```

The grid collapses to one column, and every span resets, when its **own container** is `stackAt` wide or narrower (`480` by default; `640`, `768`, `960`, or `false` to never collapse). That's measured on the grid, not the viewport, so the same grid is two columns in a wide pane and one in a side panel.

To measure itself, a `columns` grid renders two elements: a container root (your `className`, `style` and props) and an inner `.uxm-responsive-grid__track` holding the children. Like any block, the root takes its container's width; inside a flex row give it a width or `flex: 1`. Without `columns` the grid is the single element it always was.

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute (id, style, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `min` | `string` | `200px` (via CSS var) | Minimum column width before wrapping. Any CSS length: `"200px"`, `"20rem"`, `"20ch"`. Sets `--uxm-responsive-grid-min` inline. |
| `gap` | `string \| number` | `16px` (via CSS var) | Gap between cells. Numbers are coerced to `${n}px`; strings pass through. Sets `--uxm-responsive-grid-gap` inline. |
| `columns` | `number \| string` | – | Fixed tracks instead of auto-fit: a count, or a track list (`"2fr 1fr"`). Sets `--uxm-responsive-grid-columns` inline. `min` is ignored. |
| `stackAt` | `480 \| 640 \| 768 \| 960 \| false` | `480` | With `columns`: the grid's own container width at or below which it collapses to one column. `false` never collapses. |
| `children` | `ReactNode` | – | Grid items. |
| `className` | `string` | – | Merged with `uxm-responsive-grid` via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

### `GridItem`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `span` | `number \| 'full'` | – | Columns the cell spans; `'full'` spans every track. Sets `--uxm-grid-item-column`. |
| `rowSpan` | `number` | – | Rows the cell spans. Sets `--uxm-grid-item-row`. |
| _(any native div attribute)_ | – | – | Spread onto the cell `<div class="uxm-grid-item">`. |

Use `GridItem` in a `columns` grid, as a direct child: that's where the spans reset on collapse. In an auto-fit grid nothing resets them, so a `span={2}` overflows a container narrow enough for one column.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-responsive-grid-min` | – | `200px` | `minmax()` lower bound — the wrap threshold. |
| `--uxm-responsive-grid-gap` | – | `16px` | Row + column gap. |
| `--uxm-responsive-grid-columns` | – | – | The track list in `columns` mode (set from the prop). |
| `--uxm-grid-item-column` / `--uxm-grid-item-row` | – | `auto` | A `GridItem`'s `grid-column` / `grid-row` (set from `span` / `rowSpan`). |

Set globally for editor-driven defaults; per-instance props override by writing the inline custom property.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Wide container | `container width >= 2 * min + gap` | Multi-column layout, columns split available width equally. |
| Narrow container | `container width < min + gap` | Single column, items full-width. |
| Intermediate | – | Browser auto-fits as many columns as possible at `min` width minimum. |

## Accessibility

- Layout-only primitive — renders a plain `<div>`. Semantics are entirely up to the children.
- No bundled ARIA — if the grid represents a list, wrap usage with `role="list"` and give children `role="listitem"` (or use semantic `<ul>`/`<li>` children directly).
- Keyboard traversal follows DOM order. CSS Grid does not affect tab order, so children are reached in source order regardless of visual column.
