import { useRef, useState } from 'react';

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
   * Omit and the percentage stays the read-only span it has always been.
   */
  onValueChange?: (percent: number) => void;
  /** Preset percentages offered behind a ▾ menu. Omit (or pass none) to hide it. */
  presets?: number[];
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
  const sizeStyle = buttonSize ? { ['--uxm-lifecycle-zoom-button-size' as string]: `${buttonSize}px` } : undefined;

  /**
   * What the user has typed but not yet committed. `null` means "nothing in
   * flight, render `value`" — which is also what makes a rejected entry snap
   * back: committing clears the draft, so the field falls to `value` whether or
   * not the consumer's clamp actually changed it.
   *
   * Mirrored in a ref because Escape has to cancel the draft and then blur, and
   * blur commits. A `setDraft(null)` is not visible to the blur handler that
   * runs in the same tick — it would still read the pre-Escape draft from its
   * closure and commit the value the user just cancelled.
   */
  const [draft, setDraft] = useState<string | null>(null);
  const draftRef = useRef<string | null>(null);
  const putDraft = (next: string | null) => {
    draftRef.current = next;
    setDraft(next);
  };

  const commit = () => {
    const raw = draftRef.current;
    putDraft(null);
    if (raw == null) return;
    // Digits only: a stray `%`, a space or a thousands separator should not
    // turn a perfectly clear "125 %" into a reverted entry.
    const parsed = Number.parseInt(raw.replace(/[^0-9]/g, ''), 10);
    if (Number.isFinite(parsed)) onValueChange?.(parsed);
  };

  const presetItems: MenuEntry[] = [
    ...(presets ?? []).map((percent) => ({
      key: `zoom-${percent}`,
      label: formatPreset(percent),
      // Marks where the user already is, which Menu renders as aria-current.
      current: percent === value,
      onSelect: () => onValueChange?.(percent),
    })),
    ...(onFit
      ? ([
          ...(presets?.length ? [{ separator: true as const, key: 'zoom-fit-sep' }] : []),
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
      <div className="uxm-lifecycle-zoom-control__value">
        {onValueChange ? (
          <input
            type="text"
            inputMode="numeric"
            className="uxm-lifecycle-zoom-control__field"
            aria-label={valueLabel}
            value={draft ?? String(value)}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => putDraft(event.currentTarget.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commit();
              } else if (event.key === 'Escape') {
                putDraft(null);
                event.currentTarget.blur();
              }
            }}
          />
        ) : (
          <span className="uxm-lifecycle-zoom-control__num">{value}</span>
        )}
        <span className="uxm-lifecycle-zoom-control__unit">%</span>
      </div>
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
