# FileUpload

A drop-zone + file-picker atom that supports click-to-browse, drag-and-drop, and an inline per-file status list. The drop area and per-file rows are two independent state spaces — drop-area visuals don't auto-derive from per-row statuses, and vice versa.

`FileUpload` renders a `<label>` wrapping a visually-hidden but focusable `<input type="file">`, so keyboard focus on the input paints a focus ring on the visible label and `Enter`/`Space` activates the picker natively. The drop area writes its current visual state into a `data-state` attribute (`default` / `drag-over` / `uploading` / `error`), which CSS attribute selectors target. When `files` is provided, the component renders a `<ul>` below the drop area; each `<li>` carries its own `data-status` (`queued` / `uploading` / `done` / `error`) and paints icon, border, meta line, and a bottom progress strip independently. Per-row "uploading" status shows a `role="progressbar"` element driven by `file.progress` (0–1); per-row remove buttons stay enabled during uploading so the consumer can treat the click as a cancel signal.

## Usage

```tsx
import { FileUpload, type FileUploadFileMeta } from '@viax.io/uxm';

function Example() {
  const [files, setFiles] = useState<FileUploadFileMeta[]>([]);
  return (
    <FileUpload
      multiple
      accept=".pdf,.docx"
      allowedTypesText="PDF, DOCX · up to 10 MB"
      files={files}
      onFiles={(picked) => setFiles(addToQueue(picked))}
      onRemove={(id) => setFiles((cur) => cur.filter((f) => f.id !== id))}
    />
  );
}
```

## Props

### `FileUploadProps`

`FileUpload` does **not** extend `HTMLAttributes` — only the listed props are accepted.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `'default' \| 'drag-over' \| 'uploading' \| 'error'` | derived | Force the drop-area visual state. Overrides internal drag detection. Use sparingly — the atom flips to `drag-over` during drag and to `error` automatically when `errorMessage` is set. |
| `multiple` | `boolean` | `true` | Allow selecting more than one file. Drives the `<input>` attribute and the default help text. |
| `accept` | `string` | – | Standard `<input type="file" accept>` filter. |
| `disabled` | `boolean` | `false` | Disables interaction, drop, and all per-row remove buttons. Painted via `data-disabled="true"`. |
| `titleText` | `string` | `'Upload a file'` | Heading text inside the drop area. |
| `helpText` | `string` | `multiple`-aware default | Hint line below the title. Replaced with `"Uploading…"` while `state === 'uploading'`. |
| `allowedTypesText` | `string` | – | Optional constraint copy (e.g. `"PDF, DOCX · up to 10 MB"`). Not enforced — caller-controlled. Hidden during `uploading`. |
| `errorMessage` | `string` | – | Page-level error rendered below the drop area; also flips the drop area to the `error` state automatically. |
| `files` | `FileUploadFileMeta[]` | `[]` | Files to render inline. When non-empty, the `<ul>` renders below the drop area. |
| `onFiles` | `(files: File[]) => void` | – | Fires on dialog pick **or** drop. |
| `onRemove` | `(id: string) => void` | – | Fires when a row's trash button is clicked. Caller decides cancel vs delete semantics by status. |
| `onOpenFile` | `(id: string) => void` | – | Fires when a row's download control is activated. Renders the control as a `<button>`. **Takes precedence over `href`.** |
| `downloadGlyph` | `string` | `'arrow-down'` | Glyph for the download control. Use `'arrow-up-right'` when the file opens rather than saves. |
| `downloadLabel` | `string` | `'Download'` | Verb in the control's accessible name (`` `${downloadLabel} ${name}` ``). Change it **with** `downloadGlyph` — the glyph corrects the promise for sighted users only. |
| `onDragEnter` | `(e: DragEvent<HTMLLabelElement>) => void` | – | Forwarded after internal drag-state update. |
| `onDragLeave` | `(e: DragEvent<HTMLLabelElement>) => void` | – | Forwarded after internal drag-state update. |
| `onError` | `(reason: string) => void` | – | Documented for caller-driven validation; the atom itself never invokes it. |
| `iconGlyph` | `string` | `'cloud-arrow-up'` | Override the drop-area icon glyph. |
| `children` | `ReactNode` | – | Optional slot rendered between the drop area / page error and the file list. |
| `className` | `string` | – | Appended to the outer wrapper. |
| `style` | `CSSProperties` | – | Inline styles forwarded to the wrapper — used to project custom-property knobs. |

