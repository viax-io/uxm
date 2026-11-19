# Thumbnail

A bounded image frame with an automatic icon fallback when no source is provided or the image fails to load.

`Thumbnail` renders a `<div className="uxm-thumbnail uxm-thumbnail--{fit}">`. When `src` is set and the `<img>` does not fail, the image fills the frame using `object-fit: cover` or `contain`. Otherwise an `Icon glyph="image"` (or consumer-supplied `fallback`) renders inside an `aria-hidden` placeholder span.

The frame is square by default (`--uxm-thumbnail-size` drives both width and height). `--uxm-thumbnail-width` / `--uxm-thumbnail-height` change either side, and `aspectRatio` lets the height follow the width. The placeholder glyph is 45% of the frame's shorter side, so it stays in proportion whatever the size is set in.

**Failures are caught, even before hydration.** On a server-rendered page the browser can load or fail the `<img>` before React attaches `onError`. After mount, and on every new `src`, the component asks the image whether it already finished, so a fast failure still shows the placeholder rather than the browser's broken-image mark. A failure belongs to the address that failed: a new `src` gets a fresh try, with no `key={src}`.

## Usage

```tsx
import { Thumbnail } from '@viax.io/uxm';

function Example() {
  return (
    <>
      <Thumbnail src="/avatar.png" alt="Sam Brown" fit="cover" />
      <Thumbnail src="/logo.svg" alt="Acme Corp" fit="contain" />
      <Thumbnail />{/* placeholder fallback */}
      {/* A card's picture: as wide as the card, 16:9, no wrapper. */}
      <Thumbnail
        src="/chair.jpg"
        alt="Oak chair"
        aspectRatio="16 / 9"
        style={{ '--uxm-thumbnail-width': '100%' } as React.CSSProperties}
      />
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
| `fallback` | `ReactNode` | `<Icon glyph="image" />` | Override the placeholder content shown when no image is rendered. A bare `svg` here is sized like the built-in glyph. |
| `aspectRatio` | `string \| number` | – | Gives the frame a shape (`'16 / 9'`, `1.5`): the height follows the width (`--uxm-thumbnail-width`, default the size). Sets `--uxm-thumbnail-aspect-ratio` and the `uxm-thumbnail--ratio` modifier. |
| `onStatusChange` | `(status: ThumbnailStatus) => void` | – | Called with `'loading'`, `'loaded'` or `'error'` as the image comes in, once per status per `src`, including a load or failure that happened before hydration. Not called without a `src`. Use it to render something other than the placeholder when the image fails. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

The `ThumbnailFit` (`'cover' \| 'contain'`) and `ThumbnailStatus` (`'loading' \| 'loaded' \| 'error'`) unions are exported.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-thumbnail-size` | – | `48px` | Frame width AND height (square). |
| `--uxm-thumbnail-width` | – | the size | Frame width. `100%` fills the parent when the parent's width is definite. The frame is a size container with no intrinsic size, so `auto`, or a percentage inside a parent that shrinks to fit its content (inline-block, an auto-width flex or grid item, an absolutely positioned box), collapses it to zero. |
| `--uxm-thumbnail-height` | – | the size | Frame height. Ignored with `aspectRatio`, where the height follows the width. |
| `--uxm-thumbnail-aspect-ratio` | – | unset | Set by the `aspectRatio` prop; read only with the `uxm-thumbnail--ratio` modifier. |
| `--uxm-thumbnail-placeholder-size` | – | 45% of the frame's shorter side | Placeholder glyph size (the built-in icon, or a bare `svg` `fallback`; a wrapped fallback keeps its own size). Set a length to fix it, e.g. `40px`. The default uses container query units (Chrome 105, Safari 16, Firefox 110); older browsers leave the icon at its own size. |
| `--uxm-thumbnail-background-color` | `--color-card` | – | Frame background (visible when image is loading or contained). |
| `--uxm-thumbnail-border-color` | `--color-border` | – | Frame border colour. |
| `--uxm-thumbnail-border-width` | – | `2px` | Frame border width. Give it a unit (`0px`, not `0`): the placeholder glyph's size calculation reads it. |
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
| Placeholder (failed) | the image fails, before or after hydration | Same as no-src. The failure lasts until `src` changes: any new `src`, including one that failed before, renders the image again. |
| Shaped | `aspectRatio` set | Width from `--uxm-thumbnail-width` (default the size), height from the ratio. |

## Accessibility

- The `<img>` receives the `alt` prop verbatim — supply a descriptive string for content images, or an empty `alt=""` for decorative ones (the component defaults `alt` to `""` when omitted).
- The placeholder span is `aria-hidden`; if `fallback` carries meaning (e.g. initials), wrap the entire `Thumbnail` with an `aria-label` on the parent.
- Image errors are caught and the placeholder is rendered. To react to a failure (render an icon tile, or nothing), use `onStatusChange` rather than loading the image a second time.
- The frame is non-interactive; if you make it clickable, wrap the whole `Thumbnail` in a `<button>` or `<a>` and supply an accessible label.
