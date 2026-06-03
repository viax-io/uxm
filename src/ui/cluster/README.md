# Cluster

A horizontal layout primitive — a flex row with a configurable gap that wraps by default. The canonical "tag list / filter chips / button row" container.

`Cluster` replaces hand-rolled `flex flex-wrap items-center gap-N` divs across the codebase. Alignment, justification, wrapping, and gap are all driven by modifier classes (`uxm-cluster--align-*`, `uxm-cluster--justify-*`, `uxm-cluster--wrap`) plus a single `--uxm-cluster-gap` CSS variable that's set inline when the `gap` prop is provided.

## Usage

```tsx
import { Cluster, Chip } from '@viax/uxm';

function FilterBar({ filters }: { filters: string[] }) {
  return (
    <Cluster gap={8} align="center" justify="start">
      {filters.map((f) => (
        <Chip key={f}>{f}</Chip>
      ))}
    </Cluster>
  );
}
```

## Props

`ClusterProps` extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `string \| number` | `12px` (via CSS default) | Gap between items. Numbers are treated as pixels; strings pass through verbatim (e.g. `'1rem'`). Injected as the inline `--uxm-cluster-gap` custom property. |
| `align` | `'start' \| 'center' \| 'end' \| 'baseline'` | `'center'` | Cross-axis alignment (`align-items`). Useful when children have mixed heights. |
| `justify` | `'start' \| 'center' \| 'end' \| 'between'` | `'start'` | Main-axis distribution (`justify-content`). `'between'` is the toolbar pattern. |
| `wrap` | `boolean` | `true` | Toggle `flex-wrap`. Set `false` for strict single-row toolbars. |
| `className` | `string` | – | Merged with the cluster classes via `cn`. |
| `style` | `CSSProperties` | – | Merged on top of the gap-injecting style object. |
| `children` | `ReactNode` | – | Items to lay out. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-cluster-gap` | – | `12px` | Gap between flex items. Set per-instance via the `gap` prop or globally on a higher scope. |

Cluster is layout-only and reads no colour tokens.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Align: `start` / `center` / `end` / `baseline` | `align` prop | `align-items: flex-start / center / flex-end / baseline`. |
| Justify: `start` / `center` / `end` / `between` | `justify` prop | `justify-content: flex-start / center / flex-end / space-between`. |
| Wrap | `wrap={true}` (default) | `flex-wrap: wrap`. When `false`, items stay on one row and may overflow. |

## Accessibility

- Renders a plain `<div>` with no implicit role — it's a visual layout, not a semantic group. Add `role="toolbar"`, `role="group"`, or an `aria-label` on the consumer side when the cluster represents a meaningful collection.
- Keyboard navigation between cluster items is delegated to the children themselves (e.g. each `<Chip>` or `<Button>` manages its own focus); Cluster does not intercept tab order.
- `wrap={false}` can cause horizontal overflow on narrow viewports — pair with `overflow-x` handling on the parent if needed.
