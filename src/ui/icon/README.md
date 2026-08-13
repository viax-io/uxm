# Icon

A glyph-by-name SVG renderer backed by the central icon registry (`@/lib/icons`). Looks up the glyph definition, picks stroke or fill mode based on the registry entry, and emits an inline `<svg>` sized via the `size` prop.

`Icon` is the single primitive every other UXM component reaches for when it needs an icon — `IconButton`, `IconTile`, `Chip`, `Alert`, etc. all render it as a child. The `glyph` prop is a string key into the registry; unknown glyphs render `null` instead of throwing, so a missing icon does not break the surrounding layout. The component is purely structural — colour comes from `currentColor` on the parent.

## Usage

```tsx
import { Icon } from '@viax/uxm';

function Example() {
  return (
    <>
      <Icon glyph="check" />
      <Icon glyph="close" size={16} strokeWidth={2} />
      <span style={{ color: 'var(--color-accent-bold)' }}>
        <Icon glyph="arrow-right" size={20} />
      </span>
    </>
  );
}
```

## Props

### `IconProps`

Extends `Omit<SVGAttributes<SVGSVGElement>, 'children'>` — any standard SVG attribute (style, className, data-*, aria-*, onClick) is forwarded to the root `<svg>`. `children` is not accepted; path data comes exclusively from the registry entry.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `glyph` | `string` | – | **Required.** Registry key (e.g. `"check"`, `"chevron-down"`). Unknown keys render `null`. |
| `size` | `number` | `24` | Width and height in pixels. Applied as both `width` and `height` attributes on the `<svg>`. |
| `strokeWidth` | `number` | `1.75` | Stroke width for outline glyphs. Ignored for filled glyphs (which use `fill="currentColor"`). |
| `className` | `string` | – | Merged with `uxm-icon` via `cn`. |
| _(any native SVG attribute)_ | – | – | Spread onto the root `<svg>`. |

The render mode (stroke vs fill) is decided by the registry entry's `filled` flag, not a prop. Outline glyphs use `stroke="currentColor"` + `fill="none"`; filled glyphs use `fill="currentColor"` + `stroke="none"`. Both modes use `stroke-linecap="round"` and `stroke-linejoin="round"`.

## CSS variables

The component itself defines no custom properties. Sizing flows through the `size` prop (rendered as SVG attributes), and colour inherits via `currentColor`. The only stylesheet rule is `display: inline-block` on `.uxm-icon`.

## Design tokens (MODO-configurable)

Icon reads no colour tokens directly — every glyph paints with `currentColor`, inheriting the `color` property of whatever element wraps it. To theme an icon, set `color` on the parent (which may itself reference a `--color-*` token), e.g. `color: var(--color-accent-bold)`.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Outline glyph | Registry entry has `filled: false` | `stroke="currentColor"`, `fill="none"`, rounded line caps. |
| Filled glyph | Registry entry has `filled: true` | `fill="currentColor"`, `stroke="none"`, `strokeWidth` is ignored. |
| Unknown glyph | `getIcon(glyph)` returns `undefined` | Renders `null` (nothing emitted). |
| Multi-path glyph | Registry entry uses `path` with `M ` separators | Path is split on `M ` and emitted as multiple `<path>` children. |
| Raw-body glyph | Registry entry uses `body` | Inner SVG markup is injected via `dangerouslySetInnerHTML`. |

## Accessibility

- **Decorative by default.** Without an explicit `aria-label` the component renders `aria-hidden="true"`, keeping the glyph out of the accessibility tree — so an icon sitting next to visible text (an icon+text button, a menu row, a banner title) contributes nothing to the parent's accessible name. (Before this, the registry entry's `label` was auto-applied and leaked into parent names — a Publish button announced as "Cursor Arrow Rays (Publish) Publish".)
- **Pass `aria-label` to make a standalone icon informative** — the component then sets `role="img"` alongside it. An explicit `aria-hidden` in the spread props always wins, both ways.
- Icon-only interactive elements must carry their own name on the *control* (`IconButton` / `ButtonIcon` require `aria-label` at the type level) — never rely on the inner icon for it.
- Because content paints with `currentColor`, contrast is entirely the responsibility of the parent. Verify against your surface, especially for muted icons on tinted backgrounds.
- Raw-body glyphs are injected via `dangerouslySetInnerHTML` from the registry. The registry is a build-time module — it does not accept untrusted input — but be aware of this if you ever expose glyph contributions to end users.
