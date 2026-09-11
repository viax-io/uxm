# List

A bordered, rounded container (`List`) with horizontally divided rows (`ListItem`) that can be display-only, button-interactive, or anchor-interactive depending on the props passed to each item.

`List` is a thin `<div>` wrapper that gives the group its card surface, border, and overflow clipping. `ListItem` decides its own element type at render time: it becomes an `<a>` if `href` is set, a `<button>` if `interactive` is true without an `href`, and a static `<div>` otherwise. State styling (hover / focus / active / disabled) is wired only to the interactive element types so display-only divs stay inert. Each item has two mutually exclusive leading slots — `icon` (wrapped in an accent `IconTile`) and `media` (rendered as-is, for a thumbnail / avatar / bare `<img>`) — plus a `value` sub-line under the title and a `trailing` node (meta text, chevron, custom node).

## Usage

```tsx
import { List, ListItem, Icon } from '@viax.io/uxm';

function Example() {
  return (
    <List>
      <ListItem
        icon={<Icon glyph="user" />}
        value="Owner"
        trailing="Today"
      >
        Alice
      </ListItem>
      <ListItem
        interactive
        active
        trailing={<Icon glyph="chevron-right" />}
        onClick={() => openSettings()}
      >
        Settings
      </ListItem>
      <ListItem href="/docs" trailing={<Icon glyph="arrow-up-right" />}>
        Documentation
      </ListItem>
    </List>
  );
}
```

### Media rows

Pass `media` instead of `icon` when the leading element is a picture rather than a glyph — a product thumbnail, an avatar, a file preview. It renders as-is, so the media keeps its own frame and radius while the row keeps the `<button>` semantics, hover / focus / `active` state and layout:

```tsx
import { List, ListItem, Thumbnail } from '@viax.io/uxm';

<List>
  {products.map((p) => (
    <ListItem
      key={p.id}
      interactive
      active={p.id === selectedId}
      onClick={() => select(p)}
      // alt="" — the row's title already names it; see Accessibility below
      media={<Thumbnail src={p.thumbnailUrl} alt="" />}
      value={
        <>
          <span>{p.sku}</span>
          <span>{p.categories.join(' · ')}</span>
        </>
      }
      trailing={p.listPrice}
    >
      {p.name}
    </ListItem>
  ))}
</List>
```

`value` is a `ReactNode`, so a two-line sub-label needs no extra prop — the `.uxm-list-item__content` column stacks whatever it is given.

The slot forwards its size into `--uxm-thumbnail-size` / `--uxm-avatar-size`, so a `Thumbnail` or `Avatar` sizes itself through its own variables (frame, radius and inner glyph scale together) rather than being clamped from outside; anything else — a bare `<img>`, an `<svg>`, your own node — is stretched to fill the box.

## Props

