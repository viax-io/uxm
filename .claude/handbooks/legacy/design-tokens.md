# Design Tokens — Viax UI Component Library

All CSS values in component styles MUST use tokens from `@viax/ui-components-default-theme`.
Never hardcode colors, spacing, radii, shadows, or font values.

---

## Two-Layer Token Architecture

```
Primitive tokens  →  raw values (colors.scss, paddings.scss, radius.scss, text.scss, icons.scss)
Semantic tokens   →  purpose-driven aliases (background.scss, border.scss, text colors, icons.scss)
```

**Rule**: Component styles MUST use semantic tokens where they exist.
Use primitive tokens only when no semantic equivalent applies (e.g. spacing, radius, font-size).

This is critical for dark mode: semantic tokens automatically switch value when
`html[data-theme="dark"]` is set — primitive tokens do not.

Dark mode overrides live in each individual CSS variable file (e.g. `shadows.scss` defines
both light and dark shadows) and in `dark-mode.scss` (skeleton loader, focus ring opacities,
pill hover halo).

---

## Semantic Tokens (use these first)

### Background — `background.scss`

| Token | Light | Dark | When to use |
|-------|-------|------|-------------|
| `--background-default` | `#FFFFFF` | `#0E0E0E` | main page / component background |
| `--background-surface` | `#F6F6F6` | `#3F3F3F` | cards, panels, dropdowns |
| `--background-elevated` | `#FFFFFF` | `#ADADAD` | popovers, modals, tooltips |
| `--background-hover` | `rgba(0,0,0,0.04)` | `#757575` | hover state overlay |
| `--background-active` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.12)` | pressed/active state |
| `--background-disabled` | `#E8E8E8` | `#ADADAD` | disabled element background |
| `--background-primary` | `#4FD0A5` | unchanged | primary CTA background |
| `--background-secondary` | `#031B13` | unchanged | secondary action background |
| `--background-inverted` | `#0E0E0E` | `#FFFFFF` | inverted surface |
| `--background-overflow` | `rgba(14,14,14,0.3)` | `rgba(14,14,14,0.6)` | modal/drawer backdrop overlay |

> ⚠️ **Deprecated background tokens** (do not use in new code):
> - `--background-1` → use `--background-overflow`
> - `--background` (SVG pattern) — legacy decorative only
> - `--background-light-1` → use `--background-surface`

```scss
// ✅ correct — adapts to dark mode automatically
background-color: var(--background-surface);

// ❌ wrong — breaks dark mode
background-color: #F6F6F6;
background-color: var(--neutral-1);   // primitive, no dark mode switch
```

#### On-surface foreground tokens

Use these when rendering text or icons **directly on a brand-colored background** to guarantee
contrast regardless of the active brand palette:

| Token | Value | When to use |
|-------|-------|-------------|
| `--color-on-primary` | `var(--dark-default)` | foreground on `--background-primary` |
| `--color-on-secondary` | `var(--light-default)` | foreground on `--background-secondary` |

```scss
// ✅ correct — stays readable even if brand color changes
.badge {
  background-color: var(--background-primary);
  color: var(--color-on-primary);
}
```

### Border — `border.scss`

| Token | Light | Dark | When to use |
|-------|-------|------|-------------|
| `--border-default` | `#D4D4D4` | `#757575` | standard input/card borders |
| `--border-light` | `#E8E8E8` | `#ADADAD` | subtle dividers |
| `--border-strong` | `#757575` | `#D4D4D4` | strong separators |
| `--border-primary` | `#4FD0A5` | unchanged | primary colored border |
| `--border-accent` | `#38B08A` | `#4FD0A5` | hover/focus/active state border |
| `--border-inverted` | `#0E0E0E` | `#FFFFFF` | inverted border (on dark surfaces in light, on light in dark) |

```scss
border: 1px solid var(--border-default);

&:hover { border-color: var(--border-accent); }
&:focus { border-color: var(--border-accent); }
```

### Text — `text.scss`

