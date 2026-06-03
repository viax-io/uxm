# ErrorPage

A full-page error layout — optional icon tile, optional large code (e.g. `"404"`), required `<h1>` title, optional message, and up to two action slots.

`ErrorPage` renders a vertically-centered flex column inside a `<div>` with generous 64×24 padding. The icon (when present) sits in a 56×56 rounded tile with an accent-subtle background; the code uses an 88px, weight-700 text-subtle headline; the title is a real `<h1>` element; the message is a muted paragraph capped at `28rem`; the action row uses wrap-friendly flex with a 12px gap. Use for top-level `404` / `500` / lost-connection screens, not inline empty states (`EmptyState` is the inline counterpart).

## Usage

```tsx
import { ErrorPage, ButtonPrimary, ButtonGhost, Icon } from '@viax/uxm';

function NotFound() {
  return (
    <ErrorPage
      icon={<Icon glyph="alert" size={28} />}
      code="404"
      title="Page not found"
      message="The page you were looking for doesn't exist or has been moved."
      primaryAction={<ButtonPrimary>Go home</ButtonPrimary>}
      secondaryAction={<ButtonGhost>Contact support</ButtonGhost>}
    />
  );
}
```

## Props

### `ErrorPageProps`

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` — `title` is shadowed because the component repurposes it as a `ReactNode` heading. All other div attributes flow through to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | – | **Required.** Rendered into the `<h1>` element. |
| `code` | `ReactNode` | – | Big numeric/textual code rendered above the title (e.g. `"404"`). |
| `icon` | `ReactNode` | – | Optional icon rendered in an accent-subtle tile above the code. |
| `message` | `ReactNode` | – | Supporting copy below the title (muted, max-width `28rem`). |
| `primaryAction` | `ReactNode` | – | Typically a `ButtonPrimary`. Rendered in the actions row. |
| `secondaryAction` | `ReactNode` | – | Typically a `ButtonGhost` or `ButtonSecondary`. Rendered next to the primary. |
| `className` | `string` | – | Merged onto the root via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

ErrorPage has no `--uxm-error-page-*` custom properties — all colors and sizes are hardcoded. Theming is achieved exclusively by overriding the `--color-*` tokens below at a higher scope.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-accent-subtle` | Accent / Accent Subtle | Icon tile background. |
| `--color-accent-bold` | Accent / Accent Bold | Icon tile foreground. |
| `--color-text-subtle` | Text / Text Subtle | Code (large numeric headline). |
| `--color-text` | Text / Text | Title (`<h1>`). |
| `--color-text-muted` | Text / Text Muted | Message paragraph. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Code-less | `code` omitted | Title is the topmost text element (under the icon if present). |
| Icon-less | `icon` omitted | No tile rendered; code/title flow from the top of the column. |
| Single action | only `primaryAction` (or only `secondaryAction`) provided | Actions row renders with one slot; wraps on narrow viewports. |
| No actions | both action slots omitted | Actions row is not rendered at all. |
| Message-less | `message` omitted | No paragraph; title is the final text element above any actions. |

## Accessibility

- Renders an `<h1>` for the title — page-level heading semantics, suitable for a top-level error route.
- The icon container is `aria-hidden="true"` — purely decorative.
- The `code` is rendered as a `<p>` element, not a heading — assistive tech treats it as supporting text rather than a second heading; pair semantically with the `<h1>` title.
- No live-region wiring — if the component mounts asynchronously (e.g. after a failed fetch), announce the change via a parent `aria-live` region.
- Action slots are pass-through containers — the action elements themselves (e.g. `ButtonPrimary`) own focus, keyboard, and label semantics.
- The component does not auto-focus any element on mount — consider focusing the primary action explicitly if the page renders mid-flow.
