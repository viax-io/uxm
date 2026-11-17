# AppTopBar

The fixed-height header strip for an application shell — exposes a search slot, an actions slot, and a mobile-only menu trigger that hides above `768px`.

`AppTopBar` is a pure layout primitive: a `<header>` with two flex columns (`__left` and `__actions`). It owns the bar's background, height, padding, and the bottom-border rule, and lets the consumer compose whatever search field and action controls they need. The mobile menu button renders only when `onMobileMenuClick` is provided and is hidden by a media query on desktop widths.

## Usage

```tsx
import { AppTopBar, InputWithIcon, ButtonIcon, Icon } from '@viax.io/uxm';

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
| `brand` | `ReactNode` | – | Leading brand (usually a logo link), first in the left column after the mobile menu button. Use with `PageShell topBarPlacement="above"` and an `AppSidebar` without `brand`. |
| `search` | `ReactNode` | – | Rendered into the `__search` slot inside the left column. Width capped by `--uxm-app-top-bar-search-max-width`. |
| `actions` | `ReactNode` | – | Right-aligned content (theme toggle, primary button, avatar, etc.). The wrapper is omitted entirely when nothing is passed. |
| `onMobileMenuClick` | `() => void` | – | Click handler for the mobile menu button. Button only renders when this prop is provided; hidden at `min-width: 768px`. |
| `className` | `string` | – | Merged with the `<header>` root class via `cn`. |
| _(any native HTMLElement attribute)_ | – | – | Spread onto the `<header>` root. |
| `menuLabel` | `string` | `'Open navigation'` | Accessible name for the mobile menu trigger. |
| `collapseAt` | `640 \| 768 \| 960 \| 1024` | – | Viewport width at or below which the bar grows a second row and moves the `search` slot onto it (full width, padded like the bar's sides). The first row keeps the bar's height, with the brand at the left and the actions at the right. Unset, the bar stays one row. |

### Collapsing on narrow screens

Tabs or a wide search in the `search` slot squeeze the brand and actions as the window narrows, until labels wrap or overlap. `collapseAt` moves the slot onto its own row instead:

```tsx
<AppTopBar collapseAt={960} brand={<Logo />} search={<FilterTabs … />} actions={<PersonaMenu />} />
```

It's CSS only (one media query per value), so there's no script and no flash on load. Studio's canvas doesn't narrow the viewport, so the collapse shows in the app, not in the workbench.

- **The breakpoint is the window, not the bar.** With an `AppSidebar` beside it the bar is narrower than the window, so pick the value with the sidebar's width in mind.
- **Heights.** Collapsed, `--uxm-app-top-bar-height` is the first row's height and the bar grows to fit the search row, padded like the bar's sides (`--uxm-app-top-bar-padding-x`).
- **Focus order.** The search row sits below the actions but keeps its place in the DOM, so Tab still reaches it before the actions, the same order as the wide bar.
- **Use it with a brand or actions.** A bar with only a search slot has nothing to keep on the first row.
- **Very narrow screens.** If the brand and the actions can't share the first row, the actions wrap onto a row of their own rather than overlap the brand. Shorten a long action label ("Viewing as: …") at that width.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-app-top-bar-background-color` | `--color-surface-alt` at 50% | – | Bar background colour (translucent by default). |
| `--uxm-app-top-bar-background` | `--uxm-app-top-bar-background-color` | – | Any `background` value — a gradient, or an image with its position, size and repeat — painted instead of the colour knob. Unset by default. A gradient or an opaque image covers the colour; for a transparent pattern put the colour in the value's last layer (`url(/grid.svg) 0 0 / 30px 30px, var(--color-surface-alt)`). A Studio save keeps only `https://` and root-relative (`/…`) `url()`s; any other url (`data:`, `./…`) drops the whole value, and the colour knob paints. So does `image-set()` / `image()`, a backslash, a `/*` comment, or an unclosed bracket or quote (`linear-gradient(135deg, red`), which would otherwise swallow the rest of the stylesheet. |
| `--uxm-app-top-bar-border-color` | `--color-border` | – | Bottom border colour. |
| `--uxm-app-top-bar-border-bottom-width` | – | `1px` | Bottom border width — a heavier brand rule under the bar, or `0px` for none. |
| `--uxm-app-top-bar-brand-gap` | – | `16px` | Space after the `__brand` slot. |
| `--uxm-app-top-bar-brand-height` | – | `24px` | Height of an `<img>` inside the `__brand` slot. |
| `--uxm-app-top-bar-search-max-width` | – | `320px` | Max width of the `__search` slot inside the left column. |

## Design tokens (MODO-configurable)

When the component-scoped variables above are not overridden, AppTopBar resolves colour through the global design-token layer exported by `@viax.io/uxm/tokens`. These tokens are the customization surface exposed to MODO's brand-settings editor.

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
| Collapsed | `collapseAt` set, viewport at or below it | Two rows: brand and actions on a bar-height first row, `search` full width on the second. |

## Accessibility

- Root is a semantic `<header>` — screen readers expose it as a `banner` landmark when used as a top-level page element.
- Mobile menu button is a real `<button type="button">` with `aria-label="Open navigation"` — keyboard-activatable via `Enter` / `Space`.
- Slot contents own their own a11y story: pass labelled inputs / buttons into `search` and `actions`.
- No `<h1>` or skip-to-content link is rendered; if AppTopBar is your global page header, consider injecting one of these into the `search` or `actions` slot for landmark navigation.
- The translucent background relies on `color-mix` — verify legibility of any content placed behind the bar (no backdrop-filter / blur is applied).
