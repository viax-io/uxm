'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/helpers';
import {
  clamp,
  hexToHsv,
  hsvToHex,
  normalizeHex,
  type HSV,
} from '@/lib/color';

import { Icon } from '../icon';

export interface ColorPickerProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'value' | 'defaultValue' | 'onChange' | 'type'
  > {
  /** Current colour as `#RRGGBB` (controlled). */
  value?: string;
  /** Initial colour for the uncontrolled variant. */
  defaultValue?: string;
  /**
   * Fires with the new `#RRGGBB` on every change — including live while
   * dragging the area/hue — so a host can preview the colour instantly.
   */
  onChange?: (hex: string) => void;
  /** Hide the hex text in the trigger, leaving just the swatch + chevron. */
  hideValue?: boolean;
}

const FALLBACK = '#000000';

/**
 * ColorPicker — a HEX-based colour input. The trigger shows a swatch + the
 * current value; clicking opens a popover with a saturation/brightness area, a
 * hue slider, and a HEX field. Controlled (`value`) or uncontrolled
 * (`defaultValue`); `onChange` fires live during drags. Enter applies and
 * closes, Esc reverts to the value the popover opened with, an outside click
 * accepts the current value.
 */
export function ColorPicker({
  value,
  defaultValue,
  onChange,
  hideValue = false,
  disabled,
  className,
  'aria-label': ariaLabel = 'Pick a colour',
  ...rest
}: ColorPickerProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(() => normalizeHex(defaultValue ?? FALLBACK) ?? FALLBACK);
  const current = (isControlled ? normalizeHex(value ?? '') : internal) ?? FALLBACK;

  const [open, setOpen] = useState(false);
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(current) ?? { h: 0, s: 0, v: 0 });
  const [hexDraft, setHexDraft] = useState(current);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const valueAtOpen = useRef(current);

  const commit = useCallback(
    (hex: string) => {
      const safe = normalizeHex(hex);
      if (!safe) return; // never emit an invalid / NaN colour
      if (!isControlled) setInternal(safe);
      onChange?.(safe);
    },
    [isControlled, onChange],
  );

  // Apply a new HSV: update the area/hue, the hex field, and emit live.
  const applyHsv = useCallback(
    (next: HSV) => {
      setHsv(next);
      const hex = hsvToHex(next);
      setHexDraft(hex);
      commit(hex);
    },
    [commit],
  );

  const openPicker = () => {
    const hex = normalizeHex(current) ?? FALLBACK;
    valueAtOpen.current = hex;
    setHsv(hexToHsv(hex) ?? { h: 0, s: 0, v: 0 });
    setHexDraft(hex);
    const r = triggerRef.current?.getBoundingClientRect();
    if (r) {
      setPos({ top: r.bottom + 6, left: Math.max(8, r.left) });
    }
    setOpen(true);
  };

  // Outside click accepts the current value (already committed live) and closes.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || popRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // ── saturation / value area ──
  const dragArea = (clientX: number, clientY: number, baseH: number) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect || !rect.width || !Number.isFinite(clientX) || !Number.isFinite(clientY)) return;
    const s = clamp((clientX - rect.left) / rect.width, 0, 1) * 100;
    const v = (1 - clamp((clientY - rect.top) / rect.height, 0, 1)) * 100;
    applyHsv({ h: baseH, s, v });
  };
  const onAreaPointerDown = (e: ReactPointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    const baseH = hsv.h;
    dragArea(e.clientX, e.clientY, baseH);
    const move = (ev: PointerEvent) => dragArea(ev.clientX, ev.clientY, baseH);
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };

  // ── hue slider ──
  const dragHue = (clientX: number, baseS: number, baseV: number) => {
    const rect = hueRef.current?.getBoundingClientRect();
    if (!rect || !rect.width || !Number.isFinite(clientX)) return;
    const h = clamp((clientX - rect.left) / rect.width, 0, 1) * 360;
    applyHsv({ h, s: baseS, v: baseV });
  };
  const onHuePointerDown = (e: ReactPointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    const { s, v } = hsv;
    dragHue(e.clientX, s, v);
    const move = (ev: PointerEvent) => dragHue(ev.clientX, s, v);
    const up = () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  };

  const onHexChange = (raw: string) => {
    setHexDraft(raw);
    const hex = normalizeHex(raw);
    if (hex) {
      setHsv(hexToHsv(hex) ?? { h: 0, s: 0, v: 0 });
      commit(hex);
    }
  };

  const hueColor = hsvToHex({ h: hsv.h, s: 100, v: 100 });
  const areaThumb: CSSProperties = {
    left: `${hsv.s}%`,
    top: `${100 - hsv.v}%`,
  };
  const hueThumb: CSSProperties = { left: `${(hsv.h / 360) * 100}%` };
  const hexValid = normalizeHex(hexDraft) !== null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openPicker())}
        className={cn('uxm-color-picker', open && 'uxm-color-picker--open', className)}
        {...rest}
      >
        <span className="uxm-color-picker__swatch" style={{ backgroundColor: current }} aria-hidden />
        {!hideValue && <span className="uxm-color-picker__value">{current}</span>}
        <Icon glyph="chevron-down" size={14} className="uxm-color-picker__chevron" aria-hidden />
      </button>

      {open &&
        createPortal(
          <div
            ref={popRef}
            role="dialog"
            aria-label="Colour picker"
            className="uxm-color-picker__popover"
            style={{ position: 'fixed', top: pos.top, left: pos.left }}
          >
            <div
              ref={areaRef}
              className="uxm-color-picker__area"
              style={{ backgroundColor: hueColor }}
              onPointerDown={onAreaPointerDown}
            >
              <span className="uxm-color-picker__area-thumb" style={areaThumb} />
            </div>

            <div
              ref={hueRef}
              className="uxm-color-picker__hue"
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-label="Hue"
              aria-valuemin={0}
              aria-valuemax={360}
              aria-valuenow={Math.round(hsv.h)}
              onPointerDown={onHuePointerDown}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  applyHsv({ ...hsv, h: clamp(hsv.h - (e.shiftKey ? 10 : 1), 0, 360) });
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  applyHsv({ ...hsv, h: clamp(hsv.h + (e.shiftKey ? 10 : 1), 0, 360) });
                }
              }}
            >
              <span className="uxm-color-picker__hue-thumb" style={hueThumb} />
            </div>

            <div className="uxm-color-picker__footer">
              <span className="uxm-color-picker__preview" style={{ backgroundColor: current }} aria-hidden />
              <input
                className="uxm-color-picker__hex"
                type="text"
                value={hexDraft}
                spellCheck={false}
                placeholder="#RRGGBB"
                aria-label="Hex value"
                aria-invalid={hexValid ? undefined : true}
                // eslint-disable-next-line jsx-a11y/no-autofocus -- focusing the hex field is the expected entry point when the picker opens
                autoFocus
                onChange={(e) => onHexChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const hex = normalizeHex(hexDraft);
                    if (hex) commit(hex);
                    setOpen(false);
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    commit(valueAtOpen.current);
                    setOpen(false);
                  }
                }}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
