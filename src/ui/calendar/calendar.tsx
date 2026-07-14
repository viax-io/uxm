import { useCallback, useMemo, useRef, useState } from 'react';

import { cn } from '@/helpers';

import { computeMonthGrid, type WeekStart } from '../../lib/calendar-grid';
import { Icon } from '../icon';

import type { HTMLAttributes, KeyboardEvent } from 'react';

export interface CalendarValue {
  start: Date | null;
  end: Date | null;
}

type CalendarView = 'day' | 'month' | 'year';

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Currently-displayed month. Controlled. If omitted, atom owns it (initialized to the selected value's month, else today's). */
  month?: Date;
  /** Selection value. Controlled when passed. `{ start, end: null }` for a single date; `{ start, end }` for a range. */
  value?: CalendarValue;
  /** Override for "today". Defaults to real current date. */
  today?: Date;
  /** Predicate for disabled days. Disabled cells ignore clicks. */
  isDisabled?: (date: Date) => boolean;
  /** 0 = Sunday (US), 1 = Monday. */
  weekStartsOn?: WeekStart;
  /** Locale for month label and weekday names. */
  locale?: string;
  /** Fires after every click. `end` is null after the first click of a new range, set after the second. */
  onChange?: (value: CalendarValue) => void;
  /** Month navigation callback (prev/next buttons, outside-month-cell click, or drilling via month/year views). */
  onMonthChange?: (next: Date) => void;
  /** Drop a soft elevation shadow (the floating-surface look). Default true — pass `false` for a flat, inline / embedded calendar. */
  shadow?: boolean;
}

const MS_PER_DAY = 86_400_000;
const YEARS_PER_BLOCK = 12;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}
function isStrictlyBetween(date: Date, start: Date | null | undefined, end: Date | null | undefined): boolean {
  if (!start || !end) return false;
  const t = startOfDay(date).getTime();
  const lo = Math.min(startOfDay(start).getTime(), startOfDay(end).getTime());
  const hi = Math.max(startOfDay(start).getTime(), startOfDay(end).getTime());
  return t > lo && t < hi;
}

function getWeekdayLabels(locale: string, weekStartsOn: WeekStart): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  // 2024-01-07 is a known Sunday — stable anchor for the formatter.
  const anchor = new Date(2024, 0, 7);
  const labels: string[] = [];
  for (let i = 0; i < 7; i++) {
    labels.push(fmt.format(new Date(anchor.getTime() + i * MS_PER_DAY)));
  }
  return weekStartsOn === 1 ? [...labels.slice(1), labels[0]] : labels;
}

/**
 * Year-block start for the year view. 12-year blocks aligned to multiples of
 * `YEARS_PER_BLOCK` (e.g. 2024 → 2016–2027). Block alignment is the iOS pattern;
 * picking any other anchor (decades, etc.) is equally valid — this just keeps
 * navigation predictable.
 */
function yearBlockStart(year: number): number {
  return Math.floor(year / YEARS_PER_BLOCK) * YEARS_PER_BLOCK;
}

/** True if any day of `year-month` overlaps the inclusive selection range. */
function monthOverlapsSelection(year: number, monthIdx: number, value: CalendarValue): boolean {
  if (!value.start) return false;
  const monthFirstMs = new Date(year, monthIdx, 1).getTime();
  const monthLastMs = new Date(year, monthIdx + 1, 0).getTime();
  const sMs = startOfDay(value.start).getTime();
  const eMs = value.end ? startOfDay(value.end).getTime() : sMs;
  const lo = Math.min(sMs, eMs);
  const hi = Math.max(sMs, eMs);
  return monthFirstMs <= hi && monthLastMs >= lo;
}

/** True if `year` falls within the inclusive selection range's year span. */
function yearOverlapsSelection(year: number, value: CalendarValue): boolean {
  if (!value.start) return false;
  const sY = value.start.getFullYear();
  const eY = value.end ? value.end.getFullYear() : sY;
  const lo = Math.min(sY, eY);
  const hi = Math.max(sY, eY);
  return year >= lo && year <= hi;
}

const EMPTY_VALUE: CalendarValue = { start: null, end: null };

/**
 * Default roving-tabindex target for the day grid: the selected day if
 * it's in the visible grid and enabled, else today if visible and
 * enabled, else the first enabled cell, else 0. Keeps the grid reachable
 * via Tab even when the "obvious" cell happens to be disabled.
 */
