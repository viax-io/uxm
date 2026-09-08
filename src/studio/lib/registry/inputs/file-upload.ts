import type { ComponentDef } from '../../types';

export const fileUploadDef: ComponentDef = {
  id: 'file-upload',
  name: 'File Upload',
  category: 'Inputs',
  description: 'File-upload atom. Click anywhere on the drop area opens the system file picker; dragging files in fires the drag-over state and drop sends them to `onFiles`. Two state spaces: (1) drop-area state covers default / hover / drag-over / focus / disabled / error (page-level errors only), and (2) per-file lifecycle status — `queued | uploading | done | error` — lives on each `FileUploadFileMeta.status` and paints each row independently. The drop area never shows an aggregate progress bar; each row has its own. Visual-only atom: no built-in upload; `onFiles` returns native `File[]` for the caller to drive. v2 backlog: image rows render a `Thumbnail` preview keyed off MIME instead of the generic document glyph.',
  styleProperties: [
    // ── Per-state drop-area surface colors ──
    // Note: `dropAreaColors` (not the generic `fieldColors` used by
    // input-text / textarea / etc.) — the dropzone is a drop area, not
    // a text field. Same shape as fieldColors otherwise: bg / border /
    // text per state, gated by `showWhen: { state }`.
    // Default
    { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'dropAreaColors', showWhen: { state: 'default' } },
    { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'dropAreaColors', showWhen: { state: 'default' } },
    { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'dropAreaColors', showWhen: { state: 'default' } },
    // Hover
    { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'dropAreaColors', showWhen: { state: 'hover' } },
    { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'dropAreaColors', showWhen: { state: 'hover' } },
    // Drag-over — overlay style: only the surface bg / border / icon tint change.
    { key: 'dragBg', label: 'Background', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-accent) 8%, var(--color-card))', section: 'dragState', showWhen: { state: 'drag-over' } },
    { key: 'dragBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'dragState', showWhen: { state: 'drag-over' } },
    { key: 'dragAccent', label: 'Icon Tint', control: 'color', defaultValue: 'var(--color-accent)', section: 'dragState', showWhen: { state: 'drag-over' } },
    // Focus — paints via :focus-within on the label (the hidden input owns focus).
    { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'dropAreaColors', showWhen: { state: 'focus' } },
    { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    // Error — surface tint + dedicated message slot below the drop area.
    { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'dropAreaColors', showWhen: { state: 'error' } },
    { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'dropAreaColors', showWhen: { state: 'error' } },
    { key: 'errorColor', label: 'Message Color', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
    { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
    // Disabled
    { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'dropAreaColors', showWhen: { state: 'disabled' } },
    { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'dropAreaColors', showWhen: { state: 'disabled' } },
    { key: 'disabledColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'dropAreaColors', showWhen: { state: 'disabled' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.6, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // ── Shared geometry (always visible) ──
    { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 24, step: 1, unit: 'px' },
    { key: 'borderStyle', label: 'Border Style', control: 'select', defaultValue: 'dashed', options: ['dashed', 'solid', 'dotted'] },
    { key: 'borderWidth', label: 'Border Width', control: 'slider', defaultValue: 1.5, min: 1, max: 4, step: 0.5, unit: 'px' },
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 24, min: 8, max: 48, step: 2, unit: 'px' },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 24, min: 8, max: 64, step: 2, unit: 'px' },
    { key: 'minHeight', label: 'Min Height', control: 'number', defaultValue: 160, min: 80, max: 320, step: 10, unit: 'px' },
    { key: 'gap', label: 'Gap', control: 'number', defaultValue: 8, min: 0, max: 24, step: 1, unit: 'px' },
    // ── Icon sub-element ──
    { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 40, min: 20, max: 72, step: 2, unit: 'px', section: 'icon' },
    { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'icon' },
    // ── Text sub-elements ──
    { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 15, min: 12, max: 22, step: 1, unit: 'px', section: 'text' },
    { key: 'helpSize', label: 'Help Size', control: 'number', defaultValue: 13, min: 10, max: 16, step: 1, unit: 'px', section: 'text' },
    { key: 'helpColor', label: 'Help Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'text' },
    { key: 'allowedTypesSize', label: 'Allowed-types Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px', section: 'text' },
    { key: 'allowedTypesColor', label: 'Allowed-types Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'text' },
    // ── File-list row knobs (only consumed when `withList: on`) ──
    { key: 'rowBg', label: 'Row Background', control: 'color', defaultValue: 'var(--color-surface)', section: 'fileList' },
    { key: 'rowBorder', label: 'Row Border', control: 'color', defaultValue: 'var(--color-border)', section: 'fileList' },
    { key: 'rowRadius', label: 'Row Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px', section: 'fileList' },
    { key: 'rowGap', label: 'Row Gap', control: 'number', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px', section: 'fileList' },
    { key: 'rowPaddingX', label: 'Row Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px', section: 'fileList' },
    { key: 'rowPaddingY', label: 'Row Padding Y', control: 'number', defaultValue: 8, min: 2, max: 20, step: 1, unit: 'px', section: 'fileList' },
    { key: 'rowNameColor', label: 'Filename', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'fileList' },
    { key: 'rowMetaColor', label: 'Meta Text', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fileList' },
    { key: 'rowIconColor', label: 'File Icon', control: 'color', defaultValue: 'var(--color-accent)', section: 'fileList' },
    { key: 'removeIconColor', label: 'Remove Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fileList' },
    // Download control. The key does not collide with REAL_CSS_PROPS, so the
    // generic `--uxm-file-upload-{kebab}` fallback already lands on the name
    // the stylesheet reads — no PER_COMPONENT_MAPPING entry needed.
    // No hover knob on purpose: the registry's `state` variants drive the DROP
    // AREA, not the rows, so a row-hover knob would save a value the canvas
    // could never show changing. `--uxm-file-upload-download-icon-hover-color`
    // stays available to consumers, exactly as the remove button's does.
    { key: 'downloadIconColor', label: 'Download Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'fileList' },
    // ── File List · Progress ──
    // Per-row progress strip (applied during status="uploading"). It's a
    // single thin colored bar painted directly on the row's bottom edge —
    // no separate track element, so no `progressTrack` knob (the row's
    // own background IS the implicit track at 2px height).
    { key: 'progressFill', label: 'Progress Fill', control: 'color', defaultValue: 'var(--color-accent)', section: 'fileListProgress' },
    { key: 'progressHeight', label: 'Progress Height', control: 'number', defaultValue: 2, min: 1, max: 6, step: 1, unit: 'px', section: 'fileListProgress' },
    // ── File List · Status ──
    // Per-status visual overrides — "what changes when a row succeeds or
    // fails." Grouped together because they're all conditional styling
    // on the same base row, not standalone properties of any one state.
    { key: 'rowDoneBg', label: 'Done Background', control: 'color', defaultValue: 'var(--color-success-bg)', section: 'fileListStatus' },
    { key: 'rowDoneBorderColor', label: 'Done Border', control: 'color', defaultValue: 'var(--color-success-border)', section: 'fileListStatus' },
    { key: 'rowDoneIconColor', label: 'Done Icon', control: 'color', defaultValue: 'var(--color-success-text)', section: 'fileListStatus' },
    { key: 'rowErrorBg', label: 'Error Background', control: 'color', defaultValue: 'var(--color-danger-bg)', section: 'fileListStatus' },
    { key: 'rowErrorBorderColor', label: 'Error Border', control: 'color', defaultValue: 'var(--color-danger-border)', section: 'fileListStatus' },
    { key: 'rowErrorIconColor', label: 'Error Icon', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fileListStatus' },
    { key: 'rowErrorMetaColor', label: 'Error Text', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'fileListStatus' },
  ],
  layoutVariants: [
    {
      key: 'state',
      label: 'State',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'hover', label: 'Hover' },
        { value: 'drag-over', label: 'Drag Over' },
        { value: 'focus', label: 'Focus' },
        { value: 'uploading', label: 'Uploading' },
        { value: 'error', label: 'Error' },
        { value: 'disabled', label: 'Disabled' },
      ],
      defaultValue: 'default',
    },
  ],
  events: [
    { name: 'onFiles', description: 'Fires when the user picks files (via picker or drop). Receives a native `File[]`.', payload: 'File[]' },
    { name: 'onRemove', description: "Fires when a row's remove button is clicked (only when `showFileList` is on).", payload: '{ id: string }' },
    { name: 'onDragEnter', description: 'Fires when a drag enters the drop area.', payload: 'DragEvent' },
    { name: 'onDragLeave', description: 'Fires when a drag leaves the drop area.', payload: 'DragEvent' },
    { name: 'onError', description: 'Fires when the caller rejects a drop (e.g. wrong MIME). The atom never fires this on its own — drive it from your validation in `onFiles`.', payload: '{ reason: string }' },
  ],
  api: {
    importPath: '@viax.io/uxm/ui',
    importNames: 'FileUpload',
    props: [
      { name: 'onFiles', type: '(files: File[]) => void', description: 'Receives picked or dropped files.' },
      { name: 'onRemove', type: '(id: string) => void', description: "Called when a row's remove button is clicked. Only meaningful with `showFileList`." },
      { name: 'multiple', type: 'boolean', defaultValue: 'true', description: 'Allow selecting more than one file at a time. Maps to `<input multiple>`.' },
      { name: 'accept', type: 'string', description: 'Standard `<input accept>` filter, e.g. `"image/*"` or `".pdf,.docx"`. Runtime prop — not a workbench knob.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables click + drop interactions.' },
      { name: 'titleText', type: 'string', defaultValue: '"Upload a file"', description: 'Heading inside the drop area.' },
      { name: 'helpText', type: 'string', description: 'Hint line under the title. Defaults to a `multiple`-aware string if omitted.' },
      { name: 'allowedTypesText', type: 'string', description: 'Optional constraint line below the help text — e.g. "PDF, DOCX · up to 10 MB". Caller-controlled copy: the atom never invents it and never enforces it. Keep it in sync with the `accept` filter and your `onFiles` validation. If omitted, no slot renders.' },
      { name: 'error', type: 'string', description: 'Page-level error message (e.g. "Connection lost"). Paints the drop area in the `error` state and renders the message below it. Named `error` to match the rest of the input family. Distinct from per-file errors — set `status: "error"` + `errorMessage` on a `FileUploadFileMeta` for single-file failures.' },
      { name: 'errorMessage', type: 'string', description: 'Deprecated alias for `error` (back-compat); `error` wins when both are set.' },
      { name: 'files', type: 'FileUploadFileMeta[]', description: "Files to display in the inline list under the drop area. Each row: `{ id, name, size, status?, progress?, errorMessage? }`. `status` is `queued | uploading | done | error` and drives row rendering independently. List is always rendered when `files.length > 0` — to keep the list elsewhere on the page, just don't pass `files` to the atom." },
      { name: 'state', type: '"default" | "drag-over" | "uploading" | "error"', description: 'Drop-area visual state. Caller-controlled — the atom never auto-derives this from per-file statuses. Set `"uploading"` for batch lockouts / pre-file validation / indeterminate uploads; the help text swaps to "Uploading…" and `aria-busy` is applied. Per-file states (queued/uploading/done/error) live on each `FileUploadFileMeta.status` and are orthogonal to this.' },
      { name: 'iconGlyph', type: 'string', defaultValue: '"cloud-arrow-up"', description: 'Override the drop-area icon glyph.' },
    ],
  },
};
