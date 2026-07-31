# @viax/uxm — Quick Recipes

Copy-pasteable patterns for the most common compositions. Each recipe assumes:

```ts
// app/layout.tsx (Next.js) — done once
import '@viax/uxm/tokens.css';
import '@viax/uxm/ui.css';
```

---

## 1. App shell (sidebar + topbar + content)

```tsx
import {
  PageShell,
  AppSidebar,
  AppTopBar,
  PageHeader,
  TextInput,
  Icon,
  type AppSidebarSection,
} from '@viax/uxm/ui';

// NOTE: the section key is `heading`, NOT `label`. And `glyph` must be a real id
// from the registry (see component-catalog.md) — <Icon> renders NOTHING for an
// unknown glyph, so "dashboard" / "folder" / "package" / "external" all silently
// disappear.
const sections: AppSidebarSection[] = [
  {
    heading: 'Workspace',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: <Icon glyph="grid" /> },
      { href: '/projects', label: 'Projects', icon: <Icon glyph="document" /> },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell
      variant="standard"
      // AppSidebarBrand is { logoUrl, iconUrl, alt } — there is NO `name` prop.
      sidebar={<AppSidebar brand={{ logoUrl: '/logo.svg', alt: 'My App' }} sections={sections} />}
      // AppTopBar takes { search, actions, onMobileMenuClick } — there is NO `title`.
      topBar={<AppTopBar search={<TextInput placeholder="Search…" />} />}
    >
      <PageHeader
        icon={<Icon glyph="grid" />}
        title="Dashboard"
        meta="Updated 2 min ago"
      />
      {children}
    </PageShell>
  );
}
```

### Client-side nav: `linkAs` needs an `href` → `to` adapter

`AppSidebar` renders each item as `<Component href={item.href}>`, where `Component` is `linkAs`
(default `'a'`). `next/link` accepts `href`, so passing it directly works — but **react-router's
`Link` requires `to` and ignores `href`**, so `linkAs={Link}` produces dead links (or a full page
reload). Wrap it:

```tsx
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const RouterNavLink = forwardRef<HTMLAnchorElement, { href?: string }>(
  function RouterNavLink({ href, ...rest }, ref) {
    return <Link ref={ref} to={href ?? '#'} {...rest} />;
  },
);

<AppSidebar brand={brand} sections={sections} linkAs={RouterNavLink} />
```

Without this every sidebar click tears down the provider tree and visibly re-hydrates the app.

---

## 2. Form with `FormField` wrappers

`FormField` owns labels — the input atoms (`TextInput`, `Select`, `Textarea`, `NumberInput`,
`PhoneInput`, etc.) render BARE. Always wrap. Field ERRORS, however, live on the atom itself:
pass `error="message"` to the input and it renders the red border, `aria-invalid`, and the
icon-led message below the field.

```tsx
'use client';
import { useState } from 'react';
import {
  Stack,
  FormField,
  TextInput,
  Textarea,
  Select,
  ButtonPrimary,
  ButtonTertiary,
  Cluster,
} from '@viax/uxm/ui';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const emailError =
    email && !email.includes('@') ? 'Enter a valid email address.' : undefined;

  return (
    <form onSubmit={(e) => { e.preventDefault(); /* submit */ }}>
      <Stack gap={16}>
        <FormField label="Name">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>

        <FormField label="Email">
          <TextInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError /* string | undefined — atom renders the message */}
          />
        </FormField>

        <FormField label="Topic">
          <Select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">Select…</option>
            <option value="bug">Report a bug</option>
            <option value="feedback">Send feedback</option>
          </Select>
        </FormField>

        <FormField label="Message">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </FormField>

        <Cluster gap={8} justify="end">
          <ButtonTertiary type="button">Cancel</ButtonTertiary>
          <ButtonPrimary type="submit">Send</ButtonPrimary>
        </Cluster>
      </Stack>
    </form>
  );
}
```

---

## 3. Tabular list with `DataTable`

```tsx
import { DataTable, type DataTableColumn, InlineAction, Icon } from '@viax/uxm/ui';

type User = { id: string; name: string; email: string; signups: number };

const columns: DataTableColumn<User>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'signups', header: 'Signups', align: 'right' },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) => (
      <InlineAction
        onClick={() => alert(row.id)}
        icon={<Icon glyph="arrow-up-right" />}
      >
        View
      </InlineAction>
    ),
  },
];

export function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      columns={columns}
      rows={users}
      rowKey={(u) => u.id}
      density="default"
    />
  );
}
```

