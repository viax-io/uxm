import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { cn } from '@/helpers';

import { useRovingTabIndex } from '../../hooks/use-roving-tab-index';
import { FieldError } from '../field-error';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';
import { Popover } from '../popover';

import type { ChangeEvent, InputHTMLAttributes } from 'react';

export type TimeInputFormat = '24h' | '12h';

export interface TimeInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue' | 'type' | 'style'> {
  /**
   * Clock convention. `24h` masks as `HH:MM` (00:00–23:59); `12h` masks as
   * `HH:MM` plus an AM/PM selector. Drives placeholder shape, the hour
   * column in the popover, and the trailing meridiem control.
   */
  format?: TimeInputFormat;
  /** Formatted string value (controlled). E.g. `"09:30"` or `"09:30 AM"`. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the masked, formatted value after each keystroke, meridiem flip, or column pick. */
  onChange?: (formatted: string) => void;
  /**
   * Render the trailing clock icon. Defaults to true. When `picker` is also
   * true, the icon doubles as the popover toggle; when `picker` is false it
   * stays decorative. Pass `clock={false}` for an icon-less field.
   */
  clock?: boolean;
  /**
   * Mount the column-scroll popover (hour / minute / AM-PM lists) under the
   * field, opened by clicking the clock icon. Defaults to true. Pass false
   * for a typing-only field — the clock icon stays decorative. Requires
   * `clock` to be true; otherwise there's no trigger to open the popover.
   */
  picker?: boolean;
  /**
   * Minute step shown in the popover's minute column. Defaults to 1
   * (every minute, exhaustive). Pass a coarser step (e.g. 5, 15, 30) for
   * scheduling apps where finer resolution would clutter the column.
   * If the field's current minute is off-step, it's still inserted into
   * the column so a typed `09:03` doesn't vanish under `minuteStep={5}`.
   */
  minuteStep?: number;
  /**
   * Show a clear (✕) button when the field has a value. On by default (opt out
   * with `clearable={false}`). The ✕ sits inboard of the trailing clock icon
   * (and, in 12h, inboard of the AM/PM badge). The component owns the reset —
   * it wipes its own uncontrolled state and fires `onChange("")` — so no
   * separate `onClear` is needed.
   */
  clearable?: boolean;
  /**
   * Inline style applied to the WRAPPER (not the inner <input>). CSS custom
   * properties set here cascade to every descendant — the input, the AM/PM
   * select, AND the popover (a sibling of the input) — so theming knobs
   * reach all parts.
   */
  style?: React.CSSProperties;
  /**
   * When set to a non-empty string, the field renders in its error state:
   * the `--error` modifier sits on the wrapper (so the inner input, clock
   * icon, and meridiem badge re-tone), `aria-invalid` lands on the inner
   * `<input>`, and the message renders below. Omit (or pass an empty
   * string) for the normal state.
   */
  error?: string;
}

const TIME_PLACEHOLDER = 'HH:MM';
const MERIDIEMS = ['AM', 'PM'] as const;
type Meridiem = (typeof MERIDIEMS)[number];

/**
 * Mask raw input as `HH:MM`. Strips non-digits, caps at 4 digits, inserts the
 * colon after the second digit. Hour / minute validity is loose — the consumer
 * sees the raw masked string and can decide whether to validate strictly,
 * matching DateInput's permissive parse philosophy.
 */
