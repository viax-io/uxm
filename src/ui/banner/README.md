# Banner

A full-width persistent strip rendered inline in page flow, with four semantic variants (`info`, `success`, `warning`, `error`), a leading glyph, an optional title, and an optional dismiss affordance.

`Banner` is a flex row: a `__icon` span (variant glyph, or a caller-supplied `icon`), a `__body` holding an optional `__title` and `__content`, and an optional `__close` button parked at the right edge by `margin-left: auto`. Each variant reads its **own** `--uxm-banner-{variant}-*` triple rather than a shared one, so editing the Info colours in the studio no longer cascades into Warning or Error.

**Banner vs Toast.** Banner is *persistent* — it stays until the user dismisses it or the consumer drops it from state, and it never auto-disappears. Use it for system states and announcements ("Maintenance at 02:00", "Subscription expiring"). For transient after-the-fact feedback ("Saved", "Copied") use [`Toast`](../toast/README.md) via the `toast.*()` API instead.

## Usage

```tsx
import { Banner } from '@viax/uxm/ui';

// Announcement with a title and body.
<Banner variant="warning" title="Subscription expiring">
  Your plan renews on 12 March. Update your payment method to avoid interruption.
</Banner>

// Dismissible — Banner does not manage its own visibility.
const [visible, setVisible] = useState(true);

{visible && (
  <Banner variant="info" onDismiss={() => setVisible(false)}>
    Maintenance is scheduled for 02:00 UTC.
  </Banner>
)}
```

## Props

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` — the native `title` attribute (a tooltip string) is dropped because the `title` prop here is primary content (`ReactNode`). Any other standard div attribute is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'success' \| 'info' \| 'warning' \| 'error'` | `'info'` | Semantic tone. Drives colours, the default glyph, and the ARIA role. |
| `title` | `ReactNode` | – | Bold heading line. Omitted entirely if not passed. |
| `icon` | `ReactNode` | variant glyph | Overrides the default glyph for the variant. |
| `children` | `ReactNode` | – | Body content, rendered under the title at 90% opacity. |
| `onDismiss` | `() => void` | – | When set, renders a close button that calls this. **Banner does not hide itself** — the consumer removes it from state. |
| `dismissLabel` | `string` | `'Dismiss'` | Accessible label for the close button. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute except `title`)_ | – | – | Spread onto the root `<div>`. |

```ts
type BannerVariant = 'success' | 'info' | 'warning' | 'error';
```

Variant → glyph mapping:

| Variant | Glyph |
|---------|-------|
| `success` | `check-circle` |
| `info` | `info` |
| `warning` | `exclamation-triangle` |
| `error` | `exclamation-circle` |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-banner-padding-y` | – | `12px` | Vertical padding. |
| `--uxm-banner-padding-x` | – | `16px` | Horizontal padding. |
| `--uxm-banner-border-radius` | – | `8px` | Corner radius. |
| `--uxm-banner-font-size` | – | `14px` | Base font size for title and content. |
| `--uxm-banner-info-bg` | `--color-info-bg` | – | Background, `info`. |
| `--uxm-banner-info-text` | `--color-info-text` | – | Text and icon colour, `info`. |
| `--uxm-banner-info-border` | `--color-info-border` | – | Border colour, `info`. |
| `--uxm-banner-success-bg` | `--color-success-bg` | – | Background, `success`. |
| `--uxm-banner-success-text` | `--color-success-text` | – | Text and icon colour, `success`. |
| `--uxm-banner-success-border` | `--color-success-border` | – | Border colour, `success`. |
| `--uxm-banner-warning-bg` | `--color-warning-bg` | – | Background, `warning`. |
| `--uxm-banner-warning-text` | `--color-warning-text` | – | Text and icon colour, `warning`. |
| `--uxm-banner-warning-border` | `--color-warning-border` | – | Border colour, `warning`. |
| `--uxm-banner-error-bg` | `--color-danger-bg` | – | Background, `error`. |
| `--uxm-banner-error-text` | `--color-danger-text` | – | Text and icon colour, `error`. |
| `--uxm-banner-error-border` | `--color-danger-border` | – | Border colour, `error`. |

Note the deliberate asymmetry: the **variant key is `error`** while the **token family is `danger`** (`--uxm-banner-error-bg` falls back to `--color-danger-bg`). The variant name matches the other three semantic words; the token name matches existing brand-token naming. Studio saves emit `--uxm-banner-error-*`.

The close button, title and content declare no variables of their own — the button inherits the variant's text colour via `color: inherit`, and its hover wash is a 6% mix of `--color-text`.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-info-bg` | Semantic / Info Bg | `info` background. |
| `--color-info-text` | Semantic / Info Text | `info` text + icon. |
| `--color-info-border` | Semantic / Info Border | `info` border. |
| `--color-success-bg` | Semantic / Success Bg | `success` background. |
| `--color-success-text` | Semantic / Success Text | `success` text + icon. |
| `--color-success-border` | Semantic / Success Border | `success` border. |
| `--color-warning-bg` | Semantic / Warning Bg | `warning` background. |
| `--color-warning-text` | Semantic / Warning Text | `warning` text + icon. |
| `--color-warning-border` | Semantic / Warning Border | `warning` border. |
| `--color-danger-bg` | Semantic / Danger Bg | `error` background. |
| `--color-danger-text` | Semantic / Danger Text | `error` text + icon. |
| `--color-danger-border` | Semantic / Danger Border | `error` border. |
| `--color-text` | Text / Text | Close-button hover wash (6% mix). |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Variant | `variant="…"` | Adds the `--{variant}` modifier; resolves that variant's bg / text / border triple and default glyph. |
| With title | `title` set | Bold `__title` line above the content. |
| Custom icon | `icon` set | Replaces the variant glyph; the slot stays `aria-hidden`. |
| Dismissible | `onDismiss` set | `__close` button appears at the right edge at 60% opacity. |
| Close hover | pointer over `__close` | Full opacity plus a 6% text-coloured wash. |
| Close focus | keyboard focus on `__close` | Full opacity plus a 2px `currentColor` outline, offset 1px. |

## Accessibility

- The root carries **`role="alert"` for `variant="error"` and `role="status"` otherwise**. `alert` is assertive and interrupts the screen reader; `status` is polite and waits. That split is deliberate — do not use `error` for non-urgent content just to get the colour.
- Because the role is on the root, a Banner that is mounted *after* page load is announced. One rendered in the initial markup may not be — if the message matters, mount it in response to the state change rather than server-rendering it.
- The icon slot is `aria-hidden="true"`: the glyph duplicates the variant, which the text should already state. Never rely on the glyph or colour alone to convey the severity — write it into the title or body.
- The close button is a real `<button type="button">` with an `aria-label` (`dismissLabel`, default `"Dismiss"`). Override it when several banners can be on screen at once, so the label says *what* is being dismissed.
- `__close` has a visible `:focus-visible` outline in `currentColor`, so it stays visible against every variant background.
- Banner is not focus-trapping and not modal — it never steals focus. That is what makes it safe to render inline while the user is working.
