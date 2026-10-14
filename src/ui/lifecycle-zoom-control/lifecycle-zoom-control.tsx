import { useEffect, useId, useRef, useState } from 'react';

import { cn, rendersSomething } from '@/helpers';
import { Icon } from '@/ui/icon';
import { Menu } from '@/ui/menu';
import type { MenuEntry } from '@/ui/menu';

import type { HTMLAttributes, ReactNode } from 'react';

export interface LifecycleZoomControlProps extends HTMLAttributes<HTMLDivElement> {
  /** Current zoom percentage shown between the +/− buttons. */
  value?: number;
  /** Optional handlers — when omitted, buttons render in a "decorative" disabled-looking state. */
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  /** Size of each button in px. CSS-token-driven by default. */
  buttonSize?: number;
  /** Accessible name for the − button. Default `"Zoom out"`. */
  zoomOutLabel?: string;
  /** Accessible name for the + button. Default `"Zoom in"`. */
  zoomInLabel?: string;
  /**
   * Makes the percentage a typed field. Called on commit (Enter, or blur) with
   * the number the user entered — **unclamped**.
   *
   * The control owns no zoom range, because its consumers do and they disagree
   * (40–150 in one canvas, 25–200 in another); a third opinion in the library
   * would just be wrong somewhere. Clamp in the handler and feed the result
   * back through `value`: the field drops its draft on commit, so it re-renders
   * from `value` even when your clamp leaves `value` unchanged.
   *
   * Feed the clamped result back synchronously: the field renders from `value`
   * the moment it commits, so a host that debounces or animates zoom will show
   * the old number until its own update lands.
   *
   * Omit and the percentage stays the read-only span it has always been — and
   * `presets` renders nothing, since picking one would have nothing to call.
   */
  onValueChange?: (percent: number) => void;
  /**
   * Preset percentages offered behind a ▾ menu. Omit (or pass none) to hide it.
   * Requires `onValueChange` — without it there is nothing for a preset to do,
   * so the rows are not rendered.
   */
  presets?: readonly number[];
  /** Adds a "Fit to screen" row at the foot of the preset menu. */
  onFit?: () => void;
  /**
   * Trailing content after a divider — a minimap toggle is the usual one.
   * The control styles the divider; what goes in the slot is yours.
   */
  trailing?: ReactNode;
  /** Accessible name for the editable percentage. Default `"Zoom percentage"`. */
  valueLabel?: string;
  /** Accessible name for the ▾ trigger. Default `"Zoom presets"`. */
  presetsLabel?: string;
  /** Label of the fit-to-screen row. Default `"Fit to screen"`. */
  fitLabel?: string;
  /**
   * Renders one preset's label. A callback, not a suffix the control appends:
   * the space before `%` and the word order around a number are
   * language-specific, and a consumer may want `Intl.NumberFormat`.
   * Default ``(percent) => `${percent}%` ``.
   */
  formatPreset?: (percent: number) => string;
}

/**
 * Reads the percentage out of whatever the user typed.
 *
 * Not a digit filter. Stripping every non-digit changes the MAGNITUDE of the
 * number — `1.5` becomes 15 and `62.5` becomes 625 — and deletes a minus sign
 * rather than letting the host's clamp reject it. It also loses fullwidth
 * digits entirely (`１２５` → empty), which is what a Japanese IME produces, in
 * a library that ships a Japanese studio locale.
 *
 * So: normalise fullwidth to ASCII, take the first number in the string, and
 * accept either decimal separator. A trailing unit or a stray leading
 * character still parses; nonsense returns `null` and the entry reverts.
 * Rounding is the host's business — it owns the range.
 */
function parsePercent(raw: string): number | null {
  const match = raw.normalize('NFKC').match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0].replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * The editable percentage.
 *
 * Its own component so the draft unmounts with the input: held on the parent, a
 * draft outlives a host toggling `onValueChange` off and back on, and the field
 * returns showing a number the user abandoned.
 */
