# InlineAction

A tiny, text-first button for in-place actions ("Reset section", "Edit", "Match in 4 other Inputs"). Reads as inline text first and a button second — muted by default, transitioning to an accent colour on hover.

`InlineAction` is sized small (10px) by design so it disappears into dense UI without competing with primary CTAs. The component renders a native `<button>` with an optional leading icon slot and a label slot. Distinct from `BackLink` (breadcrumb navigation, arrow-led) and `ButtonGhost` (regular button-shaped, padded).

## Usage

```tsx
import { InlineAction, Icon } from '@viax.io/uxm';

function Example() {
  return (
    <>
      <InlineAction onClick={() => reset()}>Reset section</InlineAction>
      <InlineAction icon={<Icon glyph="edit" />} onClick={() => edit()}>
        Edit
      </InlineAction>
    </>
  );
}
```

## Props

### `InlineActionProps`

Extends `ButtonHTMLAttributes<HTMLButtonElement>` — any standard button attribute (disabled, onClick, type, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Label content. |
| `icon` | `ReactNode` | – | Optional leading icon. Wrapped in an `aria-hidden` span. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Overridden default — set to `'submit'` explicitly when used inside a form. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| `disabled` | `boolean` | `false` | Native disabled state. |
| _(any native button attribute)_ | – | – | Spread onto the root `<button>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-inline-action-color` | `--color-text-muted` | – | Resting label + icon colour. |
| `--uxm-inline-action-hover-color` | `--color-accent-bold` | – | Hover label + icon colour. |
| `--uxm-inline-action-font-size` | – | `10px` | Label font size. |
| `--uxm-inline-action-font-weight` | – | `500` | Label font weight. |
| `--uxm-inline-action-gap` | – | `4px` | Gap between icon and label. |
| `--uxm-inline-action-icon-size` | – | `10px` | Inner SVG width/height (CSS overrides SVG attributes). |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text-muted` | Text / Text Muted | Resting label colour. |
| `--color-accent-bold` | Accent / Accent Bold | Hover label colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Muted text, no background, no padding. |
| Hover | `:hover` | Colour transitions to `--color-accent-bold` (0.15s ease, both label and icon since icon paints with `currentColor`). |
| With icon | `icon` prop provided | Leading 10×10 SVG slot with 4px gap. |
| Without icon | `icon` prop omitted | Icon span not rendered. |
| Disabled | `disabled` attribute | Native disabled cursor; no dedicated dimmer styling — consumers may layer their own. |

## Accessibility

- Renders a native `<button>` — `Space` / `Enter` activation and disabled handling come for free.
- `type="button"` default prevents accidental form submission.
- The icon span carries `aria-hidden="true"`, so screen readers announce only the label. Pick a label that stands alone semantically (`"Reset"`, not `""` with a reset glyph).
- At 10px the label is below the typical 12px minimum for body copy; verify that the surrounding context makes the action discoverable and the hit area is comfortable. Consider increasing `--uxm-inline-action-font-size` for primary surfaces.
- Hover-only affordance: the resting state has no underline or border, so users navigating by keyboard rely entirely on `:focus-visible` (browser default). Add a focus-ring style globally if your app needs stronger focus signalling on dense surfaces.
- Default muted-on-surface contrast may be marginal; verify against your background, especially in dark mode where `Text Muted` is `#A3A3A3`.
