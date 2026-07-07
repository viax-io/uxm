import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';

import { cn } from '@/helpers';
import { hslToRgb, rgbToHsl } from '@/lib/contrast';

import { FieldError } from '../field-error';
import { Icon } from '../icon';
import { Select } from '../input';
import { Popover, type PopoverPlacement } from '../popover';

import {
  formatColor,
  hsvaToRgba,
  parseColorString,
  rgbaToHsva,
  type ColorFormat,
  type HSVA,
  type RGBA,
} from './color-model';

export type { ColorFormat } from './color-model';

const DEFAULT_FORMATS: ColorFormat[] = ['hex', 'rgb', 'rgba', 'hsl'];
const FORMAT_LABELS: Record<ColorFormat, string> = {
  hex: 'HEX',
  rgb: 'RGB',
  rgba: 'RGBA',
  hsl: 'HSL',
};

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

/**
 * Minimal typing for the (Chromium-only) EyeDropper API — not yet in the
 * standard lib.dom lib, so we declare just the surface we call.
 */
interface EyeDropperResult {
  sRGBHex: string;
}
interface EyeDropperInstance {
  open: (options?: { signal?: AbortSignal }) => Promise<EyeDropperResult>;
}
type EyeDropperConstructor = new () => EyeDropperInstance;

function getEyeDropper(): EyeDropperConstructor | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { EyeDropper?: EyeDropperConstructor }).EyeDropper ?? null;
}

/** One numeric channel field (R/G/B/A or H/S/L). Keeps an internal draft while
 *  focused so partial edits don't fight the live value, commits valid numbers
 *  immediately (clamped), and reverts the draft on blur or Escape. */
function ChannelInput({
  label,
  short,
  value,
  min,
  max,
  disabled,
  onCommit,
  onEnter,
  onEsc,
}: {
  label: string;
  short: string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onCommit: (n: number) => void;
  onEnter: () => void;
  onEsc: () => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? String(value);
  return (
    <label className="uxm-color-input__channel">
      <input
        type="text"
        inputMode="numeric"
        className="uxm-color-input__channel-field"
        aria-label={label}
        value={shown}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
        onChange={(e) => {
          const raw = e.target.value;
          setDraft(raw);
          const n = Number(raw);
          if (raw.trim() !== '' && !Number.isNaN(n)) onCommit(clamp(n, min, max));
        }}
        onFocus={() => setDraft(String(value))}
        onBlur={() => setDraft(null)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const n = Number(draft ?? value);
            if (!Number.isNaN(n)) onCommit(clamp(n, min, max));
            onEnter();
          } else if (e.key === 'Escape') {
            setDraft(null);
            onEsc();
          }
        }}
      />
      <span className="uxm-color-input__channel-label" aria-hidden="true">{short}</span>
    </label>
  );
}

export interface ColorInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Current value (controlled) — any supported color string. */
  value?: string;
  /** Initial value for uncontrolled usage. Defaults to `#000000`. */
  defaultValue?: string;
  /** Called with the color formatted per `outputFormat` on every commit. */
  onChange?: (color: string) => void;
  /** Formats offered in the representation select. Defaults to all four. */
  formats?: ColorFormat[];
  /** Format of the value passed to `onChange` / `onEnter`. Defaults to `hex`. */
  outputFormat?: ColorFormat;
  /** Enter in a value field commits it and fires this with the current color. */
  onEnter?: (color: string) => void;
  /** Escape reverts the field draft to the last committed value and fires this. */
  onEsc?: () => void;
  /** Show the opacity slider. Defaults to true. */
  alpha?: boolean;
  /** Show the screen eyedropper button (Chromium only; auto-hidden elsewhere). Defaults to true. */
  eyedropper?: boolean;
  /** Disable all interaction. */
  disabled?: boolean;
  /** Non-empty string renders the error state and message below the panel. */
  error?: string;
}

/**
 * Full inline color picker: a saturation/brightness area, hue and opacity
 * sliders, a swatch, an optional screen eyedropper, a format select and a
 * per-format value editor (one hex text field, or R/G/B(/A) or H/S/L numeric
 * fields). The working model is HSVA (hue and alpha are kept even when
 * saturation/value hit 0, where RGB→HSV can't recover them). Switching format
 * re-derives the fields from the current color — that's the conversion.
 */
