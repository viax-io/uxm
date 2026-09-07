# ButtonWithIcon

A neutral, bordered button variant with a fixed leading-icon slot — distinct from the four `Button*` variants so the icon's structural role is explicit at the call site.

Renders a native `<button>` with two BEM-classed inner spans (`__icon`, `__label`). The icon node is required; `type` defaults to `"button"` to avoid accidental form submission; all native `ButtonHTMLAttributes` pass through to the root.

## Usage

```tsx
import { ButtonWithIcon } from '@viax.io/uxm';
import { Icon } from '@viax.io/uxm';

function Example() {
  return (
    <ButtonWithIcon icon={<Icon glyph="plus" size={14} />} onClick={() => addRow()}>
      Add row
    </ButtonWithIcon>
  );
}
```

## Props

`ButtonWithIconProps` extends `ButtonHTMLAttributes<HTMLButtonElement>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | – | **Required.** Leading icon node — typically an `<Icon>` or inline SVG. |
| `children` | `ReactNode` | – | **Required.** Label content rendered inside `<span class="uxm-button-with-icon__label">`. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Overridden default — set to `'submit'` explicitly when used inside a form. |
| `className` | `string` | – | Merged with `uxm-button-with-icon` via `cn`. |
| `disabled` | `boolean` | `false` | Native disabled state; consumer-controlled visual treatment. |
| `onClick` | `(e: MouseEvent) => void` | – | Standard click handler. |
| _(any native button attribute)_ | – | – | Spread onto the root `<button>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-button-with-icon-gap` | – | `8px` | Gap between the icon span and the label span. |

The background, border, and text colours read the design tokens below directly (no per-component CSS-var indirection).

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Button background. |
| `--color-border` | Borders / Border | Default border colour. |
| `--color-text-muted` | Text / Text Muted | Default label + icon colour. |
| `--color-accent-subtle` | Accent / Accent Subtle | Hover background fill. |
| `--color-accent` | Accent / Accent | Hover border colour. |
| `--color-text` | Text / Text | Hover label + icon colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | `--color-card` bg, `--color-border` outline, `--color-text-muted` text. |
| Hover | `:hover` | Background fills to `--color-accent-subtle`, border shifts to `--color-accent`, text/icon to `--color-text`; 0.15s transition. |
| Disabled | `disabled` attribute | Native disabled cursor; no built-in opacity dim — handle visually via consumer styling. |
| Focus | `:focus-visible` | Inherits browser default focus ring; no token-driven focus outline. |

## Accessibility

- Renders a native `<button>` — full keyboard activation (`Space` / `Enter`) and screen-reader semantics come for free.
- `type="button"` default prevents accidental form submission outside forms.
- The icon span carries no `aria-hidden`; if the icon is purely decorative, the consumer should ensure the rendered SVG has `aria-hidden="true"` or rely on the label `children` for the accessible name.
- For icon-only affordances, prefer `IconButton` instead — `ButtonWithIcon` always requires both `icon` and `children`.
- Disabled state uses the native `disabled` attribute, which removes the button from the tab order. Use `aria-disabled="true"` + styling if you need the button focusable while disabled.
