import {
  useCallback,
  useId,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type DragEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '@/helpers';

import { Icon } from '../icon';

/**
 * Visual states the FileUpload **drop area** can be forced into via the
 * `state` prop. These describe the drop area surface only — not per-file
 * lifecycle. Per-file states (queued / uploading / done / error) live on
 * each `FileUploadFileMeta.status` and render row-by-row independently.
 *
 * `uploading` is **caller-controlled** — the atom never sets it from per-
 * file statuses. Use it for page-level signals: a batch is being prepared
 * before per-file rows exist, a chunked upload with no per-file progress,
 * or any "the system is busy with this dropzone" state the caller wants
 * to surface. Per-row uploading rows remain the *primary* progress signal.
 *
 * `error` means a *page-level* error (e.g. "Connection lost", "Server
 * rejected the batch") — surfaced via the `errorMessage` prop and shown
 * below the drop area. Per-file errors don't change the drop area's state.
 */
export type FileUploadState = 'default' | 'drag-over' | 'uploading' | 'error';

/**
 * Per-file lifecycle status. The atom paints each row based on its own
 * status independently of other rows.
 *
 * - `queued`: file is added but not yet sent. Neutral row appearance.
 * - `uploading`: file is in flight. Row shows a progress strip and a
 *   verbose meta line ("Uploading · 61% of 471.0 KB"). Caller drives
 *   `progress` (0–1).
 * - `done`: file completed. Document icon swaps to a success check.
 * - `error`: file failed. Border + icon + meta switch to danger styling;
 *   the per-file `errorMessage` replaces the size meta.
 */
export type FileStatus = 'queued' | 'uploading' | 'done' | 'error';

export interface FileUploadFileMeta {
  /** Stable id for keying + removal callbacks. */
  id: string;
  /** Filename to display in the row. */
  name: string;
  /** Size in bytes. Formatted for display by the atom. */
  size: number;
  /**
   * Per-file lifecycle status. Defaults to `"queued"` if omitted. Drives
   * the row's icon, meta line, border, and progress strip.
   */
  status?: FileStatus;
  /**
   * 0–1 progress fraction. Used only when `status === "uploading"`.
   * If omitted during uploading, the row shows an indeterminate state
   * ("Uploading…") and no fraction.
   */
  progress?: number;
  /**
   * Per-file error message. Used only when `status === "error"`.
   * Replaces the size meta on the row in danger styling.
   */
  errorMessage?: string;
}

export interface FileUploadProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onError' | 'onDragEnter' | 'onDragLeave'> {
  /**
   * Forced drop-area visual state — overrides internal drag detection.
   * The workbench uses this to paint each state without real interaction.
   * Omit in production: the atom flips to `drag-over` itself while
   * dragging, and to `error` when `errorMessage` is set.
   *
   * Per-file states (uploading / done / per-file errors) are NOT atom-
   * level — they live on each `FileUploadFileMeta.status`.
   */
  state?: FileUploadState;
  /** Allow selecting more than one file. Defaults to `true`. */
  multiple?: boolean;
  /** Standard `<input type="file" accept>` filter, e.g. `"image/*"` or `".pdf,.docx"`. */
  accept?: string;
  /** Disable interaction. Also disables drop and all per-row remove buttons. */
  disabled?: boolean;
  /** Heading text inside the drop area. */
  titleText?: string;
  /**
   * Hint line below the title. Falls back to a `multiple`-aware default
   * ("Drop files here, or click to browse" vs "Drop a file here, or click
   * to browse"). When the caller sets `state="uploading"`, the atom
   * temporarily replaces this with "Uploading…" — caller's `helpText`
   * value is restored once they flip back to default.
   *
   * Per-file uploading rows do NOT trigger this swap on their own — the
   * drop-area copy reflects the caller's declared state, not aggregate
   * row status. Rows carry their own "Uploading · 60% of …" indicators.
   */
  helpText?: string;
  /**
   * Optional constraint line below the help text — e.g. "PDF, DOCX · up to
   * 10 MB". Caller-controlled copy describing what the page accepts, so it
   * stays in sync with whatever `accept` filter and validation the page
   * enforces in `onFiles`. The atom never invents this string — when
   * omitted, no slot renders. The atom does not enforce anything in it.
   */
  allowedTypesText?: string;
  /**
   * Page-level error message to render below the drop area (e.g. "Connection
   * lost", "Server rejected the batch"). When set, the atom paints the drop
   * area in the `error` state automatically. Named `error` to match the rest
   * of the input family's `error?: string`.
   *
   * Distinct from per-file errors — set `status: "error"` + `errorMessage`
   * on a `FileUploadFileMeta` to surface a single-file failure inline on
   * its row instead.
   */
  error?: string;
  /**
   * @deprecated Renamed to `error` (input-family convention). Still accepted
   * as an alias for back-compat; `error` wins when both are set.
   */
  errorMessage?: string;
  /**
   * Files to display in the inline list under the drop area. Rendered
   * automatically whenever `files.length > 0`. Each entry's `status`
   * drives its row appearance independently. To render the list elsewhere
   * on the page, omit `files` and manage that state yourself.
   */
  files?: FileUploadFileMeta[];
  /** Fires with the selected `File[]` whether the user picked via dialog or dropped. */
  onFiles?: (files: File[]) => void;
  /**
   * Fires when a row's remove button is clicked. The caller decides what
   * "remove" means per status — cancel an in-flight upload, drop a queued
   * file, delete a completed one server-side. The atom doesn't auto-disable
   * the button during `uploading` so the user always has an escape hatch.
   */
  onRemove?: (id: string) => void;
  /** Fires when a drag enters the drop area. */
  onDragEnter?: (e: DragEvent<HTMLLabelElement>) => void;
  /** Fires when a drag leaves the drop area. */
  onDragLeave?: (e: DragEvent<HTMLLabelElement>) => void;
  /** Fires when a drop is rejected (e.g. wrong type — for caller-driven validation). */
  onError?: (reason: string) => void;
  /** Optional override for the drop-area icon glyph. */
  iconGlyph?: string;
  /** Optional slot rendered above the file list (e.g. a summary line). */
  children?: ReactNode;
}

