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

interface RGBA { r: number; g: number; b: number; a: number }

/** The alpha of a functional colour: after ` / ` in the modern syntax, the 4th comma argument in `rgba()`/`hsla()`. */
function alphaOf(args: string): number | undefined {
  const slash = args.lastIndexOf('/');
  let raw: string | undefined;
  if (slash >= 0) raw = args.slice(slash + 1).trim();
  else {
    const commas = args.split(',');
    if (commas.length === 4) raw = commas[3].trim();
  }
  if (raw === undefined || raw === '') return undefined;
  const n = raw.endsWith('%') ? parseFloat(raw) / 100 : parseFloat(raw);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * A literal hex or `rgb()`/`rgba()` colour as numbers, or `null` for anything
 * else. Pure string work, no DOM: used to compare knob values, not to resolve them.
 */
function parseLiteral(value: string): RGBA | null {
  const v = value.trim().toLowerCase();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (hex) {
    const h = hex[1].length <= 4 ? hex[1].split('').map((c) => c + c).join('') : hex[1];
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }
  const fn = v.match(/^rgba?\(([^)]+)\)$/);
  if (!fn) return null;
  const parts = fn[1].split(/[\s,/]+/).filter(Boolean).slice(0, 3);
  if (parts.length < 3) return null;
  const [r, g, b] = parts.map((p) => Math.round(p.endsWith('%') ? (parseFloat(p) * 255) / 100 : parseFloat(p)));
  if (![r, g, b].every(Number.isFinite)) return null;
  return { r, g, b, a: alphaOf(fn[1]) ?? 1 };
}

/**
 * Two knob values naming the same colour. Literal colours compare by value, so
 * a registry default of `#fff` matches the `#FFFFFF` a picker round-trip
 * writes; anything else compares as text, ignoring case and spacing.
 */
export function sameColorValue(a: string, b: string): boolean {
  const ca = parseLiteral(a);
  const cb = parseLiteral(b);
  if (ca && cb) {
    return ca.r === cb.r && ca.g === cb.g && ca.b === cb.b && Math.abs(ca.a - cb.a) < 1 / 255;
  }
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '');
  return norm(a) === norm(b);
}

/**
 * True when the value has an alpha below 1 (`rgba(0,0,0,.12)`, `#0000001F`,
 * `oklch(0.2 0 0 / 40%)`, `color(srgb 0 0 0 / .5)`). Translucent fixed colours
 * are shadows and overlays: a tint of whatever is under them, which no opaque
 * token can stand in for.
 */
export function isTranslucent(value: string): boolean {
  const v = value.trim();
  const hex = v.match(/^#(?:[0-9a-f]{4}|[0-9a-f]{8})$/i);
  if (hex) {
    const a = v.length === 5 ? v[4] + v[4] : v.slice(7, 9);
    return parseInt(a, 16) < 255;
  }
  // Colour functions only: a gradient's last stop may carry ` / .2` too.
  const fn = v.match(/^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(([^()]+)\)$/i);
  if (!fn) return false;
  const alpha = alphaOf(fn[1]);
  return alpha !== undefined && alpha < 1;
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