| Token | Light | Dark | When to use |
|-------|-------|------|-------------|
| `--text-regular` | `#0E0E0E` | `#D4D4D4` | all standard body text |
| `--text-neutral` | `#757575` | `#757575` | secondary/helper text |
| `--text-disable` | `#ADADAD` | `#757575` | disabled text |
| `--text-inverted` | `#FFFFFF` | `#0E0E0E` | text on colored backgrounds |
| `--text-primary` | `#4FD0A5` | unchanged | primary brand text |
| `--text-secondary` | `#031B13` | unchanged | secondary brand text |
| `--text-dark` | `#0E0E0E` | `#0E0E0E` | **permanently dark** text (no switch) |
| `--text-light` | `#FFFFFF` | `#FFFFFF` | **permanently light** text (no switch) |

> ⚠️ `--text-dark` and `--text-light` are **not deprecated** — they are intentionally fixed
> (non-switching) variants for cases where text must stay the same color in both themes
> (e.g. text printed on a fixed-color image or background).
> Use `--text-regular` / `--text-inverted` for the common adaptive case.

```scss
color: var(--text-regular);           // body text
color: var(--text-neutral);           // placeholder, hint
color: var(--text-disable);           // disabled state
color: var(--text-inverted);          // text on --background-primary
```

### Icons — `icons.scss`

#### Icon colors

| Token | Light | Dark | When to use |
|-------|-------|------|-------------|
| `--icon-color` | `#ADADAD` | `#ADADAD` | default icon color (= `--icon-color-neutral`) |
| `--icon-color-hover` | `#ADADAD` | `#FFFFFF` | icon on hover |
| `--icon-color-neutral` | `#ADADAD` | `#ADADAD` | neutral/secondary icon |
| `--icon-color-primary` | `#4FD0A5` | unchanged | primary brand icon |
| `--icon-color-secondary` | `#031B13` | unchanged | secondary brand icon |
| `--icon-color-regular` | `#FFFFFF` | `#0E0E0E` | icon on colored bg |
| `--icon-color-inverted` | `#0E0E0E` | `#FFFFFF` | inverted icon |
| `--icon-color-light` | `#FFFFFF` | `#FFFFFF` | **permanently light** icon |
| `--icon-color-dark` | `#0E0E0E` | `#0E0E0E` | **permanently dark** icon |

#### Icon sizes

| Token | Value | Alias |
|-------|-------|-------|
| `--icon-size-xs` | `12px` | = `--icon-size-small` |
| `--icon-size-sm` | `14px` | |
| `--icon-size-md` | `16px` | = `--icon-size` (default) |
| `--icon-size-lg` | `18px` | |
| `--icon-size-xl` | `20px` | |
| `--icon-size-xxl` | `22px` | |
| `--icon-size-xxxl` | `24px` | |
| `--icon-size-huge` | `32px` | |

```scss
// ✅ use semantic icon tokens for color
color: var(--icon-color);

// use named size tokens
width: var(--icon-size);       // 16px default
width: var(--icon-size-lg);    // 18px

// ❌ don't use raw size values
width: 16px;
```

---

## Primitive Tokens (use when no semantic equivalent)

### Neutral Color Palette — `colors.scss`

These are the raw neutral values referenced by semantic tokens. Use directly only when
there is no matching semantic token (e.g. decorative dividers, skeleton backgrounds).

| Token | Value |
|-------|-------|
| `--light-default` | `#FFFFFF` |
| `--neutral-1` | `#F6F6F6` |
| `--neutral-2` | `#E8E8E8` |
| `--neutral-3` | `#D4D4D4` |
| `--neutral-4` | `#ADADAD` |
| `--neutral-5` | `#757575` |
| `--neutral-6` | `#3F3F3F` |
| `--dark-default` | `#0E0E0E` |

**Tertiary neutrals** (non-switching, for tokenless utility accents):

| Token | Value |
|-------|-------|
| `--tertiary-light` | `#8a8b96` |
| `--tertiary-dark`  | `#585660` |

**RGB channel helpers** (for building `rgba()` values — e.g. overlays, scrims):

| Token | Value |
|-------|-------|
| `--primary-default-rgb` | `79, 208, 165` |
| `--light-default-rgb` | `255, 255, 255` |
| `--dark-default-rgb` | `14, 14, 14` |

```scss
// example — custom scrim over content
background-color: rgba(var(--dark-default-rgb), 0.45);
```

### Brand Color Scale — `colors.scss`

Derived dynamically via `color-mix()` from `--primary-default` and `--secondary-default`.