### `ListProps`

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute (id, style, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** `ListItem` elements (or any custom row content). |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

### `ListItemProps`

`ListItem` accepts the union `ListItemProps & (AnchorRest | ButtonRest | DivRest)` — the rest props are typed to match whichever element is finally rendered. Pick the right shape by passing `href` (anchor), `interactive` (button), or neither (static div).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Primary label. |
| `icon` | `ReactNode` | – | Leading icon — typically an `<Icon />` from `@viax.io/uxm`. Rendered inside a shared `IconTile` (accent-filled rounded tile); the tile owns the glyph size (0.6× the tile via `--uxm-list-item-icon-size`), so any `size` on the passed `<Icon />` is ignored. |
| `media` | `ReactNode` | – | Leading media rendered **as-is** — no `IconTile`, no accent fill. For a `<Thumbnail />`, `<Avatar />` or bare `<img>`. Mutually exclusive with `icon`: when both are passed, `media` wins. The slot is a square box of `--uxm-list-item-media-size` (36px); `Thumbnail` / `Avatar` get that size forwarded into their own size vars, everything else is stretched to fill. ⚠️ The slot sits **inside** the row's `<button>` / `<a>`, so a described image joins the row's accessible name — pass `alt=""` for media the title already names. Shadows the native `media` attribute of `<a>` on the anchor form of the row. |
| `value` | `ReactNode` | – | Secondary text shown under the title. Skipped if `undefined` / `null`. Takes any node, so a multi-line sub-label needs no extra prop. |
| `trailing` | `ReactNode` | – | Trailing content — meta text, chevron, or custom node. |
| `interactive` | `boolean` | `false` | Render as a clickable element (`<button>` by default, or `<a>` if `href` also set). |
| `active` | `boolean` | `false` | Adds the `--active` modifier; also forwards `aria-pressed` on the button form. Only meaningful when interactive. |
| `disabled` | `boolean` | `false` | Disables interaction. Maps to native `disabled` on `<button>`, `aria-disabled` + `tabIndex={-1}` on `<a>`, or `aria-disabled` on `<div>`. |
| `href` | `string` | – | Navigate on click. Implies `interactive` and forces the element to `<a>`. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(rest)_ | `AnchorRest \| ButtonRest \| DivRest` | – | Spread onto the chosen element; the prop type narrows to match. |

## CSS variables

Only `ListItem` exposes per-instance variables; structural styling (card background, divider, padding) is fixed.

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-list-item-value-color` | `--color-text-muted` | – | Sub-line (`value`) text colour. |
| `--uxm-list-item-value-size` | – | `12px` | Sub-line font size. |
| `--uxm-list-item-icon-bg` | `--color-accent` | – | Leading `IconTile` background. |
| `--uxm-list-item-icon-color` | `--color-card` | – | Leading `IconTile` glyph colour. |
| `--uxm-list-item-icon-size` | – | `24px` | `IconTile` box size (glyph is 0.6× this). |
| `--uxm-list-item-icon-radius` | – | `6px` | `IconTile` corner radius. |
| `--uxm-list-item-media-size` | – | `36px` | Leading `media` slot box (width **and** height). Also forwarded into `--uxm-thumbnail-size` / `--uxm-avatar-size` / `--uxm-avatar-small-size` for the media node, so those atoms scale with the row. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | List container background; leading icon-tile glyph colour (default). |
| `--color-border` | Borders / Border | Container border + per-row divider. |
| `--color-text` | Text / Text | Row title colour. |
| `--color-text-muted` | Text / Text Muted | Trailing text and `value` sub-line colour. |
| `--color-accent` | Accent / Accent | Leading icon-tile background (default). |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Static row | No `href`, `interactive` falsy | Renders as `<div>` with no hover / focus state. |
| Button row | `interactive` true, no `href` | Renders as `<button type="button">` — emits clicks; carries `aria-pressed` when `active`. |
| Anchor row | `href` set | Renders as `<a href={href}>`; if `disabled`, also `aria-disabled="true"` and `tabIndex={-1}`. |
| Active | `active` prop true | Adds `uxm-list-item--active`; state styling defined in the consumer / registry layer. |
| Disabled | `disabled` prop true | `<button>`: native `disabled` (removed from tab order). `<a>`: `aria-disabled` + non-tabbable. `<div>`: `aria-disabled` only. |
| Last row | Structural | Bottom divider removed via `:last-child` so it doesn't double the container border. |
| Icon leading | `icon` set, no `media` | Glyph inside the accent `IconTile`. |
| Media leading | `media` set | Node rendered as-is in a square `--uxm-list-item-media-size` box; `icon` is ignored if also passed. |
| No value | `value` is `undefined`/`null` | Sub-line span not rendered; title sits alone. |

## Accessibility

- **`media` is part of the row's accessible name.** The slot renders inside the `<button>` / `<a>`, so an image with a real `alt` is concatenated ahead of the title: `media={<Thumbnail alt="Bolt M6" />}` on a row titled `Bolt M6` with `value="SKU-9"` announces "Bolt M6 Bolt M6 SKU-9". Pass `alt=""` whenever the title already names the thing — which is the usual case for a product or file row. Only describe the media when it carries information the row's text does not. (The `icon` slot cannot cause this: `Icon` renders `aria-hidden="true"` unless given a label.)
- `List` is a presentational container — not announced as a list to screen readers. If list semantics matter (e.g. counting rows), wrap in `<ul role="list">` at the consumer level or add `role="list"` to the root via spread props.
- `ListItem` chooses the right native element for the interaction: `<a>` for navigation, `<button>` for in-place actions, `<div>` for read-only rows. This avoids the "div with onClick" trap.
- Active button rows expose `aria-pressed={active}` so toggle semantics are announced. For single-select lists, prefer `aria-current` (passed via the spread props) over `aria-pressed`.
- Anchor disabled state sets `aria-disabled="true"` + `tabIndex={-1}` but **does not** strip `href`. To fully block navigation, also intercept `onClick` (`e.preventDefault()`) at the consumer.
- Focus styling on interactive rows falls back to the browser default; pair with a global focus-ring rule for visible focus on light surfaces.
- Title overflow is not clipped by default — long labels wrap. If you need single-line truncation, pass it via custom `className` styles.
