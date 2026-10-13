# LifecycleZoomControl

The compact `−` / percent / `+` cluster that lives in the corner of a lifecycle canvas, with both buttons rendered inert if no handlers are passed — and, for an editing canvas, an opt-in typed percentage, a preset menu and a trailing slot.

`LifecycleZoomControl` is a horizontal pill containing two icon buttons flanking a numeric value. Handlers are optional: when `onZoomIn` / `onZoomOut` are omitted, the buttons render `disabled` so the component can sit in static demos and templates without bespoke wiring. Button size is exposed via the `buttonSize` prop as well as the underlying `--uxm-lifecycle-zoom-button-size` CSS variable. Sibling of `LifecycleConnector`, `LifecycleEdgeLabel`, `LifecycleNodeCard`, `LifecycleMinimap`, and `LifecycleTerminal`.

Every editing affordance is **opt-in behind a handler**, so a read-only canvas keeps the DOM and the look it had before they existed: pass `onValueChange` to make the percentage typable, `presets` (and optionally `onFit`) for the `▾` menu, `trailing` for a slot after a divider.

## Usage

```tsx
import { LifecycleZoomControl } from '@viax.io/uxm';
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

An editing canvas — typed value, presets, and the minimap toggle in the trailing slot:

```tsx
const clamp = (p: number) => Math.round(Math.min(200, Math.max(25, p)));

<LifecycleZoomControl
  value={zoom}
  onZoomIn={() => setZoom(clamp(zoom + 10))}
  onZoomOut={() => setZoom(clamp(zoom - 10))}
  onValueChange={(percent) => setZoom(clamp(percent))}
  presets={[25, 50, 75, 100, 125, 150, 200]}
  onFit={fitToScreen}
  trailing={
    <IconButton
      aria-label={minimapOpen ? 'Hide minimap' : 'Show minimap'}
      aria-pressed={minimapOpen}
      onClick={toggleMinimap}
    >
      <Icon glyph="dock-bottom" size={15} />
    </IconButton>
  }
/>
```

### The control owns no zoom range

`onValueChange` reports **what the user typed, unclamped**. Canvases disagree about their
limits — 40–150 in one, 25–200 in another — so a range baked into the library would be wrong
somewhere. Clamp in the handler and feed the result back through `value`.

The field is controlled by `value` and drops its draft the moment it commits, so a rejected
entry snaps back to the clamped number **even when your clamp leaves `value` unchanged** and
nothing re-renders from the prop. You do not need to force a re-render to correct the field.
Feed the result back synchronously, though: a host that debounces or animates zoom will show
the old number until its own update lands.

The entry is parsed, not filtered: `62.5` and `62,5` are both 62.5, `~150 %` is 150, a minus
survives for your clamp to reject rather than being flipped to a positive, and fullwidth
digits (`１２５`, what a Japanese IME produces) are normalised first. Rounding is yours — the
control has no range to round to. Re-entering the number already shown is not a change and
reports nothing.

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
| `onValueChange` | `(percent: number) => void` | – | Makes the percentage a typed field. Called on commit (Enter or blur) with the **unclamped** number entered. Omit and the value stays a read-only span. |
| `presets` | `readonly number[]` | – | Preset percentages behind a `▾`. Omit (or pass none) and no trigger renders. Choosing one calls `onValueChange` — and **without `onValueChange` the rows are not rendered at all**, since picking one would have nothing to call. |
| `onFit` | `() => void` | – | Adds a "Fit to screen" row at the foot of the preset menu, separated from the presets. With no `presets`, the menu is that row alone. |
| `trailing` | `ReactNode` | – | Content after a divider — a minimap toggle, usually. Nothing renders (divider included) when it would render nothing, so `trailing={open && <X/>}` is safe. |
| `valueLabel` | `string` | `'Zoom percentage'` | Accessible name for the editable field. |
| `presetsLabel` | `string` | `'Zoom presets'` | Accessible name for the `▾` trigger. |
| `fitLabel` | `string` | `'Fit to screen'` | Label of the fit row. |
| `formatPreset` | `(percent: number) => string` | `` p => `${p}%` `` | Renders one preset's label. A callback, not a suffix the control appends: the space before `%` and the word order around a number are language-specific, and you may want `Intl.NumberFormat`. |

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
| `--uxm-lifecycle-zoom-divider-height` | – | `18px` | Height of the hairline before the `trailing` slot. |
| `--uxm-lifecycle-zoom-focus-ring` | `--color-accent` | – | Ring drawn on the value cell while the field has keyboard focus. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Root background. |
| `--color-border` | Borders / Border | Root border + value cell dividers. |
| `--color-text` | Text / Text | Value number colour. |
| `--color-text-muted` | Text / Text Muted | Button glyph colour, `%` unit colour. |
| `--color-surface-alt` | Surfaces / Surface Alt | Button hover background. |
| `--color-accent` | Accent / Accent | Focus ring on the editable value cell. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Card-backgrounded pill, muted glyphs, text-coloured value. |
| Button hover | `:hover` on enabled button | Surface-alt background fill. |
| Button disabled | Handler not provided | Native `disabled`, `opacity: 0.6`, default cursor. |
| Custom button size | `buttonSize` prop | Inline `--uxm-lifecycle-zoom-button-size` override; value cell height tracks it. |
| Editable value | `onValueChange` given | The number becomes an `<input>` with tabular figures; the `%` stays beside it, never inside the editable text. |
| Field focused | `:focus-visible` on the field | Accent ring drawn on the whole value cell. The field fills that cell, so clicking anywhere in the segment — the `%` included — puts the caret in it. |
| Preset menu | `presets` and/or `onFit` given | `▾` button between the value and `+`; the preset matching `value` is marked `aria-current`. |
| Trailing slot | `trailing` renders something | Hairline divider, then the slot content. |

## Accessibility

- Both buttons render as native `<button type="button">` elements with explicit `aria-label="Zoom in"` / `"Zoom out"` — keyboard activation (Space / Enter) and screen-reader announcements come for free.
- Disabled state uses the native `disabled` attribute, removing the button from the tab order and announcing "dimmed" / "unavailable" to assistive tech.
- The value display is a plain `<div>` containing two `<span>`s (number + `%` unit); it is not a live region. If you need screen-reader announcements when zoom changes, wrap the value or expose it via `aria-live` at the consumer level.
- Focus styling falls back to the browser default — pair with a global focus-ring rule in the consumer app for visible focus indication on light backgrounds. The editable field is the exception: it draws its own ring on the value cell.
- The editable field is a real `<input>` named by `valueLabel`. Enter commits and re-selects, Escape reverts **in place** (focus stays put), blur commits, and focusing selects the text so typing replaces the number rather than appending to it.
- Escape is stopped only while an edit is in flight. `useDismiss` listens for Escape on the document, so an un-stopped one would cancel the edit *and* close the dialog or popover the canvas sits in; with nothing to cancel it passes through, so a user is never trapped.
- Enter and Escape are left to the IME while a composition is in progress — they confirm and cancel the candidate, and claiming them would commit a half-composed entry.
- The `▾` trigger is a native `<button>`; the menu is the shipped `Menu`, so roles, arrow-key navigation and dismissal come from it. The preset matching `value` carries `aria-current="true"` — the active zoom is conveyed to assistive tech, not only by the checkmark.
- `trailing` is yours to make accessible. A toggle belongs there as a button with `aria-pressed`, not a `div`.
