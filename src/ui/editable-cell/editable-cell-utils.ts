import { formatDate as formatDateAs, type DateInputFormat } from '../date-input';

import type { EditableCellValue } from './editable-cell.types';

/** Strict `YYYY-MM-DD` → local Date (no TZ surprises), null if not parseable. */
export function parseISODate(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const day = Number(m[3]);
  const d = new Date(y, mo - 1, day);
  // Reject regex-valid but out-of-range dates: `new Date(2024, 1, 30)` silently
  // rolls over to Mar 1 rather than producing NaN, which would later read as a
  // value change and trigger an unprompted rewrite. Require a clean round-trip.
  if (d.getFullYear() !== y || d.getMonth() !== mo - 1 || d.getDate() !== day) return null;
  return d;
}

/** Serialize a Date to ISO (`YYYY-MM-DD`) — reuses the shared `ymd` formatter. */
export const toISODate = (d: Date): string => formatDateAs(d, 'ymd');

/**
 * Committed dates are stored ISO (`YYYY-MM-DD`); the input and display show
 * the cell's `dateFormat` mask. Convert ISO → mask so `dmy`/`mdy` cells read
 * and edit in their own shape. Values that aren't ISO (e.g. a consumer's
 * already-formatted seed) pass through untouched.
 */
export function isoToFormatted(value: EditableCellValue, format: DateInputFormat): string {
  if (typeof value !== 'string' || !value) return '';
  const d = parseISODate(value);
  return d ? formatDateAs(d, format) : value;
}

/**
 * Emptiness rule for the `required` check — the single definition shared by
 * every editor type: an empty array (multiselect), a NaN number (blank numeric
 * draft), or a blank/whitespace string (text/select/date).
 */
export function isEmptyValue(v: EditableCellValue): boolean {
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'number') return Number.isNaN(v);
  return String(v ?? '').trim() === '';
}
