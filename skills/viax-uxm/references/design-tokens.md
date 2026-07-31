# @viax/uxm — Design Tokens

The canonical token catalogue. Source of truth: `src/tokens/index.ts` in the uxm repo
(`https://gitlab.viax.tech/services-viax/uxm`), exported as the `themeTokens` array from
`@viax/uxm/tokens`. These tokens declare `--color-*` CSS custom properties on `:root` (via
`@viax/uxm/tokens.css`) and are the **MODO-configurable layer** — brand-settings UIs edit them
centrally, and every component re-tints instantly.

## Theming flow

```
                                    edits
MODO brand-settings UI ──────────────────────────────────▶ themeTokens / :root --color-*
                                                                     │
                                                              fallback inside
                                                                     ▼
component SCSS: var(--uxm-{component}-bg, var(--color-card))
                                                                     │
                                                              inline override
                                                                     ▼
consumer: <Card style={{ '--uxm-card-bg': '#fff' }} />
```

## Mapping intent → token

Always prefer a token over a literal hex. Use the table below to pick by intent.

### Surfaces (3 tokens)

Backgrounds, in increasing prominence: page → alt panel → card.

| Token | cssVar | Light | Dark | Use for |
|-------|--------|-------|------|---------|
| `Surface` | `--color-surface` | `#F8F7F6` | `#141414` | Page / app background. |
| `Surface Alt` | `--color-surface-alt` | `#F2F1F0` | `#1C1C1C` | Sectioned panels, table headers, hover backgrounds. |
| `Card` | `--color-card` | `#FFFFFF` | `#0B0B0B` | Card / row / dropdown backgrounds (most prominent). |

### Text (5 tokens)

Foreground colours, in decreasing prominence (Strong → Subtle), plus an inverse for use on dark
bgs.

| Token | cssVar | Light | Dark | Use for |
|-------|--------|-------|------|---------|
| `Text Strong` | `--color-text-strong` | `#4A4A4A` | `#C8C8C8` | Headings; emphasized labels. |
| `Text` | `--color-text` | `#1E1E1E` | `#F5F5F5` | Body text (default). |
| `Text Muted` | `--color-text-muted` | `#9CA3AF` | `#8A8A8A` | Secondary text, labels, table header text. |
| `Text Subtle` | `--color-text-subtle` | `#CBD5E1` | `#5A5A5A` | Tertiary, disabled, placeholder. |
| `Text Inverse` | `--color-text-inverse` | `#FFFFFF` | `#0B0B0B` | Text on accent backgrounds (e.g. Primary button). |

### Borders (1 token)

| Token | cssVar | Light | Dark | Use for |
|-------|--------|-------|------|---------|
| `Border` | `--color-border` | `#EBEBEA` | `#2A2A2A` | All component borders / dividers (default). |

### Accent (4 tokens)

Brand colour ramp. `--color-accent` is the **lead brand colour**; the other three shades are
designed to derive from its hue (each keeps its own saturation + lightness step). In the
`themeTokens` array `Accent` now comes **first** in the group, ahead of the derived shades.

| Token | cssVar | Light | Dark | Use for |
|-------|--------|-------|------|---------|
| `Accent` | `--color-accent` | `#3ECC87` | `#4FD99A` | Lead brand colour; indicators, active borders. |
| `Accent Subtle` | `--color-accent-subtle` | `#E6FFD1` | `#0F3A1F` | Selected-state background, soft accent backdrops. |
| `Accent Light` | `--color-accent-light` | `#90E9B8` | `#2E8B57` | Hover backdrop, illustrative. |
| `Accent Bold` | `--color-accent-bold` | `#1E7150` | `#8AE6B4` | Primary button bg; link text; primary CTA. |

> **Studio behaviour:** in the embedded style editor's Brand Settings → Colors → Accent, editing
> any accent shade opens a "Recalculate accent palette?" modal. Confirming re-tints the rest of the
> group — across **both** light and dark themes — to the edited colour's hue, rebuilding each derived
> shade from its designed default (saturation + lightness step) re-tinted to the new hue. The shade
> you just edited is left untouched; everything else is recomputed into a clean light→dark ramp,
> regardless of any prior overrides. The maths is the exported `retintHue` helper (below).