### `FileUploadFileMeta`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | Stable key for React reconciliation and `onRemove` callbacks. |
| `name` | `string` | yes | Filename displayed in the row. |
| `size` | `number` | yes | Bytes. Formatted into a human-readable size by the atom. |
| `status` | `'queued' \| 'uploading' \| 'done' \| 'error'` | no | Defaults to `'queued'`. Drives the row's icon, meta line, border, and progress strip. |
| `progress` | `number` | no | 0–1 fraction. Used only when `status === 'uploading'`. Omit for indeterminate ("Uploading…"). |
| `errorMessage` | `string` | no | Used only when `status === 'error'`. Replaces the size meta on the row in danger styling. |
| `href` | `string` | no | Direct URL for a stored file. On a `done` row renders the trailing control as `<a href download>`. **Only when the URL is fetchable unauthenticated** — see Downloads below. |

### `FileUploadState`

```ts
type FileUploadState = 'default' | 'drag-over' | 'uploading' | 'error';
```

### `FileStatus`

```ts
type FileStatus = 'queued' | 'uploading' | 'done' | 'error';
```

## Downloads

A `done` row can offer the file back to the user. Two ways in, because they suit
different storage setups — **pick by whether a browser can fetch the URL on its own:**

| | Use when | Renders |
|---|---|---|
| `href` on the row | The URL is public or pre-signed | `<a href download>` |
| `onOpenFile(id)` | The URL needs an auth header or a signed-URL round trip | `<button>` |

`href` is the better option **when it works**, because only a real anchor gives the
browser's own affordances: ⌘/middle-click to a new tab, right-click → "Save link as",
and the native download UI. A button and some JS cannot reproduce any of those.

But an anchor navigation carries no `Authorization` header, so a token-protected URL
returns 401. That is what `onOpenFile` is for — fetch the bytes yourself and save them:

```tsx
<FileUpload
  files={attachments.map((a) => ({ id: a.id, name: a.name, size: a.size, status: 'done' }))}
  onOpenFile={async (id) => {
    const a = attachments.find((x) => x.id === id)!;
    const res = await fetch(a.url, { headers: authHeader() });
    const url = URL.createObjectURL(await res.blob());
    const link = Object.assign(document.createElement('a'), { href: url, download: a.name });
    link.click();
    URL.revokeObjectURL(url); // or the whole file stays in memory until reload
  }}
/>
```

Two things that bite:

- **`download` is ignored cross-origin.** If the file is served from another origin, the
  browser navigates to it instead of saving it. The anchor carries `target="_blank"` so
  that navigation opens a new tab rather than taking the app's — same-origin the
  `download` attribute wins and no tab opens, so it costs nothing there. Still pass
  `downloadGlyph="arrow-up-right"` **and** `downloadLabel="Open"` so neither the icon nor
  the accessible name promises a save the browser won't perform, or route through
  `onOpenFile` and a blob.
- **Name the blob.** The `download` attribute sets the saved filename; without it the
  browser uses the URL's last segment, so a storage key lands on disk as a UUID.

Setting both is allowed and `onOpenFile` wins — a consumer that supplied a handler wants
control over what opening means, and silently downgrading it to a bare navigation would
break exactly the auth case it was reached for. Setting neither renders no control at all,
which is how every consumer written before this existed behaves.

While `disabled`, the anchor form drops its `href` rather than merely greying out. A
disabled-looking link that keeps its `href` stays in the tab order and still follows on
Enter — CSS can only ever block the mouse. The control stays visible and greyed, exactly
like the remove button beside it, but it is genuinely inert.

Note the control appears **only on `done` rows** — there is nothing stored to fetch until
an upload settles. To stop the name column jumping 24px wide at that moment, rows without
a control render an inert placeholder whenever any row in the list could have one.

## CSS variables