function maskTime(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

/** Split a stored `"HH:MM"` or `"HH:MM AM"` into `{ time, meridiem }`. */
function splitValue(formatted: string, format: TimeInputFormat): { time: string; meridiem: Meridiem } {
  if (format === '24h') return { time: formatted, meridiem: 'AM' };
  const parts = formatted.trim().split(/\s+/);
  const time = parts[0] ?? '';
  const meridiem = (parts[1] === 'PM' ? 'PM' : 'AM') as Meridiem;
  return { time, meridiem };
}

/** Re-assemble `{ time, meridiem }` into the wire-format string. */
function joinValue(time: string, meridiem: Meridiem, format: TimeInputFormat): string {
  if (format === '24h') return time;
  return time ? `${time} ${meridiem}` : '';
}

/** Parse `"HH:MM"` into `{ hh, mm }` strings (empty when absent). */
function parseHHMM(time: string): { hh: string; mm: string } {
  const [hh, mm] = (time ?? '').split(':');
  return { hh: hh ?? '', mm: mm ?? '' };
}

const pad2 = (n: number): string => String(n).padStart(2, '0');

/**
 * Hour-column rows for the popover. 24h yields 00–23 in order; 12h yields
 * `12, 01, 02, …, 11` — `12` at the top matches the Ant Design / iOS
 * convention where 12 represents the "zero" hour of each half-day.
 */
function buildHours(format: TimeInputFormat): string[] {
  if (format === '24h') return Array.from({ length: 24 }, (_, i) => pad2(i));
  return [pad2(12), ...Array.from({ length: 11 }, (_, i) => pad2(i + 1))];
}

/**
 * Minute-column rows at the given step (5 → 00,05,…,55). If `current` is
 * supplied and falls off-step (e.g. user typed "09:03" with step=5), it's
 * inserted at the right sorted position so the popover never hides a
 * legitimately typed value. Out-of-range or non-numeric `current` is
 * ignored, matching the parser's permissive-input philosophy.
 */
function buildMinutes(step: number, current?: string): string[] {
  const safeStep = Math.max(1, Math.min(60, Math.floor(step)));
  const out: string[] = [];
  for (let m = 0; m < 60; m += safeStep) out.push(pad2(m));
  if (current && /^\d{1,2}$/.test(current)) {
    const n = Number(current);
    if (n >= 0 && n < 60 && !out.includes(pad2(n))) {
      out.push(pad2(n));
      out.sort();
    }
  }
  return out;
}

/**
 * Scroll a column body so its currently-selected row sits roughly in the
 * middle of the visible area. Called when the popover opens so the user
 * never has to scroll to find their existing value.
 */
function centerSelected(body: HTMLElement | null) {
  if (!body) return;
  const selected = body.querySelector<HTMLElement>('.uxm-time-input__row--selected');
  if (!selected) return;
  body.scrollTop = selected.offsetTop - body.clientHeight / 2 + selected.clientHeight / 2;
}

export function TimeInput({
  format = '24h',
  className,
  placeholder,
  value,
  defaultValue,
  onChange,
  clock = true,
  picker = true,
  minuteStep = 1,
  clearable = true,
  style,
  disabled,
  error,
  onFocus,
  ...rest
}: TimeInputProps) {
  const errorId = useId();
  const [internal, setInternal] = useState<string>(() => {
    const seed = defaultValue ?? '';
    const { time, meridiem } = splitValue(seed, format);
    return joinValue(maskTime(time), meridiem, format);
  });
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const { time, meridiem } = splitValue(current ?? '', format);
  const { hh, mm } = parseHHMM(time);

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hourBodyRef = useRef<HTMLDivElement>(null);
  const minuteBodyRef = useRef<HTMLDivElement>(null);

  // Format switch clears uncontrolled state — a stored "13:00" makes no
  // sense if the user just flipped to 12h, and a "09:30 AM" string would
  // dangle stale meridiem under 24h. Mirrors DateInput's mode-flip reset.
  // The ref guard skips the FIRST run so the `useState` initializer
  // (which preserves `defaultValue`) doesn't get clobbered on mount.
  const isFirstFormatEffect = useRef(true);
  useEffect(() => {
    if (isFirstFormatEffect.current) {
      isFirstFormatEffect.current = false;
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional format-switch reset of the uncontrolled value + popover, ref-guarded to skip mount
    if (!isControlled) setInternal('');
    setIsOpen(false);
  }, [format, isControlled]);

  // Click-outside + Escape dismissal: handled by Popover. The anchor is
  // the OUTER wrapper (`containerRef`) so clicks on the input field
  // don't close the picker.

  // When the popover opens, scroll each column so the current selection is
  // visible without manual scrolling. Runs after paint so offsetTop is real.
  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => {
      centerSelected(hourBodyRef.current);
      centerSelected(minuteBodyRef.current);
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  const commit = useCallback(
    (nextTime: string, nextMeridiem: Meridiem) => {
      const next = joinValue(nextTime, nextMeridiem, format);
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [format, isControlled, onChange],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      commit(maskTime(e.target.value), meridiem);
    },
    [meridiem, commit],
  );

  // Column picks each touch only their own segment of the value. If the
  // other segment is empty (first interaction with a blank field), we
  // seed a reasonable default so the picked value commits as a parseable
  // HH:MM rather than "09:" or ":30".
  const handleHourPick = useCallback(
    (h: string) => {
      commit(`${h}:${mm || '00'}`, meridiem);
    },
    [mm, meridiem, commit],
  );
  const handleMinutePick = useCallback(
    (m: string) => {
      const fallbackHour = format === '12h' ? '12' : '00';
      commit(`${hh || fallbackHour}:${m}`, meridiem);
    },
    [hh, meridiem, format, commit],
  );
  const handleMeridiemPick = useCallback(
    (next: Meridiem) => {
      commit(time, next);
    },
    [time, commit],
  );

  const hours = useMemo(() => buildHours(format), [format]);
  const minutes = useMemo(() => buildMinutes(minuteStep, mm), [minuteStep, mm]);

  // Roving tabindex for each popover column — ARIA listbox pattern: only
  // one row per column is a Tab stop; ArrowUp/Down move the highlight
  // within that column. Enter/Space and Escape are already covered for
  // free — rows are real <button>s (native Enter/Space activation) and
  // Escape/outside-click close the whole popover via `Popover`'s defaults.
  const [hourHighlight, setHourHighlight] = useState(0);
  const [minuteHighlight, setMinuteHighlight] = useState(0);
  const [meridiemHighlight, setMeridiemHighlight] = useState(0);
  const safeHourHighlight = Math.min(hourHighlight, hours.length - 1);
  const safeMinuteHighlight = Math.min(minuteHighlight, minutes.length - 1);
  const safeMeridiemHighlight = Math.min(meridiemHighlight, MERIDIEMS.length - 1);
  const hourRoving = useRovingTabIndex({
    count: hours.length,
    activeIndex: safeHourHighlight,
    orientation: 'vertical',
    onNavigate: setHourHighlight,
  });
  const minuteRoving = useRovingTabIndex({
    count: minutes.length,
    activeIndex: safeMinuteHighlight,
    orientation: 'vertical',
    onNavigate: setMinuteHighlight,
  });
  const meridiemRoving = useRovingTabIndex({
    count: MERIDIEMS.length,
    activeIndex: safeMeridiemHighlight,
    orientation: 'vertical',
    onNavigate: setMeridiemHighlight,
  });

  // The clock icon doubles as the popover trigger only when both `clock`
  // and `picker` are on. When picker is off (or clock is off), the icon
  // — if rendered — stays a decorative <span>.
  const triggerEnabled = clock && picker && !disabled;

  // Clear owns its own reset: wipe the value (time + meridiem) and notify via
  // onChange(""). Mirrors DateInput / NumberInput — the component holds its own
  // state, so no onClear prop is needed.
  const handleClear = useCallback(() => {
    if (!isControlled) setInternal('');
    onChange?.('');
  }, [isControlled, onChange]);
  const showClear = clearable && time.length > 0 && !disabled;

  return (
    <>
    <div
      className={cn(
        'uxm-time-input',
        error && 'uxm-time-input--error',
        clearable && 'uxm-time-input--clearable',
        className,
      )}
      style={style}
      data-format={format}
      ref={containerRef}
    >
      <input
        type="text"
        inputMode="numeric"
        className="uxm-time-input__input"
        placeholder={placeholder ?? TIME_PLACEHOLDER}
        value={time}
        onChange={handleInputChange}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onFocus={(e) => {
          if (triggerEnabled) setIsOpen(true);
          onFocus?.(e);
        }}
        {...rest}
      />
      {clock && (triggerEnabled ? (
        <button
          type="button"
          className="uxm-time-input__icon"
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Open time picker"
          aria-expanded={isOpen}
        >
          <Icon glyph="clock" />
        </button>
      ) : (
        <span className="uxm-time-input__icon" aria-hidden="true">
          <Icon glyph="clock" />
        </span>
      ))}
      {format === '12h' && (
        // Display-only meridiem badge. The popover's AM/PM column is the
        // sole interactive way to flip it — a separate <select> would
        // duplicate the same affordance and add a third "trailing thing"
        // crowding the field. Read-only span keeps the field's surface
        // calm and points the user at the popover for editing.
        <span className="uxm-time-input__meridiem" aria-hidden="true">
          {meridiem}
        </span>
      )}
      {showClear && (
        <IconButton
          className="uxm-field-clear uxm-time-input__clear"
          aria-label="Clear"
          // Keep focus off the input so clearing doesn't re-open the picker
          // popover via the input's onFocus handler.
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClear}
        >
          <Icon glyph="close" />
        </IconButton>
      )}
      {triggerEnabled && (
        <Popover
          open={isOpen}
          onOpenChange={setIsOpen}
          anchor={containerRef}
          placement="bottom-start"
          matchAnchorWidth
          // The field opens the popover on input `onFocus`. If Popover
          // restored focus to the input on close (its default), that focus
          // would immediately re-fire `onFocus` and reopen the popover —
          // so an outside click could never dismiss it. Opting out of focus
          // restoration breaks that loop (matches DateInput, which opens on
          // focus too and uses a non-restoring popover).
          restoreFocus={false}
          className="uxm-time-input__popover"
          aria-label="Pick a time"
        >
          <div className="uxm-time-input__column" role="listbox" aria-label="Hour">
            <div className="uxm-time-input__column-head">{hh || hours[0]}</div>
            <div className="uxm-time-input__column-body" ref={hourBodyRef}>
              {hours.map((h, i) => (
                <button
                  type="button"
                  role="option"
                  key={h}
                  ref={hourRoving.getItemRef(i)}
                  tabIndex={i === safeHourHighlight ? 0 : -1}
                  className={cn(
                    'uxm-time-input__row',
                    h === hh && 'uxm-time-input__row--selected',
                  )}
                  onClick={() => handleHourPick(h)}
                  onKeyDown={(e) => hourRoving.onItemKeyDown(e, i)}
                  aria-selected={h === hh}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
          <div className="uxm-time-input__column" role="listbox" aria-label="Minute">
            <div className="uxm-time-input__column-head">{mm || '00'}</div>
            <div className="uxm-time-input__column-body" ref={minuteBodyRef}>
              {minutes.map((m, i) => (
                <button
                  type="button"
                  role="option"
                  key={m}
                  ref={minuteRoving.getItemRef(i)}
                  tabIndex={i === safeMinuteHighlight ? 0 : -1}
                  className={cn(
                    'uxm-time-input__row',
                    m === mm && 'uxm-time-input__row--selected',
                  )}
                  onClick={() => handleMinutePick(m)}
                  onKeyDown={(e) => minuteRoving.onItemKeyDown(e, i)}
                  aria-selected={m === mm}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          {format === '12h' && (
            <div className="uxm-time-input__column" role="listbox" aria-label="AM or PM">
              <div className="uxm-time-input__column-head">{meridiem}</div>
              <div className="uxm-time-input__column-body">
                {MERIDIEMS.map((m, i) => (
                  <button
                    type="button"
                    role="option"
                    key={m}
                    ref={meridiemRoving.getItemRef(i)}
                    tabIndex={i === safeMeridiemHighlight ? 0 : -1}
                    className={cn(
                      'uxm-time-input__row',
                      m === meridiem && 'uxm-time-input__row--selected',
                    )}
                    onClick={() => handleMeridiemPick(m)}
                    onKeyDown={(e) => meridiemRoving.onItemKeyDown(e, i)}
                    aria-selected={m === meridiem}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Popover>
      )}
    </div>
    {error && (
      <FieldError id={errorId} className="uxm-time-input__error-message">
        {error}
      </FieldError>
    )}
    </>
  );
}
TimeInput.hasError = true;
