import { parseColor, type RGB } from '@/lib/contrast';

/**
 * Keywords a colour knob may hold that aren't a fixed colour: they follow
 * the cascade (`inherit`, `currentColor`) or paint nothing (`none`).
 */
const NOT_A_COLOR = new Set(['', 'none', 'transparent', 'inherit', 'initial', 'unset', 'revert', 'currentcolor']);

/**
 * CSS system colours: they follow the element's `color-scheme`, which a
 * Surface sets, so they track a dark or light panel on their own.
 */
const SYSTEM_COLORS = new Set([
  'canvas', 'canvastext', 'linktext', 'visitedtext', 'activetext', 'buttonface', 'buttontext',
  'buttonborder', 'field', 'fieldtext', 'highlight', 'highlighttext', 'selecteditem',
  'selecteditemtext', 'mark', 'marktext', 'graytext', 'accentcolor', 'accentcolortext',
]);

/**
 * True when a colour knob's value is FIXED: it names no `var(--…)`, so it
 * paints the same inside a dark panel, a light panel and the page. A token
 * (`var(--color-text)`) is re-resolved in each theme scope and follows it.
 *
 * Deliberately quiet on anything it can't judge: `color-mix()` (a mix of
 * literals may be a translucent overlay), `light-dark()` and the system
 * colours (both follow `color-scheme`).
 */
export function isFixedColor(value: string | number | boolean | undefined): boolean {
  if (typeof value !== 'string') return false;
  const v = value.trim().toLowerCase();
  if (NOT_A_COLOR.has(v) || SYSTEM_COLORS.has(v)) return false;
  if (/^(color-mix|light-dark)\(/.test(v)) return false;
  return !/var\(\s*--/.test(v);
}

/** Two knob values naming the same colour, ignoring case and spacing. */
export function sameColorValue(a: string, b: string): boolean {
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '');
  return norm(a) === norm(b);
}

/**
 * True when the value has an alpha below 1 (`rgba(0,0,0,.12)`, `#0000001F`).
 * Translucent fixed colours are shadows and overlays: a tint of whatever is
 * under them, which no opaque token can stand in for.
 */
export function isTranslucent(value: string): boolean {
  const v = value.trim();
  const hex = v.match(/^#(?:[0-9a-f]{4}|[0-9a-f]{8})$/i);
  if (hex) {
    const a = v.length === 5 ? v[4] + v[4] : v.slice(7, 9);
    return parseInt(a, 16) < 255;
  }
  const fn = v.match(/^(?:rgba?|hsla?)\(([^)]+)\)$/i);
  if (!fn) return false;
  const parts = fn[1].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 4) return false;
  const alpha = parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
  return alpha < 1;
}

/**
 * "Redmean" distance between two sRGB colours: a cheap approximation of how
 * different they look, much closer to perception than plain Euclidean RGB.
 */
function distance(a: RGB, b: RGB): number {
  const rMean = (a.r + b.r) / 2;
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt((2 + rMean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rMean) / 256) * db * db);
}

/**
 * The candidate whose colour is nearest to `value`, or `undefined` when the
 * value isn't an opaque colour this can parse (a named colour, a translucent
 * shadow, a gradient). Candidates carry their colour as resolved in the
 * active theme, so "nearest" means nearest to what the person sees now.
 */
export function nearestColor<T>(value: string, candidates: { item: T; color: string }[]): T | undefined {
  if (isTranslucent(value)) return undefined;
  const target = parseColor(value);
  if (!target) return undefined;
  let best: T | undefined;
  let bestDistance = Infinity;
  for (const { item, color } of candidates) {
    const rgb = parseColor(color);
    if (!rgb) continue;
    const d = distance(target, rgb);
    if (d < bestDistance) {
      bestDistance = d;
      best = item;
    }
  }
  return best;
}
