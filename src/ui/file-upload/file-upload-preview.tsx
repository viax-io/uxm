import { useState, type CSSProperties } from 'react';

import type { PreviewProps } from '@/previews/types';
import { FileUpload, type FileUploadFileMeta, type FileUploadState } from '@/ui';

type Styles = PreviewProps['styles'];

/**
 * Project every registry knob onto the wrapper as a `--uxm-file-upload-*`
 * custom property. The real `<FileUpload>` reads them through the styles.css
 * `:hover` / `:focus-within` / `[data-state]` / `[data-status]` rules — so
 * panel edits paint immediately and real pointer / keyboard interaction
 * exercises the same production CSS that ships to consumers.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    // Default surface
    '--uxm-file-upload-bg': styles.backgroundColor as string,
    '--uxm-file-upload-color': styles.color as string,
    '--uxm-file-upload-border-color': styles.borderColor as string,
    // Shared geometry
    '--uxm-file-upload-border-radius': `${styles.borderRadius}px`,
    '--uxm-file-upload-border-style': styles.borderStyle as string,
    '--uxm-file-upload-border-width': `${styles.borderWidth}px`,
    '--uxm-file-upload-padding-x': `${styles.paddingX}px`,
    '--uxm-file-upload-padding-y': `${styles.paddingY}px`,
    '--uxm-file-upload-min-height': `${styles.minHeight}px`,
    '--uxm-file-upload-gap': `${styles.gap}px`,
    // Hover
    '--uxm-file-upload-hover-bg': styles.hoverBg as string,
    '--uxm-file-upload-hover-border': styles.hoverBorder as string,
    // Drag-over
    '--uxm-file-upload-drag-bg': styles.dragBg as string,
    '--uxm-file-upload-drag-border': styles.dragBorder as string,
    '--uxm-file-upload-drag-accent': styles.dragAccent as string,
    // Focus
    '--uxm-file-upload-focus-border': styles.focusBorder as string,
    '--uxm-file-upload-focus-ring': styles.focusRing as string,
    // Page-level error
    '--uxm-file-upload-error-bg': styles.errorBg as string,
    '--uxm-file-upload-error-border': styles.errorBorder as string,
    '--uxm-file-upload-error-color': styles.errorColor as string,
    '--uxm-file-upload-error-message-size': `${styles.errorMessageSize}px`,
    // Disabled
    '--uxm-file-upload-disabled-bg': styles.disabledBg as string,
    '--uxm-file-upload-disabled-border': styles.disabledBorder as string,
    '--uxm-file-upload-disabled-color': styles.disabledColor as string,
    '--uxm-file-upload-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    // Icon
    '--uxm-file-upload-icon-size': `${styles.iconSize}px`,
    '--uxm-file-upload-icon-color': styles.iconColor as string,
    // Text
    '--uxm-file-upload-title-size': `${styles.titleSize}px`,
    '--uxm-file-upload-help-size': `${styles.helpSize}px`,
    '--uxm-file-upload-help-color': styles.helpColor as string,
    '--uxm-file-upload-allowed-types-size': `${styles.allowedTypesSize}px`,
    '--uxm-file-upload-allowed-types-color': styles.allowedTypesColor as string,
    // File list — base row knobs
    '--uxm-file-upload-row-bg': styles.rowBg as string,
    '--uxm-file-upload-row-border': styles.rowBorder as string,
    '--uxm-file-upload-row-radius': `${styles.rowRadius}px`,
    '--uxm-file-upload-row-gap': `${styles.rowGap}px`,
    '--uxm-file-upload-row-padding-x': `${styles.rowPaddingX}px`,
    '--uxm-file-upload-row-padding-y': `${styles.rowPaddingY}px`,
    '--uxm-file-upload-row-name-color': styles.rowNameColor as string,
    '--uxm-file-upload-row-meta-color': styles.rowMetaColor as string,
    '--uxm-file-upload-row-icon-color': styles.rowIconColor as string,
    '--uxm-file-upload-remove-icon-color': styles.removeIconColor as string,
    '--uxm-file-upload-download-icon-color': styles.downloadIconColor as string,
    // File list — progress strip (per-row, status="uploading")
    '--uxm-file-upload-progress-fill': styles.progressFill as string,
    '--uxm-file-upload-progress-height': `${styles.progressHeight}px`,
    // File list — per-status overrides (done / error) — full state-card
    // treatment: each gets its own bg + border + icon (+ meta for error).
    '--uxm-file-upload-row-done-bg': styles.rowDoneBg as string,
    '--uxm-file-upload-row-done-border-color': styles.rowDoneBorderColor as string,
    '--uxm-file-upload-row-done-icon-color': styles.rowDoneIconColor as string,
    '--uxm-file-upload-row-error-bg': styles.rowErrorBg as string,
    '--uxm-file-upload-row-error-border-color': styles.rowErrorBorderColor as string,
    '--uxm-file-upload-row-error-icon-color': styles.rowErrorIconColor as string,
    '--uxm-file-upload-row-error-meta-color': styles.rowErrorMetaColor as string,
  } as CSSProperties;
}

/**
 * Demo files — one per `status` value so the canvas shows all four row
 * lifecycle states at a glance. Designers see queued / uploading / done /
 * error stacked together, instead of needing to cycle a variant. Sizes
 * span small → medium so the size formatter exercises B / KB / MB
 * branches; the `progress` on the uploading row demonstrates the verbose
 * meta copy ("Uploading · 60% of …").
 */
