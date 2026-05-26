"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, InputHTMLAttributes } from "react";
import { cn } from "@/helpers";
import { Icon } from "../icon";
import { Calendar, type CalendarValue } from "../calendar";

export type DateInputFormat = "mdy" | "dmy" | "ymd";
export type DateInputMode = "single" | "range";

const RANGE_SEPARATOR = " – ";

export interface DateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "defaultValue" | "type" | "style"> {
  /** Format mask. Drives placeholder, the digit-segment layout, and Calendar ↔ input parsing. */
  format?: DateInputFormat;
  /**
   * Selection mode. `single` picks one date and closes after one click; `range`
   * keeps the popover open after the first click and shows both dates joined by
   * `" – "` once the second click commits the end. Range mode makes the input
   * read-only — the `"MM/DD/YYYY – MM/DD/YYYY"` shape isn't practical to type.
   */
  mode?: DateInputMode;
  /** Formatted string value (controlled). In range mode use `"start – end"`. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the masked, formatted value after each keystroke or calendar pick. */
  onChange?: (formatted: string) => void;
  /**
   * Render the calendar icon button and enable the click-to-open popover.
   * Defaults to true. Pass false for a typing-only date field (no icon, no popover).
   */
  calendar?: boolean;
  /**
   * Inline style applied to the WRAPPER (not the inner <input>). CSS custom
   * properties set here cascade to every descendant — the input AND the
   * popover (a sibling of the input) — so theming knobs reach all parts.
   */
  style?: React.CSSProperties;
}

const FORMAT_SPEC: Record<DateInputFormat, { segments: number[]; sep: string; placeholder: string }> = {
  mdy: { segments: [2, 2, 4], sep: "/", placeholder: "MM/DD/YYYY" },
  dmy: { segments: [2, 2, 4], sep: "/", placeholder: "DD/MM/YYYY" },
  ymd: { segments: [4, 2, 2], sep: "-", placeholder: "YYYY-MM-DD" },
};

/** Auto-format raw input per the chosen format. Strips non-digits, caps at the format's total digit count, inserts separators. */
function maskDate(raw: string, format: DateInputFormat): string {
  const spec = FORMAT_SPEC[format];
  const maxDigits = spec.segments.reduce((sum, n) => sum + n, 0);
  const digits = raw.replace(/\D/g, "").slice(0, maxDigits);
  let out = "";
  let consumed = 0;
  for (let i = 0; i < spec.segments.length; i++) {
    const segDigits = digits.slice(consumed, consumed + spec.segments[i]);
    if (!segDigits) break;
    if (i > 0) out += spec.sep;
    out += segDigits;
    consumed += spec.segments[i];
  }
  return out;
}

/**
 * Parse a formatted date string back to a Date so the Calendar can highlight
 * it. Returns null until enough digits are typed for a complete date AND the
 * date is valid (month 1–12, day 1–31). Doesn't catch deeper invalidity (Feb 30)
 * — JS Date will silently roll over, which is a benign mismatch.
 */
function parseDate(formatted: string, format: DateInputFormat): Date | null {
  const digits = formatted.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  let y: number, m: number, d: number;
  if (format === "ymd") {
    y = Number(digits.slice(0, 4));
    m = Number(digits.slice(4, 6));
    d = Number(digits.slice(6, 8));
  } else if (format === "mdy") {
    m = Number(digits.slice(0, 2));
    d = Number(digits.slice(2, 4));
    y = Number(digits.slice(4, 8));
  } else {
    d = Number(digits.slice(0, 2));
    m = Number(digits.slice(2, 4));
    y = Number(digits.slice(4, 8));
  }
  if (!m || !d || !y || m < 1 || m > 12 || d < 1 || d > 31) return null;
  return new Date(y, m - 1, d);
}

/** Format a Date back into the chosen mask. Inverse of `parseDate`. */
function formatDate(date: Date, format: DateInputFormat): string {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const y = String(date.getFullYear()).padStart(4, "0");
  switch (format) {
    case "mdy": return `${m}/${d}/${y}`;
    case "dmy": return `${d}/${m}/${y}`;
    case "ymd": return `${y}-${m}-${d}`;
  }
}

/** Range-aware value formatter: `"<start>"` or `"<start> – <end>"`. */
function formatRangeValue(value: CalendarValue, format: DateInputFormat): string {
  if (!value.start) return "";
  const startStr = formatDate(value.start, format);
  if (!value.end) return startStr;
  return `${startStr}${RANGE_SEPARATOR}${formatDate(value.end, format)}`;
}