### Highlights (4 tokens)

Warm / cool secondary accents (e.g. for category groupings) with paired "on-" foreground colours
(for safe contrast on the highlight bg).

| Token | cssVar | Light | Dark | Use for |
|-------|--------|-------|------|---------|
| `Highlight Warm` | `--color-highlight-warm` | `#FCD0A1` | `#8A5A2B` | Warm category backdrop. |
| `On Highlight Warm` | `--color-on-highlight-warm` | `#7C6B3E` | `#FCD0A1` | Foreground on `Highlight Warm`. |
| `Highlight Cool` | `--color-highlight-cool` | `#C3BEF7` | `#4D4A7F` | Cool category backdrop. |
| `On Highlight Cool` | `--color-on-highlight-cool` | `#5B54A0` | `#C3BEF7` | Foreground on `Highlight Cool`. |

### Categories (2 tokens)

Fixed-purpose category colours (not part of the accent ramp).

| Token | cssVar | Light | Dark | Use for |
|-------|--------|-------|------|---------|
| `Composite` | `--color-category-composite` | `#F472B6` | `#F9A8D4` | Composite-type indicator. |
| `Diagram` | `--color-category-diagram` | `#6366F1` | `#818CF8` | Diagram-type indicator. |

### Semantic (12 tokens)

Status colour triplets: bg / text / border. Used by `Banner`, `Toast`, `Tag`, error/help feedback.

| Token | cssVar | Light | Dark | Use for |
|-------|--------|-------|------|---------|
| `Success Bg` | `--color-success-bg` | `#F0FDF4` | `#0F2A18` | `Banner variant="success"` background. |
| `Success Text` | `--color-success-text` | `#166534` | `#86EFAC` | Success body text / icon. |
| `Success Border` | `--color-success-border` | `#BBF7D0` | `#1E4A2C` | Success border / divider. |
| `Warning Bg` | `--color-warning-bg` | `#FFFBEB` | `#2B1F0F` | `Banner variant="warning"` background. |
| `Warning Text` | `--color-warning-text` | `#92400E` | `#FCD34D` | Warning body text / icon. |
| `Warning Border` | `--color-warning-border` | `#FDE68A` | `#4A3A1F` | Warning border. |
| `Danger Bg` | `--color-danger-bg` | `#FEF2F2` | `#2B1214` | `Banner variant="error"` background. |
| `Danger Text` | `--color-danger-text` | `#991B1B` | `#FCA5A5` | Error body text / icon. |
| `Danger Border` | `--color-danger-border` | `#FECACA` | `#4A1F22` | Error border. |
| `Info Bg` | `--color-info-bg` | `#EFF6FF` | `#0F1F3A` | `Banner variant="info"` background. |
| `Info Text` | `--color-info-text` | `#1E40AF` | `#93C5FD` | Info body text / icon. |
| `Info Border` | `--color-info-border` | `#BFDBFE` | `#1E3A6A` | Info border. |

### Typography (font vars — not in `themeTokens`)