const DEMO_FILES: FileUploadFileMeta[] = [
  { id: 'demo-q', name: 'Q4-roadmap.pdf', size: 482_310, status: 'queued' },
  { id: 'demo-u', name: 'design-tokens.json', size: 12_480, status: 'uploading', progress: 0.6 },
  // `href` on the settled row: without it the download control never renders,
  // so the knob above would preview nothing. The three other rows exercise the
  // reserved slot that keeps the column from jumping when an upload settles.
  //
  // A `data:` URL, NOT a `#fragment`: a fragment is same-origin, so `download`
  // applies to it and clicking the control in the workbench would write the
  // studio's own HTML to disk under the demo filename. This saves one harmless
  // line instead, while still exercising the real `<a href download>` path.
  {
    id: 'demo-d',
    name: 'brand-guidelines.pdf',
    size: 2_415_628,
    status: 'done',
    href: 'data:text/plain,UXM%20FileUpload%20preview%20%E2%80%94%20demo%20download',
  },
  { id: 'demo-e', name: 'annual-report.docx', size: 853_104, status: 'error', errorMessage: 'File exceeds 10 MB limit' },
];

export function FileUploadPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';

  // `drag-over`, `uploading`, and `error` are atom-level states the
  // FileUpload accepts via the `state` prop. `hover` and `focus` are
  // CSS-only in production (driven by :hover / :focus-within) — the
  // workbench paints them via a wrapping div + inline style override
  // below. `disabled` is a separate prop on the atom.
  const forcedAtomState: FileUploadState | undefined =
    state === 'drag-over' || state === 'uploading' || state === 'error'
      ? (state as FileUploadState)
      : undefined;

  const isHover = state === 'hover';
  const isFocus = state === 'focus';

  // Demo state holder — remove buttons are no-ops so removing a row
  // doesn't make the canvas jump.
  const [files] = useState<FileUploadFileMeta[]>(DEMO_FILES);

  const cssVars = buildVars(styles);

  return (
    <div style={{ width: 460, ...cssVars } as CSSProperties}>
      {/*
        Hover and Focus forced-state previews use a wrapping div whose
        class name an inline <style> uses to push the right CSS variables
        onto the inner `.uxm-file-upload`. Keeps the atom free of any
        workbench-only state handling.
      */}
      {(isHover || isFocus) && (
        <style>{`
          .uxm-file-upload-preview-force-hover .uxm-file-upload {
            background-color: var(--uxm-file-upload-hover-bg);
            border-color: var(--uxm-file-upload-hover-border);
          }
          .uxm-file-upload-preview-force-focus .uxm-file-upload {
            border-color: var(--uxm-file-upload-focus-border);
            outline: 2px solid var(--uxm-file-upload-focus-ring);
            outline-offset: 2px;
          }
        `}</style>
      )}
      <div
        className={
          isHover
            ? 'uxm-file-upload-preview-force-hover'
            : isFocus
              ? 'uxm-file-upload-preview-force-focus'
              : undefined
        }
      >
        <FileUpload
          state={forcedAtomState}
          disabled={state === 'disabled'}
          files={files}
          error={state === 'error' ? 'Upload failed — please try again.' : undefined}
          allowedTypesText="PDF, DOCX · up to 10 MB"
        />
      </div>
    </div>
  );
}