/** Range-aware value parser. Splits on ` – ` and parses each half independently. */
function parseRangeValue(formatted: string, format: DateInputFormat): CalendarValue {
  const parts = formatted.split(RANGE_SEPARATOR);
  return {
    start: parts[0] ? parseDate(parts[0], format) : null,
    end: parts[1] ? parseDate(parts[1], format) : null,
  };
}

/** Build a placeholder that doubles up the mask for range mode. */
function placeholderFor(format: DateInputFormat, mode: DateInputMode): string {
  const single = FORMAT_SPEC[format].placeholder;
  return mode === "range" ? `${single}${RANGE_SEPARATOR}${single}` : single;
}

export function DateInput({
  format = "mdy",
  mode = "single",
  className,
  placeholder,
  value,
  defaultValue,
  onChange,
  calendar = true,
  style,
  ...rest
}: DateInputProps) {
  // Initial state — same masker for single, plain string for range (typing
  // disabled in range mode so no need to mask).
  const [internal, setInternal] = useState<string>(() =>
    mode === "single" ? maskDate(defaultValue ?? "", format) : defaultValue ?? "",
  );
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mode switch resets the internal value — a range string is invalid input
  // in single mode (and vice versa). Also close the popover so the user starts
  // a fresh pick under the new mode. Only touches uncontrolled state; if the
  // consumer is driving `value` they own the reset themselves.
  //
  // The ref guard skips the FIRST run of this effect so the `useState`
  // initializer (which masks `defaultValue`) doesn't get clobbered on mount.
  // Without the guard, `<DateInput defaultValue="01/01/2020" />` renders
  // empty because the effect fires once at mount and overwrites the
  // masked initial value with "".
  const isFirstModeEffect = useRef(true);
  useEffect(() => {
    if (isFirstModeEffect.current) {
      isFirstModeEffect.current = false;
      return;
    }
    setInternal("");
    setIsOpen(false);
  }, [mode]);

  // Close on click outside or Escape. Mounting only when `isOpen` is true
  // keeps the global listeners off when the popover is closed.
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // Range mode is read-only; this guard prevents any sneaky programmatic edits.
      if (mode === "range") return;
      const formatted = maskDate(e.target.value, format);
      if (!isControlled) setInternal(formatted);
      onChange?.(formatted);
    },
    [mode, isControlled, onChange, format],
  );

  const handleCalendarChange = useCallback(
    (calValue: CalendarValue) => {
      if (!calValue.start) return;
      if (mode === "range") {
        // Calendar fires after every click: end=null after first, end set after second.
        // Update the input either way (so the user sees the in-flight start) but only
        // close when the range is fully committed.
        const formatted = formatRangeValue(calValue, format);
        if (!isControlled) setInternal(formatted);
        onChange?.(formatted);
        if (calValue.end) setIsOpen(false);
      } else {
        // Single mode — first click commits and closes.
        const formatted = formatDate(calValue.start, format);
        if (!isControlled) setInternal(formatted);
        onChange?.(formatted);
        setIsOpen(false);
      }
    },
    [mode, isControlled, onChange, format],
  );

  // Mirror the input's current value into the Calendar so it highlights what
  // the user has selected. Range mode parses two halves; single mode parses one.
  // In single mode we set `end = start` (same-day "range") so Calendar's click
  // logic sees a *committed* selection, not an in-flight first-click. Otherwise
  // the next click would be treated as the second click of a range — exactly
  // the bug where switching back to single still drew range styling.
  const calendarValue: CalendarValue = (() => {
    if (mode === "range") return parseRangeValue(current ?? "", format);
    const date = parseDate(current ?? "", format);
    return { start: date, end: date };
  })();

  return (
    <div className={cn("uxm-date-input", className)} ref={containerRef} style={style}>
      <input
        type="text"
        inputMode="numeric"
        readOnly={mode === "range"}
        className="uxm-date-input__input"
        placeholder={placeholder ?? placeholderFor(format, mode)}
        value={current}
        onChange={handleInputChange}
        {...rest}
      />
      {calendar && (
        <button
          type="button"
          className="uxm-date-input__icon"
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Open calendar"
          aria-expanded={isOpen}
        >
          <Icon glyph="calendar" />
        </button>
      )}
      {calendar && isOpen && (
        <div className="uxm-date-input__popover" role="dialog">
          <Calendar value={calendarValue} onChange={handleCalendarChange} />
        </div>
      )}
    </div>
  );
}
