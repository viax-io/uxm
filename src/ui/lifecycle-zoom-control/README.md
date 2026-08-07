# LifecycleZoomControl

The compact `−` / percent / `+` cluster that lives in the corner of a lifecycle canvas, with both buttons rendered inert if no handlers are passed.

`LifecycleZoomControl` is a horizontal pill containing two icon buttons flanking a numeric value. Handlers are optional: when `onZoomIn` / `onZoomOut` are omitted, the buttons render `disabled` so the component can sit in static demos and templates without bespoke wiring. Button size is exposed via the `buttonSize` prop as well as the underlying `--uxm-lifecycle-zoom-button-size` CSS variable. Sibling of `LifecycleConnector`, `LifecycleEdgeLabel`, `LifecycleNodeCard`, `LifecycleMinimap`, and `LifecycleTerminal`.

## Usage

```tsx
import { LifecycleZoomControl } from '@viax/uxm';
import { useState } from 'react';

function CanvasZoom() {
  const [zoom, setZoom] = useState(100);
  return (
    <LifecycleZoomControl
      value={zoom}
      onZoomIn={() => setZoom((z) => Math.min(z + 10, 200))}
      onZoomOut={() => setZoom((z) => Math.max(z - 10, 25))}
    />
  );
}
```

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute (id, style, data-*, aria-*) is forwarded to the root. The `buttonSize` prop sets the `--uxm-lifecycle-zoom-button-size` CSS var inline.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `100` | Zoom percentage shown between the buttons. |
| `onZoomIn` | `() => void` | – | Click handler for the `+` button. Button is disabled if omitted. |
| `onZoomOut` | `() => void` | – | Click handler for the `−` button. Button is disabled if omitted. |
| `buttonSize` | `number` | – | Override button height/width in px (sets `--uxm-lifecycle-zoom-button-size`). |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |
| `zoomOutLabel` | `string` | `'Zoom out'` | Accessible name for the − button. |
| `zoomInLabel` | `string` | `'Zoom in'` | Accessible name for the + button. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-lifecycle-zoom-bg` | `--color-card` | – | Root background. |
| `--uxm-lifecycle-zoom-border-color` | `--color-border` | – | Root border and inner dividers around the value. |
| `--uxm-lifecycle-zoom-radius` | – | `6px` | Root border radius. |
| `--uxm-lifecycle-zoom-color` | `--color-text` | – | Value number colour (inherited by the value cell). |
| `--uxm-lifecycle-zoom-icon-color` | `--color-text-muted` | – | Button glyph colour. |
| `--uxm-lifecycle-zoom-font-size` | – | `13px` | Value font size. |
| `--uxm-lifecycle-zoom-button-size` | – | `32px` | Square size of each button and height of the value cell. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Root background. |
| `--color-border` | Borders / Border | Root border + value cell dividers. |
| `--color-text` | Text / Text | Value number colour. |
| `--color-text-muted` | Text / Text Muted | Button glyph colour, `%` unit colour. |
| `--color-surface-alt` | Surfaces / Surface Alt | Button hover background. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Card-backgrounded pill, muted glyphs, text-coloured value. |
| Button hover | `:hover` on enabled button | Surface-alt background fill. |
| Button disabled | Handler not provided | Native `disabled`, `opacity: 0.6`, default cursor. |
| Custom button size | `buttonSize` prop | Inline `--uxm-lifecycle-zoom-button-size` override; value cell height tracks it. |

## Accessibility

- Both buttons render as native `<button type="button">` elements with explicit `aria-label="Zoom in"` / `"Zoom out"` — keyboard activation (Space / Enter) and screen-reader announcements come for free.
- Disabled state uses the native `disabled` attribute, removing the button from the tab order and announcing "dimmed" / "unavailable" to assistive tech.
- The value display is a plain `<div>` containing two `<span>`s (number + `%` unit); it is not a live region. If you need screen-reader announcements when zoom changes, wrap the value or expose it via `aria-live` at the consumer level.
- Focus styling falls back to the browser default — pair with a global focus-ring rule in the consumer app for visible focus indication on light backgrounds.
