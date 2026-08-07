# AppTopBar

The fixed-height header strip for an application shell — exposes a search slot, an actions slot, and a mobile-only menu trigger that hides above `768px`.

`AppTopBar` is a pure layout primitive: a `<header>` with two flex columns (`__left` and `__actions`). It owns the bar's background, height, padding, and the bottom-border rule, and lets the consumer compose whatever search field and action controls they need. The mobile menu button renders only when `onMobileMenuClick` is provided and is hidden by a media query on desktop widths.

## Usage

```tsx
import { AppTopBar, InputWithIcon, ButtonIcon, Icon } from '@viax/uxm';

function Shell() {
  return (
    <AppTopBar
      search={<InputWithIcon placeholder="Search…" icon={<Icon glyph="search" />} />}
      actions={
        <>
          <ButtonIcon aria-label="Toggle theme"><Icon glyph="moon" /></ButtonIcon>
          <Avatar initials="PA" />
        </>
      }
      onMobileMenuClick={() => setDrawerOpen(true)}
    />
  );
}
```

## Props

Extends `HTMLAttributes<HTMLElement>` — any standard attribute (id, style, data-*, aria-*) is forwarded to the `<header>` root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `search` | `ReactNode` | – | Rendered into the `__search` slot inside the left column. Width capped by `--uxm-app-top-bar-search-max-width`. |
| `actions` | `ReactNode` | – | Right-aligned content (theme toggle, primary button, avatar, etc.). The wrapper is omitted entirely when nothing is passed. |
| `onMobileMenuClick` | `() => void` | – | Click handler for the mobile menu button. Button only renders when this prop is provided; hidden at `min-width: 768px`. |
| `className` | `string` | – | Merged with the `<header>` root class via `cn`. |
| _(any native HTMLElement attribute)_ | – | – | Spread onto the `<header>` root. |
| `menuLabel` | `string` | `'Open navigation'` | Accessible name for the mobile menu trigger. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-app-top-bar-border-color` | `--color-border` | – | Bottom border colour. |
| `--uxm-app-top-bar-search-max-width` | – | `320px` | Max width of the `__search` slot inside the left column. |

## Design tokens (MODO-configurable)

When the component-scoped variables above are not overridden, AppTopBar resolves colour through the global design-token layer exported by `@viax/uxm/tokens`. These tokens are the customization surface exposed to MODO's brand-settings editor.

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-surface-alt` | Surfaces / Surface Alt | Root background (mixed at 50% with transparent for a translucent strip). |
| `--color-border` | Borders / Border | Bottom border. |
| `--color-text-strong` | Text / Text Strong | Mobile-menu button text + icon colour. |
| `--color-surface` | Surfaces / Surface | Mobile-menu button hover background. |
| `--color-text` | Text / Text | Mobile-menu button hover text. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | 64px tall flex row, translucent `surface-alt` background, bottom rule. |
| With mobile menu | `onMobileMenuClick` provided | `__menu` button renders at the start of the left column. |
| Desktop layout | viewport `≥ 768px` | `__menu` button is hidden via media query. |
| Menu hover | `:hover` on `__menu` | Background → `--color-surface`, text → `--color-text` with a 0.15s transition. |
| No actions | `actions` omitted | The right-side `__actions` wrapper is not rendered at all (no empty flex cell). |

## Accessibility

- Root is a semantic `<header>` — screen readers expose it as a `banner` landmark when used as a top-level page element.
- Mobile menu button is a real `<button type="button">` with `aria-label="Open navigation"` — keyboard-activatable via `Enter` / `Space`.
- Slot contents own their own a11y story: pass labelled inputs / buttons into `search` and `actions`.
- No `<h1>` or skip-to-content link is rendered; if AppTopBar is your global page header, consider injecting one of these into the `search` or `actions` slot for landmark navigation.
- The translucent background relies on `color-mix` — verify legibility of any content placed behind the bar (no backdrop-filter / blur is applied).