---

## 4. Feedback: persistent Banner vs transient toast

Two different tools — pick by lifetime, not by look:

- **`Banner`** — persistent inline strip; stays until the user dismisses it or the consumer
  removes it from state. System states, announcements, degraded-mode warnings.
- **`toast.*()`** — transient corner notification that auto-dismisses. After-the-fact feedback
  ("Saved", "Copied", "Import failed").

```tsx
// Banner — inline in page flow
import { Banner } from '@viax/uxm/ui';

<Banner variant="success" title="Q1 forecast beat target by 12%." onDismiss={() => setShow(false)} />
<Banner variant="warning">Working offline — changes are queued.</Banner>
```

```tsx
// Toast — mount the outlet ONCE at the app root…
import { Toaster } from '@viax/uxm/ui';
// in app/layout.tsx / App.tsx:
<Toaster position="top-right" max={5} />

// …then fire imperatively from anywhere (no hooks, no context):
import { toast } from '@viax/uxm/ui';
toast.success('Saved');
toast.error('Import failed', { duration: 8000 });
const id = toast.info('Syncing…');
toast.dismiss(id);
```

For inline FIELD errors, use the input atom's own `error` prop — not a Banner.

---

## 5. Empty + loading + error states for a list view

```tsx
import { EmptyState, Loader, Banner, Icon } from '@viax/uxm/ui';

if (loading) return <Loader variant="spinner" message="Loading projects…" />;
if (error) return <Banner variant="error">{error.message}</Banner>;
if (!projects.length) {
  return (
    <EmptyState
      icon={<Icon glyph="document" />}
      title="No projects yet"
      description="Create your first project to get started."
    />
  );
}
return <ProjectList projects={projects} />;
```

`Loader` is **indeterminate** ("something is happening, no ETA"). When you know the fraction done —
an upload, a batch job, a stepped flow — reach for **`ProgressBar`** (2.7.0) instead, driving its
`value` (0–100) from real progress:

```tsx
import { ProgressBar } from '@viax/uxm/ui';

<ProgressBar value={uploadedPct} label="Uploading…" />        {/* linear track + fill */}
<ProgressBar variant="ring" value={uploadedPct} />            {/* circular gauge */}
```

---

## 6. Modal dialog (`Dialog` + `Modal`)

`Dialog` is the headless shell (portal, backdrop, focus trap, scroll lock, dismissal);
`Modal` is the visible panel with compound slots.

```tsx
'use client';
import { useState } from 'react';
import { Dialog, Modal, ButtonPrimary, ButtonTertiary, Cluster } from '@viax/uxm/ui';

export function DeleteProjectButton({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ButtonTertiary onClick={() => setOpen(true)}>Delete…</ButtonTertiary>
      <Dialog open={open} onOpenChange={setOpen}>
        <Modal size="sm" onClose={() => setOpen(false)}>
          <Modal.Header>Delete project?</Modal.Header>
          <Modal.Body>This permanently removes the project and its data.</Modal.Body>
          <Modal.Footer>
            <Cluster gap={8} justify="end">
              <ButtonTertiary onClick={() => setOpen(false)}>Cancel</ButtonTertiary>
              <ButtonPrimary onClick={() => { onConfirm(); setOpen(false); }}>Delete</ButtonPrimary>
            </Cluster>
          </Modal.Footer>
        </Modal>
      </Dialog>
    </>
  );
}
```

For forms that must not dismiss accidentally, pass `closeOnEscape={false}`
`closeOnOutsideClick={false}` to `Dialog` and omit `onClose` (no header X).

---

## 7. Editable DataTable columns

Mark a column `editable` and wire an async `onCommit` — the cell handles click-to-edit,
Enter/blur commit, Esc cancel, a submitting state, and inline errors (a rejected promise keeps
the user in edit mode with the message in a popover).

