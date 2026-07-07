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
