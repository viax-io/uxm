# SegmentCard

Bordered card that wraps a **nested** configuration segment (depth ≥ 1): a header slot, an optional hairline divider, and an inset body holding the segment's child rows. Top-level segments render their rows without this wrapper.

`SegmentCard` is a pure layout/structure atom — it owns the card chrome (border, radius, background), the divider, and the inset/gap of the body. It does not own collapse behaviour; pair it with a [`SegmentRow`](../segment-row/README.md) header and drop the segment's [`ComponentRow`](../component-row/README.md)s in as children. Along with `SegmentRow`, `ComponentRow`, and [`OptionList`](../option-list/README.md), it forms the Configuration segment tree.

## Usage

```tsx
import { SegmentCard, SegmentRow, ComponentRow, Icon } from '@viax/uxm';

<SegmentCard header={<SegmentRow name="Location Details" count={2} dragHandle />}>
  <ComponentRow icon={<Icon glyph="square" />} name="Address" type="Address" />
  <ComponentRow icon={<Icon glyph="grid" />} name="Operating Hours" type="Range" />
</SegmentCard>;
```

## Props

### `SegmentCardProps`

Extends `HTMLAttributes<HTMLDivElement>` — any native `div` attribute (`style`, `className`, `data-*`, `id`, handlers) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `ReactNode` | – | Segment header row, rendered flush at the top of the card. |
| `divider` | `boolean` | `true` | Draw a hairline divider between header and body. Only shown when both a header and body content exist. |
| `children` | `ReactNode` | – | Inset child rows — the nested segment's components. |

## CSS variables

Set on the root (or an ancestor scope). Every one falls back to a design token, so the default look is unchanged.

| Variable | Fallback | Controls |
|----------|----------|----------|
| `--uxm-segment-card-background` | `var(--color-card)` | Card fill |
| `--uxm-segment-card-border-color` | `var(--color-border)` | Card border colour |
| `--uxm-segment-card-border-width` | `1px` | Card border width |
| `--uxm-segment-card-border-radius` | `12px` | Card corner radius |
| `--uxm-segment-card-padding-x` / `-y` | `0` | Card padding around header + body |
| `--uxm-segment-card-children-inset-x` / `-y` | `16px` | Inset padding of the body |
| `--uxm-segment-card-children-gap` | `4px` | Gap between child rows |
| `--uxm-segment-card-divider-color` | `var(--color-border)` | Divider colour |
| `--uxm-segment-card-divider-width` | `1px` | Divider thickness |

## Design tokens (MODO-configurable)

| Token read | Group / Name |
|------------|--------------|
| `--color-card` | Surfaces / Card (background) |
| `--color-border` | Borders / Border (border + divider) |

## Accessibility

- The divider is `role="separator"` + `aria-hidden` (decorative — it carries no independent meaning).
- `SegmentCard` is structural and adds no roles of its own; semantics come from the `header` and child content you supply.
