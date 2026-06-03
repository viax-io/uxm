# Button

A family of four button variants — `ButtonPrimary`, `ButtonSecondary`, `ButtonTertiary`, `ButtonGhost` — rendering a native `<button>` element with a shared visual contract and per-variant theming hooks.

Each variant is a thin wrapper around `<button>` with a single BEM-style class (`uxm-button-{variant}`). All native `ButtonHTMLAttributes` flow through, `type` defaults to `"button"` to avoid accidental form submission, and a consumer-supplied `className` is merged via the `cn` helper.

## Usage

```tsx
import { ButtonPrimary, ButtonSecondary, ButtonTertiary, ButtonGhost } from '@viax/uxm';

function Example() {
  return (
    <>
      <ButtonPrimary onClick={() => save()}>Save</ButtonPrimary>
      <ButtonSecondary onClick={() => cancel()}>Cancel</ButtonSecondary>
      <ButtonTertiary disabled>Disabled</ButtonTertiary>
      <ButtonGhost>Learn more</ButtonGhost>
    </>
  );
}
```

## Props

All four components share the same prop signature:

```ts
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Overridden default — set to `'submit'` explicitly when used inside a form. |
| `className` | `string` | – | Merged with the variant class via the `cn` helper. |
| `children` | `ReactNode` | – | Label content. Accepts text and icon nodes. |
| `disabled` | `boolean` | `false` | Native disabled state; styles dim via opacity transition. |
| `onClick` | `(e: MouseEvent) => void` | – | Standard click handler. |
| _(any native button attribute)_ | – | – | All `ButtonHTMLAttributes<HTMLButtonElement>` are spread onto the root `<button>`. |

The components emit no custom events — all event semantics come from the native `<button>` element.

## CSS variables

Each variant exposes a `--uxm-button-{variant}-gap` custom property for fine-tuning the gap between icon and label. Override per-instance with inline style, or globally via a stylesheet that scopes the rule to your application root.

| Variant | Custom prop | Default |
|---------|-------------|---------|
| `ButtonPrimary` | `--uxm-button-primary-gap` | `8px` |
| `ButtonSecondary` | `--uxm-button-secondary-gap` | `8px` |
| `ButtonTertiary` | `--uxm-button-tertiary-gap` | `8px` |
| `ButtonGhost` | `--uxm-button-ghost-gap` | `8px` |

## Design tokens (MODO-configurable)

All non-structural visual aspects (background, foreground, border) read from the global design-token layer exported by `@viax/uxm/tokens`. These tokens are the customization surface exposed to MODO's brand-settings editor: changes saved there flow into `:root` as `--color-*` declarations and re-tint every consumer instantly. Component CSS vars (above) sit on top of this layer for per-instance fine-tuning.

| Variant | Background | Foreground / border | Hover |
|---------|------------|---------------------|-------|
| `ButtonPrimary` | `--color-accent-bold` (Accent / Accent Bold) | `--color-text-inverse` (Text / Text Inverse) | `opacity: 0.9` |
| `ButtonSecondary` | `--color-card` (Surfaces / Card) | `--color-accent-bold` (border + text) | `opacity: 0.9` |
| `ButtonTertiary` | `transparent` | `--color-border` (border), `--color-text` (text) | `opacity: 0.8` |
| `ButtonGhost` | `transparent` | `--color-accent-bold` (text) | `--color-surface-alt` (bg) |

The token group / token name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States

| State | Trigger | Visual |
|-------|---------|--------|
| Default | – | Variant base palette. |
| Hover | `:hover` | `Primary/Secondary`: `opacity: 0.9`; `Tertiary`: `opacity: 0.8`; `Ghost`: `background: var(--color-surface-alt)`. |
| Disabled | `disabled` attribute | Native disabled cursor; rely on consumer-managed opacity if a dimmer state is desired. |
| Focus | `:focus-visible` | Inherits the browser's default focus ring; consumers can extend via global focus-ring tokens. |

## Accessibility

- Renders a native `<button>` — full keyboard activation (`Space` / `Enter`) and screen-reader semantics come for free.
- `type="button"` default prevents accidental form submission when used outside forms.
- For icon-only buttons, supply an `aria-label` (or use the dedicated `ButtonIcon` component, which forces this contract).
- Disabled state uses the native `disabled` attribute, which removes the button from the tab order and announces `"dimmed"` / `"unavailable"` to assistive tech. If you need a `disabled` look without removing it from the tab order, prefer `aria-disabled="true"` + visual styles.
- The opacity-based hover transition has a 0.15s duration — well within WCAG flicker thresholds.
