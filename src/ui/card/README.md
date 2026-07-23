# Card

A surface primitive — a `<div>` with a card background, border, padding, and optional drop shadow — that can also arrange its own content via an opt-in layout.

`Card` exists so consumers stop hand-rolling `bg-white border rounded p-6` div soup; all visual axes (background, border, radius, padding) read from `--uxm-card-*` CSS variables which fall back to MODO design tokens. The `shadow` boolean toggles a `uxm-card--shadow` modifier that applies the shared `--shadow-card` value (defined in the global tokens layer).

The card's children are arbitrary — a heading, detail rows, a chart, buttons, anything. When `gap` is set, the card becomes a vertical column and spaces its direct children by that amount; the card doesn't care what they are.

`Card` is deliberately unopinionated about how the **content** is arranged. It does not have a `layout`/`stack`/`cluster` mode, because a mode on the card would also move a header stacked above the content. Instead, compose the content layout as a child — a `Stack`, `Cluster`, or `ResponsiveGrid` — so it scopes to the content and the header stays put. This also means `stack` and `cluster` are just independent choices a page author makes per usage, never a saved per-instance variant.

## Usage

Two independent gaps come from composition, not from two card props: the card's own `gap` spaces the header from the content group, and a nested `Stack`/`Cluster` gap spaces the rows.

```tsx
import { Card, FormField, Stack } from '@viax/uxm';

function Example() {
  return (
    <Card gap={20} padding={24} shadow>
      {/* optional header — just composed content */}
      <header>…</header>

      {/* content layout is composed; swap Stack → Cluster for a horizontal
          content row without touching the header. Want hairlines between
          rows? Compose the Divider atom between them — also not a Card
          concern. */}
      <Stack gap={12}>
        <FormField label="Name" labelPosition="side" labelTone="muted">…</FormField>
        <FormField label="Status" labelPosition="side" labelTone="muted">…</FormField>
      </Stack>
    </Card>
  );
}
```

## Props

`CardProps` extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `shadow` | `boolean` | `false` | Adds `uxm-card--shadow`. The shadow itself is built from the `--uxm-card-shadow-*` vars (colour / blur / vertical offset) — tune it rather than accepting a fixed elevation. |
| `padding` | `number \| string` | – (CSS `24px`) | Inner padding. Number → px, string passthrough. Any value — no fixed scale. Sets `--uxm-card-padding`. |
| `gap` | `number \| string \| boolean` | – | Vertical gap between the card's direct children. When set, adds the `uxm-card--gap` modifier (flex column). A number/string sets `--uxm-card-gap` per instance; `true` opts into the column with the themed default gap (workbench-editable). Number → px. |
| `className` | `string` | – | Merged with `uxm-card` via `cn`. |
| `children` | `ReactNode` | – | Card content — arbitrary. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div className="uxm-card">`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-card-bg` | `--color-card` | – | Card background colour. |
| `--uxm-card-border-color` | `--color-border` | – | Card border colour. |
| `--uxm-card-radius` | – | `4px` | Card border-radius. |
| `--uxm-card-padding` | – | `24px` | Card inner padding. |
| `--uxm-card-gap` | – | `16px` | Column gap between direct children (only applies with the `uxm-card--gap` modifier / `gap` prop). |
| `--uxm-card-shadow-color` | – | theme-aware | Shadow colour (when `shadow` is on). Default `rgba(0,0,0,0.12)` light / `rgba(0,0,0,0.3)` dark; an explicit value wins in both themes. |
| `--uxm-card-shadow-blur` | – | `20px` | Shadow blur radius. |
| `--uxm-card-shadow-offset-y` | – | `6px` | Shadow vertical offset. |

The `shadow` modifier composes its `box-shadow` from the three `--uxm-card-shadow-*` vars, so elevation is tunable (colour / blur / offset) instead of a fixed token. The default colour is theme-aware (internal `--uxm-card-shadow-default`, dark override in `card.scss`, values in step with the `--shadow-card` token).

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Card background (via `--uxm-card-bg` fallback). |
| `--color-border` | Borders / Border | Card border (via `--uxm-card-border-color` fallback). |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | `--color-card` bg, `--color-border` outline, no shadow. |
| Shadow | `shadow` prop | Adds a drop shadow composed from `--uxm-card-shadow-*` (colour / blur / offset). |

`Card` has no interactive states — it's a static container.

## Accessibility

- Renders a plain `<div>` with no implicit role; if the card represents an interactive entity (link, button), wrap children in the appropriate semantic element or use a dedicated interactive component instead.
- Card text colour is inherited from the parent; ensure sufficient contrast against `--color-card` (`#FFFFFF` light / `#0B0B0B` dark) for content that overrides text colour locally.
- The `shadow` modifier is decorative only — do not rely on it to convey hierarchy without an accompanying semantic structure.