### Wrapper

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-file-upload-wrapper-gap` | – | `10px` | Gap between drop area, page error, children, and file list. |

### Drop area

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-file-upload-gap` | – | `8px` | Gap between icon/title/help/allowed-types. |
| `--uxm-file-upload-bg` | `--color-card` | – | Drop-area background (idle). |
| `--uxm-file-upload-color` | `--color-text` / `--color-text-strong` | – | Drop-area text color (also title color). |
| `--uxm-file-upload-border-width` | – | `1.5px` | Border width. |
| `--uxm-file-upload-border-style` | – | `dashed` | Border style. |
| `--uxm-file-upload-border-color` | `--color-border` | – | Border color (idle). |
| `--uxm-file-upload-border-radius` | – | `12px` | Corner radius. |
| `--uxm-file-upload-padding-y` | – | `24px` | Vertical padding. |
| `--uxm-file-upload-padding-x` | – | `24px` | Horizontal padding. |
| `--uxm-file-upload-min-height` | – | `160px` | Minimum height. |
| `--uxm-file-upload-icon-color` | `--color-accent` | – | Drop-area icon color (idle). |
| `--uxm-file-upload-icon-size` | – | `40px` | Drop-area icon size. |
| `--uxm-file-upload-title-size` | – | `15px` | Title font size. |
| `--uxm-file-upload-help-size` | – | `13px` | Help-line font size. |
| `--uxm-file-upload-help-color` | `--color-text-muted` | – | Help-line color. |
| `--uxm-file-upload-allowed-types-size` | – | `11px` | Allowed-types line font size. |
| `--uxm-file-upload-allowed-types-color` | `--color-text-subtle` (→ `--color-text-muted`) | – | Allowed-types line color. |
| `--uxm-file-upload-hover-bg` | `--color-card` | – | Background on hover / forced `data-state="hover"`. |
| `--uxm-file-upload-hover-border` | `--color-accent` | – | Border on hover / forced `data-state="hover"`. |
| `--uxm-file-upload-drag-bg` | `color-mix(srgb, --color-accent 8%, --color-card)` | – | Background under `drag-over`. |
| `--uxm-file-upload-drag-border` | `--color-accent` | – | Border under `drag-over`. |
| `--uxm-file-upload-drag-border-style` | – | `solid` | Border style under `drag-over`. |
| `--uxm-file-upload-drag-accent` | `--color-accent` | – | Icon color under `drag-over`. |
| `--uxm-file-upload-focus-border` | `--color-accent` | – | Border under `:focus-within` / forced `data-state="focus"`. |
| `--uxm-file-upload-focus-ring` | `--color-accent` | – | 2px outline color under focus. |
| `--uxm-file-upload-error-bg` | `--color-card` | – | Background under `error`. |
| `--uxm-file-upload-error-border` | `--color-danger-text` | – | Border under `error`. |
| `--uxm-file-upload-error-color` | `--color-danger-text` | – | Page-error message text color. |
| `--uxm-file-upload-error-message-size` | – | `12px` | Page-error message font size. |
| `--uxm-file-upload-disabled-opacity` | – | `0.6` | Opacity under `data-disabled="true"`. |
| `--uxm-file-upload-disabled-bg` | `--color-surface-alt` | – | Background when disabled. |
| `--uxm-file-upload-disabled-border` | `--color-border` | – | Border when disabled. |
| `--uxm-file-upload-disabled-color` | `--color-text-muted` | – | Text + icon color when disabled. |

### File rows

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-file-upload-row-gap` | – | `6px` | Vertical gap between rows. |
| `--uxm-file-upload-row-bg` | `--color-surface` | – | Row background (idle). |
| `--uxm-file-upload-row-border` | `--color-border` | – | Row border (idle). |
| `--uxm-file-upload-row-radius` | – | `8px` | Row corner radius. |
| `--uxm-file-upload-row-padding-y` | – | `8px` | Row vertical padding. |
| `--uxm-file-upload-row-padding-x` | – | `12px` | Row horizontal padding. |
| `--uxm-file-upload-row-icon-color` | `--color-accent` | – | Row icon (idle / queued / uploading). |
| `--uxm-file-upload-row-name-color` | `--color-text-strong` | – | Row filename color. |
| `--uxm-file-upload-row-meta-color` | `--color-text-muted` | – | Row meta line color (idle). |
| `--uxm-file-upload-remove-icon-color` | `--color-text-muted` | – | Trash button color (idle). |
| `--uxm-file-upload-remove-icon-hover-color` | `--color-danger-text` | – | Trash button color on hover. |
| `--uxm-file-upload-download-icon-color` | `--color-text-muted` | – | Download control color (idle). |
| `--uxm-file-upload-download-icon-hover-color` | `--color-accent` | – | Download control color on hover. No studio knob — the workbench cannot force a row hover, same as the remove button's. |
| `--uxm-file-upload-progress-height` | – | `2px` | Per-row progress strip height. |
| `--uxm-file-upload-progress-fill` | `--color-accent` | – | Progress strip color. |
| `--uxm-file-upload-row-progress` | – | `0%` | Progress strip width (set inline by the component from `file.progress`). |
| `--uxm-file-upload-row-done-bg` | `--color-success-bg` | – | Row background under `data-status="done"`. |
| `--uxm-file-upload-row-done-border-color` | `--color-success-border` | – | Row border under `data-status="done"`. |
| `--uxm-file-upload-row-done-icon-color` | `--color-success-text` (→ `--color-accent`) | – | Row icon under `data-status="done"`. |
| `--uxm-file-upload-row-error-bg` | `--color-danger-bg` | – | Row background under `data-status="error"`. |
| `--uxm-file-upload-row-error-border-color` | `--color-danger-border` (→ `--color-danger-text`) | – | Row border under `data-status="error"`. |
| `--uxm-file-upload-row-error-icon-color` | `--color-danger-text` | – | Row icon under `data-status="error"`. |
| `--uxm-file-upload-row-error-meta-color` | `--color-danger-text` | – | Row meta line under `data-status="error"`. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-card` | Surfaces / Card | Drop-area background (idle, hover, error). |
| `--color-surface` | Surfaces / Surface | File-row background (idle). |
| `--color-surface-alt` | Surfaces / Surface Alt | Drop-area background when disabled. |
| `--color-border` | Borders / Border | Drop-area border (idle, disabled) + row border. |
| `--color-text` | Text / Text | Drop-area text color. |
| `--color-text-strong` | Text / Text Strong | Title, file-row name. |
| `--color-text-muted` | Text / Text Muted | Help line, allowed-types fallback, row meta, disabled text, remove icon. |
| `--color-text-subtle` | Text / Text Subtle | Allowed-types line (primary). |
| `--color-accent` | Accent / Accent | Drop-area icon, hover/drag/focus border + outline, drag bg mix, row icon, progress fill. |
| `--color-success-bg` | Semantic / Success Bg | Row bg under done status. |
| `--color-success-border` | Semantic / Success Border | Row border under done status. |
| `--color-success-text` | Semantic / Success Text | Row icon under done status. |
| `--color-danger-bg` | Semantic / Danger Bg | Row bg under error status. |
| `--color-danger-border` | Semantic / Danger Border | Row border under error status. |
| `--color-danger-text` | Semantic / Danger Text | Page error border + text, remove-button hover, row error icon/border/meta. |

