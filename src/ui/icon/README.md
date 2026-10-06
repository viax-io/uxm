# Icon

A glyph-by-name SVG renderer backed by the central icon registry (`@/lib/icons`). Looks up the glyph definition, picks stroke or fill mode based on the registry entry, and emits an inline `<svg>` sized via the `size` prop.

`Icon` is the single primitive every other UXM component reaches for when it needs an icon — `IconButton`, `IconTile`, `Chip`, `Alert`, etc. all render it as a child. The `glyph` prop is a string key into the registry; unknown glyphs render `null` instead of throwing, so a missing icon does not break the surrounding layout. The component is purely structural — colour comes from `currentColor` on the parent.

## Usage

```tsx
import { Icon } from '@viax.io/uxm';

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
| `glyph` | `IconName \| (string & {})` | – | **Required.** Registry key (e.g. `"check"`, `"chevron-down"`). The union drives autocomplete; any string still type-checks, so computed names and ids added via `registerIcons` compile. Unknown keys render `null`. |
| `size` | `number` | `24` | Width and height in pixels. Applied as both `width` and `height` attributes on the `<svg>`. |
| `strokeWidth` | `number` | `1.75` | Stroke width for outline glyphs. Ignored for filled glyphs (which use `fill="currentColor"`). |
| `className` | `string` | – | Merged with `uxm-icon` via `cn`. |
| _(any native SVG attribute)_ | – | – | Spread onto the root `<svg>`. |

The render mode (stroke vs fill) is decided by the registry entry's `filled` flag, not a prop. Outline glyphs use `stroke="currentColor"` + `fill="none"`; filled glyphs use `fill="currentColor"` + `stroke="none"`. Both modes use `stroke-linecap="round"` and `stroke-linejoin="round"`.

The registry set is **currently all-outline** — no glyph sets `filled: true`, so every icon responds to `strokeWidth`. The `filled` mode and the row below remain as a documented extension point for a future glyph that can't be expressed as a stroke (e.g. a solid brand mark).

## Extending the set

The registry is a module-global array. `registerIcons` is the supported way to add
to it, because it keeps three things in step that would otherwise drift:

```ts
import { registerIcons } from '@viax.io/uxm';

registerIcons([
  { id: 'rocket', label: 'Rocket', path: 'M…', keywords: ['launch', 'deploy'] },
]);
```

`label` is a **name** — one human-readable thing the glyph is called, with at most a
single disambiguator in parentheses, matching the set's existing style (`Cog (6 Tooth)`,
`Archive (Empty)`). Synonyms go in **`keywords`**, which the studio's icon search matches
alongside `id` and `label`. That is how a glyph stays findable under the name it carries
in another icon set — `no-symbol` answers to `ban`, `paper-airplane` to `send` — without
the label turning into a keyword list.

| Export | What it is |
|---|---|
| `ICONS` | `IconDef[]` — the registry itself, in order. |
| `ICON_OPTIONS` | `{ value, label }[]` for a picker. **Mutated in place** by `registerIcons`, so a consumer holding a reference (the studio registry does, at module scope) sees additions without re-importing. |
| `ICON_IDS` | Const tuple of the built-in ids. |
| `IconName` | Literal union of `ICON_IDS` — use it to narrow your own props. |
| `getIcon(id)` | Looks the id up in `ICONS`. Reads the array live, so it cannot go stale. |
| `IconDef.keywords` | Optional extra search terms. Not rendered anywhere — search only. |
| `registerIcons(defs)` | Adds or replaces; returns how many ids it **replaced**. |

Notes worth knowing before you call it:

- **An existing id is replaced in place**, not appended, so swapping a built-in glyph
  for your own does not leave a duplicate row in the picker. The return value is the
  replacement count — assert it is `0` if you only meant to add.
- **Call it once at start-up**, before anything renders. It mutates shared state;
  there is no re-render signal, so glyphs registered after a component has mounted
  will not appear until that component next renders for some other reason.
- **`IconName` cannot include runtime registrations.** Types are static; the union
  covers the built-ins only. That is why `glyph` stays assignable from `string`.
- **Pushing onto `ICONS` directly is out of contract.** `getIcon` will still find what
  you put there — it reads the array live — but nothing can keep `ICON_OPTIONS` in sync,
  which is the stale-picker bug this API exists to remove.
- Two bundled copies of the package mean two registries. That is a packaging problem,
  not something the API can paper over.

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
