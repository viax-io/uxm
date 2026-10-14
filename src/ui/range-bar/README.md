# RangeBar

A read-only interval on a shared track — one segment at an arbitrary offset, optionally open-ended.

`RangeBar` fills the gap between the two range-ish atoms the library already ships. `ProgressBar` is a left-anchored determinate fill: every bar starts at 0, so it cannot begin at an offset. `RangeSlider` and `Slider` are interactive **inputs** — `role="slider"`, draggable thumbs, keyboard handling — so repurposing one as a static chart ships a fake-disabled thumb and announces a control the user cannot operate. `RangeBar` is neither: it is a graphic.

It is built for **ladders** — several bars sharing one `[min, max]` domain, the way a determination model draws the numeric range each entry matches. The atom owns the track, the offset maths and the open-ended fade; the labels beside it, the axis ticks under it and whatever the intervals *mean* stay with the consumer. Sibling of `ProgressBar`.

## Usage

```tsx
import { RangeBar } from '@viax.io/uxm';

function RangeLadder({ rows, max }: { rows: Row[]; max: number }) {
  return (
    <>
      {rows.map((row) => (
        <RangeBar
          key={row.id}
          value={row.span}
          max={max}
          openEnd={!Number.isFinite(row.span[1])}
          type={row.clashes ? 'danger' : 'accent'}
          title={`${row.span[0]} – ${Number.isFinite(row.span[1]) ? row.span[1] : '∞'}`}
        />
      ))}
    </>
  );
}
```

### The words are yours

The atom renders **no text at all** and never composes a label like `500 – ∞`. How an interval reads — the dash, the infinity sign, whether the unit leads or trails — is the app's copy, not the library's. Pass `title` for a tooltip, `aria-label` for an accessible name, or both; they go through `...rest` untouched.

### It owns no domain either

`value` is clamped into `[min, max]`, and the atom is deliberately forgiving about what it is handed, because a ladder computes its domain from live data:

| Given | Result |
|---|---|
| a value outside the domain | clamped at **both** ends (a clamp on the top alone is how a negative offset gets through) |
| an inverted `[80, 20]` | normalised to `[20, 80]`, not a negative width |
| a degenerate domain (`min === max`) | fills the track, rather than dividing by zero and resolving to `NaN%` — which paints nothing and reports no error |
| a point interval `[50, 50]` | a zero-width fill, floored by `--uxm-range-bar-min-width` so it stays visible |

## Props

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'color'>` — any standard div attribute (id, style, title, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `[number, number]` | – | **Required.** The interval, in domain units. Clamped and normalised (see above). |
| `min` | `number` | `0` | Low end of the track's domain. |
| `max` | `number` | `100` | High end of the track's domain. |
| `openStart` | `boolean` | `false` | Fade the fill out at the low edge — an interval with no lower bound ("under 120"). |
| `openEnd` | `boolean` | `false` | Fade the fill out at the high edge — an interval with no upper bound ("500 – ∞"). |
| `type` | `'accent' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | `'accent'` | Semantic colour of the fill. Same vocabulary as `Tag` and `Badge`. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute except `color`)_ | – | – | Spread onto the root `<div>`. |

```ts
type RangeBarType = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
```

## CSS variables

The root **is** the track — there is no label row above it to lay out — and every themeable property reads a `--uxm-range-bar-*` variable, so editor saves route through the kebab-fallback path with no `PER_COMPONENT_MAPPING` entry. `--uxm-range-bar-start` / `-end` are unitless and set inline from `value`, so the runtime position always wins over a saved rule.

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-range-bar-height` | – | `14px` | Track height. |
| `--uxm-range-bar-radius` | – | `999px` | Track (and fill) radius. |
| `--uxm-range-bar-track-color` | `color-mix(--color-text 8%)` | – | The unfilled track. |
| `--uxm-range-bar-fill-color` | the `type`'s token | – | Overrides whichever token `type` selected. |
| `--uxm-range-bar-min-width` | – | `4px` | Floor for the fill, so a point interval stays visible. |
| `--uxm-range-bar-start` | – | set inline | Left edge, unitless percent. Not a theming knob. |
| `--uxm-range-bar-end` | – | set inline | Right edge, unitless percent. Not a theming knob. |

The fill is absolutely positioned on purpose: an in-flow percentage width collapses to 0 inside a `flex: 1` row item — where the item's width is definite for layout but indefinite for percentage descendants — and a row item is exactly where a ladder puts this. `ProgressBar`'s fill is absolute for the same reason.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text` | Text / Text | Mixed at 8% for the track. |
| `--color-accent-bold` | Accent / Accent Bold | `type="accent"` fill (the default). |
| `--color-success-text` | Semantic / Success Text | `type="success"` fill. |
| `--color-warning-text` | Semantic / Warning Text | `type="warning"` fill. |
| `--color-danger-text` | Semantic / Danger Text | `type="danger"` fill. |
| `--color-info-text` | Semantic / Info Text | `type="info"` fill. |
| `--color-text-muted` | Text / Text Muted | `type="neutral"` fill. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Solid fill in the accent token, positioned by `value`. |
| Type | `type` prop | Fill switches token; the track is unchanged. |
| Open end | `openEnd` | The fill fades toward transparent at its right edge, so `500 – ∞` does not read as `500 – 640`. |
| Open start | `openStart` | The same, mirrored to the left edge. |
| Open both | both props | Solid in the middle, fading either way. |
| Point interval | `value={[n, n]}` | A `min-width`-floored fill rather than an invisible 0px. |

The fades use a `color-mix` of the fill at 15% rather than the `transparent` keyword: in some engines `transparent` interpolates through transparent *black*, which greys the ramp on its way out.

There is no transition. `ProgressBar` animates its width because progress moves; a range ladder is static data, and animating offsets on first paint would be noise — so there is nothing here to gate behind `prefers-reduced-motion`.

## Accessibility

- **The bar takes `role="img"` only when you name it.** Pass `aria-label` or `aria-labelledby` and the root claims the role, which is what makes the name announced. With no name it stays a plain, decorative `<div>` and the row around it carries the meaning.
- This is not a stylistic choice: a name on a role-less (generic) element is prohibited by ARIA and dropped by most screen readers, so an atom that quietly relied on `aria-label` alone would ship a label nobody hears. A nameless `role="img"` is the opposite failure — it announces an image and then has nothing to say about it.
- A `role` you pass yourself is never overwritten. `role="presentation"` on a decorative bar inside an already-labelled row is a reasonable thing to want.
- **Every `type` clears SC 1.4.11's 3:1 against the track.** The fill is not decoration here — it *is* the content — so the accent default is `--color-accent-bold` (5.08:1 on the light track) rather than `--color-accent`, which measures 1.76:1 and would leave the bar barely distinguishable from the track it sits in. The five semantic types are text tokens and clear it comfortably (4.6–7.5:1). If you override `--uxm-range-bar-fill-color`, check it the same way.
- The bar conveys its interval through position and length alone, so **do not let colour be the only carrier of meaning**. If `type="danger"` marks a clashing entry, say so in the row's text too — the `type` prop changes a hue and nothing else.
