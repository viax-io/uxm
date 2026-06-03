# Card

A minimal surface primitive — a single `<div>` with a card background, border, padding, and optional drop shadow.

`Card` exists so consumers stop hand-rolling `bg-white border rounded p-6` div soup; all visual axes (background, border, radius, padding) read from `--uxm-card-*` CSS variables which fall back to MODO design tokens. The `shadow` boolean toggles a `uxm-card--shadow` modifier that applies the shared `--shadow-card` value (defined in the global tokens layer).

## Usage

```tsx
import { Card } from '@viax/uxm';

function Example() {
  return (
    <Card shadow>
      <h3>Card title</h3>
      <p>Card body content.</p>
    </Card>
  );
}
```

## Props

`CardProps` extends `HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `shadow` | `boolean` | `false` | When true, adds `uxm-card--shadow` which applies the global `--shadow-card` box-shadow. |
| `className` | `string` | – | Merged with `uxm-card` (and `uxm-card--shadow` when enabled) via `cn`. |
| `children` | `ReactNode` | – | Card content. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div className="uxm-card">`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-card-bg` | `--color-card` | – | Card background colour. |
| `--uxm-card-border-color` | `--color-border` | – | Card border colour. |
| `--uxm-card-radius` | – | `4px` | Card border-radius. |
| `--uxm-card-padding` | – | `24px` | Card inner padding. |

The shadow modifier reads `--shadow-card` directly (a global typography/elevation token outside the colour palette).

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
| Shadow | `shadow` prop | Adds `--shadow-card` drop shadow (global elevation token). |

`Card` has no interactive states — it's a static container.

## Accessibility

- Renders a plain `<div>` with no implicit role; if the card represents an interactive entity (link, button), wrap children in the appropriate semantic element or use a dedicated interactive component instead.
- Card text colour is inherited from the parent; ensure sufficient contrast against `--color-card` (`#FFFFFF` light / `#0B0B0B` dark) for content that overrides text colour locally.
- The `shadow` modifier is decorative only — do not rely on it to convey hierarchy without an accompanying semantic structure.