function defaultDayFocusIndex(
  cells: { date: Date; outside: boolean }[],
  start: Date | null,
  today: Date,
  isCellDisabled: (date: Date) => boolean,
): number {
  const startIndex = start ? cells.findIndex((c) => sameDay(c.date, start)) : -1;
  if (startIndex >= 0 && !isCellDisabled(cells[startIndex].date)) return startIndex;
  const todayIndex = cells.findIndex((c) => sameDay(c.date, today));
  if (todayIndex >= 0 && !isCellDisabled(cells[todayIndex].date)) return todayIndex;
  const firstEnabled = cells.findIndex((c) => !isCellDisabled(c.date));
  return firstEnabled >= 0 ? firstEnabled : 0;
}

export function Calendar({
  month,
  value,
  today,
  isDisabled,
  weekStartsOn = 0,
  locale = 'en-US',
  onChange,
  onMonthChange,
  shadow = true,
  className,
  ...rest
}: CalendarProps) {
  const realToday = useMemo(() => today ?? new Date(), [today]);

  // Month state — controlled when `month` prop is provided. When uncontrolled,
  // seed from the current selection so opening on an existing date lands on
  // that date's month, not today's. The popover consumers mount the calendar
  // fresh per open, so this initial `value` is the selected date; nav then
  // owns `internalMonth`. Falls back to today's month when nothing's selected.
  const [internalMonth, setInternalMonth] = useState<Date>(() => {
    // `end` covers the range-input edge case where only the closing half is
    // seeded (`{ start: null, end }`); today is the last resort.
    const seed = value?.start ?? value?.end ?? realToday;
    return new Date(seed.getFullYear(), seed.getMonth(), 1);
  });
  const currentMonth = month ?? internalMonth;

  // View state — pure UI state, never controlled. Day view by default. Header
  // click drills up (day → month → year). Cell click drills back down.
  const [view, setView] = useState<CalendarView>('day');

  // Unified selection model — atom infers single vs range from click sequence.
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<CalendarValue>(EMPTY_VALUE);
  const currentValue = isControlled ? value : internalValue;
  const currentStart = currentValue.start;
  const currentEnd = currentValue.end;

  // Hover preview — only meaningful in the in-flight window in day view.
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const inFlight = !!currentStart && !currentEnd;
  const previewEnd = inFlight && hoveredDate ? hoveredDate : currentEnd;
  const isRangeView = !!currentStart && !!previewEnd && !sameDay(currentStart, previewEnd);

  const dayCells = useMemo(
    () => computeMonthGrid(currentMonth, weekStartsOn),
    [currentMonth, weekStartsOn],
  );

  const isCellDisabled = useCallback((date: Date) => isDisabled?.(date) ?? false, [isDisabled]);

  // Roving tabindex across the day grid (ARIA grid pattern): only one cell
  // is a Tab stop at a time; arrow keys move it. `dayRefs` lets the arrow
  // handler call `.focus()` on the target cell after moving the index.
  const dayRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusedDayIndex, setFocusedDayIndex] = useState<number>(() =>
    defaultDayFocusIndex(dayCells, currentStart, realToday, isCellDisabled),
  );

  const weekdays = useMemo(
    () => getWeekdayLabels(locale, weekStartsOn),
    [locale, weekStartsOn],
  );

  // Header label — depends on the active view.
  const titleLabel = useMemo(() => {
    if (view === 'day') {
      return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(currentMonth);
    }
    if (view === 'month') {
      return String(currentMonth.getFullYear());
    }
    const start = yearBlockStart(currentMonth.getFullYear());
    return `${start}–${start + YEARS_PER_BLOCK - 1}`;
  }, [view, currentMonth, locale]);

  // Month-view labels — short month names from the locale formatter.
  const monthShortNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { month: 'short' });
    return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2024, i, 1)));
  }, [locale]);

  const setMonth = useCallback(
    (next: Date) => {
      if (month === undefined) setInternalMonth(next);
      onMonthChange?.(next);
      // Re-target the day grid's roving tab stop for the month we're
      // navigating to — the previous index otherwise points at an
      // unrelated cell (or none) in the new grid.
      const nextCells = computeMonthGrid(next, weekStartsOn);
      setFocusedDayIndex(defaultDayFocusIndex(nextCells, currentStart, realToday, isCellDisabled));
    },
    [month, onMonthChange, weekStartsOn, currentStart, realToday, isCellDisabled],
  );

  // Prev/next nav stepping is view-aware: day → ±1 month, month → ±1 year,
  // year → ±12 years (one block).
  const handleNav = useCallback(
    (delta: number) => {
      const m = currentMonth.getMonth();
      const y = currentMonth.getFullYear();
      let next: Date;
      if (view === 'day') {
        next = new Date(y, m + delta, 1);
      } else if (view === 'month') {
        next = new Date(y + delta, m, 1);
      } else {
        next = new Date(y + delta * YEARS_PER_BLOCK, m, 1);
      }
      setMonth(next);
    },
    [view, currentMonth, setMonth],
  );

  // Header click drills up. Year view has nowhere further to go.
  const handleTitleClick = useCallback(() => {
    if (view === 'day') setView('month');
    else if (view === 'month') setView('year');
  }, [view]);

  const commit = useCallback(
    (next: CalendarValue) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  // Day-cell click — the unified single/range click logic.
  const handleDayClick = useCallback(
    (date: Date, outside: boolean, disabled: boolean) => {
      if (disabled) return;
      if (outside) {
        setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      }
      const startingNew = !currentStart || !!currentEnd;
      if (startingNew) {
        commit({ start: date, end: null });
      } else {
        const s = currentStart!;
        let finalStart = s;
        let finalEnd = date;
        if (startOfDay(date).getTime() < startOfDay(s).getTime()) {
          finalStart = date;
          finalEnd = s;
        }
        commit({ start: finalStart, end: finalEnd });
      }
      setHoveredDate(null);
    },
    [currentStart, currentEnd, commit, setMonth],
  );

  // Month-view click drills back to day view for the clicked month.
  const handleMonthClick = useCallback(
    (monthIdx: number) => {
      setMonth(new Date(currentMonth.getFullYear(), monthIdx, 1));
      setView('day');
    },
    [currentMonth, setMonth],
  );

  // Year-view click drills to month view for the clicked year, preserving
  // the previously-active month-of-year so the user doesn't lose context.
  const handleYearClick = useCallback(
    (year: number) => {
      setMonth(new Date(year, currentMonth.getMonth(), 1));
      setView('month');
    },
    [currentMonth, setMonth],
  );

  const handleMouseEnter = useCallback(
    (date: Date, disabled: boolean) => {
      if (disabled) return;
      if (inFlight) setHoveredDate(date);
    },
    [inFlight],
  );

  const handleMouseLeave = useCallback((date: Date) => {
    setHoveredDate((prev) => (sameDay(prev, date) ? null : prev));
  }, []);

  // ARIA grid keyboard navigation for the day view: ArrowLeft/Right move a
  // day, ArrowUp/Down move a week, Home/End jump to the start/end of the
  // current week row. Stays within the visible 6×7 grid (doesn't cross
  // into the previous/next month) — disabled cells are skipped so arrow
  // navigation never lands on (and gets stuck at) an inert cell.
  const handleDayKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
      const rowStart = i - (i % 7);
      let step = 0;
      let bound: number | null = null;
      switch (e.key) {
        case 'ArrowLeft':
          step = -1;
          break;
        case 'ArrowRight':
          step = 1;
          break;
        case 'ArrowUp':
          step = -7;
          break;
        case 'ArrowDown':
          step = 7;
          break;
        case 'Home':
          step = -1;
          bound = rowStart;
          break;
        case 'End':
          step = 1;
          bound = rowStart + 6;
          break;
        default:
          return;
      }
      e.preventDefault();
      let next = bound ?? i + step;
      while (
        next >= 0 &&
        next < dayCells.length &&
        isCellDisabled(dayCells[next].date)
      ) {
        next += step;
      }
      if (next < 0 || next >= dayCells.length) return;
      setFocusedDayIndex(next);
      dayRefs.current[next]?.focus();
    },
    [dayCells, isCellDisabled],
  );

  return (
    <div className={cn('uxm-calendar', `uxm-calendar--view-${view}`, shadow && 'uxm-calendar--shadow', className)} {...rest}>
      <div className="uxm-calendar__header">
        <button
          type="button"
          className="uxm-calendar__nav"
          onClick={() => handleNav(-1)}
          aria-label="Previous"
        >
          <Icon glyph="chevron-left" size={16} />
        </button>
        <button
          type="button"
          className="uxm-calendar__title"
          onClick={handleTitleClick}
          disabled={view === 'year'}
          aria-label={view === 'year' ? undefined : 'Drill up'}
        >
          {titleLabel}
        </button>
        <button
          type="button"
          className="uxm-calendar__nav"
          onClick={() => handleNav(1)}
          aria-label="Next"
        >
          <Icon glyph="chevron-right" size={16} />
        </button>
      </div>

      {view === 'day' && (
        <>
          <div className="uxm-calendar__weekdays" aria-hidden="true">
            {weekdays.map((w) => (
              <div key={w} className="uxm-calendar__weekday">{w}</div>
            ))}
          </div>
          <div className="uxm-calendar__grid" role="grid">
            {Array.from({ length: dayCells.length / 7 }, (_, week) => (
              // `display: contents` (see calendar.scss) keeps these cells as
              // direct participants in the parent's CSS grid while giving
              // each week its own `role="row"` — the ARIA grid pattern
              // requires gridcells to be grouped into rows.
              <div key={week} role="row" className="uxm-calendar__grid-row">
                {dayCells.slice(week * 7, week * 7 + 7).map(({ date, outside }, col) => {
                  const i = week * 7 + col;
                  const isToday = sameDay(date, realToday);
                  const isStart = sameDay(date, currentStart);
                  const isEnd = !!previewEnd && sameDay(date, previewEnd);
                  const isSelected = !isRangeView && isStart;
                  const isRangeStart = isRangeView && isStart;
                  const isRangeEnd = isRangeView && isEnd;
                  const isInRange = isStrictlyBetween(date, currentStart, previewEnd);
                  const disabled = isDisabled?.(date) ?? false;
                  return (
                    <button
                      key={i}
                      ref={(el) => {
                        dayRefs.current[i] = el;
                      }}
                      type="button"
                      role="gridcell"
                      disabled={disabled}
                      tabIndex={i === focusedDayIndex ? 0 : -1}
                      onClick={() => {
                        handleDayClick(date, outside, disabled);
                        if (!disabled && !outside) setFocusedDayIndex(i);
                      }}
                      onKeyDown={(e) => handleDayKeyDown(e, i)}
                      onMouseEnter={() => handleMouseEnter(date, disabled)}
                      onMouseLeave={() => handleMouseLeave(date)}
                      className={cn(
                        'uxm-calendar__day',
                        outside && 'uxm-calendar__day--outside',
                        isToday && 'uxm-calendar__day--today',
                        isSelected && 'uxm-calendar__day--selected',
                        isRangeStart && 'uxm-calendar__day--range-start',
                        isRangeEnd && 'uxm-calendar__day--range-end',
                        isInRange && 'uxm-calendar__day--in-range',
                        disabled && 'uxm-calendar__day--disabled',
                      )}
                      aria-selected={isSelected || isRangeStart || isRangeEnd || undefined}
                      aria-current={isToday ? 'date' : undefined}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'month' && (
        <div className="uxm-calendar__months" role="grid">
          {monthShortNames.map((name, i) => {
            const year = currentMonth.getFullYear();
            const isCurrent = realToday.getFullYear() === year && realToday.getMonth() === i;
            const isSelected = monthOverlapsSelection(year, i, currentValue);
            return (
              <button
                key={i}
                type="button"
                role="gridcell"
                onClick={() => handleMonthClick(i)}
                className={cn(
                  'uxm-calendar__month',
                  isCurrent && 'uxm-calendar__month--today',
                  isSelected && 'uxm-calendar__month--selected',
                )}
                aria-selected={isSelected || undefined}
                aria-current={isCurrent ? 'true' : undefined}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      {view === 'year' && (
        <div className="uxm-calendar__years" role="grid">
          {Array.from({ length: YEARS_PER_BLOCK }, (_, i) => {
            const year = yearBlockStart(currentMonth.getFullYear()) + i;
            const isCurrent = realToday.getFullYear() === year;
            const isSelected = yearOverlapsSelection(year, currentValue);
            return (
              <button
                key={year}
                type="button"
                role="gridcell"
                onClick={() => handleYearClick(year)}
                className={cn(
                  'uxm-calendar__year',
                  isCurrent && 'uxm-calendar__year--today',
                  isSelected && 'uxm-calendar__year--selected',
                )}
                aria-selected={isSelected || undefined}
                aria-current={isCurrent ? 'true' : undefined}
              >
                {year}
              </button>
            );
          })}
        </div>
      )}

      {/* "Today" — jumps the view back to the current month in day view so
          the user can find today after navigating away. Deliberately does
          NOT select today (returning to a date ≠ committing it); the day
          cell is one click away. */}
      <div className="uxm-calendar__footer">
        <button
          type="button"
          className="uxm-calendar__today-button"
          disabled={isDisabled?.(realToday)}
          onClick={() => {
            setView('day');
            setMonth(new Date(realToday.getFullYear(), realToday.getMonth(), 1));
          }}
        >
          Today
        </button>
      </div>
    </div>
  );
}