function ZoomField({
  id,
  value,
  label,
  onCommit,
}: {
  id: string;
  value: number;
  label: string;
  onCommit: (percent: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  /**
   * Re-select after a commit, once React has written the new text.
   *
   * Calling `select()` straight from the key handler selects the PRE-commit
   * string, and the re-render that follows rewrites `value` and collapses the
   * caret to the end — so the next entry appends (100, then 5, is 1005), which
   * is the bug this is here to stop. An effect runs after the DOM is updated,
   * which is the only point where selecting means anything.
   */
  const selectAfterRender = useRef(false);
  useEffect(() => {
    if (!selectAfterRender.current) return;
    selectAfterRender.current = false;
    inputRef.current?.select();
  });

  /**
   * What has been typed but not committed. `null` means "nothing in flight,
   * render `value`" — which is also what makes a rejected entry snap back:
   * committing clears the draft, so the field falls to `value` whether or not
   * the host's clamp actually changed it.
   */
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    setDraft(null);
    if (draft == null) return;
    const parsed = parsePercent(draft);
    // Re-entering the number already shown is not a change. Hosts act on this
    // callback — recentring the canvas, dropping a zoom anchor — and should not
    // be made to do that for a no-op.
    if (parsed != null && parsed !== value) onCommit(parsed);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      ref={inputRef}
      id={id}
      className="uxm-lifecycle-zoom-control__field"
      aria-label={label}
      value={draft ?? String(value)}
      onFocus={(event) => event.currentTarget.select()}
      onChange={(event) => setDraft(event.currentTarget.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        // Mid-composition, Enter COMMITS the IME candidate and Escape cancels
        // it — both belong to the IME, not to us. Claiming them would commit a
        // half-composed entry. `keyCode === 229` is the legacy signal some
        // engines still send instead of `isComposing`.
        if (event.nativeEvent.isComposing || event.keyCode === 229) return;

        if (event.key === 'Enter') {
          event.preventDefault();
          commit();
          selectAfterRender.current = true;
        } else if (event.key === 'Escape') {
          if (draft != null) {
            // One layer at a time. `useDismiss` listens for Escape on the
            // DOCUMENT, so an un-stopped Escape cancels this edit AND closes
            // the dialog or popover the canvas sits in. With nothing in flight
            // there is nothing to cancel, so it passes through as usual.
            event.stopPropagation();
            setDraft(null);
          }
          // Reverting in place rather than blurring: a keyboard user keeps
          // their position, and commit-on-blur can no longer race the revert,
          // which is what forced the draft into a ref before.
          event.currentTarget.select();
        }
      }}
    />
  );
}

/**
 * The compact −/percent/+ cluster that lives in the corner of a lifecycle
 * canvas. Inert if no handlers passed (useful for static demos / templates).
 *
 * Every editing affordance is opt-in and off by default, so a read-only canvas
 * keeps exactly the DOM and the look it had before they existed: pass
 * `onValueChange` for a typed percentage, `presets` for the ▾ menu, `trailing`
 * for a slot after a divider.
 */
export function LifecycleZoomControl({
  value = 100,
  onZoomIn,
  onZoomOut,
  buttonSize,
  zoomOutLabel = 'Zoom out',
  zoomInLabel = 'Zoom in',
  onValueChange,
  presets,
  onFit,
  trailing,
  valueLabel = 'Zoom percentage',
  presetsLabel = 'Zoom presets',
  fitLabel = 'Fit to screen',
  formatPreset = (percent) => `${percent}%`,
  className,
  style,
  ...rest
}: LifecycleZoomControlProps) {
  const fieldId = useId();
  const sizeStyle = buttonSize ? { ['--uxm-lifecycle-zoom-button-size' as string]: `${buttonSize}px` } : undefined;

  // Presets are only rows if something happens when you pick one. Without
  // `onValueChange` their `onSelect` is a no-op, and a menu of live-looking
  // entries that close without doing anything is worse than no menu.
  const presetRows = onValueChange ? (presets ?? []) : [];
  const presetItems: MenuEntry[] = [
    ...presetRows.map((percent) => ({
      key: `zoom-${percent}`,
      label: formatPreset(percent),
      // Marks where the user already is, which Menu renders as aria-current.
      current: percent === value,
      onSelect: () => onValueChange?.(percent),
    })),
    ...(onFit
      ? ([
          ...(presetRows.length ? [{ separator: true as const, key: 'zoom-fit-sep' }] : []),
          { key: 'zoom-fit', label: fitLabel, onSelect: onFit },
        ] satisfies MenuEntry[])
      : []),
  ];

  return (
    <div
      {...rest}
      className={cn('uxm-lifecycle-zoom-control', className)}
      style={{ ...sizeStyle, ...style }}
    >
      <button
        type="button"
        className="uxm-lifecycle-zoom-control__btn"
        aria-label={zoomOutLabel}
        onClick={onZoomOut}
        disabled={!onZoomOut}
      >
        <Icon glyph="minus" size={14} strokeWidth={2.5} />
      </button>
      {/* A <label> when editable, so clicking anywhere in the segment — the `%`
          beside the number included — puts the caret in the field. Padding
          alone only widens the input; the unit is a sibling and swallows its
          own clicks. A plain <div> otherwise: a label with nothing to label is
          a lie to assistive tech. */}
      {onValueChange ? (
        <label className="uxm-lifecycle-zoom-control__value" htmlFor={fieldId}>
          <ZoomField id={fieldId} value={value} label={valueLabel} onCommit={onValueChange} />
          <span className="uxm-lifecycle-zoom-control__unit">%</span>
        </label>
      ) : (
        <div className="uxm-lifecycle-zoom-control__value">
          <span className="uxm-lifecycle-zoom-control__num">{value}</span>
          <span className="uxm-lifecycle-zoom-control__unit">%</span>
        </div>
      )}
      {presetItems.length > 0 && (
        <Menu
          items={presetItems}
          placement="top-end"
          aria-label={presetsLabel}
          renderTrigger={({ triggerProps }) => (
            <button
              type="button"
              className="uxm-lifecycle-zoom-control__btn"
              aria-label={presetsLabel}
              {...triggerProps}
            >
              <Icon glyph="chevron-down" size={14} strokeWidth={2.5} />
            </button>
          )}
        />
      )}
      <button
        type="button"
        className="uxm-lifecycle-zoom-control__btn"
        aria-label={zoomInLabel}
        onClick={onZoomIn}
        disabled={!onZoomIn}
      >
        <Icon glyph="plus" size={14} strokeWidth={2.5} />
      </button>
      {rendersSomething(trailing) && (
        <>
          <span className="uxm-lifecycle-zoom-control__divider" aria-hidden="true" />
          {trailing}
        </>
      )}
    </div>
  );
}
