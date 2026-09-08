# BulkActionBar

The floating toolbar that appears once rows are selected: **"{N} selected · actions · × to clear"**.

Purely presentational — it holds no selection state. The consumer wires it to its own `selectedKeys` and decides where it sits, typically fixed or sticky near the bottom of a table view. Destructive actions get the danger treatment via `danger: true`.

The root **is** the styled element (card surface, border, decomposed shadow), so the real-CSS knobs land on it directly, while the per-part colours (action, danger, divider) read `--uxm-bulk-action-bar-*` custom properties on the inner elements. Dividers only appear where they separate something — between the count and the actions, and before the clear button — so a bar with no actions has no stray rules.

## Usage

```tsx
import { BulkActionBar } from '@viax.io/uxm/ui';

const [selected, setSelected] = useState<string[]>([]);

{selected.length > 0 && (
  <BulkActionBar
    count={selected.length}
    onClear={() => setSelected([])}
    actions={[
      { key: 'export', label: 'Export', icon: 'arrow-down-tray', onClick: exportRows },
      { key: 'archive', label: 'Archive', icon: 'archive-box', onClick: archiveRows },
      { key: 'delete', label: 'Delete', icon: 'trash', danger: true, onClick: deleteRows },
    ]}
  />
)}
```

Custom count label — for pluralisation or a different noun:

```tsx
<BulkActionBar
  count={n}
  countLabel={(n) => `${n} ${n === 1 ? 'row' : 'rows'} selected`}
/>
```

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute is forwarded to the root, which is how the consumer attaches its own positioning styles.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | – | **Required.** Number of selected items; drives the default label. |
| `actions` | `BulkAction[]` | `[]` | Action buttons in display order. Empty means no actions block and no divider. |
| `onClear` | `() => void` | – | When set, renders a trailing × that clears the selection. |
| `countLabel` | `(count: number) => ReactNode` | `` `${count} selected` `` | Override the count label. Receives the current count. |
| `clearLabel` | `string` | `'Clear selection'` | Accessible name for the trailing ×. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

```ts
type BulkAction = {
  key: string;          // stable React key + identity
  label: string;        // visible label
  icon?: string;        // leading glyph id from the icon registry
  danger?: boolean;     // destructive colour — reserve for Delete/Remove
  disabled?: boolean;   // disable this one action without removing it
  onClick?: () => void;
};
```

**Visibility is the consumer's.** The bar does not hide itself at `count === 0` — render it conditionally, as in the example.

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-bulk-action-bar-background-color` | `--color-card` | – | Bar surface. |
| `--uxm-bulk-action-bar-color` | `--color-text` | – | Base text colour (count label). |
| `--uxm-bulk-action-bar-border-color` | `--color-border` | – | Bar border. |
| `--uxm-bulk-action-bar-border-radius` | – | `12px` | Corner radius. |
| `--uxm-bulk-action-bar-padding-y` | – | `8px` | Vertical padding. |
| `--uxm-bulk-action-bar-padding-x` | – | `12px` | Horizontal padding. |
| `--uxm-bulk-action-bar-gap` | – | `8px` | Gap between count, dividers, actions and clear. |
| `--uxm-bulk-action-bar-font-size` | – | `14px` | Base font size. |
| `--uxm-bulk-action-bar-shadow-offset-y` | – | `10px` | Shadow Y offset. |
| `--uxm-bulk-action-bar-shadow-blur` | – | `28px` | Shadow blur. |
| `--uxm-bulk-action-bar-shadow-color` | – | `rgba(0, 0, 0, 0.16)` | Shadow colour. |
| `--uxm-bulk-action-bar-divider-color` | `--color-border` | – | The 1px vertical rules. |
| `--uxm-bulk-action-bar-action-color` | `--color-text` | – | Action label colour **and** its focus-ring colour. |
| `--uxm-bulk-action-bar-action-radius` | – | `6px` | Action button radius. |
| `--uxm-bulk-action-bar-action-hover-bg` | `--color-surface-alt` | – | Action hover wash. |
| `--uxm-bulk-action-bar-danger-color` | `--color-danger-text` | – | Danger action label **and** its focus ring. |
| `--uxm-bulk-action-bar-danger-hover-bg` | `--color-danger-bg` | – | Danger action hover wash. |

The shadow is **decomposed into three knobs** (offset-Y, blur, colour) rather than one shorthand, so a theme can tune elevation without restating the whole value.

The trailing × composes [`IconButton`](../icon-button/README.md) — its size, muted colour, hover and focus ring come from `.uxm-icon-button`, so re-theme it through `--uxm-icon-button-*`. The action row's inner `2px` gap and the buttons' `6px 10px` padding are layout primitives, not knobs.

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Bar surface. |
| `--color-surface-alt` | Surfaces / Surface Alt | Action hover wash. |
| `--color-text` | Text / Text | Count label, action labels, action focus ring. |
| `--color-border` | Borders / Border | Bar border and dividers. |
| `--color-danger-text` | Semantic / Danger Text | Danger action label and focus ring. |
| `--color-danger-bg` | Semantic / Danger Bg | Danger action hover wash. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Default | – | Count label only, if no actions and no `onClear`. |
| With actions | `actions` non-empty | Divider, then the action row. |
| Clearable | `onClear` set | Divider, then the × IconButton. |
| Action hover | pointer over an enabled action | Surface-alt wash. |
| Action focus | keyboard focus | 2px outline in the action's own colour, offset 1px. |
| Danger action | `danger: true` | Danger text colour; hover wash and focus ring switch to the danger palette. |
| Disabled action | `disabled: true` | 0.4 opacity, `not-allowed` cursor, hover suppressed. |

## Accessibility

- The root is `role="toolbar"` with a default `aria-label="Bulk actions"`. Because `...rest` is spread **after** that default, passing `aria-label` overrides it — worth doing when two toolbars can be on screen at once, or in a localised UI. The trailing × takes its name from `clearLabel`.
- **`role="toolbar"` implies arrow-key roving focus, which this component does not implement.** Buttons are reached with Tab, one stop each. For most bars (2–4 actions) this is acceptable, but it does not match what the role promises to a screen-reader user.
- Dividers are `aria-hidden="true"` — decorative rules with no semantic meaning.
- The count label is plain text inside the toolbar and is **not a live region**: a screen reader will not announce the count changing as rows are selected. If that matters, announce it from the table's own live region.
- Use `countLabel` for correct pluralisation. The default `"{n} selected"` reads poorly at `1`.
- Action buttons are real `<button type="button">` elements with visible `:focus-visible` outlines that inherit the action's own colour, so the ring stays visible on both normal and danger actions.
- `danger` is colour-only. Reserve it for genuinely destructive actions and keep the label explicit ("Delete"), since colour alone does not convey the consequence.
- Disabled actions use the native `disabled` attribute, so they are skipped in the tab order and announced as unavailable.
