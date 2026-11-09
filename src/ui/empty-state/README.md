# EmptyState

A vertically-centered placeholder block — optional icon, required title, optional description, optional action slot — for "no results" / "nothing here yet" surfaces.

`EmptyState` renders a single flex column `<div>` with center alignment, a 48px default padding, and a 12px gap between children. The icon is sized via custom property and rendered inside a fixed-dimension square (its inner `<svg>` stretches to 100%). The description has a `max-width: 32ch` to keep wrapping at a comfortable reading length, and the action slot adds an extra 8px top margin so primary CTAs sit visually distinct from the description.

Two optional looks tell the cases apart: `variant="first-run"` frames the block to invite a first action, and `variant="no-results"` is a quieter, unframed message in the place the results would be. `size="compact"` fits a card or a tile.

## Usage

```tsx
import { EmptyState, ButtonPrimary, Icon } from '@viax.io/uxm';

function Example() {
  return (
    <EmptyState
      icon={<Icon glyph="inbox" />}
      title="No messages yet"
      description="When customers reach out, their threads will show up here."
      action={<ButtonPrimary>Compose message</ButtonPrimary>}
    />
  );
}
```

```tsx
// First run: framed, with the action that fills it.
<EmptyState variant="first-run" icon={<Icon glyph="inbox" />} title="No messages yet" action={<ButtonPrimary>Compose message</ButtonPrimary>} />

// A filter or search that came back empty.
<EmptyState variant="no-results" icon={<Icon glyph="search" />} title="No messages match" description="Try another search." />

// Inside a card; add `--uxm-empty-state-align: start` for a left-aligned tile.
<EmptyState size="compact" icon={<Icon glyph="inbox" />} title="Nothing here yet" />
```

## Props

### `EmptyStateProps`

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` — `title` is shadowed because the component repurposes it as a `ReactNode` heading. All other div attributes flow through to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | – | **Required.** Rendered into `&__title`. |
| `icon` | `ReactNode` | – | Optional. Rendered above the title at the icon-size box. |
| `description` | `ReactNode` | – | Optional muted line below the title; capped at `32ch`. |
| `action` | `ReactNode` | – | Optional. Typically a `ButtonPrimary` or link, with extra top margin. |
| `variant` | `'default' \| 'first-run' \| 'no-results'` | `'default'` | `first-run` adds a dashed frame on the surface; `no-results` drops to 32px 16px padding and a 32px icon. Adds `uxm-empty-state--first-run` / `--no-results`. |
| `size` | `'default' \| 'compact'` | `'default'` | `compact`: 20px 12px 8px padding, 24px icon, 8px gap, 14px title, 13px description. Adds `uxm-empty-state--compact`; combines with either variant. |
| `className` | `string` | – | Merged onto the root via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-empty-state-padding` | – | `48px` | Padding on the root flex column. |
| `--uxm-empty-state-icon-color` | `--color-border` | – | Icon color (a muted gray by default — deliberately washed). |
| `--uxm-empty-state-icon-size` | – | `48px` | Icon box width/height. |
| `--uxm-empty-state-title-color` | `--color-text` | – | Title text color. |
| `--uxm-empty-state-description-color` | `--color-text-muted` | – | Description text color. |
| `--uxm-empty-state-gap` | – | `12px` (`8px` compact) | Flex gap between the children. |
| `--uxm-empty-state-icon-gap` | – | the gap | Whole icon → title distance. |
| `--uxm-empty-state-action-gap` | – | the gap + `8px` | Whole description → action distance. |
| `--uxm-empty-state-align` | – | `center` | `start` left-aligns the block and its text (both `align-items` and `text-align`). |
| `--uxm-empty-state-title-font-size` | – | `16px` (`14px` compact) | Title size, times `--type-scale`. |
| `--uxm-empty-state-description-font-size` | – | `14px` (`13px` compact) | Description size, times `--type-scale`. |
| `--uxm-empty-state-description-max-width` | – | `32ch` | Description measure; `none` lifts it. |
| `--uxm-empty-state-icon-vector-effect` | – | `none` (`non-scaling-stroke` in the variants and compact) | See "Icon stroke" below. |
| `--uxm-empty-state-first-run-background` | `--color-surface` | – | First-run frame fill. Read only by `first-run`. |
| `--uxm-empty-state-first-run-border-color` | `--color-border` | – | First-run frame colour. |
| `--uxm-empty-state-first-run-border-width` | – | `1px` | First-run frame width. |
| `--uxm-empty-state-first-run-border-style` | – | `dashed` | First-run frame style. |
| `--uxm-empty-state-first-run-radius` | – | `4px` | First-run frame radius (Card's). |

A knob always wins over a variant: the variants and `compact` change only the defaults above (through private `--_uxm-empty-state-*` values), so `--uxm-empty-state-padding` set on a wrapper still applies in `compact`.

**Give the three gap knobs a unit.** `--uxm-empty-state-gap`, `-icon-gap` and `-action-gap` are subtracted from one another in a `calc()`. A bare `0` is a number, not a length, and makes that `calc()` invalid, so the knob is silently ignored: `--uxm-empty-state-icon-gap: 0` leaves the icon 12px from the title. Write `0px`. Studio always saves with a unit.

### Icon stroke

The icon box stretches its `<svg>` to the icon size, and every `Icon` draws on a 24-unit `viewBox`, so in the default 48px box a glyph's stroke is drawn twice as thick (the default 1.75 stroke paints 3.5px) whatever the `Icon`'s own `size`. `first-run`, `no-results` and `compact` set `vector-effect: non-scaling-stroke` on the glyph's shapes, so the stroke keeps the glyph's own width. The default look keeps the scaled stroke, because changing it would thin every existing empty state; set `--uxm-empty-state-icon-vector-effect: non-scaling-stroke` to opt in. The rule sits on every shape inside the icon slot and beats SVG presentation attributes, so in any look a `vectorEffect` attribute on your own `<svg>`'s shapes is overridden; set the knob instead.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-border` | Borders / Border | Default icon color (washed-out illustration tint). |
| `--color-text` | Text / Text | Title text. |
| `--color-text-muted` | Text / Text Muted | Description text. |
| `--color-surface` | Surfaces / Surface | First-run frame fill. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Icon-less | `icon` omitted | Title is the first child; no icon box rendered. |
| With description | `description` provided | Muted 14px paragraph, max-width `32ch`. |
| With action | `action` provided | Slot rendered last with `margin-top: 8px`. |
| Minimal | only `title` provided | Single 16px/600 heading line, centered. |
| First run | `variant="first-run"` | Dashed 1px `--color-border` frame on `--color-surface`, 4px radius. Muted description on the surface is 5.02:1 in light. |
| No results | `variant="no-results"` | Unframed; 32px 16px padding, 32px icon. |
| Compact | `size="compact"` | 20px 12px 8px padding, 24px icon, 8px gap, 14 / 13px type. |

## Accessibility

- Renders a plain `<div>` — no implicit landmark or heading semantics. The title is a `<div>` (not an `<h*>`); consumers needing heading semantics should pass an `<h1>`–`<h6>` as the `title` value or wrap the component in a section with its own heading.
- No `role="status"` or `aria-live` is wired — if the empty state appears in response to a filter / search action, consumers should announce it via a parent live region.
- Action slot is purely a container — the action element itself (e.g. `ButtonPrimary`) owns its own focus, keyboard, and label semantics.
- Icon is not marked `aria-hidden` automatically — if the icon is decorative, ensure the passed node carries `aria-hidden="true"` or use a properly labeled icon component.
