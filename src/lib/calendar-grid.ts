/**
 * Month-grid math for the Calendar atom. Pure: no React, no DOM, no I/O.
 * Verified against October 2024, February 2024 (leap), February 2023, and
 * December 2024 (year boundary) with both Sunday- and Monday-start.
 */

/** 0 = Sunday, 1 = Monday. */
export type WeekStart = 0 | 1;

export interface CalendarCell {
  /** Absolute date this cell represents. Time component is midnight local. */
  date: Date;
  /** True when the date belongs to the previous or next month (grid filler). */
  outside: boolean;
}

/**
 * Build the 42-cell (6 weeks × 7 days) grid for the month containing `month`.
 *
 * The grid always starts on the chosen week-start day and always has 42 cells,
 * so each row aligns to a weekday and the prev / next-month overflow cells
 * fill the gaps. Year boundaries (e.g. Dec 2024 → Jan 2025) are handled by
 * JS `Date` arithmetic: `new Date(y, 11, 32)` rolls into Jan 1 of the next year.
 *
 * @param month         Any date in the month to display. Only year + month read.
 * @param weekStartsOn  0 for Sunday (US), 1 for Monday (most of the world).
 */
export function computeMonthGrid(month: Date, weekStartsOn: WeekStart = 0): CalendarCell[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstWeekday = new Date(year, m, 1).getDay(); // 0 = Sunday
  // Days to go back from the 1st to land on the chosen week-start day.
  // Sun start (0): back-offset equals firstWeekday.
  // Mon start (1): the formula `(firstWeekday - 1 + 7) % 7` handles the wrap
  // when the 1st falls on Sunday (firstWeekday=0 → back-offset=6).
  const backOffset = (firstWeekday - weekStartsOn + 7) % 7;
  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(year, m, 1 - backOffset + i);
    cells.push({ date, outside: date.getMonth() !== m });
  }
  return cells;
}
