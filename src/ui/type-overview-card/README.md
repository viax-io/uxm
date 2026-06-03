# TypeOverviewCard

A clickable summary tile pairing a label, a large numeric value, an optional left-edge accent stripe, an icon tile, and a "View all"-style trailing affordance revealed on hover.

`TypeOverviewCard` renders a `<div className="uxm-type-overview-card">` with absolute-positioned accent stripe (`__accent`), an optional `IconTile` wrapping the supplied `icon`, a `<p>` label, a `<p>` value, and a `__trailing` element that defaults to `"View all"` + arrow icon. Icon-tile theming bridges through TypeOverviewCard's own `--uxm-typeoverview-icon-*` variables so a single set of editor knobs reaches both the card frame and the nested tile. The `iconBg` / `iconColor` / `accent` props are sugar that emit inline `--uxm-typeoverview-*` overrides on the root element.

## Usage

```tsx
import { TypeOverviewCard } from '@viax/uxm';
import { Icon } from '@viax/uxm';

function Example() {
  return (
    <TypeOverviewCard
      label="Revenue Motions"
      value={42}
      icon={<Icon glyph="trending-up" />}
      onClick={() => navigate('/motions')}
    />
  );
}
```

## Props

Extends `HTMLAttributes<HTMLDivElement>` — all native div attributes (including `onClick`) are forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | – | **Required.** Caption above the value (e.g. `"Revenue Motions"`). |
| `value` | `ReactNode` | – | **Required.** Headline figure, typically a count. |
| `icon` | `ReactNode` | – | Icon node rendered inside an `IconTile`. Typical: `<Icon glyph="..." />`. |
| `iconBg` | `string` | – | Sugar override for `--uxm-typeoverview-icon-bg` (icon tile background). |
| `iconColor` | `string` | – | Sugar override for `--uxm-typeoverview-icon-color` (icon foreground). |
| `accent` | `string` | – | Sugar override for `--uxm-typeoverview-accent-color` (left-edge stripe). |
| `trailing` | `ReactNode` | `"View all" + arrow-right Icon` | Hover-revealed bottom affordance. Pass `null` to suppress entirely. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| `style` | `CSSProperties` | – | Inline style on the root. Sugar overrides are merged into this object before render. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

### Frame

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-typeoverview-bg` | `--color-card` | – | Card background. |
| `--uxm-typeoverview-border-color` | `--color-border` | – | Card border. |
| `--uxm-typeoverview-radius` | – | `4px` | Card corner radius. |
| `--uxm-typeoverview-padding` | – | `20px` | Card padding. |

### Accent stripe

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-typeoverview-accent-color` | `--color-accent` | – | Left-edge stripe colour. |
| `--uxm-typeoverview-accent-width` | – | `4px` | Stripe width at rest. Hover adds 2px. |

### Icon tile (bridged to IconTile internals)

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-typeoverview-icon-bg` | `--color-accent-subtle` | – | Icon tile background. |
| `--uxm-typeoverview-icon-color` | `--color-accent-bold` | – | Icon foreground. |
| `--uxm-typeoverview-icon-tile-size` | – | `32px` | Icon tile dimensions. |
| `--uxm-typeoverview-icon-tile-radius` | – | `8px` | Icon tile radius. |

### Label & value

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-typeoverview-label-color` | `--color-text-strong` | – | Label text colour. |
| `--uxm-typeoverview-label-size` | – | `14px` | Label font size. |
| `--uxm-typeoverview-value-color` | `--color-text` | – | Value text colour. |
| `--uxm-typeoverview-value-size` | – | `30px` | Value font size. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Card background. |
| `--color-border` | Borders / Border | Card border. |
| `--color-accent` | Accent / Accent | Accent stripe; hover border colour-mixed at 30%. |
| `--color-accent-subtle` | Accent / Accent Subtle | Icon tile background. |
| `--color-accent-bold` | Accent / Accent Bold | Icon foreground; trailing label colour. |
| `--color-text` | Text / Text | Value text. |
| `--color-text-strong` | Text / Text Strong | Label text. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Card with stripe at rest width; trailing affordance at `opacity: 0`. |
| Hover | `:hover` | Border tints toward accent (`color-mix` 30%); `--shadow-xs` lifts the card; stripe grows by 2px; trailing fades in to `opacity: 1` (0.15s). |
| No icon | `icon` omitted | `IconTile` not rendered. |
| No trailing | `trailing={null}` | Trailing affordance suppressed. |
| Custom accent | `accent` prop set | Inline `--uxm-typeoverview-accent-color` set on root. |

## Accessibility

- The root is a non-interactive `<div>` painted with `cursor: pointer`. **Clicks on a div alone are not keyboard-accessible.** If the card represents a navigation target, wrap the entire card in an `<a>` (preferred) or attach `role="button"` + `tabIndex={0}` + `onKeyDown` handlers, and supply an accessible label.
- The trailing affordance is `opacity: 0` at rest — it is rendered in the DOM and reachable by screen readers. If you want it hidden from assistive tech, gate it on hover at the DOM level instead.
- The `arrow-right` icon inside the default trailing is decorative; the textual "View all" label carries the meaning.
- The accent stripe is `aria-hidden="true"` and decorative.
- Hover-revealed UI is unsuitable for touch — consumers on touch surfaces should consider either always-visible trailing or an alternative affordance.
