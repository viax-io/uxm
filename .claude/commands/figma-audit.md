# /figma-audit Command

Compare the current Figma selection against the component rendered in Storybook and produce
a discrepancy report with theme-token-mapped fixes.

## Prerequisites

- Storybook must be running: `npm run storybook`
- The target component story must be open in the browser
- Figma file must be open with the relevant component selected

## Steps

1. **Pull Figma spec** — use `mcp__figma-dev-mode-mcp-server__get_design_context` to get
   the design specification for the current Figma selection.

2. **Capture browser state** — use `mcp__chrome-devtools__take_screenshot` to capture
   the Storybook rendering of the matching component.

3. **Inspect rendered DOM** — use `mcp__chrome-devtools__take_snapshot` to inspect
   the DOM structure and read computed styles via `mcp__chrome-devtools__evaluate_script`.

4. **Map Figma values to theme tokens** — for each Figma value, identify the correct
   semantic token from `@viax/ui-components-default-theme`:

   | Figma property | Token category to check |
   |----------------|------------------------|
   | fill / color | `--text-*`, `--icon-color-*`, `--background-*` |
   | stroke / border | `--border-*` |
   | corner radius | `--radius-*` |
   | spacing / padding | `--padding-*` |
   | font size | `--font-size-*` |
   | font weight | `--font-weight-*` |
   | shadow | `--shadow-*` |

   Refer to `.claude/handbooks/design-tokens.md` for the full token reference.

5. **Build comparison table** with columns:
   **Property | Figma Value | Browser Value | Token | Match?**

   Include: `color`, `background-color`, `border`, `border-radius`, `padding`, `margin`,
   `gap`, `font-size`, `font-weight`, `line-height`, `box-shadow`, `width`, `height`

6. **List mismatches only** as actionable fixes — each fix must specify:
   - The SCSS file to change: `themes/viax/ui-components-default-theme/src/[component].scss`
   - The BEM selector: `.x-block__element` or `.x-block_modifier_value`
   - The CSS property and correct token: `color: var(--text-regular)`
   - Whether a dark mode override is needed (only if using a primitive token)

7. **STOP and wait for user approval before making any changes.**

## Output Format

```
## Figma Audit: [ComponentName]

### Comparison Table

| Property | Figma | Browser | Token | Match? |
|----------|-------|---------|-------|--------|
| color | #0E0E0E | #333333 | --text-regular | ❌ |
| border-radius | 8px | 4px | --radius-m | ❌ |
| font-size | 14px | 13px | --font-size-lg | ❌ |
| padding | 8px 12px | 8px 12px | --padding-m / --padding-ms | ✅ |

### Mismatches (actionable fixes)

**1. `color` mismatch**
File: `themes/viax/ui-components-default-theme/src/x-input.scss`
Selector: `.x-input__field`
Fix: `color: var(--text-regular);`

**2. `border-radius` mismatch**
...

### Conflicts / Questions
[Any Figma values that seem outdated, inconsistent, or conflict with the design system]
```

## Important Rules

- If a Figma value matches a primitive color (e.g. `#4FD0A5`) but a semantic token
  exists (`--background-primary`), flag it — always prefer the semantic token.
- If Figma values conflict with what seems correct in context, flag and ask the user —
  Figma designs may be outdated or ahead of the token system.
- Scope fixes to the targeted component SCSS file only. Do not modify `.vue` templates,
  parent wrappers, or unrelated components.
- Fixes go in the **theme submodule** (`themes/viax/ui-components-default-theme/src/`),
  not inside the `.vue` file.
- If a fix requires a dark mode override, note it explicitly and check
  `.claude/handbooks/design-tokens.md` — semantic tokens may already handle it.

ARGUMENTS: $ARGUMENTS