# PageShell

A two-axis application chrome — left sidebar + top bar + scrollable content — wrapping any page layout. Owns the full viewport height (`100%`), the surface background, and the content area's scroll behaviour.

`variant` controls the content area only — sidebar and top bar always render whatever you pass. `standard` is the default padded, scrollable area for normal product pages; `canvas` is full-bleed and non-scrolling for diagram surfaces and lifecycle modelers (where the canvas owns its own scrolling / panning).

## Usage

```tsx
import { PageShell, AppSidebar, AppTopBar } from '@viax.io/uxm';

function App({ children }) {
  return (
    <PageShell
      sidebar={<AppSidebar />}
      topBar={<AppTopBar title="Users" />}
    >
      {children}
    </PageShell>
  );
}

// Canvas variant for a lifecycle modeler:
function LifecyclePage({ children }) {
  return (
    <PageShell variant="canvas" sidebar={<AppSidebar />} topBar={<BackLinkBar />}>
      {children}
    </PageShell>
  );
}
```

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'standard' \| 'canvas'` | `'standard'` | Content-area behaviour. `standard` scrolls with padding; `canvas` is full-bleed and non-scrolling. |
| `sidebar` | `ReactNode` | – | Left navigation. Typically `<AppSidebar />`. Slot collapses when omitted. |
| `topBar` | `ReactNode` | – | Top header. Anything you want, or omit / `null` to render no header. |
| `children` | `ReactNode` | – | **Required.** Page content, rendered into the scrollable (or full-bleed) `<main>`. |
| `className` | `string` | – | Merged with `uxm-page-shell` and the variant modifier. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

### `PageShellVariant`

```ts
type PageShellVariant = 'standard' | 'canvas';
```

Exported as a string union for consumers building variant-switch controls.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-page-shell-bg` | `--color-surface` | – | Root shell background (also shows through any negative space between sidebar / top bar / content). |
| `--uxm-page-shell-content-padding` | – | `0` | Content-area padding in `standard` variant only. Ignored in `canvas`. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-surface` | Surfaces / Surface | Default shell background. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| `standard` | `variant="standard"` (or omitted) | Content area scrolls vertically; respects `--uxm-page-shell-content-padding`. |
| `canvas` | `variant="canvas"` | Content area is non-scrolling (`overflow: hidden`) with zero padding; consumer canvas owns its own scroll / pan. |
| Sidebar-less | `sidebar` omitted | Sidebar slot is not rendered; body flexes to full width. |
| TopBar-less | `topBar` omitted | Top-bar row collapses; content takes the full vertical space. |

## Accessibility

- Renders a semantic `<main>` for the content area — assistive tech treats it as the page's primary landmark. Use a single `PageShell` per page so there is exactly one `<main>`.
- The sidebar / top bar slots are plain `<div>`s; consumers should pass landmarks (`<nav>`, `<header>`) inside if they want a richer landmark structure.
- Height is hard-coded to `100%` — the consumer must size the parent container (typically `html, body { height: 100% }` or a layout root with explicit height) for the scroll behaviour to engage.
- Focus order follows source: sidebar → top bar → main content. Keep this in mind when adding skip-links.
- No keyboard shortcuts are provided; canvas variants should add their own focus-trap / shortcuts as needed.