export function FileUpload({
  state: forcedState,
  multiple = true,
  accept,
  disabled = false,
  titleText,
  helpText,
  allowedTypesText,
  error,
  errorMessage,
  files = [],
  onFiles,
  onRemove,
  onDragEnter,
  onDragLeave,
  onError: _onError,
  className,
  style,
  iconGlyph = 'cloud-arrow-up',
  children,
  ...rest
}: FileUploadProps) {
  const inputId = useId();
  const helpId = useId();
  const [internalDrag, setInternalDrag] = useState(false);

  // The drop area is intentionally independent of per-file statuses. It
  // doesn't change copy, busy-state, or cursor automatically based on
  // whether any row is uploading — the rows speak for themselves via
  // their own per-row meta + progress strip. The two state spaces stay
  // orthogonal: caller declares drop-area state explicitly via the
  // `state` prop, and sets per-file lifecycle via each `file.status`.
  //
  // `uploading` here is an explicit drop-area state for cases the rows
  // can't carry: batch lockouts, pre-file validation, indeterminate
  // chunked uploads without per-file callbacks. Caller drives it.
  const isUploading = forcedState === 'uploading';

  // Atom-level error: caller set `error` (or the deprecated `errorMessage`
  // alias) OR forced state to "error". Per-file errors are NOT reflected here —
  // they're each row's concern.
  const pageError = error ?? errorMessage;
  const isPageError = forcedState === 'error' || (!forcedState && !!pageError);

  const dataState: FileUploadState = forcedState
    ? forcedState
    : internalDrag
      ? 'drag-over'
      : isPageError
        ? 'error'
        : 'default';

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const list = e.target.files;
      if (!list || list.length === 0) return;
      onFiles?.(Array.from(list));
      // Clear so re-selecting the same file re-fires onChange.
      e.target.value = '';
    },
    [disabled, onFiles],
  );

  const handleDragEnter = useCallback(
    (e: DragEvent<HTMLLabelElement>) => {
      if (disabled) return;
      e.preventDefault();
      setInternalDrag(true);
      onDragEnter?.(e);
    },
    [disabled, onDragEnter],
  );

  const handleDragOver = useCallback(
    (e: DragEvent<HTMLLabelElement>) => {
      if (disabled) return;
      e.preventDefault();
    },
    [disabled],
  );

  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLLabelElement>) => {
      if (disabled) return;
      e.preventDefault();
      setInternalDrag(false);
      onDragLeave?.(e);
    },
    [disabled, onDragLeave],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLLabelElement>) => {
      if (disabled) return;
      e.preventDefault();
      setInternalDrag(false);
      const list = e.dataTransfer?.files;
      if (!list || list.length === 0) return;
      onFiles?.(Array.from(list));
    },
    [disabled, onFiles],
  );

  const resolvedTitle = titleText ?? 'Upload a file';
  const baseHelp =
    helpText ??
    (multiple
      ? 'Drop files here, or click to browse'
      : 'Drop a file here, or click to browse');
  // The uploading state owns the help slot: it swaps to "Uploading…" so
  // the drop area visibly reflects the caller-declared busy phase. Falls
  // back to the normal copy in every other state.
  const resolvedHelp = isUploading ? 'Uploading…' : baseHelp;

  return (
    <div className={cn('uxm-file-upload-wrapper', className)} style={style} {...rest}>
      <label
        className="uxm-file-upload"
        htmlFor={inputId}
        data-state={dataState}
        data-disabled={disabled ? 'true' : undefined}
        aria-busy={isUploading || undefined}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id={inputId}
          className="uxm-file-upload__input"
          type="file"
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          aria-invalid={isPageError || undefined}
          aria-describedby={helpId}
          onChange={handleChange}
        />
        <span className="uxm-file-upload__icon" aria-hidden="true">
          <Icon glyph={iconGlyph} size={40} />
        </span>
        <span className="uxm-file-upload__title">{resolvedTitle}</span>
        <span id={helpId} className="uxm-file-upload__help">
          {resolvedHelp}
        </span>
        {allowedTypesText && !isUploading && (
          <span className="uxm-file-upload__allowed-types">{allowedTypesText}</span>
        )}
      </label>
      {pageError && <span className="uxm-file-upload__error">{pageError}</span>}
      {children}
      {files.length > 0 && (
        <ul className="uxm-file-upload__list">
          {files.map((file) => {
            const status: FileStatus = file.status ?? 'queued';
            const isUploading = status === 'uploading';
            const isDone = status === 'done';
            const isFileError = status === 'error';
            const pctFraction =
              file.progress != null
                ? Math.max(0, Math.min(1, file.progress))
                : undefined;
            const pctLabel =
              pctFraction != null ? `${Math.round(pctFraction * 100)}%` : undefined;
            const pctWidth = pctFraction != null ? `${pctFraction * 100}%` : '0%';

            // Icon glyph + color come from the row's status. Default knobs
            // (rowIconColor etc.) cover queued/uploading; done + error
            // route through dedicated vars the CSS reads via [data-status].
            const iconForRow = isDone
              ? 'check-circle'
              : isFileError
                ? 'exclamation-circle'
                : 'document';

            // Meta line content swaps with status:
            //   queued / done  → file size
            //   uploading      → "Uploading · 61% of 471.0 KB" (or "Uploading…" if no progress)
            //   error          → per-file errorMessage (or generic fallback)
            const sizeLabel = formatBytes(file.size);
            const metaText = isUploading
              ? pctLabel != null
                ? `Uploading · ${pctLabel} of ${sizeLabel}`
                : 'Uploading…'
              : isFileError
                ? file.errorMessage ?? 'Upload failed'
                : sizeLabel;

            return (
              <li
                key={file.id}
                className="uxm-file-upload__row"
                data-status={status}
              >
                <span className="uxm-file-upload__row-icon" aria-hidden="true">
                  <Icon glyph={iconForRow} size={20} />
                </span>
                <span className="uxm-file-upload__row-body">
                  <span className="uxm-file-upload__row-name">{file.name}</span>
                  <span className="uxm-file-upload__row-meta">{metaText}</span>
                </span>
                <button
                  type="button"
                  className="uxm-file-upload__row-remove"
                  aria-label={
                    isUploading ? `Cancel ${file.name}` : `Remove ${file.name}`
                  }
                  disabled={disabled}
                  onClick={() => onRemove?.(file.id)}
                >
                  <Icon glyph="trash" size={16} />
                </button>
                {isUploading && (
                  <span
                    className="uxm-file-upload__row-progress"
                    style={
                      { '--uxm-file-upload-row-progress': pctWidth } as CSSProperties
                    }
                    role="progressbar"
                    aria-valuenow={pctFraction != null ? Math.round(pctFraction * 100) : undefined}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}
