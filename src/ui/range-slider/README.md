# RangeSlider

A dual-thumb range control that selects a sub-range `[start, end]` within `[min, max]`. Built from two overlapped `<input type="range">` elements stacked on a shared CSS-gradient track that paints the filled portion between the thumbs.

`RangeSlider` is a controlled component — the consumer owns the `[start, end]` tuple. The atom clamps on drag so `start` can never overtake `end` (and vice versa) without the tuple semantics silently swapping. It deliberately shares the `<Slider>` atom's theming surface (`--uxm-slider-*`) so a single set of MODO editor knobs themes both modes uniformly, and adds two range-specific gradient stops (`--uxm-range-slider-start` / `-end`) that the atom computes inline from the current value.

## Usage

```tsx
import { RangeSlider } from '@viax/uxm';
import { useState } from 'react';

function PriceFilter() {
  const [range, setRange] = useState<[number, number]>([20, 80]);
  return (
    <RangeSlider
      value={range}
      onChange={setRange}
      min={0}
      max={100}
      step={5}
      showStart
      showEnd
      showRange
      unit="$"
      aria-label="Price range"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `[number, number]` | – | **Required.** `[start, end]` tuple; `start ≤ end` always (atom clamps on drag). |
| `onChange` | `(value: [number, number]) => void` | – | **Required.** Fires with the next tuple on either thumb's drag/keyboard change. |
| `min` | `number` | `0` | Range minimum. |
| `max` | `number` | `100` | Range maximum. |
| `step` | `number` | `1` | Increment step for both thumbs. |
| `disabled` | `boolean` | `false` | Disables both inputs. No bundled dim style — consumer-managed via the shared `--uxm-slider-disabled-opacity` knob if defined. |
| `showStart` | `boolean` | `false` | Renders the start value above the slider, left-aligned. |
| `showEnd` | `boolean` | `false` | Renders the end value above the slider, right-aligned. |
| `showRange` | `boolean` | `false` | Renders the delta (`end - start`) above the slider, centred. |
| `unit` | `string` | – | Suffix appended to displayed values (e.g. `"px"`, `"$"`). |
| `className` | `string` | – | Merged with `uxm-range-slider` via `cn`. |
| `style` | `CSSProperties` | – | Inline style; merged with the computed gradient-stop vars. |
| `aria-label` | `string` | – | Base label; each input adds `" (start)"` / `" (end)"` suffix automatically. |

## CSS variables

`RangeSlider` shares the `Slider` atom's `--uxm-slider-*` vars (track colour/height/radius, accent, thumb size/colour, value label colour/size) and adds two range-only inline-computed stops.

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-range-slider-start` | – | `0%` (computed inline) | Gradient stop where the filled portion begins. |
| `--uxm-range-slider-end` | – | `100%` (computed inline) | Gradient stop where the filled portion ends. |
| `--uxm-slider-track-color` | `--color-border` | – | Unfilled track (before start, after end). |
| `--uxm-slider-accent-color` | `--color-accent` | – | Filled track between start and end. |
| `--uxm-slider-track-radius` | – | `999px` | Track corner radius. |
| `--uxm-slider-track-height` | – | `6px` | Track height. |
| `--uxm-slider-thumb-color` | `--color-accent` | – | Both thumb fills. |
| `--uxm-slider-thumb-size` | – | `14px` | Both thumb diameters. |
| `--uxm-slider-value-color` | `--color-text-muted` | – | Value label text colour. |
| `--uxm-slider-value-size` | – | `11px` | Value label font size. |

The `--uxm-range-slider-start` / `-end` vars are written by the component itself from `value / min / max` — overriding them externally has no lasting effect.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-border` | Borders / Border | Unfilled track segments. |
| `--color-accent` | Accent / Accent | Filled track + thumbs. |
| `--color-text-muted` | Text / Text Muted | Start/end/range value labels. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Idle | – | Track shows the gradient with filled portion between thumb positions. |
| Drag start past end | Attempting to drag start thumb past end | Atom clamps `start = Math.min(next, end)` — no swap. |
| Drag end past start | Attempting to drag end thumb past start | Atom clamps `end = Math.max(next, start)` — no swap. |
| Values shown | `showStart` / `showEnd` / `showRange` flags | Value strip renders above the track with the requested cell(s) populated. |
| Disabled | `disabled` prop | Both native inputs disabled; no bundled visual dim (consumer adds via `--uxm-slider-disabled-opacity` or a wrapper style). |

## Accessibility

- Each thumb is a real `<input type="range">` — keyboard interaction (Arrow keys, Home/End, PageUp/PageDown) and screen-reader value announcements come from the native primitive.
- The inputs receive distinct `aria-label`s (`" (start)"` / `" (end)"` suffixes) so assistive tech can disambiguate the two thumbs; supply a base `aria-label` to give them meaningful context.
- `pointer-events: none` on the input root + `pointer-events: auto` on the thumb pseudo-elements ensures the second-stacked input doesn't block clicks on the first thumb. Touch users can grab whichever thumb is closer to their finger.
- No native focus ring is rendered (the input's outline is suppressed) — only the thumb's `box-shadow` indicates position. For stricter WCAG 2.1 focus-visible compliance, add a focus-state shadow at the consumer level.
- Disabled state uses the native `disabled` attribute on both inputs — they're removed from the tab order and announced as unavailable.
- The value labels are decorative duplicates of the input values; screen readers will already announce the native values when each thumb is focused, so the labels are not announced as separate live regions.
