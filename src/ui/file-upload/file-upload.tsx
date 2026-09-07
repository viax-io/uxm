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
import { useUxmLocale } from '../locale';

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
 *   verbose meta line (`labels.uploadProgress`). Caller drives
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
   * (`labels.uploading`) and no fraction.
   */
  progress?: number;
  /**
   * Per-file error message. Used only when `status === "error"`.
   * Replaces the size meta on the row in danger styling.
   */
  errorMessage?: string;
  /**
   * Direct URL for a stored file. On a `done` row this renders a trailing
   * control as a real `<a href download>` — which is why it exists alongside
   * `onOpenFile` rather than being replaced by it: only an anchor gives the
   * browser's own affordances (⌘/middle-click to a new tab, right-click →
   * "Save link as", the native download UI).
   *
   * ⚠️ Use this ONLY when the browser can fetch the URL unauthenticated. A
   * plain navigation carries no `Authorization` header, so a token-protected
   * URL returns 401 — reach for `onOpenFile` there.
   *
   * ⚠️ The `download` attribute is ignored CROSS-ORIGIN: if the file is
   * served from another origin the browser navigates to it instead of saving
   * it. Pass `downloadGlyph="arrow-up-right"` so the control does not promise
   * a save it cannot perform, or route through `onOpenFile` and a blob.
   */
  href?: string;
}

/**
 * Copy the atom generates on its own — the strings that have no dedicated
 * prop because they are per-row or per-state rather than per-instance.
 * Merged over the English defaults, so a consumer overrides only what it
 * needs to translate.
 *
 * The two composed names take the filename as an argument rather than a
 * prefix string: word order around a filename differs by language, and a
 * `"Remove" + name` concatenation cannot express that.
 */
export interface FileUploadLabels {
  /** Busy copy — replaces the help line and any progressless row. Default `"Uploading…"`. */
  uploading?: string;
  /** Row meta fallback when a failed file carries no `errorMessage`. Default `"Upload failed"`. */
  uploadFailed?: string;
  /** Row meta while uploading with known progress. Default `` `Uploading · ${percent} of ${size}` ``. */
  uploadProgress?: (percent: string, size: string) => string;
  /** Row trash button, idle file. Default `` `Remove ${name}` ``. */
  removeFile?: (name: string) => string;
  /** Row trash button, in-flight file. Default `` `Cancel ${name}` ``. */
  cancelFile?: (name: string) => string;
}

