# SegmentRow

Header row of a configuration segment: an optional drag handle, an accent line, an expand chevron, the segment name, and an item-count badge. The **same** row is used at every depth — indent/nesting is owned by the wrapping [`SegmentCard`](../segment-card/README.md), not this row.

`SegmentRow` is a building block of the Configuration segment tree. It is presentational + controlled/uncontrolled for its expanded state (the chevron direction); the actual show/hide of a segment's body is owned by the container that composes it.

## Usage

```tsx
import { SegmentCard, SegmentRow, ComponentRow } from '@viax/uxm';

const [open, setOpen] = useState(true);

<SegmentCard header={<SegmentRow name="Practice Information" count={4} dragHandle open={open} onOpenChange={setOpen} />}>
  {open && <ComponentRow name="Practice Name" type="Text" />}
</SegmentCard>;
```

## Props

### `SegmentRowProps`

Extends `HTMLAttributes<HTMLDivElement>` (minus `title`).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `ReactNode` | – | **Required.** Segment title. |
| `count` | `number` | – | Item count → trailing "N items" badge. Omit for no badge. |
| `open` | `boolean` | – | Controlled expanded state (chevron direction). |
| `defaultOpen` | `boolean` | `true` | Initial expanded state (uncontrolled). |
| `onOpenChange` | `(open: boolean) => void` | – | Fires with the next state when the title toggle is clicked (same `open`/`defaultOpen`/`onOpenChange` triad as `Disclosure`). |
| `bodyId` | `string` | – | `id` of the toggled region — set to the paired `SegmentCard`'s `bodyId` to wire the toggle's `aria-controls`. |
| `dragHandle` | `boolean` | `false` | Show a leading drag-handle affordance (visual only). |
| `actions` | `ReactNode` | – | Trailing controls revealed on hover/focus, after the count. |

## CSS variables

Set on the root (or an ancestor scope); each falls back to a design token.

| Variable | Fallback | Controls |
|----------|----------|----------|
| `--uxm-segment-row-padding-x` / `-y` | `16px` / `20px` | Row padding |
| `--uxm-segment-row-gap` | `8px` | Gap between parts |
| `--uxm-segment-row-drag-color` / `-drag-hover-color` | `text-subtle` / `text-muted` | Drag handle |
| `--uxm-segment-row-chevron-color` / `-chevron-size` | `text-muted` / `16px` | Expand chevron |
| `--uxm-segment-row-accent-color` / `-accent-width` / `-accent-radius` | `accent-bold` / `4px` / `2px` | Accent line |
| `--uxm-segment-row-title-color` / `-title-size` / `-title-weight` | `text` / `16px` / `600` | Title (weight falls back through `--brand-heading-weight`) |
| `--uxm-segment-row-title-font` | `--brand-heading-font` → `inherit` | Title typeface; unset brand = inherits the body face |
| `--uxm-segment-row-count-bg` / `-count-color` / `-count-size` | `surface-alt` / `text-muted` / `12px` | Count badge |
| `--uxm-segment-row-count-padding-x` / `-y` / `-count-radius` | `10px` / `2px` / `999px` | Count badge shape |
| `--uxm-segment-row-row-hover-bg` / `-row-hover-radius` | `color-mix(text 4%)` / `12px` | Row hover highlight |

## Design tokens (MODO-configurable)

`--color-accent-bold` (accent line) · `--color-text` (title) · `--color-text-muted` / `--color-text-subtle` (chevron, drag) · `--color-surface-alt` (count badge).

## Accessibility

- The title toggle is a real `<button>` with `aria-expanded` reflecting the open state, and `aria-controls` pointing at the paired `SegmentCard` body when `bodyId` is supplied.
- Drag handle and accent line are `aria-hidden` decorative.
- Actions are kept outside the toggle button so controls aren't nested inside a button.