export function ColorInput({
  value,
  defaultValue,
  onChange,
  formats,
  outputFormat = 'hex',
  onEnter,
  onEsc,
  alpha = true,
  eyedropper = true,
  disabled = false,
  error,
  className,
  style,
  ...rest
}: ColorInputProps) {
  const isControlled = value !== undefined;

  const [hsva, setHsva] = useState<HSVA>(() => {
    const parsed = parseColorString((isControlled ? value : defaultValue) ?? '#000000');
    return parsed ? rgbaToHsva(parsed) : { h: 0, s: 0, v: 0, a: 1 };
  });

  const availableFormats = formats && formats.length > 0 ? formats : DEFAULT_FORMATS;
  // Visible representation, switched by the in-component select. Independent of
  // `outputFormat`, which fixes only what `onChange` returns — the field can
  // display HSL while `onChange` still emits hex. Defaults to hex when offered.
  const [displayFormat, setDisplayFormat] = useState<ColorFormat>(() =>
    availableFormats.includes('hex') ? 'hex' : availableFormats[0],
  );

  const [hexDraft, setHexDraft] = useState<string | null>(null);
  const [hexInvalid, setHexInvalid] = useState(false);

  const currentRgba: RGBA = hsvaToRgba(hsva);
  const resolvedOutput = outputFormat;

  // The exact string we last emitted via `onChange`. Lets the controlled sync
  // below tell our own echo apart from a genuine external change without
  // comparing colors — which matters when `outputFormat` is lossy (e.g. `rgb`
  // drops alpha): the emitted string round-trips to a different color, but
  // it's still our echo and must not clobber the hue/alpha we hold.
  const lastEmittedRef = useRef<string | null>(isControlled ? (value ?? null) : null);

  // Controlled sync: adopt an external `value` only when it isn't the string we
  // just emitted. `hsva` is deliberately not a dependency — the ref, not the
  // working model, is the comparison baseline.
  useEffect(() => {
    if (!isControlled) return;
    if (value === lastEmittedRef.current) return;
    const incoming = parseColorString(value ?? '');
    if (!incoming) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- controlled/uncontrolled sync: adopt a genuine external value change into the working HSVA model; the echo guard above skips our own onChange round-trips
    setHsva(rgbaToHsva(incoming));
  }, [value, isControlled]);

  const emit = (next: HSVA, opts?: { enter?: boolean }) => {
    setHsva(next);
    const out = formatColor(hsvaToRgba(next), resolvedOutput);
    lastEmittedRef.current = out;
    onChange?.(out);
    if (opts?.enter) onEnter?.(out);
  };

  // ── Saturation / brightness area ──
  const satRef = useRef<HTMLDivElement>(null);
  const updateSaturation = (clientX: number, clientY: number) => {
    const el = satRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const s = clamp((clientX - rect.left) / rect.width, 0, 1) * 100;
    const v = (1 - clamp((clientY - rect.top) / rect.height, 0, 1)) * 100;
    emit({ ...hsva, s, v });
  };
  const handleSatPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSaturation(e.clientX, e.clientY);
  };
  const handleSatPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || e.buttons !== 1) return;
    updateSaturation(e.clientX, e.clientY);
  };
  const handleSatKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const step = e.shiftKey ? 10 : 1;
    let { s, v } = hsva;
    switch (e.key) {
      case 'ArrowRight': s = clamp(s + step, 0, 100); break;
      case 'ArrowLeft': s = clamp(s - step, 0, 100); break;
      case 'ArrowUp': v = clamp(v + step, 0, 100); break;
      case 'ArrowDown': v = clamp(v - step, 0, 100); break;
      default: return;
    }
    e.preventDefault();
    emit({ ...hsva, s, v });
  };

  // ── Hue track ──
  const hueRef = useRef<HTMLDivElement>(null);
  const updateHue = (clientX: number) => {
    const el = hueRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    emit({ ...hsva, h: clamp((clientX - rect.left) / rect.width, 0, 1) * 360 });
  };
  const handleHuePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateHue(e.clientX);
  };
  const handleHuePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || e.buttons !== 1) return;
    updateHue(e.clientX);
  };
  const handleHueKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const step = e.shiftKey ? 10 : 1;
    let h = hsva.h;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') h = clamp(h + step, 0, 360);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') h = clamp(h - step, 0, 360);
    else if (e.key === 'Home') h = 0;
    else if (e.key === 'End') h = 360;
    else return;
    e.preventDefault();
    emit({ ...hsva, h });
  };

  // ── Alpha track ──
  const alphaRef = useRef<HTMLDivElement>(null);
  const updateAlpha = (clientX: number) => {
    const el = alphaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    emit({ ...hsva, a: clamp((clientX - rect.left) / rect.width, 0, 1) });
  };
  const handleAlphaPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateAlpha(e.clientX);
  };
  const handleAlphaPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || e.buttons !== 1) return;
    updateAlpha(e.clientX);
  };
  const handleAlphaKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const step = e.shiftKey ? 0.1 : 0.01;
    let a = hsva.a;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') a = clamp(a + step, 0, 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') a = clamp(a - step, 0, 1);
    else if (e.key === 'Home') a = 0;
    else if (e.key === 'End') a = 1;
    else return;
    e.preventDefault();
    emit({ ...hsva, a });
  };

  // ── Value editor: shared Enter / Escape for every field type ──
  const emitEnter = () => onEnter?.(formatColor(currentRgba, resolvedOutput));
  const emitEsc = () => onEsc?.();

  // Hex field (single text input) — draft commits on Enter / blur.
  const hexShown = hexDraft ?? formatColor(currentRgba, 'hex');
  const commitHex = (): boolean => {
    if (hexDraft === null) return true;
    const parsed = parseColorString(hexDraft);
    if (!parsed) {
      setHexInvalid(true);
      return false;
    }
    setHexInvalid(false);
    emit(rgbaToHsva(parsed));
    return true;
  };

  // RGB(A) channel commits — reconstruct RGBA, keep alpha unless it's the edit.
  const setRgbChannel = (patch: Partial<RGBA>) => emit(rgbaToHsva({ ...currentRgba, ...patch }));

  // HSL channel commits — reconstruct via HSL→RGB, then re-derive HSVA but keep
  // the edited hue so H stays stable even at S=0 / L=0 (where hue is ambiguous).
  const hslNow = rgbToHsl(currentRgba);
  const commitHsl = (patch: { h?: number; s?: number; l?: number }) => {
    const next = { h: hsva.h, s: hslNow.s, l: hslNow.l, ...patch };
    const rgb = hslToRgb(next);
    const hsvaNext = rgbaToHsva({ ...rgb, a: currentRgba.a });
    emit({ ...hsvaNext, h: next.h });
  };

  // ── Eyedropper ──
  const EyeDropperCtor = getEyeDropper();
  const showEyedropper = eyedropper && EyeDropperCtor !== null;
  const handleEyeDropper = async () => {
    if (!EyeDropperCtor || disabled) return;
    try {
      const result = await new EyeDropperCtor().open();
      const parsed = parseColorString(result.sRGBHex);
      if (parsed) emit(rgbaToHsva({ ...parsed, a: hsva.a }));
    } catch {
      // User dismissed the eyedropper — nothing to commit.
    }
  };

  const showFormat = availableFormats.length > 1;

  // Dynamic, non-theming CSS variables: the current hue drives the saturation
  // gradient, the solid (opaque) color drives the alpha-track gradient, and the
  // full value (with alpha) fills the swatch. All geometry of the color space,
  // not themable design values.
  const cssVars = {
    '--uxm-color-input-hue': hsva.h,
    '--uxm-color-input-solid': `rgb(${Math.round(currentRgba.r)}, ${Math.round(currentRgba.g)}, ${Math.round(currentRgba.b)})`,
    '--uxm-color-input-value': formatColor(currentRgba, 'rgba'),
    ...style,
  } as CSSProperties;

  return (
    <div
      className={cn(
        'uxm-color-input',
        disabled && 'uxm-color-input--disabled',
        error && 'uxm-color-input--error',
        !alpha && 'uxm-color-input--no-alpha',
        className,
      )}
      style={cssVars}
      {...rest}
    >
      <div
        ref={satRef}
        className="uxm-color-input__saturation"
        role="slider"
        aria-label="Color"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(hsva.s)}
        aria-valuetext={`Saturation ${Math.round(hsva.s)}%, Brightness ${Math.round(hsva.v)}%`}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={handleSatPointerDown}
        onPointerMove={handleSatPointerMove}
        onKeyDown={handleSatKeyDown}
      >
        <span
          className="uxm-color-input__saturation-thumb"
          style={{ left: `${hsva.s}%`, top: `${100 - hsva.v}%` }}
        />
      </div>

      <div className="uxm-color-input__body">
        <div className="uxm-color-input__sliders">
          <div
            ref={hueRef}
            className="uxm-color-input__hue"
            role="slider"
            aria-label="Hue"
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={Math.round(hsva.h)}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : 0}
            onPointerDown={handleHuePointerDown}
            onPointerMove={handleHuePointerMove}
            onKeyDown={handleHueKeyDown}
          >
            <span className="uxm-color-input__track-thumb" style={{ left: `${(hsva.h / 360) * 100}%` }} />
          </div>
          {alpha && (
            <div
              ref={alphaRef}
              className="uxm-color-input__alpha"
              role="slider"
              aria-label="Opacity"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(hsva.a * 100)}
              aria-disabled={disabled || undefined}
              tabIndex={disabled ? -1 : 0}
              onPointerDown={handleAlphaPointerDown}
              onPointerMove={handleAlphaPointerMove}
              onKeyDown={handleAlphaKeyDown}
            >
              <span className="uxm-color-input__track-thumb" style={{ left: `${hsva.a * 100}%` }} />
            </div>
          )}
        </div>

        <span className="uxm-color-input__swatch" aria-hidden="true" />

        {showEyedropper && (
          <button
            type="button"
            className="uxm-color-input__eyedropper"
            aria-label="Pick color from screen"
            disabled={disabled}
            onClick={handleEyeDropper}
          >
            <Icon glyph="eyedropper" size={16} />
          </button>
        )}
      </div>

      <div className="uxm-color-input__controls">
        {showFormat && (
          <Select
            className="uxm-color-input__format"
            aria-label="Color format"
            value={displayFormat}
            disabled={disabled}
            onChange={(e) => {
              setDisplayFormat(e.target.value as ColorFormat);
              setHexDraft(null);
              setHexInvalid(false);
            }}
          >
            {availableFormats.map((f) => (
              <option key={f} value={f}>
                {FORMAT_LABELS[f]}
              </option>
            ))}
          </Select>
        )}

        {displayFormat === 'hex' ? (
          <input
            type="text"
            className={cn('uxm-color-input__field', hexInvalid && 'uxm-color-input__field--invalid')}
            value={hexShown}
            disabled={disabled}
            aria-label="Hex color value"
            aria-invalid={hexInvalid || undefined}
            spellCheck={false}
            autoComplete="off"
            onChange={(e) => setHexDraft(e.target.value)}
            onFocus={() => {
              setHexDraft(formatColor(currentRgba, 'hex'));
              setHexInvalid(false);
            }}
            onBlur={() => {
              commitHex();
              setHexDraft(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (commitHex()) emitEnter();
              } else if (e.key === 'Escape') {
                setHexDraft(null);
                setHexInvalid(false);
                emitEsc();
              }
            }}
          />
        ) : (
          <div className="uxm-color-input__channels">
            {(displayFormat === 'rgb' || displayFormat === 'rgba') && (
              <>
                <ChannelInput label="Red" short="R" value={Math.round(currentRgba.r)} min={0} max={255} disabled={disabled} onCommit={(n) => setRgbChannel({ r: n })} onEnter={emitEnter} onEsc={emitEsc} />
                <ChannelInput label="Green" short="G" value={Math.round(currentRgba.g)} min={0} max={255} disabled={disabled} onCommit={(n) => setRgbChannel({ g: n })} onEnter={emitEnter} onEsc={emitEsc} />
                <ChannelInput label="Blue" short="B" value={Math.round(currentRgba.b)} min={0} max={255} disabled={disabled} onCommit={(n) => setRgbChannel({ b: n })} onEnter={emitEnter} onEsc={emitEsc} />
                {displayFormat === 'rgba' && (
                  <ChannelInput label="Alpha" short="A" value={Math.round(currentRgba.a * 100)} min={0} max={100} disabled={disabled} onCommit={(n) => emit({ ...hsva, a: n / 100 })} onEnter={emitEnter} onEsc={emitEsc} />
                )}
              </>
            )}
            {displayFormat === 'hsl' && (
              <>
                <ChannelInput label="Hue" short="H" value={Math.round(hsva.h)} min={0} max={360} disabled={disabled} onCommit={(n) => commitHsl({ h: n })} onEnter={emitEnter} onEsc={emitEsc} />
                <ChannelInput label="Saturation" short="S" value={Math.round(hslNow.s)} min={0} max={100} disabled={disabled} onCommit={(n) => commitHsl({ s: n })} onEnter={emitEnter} onEsc={emitEsc} />
                <ChannelInput label="Lightness" short="L" value={Math.round(hslNow.l)} min={0} max={100} disabled={disabled} onCommit={(n) => commitHsl({ l: n })} onEnter={emitEnter} onEsc={emitEsc} />
              </>
            )}
          </div>
        )}
      </div>

      {error && <FieldError className="uxm-color-input__error-message">{error}</FieldError>}
    </div>
  );
}
// Static marker so FormField only forwards its `error` prop into children
// that accept one (avoids React unknown-prop warnings on non-input children).
ColorInput.hasError = true;

