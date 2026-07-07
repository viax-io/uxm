import { hslToRgb, rgbToHsl, rgbToHex, type RGB } from '@/lib/contrast';

/**
 * Color model for ColorInput. Adds the pieces `@/lib/contrast` doesn't cover:
 * an alpha channel (`RGBA`), the HSV color space (`HSVA` — the natural model
 * for a 2D saturation/value picker), a permissive multi-syntax parser
 * (`parseColorString`) and a format-directed serializer (`formatColor`).
 * Everything hue/lightness related delegates to the shared `contrast` helpers
 * so there's one source of truth for the math.
 */

/** The output/representation formats ColorInput understands. */
export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl';

/** Red/green/blue channels 0–255, alpha 0–1. */
export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Hue 0–360, saturation & value 0–100, alpha 0–1. */
export interface HSVA {
  h: number;
  s: number;
  v: number;
  a: number;
}

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

/**
 * RGB → HSV. Hue matches the HSL convention (so it lines up with the shared
 * hue slider), but saturation/value use the HSV formulas — that's what a
 * rectangular saturation/brightness area needs.
 */
export function rgbToHsv({ r, g, b }: RGB): { h: number; s: number; v: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case rn: h = ((gn - bn) / d) % 6; break;
      case gn: h = (bn - rn) / d + 2; break;
      default: h = (rn - gn) / d + 4; break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s: s * 100, v: max * 100 };
}

/** HSV → RGB (channels 0–255). Inverse of `rgbToHsv`. */
export function hsvToRgb({ h, s, v }: { h: number; s: number; v: number }): RGB {
  const sn = clamp(s, 0, 100) / 100;
  const vn = clamp(v, 0, 100) / 100;
  const c = vn * sn;
  const hp = ((((h % 360) + 360) % 360)) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = vn - c;
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

/** Combine `rgbToHsv` with an alpha passthrough. */
export function rgbaToHsva(rgba: RGBA): HSVA {
  const { h, s, v } = rgbToHsv(rgba);
  return { h, s, v, a: rgba.a };
}

/** Combine `hsvToRgb` with an alpha passthrough. */
export function hsvaToRgba(hsva: HSVA): RGBA {
  const { r, g, b } = hsvToRgb(hsva);
  return { r, g, b, a: hsva.a };
}

/** Parse an alpha token — `"0.5"` or `"50%"` — into a clamped 0–1 number. */
function parseAlpha(token: string): number {
  const n = token.endsWith('%') ? parseFloat(token) / 100 : parseFloat(token);
  return Number.isNaN(n) ? 1 : clamp(n, 0, 1);
}

/**
 * Parse any of the supported color syntaxes into `RGBA`, or `null` when the
 * string isn't a recognizable color. Handles:
 *   - hex: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa` (alpha from the 4/8-digit forms)
 *   - `rgb()` / `rgba()` — channels as 0–255 or `%`, optional 4th alpha component
 *   - `hsl()` / `hsla()` — converted through the shared `hslToRgb`
 * Comma- and space/slash-separated argument lists are both accepted.
 */
export function parseColorString(input: string): RGBA | null {
  const v = input.trim();

  const hex = v.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    const h = hex[1];
    if (h.length === 3 || h.length === 4) {
      return {
        r: parseInt(h[0] + h[0], 16),
        g: parseInt(h[1] + h[1], 16),
        b: parseInt(h[2] + h[2], 16),
        a: h.length === 4 ? parseInt(h[3] + h[3], 16) / 255 : 1,
      };
    }
    if (h.length === 6 || h.length === 8) {
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
        a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
      };
    }
    return null;
  }

  const rgb = v.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const parts = rgb[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const channels = parts.slice(0, 3).map((p) =>
      p.endsWith('%') ? Math.round((parseFloat(p) * 255) / 100) : Math.round(parseFloat(p)),
    );
    if (channels.some((n) => Number.isNaN(n))) return null;
    const [r, g, b] = channels;
    return { r, g, b, a: parts[3] !== undefined ? parseAlpha(parts[3]) : 1 };
  }

  const hsl = v.match(/^hsla?\(([^)]+)\)$/i);
  if (hsl) {
    const parts = hsl[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const h = parseFloat(parts[0]);
    const s = parseFloat(parts[1]);
    const l = parseFloat(parts[2]);
    if ([h, s, l].some((n) => Number.isNaN(n))) return null;
    const { r, g, b } = hslToRgb({ h, s, l });
    return {
      r: Math.round(r),
      g: Math.round(g),
      b: Math.round(b),
      a: parts[3] !== undefined ? parseAlpha(parts[3]) : 1,
    };
  }

  return null;
}

/** Serialize an alpha value with up to 2 decimals and no trailing zeros. */
function formatAlpha(a: number): string {
  return String(Math.round(clamp(a, 0, 1) * 100) / 100);
}

/** Serialize a single channel as a two-digit lowercase hex byte. */
function hexByte(n: number): string {
  return clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
}

/**
 * Serialize `RGBA` into the requested format:
 *   - `hex`  → `#rrggbb`, or `#rrggbbaa` when `a < 1`
 *   - `rgb`  → `rgb(r, g, b)` (alpha dropped)
 *   - `rgba` → `rgba(r, g, b, a)`
 *   - `hsl`  → `hsl(h, s%, l%)`, or `hsla(h, s%, l%, a)` when `a < 1`
 */
export function formatColor(rgba: RGBA, format: ColorFormat): string {
  const r = clamp(Math.round(rgba.r), 0, 255);
  const g = clamp(Math.round(rgba.g), 0, 255);
  const b = clamp(Math.round(rgba.b), 0, 255);
  switch (format) {
    case 'hex':
      return rgba.a < 1 ? `${rgbToHex({ r, g, b })}${hexByte(rgba.a * 255)}` : rgbToHex({ r, g, b });
    case 'rgb':
      return `rgb(${r}, ${g}, ${b})`;
    case 'rgba':
      return `rgba(${r}, ${g}, ${b}, ${formatAlpha(rgba.a)})`;
    case 'hsl': {
      const { h, s, l } = rgbToHsl({ r, g, b });
      const hr = Math.round(h);
      const sr = Math.round(s);
      const lr = Math.round(l);
      return rgba.a < 1
        ? `hsla(${hr}, ${sr}%, ${lr}%, ${formatAlpha(rgba.a)})`
        : `hsl(${hr}, ${sr}%, ${lr}%)`;
    }
  }
}
