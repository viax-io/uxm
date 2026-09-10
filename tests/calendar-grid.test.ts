import { describe, expect, it } from 'vitest';

import { computeMonthGrid } from '@/lib/calendar-grid';
import type { WeekStart } from '@/lib/calendar-grid';

// The month-grid maths behind Calendar and DateInput. The four months below
// are the ones the module's own docblock claims to be verified against.

const CASES: Array<{ label: string; month: Date; days: number }> = [
  { label: 'October 2024', month: new Date(2024, 9, 1), days: 31 },
  { label: 'February 2024 (leap)', month: new Date(2024, 1, 15), days: 29 },
  { label: 'February 2023', month: new Date(2023, 1, 1), days: 28 },
  { label: 'December 2024 (year boundary)', month: new Date(2024, 11, 31), days: 31 },
];

const ymd = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

describe('computeMonthGrid', () => {
  for (const weekStart of [0, 1] as WeekStart[]) {
    describe(`week starts on ${weekStart === 0 ? 'Sunday' : 'Monday'}`, () => {
      for (const { label, month, days } of CASES) {
        it(`${label}: 42 consecutive cells starting on the week-start day, filler marked outside`, () => {
          const cells = computeMonthGrid(month, weekStart);
          expect(cells).toHaveLength(42);
          expect(cells[0].date.getDay()).toBe(weekStart);

          for (let i = 1; i < cells.length; i++) {
            const diff = cells[i].date.getTime() - cells[i - 1].date.getTime();
            expect(Math.round(diff / 3_600_000)).toBeGreaterThanOrEqual(23); // DST-safe "one day"
            expect(Math.round(diff / 3_600_000)).toBeLessThanOrEqual(25);
          }

          const inside = cells.filter((c) => !c.outside);
          expect(inside).toHaveLength(days);
          expect(inside[0].date.getDate()).toBe(1);
          expect(inside[inside.length - 1].date.getDate()).toBe(days);
          for (const cell of cells) {
            expect(cell.outside).toBe(cell.date.getMonth() !== month.getMonth());
            expect(cell.date.getHours()).toBe(0);
          }
        });
      }
    });
  }

  it('reads only year and month from the input date', () => {
    const a = computeMonthGrid(new Date(2024, 9, 1, 13, 45), 1);
    const b = computeMonthGrid(new Date(2024, 9, 31), 1);
    expect(a.map((c) => ymd(c.date))).toEqual(b.map((c) => ymd(c.date)));
  });

  it('defaults to a Sunday start and crosses the year boundary', () => {
    const cells = computeMonthGrid(new Date(2024, 11, 1));
    expect(cells[0].date.getDay()).toBe(0);
    expect(ymd(cells[0].date)).toBe('2024-12-1');
    expect(ymd(cells[41].date)).toBe('2025-1-11');
    expect(cells[41].outside).toBe(true);

    const monday = computeMonthGrid(new Date(2024, 11, 1), 1);
    expect(ymd(monday[0].date)).toBe('2024-11-25');
    expect(ymd(monday[41].date)).toBe('2025-1-5');
  });
});
