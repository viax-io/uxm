# Tag

A read-only status pill — six semantic palettes (`accent` / `success` / `warning` / `danger` / `info` / `neutral`) crossed with two size presets (`small` / `medium`), optionally prefixed by a leading icon.

`Tag` renders an `<span className="uxm-tag uxm-tag--{type} uxm-tag--{size}">` containing an optional icon span and a label span. Colour scheme is type-driven (background + border + text triplet per semantic group). Sizing is preset-driven: each size has its own padding / font / gap / icon-size knobs, and the modifier selector uses a double-class (`.uxm-tag.uxm-tag--small`) to keep specificity above any single-class `.uxm-tag` override. There is no interactive surface — `Tag` is purely presentational.

## Usage

```tsx
import { Tag } from '@viax.io/uxm';
import { Icon } from '@viax.io/uxm';

function Example() {
  return (
    <>
      <Tag type="success">Live</Tag>
      <Tag type="warning" size="small" iconLeft={<Icon glyph="alert-triangle" />}>
        Pending review
      </Tag>
      <Tag type="info">12 updates</Tag>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Label content. |
| `type` | `'accent' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | `'neutral'` | Semantic palette. Each value flips the background/border/text trio. |
| `size` | `'small' \| 'medium'` | `'medium'` | Preset density. `medium` is the standalone tag; `small` is the tighter preset for dense contexts (e.g. status pills inside a data-table row). |
| `iconLeft` | `ReactNode` | – | Optional leading icon. Rendered inside an `aria-hidden` span. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| `style` | `CSSProperties` | – | Inline style on the rendered tag. Used by editor previews to project draft `--uxm-tag-*` overrides. |

The `TagType` and `TagSize` unions are exported for consumer-side helpers.

## CSS variables

### Shared

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-tag-border-radius` | – | `999px` | Pill radius (both sizes). |
| `--uxm-tag-font-weight` | – | `500` | Label font weight (both sizes). |

### Per type

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-tag-accent-bg` | `--color-accent-subtle` | – | `accent` background. |
| `--uxm-tag-accent-border` | `--color-accent-subtle` | – | `accent` border. |
| `--uxm-tag-accent-text` | `--color-accent-bold` | – | `accent` text. |
| `--uxm-tag-success-bg` | `--color-success-bg` | – | `success` background. |
| `--uxm-tag-success-border` | `--color-success-border` | – | `success` border. |
| `--uxm-tag-success-text` | `--color-success-text` | – | `success` text. |
| `--uxm-tag-warning-bg` | `--color-warning-bg` | – | `warning` background. |
| `--uxm-tag-warning-border` | `--color-warning-border` | – | `warning` border. |
| `--uxm-tag-warning-text` | `--color-warning-text` | – | `warning` text. |
| `--uxm-tag-danger-bg` | `--color-danger-bg` | – | `danger` background. |
| `--uxm-tag-danger-border` | `--color-danger-border` | – | `danger` border. |
| `--uxm-tag-danger-text` | `--color-danger-text` | – | `danger` text. |
| `--uxm-tag-info-bg` | `--color-info-bg` | – | `info` background. |
| `--uxm-tag-info-border` | `--color-info-border` | – | `info` border. |
| `--uxm-tag-info-text` | `--color-info-text` | – | `info` text. |
| `--uxm-tag-neutral-bg` | `--color-surface-alt` | – | `neutral` background. |
| `--uxm-tag-neutral-border` | `--color-border` | – | `neutral` border. |
| `--uxm-tag-neutral-text` | `--color-text-muted` | – | `neutral` text. |

### Per size

| Variable | Default | Affects |
|----------|---------|---------|
| `--uxm-tag-small-font-size` | `11px` | `small` font size. |
| `--uxm-tag-small-padding-x` | `8px` | `small` inline padding. |
| `--uxm-tag-small-padding-y` | `2px` | `small` block padding. |
| `--uxm-tag-small-gap` | `6px` | `small` icon/label gap. |
| `--uxm-tag-small-icon-size` | `12px` | `small` icon dimensions. |
| `--uxm-tag-medium-font-size` | `13px` | `medium` font size. |
| `--uxm-tag-medium-padding-x` | `12px` | `medium` inline padding. |
| `--uxm-tag-medium-padding-y` | `4px` | `medium` block padding. |
| `--uxm-tag-medium-gap` | `8px` | `medium` icon/label gap. |
| `--uxm-tag-medium-icon-size` | `16px` | `medium` icon dimensions. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-accent-subtle` | Accent / Accent Subtle | `accent` background + border. |
| `--color-accent-bold` | Accent / Accent Bold | `accent` text. |
| `--color-success-bg` | Semantic / Success Bg | `success` background. |
| `--color-success-border` | Semantic / Success Border | `success` border. |
| `--color-success-text` | Semantic / Success Text | `success` text. |
| `--color-warning-bg` | Semantic / Warning Bg | `warning` background. |
| `--color-warning-border` | Semantic / Warning Border | `warning` border. |
| `--color-warning-text` | Semantic / Warning Text | `warning` text. |
| `--color-danger-bg` | Semantic / Danger Bg | `danger` background. |
| `--color-danger-border` | Semantic / Danger Border | `danger` border. |
| `--color-danger-text` | Semantic / Danger Text | `danger` text. |
| `--color-info-bg` | Semantic / Info Bg | `info` background. |
| `--color-info-border` | Semantic / Info Border | `info` border. |
| `--color-info-text` | Semantic / Info Text | `info` text. |
| `--color-surface-alt` | Surfaces / Surface Alt | `neutral` background. |
| `--color-border` | Borders / Border | `neutral` border. |
| `--color-text-muted` | Text / Text Muted | `neutral` text. |

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Type: `accent` | `type="accent"` | Subtle green background, accent-bold text. |
| Type: `success` | `type="success"` | Green semantic trio. |
| Type: `warning` | `type="warning"` | Amber semantic trio. |
| Type: `danger` | `type="danger"` | Red semantic trio. |
| Type: `info` | `type="info"` | Blue semantic trio. |
| Type: `neutral` | `type="neutral"` (default) | Muted surface + border. |
| Size: `small` | `size="small"` | Compact padding, 11px font, 12px icon. |
| Size: `medium` | `size="medium"` (default) | Standard padding, 13px font, 16px icon. |

## Accessibility

- Renders an `<span>` — `Tag` is non-interactive. Consumers needing a removable/clickable chip should compose `Tag` inside a `<button>` and supply their own affordance.
- `iconLeft` is wrapped in `aria-hidden="true"`; pair the icon with text so meaning isn't lost to assistive tech.
- Semantic types rely on colour — pair the `type` palette with text that names the state (e.g. `"Danger"`, `"Pending"`) so colour-blind users still get the signal.
- `user-select: none` is applied to the tag body so accidental selection doesn't disrupt copy/paste in dense rows. Consumers needing selectable label text should override this.