```
--primary-light-1   ~8% primary + white   (very light tint, e.g. hover bg)
--primary-light-2   ~35% primary + white  (input focus shadow)
--primary-light-3   ~71% primary + white  (light badge)

--primary-dark-1    ~84% primary + black  (hover/focus border: #38B08A)
--primary-dark-2    ~67% primary + black
--primary-dark-3    ~49% primary + black  (dark chip, dark mode accents)

--secondary-light-1 / light-2 / light-3
--secondary-dark-1  / dark-2  / dark-3
```

> These tints update automatically when `--primary-default` is overridden at the theme level.
> Use them for hover, active, or decorative states tied to the brand color.

### Spacing — `paddings.scss`

```
--padding-xs:   2px     --padding--xs:   -2px
--padding-s:    4px     --padding--s:    -4px
--padding-m:    8px     --padding--m:    -8px
--padding-ms:  12px     --padding--ms:  -12px
--padding-l:   16px     --padding--l:   -16px
--padding-ls:  20px     --padding--ls:  -20px
--padding-xl:  24px     --padding--xl:  -24px
--padding-xls: 28px     --padding--xls: -28px
--padding-xxl: 32px     --padding--xxl: -32px
--padding-xxxl:36px
--gutter:      16px
```

### Border Radius — `radius.scss`

```
--radius:    4px   (alias for --radius-s)
--radius-xs: 2px
--radius-s:  4px
--radius-m:  8px
--radius-ms: 12px
--radius-l:  16px
```

### Typography — `text.scss`

**Font family:**
```
--font-family: 'Roboto', sans-serif
```

**Font sizes:**
```
--font-size-xs:   12px   (= --font-size-sm)
--font-size-sm:   12px
--font-size-md:   13px
--font-size-lg:   14px
--font-size-xl:   16px   (= --font-size-xxl)
--font-size-xxxl: 20px
--font-size-huge: 24px
```

**Font weights:**
```
--font-weight-regular:   400
--font-weight-medium:    500
--font-weight-semi-bold: 600
--font-weight-bold:      700
```

### Shadows — `shadows.scss` + `dark-mode.scss` + `colors.scss`

Shadow tokens are defined in `shadows.scss` (both `:root` for light and
`html[data-theme="dark"]` for dark) — using `--shadow-*` works correctly in both modes
without writing any per-component dark override.

#### Elevation scale

| Token | Use case |
|-------|----------|
| `--shadow-1` | subtle — hover of flat elements, pressed buttons |
| `--shadow-2` | mild — cards, list items |
| `--shadow-3` | medium — dropdowns, popovers |
| `--shadow-4` | strong — modals, dialogs |
| `--shadow-5` | heavy — drawers, side panels |
| `--shadow-6` | maximum — full-screen overlays, alerts |

#### Light theme strategy

All light shadows are tinted with `rgba(var(--dark-default-rgb), opacity)` so the
shadow color stays consistent with the neutral palette and automatically adapts if the
neutral `--dark-default` is ever re-tuned.

```scss
// shadows.scss :root
--shadow-1: 0 1px 2px 0  rgba(var(--dark-default-rgb), 0.06),
            0 0 1px 0    rgba(var(--dark-default-rgb), 0.08);
--shadow-2: 0 2px 4px 0  rgba(var(--dark-default-rgb), 0.08),
            0 0 1px 0    rgba(var(--dark-default-rgb), 0.08);
--shadow-3: 0 4px 8px 0  rgba(var(--dark-default-rgb), 0.10),
            0 0 2px 0    rgba(var(--dark-default-rgb), 0.08);
--shadow-4: 0 8px 16px 0 rgba(var(--dark-default-rgb), 0.12),
            0 2px 4px 0  rgba(var(--dark-default-rgb), 0.08);
--shadow-5: 0 16px 24px 0 rgba(var(--dark-default-rgb), 0.14),
            0 2px 8px 0   rgba(var(--dark-default-rgb), 0.08);
--shadow-6: 0 20px 32px 0 rgba(var(--dark-default-rgb), 0.18),
            0 2px 8px 0   rgba(var(--dark-default-rgb), 0.10);
```

#### Dark theme strategy

