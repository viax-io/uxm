# Loader

A single loading indicator with three visual variants (`spinner`, `dots`, `bar`), two layouts (`stacked`, `inline`), and an optional `|`-separated message that cycles on a fixed interval.

`Loader` renders one of three CSS-animated indicators inside a shared root and an optional adjacent message. Messages are passed as a single string and split on `|`; with two or more entries the component cycles between them on `messageInterval` and applies a fade-in/out animation per swap. Whenever the `message` prop changes mid-rotation, the index resets to 0 in render via the "store info from previous renders" pattern — no extra render after the swap. All three variants share `--uxm-loader-color` / `--uxm-loader-track-color` / `--uxm-loader-size` so a single theme rule re-tints and resizes the indicator regardless of the chosen variant. Note: animation `speed` is not currently wired (the save-layer's `formatValue` would mis-emit unitless numbers as `Xpx`).

## Usage

```tsx
import { Loader } from '@viax/uxm';

function PageLoader() {
  return (
    <Loader
      variant="dots"
      layout="inline"
      message="Fetching data...|Almost there...|Just a sec..."
      messageInterval={1500}
    />
  );
}
```

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute (id, style, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'spinner' \| 'dots' \| 'bar'` | `'spinner'` | Which indicator to render. |
| `layout` | `'stacked' \| 'inline'` | `'stacked'` | Indicator and message stacked vertically (column) or aligned horizontally (row). |
| `message` | `string` | `''` | Single message, or `\|`-separated to cycle. Empty parts after `.trim()` are dropped. |
| `messageInterval` | `number` | `1500` | Cycle interval in milliseconds (only takes effect with two or more messages). |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |
| `loadingLabel` | `string` | `'Loading'` | Accessible name for the `role="status"` element when no `message` is showing. |

```ts
type LoaderVariant = 'spinner' | 'dots' | 'bar';
type LoaderLayout = 'stacked' | 'inline';
```

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-loader-gap` | – | `12px` | Gap between indicator and message. |
| `--uxm-loader-color` | `--color-accent-bold` | – | Spinner top border, dot fill, bar fill. |
| `--uxm-loader-track-color` | `--color-accent-bold` (18% mix) | – | Spinner ring base, bar track. |
| `--uxm-loader-size` | – | `24px` | Spinner diameter; dot diameter (size / 3) and bar derivations. |
| `--uxm-loader-bar-width` | – | `200px` | Bar total width. |
| `--uxm-loader-message-color` | `--color-text-muted` | – | Message text colour. |
| `--uxm-loader-message-size` | – | `13px` | Message font size. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-accent-bold` | Accent / Accent Bold | Indicator foreground + track (mixed). |
| `--color-text-muted` | Text / Text Muted | Message text colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Variant: `spinner` | `variant="spinner"` (default) | Rotating arc — 3px ring with one coloured top border, 800ms linear infinite rotation. |
| Variant: `dots` | `variant="dots"` | Three pulsing dots (diameter = `--uxm-loader-size / 3`) with staggered 1280ms ease-in-out animation. |
| Variant: `bar` | `variant="bar"` | Indeterminate progress bar — 40%-wide pill sliding across a track, 1600ms cubic-bezier loop. |
| Layout: `stacked` | `layout="stacked"` (default) | Indicator above message (`flex-direction: column`). |
| Layout: `inline` | `layout="inline"` | Indicator next to message (`flex-direction: row`). |
| Single message | `message` without `\|` | Static text alongside indicator. |
| Cycling messages | `message` contains `\|` | Each message renders inside a fade-in/out wrapper keyed by index; advances every `messageInterval` ms. |
| Message swap mid-rotation | `message` prop changes | Index resets to `0` in render so the next message shown is the first item of the new list. |

## Accessibility

- The indicator wrapper carries `role="status"` and an `aria-label` that uses the current message (or `'Loading'` when empty). Screen readers announce status changes politely.
- Because the same indicator label updates as messages cycle, assistive tech will announce changes; if that's too chatty, pass a fixed status via the spread props (e.g. `aria-label="Loading"`) and treat the visual message as decorative.
- Animations are decorative — they do not honour `prefers-reduced-motion`. Consumers running in reduced-motion environments should either swap to a static placeholder or add a global `@media (prefers-reduced-motion: reduce)` rule disabling the keyframes.
- Colour-only conveyance: the bar and dots rely on accent colour over a tinted track. Verify contrast in custom themes; bump `--uxm-loader-track-color` for stronger separation on dark backgrounds.
- Message text uses the muted token by default — check contrast against your container background, particularly for inline layouts on coloured surfaces.
