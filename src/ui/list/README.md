# List

A bordered, rounded container (`List`) with horizontally divided rows (`ListItem`) that can be display-only, button-interactive, or anchor-interactive depending on the props passed to each item.

`List` is a thin `<div>` wrapper that gives the group its card surface, border, and overflow clipping. `ListItem` decides its own element type at render time: it becomes an `<a>` if `href` is set, a `<button>` if `interactive` is true without an `href`, and a static `<div>` otherwise. State styling (hover / focus / active / disabled) is wired only to the interactive element types so display-only divs stay inert. Each item has slots for a leading `icon`, a `value` sub-line under the title, and a `trailing` node (meta text, chevron, custom node).

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
| `value` | `ReactNode` | – | Secondary text shown under the title. Skipped if `undefined` / `null`. |
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
| No value | `value` is `undefined`/`null` | Sub-line span not rendered; title sits alone. |

## Accessibility

- `List` is a presentational container — not announced as a list to screen readers. If list semantics matter (e.g. counting rows), wrap in `<ul role="list">` at the consumer level or add `role="list"` to the root via spread props.
- `ListItem` chooses the right native element for the interaction: `<a>` for navigation, `<button>` for in-place actions, `<div>` for read-only rows. This avoids the "div with onClick" trap.
- Active button rows expose `aria-pressed={active}` so toggle semantics are announced. For single-select lists, prefer `aria-current` (passed via the spread props) over `aria-pressed`.
- Anchor disabled state sets `aria-disabled="true"` + `tabIndex={-1}` but **does not** strip `href`. To fully block navigation, also intercept `onClick` (`e.preventDefault()`) at the consumer.
- Focus styling on interactive rows falls back to the browser default; pair with a global focus-ring rule for visible focus on light surfaces.
- Title overflow is not clipped by default — long labels wrap. If you need single-line truncation, pass it via custom `className` styles.
