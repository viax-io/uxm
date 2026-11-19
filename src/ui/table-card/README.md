# TableCard

One frame whose body is a table: a card header (title, a muted line, actions on the right) over a `DataTable` that has no border of its own. It replaces a `DataTable` inside a `Card`, which draws two frames (the card's border and padding, then the table's own rounded border and header strip) and needs negative margins to make the rows reach the card's edge.

`TableCard<T>` composes the shipped `DataTable` with `framed={false}`; sorting, row actions, `onRowClick`, `activeRowId`, stacking, sticky columns and every other table prop work as they do on a bare table.

## Usage

```tsx
import { ButtonSecondary, TableCard, type DataTableColumn } from '@viax.io/uxm/ui';

const columns: DataTableColumn<Deal>[] = [
  { key: 'name', header: 'Name' },
  { key: 'owner', header: 'Owner' },
  { key: 'amount', header: 'Amount', align: 'right' },
];

<TableCard
  title="Deals"
  description="5 open · updated 2 hours ago"
  actions={<ButtonSecondary>Export</ButtonSecondary>}
  columns={columns}
  rows={deals}
  rowKey={(deal) => deal.id}
  empty="No deals yet."
/>
```

## Props

`TableCardProps<T>` is every `DataTableProps<T>` prop (see the [DataTable README](../data-table/README.md)) plus the card's own, and the native `div` attributes. `className`, `style`, `id`, `data-*` and `aria-*` go to the **card**, not the table; `title` is a `ReactNode` here, not the native string attribute.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | – | Card heading. Pass an element (`<h3>`) when the page outline needs a real heading level; the default is a `div`. |
| `description` | `ReactNode` | – | Muted line under the title. |
| `actions` | `ReactNode` | – | Right side of the header. |
| `variant` | `'lines' \| 'striped'` | `'lines'` | See [Variants](#states--variants). |
| `hideHeaderRow` | `boolean` | `false` | Drop the column-header strip. The header cells stay in the DOM at zero height, so assistive tech still hears the column names. Don't combine it with sortable columns: their buttons would stay focusable and invisible. |
| `empty` | `ReactNode` | – | Shown in the body, in place of the table, when `rows` is empty. Without it an empty table renders its header row. |
| `shadow` | `boolean` | `false` | Lift the card (`--uxm-table-card-shadow-*`). |
| …`DataTableProps` | | | `columns`, `rows`, `rowKey`, `density`, `stackAt`, `sort`, `onSortChange`, `rowActions`, `onRowClick`, `rowProps`, `scrollable`, … |

No header row is rendered when none of `title`, `description` and `actions` is given.

## CSS variables

Each reads a global token as its fallback. The table inside still reads its own `--uxm-data-table-*` knobs (font size, row hover, header text…).

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-table-card-bg` | `--color-card` | – | Card background. `--uxm-table-card-background` takes any `background` value and wins. |
| `--uxm-table-card-border-color` | `--color-border` | – | The card's one border. |
| `--uxm-table-card-radius` | – | `4px` | Card corners; rows are clipped to them. Matches `Card`. |
| `--uxm-table-card-divider-color` | `--color-border` | – | `lines`: the line under the header and between rows. |
| `--uxm-table-card-stripe-bg` | `--color-surface` | – | `striped`: the tint of every second row. |
| `--uxm-table-card-stripe-inset` | – | `10px` | `striped`: how far the tint stops short of the card's edge. |
| `--uxm-table-card-padding-x` | – | `20px` | Header side padding, and the first/last cell's, so the text lines up. |
| `--uxm-table-card-padding-y` | – | `16px` | Header top and bottom padding. |
| `--uxm-table-card-header-gap` | – | `12px` | Gap between the heading and the actions. |
| `--uxm-table-card-actions-gap` | – | `8px` | Gap between actions. |
| `--uxm-table-card-title-color` | `--color-text` | – | Title colour. |
| `--uxm-table-card-title-font-size` | – | `15px` | Title size (× `--type-scale`). |
| `--uxm-table-card-title-font-weight` | `--font-weight-strong` | `600` | Title weight. |
| `--uxm-table-card-description-color` | `--color-text-muted` | – | Description and empty-state colour. |
| `--uxm-table-card-description-font-size` | – | `12px` | Description size (× `--type-scale`). |
| `--uxm-table-card-empty-padding-y` | – | `32px` | Empty state's vertical padding. |
| `--uxm-table-card-shadow-color` | `--shadow-card-color` | – | With `shadow`. |
| `--uxm-table-card-shadow-blur` | – | `20px` | With `shadow`. |
| `--uxm-table-card-shadow-offset-y` | – | `6px` | With `shadow`. |

## States & variants

| Variant | Look |
|---------|------|
| `lines` | Rows run edge to edge with a divider between rows. The column-header row sits flush under the card header, with one divider above it (never two) and no outer table border. Cell padding equals the header's side padding. |
| `striped` | No dividers; every second row is tinted. The rows are inset by `--uxm-table-card-stripe-inset` and the cells take the rest of the padding, so the text still lines up with the header's. The column-header strip is transparent. |

Hover, focus, active-row and stacked (card-list) states are the table's own. In stacked mode the rows keep DataTable's card dividers in either variant.

## Accessibility

- A `div` card around a native `<table>`; the semantics are the table's. The title is a plain `div`: pass `<h3>` (or the level your page needs) as `title` to put it in the outline.
- Name the table for assistive tech with `scrollLabel` when `scrollable`, as on a bare `DataTable`.
- `hideHeaderRow` keeps the `<th>` cells in the DOM at zero height, so the column names are still announced.
- Focus rings, `onRowClick` keyboard operation and sort buttons are DataTable's.

## Notes

- `framed` is a `DataTable` prop (default `true`). `TableCard` always passes `false`; it is not accepted on `TableCard`. Use `DataTable framed={false}` directly only when you lay out your own surface.
- The root clips its children (`overflow: hidden`) so the rows follow the card's rounded corners. A popover that is not portalled out of a cell would be clipped.