const DEFAULT_LABELS = {
  uploading: 'Uploading…',
  uploadFailed: 'Upload failed',
  uploadProgress: (percent: string, size: string) => `Uploading · ${percent} of ${size}`,
  removeFile: (name: string) => `Remove ${name}`,
  cancelFile: (name: string) => `Cancel ${name}`,
} satisfies Required<FileUploadLabels>;

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
   * temporarily replaces this with `labels.uploading` — caller's `helpText`
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
  /**
   * Fires when a row's download control is activated. Set this when the
   * stored file needs an auth header or a signed-URL round trip: the consumer
   * fetches the bytes itself and saves them (typically `fetch` with the
   * bearer, then `URL.createObjectURL` — remember to `revokeObjectURL`, and
   * to pass the filename through, or the file lands named `blob`).
   *
   * Takes PRECEDENCE over `FileUploadFileMeta.href`: a consumer that supplied
   * a handler wants control of what opening means. Set neither and no
   * download control renders, which is how every existing consumer behaves.
   */
  onOpenFile?: (id: string) => void;
  /**
   * Glyph for the download control. Defaults to `"arrow-down"`. Override to
   * `"arrow-up-right"` when the file opens in a tab rather than saving —
   * cross-origin `href`, or an `onOpenFile` that previews in-app.
   */
  downloadGlyph?: string;
  /**
   * Verb in the download control's accessible name, rendered as
   * `` `${downloadLabel} ${file.name}` ``. Defaults to `"Download"`.
   *
   * Change it together with `downloadGlyph` whenever the control opens rather
   * than saves: the glyph alone corrects the promise for sighted users and
   * leaves screen-reader users being told "Download" for a control that
   * navigates. `downloadLabel="Open"` keeps the two in step.
   */
  downloadLabel?: string;
  /** Fires when a drag enters the drop area. */
  onDragEnter?: (e: DragEvent<HTMLLabelElement>) => void;
  /** Fires when a drag leaves the drop area. */
  onDragLeave?: (e: DragEvent<HTMLLabelElement>) => void;
  /** Fires when a drop is rejected (e.g. wrong type — for caller-driven validation). */
  onError?: (reason: string) => void;
  /**
   * Accessible names and row copy the atom generates itself. Merged over the
   * English defaults. `titleText` / `helpText` / `allowedTypesText` stay
   * separate props — they are per-instance copy, not per-row.
   */
  labels?: FileUploadLabels;
  /**
   * BCP-47 locale for the file-size formatter. Defaults to the nearest
   * `UxmLocaleProvider`, then to `"en-US"`. Drives the decimal separator and
   * the localised byte unit (`"471.0 kB"` vs `"471,0 кБ"`). Ignored when
   * `formatSize` is supplied.
   */
  locale?: string;
  /**
   * Replace the built-in file-size formatter wholesale. Receives the raw byte
   * count from `FileUploadFileMeta.size`. Use this when the default
   * `Intl`-formatted SI units don't match the product's house style (e.g. an
   * app that insists on binary `KiB` / `MiB`).
   */
  formatSize?: (bytes: number) => string;
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
  onOpenFile,
  downloadGlyph = 'arrow-down',
  downloadLabel = 'Download',
  onDragEnter,
  onDragLeave,
  onError: _onError,
  labels,
  locale: localeProp,
  formatSize,
  className,
  style,
  iconGlyph = 'cloud-arrow-up',
  children,
  ...rest
}: FileUploadProps) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const locale = useUxmLocale(localeProp);
  const sizeFormatter = formatSize ?? ((bytes: number) => formatBytes(bytes, locale));
  const inputId = useId();
  const helpId = useId();

  // Whether the list has a download COLUMN at all — a whole-list property, so
  // it is computed once here rather than per row (inside the map it re-scanned
  // `files` for every row, which is O(n²) on exactly the renders a list does
  // most: one per progress tick during an upload).
  //
  // The column exists so the control can be `done`-only without the name column
  // gaining 24px the moment an upload settles — a reflow of the row the user is
  // watching. Rows with nothing to fetch render an inert placeholder instead.
  const listHasDownloads = !!onOpenFile || files.some((f) => !!f.href);
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
  // The uploading state owns the help slot: it swaps to `labels.uploading` so
  // the drop area visibly reflects the caller-declared busy phase. Falls
  // back to the normal copy in every other state.
  const resolvedHelp = isUploading ? l.uploading : baseHelp;

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
            //   uploading      → labels.uploadProgress (or labels.uploading if no progress)
            //   error          → per-file errorMessage (or generic fallback)
            const sizeLabel = sizeFormatter(file.size);
            const metaText = isUploading
              ? pctLabel != null
                ? l.uploadProgress(pctLabel, sizeLabel)
                : l.uploading
              : isFileError
                ? file.errorMessage ?? l.uploadFailed
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
                {/* Download / open. `done` only — there is nothing stored to
                    fetch until the upload settles. `onOpenFile` wins over
                    `href` so a consumer that needs an auth header or a signed
                    URL is never silently downgraded to a bare navigation. */}
                {listHasDownloads &&
                  (isDone && (onOpenFile || file.href) ? (
                    onOpenFile ? (
                      <button
                        type="button"
                        className="uxm-file-upload__row-download"
                        aria-label={`${downloadLabel} ${file.name}`}
                        disabled={disabled}
                        onClick={() => onOpenFile(file.id)}
                      >
                        <Icon glyph={downloadGlyph} size={16} />
                      </button>
                    ) : (
                      // eslint-disable-next-line jsx-a11y/anchor-is-valid -- `href` is dropped ONLY while `disabled`, which is the point: an anchor that keeps its href stays focusable and Enter still follows it, so a disabled control would remain usable from the keyboard. The rule cannot model a conditionally-inert anchor; when enabled this always has a valid href.
                      <a
                        className="uxm-file-upload__row-download"
                        // DROPPED while disabled, not merely styled out. An
                        // anchor keeps `href` in the tab order and Enter still
                        // follows it, so `pointer-events: none` disables only
                        // the mouse — a keyboard user could still download from
                        // a form the consumer switched off. Without `href` the
                        // element is neither focusable nor a link.
                        href={disabled ? undefined : file.href}
                        // Names the saved file: without this the browser uses
                        // the URL's last segment, so a storage key lands on
                        // disk as a UUID. Ignored cross-origin, along with the
                        // download behaviour itself — see `href`'s docs.
                        download={file.name}
                        // Cross-origin, `download` is ignored and this becomes a
                        // real navigation — into a NEW tab, so the user does not
                        // lose the app and whatever is unsaved beside the list.
                        // Same-origin the `download` attribute wins and no tab
                        // opens, so this costs nothing there. It is also what
                        // makes `rel="noopener"` mean anything.
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${downloadLabel} ${file.name}`}
                        aria-disabled={disabled || undefined}
                      >
                        <Icon glyph={downloadGlyph} size={16} />
                      </a>
                    )
                  ) : (
                    // Inert placeholder keeping the column width stable across
                    // the uploading → done transition.
                    <span className="uxm-file-upload__row-download-slot" aria-hidden="true" />
                  ))}
                <button
                  type="button"
                  className="uxm-file-upload__row-remove"
                  aria-label={
                    isUploading ? l.cancelFile(file.name) : l.removeFile(file.name)
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

// SI, not binary, and deliberately so: the unit names below come from `Intl`
// (`kilobyte`, `megabyte`, `gigabyte`), and those are defined as powers of
// 1000. Dividing by 1024 while printing `kB` would misstate the size in every
// locale, and `Intl` has no binary unit to switch to — the sanctioned list has
// no `kibibyte`. Consumers who want binary units own the whole formatter via
// `formatSize` (`KiB` / `MiB`), which is why that prop exists.
const KB = 1000;
const MB = KB * 1000;
const GB = MB * 1000;

/**
 * Locale-aware size formatter. `Intl`'s `style: "unit"` supplies both the
 * decimal separator and the translated unit, which a hand-rolled
 * `` `${n.toFixed(1)} KB` `` cannot: `de-DE` needs a comma, `uk-UA` needs
 * `кБ`, `fr-FR` counts in octets. Bytes render whole; everything above keeps
 * one fraction digit, as before.
 *
 * The byte tier uses `unitDisplay: "long"` while the rest use `"short"`, and
 * that asymmetry is deliberate. CLDR's *short* byte form is neither short nor
 * pluralised in English — `Intl` renders `"512 byte"` — whereas the long form
 * pluralises correctly in every locale (`512 bytes`, `512 байтів`,
 * `512 bajtów`). It is also the one tier that can afford the extra characters,
 * since the number itself is at most three digits.
 *
 * Older `Intl` implementations reject `style: "unit"` with a RangeError, so
 * the English SI form stays as a fallback rather than crashing the row.
 */
function formatBytes(bytes: number, locale: string): string {
  const [value, unit, fallbackUnit] =
    bytes < KB
      ? ([bytes, 'byte', 'B'] as const)
      : bytes < MB
        ? ([bytes / KB, 'kilobyte', 'kB'] as const)
        : bytes < GB
          ? ([bytes / MB, 'megabyte', 'MB'] as const)
          : ([bytes / GB, 'gigabyte', 'GB'] as const);
  const isBytes = unit === 'byte';
  const fractionDigits = isBytes ? 0 : 1;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'unit',
      unit,
      unitDisplay: isBytes ? 'long' : 'short',
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
  } catch {
    return `${value.toFixed(fractionDigits)} ${fallbackUnit}`;
  }
}
