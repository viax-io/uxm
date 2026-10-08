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

### Column widths

```tsx
// A mix of share and pixels: Element takes the remainder, the rest are pinned.
const columns: DataTableColumn<Line>[] = [
  { key: 'element', header: 'Element' },                         // remainder
  { key: 'drivenBy', header: 'Driven by', width: '34%' },
  { key: 'amount', header: 'Amount', width: 92, align: 'right', className: 'vm-amt' },
  { key: 'status', header: 'Status', width: 104 },
];
```

Declaring any width puts the table on `table-layout: fixed` — under auto layout a width
is a hint the browser drops once content is wider, so the two go together. Tables that
declare none are untouched.

Worth knowing:

- **Keep one column unsized.** It takes the remainder, and it has no minimum: if the
  declared widths already fill the table it collapses to nothing and the root's
  `overflow: hidden` clips it.
- **A pixel width is the column**, padding included — cells are `box-sizing: border-box`
  in fixed mode, so the same table measures the same in a border-box and a content-box app.
- **It does not truncate wrapping text.** `text-overflow: ellipsis` applies only to a
  single non-wrapping line, so an ordinary cell grows taller instead; the clip catches
  unbreakable strings. For real truncation with a tooltip use `maxWidth`, which clamps the
  *content* and is independent of `width` — both together is coherent.
- The actions column (`rowActions`) sizes itself to its trigger and is never clipped.

### Active row and row attributes

```tsx
<DataTable
  columns={columns}
  rows={rows}
  rowKey={(r) => r.id}
  activeRowId={openRow?.id ?? null}
  rowProps={(r) => ({ id: `line-${r.id}` })}   // deep-link target
/>
```

### Scrolling and sticky columns

```tsx
<DataTable
  columns={[
    { key: 'name', header: 'Name', width: 220, sticky: 'start' },  // identity stays put
    { key: 'a', header: 'A', width: 160 },
    { key: 'b', header: 'B', width: 160 },
    { key: 'total', header: 'Total', width: 120, sticky: 'end', align: 'right' },
  ]}
  rows={rows}
  rowKey={(r) => r.id}
  scrollLabel="Orders"
/>
```

`sticky` turns the scroller on by itself — pinning only means something against a scroll.
Use `scrollable` on its own for a wide table that wants the affordances without pinning.

What you get, and what to know:

- **The scroller is a focusable `role="region"`.** A scroll container reachable only by
  pointer fails 2.1.1, so it takes `tabIndex={0}` and is named by `scrollLabel`.
- **Scroll shadows and arrows** appear only while there is somewhere to scroll, both driven
  by the same measured state so they cannot disagree. The arrows move ~80% of a viewport and
  respect `prefers-reduced-motion`.
- **One sticky column per side.** Offsetting a second needs the first measured, and a wrong
  offset overlaps two columns rather than degrading gracefully.
- **Scrollable tables use `border-collapse: separate`.** With collapsed borders the border
  belongs to the table, not the cell, so a pinned cell scrolls out from under its own rules
  in Chrome and Safari. Only scrollable tables switch; every other table keeps collapsed
  borders, and the two render identically.
- **Nothing applies in stacked mode.** Below a 480px container there is no horizontal axis:
  cells un-pin, shadows clear and the arrows are hidden.
- **`scrollable` alone will not scroll a table that already fits.** Auto layout wraps content
  to the available width, so give columns a `width` (or `white-space: nowrap` content) if you
  want a horizontal scroll at all.
- **The arrows stay mounted and go `aria-disabled` at the ends**, rather than unmounting —
  removing the button you are pressing throws focus to the document.
