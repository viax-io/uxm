# IconButton

A square, icon-only `<button>` for compact controls (toolbars, row actions, dismissals). Required `aria-label` is enforced at the type level.

`IconButton` is a thin wrapper around `<button>` that applies the `uxm-icon-button` class, plus `uxm-icon-button--filled` for `variant="filled"` (the successor of the deprecated `ButtonIcon` atom). All native `ButtonHTMLAttributes` flow through; `type` defaults to `"button"` to avoid accidental form submission. The component is structural only — sizing of the inner SVG is enforced by CSS so per-instance `<Icon size>` props are visually overridden once the icon lives inside an IconButton.

## Usage

```tsx
import { IconButton, Icon } from '@viax.io/uxm';

function Example() {
  return (
    <IconButton aria-label="Close" onClick={() => dismiss()}>
      <Icon glyph="close" />
    </IconButton>
  );
}
```

## Props

### `IconButtonProps`

Extends `ButtonHTMLAttributes<HTMLButtonElement>` — any standard button attribute (disabled, onClick, type, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** SVG content — typically `<Icon glyph="…" />` or a raw `<svg>`. |
| `aria-label` | `string` | – | **Required by the type signature.** Screen-reader name for the icon-only control. |
| `variant` | `'ghost' \| 'filled'` | `'ghost'` | `ghost` — 32 px, transparent, for toolbars / row ⋮ / inline chrome. `filled` — 40 px, `--color-surface-alt` fill, radius 8, for a standalone action ("add", "create"); replaces `ButtonIcon`. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Overridden default — set to `'submit'` explicitly when used inside a form. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| `disabled` | `boolean` | `false` | Native disabled state. |
| _(any native button attribute)_ | – | – | Spread onto the root `<button>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-icon-button-size` | – | `32px` | Width and height of the button (always square). |
| `--uxm-icon-button-radius` | – | `6px` | Corner radius. |
| `--uxm-icon-button-bg` | – | `transparent` | Resting background. |
| `--uxm-icon-button-color` | `--color-text-muted` | – | Resting icon colour (applied via `color` → `currentColor`). |
| `--uxm-icon-button-hover-bg` | `--color-surface-alt` | – | Hover background. |
| `--uxm-icon-button-hover-color` | `--color-text` | – | Hover icon colour. |
| `--uxm-icon-button-active-bg` | `--uxm-icon-button-hover-bg` → `--color-surface-alt` | – | Pressed background. Falls back to the **hover** value first, so a tinted button that sets `-bg` + `-hover-bg` holds its fill on press instead of flashing to the neutral default. |
| `--uxm-icon-button-active-color` | `--uxm-icon-button-hover-color` → `--color-text` | – | Pressed icon colour, chained the same way. |
| `--uxm-icon-button-disabled-opacity` | – | `0.4` | Disabled state opacity. |
| `--uxm-icon-button-icon-size` | – | `16px` | Inner SVG width/height (CSS overrides the SVG's own attributes). |
| `--uxm-icon-button-stroke-width` | – | `1.75` | Inner SVG stroke width (CSS overrides the SVG's `stroke-width` attribute). Shared by both variants. |
| `--uxm-icon-button-filled-size` | – | `40px` | `filled` — width and height. |
| `--uxm-icon-button-filled-radius` | – | `8px` | `filled` — corner radius. |
| `--uxm-icon-button-filled-icon-size` | – | `18px` | `filled` — inner SVG width/height. |
| `--uxm-icon-button-filled-bg` | `--color-surface-alt` | – | `filled` — resting fill. |
| `--uxm-icon-button-filled-color` | `--color-text` | – | `filled` — resting icon colour. |
| `--uxm-icon-button-filled-hover-bg` | `--color-accent-subtle` | – | `filled` — hover fill. |
| `--uxm-icon-button-filled-hover-color` | `--color-text` | – | `filled` — hover icon colour. |
| `--uxm-icon-button-filled-active-bg` | `--color-accent-bold` | – | `filled` — pressed fill. |
| `--uxm-icon-button-filled-active-color` | `--color-text-inverse` | – | `filled` — pressed icon colour. |

> The inner SVG sizing variables are load-bearing: per-call `<Icon size={N} />` props are overridden once the icon lives inside an IconButton, so registry-level edits to `iconSize` / `strokeWidth` are visible everywhere.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text-muted` | Text / Text Muted | Resting icon colour. |
| `--color-surface-alt` | Surfaces / Surface Alt | Hover background. |
| `--color-text` | Text / Text | Hover icon colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Transparent background, muted icon. |
| Hover | `:hover` | Background fades to `--color-surface-alt`, icon to `--color-text` (0.15s transitions). |
| Disabled | `disabled` attribute | `opacity: 0.4`, `cursor: not-allowed`. |
| Focus | `:focus-visible` | 2 px `--color-accent` outline, offset 2 px (shared by both variants). |
| `variant="filled"` | prop | 40 px, `--color-surface-alt` fill, radius 8, 18 px glyph; hover `--color-accent-subtle`, pressed `--color-accent-bold` with inverse icon — the former `ButtonIcon` look, themed under `--uxm-icon-button-filled-*`. |

## Accessibility

- The TypeScript signature requires `aria-label` — icon-only buttons would otherwise be unannounced. Pick a verb-phrase label that matches the user-visible action (`"Close"`, `"Delete row"`, `"Open menu"`).
- Renders a native `<button>` — full keyboard activation (`Space` / `Enter`) and disabled handling come for free.
- `type="button"` default prevents accidental form submission outside forms.
- Hit target defaults to 32×32 — below the WCAG 2.1 AAA 44×44 minimum but acceptable for dense toolbar use. Increase `--uxm-icon-button-size` for touch-primary surfaces.
- `variant="filled"` is 40×40 — use it where the 32 px ghost hit target is too small for touch.
