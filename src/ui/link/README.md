# Link

A themable inline text anchor with three underline modes and an external-link variant that appends a trailing arrow glyph.

`Link` is a thin wrapper around a native `<a>` element. The `underline` prop selects between `none`, `hover`, and `always`; the `external` prop swaps in `target="_blank"` + `rel="noopener noreferrer"` and appends an `arrow-up-right` `Icon` so external destinations are visually distinct from in-app links. A `disabled` flag sets `aria-disabled` and the CSS rule blocks pointer-events while painting a dimmed state. All visual aspects (colour, font, underline thickness/offset, external-icon size and gap) are exposed as `--uxm-link-*` CSS variables.

## Usage

```tsx
import { Link } from '@viax/uxm';

function Example() {
  return (
    <>
      <Link href="/settings">In-app link</Link>
      <Link href="https://docs.example.com" external>
        Documentation
      </Link>
      <Link href="/legacy" underline="always">
        Always underlined
      </Link>
      <Link href="/disabled" disabled>
        Disabled
      </Link>
    </>
  );
}
```

## Props

Extends `AnchorHTMLAttributes<HTMLAnchorElement>` — any standard anchor attribute (`href`, `target`, `rel`, `onClick`, `id`, `style`, `data-*`, `aria-*`) is forwarded to the root `<a>`. When `external` is set, `target` / `rel` are overridden after the spread to enforce safe defaults.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Link content. |
| `underline` | `'none' \| 'hover' \| 'always'` | `'hover'` | Underline mode. See [States](#states--variants). |
| `external` | `boolean` | `false` | Adds `target="_blank"` + `rel="noopener noreferrer"` and appends the external-link arrow icon. |
| `disabled` | `boolean` | `false` | Sets `aria-disabled` and lets the CSS rule paint the dimmed / non-interactive state. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native anchor attribute)_ | – | – | Spread onto the root `<a>` (with `target` / `rel` re-applied when `external`). |

```ts
type LinkUnderline = 'none' | 'hover' | 'always';
```

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-link-color` | `--color-accent` | – | Default text colour. |
| `--uxm-link-hover-color` | `--color-accent-bold` | – | Hover text colour. |
| `--uxm-link-font-size` | – | `14px` | Font size. |
| `--uxm-link-font-weight` | – | `500` | Font weight. |
| `--uxm-link-underline-thickness` | – | `1px` | Underline thickness. |
| `--uxm-link-underline-offset` | – | `3px` | Underline offset from baseline. |
| `--uxm-link-external-icon-size` | – | `12px` | External arrow glyph size. |
| `--uxm-link-external-icon-gap` | – | `4px` | Gap between text and external arrow. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-accent` | Accent / Accent | Default link colour. |
| `--color-accent-bold` | Accent / Accent Bold | Hover link colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Underline: `none` | `underline="none"` | No underline at rest or on hover. |
| Underline: `hover` | `underline="hover"` (default) | Underline appears on `:hover` only. |
| Underline: `always` | `underline="always"` | Underline shown at rest. |
| External | `external` prop | Forces `target="_blank"` + `rel="noopener noreferrer"`; trailing `arrow-up-right` icon appended. |
| Hover | `:hover` | Colour shifts to `--uxm-link-hover-color` (`--color-accent-bold` by default) with a 0.15s transition. |
| Disabled | `disabled` prop | `aria-disabled="true"` set; consumer CSS layer should pair with `pointer-events: none` and a dimmed style. |

## Accessibility

- Renders a native `<a>` — keyboard activation (Enter) and screen-reader semantics come for free.
- `external` enforces `rel="noopener noreferrer"` to prevent tabnabbing when opening a new tab; do not override `target` / `rel` via spread when relying on this.
- The external arrow `Icon` is rendered with `aria-hidden` — assistive tech announces the link text only. Consumers should bake "(opens in new tab)" into the link copy or add `aria-label` when that information matters.
- `disabled` sets `aria-disabled="true"` but does **not** remove `href` or change the tab order. To fully block navigation, also intercept `onClick` (`e.preventDefault()`) and ensure your global CSS includes the `pointer-events: none` rule for `[aria-disabled="true"]`.
- Colour-only conveyance: the default `accent` colour must be paired with an underline (`hover` or `always`) for users who cannot perceive the colour difference against body text — consider `underline="always"` in dense paragraphs.
