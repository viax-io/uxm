# Slider

A themable single-thumb range control. Wraps a native `<input type="range">` so accessibility and keyboard interaction (Arrow keys, Home/End, PageUp/PageDown) come for free.

The track is painted via a CSS `linear-gradient` driven by `--uxm-slider-progress` — a percentage the atom computes inline from `value / min / max` and injects on render. This gives a cross-browser "value-so-far" tint: Webkit doesn't render a native filled portion, and `accent-color` only handles it in Firefox. The control is intentionally bare — no label — so consumers compose it with `<FormField>` (or a custom label-with-current-value layout, as the MODO editor's `SliderInput` knob does).

## Usage

```tsx
import { Slider, FormField } from '@viax/uxm';
import { useState } from 'react';

function VolumeControl() {
  const [volume, setVolume] = useState(40);
  return (
    <FormField label="Volume">
      <Slider value={volume} onChange={setVolume} min={0} max={100} step={5} />
    </FormField>
  );
}
```

## Props

Extends `Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value'>` — `type` is forced to `range`, and `onChange` / `value` are re-typed. Other native input attributes (id, name, disabled, aria-*) are forwarded.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | – | **Required.** Current value. |
| `onChange` | `(value: number) => void` | – | **Required.** Fires with the next numeric value (coerced from the input's string value). |
| `min` | `number` | `0` | Range minimum. |
| `max` | `number` | `100` | Range maximum. |
| `step` | `number` | `1` | Increment step. |
| `disabled` | `boolean` | – | Native disabled; no bundled visual dim — define `--uxm-slider-disabled-opacity` (or wrap in a parent rule) if a dimmed look is required. |
| `className` | `string` | – | Merged with `uxm-slider` via `cn`. |
| `style` | `CSSProperties` | – | Inline style; merged with the computed `--uxm-slider-progress`. |
| _(any input attribute)_ | – | – | Spread onto the native `<input>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-slider-progress` | – | `0%` (computed inline) | Gradient stop between filled and unfilled portions. |
| `--uxm-slider-accent-color` | `--color-accent` | – | Filled portion of the track + `accent-color` for the focus ring. |
| `--uxm-slider-track-color` | `--color-border` | – | Unfilled portion of the track. |
| `--uxm-slider-track-radius` | – | `999px` | Track corner radius. |
| `--uxm-slider-track-height` | – | `6px` | Track height. |
| `--uxm-slider-thumb-color` | `--color-accent` | – | Thumb fill. |
| `--uxm-slider-thumb-size` | – | `14px` | Thumb diameter. |

The `--uxm-slider-progress` variable is written by the component itself — overriding externally has no lasting effect since it's recomputed every render.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-accent` | Accent / Accent | Filled track + thumb (fallback). |
| `--color-border` | Borders / Border | Unfilled track (fallback). |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Idle | – | Gradient track with filled portion to `progress` percentage; circular thumb at the same position. |
| Focus | `:focus` | Native outline suppressed; `accent-color` styles non-Webkit focus affordances. |
| Disabled | `disabled` attr | Native disabled behaviour; no bundled visual dim. |
| Drag | mouse / touch on thumb | Browser-native drag interaction; `onChange` fires continuously. |
| Keyboard step | Arrow keys, Home/End, PageUp/Down on focused input | Browser-native increment (`step`, `step × 10` for Page keys). |

## Accessibility

- Renders a native `<input type="range">` — full keyboard interaction (Arrow keys, Home, End, PageUp, PageDown), screen-reader value announcement, and `aria-valuenow` / `aria-valuemin` / `aria-valuemax` are all provided by the browser.
- The component is unlabelled by itself — wrap in `<FormField>` or provide an `aria-label` / `aria-labelledby` via the spread `...rest` so screen-reader users hear what the slider controls.
- `outline: none` is set on `:focus` — focus visibility relies on `accent-color` (Firefox) and the thumb's `box-shadow` (Webkit). For stricter WCAG 2.4.7 focus-visible coverage, layer a `:focus-visible` outline at the consumer level.
- `disabled` uses the native attribute — the input is removed from the tab order and announced as unavailable. No bundled dim style is applied; set `--uxm-slider-disabled-opacity` or a parent rule if desired.
- The custom-painted track via `linear-gradient` is purely visual — the native input handles the semantic value and announcement.