Font custom properties. These are NOT colour tokens (they don't appear in the `themeTokens`
array or the studio's Color editor) but they are part of the same theming contract:

| Var | Declared by | Value / behaviour |
|-----|-------------|-------------------|
| `--font-inter` | `@viax/uxm/tokens.css` (`:root`) | `'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`. No font file is bundled — the host loads Inter (e.g. a Google Fonts `<link>`); the stack degrades to system fonts when absent. |
| `--font-sans` | ⚠️ **`@viax/uxm/tokens.css` — but ONLY inside its `@theme inline { … }` block, a Tailwind v4 at-rule.** Browsers do not understand `@theme` and drop the whole block, so in a plain (non-Tailwind) host **`--font-sans` is never actually defined.** | Intended as `var(--font-inter)`, the library's base UI stack. **A non-Tailwind host must alias it itself** (see Consumer rules) before using `var(--font-sans)` anywhere. |
| `--brand-font` | **Emitted at runtime, only when a brand font is chosen.** `generateOverridesCss` (from `@viax/uxm/studio/generate-css`) turns `brand.fontFamily` — set in the studio's **Brand Settings → Typography** — into a Google-Fonts `@import`, `:root { --brand-font: "X", var(--font-inter), system-ui, sans-serif; }` and `body { font-family: var(--brand-font) !important; }`. Inside the studio itself, `BrandFontStyles` applies the same output live while editing (pre-Publish). |

**Consumer rules:**

- **A non-Tailwind host MUST alias `--font-sans` itself, or the whole app renders in Times New
  Roman.** `--font-sans` only exists inside tokens.css's Tailwind-only `@theme inline` block, so a
  browser never sees it. With `--brand-font` also unset (the default — no brand font published),
  `font-family: var(--brand-font, var(--font-sans))` resolves to the *guaranteed-invalid value*;
  the declaration is then **invalid at computed-value time**, so `<body>` falls back to
  *inherit* — i.e. the browser's default serif. Because every uxm atom uses
  `font-family: inherit`, that serif propagates through every component. Alias it once in the
  host's global CSS (loaded after `tokens.css`), using the real `:root` token `--font-inter`:

  ```css
  :root {
    /* tokens.css declares --font-sans only inside `@theme inline`, which browsers drop. */
    --font-sans: var(--font-inter, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
  }
  ```

  There is no `--font-mono` token at all — always give a literal fallback: `var(--font-mono, monospace)`.
- Base typeface in app CSS: `html, body, #root { font-family: var(--brand-font, var(--font-sans)); }` —
  Inter by default, the published brand font when one is set (applying the same chain to
  `html`/`#root` is safe and closes the serif-via-`html` path). Don't hardcode a *different*
  `font-family` on `body`/`html`; it would fight the injected `!important` rule. This line is
  only safe **once the alias above is in place**.
- **Native form controls don't inherit the document font** — the UA stylesheet gives
  `<button>`/`<input>`/`<select>`/`<textarea>` their own family (Arial / system UI). uxm atoms set
  `font-family: inherit` themselves, but raw native controls in host code will render in Arial
  unless the host adds, once: `button, input, select, textarea { font: inherit; }` (element-level
  specificity — uxm class rules and studio overrides still win).
- Sanity check when text looks like Times New Roman: open DevTools on `<body>` and confirm
  `font-family` computes to a real stack rather than showing the declaration struck through.
  If body text is fine but buttons/inputs show Arial, the `font: inherit` rule above is missing.
- Sanitise before interpolating a font name into CSS/URLs yourself? Don't — reuse the exported
  `safeFontFamily` / `fontFileUrl` helpers from `@viax/uxm/studio/generate-css`.

## Theme variants (`data-theme`)

`@viax/uxm/tokens.css` declares the light palette on `:root` and a full dark override set under
`[data-theme="dark"]`. Setting `data-theme` on the root element switches the palette — every
component re-tints via the `var(--uxm-*, var(--color-*))` fallback chain, no component code
involved:

| `data-theme` | Palette | Overrides |
|--------------|---------|-----------|
| *(unset)* / `"light"` | Default light | — (the `:root` values). |
| `"dark"` | Dark | Full override set incl. semantic colors and deeper shadows. |

The host owns the attribute (the embedded studio defers to it); a typical toggle is a session-only
`useState` that writes `document.documentElement.dataset.theme`. The `themeTokens` array (and the
studio's Color editor / WCAG panel) documents the **light + dark** hex pairs.

> Two additional CSS-level variants — `data-theme="blue"` (steel-blue light palette around
> `#5F859C`) and `data-theme="claude"` (pastel-beige surfaces, brown text, orange accent
> `#D97757`) — exist only on the unmerged `feat/blue-claude-themes` branch. They override
> surfaces/text/border/accent/highlight only (semantic colors + shadows inherit light) and are
> **not in any published release** — do not target them from consumer code yet.

These CSS-level variants are a **different axis** from the env-published UXM Studio *brand
themes*: a consumer portal's `uxmStudio` config (fetched via `getMfaConfig`) can carry an
arbitrary, environment-defined set of named themes (`themes[]`), each bundling its own
`--color-*` token ramps for **both** light and dark. Selecting a brand theme swaps the token
values; `data-theme` still picks which mode's values paint. See quick-recipes.md §16 for the
read-only picker that consumes them.

## Programmatic access

```ts
import { themeTokens, findToken, resolveHex, isTokenValue } from '@viax/uxm/tokens';
import type { ThemeToken } from '@viax/uxm/tokens';

// All tokens, grouped
themeTokens.filter((t) => t.group === 'accent');

// Look up by cssVar
findToken('--color-accent-bold');
// → { name: 'Accent Bold', cssVar: '--color-accent-bold', hex: '#1E7150', darkHex: '#8AE6B4', group: 'accent', variable: 'var(--color-accent-bold)' }

// Test if a string is a token reference (var(--color-foo))
isTokenValue('var(--color-accent-bold)'); // true

// Resolve var(...) to hex
resolveHex('var(--color-accent-bold)'); // '#1E7150'
```

## WCAG / contrast helpers

For audit tooling, the package also exports contrast helpers from `@viax/uxm`:

```ts
import { contrastRatio, wcagLevel, suggestAccessibleToken } from '@viax/uxm';

contrastRatio('#1E7150', '#FFFFFF');          // → 4.79
wcagLevel('#1E7150', '#FFFFFF');              // → 'AA'
suggestAccessibleToken('#1E7150', themeTokens); // → nearest token that passes AA
```

Use these when building MODO brand-settings UIs that need to warn designers about poor contrast
choices live.

## HEX ↔ HSL / palette maths

Also exported from `@viax/uxm` — colour-space converters plus a hue re-tint helper, for tooling
that derives a palette from a single brand colour (e.g. recomputing the accent ramp from one hue):

```ts
import { rgbToHsl, hslToRgb, hexToHsl, hslToHex, retintHue } from '@viax/uxm';
import type { HSL } from '@viax/uxm'; // { h: 0–360, s: 0–100, l: 0–100 }

hexToHsl('#3ECC87');            // → { h: 152, s: 58.7, l: 52.5 } (null if unparseable)
hslToHex({ h: 152, s: 59, l: 52 }); // → '#3ECC86'
rgbToHsl({ r: 62, g: 204, b: 135 });
hslToRgb({ h: 152, s: 59, l: 52 });

// Re-tint a colour to a new hue, KEEPING its own saturation + lightness.
// This is how the studio rebuilds each accent shade from one brand hue:
const baseHue = hexToHsl('#1E7150')!.h;
retintHue('#90E9B8', baseHue);  // Accent Light, re-tinted to the bold hue → '#…'
```

`hexToHsl` / `retintHue` accept an optional `scope?: Element` (passed to `parseColor`) so
`var(--color-*)` strings resolve against a specific element's computed styles. `retintHue` falls
back to the input string if it can't be parsed. Use these when a brand-settings UI lets a designer
pick ONE accent and you want to derive the rest of the ramp — don't hand-roll HSL conversion.

## Rules

1. **Never inline literal hex** when a token covers the intent — break-glass only for one-off
   illustrative graphics that intentionally don't theme.
2. **Always prefer per-component CSS vars** (`--uxm-{component}-*`) over directly using
   `--color-*` in component overrides; the var has a token fallback, so MODO theming still wins.
3. **Don't introduce new `--color-*` declarations** in app code. Add them to `themeTokens` via
   a PR to `@viax/uxm`. Local declarations bypass the MODO theming layer.
4. **Pair semantic tokens correctly**: always use the matching `Bg` / `Text` / `Border` triplet
   for a given status (don't mix `Success Bg` with `Danger Text`, etc.).
5. **`@viax/uxm` ships no spacing-scale token** — there is no `--spacing` (or similar) CSS custom
   property anywhere in the library or its tokens.css. Never write `gap`/`padding`/`margin` as
   `calc(var(--spacing) * N)` — it silently resolves to nothing, `calc()` goes invalid, and the
   whole declaration drops to `0`/initial (rows and elements collapse together with no visible
   error). Use literal px values for spacing in app code instead.
