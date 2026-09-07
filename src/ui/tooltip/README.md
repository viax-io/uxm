# Tooltip

Two complementary tooltip surfaces — `Tooltip` for short, dark-bubble hints with a directional arrow, and `ContentTooltip` for larger, card-like popovers carrying rich content.

Both components are **render-only**: they paint a `role="tooltip"` surface and nothing else. Positioning, anchoring to a trigger, open/close timing, focus management, and dismiss semantics are the consumer's responsibility (typically a Floating UI / Popper integration at the call site). This keeps the primitives composable across portal strategies and animation libraries.

## Usage

```tsx
import { Tooltip, ContentTooltip } from '@viax.io/uxm';

// Short hint with arrow
<Tooltip placement="top">Save changes</Tooltip>

// Rich card with body content
<ContentTooltip shadow>
  <strong>Pro tip</strong>
  <p>Press ⌘S anywhere in the editor to save.</p>
</ContentTooltip>
```

## Props

### `TooltipProps`

Extends `HTMLAttributes<HTMLDivElement>` — all native div attributes are forwarded to the root surface (including `style` for positioning).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Body content. Rendered inside `.uxm-tooltip__body`. |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Controls arrow position via the `uxm-tooltip--{placement}` modifier. Does NOT position the surface itself. |
| `showArrow` | `boolean` | `true` | Render the directional arrow. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div role="tooltip">`. |

The `TooltipPlacement` union is exported.

### `ContentTooltipProps`

Extends `HTMLAttributes<HTMLDivElement>` — all native div attributes are forwarded.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Body content. Free-form. |
| `shadow` | `boolean` | – | Adds `uxm-content-tooltip--shadow` modifier → `--shadow-md` drop shadow. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div role="tooltip">`. |

## Design tokens (MODO-configurable)

The components have no `--uxm-tooltip-*` overrides — colours wire directly to the global token layer.

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text` | Text / Text | `Tooltip` body + arrow background (dark surface). |
| `--color-text-inverse` | Text / Text Inverse | `Tooltip` text colour. |
| `--color-card` | Surfaces / Card | `ContentTooltip` background. |
| `--color-border` | Borders / Border | `ContentTooltip` border. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| `Tooltip` placement: `top` | `placement="top"` (default) | Arrow drawn at bottom-centre, rotated 45°. |
| `Tooltip` placement: `bottom` | `placement="bottom"` | Arrow drawn at top-centre. |
| `Tooltip` placement: `left` | `placement="left"` | Arrow drawn at right-centre. |
| `Tooltip` placement: `right` | `placement="right"` | Arrow drawn at left-centre. |
| `Tooltip` no arrow | `showArrow={false}` | Arrow `<span>` omitted; just the body bubble. |
| `Tooltip` body | – | Dark `--color-text` background, `--color-text-inverse` text, 12px, `white-space: nowrap`. |
| `ContentTooltip` default | – | Card-coloured background, 1px border, 8px radius, 12px padding, 320px max width. |
| `ContentTooltip` shadow | `shadow={true}` | Adds `--shadow-md` drop shadow. |

## Accessibility

- Both components carry `role="tooltip"` on the surface — assistive tech recognises them as tooltip content.
- The arrow span is `aria-hidden="true"` and decorative.
- **The components do not implement WAI-ARIA tooltip behaviour end-to-end.** Consumers must:
  - link the trigger to the tooltip via `aria-describedby` (matching the tooltip's `id`),
  - manage show/hide on `mouseenter` / `mouseleave` and `focusin` / `focusout` of the trigger,
  - dismiss on `Escape`,
  - keep the trigger focusable and avoid trapping focus inside the tooltip.
- `Tooltip`'s `nowrap` body is appropriate only for short strings; long strings will overflow horizontally. Use `ContentTooltip` for multi-line or rich content.
- Because `Tooltip` relies on a dark surface for contrast against the body, ensure `--color-text` and `--color-text-inverse` retain WCAG AA contrast in any custom theme.
