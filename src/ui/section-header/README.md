# SectionHeader

A small uppercase section header used in dense settings, properties, and form panels — the "VARIANT" / "COLORS" / "STYLE" labels above grouped fields.

`SectionHeader` is intentionally narrower in scope than `PageHeader` (page-level, larger heading + meta) and `DetailSection` (bordered card with icon + accent rail). It renders an `<h4>` for semantic grouping (override with `level`), an optional trailing slot inline with the heading (typically an `<InlineAction>` like "Reset section" or a status indicator), and an optional subtitle below for context like "Per Mode · Active value: 600".

## Usage

```tsx
import { SectionHeader, InlineAction } from '@viax.io/uxm';

function VariantPanel() {
  return (
    <>
      <SectionHeader
        trailing={<InlineAction onClick={resetVariant}>Reset</InlineAction>}
        subtitle="Per mode · Active value: Bold"
      >
        Variant
      </SectionHeader>
      {/* fields here */}
    </>
  );
}
```

## Props

Extends `HTMLAttributes<HTMLDivElement>` — any standard div attribute (id, style, data-*, aria-*) is forwarded to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | – | **Required.** Heading text — rendered uppercase via CSS. |
| `trailing` | `ReactNode` | – | Right-aligned slot inline with the heading; typically an `<InlineAction>` or small indicator. |
| `subtitle` | `ReactNode` | – | Optional secondary line below the heading, rendered in muted text. |
| `level` | `2 \| 3 \| 4 \| 5 \| 6` | `4` | Heading level. Styling is identical at every level — the class does the visual work — so this only moves the header in the document outline. Set it to whatever follows the nearest heading above. |
| `className` | `string` | – | Merged with `uxm-section-header` via `cn`. |
| _(any native div attribute)_ | – | – | Spread onto the root `<div>`. |

## CSS variables

| Variable | Fallback token | Default | Affects |
|----------|----------------|---------|---------|
| `--uxm-section-header-gap` | – | `2px` | Vertical gap between heading row and subtitle. |
| `--uxm-section-header-margin-bottom` | – | `12px` | Spacing between the header and the following content. |
| `--uxm-section-header-title-color` | `--color-text-subtle` | – | Heading text colour. |
| `--uxm-section-header-title-size` | – | `11px` | Heading font size. |
| `--uxm-section-header-title-weight` | – | `600` | Heading font weight. |
| `--uxm-section-header-subtitle-color` | `--color-text-muted` | – | Subtitle text colour. |
| `--uxm-section-header-subtitle-size` | – | `10px` | Subtitle font size. |

## Design tokens (MODO-configurable)

| Token | Group / name | Used for |
|-------|--------------|----------|
| `--color-text-subtle` | Text / Text Subtle | Heading text (fallback). |
| `--color-text-muted` | Text / Text Muted | Subtitle text (fallback). |

The token group / name pairs map 1-to-1 to entries in `themeTokens` (`src/tokens/index.ts`) — that array is the canonical source for MODO's editor UI.

## States & variants

| State / variant | Trigger | Visual |
|-----------------|---------|--------|
| Heading only | `children` only | Single uppercase `<h4>` with letter-spacing `0.06em`. |
| With trailing | `trailing` provided | Heading and trailing slot share a flex row, `space-between`, `8px` gap. |
| With subtitle | `subtitle` provided | Muted secondary line wraps below; flex-wraps when long. |
| Full | trailing + subtitle | Both render together; trailing is inline with heading, subtitle below both. |

## Accessibility

- Heading renders as `<h4>` **by default** — picks up native heading semantics and contributes to the document outline. Verify it lands at the right depth in your page's heading hierarchy, and pass `level` when it doesn't: an `<h4>` directly under an `<h2>` skips a level, leaving screen-reader users navigating by heading unable to tell how the sections nest.
- The uppercase rendering is CSS-only (`text-transform: uppercase`) — assistive tech reads the original casing from the DOM, so authors should write the heading in the casing they want announced.
- **The title does not meet AA, and the fix is a one-liner.** The default
  `--color-text-subtle` measures **3.66:1** on `--color-card` in light and **3.41:1** in dark,
  against the 4.5:1 floor. At 11px the large-text exemption does not apply. This matters more
  here than for most small labels: the element is a real `<h4>`, so it is in the heading
  outline and is what a screen-reader user navigating by heading lands on — it should not be
  the faintest text on the surface. The default is unchanged because darkening it shifts every
  settings panel, but the knob is there:

  ```css
  :where(:root) {
    --uxm-section-header-title-color: var(--color-text-muted); /* 5.37:1 light, 6.89:1 dark */
  }
  ```

  **The hierarchy is also inverted today, which is the stronger reason to set this.** The
  subtitle defaults to `--color-text-muted` (5.37:1) while the title sits on
  `--color-text-subtle` (3.66:1) — so the title is *fainter than its own subtitle*, in both
  themes. **Prefer `--color-text-strong` (8.86:1)**: muted would clear AA but make title and
  subtitle identical, flattening the distinction the component exists to express. `strong`
  clears AA and puts the title back above the line it heads.
- The trailing slot is inert by default — any interactive content placed there (e.g. `<InlineAction>`) carries its own semantics.
- The subtitle is a plain `<div>` with no implicit ARIA — for status-style subtitles that update dynamically, the consumer should add `aria-live="polite"` themselves.
- No bundled focus / hover state — the header is presentational only.
