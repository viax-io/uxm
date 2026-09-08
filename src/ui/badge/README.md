# Badge

A compact notification indicator with two render modes — a numeric pill (`count`) or a small coloured dot — and six tonal variants that align with the semantic / accent palette.

`Badge` is a single `<span>` whose role changes by mode. In `count` mode the root itself **is** the pill (background, padding, radius all land on it). In `dot` mode the root is a flex row: a `__dot` inner span paints the circle, and an optional `__label` reads its own typography vars when children are passed. Tones (`accent`, `success`, `warning`, `danger`, `info`, `neutral`) all route through `--uxm-badge-{tone}-*` custom properties with token fallbacks, so MODO can theme every combination without per-component mapping.

## Usage

```tsx
import { Badge } from '@viax.io/uxm';

function Example() {
  return (
    <>
      <Badge mode="count" type="danger" count={3} />
      <Badge mode="count" type="neutral" count={120} max={99} />
      <Badge mode="dot" type="success">Online</Badge>
    </>
  );
}
```

## Props

Extends `HTMLAttributes<HTMLSpanElement>` — any standard attribute (id, style, data-*, aria-*) is forwarded to the root `<span>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'dot' \| 'count'` | `'count'` | Render mode. `count` is a numeric pill; `dot` is a coloured circle with optional label. |
| `type` | `'accent' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | `'danger'` | Tonal variant — drives bg / text in `count` mode and dot colour in `dot` mode. |
| `count` | `number` | – | Numeric value shown in `count` mode. Clamped to `${max}+` when it exceeds `max`. Ignored if `children` is provided. |
| `max` | `number` | `99` | Threshold above which `count` collapses to `${max}+`. |
| `children` | `ReactNode` | – | In `count` mode, takes precedence over the rendered `count`. In `dot` mode, renders as the trailing label. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native span attribute)_ | – | – | Spread onto the root `<span>`. |

In `dot` mode the root receives `role="status"` only when no children are passed (the dot alone is the announcement); with a label, the label is the accessible name and no role is set.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-badge-count-border-radius` | – | `999px` | Pill radius (`count` mode). |
| `--uxm-badge-count-font-size` | – | `11px` | Pill font size. |
| `--uxm-badge-count-font-weight` | – | `600` | Pill font weight. |
| `--uxm-badge-count-min-width` | – | `18px` | Pill min-width + height. |
| `--uxm-badge-count-padding-y` | – | `1px` | Pill vertical padding. |
| `--uxm-badge-count-padding-x` | – | `6px` | Pill horizontal padding. |
| `--uxm-badge-dot-size` | – | `8px` | Diameter of the dot in `dot` mode. |
| `--uxm-badge-label-gap` | – | `8px` | Gap between dot and label (`dot` mode). |
| `--uxm-badge-label-color` | `--color-text` | – | Label text colour. |
| `--uxm-badge-label-font-size` | – | `13px` | Label font size. |
| `--uxm-badge-label-font-weight` | – | `500` | Label font weight. |
| `--uxm-badge-accent-bg` | `--color-accent-subtle` | – | `count` background for `accent` tone. |
| `--uxm-badge-accent-text` | `--color-accent-bold` | – | `count` text for `accent` tone. |
| `--uxm-badge-accent-dot-color` | `--color-accent-bold` | – | `dot` colour for `accent` tone. |
| `--uxm-badge-success-bg` | `--color-success-bg` | – | `count` background for `success` tone. |
| `--uxm-badge-success-text` | `--color-success-text` | – | `count` text for `success` tone. |
| `--uxm-badge-success-dot-color` | `--color-success-text` | – | `dot` colour for `success` tone. |
| `--uxm-badge-warning-bg` | `--color-warning-bg` | – | `count` background for `warning` tone. |
| `--uxm-badge-warning-text` | `--color-warning-text` | – | `count` text for `warning` tone. |
| `--uxm-badge-warning-dot-color` | `--color-warning-text` | – | `dot` colour for `warning` tone. |
| `--uxm-badge-danger-bg` | `--color-danger-bg` | – | `count` background for `danger` tone. |
| `--uxm-badge-danger-text` | `--color-danger-text` | – | `count` text for `danger` tone. |
| `--uxm-badge-danger-dot-color` | `--color-danger-text` | – | `dot` colour for `danger` tone. |
| `--uxm-badge-info-bg` | `--color-info-bg` | – | `count` background for `info` tone. |
| `--uxm-badge-info-text` | `--color-info-text` | – | `count` text for `info` tone. |
| `--uxm-badge-info-dot-color` | `--color-info-text` | – | `dot` colour for `info` tone. |
| `--uxm-badge-neutral-bg` | `--color-surface-alt` | – | `count` background for `neutral` tone. |
| `--uxm-badge-neutral-text` | `--color-text-strong` | – | `count` text for `neutral` tone. |
| `--uxm-badge-neutral-dot-color` | `--color-text-muted` | – | `dot` colour for `neutral` tone. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-accent-subtle` | Accent / Accent Subtle | `accent` count background. |
| `--color-accent-bold` | Accent / Accent Bold | `accent` count text + dot colour. |
| `--color-success-bg` | Semantic / Success Bg | `success` count background. |
| `--color-success-text` | Semantic / Success Text | `success` count text + dot colour. |
| `--color-warning-bg` | Semantic / Warning Bg | `warning` count background. |
| `--color-warning-text` | Semantic / Warning Text | `warning` count text + dot colour. |
| `--color-danger-bg` | Semantic / Danger Bg | `danger` count background. |
| `--color-danger-text` | Semantic / Danger Text | `danger` count text + dot colour. |
| `--color-info-bg` | Semantic / Info Bg | `info` count background. |
| `--color-info-text` | Semantic / Info Text | `info` count text + dot colour. |
| `--color-surface-alt` | Surfaces / Surface Alt | `neutral` count background. |
| `--color-text-strong` | Text / Text Strong | `neutral` count text. |
| `--color-text-muted` | Text / Text Muted | `neutral` dot colour. |
| `--color-text` | Text / Text | Default label text colour (`dot` mode). |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| `count` mode | `mode="count"` (or omitted) | Root is a pill with min-width / padding; renders `count` (or `${max}+`) or `children`. |
| `dot` mode | `mode="dot"` | Root is a flex row; `__dot` paints the circle, optional `__label` follows. |
| Tone | `type="…"` | Adds `--{type}` modifier; resolves the relevant tonal variables. |
| Overflow | `count > max` in `count` mode | Display value becomes `${max}+`. |
| Children override | `children !== undefined` in `count` mode | `count` is ignored and `children` is rendered verbatim. |
| Standalone dot | `mode="dot"` without children | Root carries `role="status"`; `__dot` is the announcement. |
| Dot with label | `mode="dot"` with children | `__dot` becomes `aria-hidden="true"`; `__label` is the visible/accessible content. |

## Accessibility

- The `count` pill announces its text content directly to screen readers — pair it with an accessible parent (e.g. a button labelled `"Inbox"`) so listeners know what the count refers to.
- Standalone `dot` mode (no children) carries `role="status"` so the colour-only indicator is announced; provide context via the surrounding control's accessible name.
- `dot` mode **with** children: the dot is marked `aria-hidden="true"` and the label provides the accessible name.
- Colour alone (tone) is not sufficient to convey meaning — always pair tone with a semantic context (e.g. count value, label, or surrounding button label).
- No focus management or keyboard handling — Badge is a presentational `<span>`.