- **The studio preview demonstrates all of it.** It renders the real `<DataTable>` with column
  widths that overflow the canvas, a sticky identity column and `stickyActions`, so the
  scroller, the pinned columns and the arrows are visible and every knob is live.

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
| `activeRowId` | `string \| null` | – | Marks one row active — the row whose detail is open in a pane beside the table. Compared against `rowKey(row)`. Sets `aria-current="true"` and a `--active` class. Distinct from hover and from `onRowClick`: the row stays active while the pointer is elsewhere. |
| `rowProps` | `(row: T) => HTMLAttributes<HTMLTableRowElement>` | – | Extra attributes merged onto the `<tr>` — an `id` to deep-link to, a data attribute, a row-specific class. `className` merges with the library's; everything else wins over the defaults, including `aria-current`. |
| `scrollable` | `boolean` | `false` | Puts the table in its own horizontal scroller instead of letting it push its container wide. Implied by any `sticky` column; set it alone for a wide table that wants the affordances without pinning. |
| `scrollLabel` | `string` | `'Table'` | Accessible name for the scroll region and its arrows. Give it the table's subject when a page has more than one, or every region announces the same. |
| `scrollArrowLabel` | `(direction, tableLabel) => string` | `Scroll {label} back` / `… forward` | Names the two arrows. A callback, not a prefix, so a translation can place the table's name where its grammar needs it. Not "left"/"right" by default — those are physical, and in RTL the start arrow sits on the right. |
| `stickyActions` | `boolean` | `false` | Pins the generated `rowActions` column to the trailing edge. It needs its own prop because that column has no `column` object to carry `sticky`. Mutually exclusive with a data column that sets `sticky: 'end'`. |

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
| `width` | `number \| string` | no | Column width — a share (`'34%'`) or pixels (`120` / `'120px'`). **Setting it on any column switches the table to `table-layout: fixed`**, which is what makes a declared width hold; columns without one split the remainder. A table where nobody declares a width keeps auto layout, exactly as before. Replaces reaching into `.uxm-data-table__th:nth-child(n)` from a consumer stylesheet. |
| `className` | `string` | no | Applied to **both** the `<th>` and every `<td>` in the column — added to the library classes, not replacing them. A column is a vertical thing; styling one from outside otherwise takes two `nth-child` selectors that renumber the moment a column is inserted. |
| `label` | `string` | no | The column's name as plain text, for places a `ReactNode` header cannot go: the `data-label` stacked mode shows on each cell, and the sort control's accessible name. Defaults to `header` when it's a string — so it only ever fills a gap. A JSX header previously rendered cells with **no** stacked-mode label at all. |
| `sticky` | `'start' \| 'end'` | no | Pins the column to the leading or trailing edge while the table scrolls. Turns the scroller on by itself. **One column per side** — offsetting a second requires measuring the first, and a wrong offset overlaps columns rather than degrading. Give it a `width`. No effect in stacked mode. |

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
| `--uxm-data-table-row-active-bg` | `--color-accent-subtle` | – | Fill of the active row. |
| `--uxm-data-table-row-active-rail` | `--color-accent-bold` | – | The 3px rail on the active row's first cell. Drawn with `box-shadow`, so it costs no layout and can't nudge a measured column width under fixed layout. |
| `--uxm-data-table-row-active-hover-bg` | `--color-accent-subtle` | – | Active row while hovered — set it if you want hover to read differently there. |
| `--uxm-data-table-scroll-shadow` | – | `6px 0 6px rgb(0 0 0 / 18%)` | Shadow cast by a `sticky: 'start'` column once scrolled. A full `box-shadow` value, not a colour — CSS-only, deliberately not a studio knob. |
| `--uxm-data-table-scroll-shadow-end` | – | `-6px 0 6px rgb(0 0 0 / 18%)` | The same for a `sticky: 'end'` column. |
| `--uxm-data-table-scroll-arrow-bg` | `--color-card` | – | Fill of the scroll arrow buttons. |
| `--uxm-data-table-scroll-arrow-shadow` | `--shadow-sm` | – | Lift under the arrows, so they read above the rows. |
| `--uxm-data-table-scroll-focus-color` | `--color-accent-bold` | – | Focus ring on the scroll region. Inset, because the root clips. |
| `--uxm-data-table-row-bg` | `--color-card` | – | `<tr>` background. |
| `--uxm-data-table-row-hover-bg` | `--color-surface-alt` | – | Row hover fill. **Note this is the same token the header band uses**, so a hovered row currently reads as the same colour as the header. Set it to `var(--color-surface)` for a hover that is distinct from the header and a gentler step from the card-white row. The shipped default is unchanged on purpose: moving it is a visual change for every existing table, which is a major-release decision rather than something a patch should do silently. |
| `--uxm-data-table-cell-padding-x` | – | `12px` | Horizontal cell padding (default density). |
| `--uxm-data-table-cell-padding-y` | – | `10px` (th) / `12px` (td) | Vertical cell padding (default density). |

> **Density override:** the `--compact` and `--relaxed` density modifiers override `padding` directly with fixed values (`6px 12px` and `16px 12px` respectively); the `--uxm-data-table-cell-padding-*` vars only take effect in the `default` density.

> **The root re-asserts two [`EditableCell`](../editable-cell/README.md) composition knobs** — `--uxm-editable-cell-editing-track-floor: max-content` and `--uxm-editable-cell-outdent: 0`. Both are inherited custom properties that a host may set on a wrapper to lay out a *single* cell ([`FormField`](../form-field/README.md) does), and a table dropped inside such a wrapper would inherit them and lose what its own cells depend on: the `max-content` floor is what stops an auto-sized column jumping when editing starts, and the outdent would pull the leading column's text off the header grid. These are the defaults everywhere else, so the reset is a no-op outside that composition. Setting either on a `DataTable` instance still works — the reset is on the root, so an inline style or a more specific rule wins.

### Hover and the header band

`--uxm-data-table-row-hover-bg` and `--uxm-data-table-header-bg` both default to
`--color-surface-alt`, so a hovered row paints the same colour as the header band.

```css
/* A hover distinct from the header, and a smaller step from the card-white row. */
.my-table { --uxm-data-table-row-hover-bg: var(--color-surface); }
```

Light: rows are `--color-card` `#FFFFFF`, `--color-surface` is `#F8F7F6`, `--color-surface-alt`
is `#F2F1F0`. Dark: `#1B1A18`, `#232220`, `#2A2927`.

Either value clears AA for the text on top, in both themes — measured, worst case `4.76:1`
(`--color-text-muted` on `--color-surface-alt`, light). So the choice is about whether hover
should be distinguishable from the table's own chrome, not about contrast.

**The default is deliberately left alone.** Changing it would restyle every existing table,
which is a major-release decision; the knob is how you take the new look today.

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
- **The active row** carries `aria-current="true"`, and is cued by an accent rail as well as a tint: at AA the difference between two adjacent row fills is necessarily subtle, and colour alone is not an acceptable sole cue (1.4.1).
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