Black drop-shadows are nearly invisible on near-black surfaces (the page background is
`#0E0E0E`), so dark mode uses the **opposite metaphor**: a muted white light bleeds out
from underneath the element — as if the element is sitting on a softly back-lit surface.

Three-layer stack (top → bottom in `box-shadow`):

1. **Close soft halo** — tight bloom right under the element (small Y offset, modest
   blur, white at `0.04–0.08` opacity) → primary depth cue.
2. **Ambient halo** — wider and fainter glow that grows with elevation; only present
   from `--shadow-2` upward.
3. **Faint 1px outline** (`0 0 0 1px rgba(255,255,255, 0.06–0.14)`) — defines the
   crisp edge against the soft glow so the elevated surface stays readable.

White-glow opacity scales with elevation so higher-elevation tokens feel progressively
more lifted ("brighter light source").

```scss
// shadows.scss html[data-theme="dark"]
--shadow-1: 0 2px 6px 0   rgba(255, 255, 255, 0.05),
            0 0 0 1px     rgba(255, 255, 255, 0.06);
--shadow-2: 0 4px 12px 0  rgba(255, 255, 255, 0.06),
            0 1px 3px 0   rgba(255, 255, 255, 0.04),
            0 0 0 1px     rgba(255, 255, 255, 0.07);
--shadow-3: 0 8px 24px 0  rgba(255, 255, 255, 0.08),
            0 2px 6px 0   rgba(255, 255, 255, 0.05),
            0 0 0 1px     rgba(255, 255, 255, 0.08);
--shadow-4: 0 12px 36px 0 rgba(255, 255, 255, 0.10),
            0 4px 12px 0  rgba(255, 255, 255, 0.06),
            0 0 0 1px     rgba(255, 255, 255, 0.10);
--shadow-5: 0 20px 56px 0 rgba(255, 255, 255, 0.12),
            0 6px 18px 0  rgba(255, 255, 255, 0.07),
            0 0 0 1px     rgba(255, 255, 255, 0.12);
--shadow-6: 0 28px 80px 0 rgba(255, 255, 255, 0.14),
            0 8px 24px 0  rgba(255, 255, 255, 0.08),
            0 0 0 1px     rgba(255, 255, 255, 0.14);
```

> ℹ️ The `0 0 0 1px` layer is a *spread shadow* (no blur, no offset) — visually a
> 1-pixel outline that doesn't affect layout (unlike `border`), and disappears when
> the element is not elevated.

> ℹ️ All dark-mode shadow layers are white. There are **no black layers** in dark mode
> because they would be invisible on `--background-default` (`#0E0E0E`). If you ever
> need a dark drop on a lighter surface, build it in the component locally — don't add
> it to the global token.

#### Special shadows

| Token | Light | Dark | Use case |
|-------|-------|------|----------|
| `--shadow-input` | `0 0 0 3px var(--primary-light-2)` | `0 0 0 3px rgba(var(--primary-default-rgb), 0.35)` | input focus ring (teal glow) |

```scss
// shadows.scss :root
--shadow-input: 0 0 0 3px var(--primary-light-2);

// dark-mode.scss html[data-theme="dark"]
--shadow-input: 0 0 0 3px rgba(var(--primary-default-rgb), 0.35);
```

> ℹ️ For pill / chip hover (and any other "lift on hover" interaction) use `--shadow-4`
> from the standard elevation scale instead of a dedicated token.

#### Usage rules

```scss
// ✅ correct — adapts to dark mode automatically
box-shadow: var(--shadow-3);

// ❌ never hardcode shadow colors — breaks dark mode
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

// ❌ never write a per-component dark override for elevation —
//    use the right token and let shadows.scss do the work
.x-card { box-shadow: var(--shadow-2); }            // ✅
.x-card { html[data-theme="dark"] & { … } }         // ❌
```

### Feedback Colors — `colors.scss`

```
--feedback-success-default     --feedback-success-light   / light-1 / dark-1 / dark-2
--feedback-danger-default      --feedback-danger-light    / light-1 / dark-1 / dark-2
--feedback-warning-default     --feedback-warning-light   / light-1 / dark-1 / dark-2
--feedback-neutral-default     --feedback-neutral-light   / light-1 / dark-1 / dark-2
--feedback-highlight-default   --feedback-highlight-light / light-1 / dark-1 / dark-2
```

