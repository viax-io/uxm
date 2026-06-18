/**
 * Colour conversions for the ColorPicker atom. HEX is the canonical wire
 * format (tokens are opaque 6-digit hex); HSV drives the visual picker
 * (saturation/value area + hue slider).
 */

export interface RGB {
  r: number; // 0–255
  g: number;
  b: number;
}

export interface HSV {
  h: number; // 0–360
  s: number; // 0–100
  v: number; // 0–100
}

/** Normalise any `#rgb` / `#rrggbb` (with or without `#`) to `#RRGGBB`, or null. */
export function normalizeHex(value: string): string | null {
  const m = value.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{6}$/.test(m)) return `#${m.toUpperCase()}`;
  if (/^[0-9a-fA-F]{3}$/.test(m)) {
    return `#${m.split('').map((c) => c + c).join('').toUpperCase()}`;
  }
  return null;
}

export function hexToRgb(value: string): RGB | null {
  const hex = normalizeHex(value);
  if (!hex) return null;
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const c = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s: s * 100, v: max * 100 };
}

export function hsvToRgb({ h, s, v }: HSV): RGB {
  const sn = s / 100;
  const vn = v / 100;
  const c = vn * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vn - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function hexToHsv(value: string): HSV | null {
  const rgb = hexToRgb(value);
  return rgb ? rgbToHsv(rgb) : null;
}

export function hsvToHex(hsv: HSV): string {
  return rgbToHex(hsvToRgb(hsv));
}

export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));