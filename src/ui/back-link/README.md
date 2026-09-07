# BackLink

A subdued navigation link prefixed with a left-arrow glyph — typically rendered above a detail-page heading to return to the list view.

`BackLink` renders a native `<a>` with a fixed leading `Icon` (`arrow-left`, 14px). It carries no logic beyond merging classes; all routing semantics flow through the spread `AnchorHTMLAttributes` (so `href`, `onClick`, `target`, etc. behave natively). Typography and gap are exposed as CSS variables for per-instance tuning.

## Usage

```tsx
import { BackLink } from '@viax.io/uxm';

function DetailHeader() {
  return (
    <>
      <BackLink href="/models">Back to models</BackLink>
      <h1>Acme V2</h1>
    </>
  );
}
```

## Props

Extends `AnchorHTMLAttributes<HTMLAnchorElement>` — `href`, `target`, `rel`, `onClick`, and every other anchor attribute is forwarded to the root `<a>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Label text rendered after the arrow icon. |
| `href` | `string` | – | Standard anchor target. Required for it to act as a real link. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native anchor attribute)_ | – | – | Spread onto the root `<a>`. |

The component does not accept an `as` / `linkAs` prop — wrap it in your router's link primitive if you need client-side navigation.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-back-link-color` | `--color-text-muted` | – | Resting text + icon colour. |
| `--uxm-back-link-font-size` | – | `13px` | Label font size. |
| `--uxm-back-link-font-weight` | – | `500` | Label font weight. |
| `--uxm-back-link-gap` | – | `6px` | Gap between the arrow icon and the label. |

The hover colour is hardcoded to `--color-text` — there is no `--uxm-back-link-hover-color` knob.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text-muted` | Text / Text Muted | Resting text + icon colour (via the `--uxm-back-link-color` fallback). |
| `--color-text` | Text / Text | Hover text + icon colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Muted text + leading arrow, no underline. |
| Hover | `:hover` | Text + icon shift to `--color-text`. |
| Focus | `:focus-visible` | Inherits the browser's default focus ring; no custom outline is applied. |

## Accessibility

- Renders a native `<a>` — full keyboard activation (`Enter`) and screen-reader semantics come for free.
- The arrow icon is rendered without `aria-hidden`; if it carries no meaning, mark it decorative upstream or rely on its `<svg>` being inert by default.
- Provide concise label text in `children` — "Back" alone is acceptable but a destination ("Back to models") gives more context.
- No `aria-label` is forwarded automatically; if you need to override the accessible name, pass `aria-label` as a prop (it will spread onto the `<a>`).
- The component does not visually distinguish a `disabled` state — disabled navigation should be communicated by removing the `href` and styling externally.
