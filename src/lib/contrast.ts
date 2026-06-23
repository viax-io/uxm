export interface RGB { r: number; g: number; b: number }

export function resolveCssColor(value: string, scope?: Element | null): string {
  const trimmed = value.trim();
  const varMatch = trimmed.match(/^var\((--[\w-]+)(?:\s*,\s*([^)]+))?\)$/);
  if (varMatch) {
    const source = scope ?? (typeof document !== 'undefined' ? document.documentElement : null);
    if (source) {
      const resolved = getComputedStyle(source).getPropertyValue(varMatch[1]).trim();
      if (resolved) return resolveCssColor(resolved, scope);
    }
    if (varMatch[2]) return resolveCssColor(varMatch[2], scope);
  }
  return trimmed;
}

export function parseColor(value: string, scope?: Element | null): RGB | null {
  const v = resolveCssColor(value, scope);

  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hex) {
    const h = hex[1];
    const expand = h.length === 3 || h.length === 4
      ? h.split('').map((c) => c + c).join('')
      : h;
    return {
      r: parseInt(expand.slice(0, 2), 16),
      g: parseInt(expand.slice(2, 4), 16),
      b: parseInt(expand.slice(4, 6), 16),
    };
  }

  const rgb = v.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const parts = rgb[1].split(/[\s,/]+/).filter(Boolean).slice(0, 3);
    if (parts.length === 3) {
      const [r, g, b] = parts.map((p) => {
        const n = p.endsWith('%') ? (parseFloat(p) * 255) / 100 : parseFloat(p);
        return Math.round(n);
      });
      return { r, g, b };
    }
  }

  return null;
}

function channelLuminance(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance({ r, g, b }: RGB): number {
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

export function contrastRatio(fg: RGB, bg: RGB): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

export type WcagLevel = 'AAA' | 'AA' | 'AA-large' | 'fail';

export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA-large';
  return 'fail';
}

export function rgbToHex({ r, g, b }: RGB): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

export interface HSL {
  /** Hue in degrees, 0–360. */
  h: number;
  /** Saturation, 0–100. */
  s: number;
  /** Lightness, 0–100. */
  l: number;
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
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
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = Math.max(0, Math.min(100, s)) / 100;
  const ln = Math.max(0, Math.min(100, l)) / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = (((h % 360) + 360) % 360) / 60;
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
  const m = ln - c / 2;
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

/** Convert a hex (or any parseable color) string to HSL. Returns null if unparseable. */
export function hexToHsl(value: string, scope?: Element | null): HSL | null {
  const rgb = parseColor(value, scope);
  return rgb ? rgbToHsl(rgb) : null;
}

/** Convert HSL back to a `#rrggbb` hex string. */
export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Re-tint a color to a target hue while preserving its own saturation and
 * lightness — used to recompute an accent ramp from a single brand hue.
 * Returns a `#rrggbb` hex; falls back to the input if it can't be parsed.
 */
export function retintHue(value: string, targetHue: number, scope?: Element | null): string {
  const hsl = hexToHsl(value, scope);
  if (!hsl) return value;
  return hslToHex({ h: targetHue, s: hsl.s, l: hsl.l });
}

function mixToward(rgb: RGB, target: RGB, amount: number): RGB {
  return {
    r: rgb.r + (target.r - rgb.r) * amount,
    g: rgb.g + (target.g - rgb.g) * amount,
    b: rgb.b + (target.b - rgb.b) * amount,
  };
}

function searchTowardPole(fg: RGB, bg: RGB, pole: RGB, targetRatio: number): RGB | null {
  let lo = 0;
  let hi = 1;
  let best: RGB | null = null;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    const candidate = mixToward(fg, pole, mid);
    if (contrastRatio(candidate, bg) >= targetRatio) {
      best = candidate;
      hi = mid;
    } else {
      lo = mid;
    }
  }
  if (!best) return null;
  // Round to integer RGB and nudge toward pole until the rounded value still meets target.
  let rounded: RGB = { r: Math.round(best.r), g: Math.round(best.g), b: Math.round(best.b) };
  for (let step = 0; step < 16 && contrastRatio(rounded, bg) < targetRatio; step++) {
    rounded = {
      r: rounded.r + Math.sign(pole.r - rounded.r),
      g: rounded.g + Math.sign(pole.g - rounded.g),
      b: rounded.b + Math.sign(pole.b - rounded.b),
    };
  }
  return contrastRatio(rounded, bg) >= targetRatio ? rounded : null;
}

export function suggestAccessibleColor(fg: RGB, bg: RGB, targetRatio = 4.5): RGB | null {
  if (contrastRatio(fg, bg) >= targetRatio) return fg;
  const towardBlack = searchTowardPole(fg, bg, { r: 0, g: 0, b: 0 }, targetRatio);
  const towardWhite = searchTowardPole(fg, bg, { r: 255, g: 255, b: 255 }, targetRatio);
  if (towardBlack && towardWhite) {
    const dBlack = colorDistance(fg, towardBlack);
    const dWhite = colorDistance(fg, towardWhite);
    return dBlack <= dWhite ? towardBlack : towardWhite;
  }
  return towardBlack ?? towardWhite;
}

function colorDistance(a: RGB, b: RGB): number {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return dr * dr + dg * dg + db * db;
}

export interface TokenCandidate {
  variable: string;
  name: string;
  rgb: RGB;
}

export function suggestAccessibleToken(
  fg: RGB,
  bg: RGB,
  targetRatio: number,
  candidates: TokenCandidate[],
): TokenCandidate | null {
  const passing = candidates.filter((c) => contrastRatio(c.rgb, bg) >= targetRatio);
  if (passing.length === 0) return null;
  passing.sort((a, b) => colorDistance(fg, a.rgb) - colorDistance(fg, b.rgb));
  return passing[0];
}
