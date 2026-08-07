# DataTable

A generic, themeable table primitive for rendering tabular data with typed columns, optional row interactivity, and three density modes.

`DataTable<T>` is a single generic function component. The caller defines a column descriptor list and a row dataset; the table maps them into a native `<table>` element with BEM-classed wrappers. Row keying is delegated to a `rowKey` function (no implicit `id` lookup), and per-cell rendering can be customised via `column.render` while falling back to `row[column.key]` for the common case.

## Usage

```tsx
import { DataTable, type DataTableColumn } from '@viax/uxm';

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

### `DataTableColumn<T>`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | `string` | yes | Used for the `<th>`/`<td>` React key and as the default cell value lookup (`row[key]`). |
| `header` | `ReactNode` | yes | Rendered into the `<th>` cell. Accepts text, icons, or composite nodes. |
| `render` | `(row: T) => ReactNode` | no | Custom cell renderer. When absent, the table falls back to `(row as Record<string, ReactNode>)[key]`. |
| `align` | `'left' \| 'right' \| 'center'` | no | Applies `uxm-data-table__{th,td}--{align}` modifier classes; left is the implicit default. |

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
| `--uxm-data-table-row-bg` | `--color-card` | – | `<tr>` background. |
| `--uxm-data-table-row-hover-bg` | `--color-surface-alt` | – | `<tr>:hover` background. |
| `--uxm-data-table-cell-padding-x` | – | `12px` | Horizontal cell padding (default density). |
| `--uxm-data-table-cell-padding-y` | – | `10px` (th) / `12px` (td) | Vertical cell padding (default density). |

> **Density override:** the `--compact` and `--relaxed` density modifiers override `padding` directly with fixed values (`6px 12px` and `16px 12px` respectively); the `--uxm-data-table-cell-padding-*` vars only take effect in the `default` density.

## Design tokens (MODO-configurable)

When the component-scoped variables above are not overridden, DataTable resolves colour through the global design-token layer exported by `@viax/uxm/tokens`. These tokens are the customization surface exposed to MODO's brand-settings editor: changes saved there flow into `:root` as `--color-*` declarations and re-tint every table instantly.

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
- Column headers (`<th>`) currently have no `scope` attribute and no sort affordances; if you need sortable columns, render an interactive control inside `column.header` and manage sort state externally.
- Density modifiers preserve a minimum touch target of `~32px` in `compact`; verify against your specific row content if you add custom row controls.
- The root container is a `<div>` with `overflow: hidden` and a rounded border — for tables wider than the viewport, wrap the component in a scroll container with `overflow-x: auto` and an explicit `tabIndex={0}` for keyboard scrolling.
