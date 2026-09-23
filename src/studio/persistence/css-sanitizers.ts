/**
 * CSS sanitizers — applied to every brand and override value before it is
 * interpolated into the generated stylesheet. The output is persisted and
 * served to every browser session, so an attacker-controlled value must not
 * be able to break out of the declaration it belongs to. Each returns
 * `undefined` for a rejected value; callers drop the declaration rather than
 * throw, so one bad value can never blank the whole sheet.
 */

export function safeUrl(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const trimmed = v.trim();
  if (!/^(https?:\/\/|\/)/.test(trimmed)) return undefined;
  if (/[")\n\r]/.test(trimmed)) return undefined;
  return trimmed;
}
export function safeFontFamily(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const trimmed = v.trim();
  return /^[A-Za-z0-9 _-]+$/.test(trimmed) ? trimmed : undefined;
}
// Heading weight is a closed set (the editor offers exactly these three), so a
// strict whitelist is both the sanitizer and the contract. Numbers are accepted
// defensively — a persisted config may carry the JSON number rather than the
// string the <select> yields.
export function safeFontWeight(v: unknown): string | undefined {
  const s = typeof v === 'number' ? String(v) : typeof v === 'string' ? v.trim() : undefined;
  return s !== undefined && /^(500|600|700)$/.test(s) ? s : undefined;
}
// Scales multiply a length inside calc(), which makes a bad value far worse
// than a dropped declaration: `abc` or `1.2px` (length × length) is invalid at
// computed-value time, so `font-size` resolves to `unset` and INHERITS — one
// poisoned value on :root collapses the whole app to the parent's size. A
// plain-number whitelist plus a sane range is the only safe gate; note
// `safeTokenValue` is NOT sufficient (it passes `abc`, `-1` and unbalanced
// parens). Range mirrors the editor's slider bounds.
export function safeTypeScale(v: unknown): string | undefined {
  const s = typeof v === 'number' ? String(v) : typeof v === 'string' ? v.trim() : undefined;
  if (s === undefined || !/^(?:0|[1-9]\d?)(?:\.\d{1,3})?$/.test(s)) return undefined;
  const n = Number(s);
  return n >= 0.5 && n <= 2 ? s : undefined;
}
// Line height is a unitless ratio; same invalid-at-computed-value-time risk as
// the scales, but it only affects the declarations that read it.
export function safeLineHeight(v: unknown): string | undefined {
  const s = typeof v === 'number' ? String(v) : typeof v === 'string' ? v.trim() : undefined;
  if (s === undefined || !/^[1-9](?:\.\d{1,2})?$/.test(s)) return undefined;
  const n = Number(s);
  return n >= 1 && n <= 2.5 ? s : undefined;
}
export function safeTokenKey(v: string): boolean {
  return /^--[A-Za-z0-9-]+$/.test(v);
}

const CSS_URL_FN_REGEX = /url\(([^)]*)\)/gi;

function stripUrlQuotes(inner: string): string {
  const trimmed = inner.trim();
  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];
  if (trimmed.length >= 2 && (first === '"' || first === "'") && first === last) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

// Blocks CSS-declaration break-out (`{`, `}`, `;`, newlines) AND HTML
// break-out (`<`, `>`): this value is interpolated not just into persisted
// stylesheets but into a live `<style>` JSX text child (brand-token-styles.tsx).
// React's own DOM renderer treats that as a text node, so `</style>` is inert
// on the client — but the same string is one `renderToString()` away (a host
// SSR path, a prerender, any future dangerouslySetInnerHTML mirror) from
// literally closing the tag and turning whatever follows into real markup.
//
// The code editor (code-editor.tsx) lets a Studio user type a raw
// `property: value;` line for ANY per-component override, so a value here
// can just as easily be `background: url(...)` as a plain color — reuse
// `safeUrl`'s http(s)/relative-only whitelist on every `url(...)` found,
// the same gate already applied to `logoUrl`/`iconUrl`, so a text override
// can't turn into a `javascript:`/`data:` load or a third-party tracking
// beacon fired from every session that renders the stylesheet.
export function safeTokenValue(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  if (/[{};\n\r<>]/.test(v)) return undefined;
  for (const match of v.matchAll(CSS_URL_FN_REGEX)) {
    if (safeUrl(stripUrlQuotes(match[1])) === undefined) return undefined;
  }
  return v;
}
