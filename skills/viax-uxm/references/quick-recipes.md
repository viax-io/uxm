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
  Icon,
  type AppSidebarSection,
} from '@viax/uxm/ui';

const sections: AppSidebarSection[] = [
  {
    label: 'Workspace',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: <Icon glyph="dashboard" /> },
      { href: '/projects', label: 'Projects', icon: <Icon glyph="folder" /> },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell
      variant="standard"
      sidebar={<AppSidebar brand={{ name: 'My App' }} sections={sections} />}
      topBar={<AppTopBar title="Dashboard" />}
    >
      <PageHeader
        icon={<Icon glyph="dashboard" />}
        title="Dashboard"
        meta="Updated 2 min ago"
      />
      {children}
    </PageShell>
  );
}
```

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
        icon={<Icon glyph="external" />}
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
      icon={<Icon glyph="folder" />}
      title="No projects yet"
      body="Create your first project to get started."
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
import { contrastRatio, wcagLevel } from '@viax/uxm';

const accentBold = findToken('--color-accent-bold');
const textInverse = findToken('--color-text-inverse');

const fg = resolveHex(textInverse?.cssVar ?? '#fff');
const bg = resolveHex(accentBold?.cssVar ?? '#000');

console.log({
  ratio: contrastRatio(fg, bg),
  level: wcagLevel(fg, bg),   // 'AAA' | 'AA' | 'fail'
});
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