export interface ColorInputPopoverProps extends ColorInputProps {
  /** Popover open state (controlled). Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. Defaults to false. */
  defaultOpen?: boolean;
  /** Called when the popover requests open/close. */
  onOpenChange?: (open: boolean) => void;
  /** Preferred popover placement. Defaults to `bottom-start`. */
  placement?: PopoverPlacement;
  /** Accessible name for the trigger swatch. Defaults to `Choose color`. */
  triggerLabel?: string;
}

/**
 * Compact swatch trigger that opens {@link ColorInput} in a popover. Enter and
 * Escape inside the panel additionally close the popover (Enter after a commit,
 * Escape after reverting the draft); `Popover`'s own Escape/outside-click
 * dismissal covers the rest.
 */
export function ColorInputPopover({
  open,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  triggerLabel = 'Choose color',
  value,
  defaultValue,
  onChange,
  onEnter,
  onEsc,
  formats,
  outputFormat = 'hex',
  alpha,
  eyedropper,
  disabled,
  error,
  className,
  style,
  ...rest
}: ColorInputPopoverProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const isOpenControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isOpenControlled ? open : uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (!isOpenControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const isColorControlled = value !== undefined;
  const [internalColor, setInternalColor] = useState(defaultValue ?? '#000000');
  const currentColor = isColorControlled ? value : internalColor;
  const handleChange = (color: string) => {
    if (!isColorControlled) setInternalColor(color);
    onChange?.(color);
  };

  return (
    <>
      <button
        // rest carries the shared HTMLAttributes<HTMLDivElement> passthrough
        // (id, data-*, aria-*, title, …); its event-handler generics are
        // div-typed but structurally identical on a button at runtime.
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={triggerRef}
        type="button"
        className={cn('uxm-color-input-popover__trigger', className)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`${triggerLabel}: ${currentColor}`}
        disabled={disabled}
        style={{ '--uxm-color-input-value': currentColor, ...style } as CSSProperties}
        onClick={() => setOpen(!isOpen)}
      />
      <Popover
        open={isOpen}
        onOpenChange={setOpen}
        anchor={triggerRef}
        placement={placement}
        role="dialog"
        aria-label={triggerLabel}
        className="uxm-color-input-popover__panel"
      >
        <ColorInput
          value={currentColor}
          onChange={handleChange}
          onEnter={(color) => {
            onEnter?.(color);
            setOpen(false);
          }}
          onEsc={() => {
            onEsc?.();
            setOpen(false);
          }}
          formats={formats}
          outputFormat={outputFormat}
          alpha={alpha}
          eyedropper={eyedropper}
          error={error}
        />
      </Popover>
    </>
  );
}
ColorInputPopover.hasError = true;