## States & variants

### Drop area

| State | Trigger | Visual |
|-------|---------|--------|
| `default` | – | Card background, dashed border in border token, accent icon. |
| `hover` | `:hover` or forced `state="hover"` | Border switches to accent. |
| `drag-over` | Drag enters the label, or forced `state="drag-over"` | Background mixes in accent at 8%, border becomes solid accent, icon re-tints accent. |
| `focus` | `:focus-within` (input takes keyboard focus) or forced `state="focus"` | Accent border + 2px accent outline (offset 2px). |
| `uploading` | Forced `state="uploading"` | Cursor switches to `progress`; help text swaps to `"Uploading…"`; allowed-types line hidden; `aria-busy="true"`. |
| `error` | `errorMessage` set, or forced `state="error"` | Border switches to danger; page-level error message rendered below in danger styling; `aria-invalid="true"` on the input. |
| `disabled` | `disabled={true}` (writes `data-disabled="true"`) | Surface-alt background, muted text + icon, dimmed opacity, `not-allowed` cursor. |

### File rows

| Status | Trigger | Visual |
|--------|---------|--------|
| `queued` | default / explicit | Document icon, surface background, size meta. |
| `uploading` | `status: 'uploading'` | Document icon; meta becomes `"Uploading · {pct}% of {size}"` (or `"Uploading…"` if no `progress`); 2px progress strip along the bottom; `role="progressbar"` with `aria-valuenow`. |
| `done` | `status: 'done'` | Check-circle icon in success-text color, success-bg background, success-border border. |
| `error` | `status: 'error'` | Exclamation-circle icon in danger, danger-bg background, danger-border border, per-file `errorMessage` (or `"Upload failed"`) in danger meta. |

## Accessibility

- The visible `<label>` wraps a visually-hidden but focusable `<input type="file">` (clip-path keeps it tab-focusable). Keyboard focus on the input paints a focus ring on the label via `:focus-within`, and `Enter`/`Space` activates the picker natively — no custom key handler required.
- The drop-area icon and per-row icons are `aria-hidden="true"` — purely decorative.
- The help text is wired to the input via `aria-describedby`, so screen readers announce the hint along with the field.
- Page-level error sets `aria-invalid="true"` on the input. Per-file errors are NOT announced automatically — surface them via a live region if you need immediate feedback.
- `aria-busy="true"` is set on the label while `state === 'uploading'`, signaling the page-level busy phase. Per-row uploading rows do **not** propagate this — each row's progress strip is the per-file signal.
- Per-row remove buttons carry contextual `aria-label`s — `"Cancel {name}"` when uploading, `"Remove {name}"` otherwise. They stay enabled during uploading so cancel is always available.
- Per-row progress strips render with `role="progressbar"`, `aria-valuemin={0}`, `aria-valuemax={100}`, and `aria-valuenow` (rounded percent) when `progress` is provided. Indeterminate uploading rows omit `aria-valuenow`.
- Drag-and-drop is mouse/pointer only — keyboard users rely on the file picker. The `data-state="drag-over"` visuals are purely informational for the dragging pointer.
- `accept` is hint-only — the browser does not enforce it on drop, and the atom does not validate either. Use `onFiles` to filter and surface errors via `errorMessage` or per-file `status: 'error'`.
