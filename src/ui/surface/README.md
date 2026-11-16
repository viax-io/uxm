# Surface

A panel that sets its own theme: a dark header strip or "what happens next" dock on a light page, a light area inside a dark app. It writes `data-theme` on its element, so the theme's tokens apply to everything inside: atoms, plain host text and the panel's own background.

`tokens.css` declares the dark tokens on `[data-theme="dark"]` and the light ones on `:where([data-theme="light"])`. Any element carrying the attribute re-declares every `--color-*` token for its subtree. `Surface` sets that attribute, and paints the background and text colour the attribute alone doesn't give you.

## Usage

```tsx
import { FilterTabs, Surface } from '@viax.io/uxm/ui';

<Surface theme="dark" as="header">
  <FilterTabs aria-label="Sections" options={sections} value={current} />
</Surface>

<Surface theme="dark" style={{ '--uxm-surface-bg': '#0B1F3A', '--uxm-surface-radius': '12px' } as React.CSSProperties}>
  <h2>What happens next</h2>
  <p>Your order ships in two days.</p>
</Surface>
```

## Props

Extends `HTMLAttributes<HTMLElement>`; every attribute goes to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'dark' \| 'light'` | – | Paints the panel, and everything inside it, in this theme whatever the page's theme. Sets `data-theme` and `color-scheme` on the element. Omitted, the panel follows the page and sets no scope. |
| `as` | `'div' \| 'section' \| 'aside' \| 'header' \| 'footer' \| 'nav' \| 'article'` | `'div'` | The element to render. |
| `padding` | `number \| string` | `24px` | Inner padding. A number is px. Sets `--uxm-surface-padding`. |
| `children` | `ReactNode` | – | The content. |

## CSS variables

Every default is a token, and the variable is resolved on the panel itself, so it follows the panel's theme: `var(--color-surface)` is the dark surface inside a dark panel.

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-surface-bg` | `--color-surface` | – | Background colour. |
| `--uxm-surface-background` | – | unset | Any `background` value (a gradient, an image with its size and repeat). Wins over the colour when set. |
| `--uxm-surface-text-color` | `--color-text` | – | Text colour, inherited by plain host text inside. |
| `--uxm-surface-radius` | – | `0` | Corner radius. |
| `--uxm-surface-padding` | – | `24px` | Inner padding. |

## States & variants

| Variant | Trigger | Result |
|---------|---------|--------|
| Dark | `theme="dark"` | `data-theme="dark"`, `color-scheme: dark`: the dark tokens inside, whatever the page. |
| Light | `theme="light"` | `data-theme="light"`, `color-scheme: light`: the light tokens inside, whatever the page. |
| Page | no `theme` | No attribute: paints with the page's own tokens. |

## Theming notes

- **A fixed colour doesn't follow the panel.** A knob saved as `#FFFFFF`, on this atom or one inside it, is the same in every panel. Token values (`var(--color-…)`) follow it.
- **Brand tokens.** Studio's generated CSS writes a brand's light tokens on `:root:not([data-theme="dark"]), [data-theme="light"]` and its dark ones on `[data-theme="dark"]`, so a panel keeps the brand in either theme. A hand-written theme does the same: light tokens on `:root, [data-theme="light"]`. Tokens set on `:root` alone are replaced inside a light panel on a dark page.
- **Portalled layers.** A `Select`, `Menu` or `Tooltip` opened from inside the panel renders its floating panel at the end of `<body>`, outside the panel, so it uses the page's theme.

## Accessibility

- A plain block element; the semantics come from `as` and the children. Use `as="header"`, `as="nav"` or `as="aside"` when the panel is one of those landmarks, with an `aria-label` if there is more than one.
- Text contrast follows the theme's own token pairs, which meet AA in both themes. A custom background (`--uxm-surface-bg`) needs a text colour checked against it.
