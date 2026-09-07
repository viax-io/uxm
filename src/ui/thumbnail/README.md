# Thumbnail

A bounded, square image frame with an automatic icon fallback when no source is provided or the image fails to load.

`Thumbnail` renders a `<div className="uxm-thumbnail uxm-thumbnail--{fit}">`. When `src` is set and the `<img>` does not error, the image fills the frame using `object-fit: cover` or `contain`. Otherwise an `Icon glyph="image"` (or consumer-supplied `fallback`) renders inside an `aria-hidden` placeholder span. The component is square — `--uxm-thumbnail-size` drives both width and height — and the placeholder glyph scales to 45% of that size.

## Usage

```tsx
import { Thumbnail } from '@viax.io/uxm';

function Example() {
  return (
    <>
      <Thumbnail src="/avatar.png" alt="Sam Brown" fit="cover" />
      <Thumbnail src="/logo.svg" alt="Acme Corp" fit="contain" />
      <Thumbnail />{/* placeholder fallback */}
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | – | Image source. When omitted (or when the image errors), the fallback renders. |
| `alt` | `string` | `''` | Forwarded to the `<img>` element. |
| `fit` | `'cover' \| 'contain'` | `'cover'` | Image `object-fit` mode. `cover` crops; `contain` letterboxes. |
| `fallback` | `ReactNode` | `<Icon glyph="image" />` | Override the placeholder content shown when no image is rendered. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

The `ThumbnailFit` union (`'cover' \| 'contain'`) is exported.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-thumbnail-size` | – | `48px` | Frame width AND height (square). Also scales the placeholder glyph (45% of size). |
| `--uxm-thumbnail-background-color` | `--color-card` | – | Frame background (visible when image is loading or contained). |
| `--uxm-thumbnail-border-color` | `--color-border` | – | Frame border colour. |
| `--uxm-thumbnail-border-width` | – | `2px` | Frame border width. |
| `--uxm-thumbnail-border-radius` | – | `12px` | Frame corner radius. |
| `--uxm-thumbnail-placeholder-color` | `--color-text-subtle` | – | Fallback icon colour. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Frame background. |
| `--color-border` | Borders / Border | Frame border. |
| `--color-text-subtle` | Text / Text Subtle | Fallback icon colour. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Image (cover) | `src` set + `fit="cover"` (default) | Image fills frame, cropping overflow. |
| Image (contain) | `src` set + `fit="contain"` | Image fits within frame, may show background bars. |
| Placeholder (no src) | `src` omitted | `aria-hidden` span renders the fallback icon, centred. |
| Placeholder (errored) | `<img onError>` fires | Same as no-src; the `errored` state latches so React stops re-attempting. |

## Accessibility

- The `<img>` receives the `alt` prop verbatim — supply a descriptive string for content images, or an empty `alt=""` for decorative ones (the component defaults `alt` to `""` when omitted).
- The placeholder span is `aria-hidden`; if `fallback` carries meaning (e.g. initials), wrap the entire `Thumbnail` with an `aria-label` on the parent.
- Image errors are silently caught and the placeholder is rendered — no error event surfaces to the consumer. Wrap a parent `onError` listener on the `<img>` (via `...rest` is **not** sufficient here; the inner `<img>` doesn't accept arbitrary spread) if you need to react to load failure.
- The frame is non-interactive; if you make it clickable, wrap the whole `Thumbnail` in a `<button>` or `<a>` and supply an accessible label.
