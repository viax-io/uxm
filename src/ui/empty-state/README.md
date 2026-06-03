# EmptyState

A vertically-centered placeholder block — optional icon, required title, optional description, optional action slot — for "no results" / "nothing here yet" surfaces.

`EmptyState` renders a single flex column `<div>` with center alignment, a 48px default padding, and a 12px gap between children. The icon is sized via custom property and rendered inside a fixed-dimension square (its inner `<svg>` stretches to 100%). The description has a `max-width: 32ch` to keep wrapping at a comfortable reading length, and the action slot adds an extra 8px top margin so primary CTAs sit visually distinct from the description.

## Usage

```tsx
import { EmptyState, ButtonPrimary, Icon } from '@viax/uxm';

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

## Props

### `EmptyStateProps`

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` — `title` is shadowed because the component repurposes it as a `ReactNode` heading. All other div attributes flow through to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | – | **Required.** Rendered into `&__title`. |
| `icon` | `ReactNode` | – | Optional. Rendered above the title at the icon-size box. |
| `description` | `ReactNode` | – | Optional muted line below the title; capped at `32ch`. |
| `action` | `ReactNode` | – | Optional. Typically a `ButtonPrimary` or link, with extra top margin. |
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

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-border` | Borders / Border | Default icon color (washed-out illustration tint). |
| `--color-text` | Text / Text | Title text. |
| `--color-text-muted` | Text / Text Muted | Description text. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Icon-less | `icon` omitted | Title is the first child; no icon box rendered. |
| With description | `description` provided | Muted 14px paragraph, max-width `32ch`. |
| With action | `action` provided | Slot rendered last with `margin-top: 8px`. |
| Minimal | only `title` provided | Single 16px/600 heading line, centered. |

## Accessibility

- Renders a plain `<div>` — no implicit landmark or heading semantics. The title is a `<div>` (not an `<h*>`); consumers needing heading semantics should pass an `<h1>`–`<h6>` as the `title` value or wrap the component in a section with its own heading.
- No `role="status"` or `aria-live` is wired — if the empty state appears in response to a filter / search action, consumers should announce it via a parent live region.
- Action slot is purely a container — the action element itself (e.g. `ButtonPrimary`) owns its own focus, keyboard, and label semantics.
- Icon is not marked `aria-hidden` automatically — if the icon is decorative, ensure the passed node carries `aria-hidden="true"` or use a properly labeled icon component.
