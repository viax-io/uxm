# List

A bordered, rounded container (`List`) with horizontally divided rows (`ListItem`) that can be display-only, button-interactive, or anchor-interactive depending on the props passed to each item.

`List` is a thin `<div>` wrapper that gives the group its card surface, border, and overflow clipping — or, with `variant="plain"`, gives it none of those. `ListItem` decides its own element type at render time: it becomes an `<a>` if `href` is set, a `<button>` if `interactive` is true without an `href`, and a static `<div>` otherwise. State styling (hover / focus / active / disabled) is wired only to the interactive element types so display-only divs stay inert. Each item has two mutually exclusive leading slots — `icon` (wrapped in an accent `IconTile`) and `media` (rendered as-is, for a thumbnail / avatar / bare `<img>`) — plus a `value` sub-line under the title and a `trailing` node (meta text, chevron, custom node).

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
| `variant` | `'card' \| 'plain'` | `'card'` | Container presentation. `card` keeps the bordered, rounded surface. `plain` drops the background, border and radius — for a list **already inside a surface** (a flexpane body, a card body, a disclosure section), where a card container reads as a card inside a card. It also releases `overflow` to `visible`: with no radius to clip to, the card's clip would only crop what a row renders **outside** the container box — an overhanging corner control, a focus ring with a positive offset — which under `card` is neither painted nor clickable. Row styling and every `--uxm-list-item-*` knob are identical in both. |
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
| `selected` | `boolean` | – | Controlled selection. Passing this **or** `onSelectedChange` puts the row in **selectable** mode: it renders as a `<label>` around a real checkbox, so activating anywhere on the row toggles it natively. Distinct from `active`, which is a toggle button (`aria-pressed`) — the wrong semantic for one member of a checkable set. Mutually exclusive with `interactive` / `href`; selectable wins, with a dev warning. |
| `onSelectedChange` | `(next: boolean, e: ChangeEvent<HTMLInputElement>) => void` | – | Toggle handler for selectable mode. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(rest)_ | `AnchorRest \| ButtonRest \| DivRest` | – | Spread onto the chosen element; the prop type narrows to match. |

## Choosing a variant

`card` is right for a list standing on its own on a page ground. Reach for `plain` when the list is already on a surface — the two give a card-inside-a-card otherwise, and the nested border stops the row hover and dividers short of the surface's own gutters.

`plain` is purely subtractive: it paints nothing of its own, adds no token, and changes no row rule. The one thing it does beyond removing paint is release `overflow`. The card needs the clip so rows cannot spill past its radius; a plain list has no radius, so the clip's only remaining effect would be to crop what a row renders *outside* the container — an overhanging control, a positive-offset focus ring. Under `card` such an element is not merely hidden, it stops being hit-testable.

```tsx
// A list filling a flexpane body, bled out to the pane gutters
<List variant="plain" style={{ margin: '0 -24px', '--uxm-list-item-padding-x': '24px' }}>
  …
</List>
```

(The bleed itself comes from the margin on the `List` plus the row padding knob — rows are `width: 100%`, so they follow the container either way. That part works in both variants; what `plain` removes is the nested card around it.)

### Selectable rows

For "tick several, then commit" lists — a product picker, recipients, file selection:

```tsx
<List variant="plain">
  {products.map((p) => (
    <ListItem
      key={p.id}
      selected={picked.includes(p.id)}
      onSelectedChange={(on) => toggle(p.id, on)}
      media={<Thumbnail src={p.thumbnailUrl} alt="" />}
      value={p.sku}
      trailing={p.listPrice}
    >
      {p.name}
    </ListItem>
  ))}
</List>
```

The row is a real `<label>` wrapping a real `<input type="checkbox">`, so whole-row activation is the browser's — it works for pointer and keyboard, needs no ARIA of its own, and the row is deliberately **not** `aria-pressed`.

Two implementation notes worth knowing before restyling it:

- **The checkbox is `Checkbox`'s classes, not a nested `<Checkbox>`.** `Checkbox` is itself a `<label>`, and a `<label>` inside the row `<label>` is invalid HTML — Chrome tolerates it (measured: one `change` event either way) but the spec doesn't, and assistive tech isn't guaranteed to. Painting `uxm-checkbox__input` / `__box` keeps the box pixel-identical and re-tinted by the checkbox's own knobs. The trade is a coupling to those internals, which a test guards: if `Checkbox`'s DOM moves, `tests/list-item.test.tsx` fails rather than an unstyled box shipping.
- **Leading order is checkbox → `media`/`icon` → content → `trailing`**, so a selectable media row keeps the same leading grid as a non-selectable one.
- **The mode is controlled for the component's lifetime.** `checked` is `selected ?? false`, never a bare `undefined`, so deriving it from async data (`selected={data?.picked.includes(id)}`) cannot hand React an uncontrolled input that turns controlled when the data lands — which would warn, and would let the DOM own a tick made while loading instead of reporting it. A row with only `onSelectedChange` therefore stays unticked until you feed `selected` back.

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
| Card container | `variant` unset / `'card'` | `--color-card` background, border, radius, `overflow: hidden`. |
| Plain container | `variant="plain"` | No background, border or radius; `overflow: visible`, so a control a row hangs outside the container stays painted and clickable. Rows and dividers unchanged. |
| Selectable row | `selected` or `onSelectedChange` set | Renders as `<label>` around a checkbox; whole-row click toggles. Overrides `interactive` / `href`. |
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
