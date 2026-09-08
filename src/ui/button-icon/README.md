# ButtonIcon

> **Deprecated since 4.39 — use [`IconButton`](../icon-button/README.md) with `variant="filled"`.** It paints exactly this (40 px, `--color-surface-alt` fill, radius 8, accent-subtle hover, accent-bold pressed) and is themed under `--uxm-icon-button-filled-*`. `ButtonIcon`, its `uxm-button-icon` class and the `--uxm-button-icon-*` vars are removed in the next major; until then saved studio themes keep painting. Migration: `<ButtonIcon …>` → `<IconButton variant="filled" …>`, `--uxm-button-icon-background-color` → `--uxm-icon-button-filled-bg`, `-hover-background-color` → `-filled-hover-bg`, `-active-background-color` → `-filled-active-bg`, `-size` → `-filled-size`, `-icon-size` → `-filled-icon-size`, `-border-radius` → `-filled-radius`.

A square icon-only button — renders a native `<button>` with no label text, sized via CSS variable, and enforces the `aria-label` contract at the type level.

`ButtonIcon` is a thin wrapper around `<button>` with a single BEM class (`uxm-button-icon`). It requires `aria-label` (via TypeScript), so an icon-only button can never ship without a screen-reader accessible name. `type` defaults to `"button"` to prevent accidental form submission. The inner `<svg>` is sized through `--uxm-button-icon-icon-size`, so the same component can host glyphs of varying intrinsic size while keeping the hit-target square.

## Usage

```tsx
import { ButtonIcon, Icon } from '@viax.io/uxm';

function Example() {
  return (
    <ButtonIcon aria-label="Open settings" onClick={() => openSettings()}>
      <Icon glyph="settings" />
    </ButtonIcon>
  );
}
```

## Props

Extends `ButtonHTMLAttributes<HTMLButtonElement>` — any standard button attribute (onClick, disabled, form, name, …) is forwarded to the root `<button>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** SVG content — typically `<Icon glyph="…" />` or a raw `<svg>`. The first `<svg>` descendant is sized via the icon-size CSS variable. |
| `aria-label` | `string` | – | **Required.** Enforced at the type level so icon-only buttons always carry an accessible name. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Overridden default — set to `'submit'` explicitly when used inside a form. |
| `disabled` | `boolean` | `false` | Native disabled state; styles dim via `--uxm-button-icon-disabled-opacity` and switch to a not-allowed cursor. |
| `onClick` | `(e: MouseEvent) => void` | – | Standard click handler. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native button attribute)_ | – | – | Spread onto the root `<button>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-button-icon-size` | – | `40px` | Square dimensions (width + height) of the button. |
| `--uxm-button-icon-icon-size` | – | `18px` | Dimensions of the inner `<svg>`. |
| `--uxm-button-icon-background-color` | `--color-surface-alt` | – | Resting background. |
| `--uxm-button-icon-color` | `--color-text` | – | Resting icon colour. |
| `--uxm-button-icon-hover-background-color` | `--color-accent-subtle` | – | Hover background. |
| `--uxm-button-icon-hover-color` | `--color-text` | – | Hover icon colour. |
| `--uxm-button-icon-active-background-color` | `--color-accent-bold` | – | `:active` background. |
| `--uxm-button-icon-active-color` | `--color-text-inverse` | – | `:active` icon colour. |
| `--uxm-button-icon-focus-color` | `--color-text` | – | `:focus-visible` icon colour. |
| `--uxm-button-icon-focus-ring-color` | `--color-accent` | – | `:focus-visible` outline colour. |
| `--uxm-button-icon-disabled-color` | `--color-text-muted` | – | Icon colour when disabled. |
| `--uxm-button-icon-disabled-opacity` | – | `0.4` | Root opacity when disabled. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-surface-alt` | Surfaces / Surface Alt | Resting background. |
| `--color-text` | Text / Text | Resting + hover + focus icon colour. |
| `--color-accent-subtle` | Accent / Accent Subtle | Hover background. |
| `--color-accent-bold` | Accent / Accent Bold | `:active` background. |
| `--color-text-inverse` | Text / Text Inverse | `:active` icon colour. |
| `--color-accent` | Accent / Accent | `:focus-visible` outline. |
| `--color-text-muted` | Text / Text Muted | Disabled icon colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | `surface-alt` background, `text`-coloured icon, 8px corner radius. |
| Hover | `:hover:not(:disabled)` | Background → `accent-subtle`, 0.15s transitions on bg/color/opacity. |
| Active | `:active:not(:disabled)` | Background → `accent-bold`, icon → `text-inverse`. |
| Focus | `:focus-visible` | 2px solid `accent` outline with 2px offset. |
| Disabled | `disabled` attribute | Icon colour → `text-muted`, opacity → 0.4, cursor → `not-allowed`. Hover / active rules are skipped via `:not(:disabled)`. |

## Accessibility

- Renders a native `<button>` — full keyboard activation (`Space` / `Enter`) and screen-reader semantics come for free.
- `aria-label` is **required by the TypeScript signature**, so an icon-only button can't ship without a screen-reader name. Pass a verb-phrase (e.g. `"Open settings"`, not `"Settings icon"`).
- `type="button"` default prevents accidental form submission.
- Disabled state uses the native `disabled` attribute — removed from tab order; assistive tech announces "dimmed" / "unavailable". For a not-focusable look that still announces context, prefer `aria-disabled="true"` plus your own styles.
- `:focus-visible` outline is explicitly defined — keyboard users always see a focus ring even when MODO replaces the default browser outline.
- The inner SVG inherits colour via CSS variables (no `fill="currentColor"` is enforced); ensure your glyphs use `currentColor` so the state-specific colours apply.
