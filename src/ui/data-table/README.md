# DataTable

A generic, themeable table primitive for rendering tabular data with typed columns, optional row interactivity, and three density modes.

`DataTable<T>` is a single generic function component. The caller defines a column descriptor list and a row dataset; the table maps them into a native `<table>` element with BEM-classed wrappers. Row keying is delegated to a `rowKey` function (no implicit `id` lookup), and per-cell rendering can be customised via `column.render` while falling back to `row[column.key]` for the common case.

## Usage

```tsx
import { DataTable, type DataTableColumn } from '@viax.io/uxm';

type User = { id: string; name: string; email: string; signups: number };

const columns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'signups', header: 'Signups', align: 'right' },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) => <a href={`/users/${row.id}`}>View</a>,
  },
];

function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      columns={columns}
      rows={users}
      rowKey={(u) => u.id}
      density="default"
      onRowClick={(u) => navigate(`/users/${u.id}`)}
    />
  );
}
```

### Sorting

Opt in per column with `sortKey`, then pick a mode. The table never sorts `rows` — it reports
what a click means and you apply it, which is what lets the same component back an in-page
sort and a server-paged one.

```tsx
// Callback mode — sort in component state.
const [sort, setSort] = useState<DataTableSort | null>(null);
const sorted = useMemo(() => applySort(users, sort), [users, sort]);

<DataTable columns={columns} rows={sorted} rowKey={(u) => u.id} sort={sort} onSortChange={setSort} />
```

```tsx
// Link mode — sort in the URL, so the list is linkable and the back button works.
// The server reads the query and renders the page already sorted.
<DataTable
  columns={columns}
  rows={page.rows}
  rowKey={(u) => u.id}
  sort={{ key: params.sort, direction: params.dir }}
  sortHref={(next) => `/users?sort=${next.key}&dir=${next.direction}`}
/>
```

```tsx
const columns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name', sortKey: 'name' },
  // Sort by a field the column does not render.
  { key: 'customer', header: 'Customer', sortKey: 'customer.lastName' },
  // First click opens on the newest / largest, not the oldest / smallest.
  { key: 'signups', header: 'Signups', align: 'right', sortKey: 'signups', firstSortDirection: 'desc' },
];
```

## Props

### `DataTableProps<T>`

