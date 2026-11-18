# Link

A themable inline text anchor with three underline modes and an external-link variant that appends a trailing arrow glyph.

`Link` is a thin wrapper around a native `<a>` element (or your router's link component, through `linkAs`). The `underline` prop selects between `none`, `hover`, and `always`; the `external` prop swaps in `target="_blank"` + `rel="noopener noreferrer"` and appends an `arrow-up-right` `Icon` so external destinations are visually distinct from in-app links. A `disabled` flag sets `aria-disabled` and the CSS rule blocks pointer-events while painting a dimmed state. All visual aspects (colour, font, underline thickness/offset, external-icon size and gap) are exposed as `--uxm-link-*` CSS variables.

## Usage

```tsx
import { Link } from '@viax.io/uxm';

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

### Client-side navigation

A plain `<a href>` reloads the document on every click, which in a Next.js or React Router app
tears down the providers and re-reads the page's data. Pass the router's link component as
`linkAs` and an in-app link navigates on the client instead — the same knob `AppSidebar` has:

```tsx
import NextLink from 'next/link';

<Link href="/orders/42" linkAs={NextLink}>Order 42</Link>;
```

`linkAs` gets `href`, `className`, `children` and every other prop the `<a>` would have had.
React Router's `Link` reads `to` and ignores `href`, so pass an `href` → `to` adapter, not the
`Link` itself:

```tsx
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const RouterHrefLink = forwardRef<HTMLAnchorElement, { href?: string }>(
  function RouterHrefLink({ href, ...rest }, ref) {
    return <RouterLink ref={ref} to={href ?? '#'} {...rest} />;
  },
);

<Link href="/orders/42" linkAs={RouterHrefLink}>Order 42</Link>;
```

`external` always renders a plain `<a>` and ignores `linkAs`: a link that opens another site in a
new tab has nothing for a router to do.

`linkAs` is typed as any `ElementType`, so TypeScript doesn't check that the component reads
`href`: passing React Router's `Link` directly compiles and only fails when clicked. A narrower
type (a component that takes `<a>` props) would catch that, but it also rejects `next/link`,
whose `href` is required and accepts a URL object, so the type stays loose. `BackLink`,
`Breadcrumb` and `AppSidebar` take the same `linkAs`.

## Props

Extends `AnchorHTMLAttributes<HTMLAnchorElement>` — any standard anchor attribute (`href`, `target`, `rel`, `onClick`, `id`, `style`, `data-*`, `aria-*`) is forwarded to the root `<a>`. When `external` is set, `target` / `rel` are overridden after the spread to enforce safe defaults.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Link content. |
| `underline` | `'none' \| 'hover' \| 'always'` | `'hover'` | Underline mode. See [States](#states--variants). |
| `external` | `boolean` | `false` | Adds `target="_blank"` + `rel="noopener noreferrer"` and appends the external-link arrow icon. |
| `disabled` | `boolean` | `false` | Sets `aria-disabled` and lets the CSS rule paint the dimmed / non-interactive state. |
| `linkAs` | `ElementType` | `'a'` | Element rendered for the anchor — pass the router's link (`next/link`, or an `href` → `to` adapter for React Router) so in-app clicks don't reload the page. Ignored when `external`. See [Client-side navigation](#client-side-navigation). |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native anchor attribute)_ | – | – | Spread onto the root `<a>` — or onto `linkAs` (with `target` / `rel` re-applied when `external`). |

```ts
type LinkUnderline = 'none' | 'hover' | 'always';
```

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-link-color` | `--color-accent` | – | Default text colour. |
| `--uxm-link-hover-color` | `--color-accent-bold` | – | Hover text colour. |
| `--uxm-link-font-size` | – | `14px` | Font size. |
| `--uxm-link-font-weight` | `--font-weight-medium` | `500` | Font weight. |
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

- Renders a native `<a>` — keyboard activation (Enter) and screen-reader semantics come for free. A `linkAs` component must render an `<a href>` itself (`next/link` and React Router's `Link` both do) to keep them.
- `external` enforces `rel="noopener noreferrer"` to prevent tabnabbing when opening a new tab; do not override `target` / `rel` via spread when relying on this.
- The external arrow `Icon` is rendered with `aria-hidden` — assistive tech announces the link text only. Consumers should bake "(opens in new tab)" into the link copy or add `aria-label` when that information matters.
- `disabled` sets `aria-disabled="true"` but does **not** remove `href` or change the tab order. To fully block navigation, also intercept `onClick` (`e.preventDefault()`) and ensure your global CSS includes the `pointer-events: none` rule for `[aria-disabled="true"]`. The same holds through `linkAs`: a router link doesn't read `aria-disabled` either, and still navigates on Enter.
- Colour-only conveyance: the default `accent` colour must be paired with an underline (`hover` or `always`) for users who cannot perceive the colour difference against body text — consider `underline="always"` in dense paragraphs.
