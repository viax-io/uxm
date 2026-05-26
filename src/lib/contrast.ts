export interface RGB { r: number; g: number; b: number }

export function resolveCssColor(value: string, scope?: Element | null): string {
  const trimmed = value.trim();
  const varMatch = trimmed.match(/^var\((--[\w-]+)(?:\s*,\s*([^)]+))?\)$/);
  if (varMatch) {
    const source = scope ?? (typeof document !== "undefined" ? document.documentElement : null);
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
      ? h.split("").map((c) => c + c).join("")
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
        const n = p.endsWith("%") ? (parseFloat(p) * 255) / 100 : parseFloat(p);
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

export type WcagLevel = "AAA" | "AA" | "AA-large" | "fail";

export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA-large";
  return "fail";
}

export function rgbToHex({ r, g, b }: RGB): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
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