Default values switch in dark mode (`colors.scss` `html[data-theme="dark"]` block):
| | Light | Dark |
|-|-------|------|
| success   | `#458246` | `#5fa862` |
| danger    | `#c23e55` | `#e85973` |
| warning   | `#f26b3d` | `#f5895e` |
| neutral   | `#4c8fd9` | `#6aa3e0` |
| highlight | `#7c5cff` | unchanged |

> ℹ️ `--feedback-highlight-default` is used for "informational accent" UI such as
> highlighted callouts, new-item badges, or AI-related affordances. The `*-light`,
> `*-light-1`, `*-dark-1`, `*-dark-2` tints are derived via `color-mix()` from the
> default value (same pattern as all other feedback colors).

> ⚠️ **Deprecated** — do not use:
> - `--feedback-success` → use `--feedback-success-default`
> - `--feedback-danger` → use `--feedback-danger-default`
> - `--feedback-warning` (alias of `--feedback-warning-default`) → prefer `--feedback-warning-default`

### Skeleton Loader — `colors.scss` + `dark-mode.scss`

Used by `x-skeleton-loader` and any shimmer placeholder. Values automatically adapt in dark mode.

| Token | Light | Dark |
|-------|-------|------|
| `--color-skeleton` | `var(--neutral-2)` (`#E8E8E8`) | `var(--neutral-4)` (`#ADADAD`) |
| `--gradient-color-skeleton` | `rgba(255, 255, 255, 0.7)` | `rgba(255, 255, 255, 0.1)` |

### Layout Variables — `variables.scss`

Used by layout components and shell. Do not override in UI components.

```
--main-column-width:                      1200px
--header-height:                            72px
--nav-pane-width:                          350px
--nav-pane-width-collapsed:                 80px
--nav-pane-width-collapsed-without-background: 60px
```

---

## Dark Mode Rules

1. **Always prefer semantic tokens** — they switch automatically, no extra code needed:
   ```scss
   // ✅ works in both modes — no html[data-theme="dark"] block needed
   color: var(--text-regular);
   background-color: var(--background-surface);
   border-color: var(--border-default);
   ```

2. **Only write a dark mode block when using primitives or custom values:**
   ```scss
   .x-component {
     background-color: var(--background-default);  // semantic — automatic ✅

     // primitive used for custom visual — needs explicit override
     &__badge {
       background-color: var(--primary-light-1);   // primitive

       html[data-theme="dark"] & {
         background-color: var(--primary-dark-3);  // manual dark override
       }
     }
   }
   ```

3. **Never override semantic tokens inline** — if `--background-default` doesn't fit your use case, use a different semantic token, not a hardcoded value.

4. **Test both modes** — when a component uses any color-related token, verify it visually in both light and dark mode in Storybook.

---

## Token Selection Guide

| CSS Property | Use this token category |
|-------------|------------------------|
| `color` (text) | `--text-*` semantic |
| `background-color` | `--background-*` semantic |
| `border-color` | `--border-*` semantic |
| `color` (icon) | `--icon-color-*` semantic |
| `width`/`height` (icon) | `--icon-size-*` |
| `padding` / `margin` / `gap` | `--padding-*` primitive |
| `border-radius` | `--radius-*` primitive |
| `font-size` | `--font-size-*` primitive |
| `font-weight` | `--font-weight-*` primitive |
| `box-shadow` | `--shadow-*` (auto dark via shadows.scss) |
| feedback states | `--feedback-*-default` (light/dark) |
| foreground on brand bg | `--color-on-primary` / `--color-on-secondary` |

---

## Common Mistakes

```scss
// ❌ hardcoded value
color: #333;

// ❌ wrong primitive instead of semantic
color: var(--dark-default);           // use --text-regular
background: var(--neutral-1);        // use --background-surface
border-color: var(--neutral-3);      // use --border-default

// ❌ deprecated token
background: var(--feedback-danger);  // use --feedback-danger-default

// ❌ wrong assumption: --text-dark is deprecated
color: var(--text-regular);          // ✅ adaptive (flips in dark mode)
color: var(--text-dark);             // ✅ also valid — permanently dark, does NOT flip

// ✅ correct
color: var(--text-regular);
background-color: var(--background-surface);
border-color: var(--border-default);
```