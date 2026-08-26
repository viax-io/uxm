# StatCard

A bordered card that pairs a label with a large numeric value and an optional trend indicator (up / down / neutral).

`StatCard` renders a single `<div className="uxm-stat-card">` containing a `<p>` label, a row holding the headline `<span>` value, and an optional `<span>` trend chip. The trend chip auto-renders an `Icon` (`arrow-up`, flipped 180° for `down`) when `trendDirection` is non-neutral. All other native div attributes flow through.

## Usage

```tsx
import { StatCard } from '@viax/uxm';

function Example() {
  return (
    <StatCard
      label="Monthly recurring revenue"
      value="$48,210"
      trend="+12.4% MoM"
      trendDirection="up"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | – | **Required.** Small caption above the value. |
| `value` | `ReactNode` | – | **Required.** Headline figure rendered at large weight. |
| `trend` | `ReactNode` | – | Optional trailing chip. Omitting it suppresses the chip entirely. |
| `trendDirection` | `'up' \| 'down' \| 'neutral'` | `'neutral'` | Chooses the chip palette and arrow direction. `neutral` hides the arrow icon. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

The `StatCardTrend` union (`'up' \| 'down' \| 'neutral'`) is exported for consumer-side helpers.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-stat-card-label-size` | – | `13px` | Label font size. |
| `--uxm-stat-card-value-size` | – | `28px` | Value font size. |
| `--uxm-stat-card-value-font` | `--brand-heading-font` | `inherit` | Value typeface. Unset brand = inherits the body face. |
| `--uxm-stat-card-value-weight` | `--brand-heading-weight` | `700` | Value weight. |
| `--uxm-stat-card-trend-up-color` | `--color-success-text` | – | `up` trend chip text/icon colour. |
| `--uxm-stat-card-trend-down-color` | `--color-danger-text` | – | `down` trend chip text/icon colour. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Card background. |
| `--color-border` | Borders / Border | Card border. |
| `--color-text` | Text / Text | Value text. |
| `--color-text-muted` | Text / Text Muted | Label text, `neutral` trend text. |
| `--color-success-text` | Semantic / Success Text | `up` trend fallback. |
| `--color-danger-text` | Semantic / Danger Text | `down` trend fallback. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Trend: `up` | `trendDirection="up"` | Green text + up arrow. |
| Trend: `down` | `trendDirection="down"` | Red text + arrow rotated 180°. |
| Trend: `neutral` | `trendDirection="neutral"` (default) | Muted text, no arrow icon. |
| No trend | `trend` omitted | Trend `<span>` is not rendered. |

## Accessibility

- Renders semantic `<p>` and `<span>` text — screen readers read the label, then the value, then the trend in DOM order.
- The trend arrow `Icon` is decorative; pair the trend string with a textual direction (e.g. `"+12.4%"`, `"−3.1%"`) so it remains comprehensible without the glyph.
- The root is a non-interactive `<div>`; if you make a card clickable, wrap the whole component in an `<a>`/`<button>` and supply an accessible label.
- Colour-only trend distinction (green vs red) does not pass contrast-only conveyance; the arrow icon and `+`/`−` prefix in `trend` carry the meaning for colour-blind users.
