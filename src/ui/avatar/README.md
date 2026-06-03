# Avatar

A circular user identifier — renders either uppercase initials inside a tinted circle or a square-cropped image, with automatic fall-through to initials when the image fails to load.

`Avatar` is a single `<span>` with a BEM root and a `--{type}` modifier. Image mode mounts an `<img>` whose `onError` flips internal state and re-renders as text fallback. Initials are sliced to the first two characters and upper-cased. The size knob is exposed exclusively through a CSS variable (`--uxm-avatar-size`) so saved values reach production builds; live preview overrides via inline `width`/`height` still win via specificity.

## Usage

```tsx
import { Avatar } from '@viax/uxm';

function Example() {
  return (
    <>
      <Avatar type="text" initials="PA" alt="Pavlo A." />
      <Avatar type="image" src="/users/42.jpg" alt="Pavlo A." initials="PA" />
    </>
  );
}
```

When `type="image"` and `src` fails to load, the component automatically falls back to `initials` (if provided) — pass both for graceful degradation.

## Props

Extends `HTMLAttributes<HTMLSpanElement>` — any standard attribute (id, style, data-*, aria-*) is forwarded to the root `<span>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'text' \| 'image'` | `'text'` | Selects the render mode and the `--{type}` modifier class. |
| `initials` | `string` | – | Up to the first 2 characters are uppercased and shown. Also used as the image-failure fallback. |
| `src` | `string` | – | Image URL. Ignored when `type="text"`. |
| `alt` | `string` | – | Alt text for the `<img>`. Also drives the root's `aria-hidden` decision. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native span attribute)_ | – | – | Spread onto the root `<span>`. |

The root receives `aria-hidden="true"` when **neither** `alt` nor `initials` is provided — a purely decorative avatar is hidden from assistive tech.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-avatar-size` | – | `40px` | Square dimensions of the avatar (applied to both `width` and `height`). |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-highlight-cool` | Highlights / Highlight Cool | Background of the initials chip. |
| `--color-border` | Borders / Border | Border colour (defined but unused — `border-width` is `0`). |
| `--color-text` | Text / Text | Initials text colour. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Text mode | `type="text"` (or omitted) | Tinted circle with up to 2 uppercase initials at 16px / 600 weight. |
| Image mode (loaded) | `type="image"` + `src` resolves | `<img>` fills the circle (`object-fit: cover`); overflow is clipped by the radius. |
| Image mode (errored) | `<img>` `onError` fires | Falls back to the initials render path. |
| No content | `type="image"` with no `src` or after error & no `initials` | Empty circle (background-tinted). |
| Decorative | Neither `alt` nor `initials` provided | Root carries `aria-hidden="true"`. |

## Accessibility

- Root is a `<span>` — non-focusable and non-interactive by default. Wrap in a `<button>` or `<a>` if you need it to act as a control.
- Image alt: `<img>` always receives an `alt` attribute (defaults to `''` when omitted) so it never leaks the filename to screen readers.
- When neither a meaningful `alt` nor `initials` is set, the root is hidden from assistive tech via `aria-hidden="true"`.
- Initials alone do not identify a user to screen readers — pair with an `alt` (carried by the consumer wrapper) or render a visible name beside the avatar.
- No focus ring is defined; if you make the avatar interactive, add one in the wrapping control.
