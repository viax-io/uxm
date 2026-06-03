# Alert

A status banner for surfacing inline feedback — success, info, warning, or error — paired with an optional title and a variant-appropriate icon glyph.

`Alert` wraps its children in a `<div role="alert">` with a BEM root (`uxm-alert`) plus a `--{variant}` modifier. Each variant maps to a glyph in the `Icon` registry (success / info / warning / error → `check-circle` / `info` / `exclamation-triangle` / `exclamation-circle`); callers can override by passing a custom `icon` node. The native `title` attribute is intentionally stripped from `HTMLAttributes` so the prop can carry a `ReactNode` heading instead.

## Usage

```tsx
import { Alert } from '@viax/uxm';

function Example() {
  return (
    <Alert variant="warning" title="Heads up">
      The configuration you saved will take effect on next deploy.
    </Alert>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'success' \| 'info' \| 'warning' \| 'error'` | `'info'` | Tone preset; drives both the colour palette and the default icon glyph. |
| `title` | `ReactNode` | – | Optional bold heading rendered above the children. |
| `icon` | `ReactNode` | _(variant glyph)_ | Overrides the default icon — pass `null` only if you also re-style the `__icon` slot to collapse. |
| `children` | `ReactNode` | – | **Required.** Body content; rendered into `uxm-alert__content`. |
| `className` | `string` | – | Merged with the root class via the `cn` helper. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div role="alert">`. `title` is excluded from the spread. |

## CSS variables

Alert does not expose any `--uxm-alert-*` custom properties; all colour comes directly from the design-token layer and structural metrics (border radius, gap, padding) are hardcoded.

## Design tokens (MODO-configurable)

Per-variant colour resolves through the global design-token layer exported by `@viax/uxm/tokens`. Changes saved in MODO's brand-settings editor flow into `:root` as `--color-*` declarations and re-tint every alert instantly.

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-info-bg` | Semantic / Info Bg | `info` background. |
| `--color-info-border` | Semantic / Info Border | `info` border. |
| `--color-info-text` | Semantic / Info Text | `info` text + icon. |
| `--color-success-bg` | Semantic / Success Bg | `success` background. |
| `--color-success-border` | Semantic / Success Border | `success` border. |
| `--color-success-text` | Semantic / Success Text | `success` text + icon. |
| `--color-warning-bg` | Semantic / Warning Bg | `warning` background. |
| `--color-warning-border` | Semantic / Warning Border | `warning` border. |
| `--color-warning-text` | Semantic / Warning Text | `warning` text + icon. |
| `--color-danger-bg` | Semantic / Danger Bg | `error` background. |
| `--color-danger-border` | Semantic / Danger Border | `error` border. |
| `--color-danger-text` | Semantic / Danger Text | `error` text + icon. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| `info` | `variant="info"` (or omitted) | Blue-toned background, border and text; `info` glyph. |
| `success` | `variant="success"` | Green-toned palette; `check-circle` glyph. |
| `warning` | `variant="warning"` | Amber palette; `exclamation-triangle` glyph. |
| `error` | `variant="error"` | Red-toned palette; `exclamation-circle` glyph. |
| With title | `title` provided | Bold heading rendered above content with a 4px gap; body content drops to `opacity: 0.9`. |
| Custom icon | `icon` passed | Provided node replaces the default glyph inside `uxm-alert__icon`. |

## Accessibility

- Root carries `role="alert"`, so screen readers announce the contents as a live region when the element first appears.
- Decorative icon slot has `aria-hidden="true"`; meaning is conveyed by the colour-coded variant and the text content (and the optional `title`).
- No focus management or dismiss affordance is provided — this is a static banner. Wrap in a dismissable container if you need close behaviour.
- Colour contrast in each variant comes from the paired `*-bg` / `*-text` tokens — verify against WCAG AA if you customise them via MODO.
- The variant alone is not sufficient to convey meaning to colour-blind users; always include a meaningful `title` or body copy.