```tsx
const columns: DataTableColumn<Deal>[] = [
  { key: 'name', header: 'Name', editable: true,
    validate: (v) => (String(v).trim() ? null : 'Name is required'),
    onCommit: (row, next) => api.renameDeal(row.id, String(next)) },
  { key: 'amount', header: 'Amount', align: 'right',
    editable: true, editor: 'number',
    formatValue: (v) => `$${Number(v).toLocaleString()}`,
    validate: (v) => (Number(v) < 0 ? 'Must be ≥ 0' : null),
    onCommit: (row, next) => api.updateAmount(row.id, Number(next)) },
  { key: 'owner', header: 'Owner', maxWidth: 160 }, // plain cell, ellipsis past 160px
];
```

`EditableCell` also works standalone (rename-in-place, KPI label editing) — same
commit/validate/error semantics outside a table.

---

## 8. Theme override per-instance (without touching MODO tokens)

```tsx
import { Card, ButtonPrimary } from '@viax/uxm/ui';

// Per-instance override: pass --uxm-* vars via inline style.
<Card style={{ '--uxm-card-padding': '24px' } as React.CSSProperties}>
  <ButtonPrimary
    style={{ '--uxm-button-primary-gap': '12px' } as React.CSSProperties}
  >
    Save
  </ButtonPrimary>
</Card>
```

---

## 9. App-wide brand re-tint (without MODO)

For self-hosted apps that don't use MODO brand-settings, override `--color-*` declarations in
a global CSS file that loads AFTER `tokens.css`:

```css
/* app/brand.css — imported after @viax/uxm/tokens.css */
:root {
  --color-accent: #FF4400;
  --color-accent-bold: #CC2200;
  --color-accent-light: #FFAA88;
  --color-accent-subtle: #FFE5DC;
}

/* Dark theme uses a separate selector — match the same vars */
[data-theme='dark'] {
  --color-accent: #FF8866;
  --color-accent-bold: #FFAA88;
}
```

Every component will pick this up instantly via its `var(--uxm-*, var(--color-*))` fallback chain.

---

## 10. Token-aware tooling (e.g. contrast audit)

```tsx
import {
  themeTokens,
  findToken,
  resolveHex,
} from '@viax/uxm/tokens';
import { parseColor, contrastRatio, wcagLevel } from '@viax/uxm';

const accentBold = findToken('--color-accent-bold');
const textInverse = findToken('--color-text-inverse');

// contrastRatio works on RGB objects — parse the resolved hex first
const fg = parseColor(resolveHex(textInverse?.cssVar ?? '#fff'));
const bg = parseColor(resolveHex(accentBold?.cssVar ?? '#000'));

if (fg && bg) {
  const ratio = contrastRatio(fg, bg);
  console.log({
    ratio,
    level: wcagLevel(ratio),   // 'AAA' | 'AA' | 'AA-large' | 'fail'
  });
}
```

---

## 11. Themable preview (BESPOKE host shell — raw preview primitives)

> Prefer the ready-made editor in recipe 12 (`UxmApp`). Reach for raw previews only when building a
> bespoke editor surface. Application code should NOT import previews — host shells (editors) only:

```tsx
import { ButtonPreview, type PreviewShellContext } from '@viax/uxm/previews';

function HostShellPanel({ shell }: { shell: PreviewShellContext }) {
  return (
    <ButtonPreview
      componentId="button-primary"
      styles={{
        backgroundColor: '#1E7150',
        borderRadius: 8,
        paddingX: 20,
        paddingY: 10,
      }}
      variants={{ state: 'hover' }}
      shell={shell}
    />
  );
}
```

---

## 12. Embed the ready-made style editor (`@viax/uxm/studio`)

Mount the whole MODO workbench in a host route — designers tune the brand live, no editor to build:

```tsx
import { UxmApp, createClientPersistence, generateOverridesCss } from '@viax/uxm/studio';
import '@viax/uxm/studio.css'; // in a non-Tailwind host, import BEFORE the host's global CSS

const persistence = createClientPersistence({
  // seed the studio with the host brand so it adopts them as its managed Accent tokens
  brand: { tokens: { light: { '--color-accent-bold': '#003da5' /* …host brand */ } } },
});

export function StylesPage() {
  return <UxmApp embed persistence={persistence} />; // `embed`: no full-page chrome
}
```

Apply the saved config to the WHOLE host (all routes) via the same generator the backend uses —
mount once at the app root and re-run whenever the saved config changes:

```tsx
import { generateOverridesCss } from '@viax/uxm/studio/generate-css';

function applyTheme(config) {
  const el =
    document.getElementById('uxm-overrides') ??
    document.head.appendChild(
      Object.assign(document.createElement('style'), { id: 'uxm-overrides' }),
    );
  el.textContent = generateOverridesCss(config.overrides ?? {}, config.brand ?? {});
}
```

The generated CSS also carries the **brand typeface** when one is set (Brand Settings →
Typography → `brand.fontFamily`): a Google-Fonts `@import`, `--brand-font` on `:root`, and
`body { font-family: var(--brand-font) !important }`. Declare the host's base font as
`body { font-family: var(--brand-font, var(--font-sans)) }` and don't hardcode a competing
family (see `design-tokens.md` → "Typography").

Persistence: `createHttpPersistence('/api/uxm')` (backend), `createClientPersistence` /
`createReadOnlyPersistence` (no backend, preview-only), or a `localStorage`-backed
`StudioPersistence` for save-that-persists. The host owns `data-theme` (light/dark) in `embed`
mode. See SKILL.md → "Embedding the style editor".

---

## 13. Row actions (⋮ menu) + bulk bar (2.6.0)

A `Menu` runs an action from a consumer-owned trigger (no held value — that's `Listbox`). Wire it
into a `DataTable` via `rowActions`, and surface multi-select operations with `BulkActionBar`.

```tsx
import { DataTable, BulkActionBar, type MenuEntry, type BulkAction } from '@viax/uxm/ui';

// Per-row ⋮ column — each action closes over its row.
const rowActions = (row: Deal): MenuEntry[] => [
  { key: 'edit', label: 'Edit', icon: 'pencil', onSelect: () => editDeal(row.id) },
  { key: 'duplicate', label: 'Duplicate', icon: 'copy', onSelect: () => cloneDeal(row.id) },
  // `subtitle` makes a two-line row — headline + supporting line.
  // Keep it short: it becomes part of the row's accessible name.
  { key: 'move', label: 'Move to…', subtitle: `Currently in ${row.stage}`, icon: 'folder',
    onSelect: () => moveDeal(row.id) },
  { separator: true, key: 'sep' },
  { key: 'delete', label: 'Delete', icon: 'trash', danger: true, onSelect: () => removeDeal(row.id) },
];

<DataTable rows={deals} columns={columns} rowKey={(d) => d.id} rowActions={rowActions} />

// Bulk bar — presentational; you own the selection state + positioning.
const actions: BulkAction[] = [
  { key: 'export', label: 'Export', icon: 'document', onClick: exportSelected },
  { key: 'delete', label: 'Delete', icon: 'trash', danger: true, onClick: deleteSelected },
];
{selected.size > 0 && (
  <BulkActionBar
    count={selected.size}
    actions={actions}
    onClear={() => setSelected(new Set())}
    style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)' }}
  />
)}
```

Standalone `Menu` (overflow / command list) owns only the trigger contract — spread `triggerProps`
onto any element: `<Menu items={...} renderTrigger={({ triggerProps }) => <IconButton {...triggerProps}><Icon glyph="kebab"/></IconButton>} />`.

---

## 14. Detail card with labelled editable rows

The entity-detail pattern — a card whose header and content are spaced by the card itself,
while the rows are muted side-labels with inline-editable values. Two independent gaps:
the Card's `gap` (header ↔ content) and the nested Stack's `gap` (row ↔ row). Note the
explicit `aria-label` on each `EditableCell`: its display state is a `<button>` that can't
take the label's `htmlFor`, so the cell names itself.

```tsx
'use client';

import { useState } from 'react';
import { Card, EditableCell, FormField, Stack } from '@viax/uxm/ui';

export function EntityDetailCard() {
  const [name, setName] = useState('Dental Customer Onboarding');
  const [status, setStatus] = useState('Active');

  return (
    <Card gap={20} padding={24} shadow>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Analytics Dashboard</div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Updated 2 hours ago</div>
      </div>

      <Stack gap={12}>
        <FormField label="Name" labelPosition="side" labelTint="muted">
          <EditableCell type="text" value={name} aria-label="Name" onCommit={(v) => setName(String(v))} />
        </FormField>
        <FormField label="Status" labelPosition="side" labelTint="muted">
          <EditableCell type="text" value={status} aria-label="Status" onCommit={(v) => setStatus(String(v))} />
        </FormField>
      </Stack>
    </Card>
  );
}
```

Caps "eyebrow" labels above editable values: swap to `labelVariant="overline"` (typography
only — the colour still comes from `labelTint`). Read-only metadata keeps using
`PropertyField`/`PropertyGrid`. Hairlines between rows: compose `Divider` between the
`FormField`s — deliberately not a Card prop.

---

## 15. Detail page: `PageHeader` meta, `PropertyField`/`PropertyGrid`, `BackLink`, horizontal rows

The four most commonly misused primitives on a read-only detail page, together:

```tsx
import {
  PageHeader,
  BackLink,
  PropertyField,
  PropertyGrid,
  Cluster,
  Tag,
  Avatar,
} from '@viax/uxm/ui';
import { useNavigate } from 'react-router-dom';

function OrderDetailPage({ order }: { order: Order }) {
  const navigate = useNavigate();

  return (
    <>
      {/* BackLink is a navigation <a>, not a button — it needs a real href for
          a11y/focusability even when you intercept the click for client-side nav. */}
      <BackLink href="/orders" onClick={(e) => { e.preventDefault(); navigate('/orders'); }}>
        Back to orders
      </BackLink>

      <PageHeader
        title={order.name}
        // `meta` renders inside a <p> — pass INLINE content only (string, <span>,
        // fragment). A block-level primitive like <Stack> here is invalid
        // <div>-in-<p> nesting and throws a hydration warning.
        meta={<>{order.id} &middot; Created {order.createdAt}</>}
        actions={<Tag type="success">{order.status}</Tag>}
      />

      {/* PropertyField takes CHILDREN, not a `value` prop — `value="…"` silently
          renders an empty cell. PropertyGrid's template is fixed
          (auto-fill, minmax(120px, 1fr)) — it has no `columns` / `minColumnWidth`
          prop; only the gaps are themable. */}
      <PropertyGrid>
        <PropertyField label="Order ID">{order.id}</PropertyField>
        <PropertyField label="Total">{formatMoney(order.total)}</PropertyField>
        <PropertyField label="Status">{order.status}</PropertyField>
      </PropertyGrid>

      {/* Horizontal row of items (e.g. a party card's avatar + name + role) —
          Stack is flex-COLUMN only; don't fight it with a flexDirection: 'row'
          override. Cluster is the actual horizontal primitive. */}
      <Cluster gap={12} align="center">
        <Avatar type="text" initials="AJ" />
        <div>{order.customer.name}</div>
      </Cluster>
    </>
  );
}
```

`ResponsiveGrid`'s `min` prop is a CSS length **string** (`"280px"`), not a bare number —
`min={280}` produces the invalid CSS `minmax(280, 1fr)` (missing unit), which the browser drops.
`PropertyGrid` has no equivalent prop at all — its floor is fixed.

---

## 16. Read-only theme picker (select among UXM Studio's published themes)

A header control letting end users pick which of several UXM Studio-published themes is applied —
**select only**, no create/rename/clone/import/export/delete (those live in UXM Studio itself). See
`viax-portal/references/BEM-based-app-generator-MetaPrompt.md` → *"Optional: read-only theme
picker"* for when a portal should build this (`{{THEME_PICKER}}` flag) and the accompanying
`theme-catalog.js` / `theme-store.js` data layer. This recipe covers just the header UI.

The `rows` are **pure environment data**: they derive from the `uxmStudio` config the connected
env published (fetched via `getMfaConfig`) — count, ids, names, and descriptions are arbitrary
and can change between sessions. Don't hardcode or special-case any theme name; render strictly
from the normalized rows, and let the data layer handle a remembered selection whose theme no
longer exists (fall back to the default theme, never crash).

Trigger: an accent `Tag` pill (current theme name + chevron) inside `<AppTopBar actions>`, opening
a **`Listbox` dropdown** (NOT a `Dialog`/`Modal` — a picker this small should be a lightweight
popover, not a page-blocking dialog) — one row per theme, each with an `Avatar`, name, optional
description, and (active row only) a `Tag type="success"` "Active" pill. `Listbox` owns the
popover, positioning, keyboard nav, and the open/close + selected/hover row styling itself — the
consumer only supplies `renderTrigger` and `renderItem`. `searchable={false}` — a 2–4 item theme
list never needs the search row `Listbox` shows by default past its `SEARCHABLE_AUTO_THRESHOLD`
(6). **No "Use" `Tag`/button on the other rows** — the whole row is already the click target
(`Listbox`'s own `onChange`), so a second, unlabeled clickable-looking pill on every non-active
row is redundant; only the current theme needs a badge at all.

```jsx
import { Avatar, Icon, Listbox, Tag } from '@viax/uxm/ui';

function ThemePicker({ rows, selectedId, onSelect }) {
  const selectedRow = rows.find((r) => r.id === selectedId) ?? null;
  const activeName = selectedRow?.name ?? 'Theme';

  return (
    <Listbox
      items={rows}
      getKey={(row) => row.id}
      getLabel={(row) => row.name}
      value={selectedRow}
      onChange={(row) => row && onSelect(row.id)}
      showCheckmark={false}
      searchable={false}
      matchAnchorWidth={false}
      minPanelWidth={300}
      maxPanelWidth={360}
      panelClassName="theme-picker__panel"
      aria-label="Select theme"
      renderTrigger={({ triggerProps }) => (
        <button type="button" {...triggerProps} aria-label={`Manage theme (current: ${activeName})`} className="theme-picker__trigger">
          <Tag type="accent" className="theme-picker__theme">
            <span className="theme-picker__theme-name">{activeName}</span>
            <Icon glyph="chevron-down" size={14} />
          </Tag>
        </button>
      )}
      renderItem={(row) => {
        const isActive = row.id === selectedId;
        return (
          <div className="theme-picker__row">
            <Avatar initials={row.name.slice(0, 2).toUpperCase()} className="theme-picker__avatar" />
            <div className="theme-picker__meta">
              <span className="theme-picker__name">{row.name}</span>
              {row.description && <span className="theme-picker__description">{row.description}</span>}
            </div>
            {isActive && (
              <Tag type="success" size="small">Active</Tag>
            )}
          </div>
        );
      }}
    />
  );
}
```

**Do not** nest a `<button>` (e.g. a click handler on the "Active" pill) inside `renderItem` —
the whole row IS the click target (`Listbox`'s own `<button role="option">` wrapper fires
`onChange`), and a nested interactive element inside it is invalid HTML. The "Active" `Tag` here
is purely informational; render it as a plain `Tag`, never wrapped in its own `onClick`.

Row layout — spacing between the avatar and the name — needs its own `gap` rule; nothing in
`@viax/uxm` supplies it for a hand-rolled row like this one (`.uxm-listbox__option` itself
already spaces the row from its neighbors and supplies selected/hover backgrounds — don't
re-implement that). Use **literal px values**, never `calc(var(--spacing) * N)` — `@viax/uxm`
ships no spacing-scale token (`--spacing` doesn't exist anywhere in the library), so that
`calc()` is invalid at computed-value time and the whole `gap` silently drops to `0`: the avatar
ends up jammed against the name (see design-tokens.md → Rules #5):

```css
.theme-picker__panel { --uxm-listbox-option-padding-y: 8px; }
.theme-picker__row { display: flex; align-items: center; gap: 12px; width: 100%; }
.theme-picker__avatar { flex-shrink: 0; }
.theme-picker__meta { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.theme-picker__name { display: block; font-size: 14px; color: var(--color-text); }
.theme-picker__description { font-size: 13px; color: var(--color-text-muted); }
```

Plain text dropped into `renderItem` (the row name/description here) has no `@viax/uxm` default
to inherit — it falls through to whatever the host's base font-size is. Since the `globals.css`
baseline (see the portal skill's "UXM Layout & Styling Gotchas") never resets `html`/`body`
font-size (don't add one — a handful of `@viax/uxm` layout widths, e.g. the sidebar, are sized in
`rem` off the 16px root; shrinking it shifts those too), that base defaults to the browser UA
16px — visibly bigger than the rest of the library's 11–14px component text. Give host-authored
text inside library containers (like this row) its own explicit `font-size` rather than relying
on inheritance.

`Listbox`'s default `matchAnchorWidth: true` would clamp the panel to the (intentionally narrow)
trigger pill's width — too tight for an avatar + name + description + status pill row. Set
`matchAnchorWidth={false}` and give the panel its own `minPanelWidth`/`maxPanelWidth` instead
(300–360px reads well for a 2–4 item theme list).

Optional per-row accent tint on the `Avatar` (paint each row with *that* theme's own accent, not
the currently-active one) via inline custom-property overrides:

```jsx
const accentColor = getThemeAccentColor(structure, row.id, uiMode); // 'light' | 'dark'
const avatarStyle = accentColor
  ? { '--uxm-avatar-background-color': accentColor, '--uxm-avatar-color': 'var(--color-text-inverse)' }
  : undefined;
<Avatar initials={...} style={avatarStyle} />
```

No confirm-before-switch step is needed here (contrast with a full theme *editor*, which warns
about discarding unpublished edits) — a pure picker has no in-progress state a switch could lose.

---

## Anti-patterns

❌ **Don't handroll a div with the same intent as an existing primitive.** Check the catalog
first — chances are `Card`, `Disclosure`, `PropertyField`, `MetaRow` already cover it.

❌ **Don't inline literal hex** when a token covers the intent. Use `--color-*` via `var()` so
MODO brand-settings can re-tint.

❌ **Don't import previews into application code.** They live behind `@viax/uxm/previews` for a
reason — host shells only.

❌ **Don't put `"use client"` on every file.** UXM components themselves don't need it. Only add
the directive to files that use hooks / state / event handlers.

❌ **Don't render labels manually next to `TextInput` / `Select` / `Textarea`.** The atoms are
intentionally bare; `FormField` owns label + help. Always wrap. (Field errors are the exception:
pass `error` to the atom itself — it renders the message.)

❌ **Don't use `Alert` or `NumberField` — they don't exist as of 2.0.0.** Use `Banner` and
`NumberStepper`.

❌ **Don't build a custom dropdown panel.** `Listbox` / `MultiListbox` own the popover, search,
keyboard nav, and ARIA; render your trigger via `renderTrigger` and spread `triggerProps`.

❌ **Don't fire toasts without a mounted `<Toaster/>`.** Mount it once at the app root; the
imperative `toast.*()` calls render through it.

❌ **Don't import from the root `@viax/uxm`** for production code. Prefer
`@viax/uxm/ui` for tree-shake-friendly per-component imports.

❌ **Don't pass `value` to `PropertyField`.** It takes `children`, not a `value` prop —
`<PropertyField label="Total" value={total} />` silently renders an empty value cell. Use
`<PropertyField label="Total">{total}</PropertyField>`.

❌ **Don't pass a block-level layout primitive (`Stack`, `Cluster`, a `<div>`) as `PageHeader`'s
`meta`.** It renders inside a `<p>` — only inline content (string, `<span>`, fragment) is valid
there; a block element causes invalid `<div>`-in-`<p>` nesting and a hydration warning.

❌ **Don't pass a bare number to `ResponsiveGrid`'s `min`.** It's a CSS length string
(`"280px"`), not `280` — a bare number produces an invalid `minmax(280, 1fr)` that the browser
silently drops. (`PropertyGrid` has no equivalent prop — its floor is fixed.)

❌ **Don't force `Stack` horizontal with a `flexDirection: 'row'` style override.** `Stack` is
flex-column by design (gap + align only, no direction prop) — reach for `Cluster` for any
horizontal row (party card avatar rows, button groups, inline chips).

❌ **Don't give `BackLink` only an `onClick`.** It renders as an `<a>`, so it needs a real `href`
for keyboard focus and right-click/open-in-new-tab — even when you `preventDefault()` to do
client-side navigation instead of a full page load.

❌ **Don't write `gap`/`padding`/`margin` as `calc(var(--spacing) * N)`.** `@viax/uxm` has no
spacing-scale token — `--spacing` doesn't exist anywhere in the library or its tokens.css. The
`calc()` becomes invalid at computed-value time and the whole declaration silently drops to
`0`/initial, collapsing rows and elements together with no error in the console. Use literal px
values instead (see design-tokens.md → Rules #5).