Extends `Omit<HTMLAttributes<HTMLDivElement>, 'children'>` — any standard div attribute (id, style, data-*, aria-*) is forwarded to the root wrapper. `children` is not accepted; row content comes exclusively from `rows` + `columns`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `DataTableColumn<T>[]` | – | **Required.** Column descriptors; render order matches array order. |
| `rows` | `T[]` | – | **Required.** Row dataset; rendered in order, one `<tr>` per item. |
| `rowKey` | `(row: T) => string` | – | **Required.** Stable key extractor for React's reconciliation; pick a value that doesn't change between renders. |
| `density` | `'compact' \| 'default' \| 'relaxed'` | `'default'` | Vertical cell padding modifier. See [States](#states--variants). |
| `onRowClick` | `(row: T) => void` | – | When provided, rows render with a pointer cursor (`uxm-data-table__row--interactive`) and forward clicks. Header clicks are not captured. |
| `className` | `string` | – | Merged with the root class via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div className="uxm-data-table">`. |
| `actionsColumnLabel` | `string` | `'Actions'` | Accessible name for the visually-empty actions column header. |
| `rowActionsLabel` | `string` | `'Row actions'` | Accessible name for each row's ⋮ trigger and menu. Repeats on every row — override where the row has a name. |
| `sort` | `DataTableSort \| null` | – | The current sort (`{ key, direction }`). **Controlled** — the table never sorts `rows` itself and holds no sort state; it renders what you pass and reports intent, which is the only way a server-paged list can work. |
| `onSortChange` | `(next: DataTableSort) => void` | – | Sort as a **callback**: the header renders a `<button>`. Never called with `null` — a sorted column flips rather than cycling back to unsorted. |
| `sortHref` | `(next: DataTableSort) => string` | – | Sort as a **link**: the header renders an `<a href>` instead. Use when sort lives in the URL, so the list is linkable, the back button works and the table can render on the server. Takes precedence over `onSortChange`. |
| `renderSortLink` | `(args) => ReactNode` | – | Render link mode's anchor yourself, for a client-side router — the default `<a href>` means a full document load per sort click in a Next / React Router app. Receives `{ href, sort, className, children, 'aria-label' }`. Requires `sortHref`. |

### `DataTableColumn<T>`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | `string` | yes | Used for the `<th>`/`<td>` React key and as the default cell value lookup (`row[key]`). |
| `header` | `ReactNode` | yes | Rendered into the `<th>` cell. Accepts text, icons, or composite nodes. |
| `render` | `(row: T) => ReactNode` | no | Custom cell renderer. When absent, the table falls back to `(row as Record<string, ReactNode>)[key]`. |
| `align` | `'left' \| 'right' \| 'center'` | no | Applies `uxm-data-table__{th,td}--{align}` modifier classes; left is the implicit default. |
| `sortKey` | `string` | no | Makes the column sortable and is the value reported back in `DataTableSort.key`. Separate from `key` on purpose — the column you show and the field you sort by are often different (a "Customer" column sorted by `customer.lastName`). A column without it renders its header exactly as before: no control, no `aria-sort`. |
| `firstSortDirection` | `'asc' \| 'desc'` | no | Which way the **first** click sorts. Defaults to `'asc'`. Set `'desc'` on dates and amounts — ascending-first opens a date column on the oldest row, which is almost never wanted. |
| `sortLabel` | `string` | no | Accessible name for the sort control. Normally unnecessary (the header text names it), but **required when `header` is not plain text** — an icon-only header otherwise produces a control with no accessible name. |

### `DataTableDensity`

```ts
type DataTableDensity = 'compact' | 'default' | 'relaxed';
```

The `density` prop is exported as a discriminated string union so consumers can build density-toggle controls without re-declaring the literals.

## CSS variables

DataTable reads a small set of `--uxm-data-table-*` custom properties on the root for per-instance fine-tuning. Each colour variable falls back to a MODO-configurable design token (see [Design tokens](#design-tokens-modo-configurable) below); set them inline or globally on a higher scope (e.g. `:root` or a theme wrapper).

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-data-table-border-color` | `--color-border` | – | Root border, `<th>` / `<td>` bottom rule. |
| `--uxm-data-table-font-size` | – | `13px` | Base table font size (cells, header). |
| `--uxm-data-table-header-bg` | `--color-surface-alt` | – | `<thead>` row background. |
| `--uxm-data-table-header-text` | `--color-text-muted` | – | `<th>` text colour. |
| `--uxm-data-table-sort-color` | `--uxm-data-table-header-text` → `--color-text-muted` | – | Sortable header control, at rest. |
| `--uxm-data-table-sort-hover-color` | `--color-text` | – | Sortable header on hover. |
| `--uxm-data-table-sort-active-color` | `--color-text` | – | The header of the column currently sorted — so the sorted column reads stronger than its neighbours without relying on colour alone (the glyph says which way). |
| `--uxm-data-table-sort-focus-color` | `--color-accent-bold` | – | Focus ring on the sortable header control. |
| `--uxm-data-table-sort-icon-color` | `currentColor` | – | The sort glyph, if you want it to diverge from the label. |
| `--uxm-data-table-row-bg` | `--color-card` | – | `<tr>` background. |
| `--uxm-data-table-row-hover-bg` | `--color-surface-alt` | – | `<tr>:hover` background. |
| `--uxm-data-table-cell-padding-x` | – | `12px` | Horizontal cell padding (default density). |
| `--uxm-data-table-cell-padding-y` | – | `10px` (th) / `12px` (td) | Vertical cell padding (default density). |

> **Density override:** the `--compact` and `--relaxed` density modifiers override `padding` directly with fixed values (`6px 12px` and `16px 12px` respectively); the `--uxm-data-table-cell-padding-*` vars only take effect in the `default` density.

> **The root re-asserts two [`EditableCell`](../editable-cell/README.md) composition knobs** — `--uxm-editable-cell-editing-track-floor: max-content` and `--uxm-editable-cell-outdent: 0`. Both are inherited custom properties that a host may set on a wrapper to lay out a *single* cell ([`FormField`](../form-field/README.md) does), and a table dropped inside such a wrapper would inherit them and lose what its own cells depend on: the `max-content` floor is what stops an auto-sized column jumping when editing starts, and the outdent would pull the leading column's text off the header grid. These are the defaults everywhere else, so the reset is a no-op outside that composition. Setting either on a `DataTable` instance still works — the reset is on the root, so an inline style or a more specific rule wins.

## Design tokens (MODO-configurable)

When the component-scoped variables above are not overridden, DataTable resolves colour through the global design-token layer exported by `@viax.io/uxm/tokens`. These tokens are the customization surface exposed to MODO's brand-settings editor: changes saved there flow into `:root` as `--color-*` declarations and re-tint every table instantly.

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-border` | Borders / Border | Root border, cell bottom rule. |
| `--color-surface-alt` | Surfaces / Surface Alt | Header background, row hover background. |
| `--color-text-muted` | Text / Text Muted | Header text. |
| `--color-card` | Surfaces / Card | Row background. |
| `--color-text` | Text / Text | Cell text. |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Density: `compact` | `density="compact"` | Cell padding clamped to `6px 12px`. |
| Density: `default` | `density="default"` (or omitted) | Cell padding from `--uxm-data-table-cell-padding-*` vars (`10–12px`). |
| Density: `relaxed` | `density="relaxed"` | Cell padding clamped to `16px 12px`. |
| Row hover | `:hover` on `<tr>` | Background shifts to `--uxm-data-table-row-hover-bg` with a 0.1s transition. |
| Row interactive | `onRowClick` provided | Adds `uxm-data-table__row--interactive` → pointer cursor; click handler fires. |
| Cell alignment | `column.align` | `--right` / `--center` modifier on `<th>` and `<td>`. Left is the implicit default. |
| Last row | Structural | Trailing `<td>`s drop their bottom border so the root border isn't doubled. |

## Accessibility

- Renders a semantic `<table>` with `<thead>` / `<tbody>` — screen readers announce row/column counts and navigation via standard table-traversal shortcuts.
- Row clicks: when `onRowClick` is provided, the click handler is attached to `<tr>`, **not** to a focusable element. For full keyboard support, consumers should:
  - render an interactive control (link or button) inside the row, or
  - wrap row content in a `<button>`/`<a>` to retain native focus and `Enter` activation.
- Column headers (`<th>`) have no `scope` attribute.
- **Sorting** follows the APG sortable-table pattern. A column with `sortKey` renders a `<button>` (or an `<a>` with `sortHref`) inside its `<th>`, and the `<th>` carries `aria-sort`: `ascending` / `descending` on the sorted column, and `none` on every other sortable column. (`none` is ARIA's default, so screen readers announce nothing for it — emitting it explicitly is valid and harmless, and makes the sortable set visible in the DOM. The APG example sets the attribute only on the sorted header.) Non-sortable columns carry no `aria-sort` at all.
  - The control's accessible name is just the column header text. State lives in `aria-sort`, so the control does not also narrate it — and `header` is a `ReactNode`, so there is no string to build "sort by X descending" from.
  - The glyph is the `sort-none` / `sort-asc` / `sort-desc` family, whose three members share one ink box, so the header keeps its weight as the column toggles.
  - The control stretches to the cell's width, so the whole header row is clickable. On **target size** it meets WCAG 2.2 2.5.8 through the *spacing* exception (nothing else sits within 24px), not by being 24px itself — its own box is the line box, ~16–18px at the 12px header type and tighter at `compact` density.
  - **Sorting disappears in stacked mode.** Below a 480px container the `<thead>` is `display: none` (each cell labels itself as a card), which takes the sort controls and `aria-sort` with it. Provide another way to sort at that width — a `Select` above the table — if sorting matters on phones.
  - `sortLabel` sets the control's `aria-label`. Needed whenever `header` is not plain text: an icon-only header otherwise leaves the button or link with **no accessible name at all**, which axe reports as `button-name` / `link-name`.
  - In link mode the anchor carries no `aria-current` or disabled cue; state is on the `<th>` via `aria-sort`, which is where assistive tech looks for it.
- Density modifiers preserve a minimum touch target of `~32px` in `compact`; verify against your specific row content if you add custom row controls.
- In stacked mode (`@container (max-width: 480px)`) the table, its `tbody`, the rows and the cells all become blocks so each row fills the container as a card. The `tbody` is part of that list on purpose: it carries no class, and left as a `table-row-group` inside a block table it gets wrapped in an anonymous `table` box that shrinks to min-content — which made rows render at a fraction of their container (measured: 318px table, 81px row). If you ever restyle this block, keep the `tbody` in it.
- The root container is a `<div>` with `overflow: hidden` and a rounded border — for tables wider than the viewport, wrap the component in a scroll container with `overflow-x: auto` and an explicit `tabIndex={0}` for keyboard scrolling.
