# LifecycleTerminal

A small rounded pill marking the entry or exit point of a BI lifecycle canvas — typically "Start" at the top and "End" at the bottom.

`LifecycleTerminal` is a minimal `<div>` wrapper around a single text label. The default `label` is `"Start"` so the common case is a one-liner; pass `children` instead to render arbitrary nodes. All sizing (height, width, font), colours, and the border are CSS-token-driven so the editor can re-tune dimensions without touching markup. Sibling of `LifecycleConnector`, `LifecycleEdgeLabel`, `LifecycleNodeCard`, `LifecycleMinimap`, and `LifecycleZoomControl`.

## Usage

```tsx
import { LifecycleTerminal } from '@viax/uxm';

function Canvas() {
  return (
    <>
      <LifecycleTerminal />
      {/* ... node graph ... */}
      <LifecycleTerminal label="End" />
    </>
  );
}
```

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute (id, style, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | `'Start'` | Text shown inside the pill. Ignored when `children` is provided. |
| `children` | `ReactNode` | – | Optional override — when present, replaces `label` entirely. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-lifecycle-terminal-bg` | – | `#FFFFFF` | Background. |
| `--uxm-lifecycle-terminal-border-color` | `--color-border` | – | Border colour. |
| `--uxm-lifecycle-terminal-radius` | – | `4px` | Border radius. |
| `--uxm-lifecycle-terminal-color` | `--color-text-muted` | – | Label colour. |
| `--uxm-lifecycle-terminal-font-size` | – | `13px` | Label font size. |
| `--uxm-lifecycle-terminal-font-weight` | – | `500` | Label font weight. |
| `--uxm-lifecycle-terminal-height` | – | `32px` | Pill height. |
| `--uxm-lifecycle-terminal-width` | – | `60px` | Pill width. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-border` | Borders / Border | Pill border colour. |
| `--color-text-muted` | Text / Text Muted | Label colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

> The background falls back to a literal `#FFFFFF` rather than `--color-card` — override `--uxm-lifecycle-terminal-bg` if you need MODO-driven theming on the fill.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | White pill, muted text, border-coloured outline, 60×32px. |
| Custom label | `label` prop | Text content swaps; geometry unchanged. |
| Custom content | `children` prop | Renders the children instead of `label`. |

## Accessibility

- Renders a plain `<div>` — no role or accessible name beyond the visible text. For canvas overviews announced to screen readers, ensure the surrounding diagram describes the start / end markers as part of its summary.
- No keyboard interaction; the terminal is presentational.
- Label colour uses the muted text token by default — verify contrast against your canvas background if you customise either side.
- For internationalised copy, pass `label` directly; do not rely on the English default `"Start"` in localised contexts.
