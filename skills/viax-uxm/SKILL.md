---
name: viax-uxm
description: >
  Build React 19 apps and components using @viax/uxm — the Viax UI primitive library
  (92 BEM-classed React components as of v4.9.0, design tokens, per-component/per-state themable
  previews, and an embeddable studio style editor). TRIGGER
  when: user asks to create, scaffold, or modify a React app/page/component AND mentions
  @viax/uxm or the Viax design system; the working directory contains @viax/uxm in package.json
  dependencies; user mentions Viax tokens, themeTokens, MODO brand-settings, the @viax/uxm/studio editor (UxmApp), or UXM previews;
  user asks which component to use for a UX task (e.g. "button vs link", "banner vs badge",
  "toast vs banner", "how to render a tabular list") within a Viax React context; user pastes a
  Figma design that needs to be implemented with Viax UI primitives in React. Use this skill to
  pick the right primitive, look up its props/CSS-vars/design-tokens, and produce code that
  conforms to the library's conventions (subpath imports, BEM classnames, token-driven theming,
  no `"use client"` unless required by Next.js App Router).
keywords: viax, uxm, viax-uxm, react, react-19, nextjs, design-tokens, design-system, modo, brand-settings, primitives, themable, previews, studio, style-editor, UxmApp, generateOverridesCss
---

# @viax/uxm — React 19 Component Library

> Documents `@viax/uxm` **v4.9.0** (92 components). To refresh after a new library release, run
> the `viax-uxm-skill-update` skill — it reads this marker to compute the delta.
>
> ✅ **3.0.1 is the current Nexus registry latest.** 3.0.0 rolled a clear-button ✕ across the
> remaining input atoms (`CurrencyInput`, `DateInput`, `PhoneInput`, `TimeInput`) and shipped ONE
> breaking change — `Select` dropped its `clearable` prop; clearability is now inferred from a
> placeholder `<option value="" disabled>` (see "New in 3.0.0"). 2.10.0 added the `ColorInput` /
> `ColorInputPopover` picker + `eyedropper` glyph and made `Popover` tolerate nested floating
> layers. Everything from 2.9.0 (`NumberInput` clearable + `error`, family-wide `aria-describedby`)
> and earlier remains published and resolves on a fresh `npm install`.
> ⚠️ **A consumer may install behind** the published latest — check its `@viax/uxm` pin in that
> project's `package.json`. The skill documents the *released* 3.0.1 surface regardless of what any
> consumer currently installs.

This skill turns Claude into a competent consumer of `@viax/uxm`. It does not generate Vue MFA
apps — for that, use `viax-mfa-component` instead. It assumes the target framework is React 19
(Next.js App Router or Vite SPA) and that `@viax/uxm` is or will be a dependency of the project.

## v4.9.0 — current API surface (overrides training data)

The library went through a fast release train (1.1.0 → 3.0.1, June–July 2026). If your knowledge
of the library or old code conflicts with this list, THIS list wins.

### 2.0.0 baseline

- **`Alert` is REMOVED** → use `Banner` (same `variant`/`title`/`icon`/`children`; adds
  `onDismiss`/`dismissLabel`). CSS: `--uxm-alert-*` → `--uxm-banner-{variant}-*`.
- **`NumberField` is RENAMED to `NumberStepper`** (same props + new `error`).
  CSS: `--uxm-number-field-*` → `--uxm-number-stepper-*`.
- **New since 1.1.0:** `Toast`/`Toaster` + imperative `toast.*()` API, `Dialog` + `Modal`
  (compound `Modal.Header/Body/Footer`), `Popover`, `Listbox`/`MultiListbox`, `Banner`,
  `EditableCell`, `FieldError`, `NumberStepper`.
- **`Select` is now Listbox-backed** (cross-browser panel) with a compatible native-like API
  (`<option>` children, `onChange(e.target.value)`). (It gained an opt-in `clearable` here that
  3.0.0 later REMOVED — clearability is now placeholder-driven; see "New in 3.0.0".)
  `SearchDropdown` and
  `PillSelect` ride the same Listbox/MultiListbox infrastructure; `PillSelect` gained
  `chipsPosition: 'inside' | 'below'`.
- **Error convention:** every input-family atom (`TextInput`, `Textarea`, `Select`,
  `SearchDropdown`, `PillSelect`, `TimeInput`, `NumberStepper`, …) takes `error?: string` —
  red border + `aria-invalid` + an icon-led message below the field (rendered via the shared
  `FieldError`). Field errors belong on the ATOM, not on `FormField` (which owns only
  label + help) and not on a `Banner`.
- **`DataTable` supports inline editing** (per-column `editable`, `editor`, `formatValue`,
  `validate`, `isEditable`, async `onCommit`) and per-column `maxWidth` clamping, both built
  on `EditableCell`.

### New since 2.0.0 (2.1.0–2.3.0)

- **`HoverTooltip` — new atom (84th component).** Behavior layer the render-only `Tooltip`
  lacks: pairs a hover trigger (owned `openDelay`) + optional truncation gate
  (`truncatedOnly` — only reveals when the wrapped element actually overflows) with `Popover`
  for positioning/portal, rendering the existing `Tooltip` inside. Props: `content`,
  `children` (a single `ReactElement`), `placement: 'top' | 'bottom'`, `truncatedOnly`,
  `openDelay`, `disabled`, `showArrow`. Non-interactive (closes on pointer-leave). Use it to
  reveal clamped table/cell values on hover.
- **`EditableCell` gained 3 editor types.** `type` is now
  `'text' | 'number' | 'date' | 'select' | 'multiselect'`; value type widened to
  `EditableCellValue = string | number | string[]`. New props: `dateFormat`
  (`'mdy' | 'dmy' | 'ymd'`, default `'ymd'` — date editor is a masked input + Calendar hybrid,
  commits an ISO string), `options: EditableCellOption[]` (for select/multiselect, rendered via
  Listbox/MultiListbox with optimistic toggles), `searchable?: boolean | 'auto'`, `clearable`.
  Truncated display values reveal via the built-in `HoverTooltip`. New exports
  `EditableCellValue`, `EditableCellOption`.
- **`DataTable` editable columns** now accept the full editor surface: `editor` is an
  `EditableCellType` (`date`/`select`/`multiselect` too), plus `dateFormat`, `editorOptions`,
  `editorSearchable`, `editorClearable`. Capped (`maxWidth`) plain cells auto-wrap in
  `HoverTooltip`.
- **`Listbox` / `Select` auto-search.** `searchable?: boolean | 'auto'` — `'auto'` reveals the
  search box only past `SEARCHABLE_AUTO_THRESHOLD` (6 items, exported). `Listbox` also gained
  `maxPanelWidth` (caps panel width; long labels truncate). `Select` defaults `searchable` to
  `'auto'`.
- **`Popover` width control + first-open fix.** `matchAnchorWidth?: boolean | 'min'` (`'min'`
  floors at the anchor width but grows to content), new `maxWidth`. Positioning now resolves
  correctly for popovers that mount already-open.
- **`Calendar`** gained a "Today" footer button (jumps the view to the current month) and a
  `shadow?: boolean` prop (default `true`; pass `false` for a flat, embedded calendar).
- **`DateInput` / `TimeInput` open-on-focus.** Focusing the field opens the picker popover —
  type-or-pick, no separate trigger click. (Behavioral; no new prop.)

### New since 2.3.0 (2.3.1–2.4.1) — embeddable style editor + per-state theming

- **Every atom is fully themeable via per-component CSS vars — now including per-STATE colours
  (2.4.0).** Each atom reads `--uxm-{id}-{prop}` and, for stateful atoms,
  `--uxm-{id}-{state}-{prop}` (`hover`/`active`/`focus`/`disabled`) with the design token as
  fallback — so the default look is unchanged, but any of these can be overridden per instance or
  globally. The var names match what the studio's `generateOverridesCss` emits
  (`--uxm-{id}-{kebab(prop)}`). This is what makes a host's saved theme repaint real component
  *states* (hover/checked/…), not just the resting look.
- **`@viax/uxm/studio` ships the live style editor as a mountable component (`UxmApp`)** — the MODO
  design workbench, embeddable in any host portal. See "Embedding the style editor" below. (Present
  since 2.2.x; matured through 2.3.1–2.4.1 with brand-asset handling, a light/dark toggle, and a
  brand-aware colour picker.)
- **Studio colour picker is brand-aware (2.4.1).** Swatch markers paint the token's live
  `var(--color-*)` value, so they reflect the applied brand, not the library's static default.
- **Accent-ramp recalc + exported palette maths.** `--color-accent`
  is now the lead of the Accent token group (first in `themeTokens`); editing any accent shade in
  Brand Settings prompts a "Recalculate accent palette?" modal that re-tints the rest of the group
  to that hue across both light and dark, rebuilding each derived shade from its designed default.
  The colour-space maths is now **public API on `@viax/uxm`**: `rgbToHsl`, `hslToRgb`, `hexToHsl`,
  `hslToHex`, `retintHue` (+ the `HSL` type). Use `retintHue(color, hue)` to derive a palette from
  one brand hue. See `references/design-tokens.md` → "HEX ↔ HSL / palette maths".

### New in 2.6.0 — action menus, bulk bar, destructive button

- **`Menu` — new atom (85th component).** Action / dropdown menu built on the headless `Popover`
  (positioning, portal, outside-click, Escape) with proper menu semantics (`role="menu"` /
  `menuitem` / `separator`), arrow-key nav that skips separators + disabled rows, leading icons,
  trailing hints, and destructive (danger) rows. **Distinct from `Listbox`/`Select` by design: a
  menu has NO selected value and NO checkmarks** — picking a row runs its action and closes the
  menu. Reach for `Listbox`/`Select` to HOLD a chosen value; reach for `Menu` for row ⋮ actions,
  overflow menus, and command lists. The consumer owns the trigger via `renderTrigger` (spread
  `triggerProps` onto an `IconButton` ⋮, a `Button`, anything) — same contract as `Listbox`.
  Props: `items: MenuEntry[]`, `renderTrigger: (api: { open, triggerProps }) => ReactNode`,
  `placement?: PopoverPlacement` (default `'bottom-end'`), controlled `open?` / `onOpenChange?`,
  `minWidth?` (160) / `maxWidth?` (280), `aria-label?`, `className?`, `panelClassName?`,
  `panelStyle?`. Exports: `Menu`, `MenuProps`, `MenuItem`, `MenuSeparator`, `MenuEntry`,
  `MenuTriggerProps`. `MenuEntry = MenuItem | MenuSeparator`; `MenuItem = { key, label, icon?,
  hint?, onSelect?, disabled?, danger? }`; `MenuSeparator = { separator: true, key? }`. The
  portaled panel is studio-themed on BOTH selectors (`.uxm-menu, .uxm-menu__panel`).
- **`BulkActionBar` — new atom (86th component).** Floating toolbar that appears once rows are
  selected: "{N} selected · actions · × clear". Purely presentational — the consumer wires it to
  its own `selectedKeys` state and positions it (typically fixed/sticky near the bottom of a table
  view); pairs with `DataTable` row selection. Props: `count: number`, `actions?: BulkAction[]`,
  `onClear?: () => void` (renders the trailing ×), `countLabel?: (count) => ReactNode` (override
  the "{n} selected" label), `className?`, `style?`. Exports: `BulkActionBar`,
  `BulkActionBarProps`, `BulkAction` (`{ key, label, icon?, danger?, disabled?, onClick? }`).
- **`ButtonDanger` — new Button-family export.** Outlined destructive action button for
  irreversible operations (Delete / Remove / Discard): danger-tinted surface + danger text +
  danger border at rest, deepening to a solid danger fill when pressed. Reuses the semantic
  `--color-danger-*` token trio (no new palette tokens) and reads per-state
  `--uxm-button-danger-{state}-*` vars. Same API as the rest of the family (`ButtonPrimary` /
  `ButtonSecondary` / `ButtonTertiary` / `ButtonGhost`) — native `<button>` attributes via
  `...rest`, `type` defaults to `"button"`. Reserve for genuinely destructive actions; everything
  else uses primary/secondary/tertiary/ghost. From `./button`.
- **`DataTable` gained `rowActions`.** `rowActions?: (row: T) => MenuEntry[]` — when provided,
  `DataTable` appends a trailing column whose cell is a ⋮ `IconButton` that opens a `Menu` of the
  row's entries. The callback receives the row, so each action's `onSelect` closes over its row.
  Return an empty array to leave a row without a trigger (the column stays for alignment). Clicks
  inside the actions cell don't bubble to `onRowClick`.
- **`Listbox` panel shadow decomposed (studio).** The single `panelShadow` text knob is **REMOVED**
  → replaced by three studio knobs Color / Blur / Offset-Y (`--uxm-listbox-shadow-color`,
  `--uxm-listbox-shadow-blur`, `--uxm-listbox-shadow-offset-y`), matching the `Calendar` / `Menu`
  pattern. The `<Listbox>` component API and default look are unchanged; only the editable shadow
  surface changed. Any saved studio override for `panelShadow` must be re-applied after upgrade.

### New in 2.7.0 — determinate progress + clearable text fields

- **`ProgressBar` — new atom (87th component).** Determinate progress (0–100%) in the Feedback
  category — the companion to `Loader`'s indeterminate spinner/dots/bar. Use it when the share of
  work done is known (uploads, batch ops, stepped flows); use `Loader` for "something is happening,
  no ETA". Two variants share one value: **`linear`** (default — a track with a filling bar,
  caption + percentage above) and **`ring`** (a circular gauge drawn with a CSS `conic-gradient`,
  no SVG, percentage centered, caption below). Props: `value: number` (0–100, clamped),
  `variant?: 'linear' | 'ring'` (default `'linear'`), `label?: string` (caption; also the
  accessible name), `valueText?: string` (override the `${Math.round(value)}%` text), plus
  `...rest` (`HTMLAttributes<HTMLDivElement>` minus `color`). Renders `role="progressbar"` with
  `aria-valuenow/min/max`. Root is layout-only; all theming routes through `--uxm-progress-bar-*`
  vars on inner elements (studio kebab-fallback, no PER_COMPONENT_MAPPING). The single
  `--uxm-progress-bar-value` var (set inline from `value`) drives both the linear fill width and
  the ring sweep. Exports `ProgressBar`, `ProgressBarProps`, `ProgressBarVariant` from `./progress-bar`.
- **`TextInput` & `Textarea` gained `clearable` (✕).** Both free-text atoms now render a trailing
  clear button when they have content: `clearable?: boolean` — **defaults to `true`** — plus an
  optional `onClear?: () => void`. The ✕ self-clears (resets the field and fires `onChange` with
  `""`), so any controlled `value` + `onChange` usage gets it for free; pass `clearable={false}`
  to opt out. `onClear` is only for custom reset logic beyond emptying the value. (`Select` had its
  own opt-in `clearable` here — REMOVED in 3.0.0, now placeholder-driven; `InputWithIcon` already
  had a clear ✕. Only the plain `TextInput`/`Textarea` are new here.)
- **Studio-only polish (no app API change):** the editable-cell canvas preview now re-renders to
  the selected editor type for all five `EditableCell` types (was text/number only), and the
  right-hand properties panel is always white (`bg-card`) for text contrast in both standalone and
  embedded studio.

### New in 2.8.0 — form-control error states

Found by the `/sync-audit` parity check — these existed in the modo `@modo/uxm` version but had not
reached the published library; now shipped in 2.8.0.

- **`Checkbox`, `RadioGroup`, `ToggleSwitch` gained `error?: string`.** Same convention as the rest
  of the input family: a non-empty string sets `aria-invalid` and renders a `FieldError` message
  below in the danger color. Per the small-control convention the box / track / circle AND the label
  stay neutral — the message is the sole signal; `.uxm-{id}--error` rides the root as a state hook.
  Each also sets `{Component}.hasError = true`, so `FormField` forwards its `error` into them. New
  editor knobs `errorColor` / `errorMessageSize` + an `error` state-variant option.
- **`FileUpload` page-error prop renamed `errorMessage` → `error`.** The atom-level prop is now
  `error?: string` (matches the input family); `errorMessage` stays as a **deprecated alias**
  (`error` wins when both are set). Per-file `FileUploadFileMeta.errorMessage` is unchanged.

### New in 2.9.0 — NumberInput clear/error, InputWithIcon error, aria-describedby wiring

- **`NumberInput` gained `clearable?: boolean` + `error?: string`** (parity with the rest of the
  input family). `clearable` **defaults to `true`** and renders a trailing ✕ when the field has a
  value; the component owns the reset — it clears its own uncontrolled state and fires
  `onChange("")`, so there is **no `onClear`** (mirrors `Select`/`DateInput`, unlike
  `TextInput`'s optional `onClear`). A non-empty `error` sets the red border
  (`.uxm-number-input--error`), `aria-invalid`, and a `FieldError` message below. When clearable,
  the input sits in a layout-only `.uxm-number-input-wrap`; visible chrome stays on
  `.uxm-number-input` so saved studio vars keep applying.
- **`InputWithIcon` gained `error?: string`** — the `--error` modifier re-tones the border,
  background and leading icon, `aria-invalid` lands on the `<input>`, and the message renders
  below via `FieldError`. Its clear ✕ is now the shared atomized affordance (an `IconButton` with
  the `uxm-field-clear` class) instead of a bespoke button.
- **`FieldError` gained `id?: string`, and every input-family control now links its error message
  via `aria-describedby`.** When `error` is set, the control renders `aria-invalid` +
  `aria-describedby` pointing at the `FieldError`'s id (a `useId` per instance) — so assistive
  tech reads *why* the field is wrong, not just that it is. Applies across the family
  (`TextInput`, `Textarea`, `Select`, `NumberInput`, `InputWithIcon`, `NumberStepper`,
  `TimeInput`, `PillSelect`, `SearchDropdown`, `Checkbox`, `RadioGroup`, `ToggleSwitch`, …). No
  consumer change needed.
- **`EditableCell` number editor is masked per keystroke.** The `number` editor uses
  `type="text"` + `inputMode="decimal"` (input-family convention — no native number input) and
  filters each keystroke through the shared `maskNumeric` from `NumberInput`, so illegal
  characters never land in the cell.
- **Studio-knob reliability sweep (no app API change).** Knob-backed props across many atoms
  (`Button` geometry/type, `Card` colour/geometry, `DataTable` cell padding in every density +
  radius, `ToggleSwitch` resting/disabled, lifecycle-connector, and more) now route through
  `--uxm-*` component vars, so saved studio overrides actually repaint them; `Listbox`'s selected
  option shows its colour as soon as the panel opens; studio previews exercise the real `error`
  props. Also `'use client'` directives were dropped from the touched files (the library never
  needed them — see "Writing the JSX").

The library lives at `https://gitlab.viax.tech/services-viax/uxm` and publishes as `@viax/uxm`
to the Viax Nexus npm registry (`https://nexus.viax.tech/repository/viax-npm/`). When a checkout
of that repo is available (search the workspace for a `package.json` with
`"name": "@viax/uxm"`), **prefer the per-component READMEs there as the authoritative
reference** (paths relative to the repo root):

- Top-level: `README.md` — install, subpath exports, full component catalog, MODO theming flow,
  architecture diagram.
- Per-component: `src/ui/{component}/README.md` — props table, CSS vars, MODO-configurable
  design tokens, states/variants, accessibility caveats. Atoms added in 1.1.0–2.0.0 (toast,
  dialog, modal, popover, listbox, banner, editable-cell, field-error, number-stepper) may not
  have READMEs yet — for those, read the `.tsx` JSDoc, which is thorough.
- Tokens: `src/tokens/index.ts` — canonical `themeTokens` array.

When no checkout is available (working in a project that only `npm install`s the package), the
installed package still carries `node_modules/@viax/uxm/README.md`, `CHANGELOG.md`, and full
`.d.ts` types with the same JSDoc. Beyond that, fall back to the bundled references in this
skill:

- `references/component-catalog.md` — every export, grouped by purpose, with one-line summaries
  and key prop signatures. Use this to pick the right primitive.
- `references/design-tokens.md` — all 30 MODO-configurable design tokens with hex values,
  groups, and intended use. Use this when wiring custom CSS or token-based styling.
- `references/quick-recipes.md` — copy-pasteable patterns for the most common compositions
  (page shell, form, list view, theme override).

### New in 2.10.0

- **`ColorInput` / `ColorInputPopover` — new atoms.** Full color picker in the Inputs
  category: saturation/brightness area, hue + opacity sliders, current-color swatch, screen
  eyedropper (EyeDropper API — Chromium only, auto-hidden elsewhere), and a format select
  (HEX/RGB/RGBA/HSL) whose value editor adapts per format — one hex text field, or R/G/B(/A)
  or H/S/L numeric fields; switching format converts the current color. Two concerns are
  deliberately separate: the select changes only the DISPLAYED representation, while
  `outputFormat?: ColorFormat` (default `'hex'`) fixes what `onChange(color: string)` returns
  (hex with alpha < 1 → 8-digit `#rrggbbaa`). `formats?: ColorFormat[]` limits the offered
  representations (a single entry hides the select). Enter commits the focused field and fires
  `onEnter(color)`; Escape reverts the draft and fires `onEsc()`. `ColorInputPopover` wraps the
  same panel behind a swatch trigger button (`open`/`defaultOpen`/`onOpenChange`,
  `placement`, `triggerLabel`) — Enter/Escape additionally close the popover. Both are
  controlled/uncontrolled (`value`/`defaultValue`) and take `alpha`, `eyedropper`, `disabled`,
  `error`. Theming: `--uxm-color-input-*`.
- **`Popover` tolerates nested floating layers.** A Select/Listbox/Menu opened from INSIDE a
  popover panel portals to `document.body`; picking one of its options no longer
  outside-click-dismisses the hosting popover (same `.uxm-popover` exclusion Dialog uses).
- **New icon `eyedropper`** in the shared glyph set.

### New in 3.0.0 — clear-button rollout across inputs (breaking: `Select`)

- **BREAKING — `Select` no longer accepts a `clearable` prop.** Clearability is now inferred from
  the presence of a placeholder option: include `<option value="" disabled>Choose…</option>` and
  the trigger shows a ✕ (once a value is selected) that resets to that placeholder; a select with
  NO placeholder option is not clearable. Migration: drop `clearable` / `clearable={false}` and
  model the empty state as a disabled placeholder `<option value="">`. `searchable` is unchanged.
- **Clear ✕ reached the rest of the input family.** `CurrencyInput`, `DateInput`, `PhoneInput` and
  `TimeInput` each gained `clearable?: boolean` (**defaults to `true`**) — a trailing ✕ shown when
  the field has a value that self-clears (the component owns its own state and fires the change), so
  there is **no `onClear`** (mirrors `NumberInput` / `Select`). Opt out with `clearable={false}`.
  This completes the family-wide clear affordance started in 2.7.0 (`TextInput`/`Textarea`) and
  2.9.0 (`NumberInput`).
- **`CurrencyInput` also left-aligns the amount and dropped `pickerPosition`.** The currency-picker
  position is no longer configurable.

### New in 3.1.2

- **Brand Settings → Typography now works end-to-end in the studio.** Two fixes:
  - **Live font application.** The studio mounts `BrandFontStyles` (alongside `BrandTokenStyles`):
    when `brand.fontFamily` is set it loads the Google-Fonts stylesheet and applies
    `:root { --brand-font: … }` + `body { font-family: var(--brand-font) }` — the exact mirror of
    what `generateOverridesCss` emits after Publish. Picking a typeface re-fonts the studio and
    all previews immediately (previously nothing visible happened until a host applied the saved
    config).
  - **The font picker is the library `Select`** (was a raw native `<select>`, whose OS-level popup
    dropped picks under the canvas event-capture re-renders — selections never landed).
- **`fontFileUrl` / `safeFontFamily` are now exported from `@viax/uxm/studio/generate-css`** —
  the Google-Fonts css2 URL builder (weights 400–700) and the font-name sanitiser the Build path
  uses. Reuse these in host appliers instead of hand-rolling font URL/escaping logic.

### New in 3.3.0

- **New icon `globe`** in the shared glyph set — language / locale switchers, region pickers,
  website links, public-visibility states.

### New in 3.4.0

- **`Select` gained `mode="multi"`.** `SelectProps` is now a discriminated union —
  `SelectSingleProps` (`mode="single"`, the default, unchanged) | `SelectMultiProps` (`mode="multi"`).
  Multi keeps the same `.uxm-select-dropdown` trigger chrome and `<option>` children, but takes
  `value?: string[]` / `defaultValue?: string[]`, fires `onChange(next: string[])` on every toggle,
  renders checkbox rows and a "N selected" trigger, and accepts `clearable?: boolean` (a ✕ on the
  trigger **and** a "Clear all" in the panel footer). Both modes still extend
  `SelectHTMLAttributes<HTMLSelectElement>` minus the five keys `mode` re-shapes (`value`,
  `defaultValue`, `onChange`, `required`, `multiple`), and the leftover native attributes are now
  actually forwarded onto the trigger instead of silently dropped.

  ```tsx
  <Select mode="multi" value={regions} onChange={setRegions} clearable aria-label="Regions">
    <option value="" disabled>Select regions</option>
    <option value="na">North America</option>
    <option value="emea">EMEA</option>
  </Select>
  ```

  Use `PillSelect` instead when the selection should read as chips; use `Select mode="multi"` for
  the compact count-in-the-trigger pattern.
- **`required` + `requiredMessage` across the pickers** — `Select` (both modes), `PillSelect`,
  `EditableCell` and `DataTable` columns (`editorRequired` / `editorRequiredMessage`). The wording
  is shared: `DEFAULT_MULTI_REQUIRED_MESSAGE` (`'Select at least one option'`) is exported from
  `@viax/uxm/ui` so every picker reports the identical text. Semantics differ by family, on purpose:
  the **live** input-family atoms (`Select`, `PillSelect`) let you empty the field and just flag it
  (`aria-required` + a `FieldError` below), while the **commit-boundary** `EditableCell` refuses the
  commit and shows a warning Banner — checked BEFORE your `validate`, so you never hand-write the
  empty rule again.
- **A shared "Clear" / "Clear all" action inside every dropdown panel.** Alongside the existing
  trigger ✕, `Select` (both modes), `PillSelect` and `EditableCell` now render a clear action in the
  panel footer, all styled by one class — `.uxm-listbox__footer-clear-option`, themable via
  `--uxm-listbox-footer-clear-{gap,padding,font-size,radius}`. Consumers building their own picker
  on `Listbox`/`MultiListbox` should reuse that class rather than restyling a `ButtonGhost`.
- **`MultiListbox` gained `commitMode`, `required` and a richer `footer`.** `commitMode?: 'change' |
  'close'` defaults to **`'change'`** — the existing behaviour, `onChange` per toggle — so nothing
  changes for current consumers. Opt into `'close'` for a commit-boundary editor: picks stage in an
  internal draft and `onChange` fires once when the panel closes, which is what makes "clear all →
  pick one" safe on a required field (the transient empty set never commits). `required` /
  `requiredMessage` / `onRequiredViolation(message)` put the empty-set rule in the atom while
  leaving the *display* to the consumer (the panel is gone by the time it matters). The function
  form of `footer` now receives `({ close, clear, selected })`, where `clear` empties the working
  selection **without** closing the panel and `selected` is the live draft — enough to render a
  self-hiding "Clear all".
- **`EditableCell.searchable` now defaults to `'auto'`** (was `undefined`, which inherited the raw
  Listbox `true`). A select/multiselect cell therefore matches the `Select` atom: the search box
  appears only past 6 options. Pass `searchable` explicitly to force it either way.

### New in 4.0.0

- **New `Configuration` component set — `SegmentRow`, `SegmentCard`, `ComponentRow`, `OptionList`.**
  A studio **Configuration** category groups the four building blocks of a Configuration model's
  segment tree (ported 1:1 from the v1 config-builder look/feel + knobs):
  - `SegmentRow` — segment header (drag · accent line · expand chevron · name · count badge).
  - `SegmentCard` — the container that wraps a nested segment (SegmentRow header · divider · inset
    body); the compositional segment-tree container. (Supersedes the former monolithic
    `SegmentTreeRow`, which has been removed — a breaking change.)
  - `ComponentRow` — a config field row (drag · type-icon badge · optional chevron · name · type
    label); badge tint is per-type at runtime via `iconBg`/`iconColor`.
  - `OptionList` — indented options list under a Predefined-Options component (drag · bullet · name);
    optional per-row `rowActions` slot (hover-revealed).

  All four are fully studio-themeable via `--uxm-segment-row-*` / `--uxm-segment-card-*` /
  `--uxm-component-row-*` / `--uxm-option-list-*`. Compose a tree as
  `SegmentCard(header: SegmentRow)` › `ComponentRow`(s) + `OptionList` under options rows, with
  nested segments wrapped in further `SegmentCard`s. To wire the disclosure→region a11y link, pass
  `SegmentCard`'s `bodyId` to the `SegmentRow` header's `aria-controls`.

### New in 4.1.0

- **`SideFlexpane` extended (additive) with a fuller detail-pane header.** New optional props:
  `icon` (leading tinted `IconTile` slot), `subtitle` (line under the title), `actions` (trailing
  header controls, before expand/close), `onBack`/`backLabel` (a top back-link bar — an `onBack`
  action `<button>`, not the `BackLink` navigation anchor), and `expandable` +
  `expanded`/`defaultExpanded`/`onExpandedChange`/`expandedWidth` (a maximize toggle that pins the
  pane to `expandedWidth` and hides the resize handle while expanded; the toggle uses `aria-pressed`,
  not `aria-expanded`). New themable knobs
  `--uxm-side-flexpane-{subtitle-color,divider-color,back-color,back-hover-color,back-focus-ring-color}`.
  The existing eyebrow/title/close/footer API and the drag-resizable left edge are unchanged.

### New in 4.1.2

- **New icons `product`, `organization`, `business-interaction`** in the shared glyph set —
  Viax domain-entity marks (cube / two-tower building / exchange arrows). `business-interaction`
  is the transaction itself; the existing `model-business-interaction` (chat mark) stays the
  model/blueprint glyph.

### New in 4.3.0

- **`EditableCell` gained a `size` prop** (`'small' | 'medium'`, new export `EditableCellSize`).
  `small` (default) is the dense DataTable scale — visually unchanged (its font-size falls back
  to the inherited `1em` until pinned). `medium` steps the cell up to the input-family scale
  (12/6px padding, 14px font) for standalone use in side panels / detail views, where a
  table-dense cell looks undersized next to real inputs. Each size owns a symmetric themable
  knob set `--uxm-editable-cell-{small|medium}-{padding-x,padding-y,font-size}`. There is no
  height knob anymore: the cell's height always derives from font-size + padding (a `1lh`
  floor on the value keeps empty cells one text line tall and clickable). ⚠️ The old
  un-namespaced `--uxm-editable-cell-{min-height,padding-x,padding-y}` vars are GONE — nothing
  reads them any more, so a studio override of Min Height / Padding X/Y saved before this
  version is now inert (padding must be re-saved per size; min-height has no replacement by
  design). The retired keys stay mapped in `generate-css.ts` precisely so they emit those dead
  custom properties instead of falling through to REAL `min-height` / `padding-inline`
  declarations, which would hard-override both size presets.
- **`EditableCell.clearable` now also covers `text` / `number` / `date`** — a ✕ inside the
  EDITING input (mirrors TextInput/NumberInput/DateInput; for date it sits inboard of the
  calendar toggle) that empties the draft and keeps focus. Nothing commits until Enter/blur, so
  `required`/`validate` still guard, and Esc still restores the committed value — which is why
  the ✕ works on required cells too (wipe-and-retype). `required` never hides any clear
  affordance — it guards the outcome: clearing a required cell surfaces the required warning
  (the value stays), clearing an optional one empties it to the placeholder. Display mode
  never shows a ✕.
  ⚠️ `clearable` now **defaults to `true`** (the input-family convention; was opt-in) — every
  editable cell and DataTable editable column gets the affordance uniformly, including the
  pickers' dropdown-footer Clear; pass `clearable={false}` / `editorClearable: false` to opt
  out. Related fix: `format` is no longer called for an empty value — a cleared cell renders
  its `placeholder` (previously a Tag/Badge `format` would paint an empty pill).

### New in 4.4.0

- **Card**: `padding` (any value) and opt-in column `gap` between the card's direct
  children (`number | string | true`; `true` = themed `--uxm-card-gap` default) — content
  arrangement stays composed (`Stack`/`Cluster` inside; `Divider` between rows). Shadow is
  now tunable (`--uxm-card-shadow-{color,blur,offset-y}`) with a theme-aware dark default.
  ⚠️ **`shadow` now reads visibly stronger** — it used to paint the very subtle two-layer
  `--shadow-card` token and now uses Calendar's 6/20 floating-surface geometry (the
  `--shadow-lg` step) at ~3× the alpha, so EXISTING `<Card shadow>` instances change
  appearance. To approximate the old flatter look set `--uxm-card-shadow-{offset-y,blur,color}`
  to `4px` / `12px` / `rgba(0,0,0,0.04)` — that's the token's dominant layer only; the
  composition is single-layer, so its tight `0 1px 2px` contact shadow can't be expressed
  (paint `box-shadow: var(--shadow-card)` yourself if you need it exactly).
  `--shadow-card` is still exported as a public
  elevation alias; Card just no longer reads it (the composition needs a colour, not a
  whole `box-shadow`).
- **FormField**: two orthogonal label axes — `labelTint` (`strong | default | muted`,
  per-tint colour tokens `--uxm-form-field-label-tint-*`) and `labelVariant`
  (`default | overline`, caps eyebrow with its own `--uxm-form-field-overline-*` typography
  tokens; colour comes from the tint). An `EditableCell` child is auto-outdented to align
  its text with the label edge. Note for workbench themes: the single `labelColor` knob the
  tints replaced is migrated to the **strong** tint (the old, and still default, label
  colour), so a theme saved before the split keeps the look it had.

### New in 4.5.0

<!-- Notes for changes merged but not yet published. The release pipeline renames
     this heading to "New in X.Y.Z" and stamps the version/count markers
     (scripts/stamp-skill-version.mjs) — never hand-edit those. Always leave a bare
     "### Unreleased" heading behind for the next MR: the stamper only matches that
     exact string, so appending notes under an already-stamped "New in X.Y.Z"
     heading silently mislabels them and they never get re-stamped. -->

- **`EditableCell` open pickers now wear the editing chrome.** While a select / multiselect
  panel is open, the trigger paints the same card surface + accent border + focus halo as the
  text/number/date editing input (same `--uxm-editable-cell-input-*` vars) — "being edited"
  reads identically across all five editor types.
- **`EditableCell`'s width cap is per size.** `small` keeps the 320px cap (a long value must not
  push a table column — it truncates with an ellipsis instead); `medium` has **no cap** and fills
  its container, like every other input-family field in a side panel (`width: 100%` +
  `border-box`, so a 600px panel with 16px padding gives a 568px cell, its own padding inside).
  Knobs are `--uxm-editable-cell-{small|medium}-max-width` (medium's is a select defaulting to
  `none`). ⚠️ The shared `--uxm-editable-cell-max-width` is retired — a pre-split saved override
  of Max Width no longer applies and must be re-saved per size.
- **`EditableCell`'s value colour is now pinned, not inherited.** The cell (and a picker's
  trigger) reads `--uxm-editable-cell-color` with `--color-text` as the fallback, exposed as a
  **Text Color** knob beside Placeholder Color. Font-size still inherits by design (a cell must
  read at the scale around it), but colour never varied that way — inheriting only let a muted
  column or dimmed row bleed in, which consumers were pinning back on the wrapping `<td>`.
- **`EditableCell` pickers clear from the field.** A clearable select / multiselect also
  renders a ✕ on the trigger, inboard of the chevron, revealed **while the panel is open**
  (a picker's editing surface, mirroring where the text/number/date ✕ lives) and kept out of
  the tab order; it commits `""` / `[]` directly — matching the standalone
  `Select`/`PillSelect` convention, on both sizes. The dropdown-footer Clear stays. In the
  studio both the open chrome and this ✕ are tunable via the new `Open` state (the pickers'
  counterpart to `Editing`), and the previously unreachable Pencil / Chevron / Clear colour
  knobs now render — `styleProperties.showWhen` accepts a `string[]` ("match any of"), so the
  old `'!select|multiselect'` clauses that could never match are gone.

### New in 4.7.0

- **`Menu` items gained an optional `subtitle` — two-line rows.** Set `subtitle?: ReactNode` on
  any `MenuItem` and the row renders as a headline (`label`) with a supporting line beneath it;
  omit it and the row stays single-line with its exact previous DOM. Themeable via
  `--uxm-menu-item-subtitle-{font-size,color,gap}` (defaults `11px` / `--color-text-strong` /
  `2px` — strong, **not** the muted tone icons and hints use, which measures 2.54:1 on the panel
  in the light theme and fails AA for real text); on an active or danger row the subtitle
  inherits the row's text colour at full strength, with no opacity applied — hierarchy comes
  from the smaller font, since an opacity multiplier can push 11px text under AA. Studio adds a
  "Subtitles" On/Off variant (off by default) with Font Size / Color / Row Gap knobs. `MenuItem` is now
  `{ key, label, subtitle?, icon?, hint?, onSelect?, disabled?, danger? }`. From `./menu`.

### New in 4.8.0

- **`LifecycleConnector` routes elbows.** New `routing?: 'auto' | 'straight' | 'bezier' |
  'orthogonal'` (default `auto` — the previous straight-when-aligned / Bezier-otherwise split,
  unchanged path output). `orthogonal` draws a square elbow as three axis-aligned runs
  (stem → cross → drop) from a single connector, with `crossAt?: number` (0–1, default `0.5`)
  placing the cross bus along the vertical span — a caller putting group pills on that bus picks
  its own level rather than inheriting the midpoint. The arrowhead now takes its angle from the
  path's **last** run instead of the whole-edge vector, so an elbow's head is axis-aligned rather
  than diagonal; degenerate runs (`crossAt` at 0 or 1, anchors sharing an x) are dropped before
  that angle is read, and the tip pullback is clamped to the final run so a near-1 `crossAt`
  can't reverse the drop. Also new: `startDot?: boolean` (default `true`) — turn it off on all but
  the first edge of a shared fan-out so one bus shows one dot. `cornerRadius?: number` (default
  `4`, pass `0` for square turns) fillets the elbow, clamped per corner to half the shorter
  adjoining run — `stroke-linejoin` can't do this on its own, it only rounds by half the 1.5px
  stroke. Studio adds Routing / Start Dot variants; `crossAt` and `cornerRadius` get no knob by
  design (see below). ⚠️ Two elbows sharing a `crossAt` stack their cross segments on one line —
  invisible on a solid stroke, visible with `state="dashed"`. Anchoring both at the bus with
  `crossAt={0}` collapses the shared stem and avoids it entirely.
  From `./lifecycle-connector`.
- **Arrow size follows the theme now — it used to be published and ignored.** The studio has always
  had an Arrow Size knob, and it moved the canvas (the preview passes it as a prop), but on Publish
  it emitted a var no rule read, so a consumer's arrowheads never changed. The var is now spelled
  `--uxm-lifecycle-connector-arrow-size` and the component reads it back off its own element
  (`getComputedStyle` in a layout effect, re-read when `data-theme` flips) — the cascade can't
  apply it, since it sizes an SVG polygon rather than setting a CSS property. Resolution is **prop → CSS var → default**, so
  an explicit `arrowSize` still wins and skips the read; the read lands after mount, so a value
  differing from `7` paints one frame at the default first. The var takes **a bare number or a `px`
  length only** (`7`, `7px`, `10.5px`) — any other unit is refused and `7` stands, since `parseFloat`
  would strip a `rem`/`em` rather than convert it and leave a sub-pixel, invisible arrowhead.
  `crossAt` and `cornerRadius` are
  **props only, with no custom property and no studio knob** — where a cross bus sits is per-edge
  layout, the same kind of value as `from`/`to`, not something a theme should carry.
- **`dashPattern` actually applies now — it never did.** The prop was rendered as a `stroke-dasharray`
  presentation attribute, which CSS ranks below every author rule, and the stylesheet's dashed rule
  always resolves (literal `6 4` fallback) — so it always won and `dashPattern="2 2"` painted `6 4`.
  The prop now writes an inline `--uxm-lifecycle-connector-dash-pattern`, giving it the same
  **prop → CSS var → default** order as `arrowSize`. It has **no default value** any more: a
  defaulted prop would stamp that inline var on every connector and no published theme could win.
  Nothing to migrate — the prop had no observable effect to preserve.
- **`LifecycleConnector`'s dashed state is themable at last.** Its colour and width were hardcoded,
  so no knob or override reached them — now `--uxm-lifecycle-connector-dashed-{color,stroke-width}`
  (defaults `--color-text-muted` / `1.5`), matching the idle and active pairs. In the studio the
  three colour/width pairs are no longer three parallel knobs: they collapse into one **Per State**
  Color + Stroke Width that follows the State picker (Dash Pattern rides along on `dashed`), with
  Arrow Size left in a genuinely shared section.
- **`LifecycleConnector`'s idle stroke is `--color-text-subtle`, not `--color-border`.** Border grey
  was tuned for edges on white cards and effectively vanished on the sunken canvas the atom is
  built for; consumers were re-tinting it at canvas level. Arrowhead and start dot follow, since
  all three read one var.
- **`LifecycleConnector` override vars lost their doubled segment.** The studio used to publish
  `--uxm-lifecycle-connector-connector-idle-color` (the generator prefixed an already-`connector`-
  prefixed knob key); the canonical names are now
  `--uxm-lifecycle-connector-{idle,active}-{color,stroke-width}` and
  `--uxm-lifecycle-connector-dash-pattern`. The doubled spellings still resolve as a fallback
  alias for one minor — re-save the component in the studio to move a stored theme across.

### New in 4.9.0

<!-- Notes for changes merged but not yet published. The release pipeline renames
     this heading to "New in X.Y.Z" and stamps the version/count markers
     (scripts/stamp-skill-version.mjs) — never hand-edit those. Always leave a bare
     "### Unreleased" heading behind for the next MR: the stamper only matches that
     exact string, so appending notes under an already-stamped "New in X.Y.Z"
     heading silently mislabels them and they never get re-stamped. -->

- **`LifecycleNodeCard` gained a `--uxm-lifecycle-node-card-min-height` knob** (studio: "Min
  Height", default `0`). Opt-in uniform-height floor for canvas layouts — set it so every node
  card shares a minimum height and connector endpoints can key off a single number instead of
  guessing per-kind card heights. Default `0` keeps today's content-driven height. The card now
  also declares `box-sizing: border-box` itself, so the number **is** the rendered card height —
  no reliance on the host shipping a reset (`ui.css` ships none, and eight sibling atoms already
  set it on themselves). ⚠️ That makes the existing `--uxm-lifecycle-node-card-width` (default
  `280px`) mean 280px **total** rather than 280px plus padding and border. Hosts with a global
  reset — the studio's Tailwind preflight, modo — are unaffected; a consumer importing `ui.css`
  with no reset of its own will see the card narrow by its horizontal padding + border (34px at
  the defaults). Purely a themeable-var addition otherwise — no React API change.
  From `./lifecycle-node-card`.

## Workflow

### Before writing any code

1. Confirm the project is a React/Next.js consumer of `@viax/uxm`:
   - Check `package.json` for `@viax/uxm` in `dependencies`.
   - Check for `react@^19` peer.
   - If absent and the user wants to add it, refer them to the install section of the
     `@viax/uxm` README (the package comes from the Viax Nexus registry —
     `npm config set registry https://nexus.viax.tech/repository/viax-npm/` or a scoped
     `.npmrc` entry is required).
2. Confirm CSS imports are in place. Both stylesheets must be imported once at the app entry:
   ```ts
   // app/layout.tsx (Next.js) or main.tsx (Vite/CRA)
   import '@viax/uxm/tokens.css';
   import '@viax/uxm/ui.css';
   ```
   If missing, add them before any visual work.

### Picking the right component

Open `references/component-catalog.md` (or the top-level README if uxm is local) and locate the
category that matches the user's intent. Categories are: **Forms & inputs · Buttons & actions ·
Navigation · Feedback & status · Layout & structure · Data display · Configuration editor ·
Lifecycle diagrams.**

Then read the chosen component's README (per-component, when uxm is local) before writing JSX —
the README documents the prop signature, states, design tokens, and a11y obligations. Do not
guess prop names from training data.

### Writing the JSX

- **Import from the narrowest subpath available** for tree-shaking:
  - `import { ButtonPrimary } from '@viax/uxm/ui'` (preferred) over
    `import { ButtonPrimary } from '@viax/uxm'`.
  - `import { themeTokens } from '@viax/uxm/tokens'` for token-aware tooling.
  - `import { UxmApp } from '@viax/uxm/studio'` + `import '@viax/uxm/studio.css'` to embed the
    live style editor (see "Embedding the style editor").
- **No `"use client"` directive** unless the file uses client-only React features (hooks, state,
  event handlers). UXM components themselves do not require it.
- **BEM classnames are part of the public contract**. If the user wants to extend styling, they
  should target the `uxm-{component}` class or its modifier classes (e.g. `uxm-button-primary`,
  `uxm-chip--state-focus`). Document this when delivering.
- **`className` always merges via the library's `cn` helper internally** — pass any extra class
  freely; it composes with the BEM base class.

### Styling and theming

The library exposes a two-layer customisation model:

| Layer | Where to set | When to use |
|-------|--------------|-------------|
| **Component CSS vars** (`--uxm-{component}-*`, incl. per-state `--uxm-{component}-{hover,active,focus,disabled}-*`) | Inline `style`, a scoped CSS rule, or the studio's saved overrides | Per-instance / per-state tweaks (e.g. a specific button's hover background). |
| **Global design tokens** (`--color-*`) | App-level CSS file, or the embedded studio's brand settings | Brand-wide theming. Cascades into every component instantly. |

For any custom colour, **prefer mapping to an existing design token** before introducing a literal
hex. Use `references/design-tokens.md` to find the right token by intent (e.g. "I need a success
green" → `--color-success-text`, not `#166534`).

If the user is building a host shell that lets designers tune the brand live, prefer the
**ready-made editor**: mount `UxmApp` from `@viax/uxm/studio` (see "Embedding the style editor").
Only drop down to raw `@viax/uxm/previews` (the `PreviewProps` preview primitives) when building a
bespoke editor surface — see `references/quick-recipes.md`.

### Accessibility

Each component README's **Accessibility** section is the authoritative checklist for that
primitive (native semantics it provides, what's missing, ARIA hooks the consumer must wire). Cite
those when delivering work — do not invent your own a11y story without checking.

Some honestly-flagged gaps to know about:
- `data-table` has no `scope` attribute on `<th>`; for sortable / large tables, consumers must
  layer additional ARIA.
- `loader` does not honour `prefers-reduced-motion`.
- `app-sidebar` references `--mobile-*` rules that are missing from its SCSS.
- Several `lifecycle-*` primitives are visual-only and rely on the parent canvas for a11y.

## Embedding the style editor (`@viax/uxm/studio`)

The full MODO design workbench ships as a mountable component, so a host portal can offer a live
brand/style editor without rebuilding it. Import it from the `studio` subpath + its CSS once:

```tsx
import { UxmApp, createClientPersistence } from '@viax/uxm/studio';
import '@viax/uxm/studio.css'; // Tailwind v4 bundle — see leakage note below

<UxmApp embed persistence={createClientPersistence({ brand: seed })} />
```

**`UxmApp` props:** `embed` (no full-page chrome — use when mounting inside a host), `persistence`
(the backend contract), `syncFavicon` (drive the tab favicon from the brand).

**Persistence adapters** — pick by whether you have a backend:

- `createHttpPersistence('/api/uxm')` — full read/write/upload against a Hono backend (Save / Quick
  Save / Publish enabled).
- `createClientPersistence({ brand })` — preview-only: live edits + working logo/favicon upload via
  `data:` URLs, nothing saved across reload. For static portals with no backend.
- `createReadOnlyPersistence({ brand })` — live-preview only, uploads disabled.
- For a no-backend portal that still wants **Save-that-persists**, implement the tiny
  `StudioPersistence` interface (`load` / `save` / `uploadAsset` / `capabilities`) over `localStorage`.

**Apply the editor's config to the host globally.** Import `generateOverridesCss` from
`@viax/uxm/studio/generate-css`, run it over the saved `{ overrides, brand }`, and inject the result
into a single global `<style>`. It emits the `:root` / `[data-theme="dark"]` brand-token blocks plus
per-component override rules (which the per-state atom CSS now reads), re-theming the whole host on
every route — and survives reload if you persist the state. When the brand carries a typeface
(`brand.fontFamily`, set via Brand Settings → Typography), the same output also includes the
Google-Fonts `@import`, `--brand-font`, and `body { font-family: var(--brand-font) !important }`
— so the host's base font follows the brand automatically. Host CSS should therefore declare its
base font as `html, body, #root { font-family: var(--brand-font, var(--font-sans)); }` and never
hardcode a competing family (see `references/design-tokens.md` → "Typography").

> ⚠️ **A non-Tailwind host must alias `--font-sans` first, or everything renders in Times New
> Roman.** `tokens.css` declares `--font-sans` only inside its `@theme inline { … }` block, a
> Tailwind v4 at-rule that browsers drop wholesale — so the var never actually exists in a plain
> BEM/SCSS host. With no brand font published, `--brand-font` is unset too, so the `body` rule
> above collapses to the guaranteed-invalid value, becomes invalid at computed-value time, and
> `<body>` inherits the browser's default serif. Every uxm atom uses `font-family: inherit`, so the
> serif spreads across the whole app. Add this once, after `tokens.css`:
>
> ```css
> :root { --font-sans: var(--font-inter, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif); }
> button, input, select, textarea { font: inherit; }
> ```
>
> `--font-inter` *is* declared in the real `:root`, so it resolves. The second rule is needed
> because native form controls do NOT inherit the document font (UA default → Arial): uxm atoms
> set `font-family: inherit` themselves, but any raw `<button>`/`<input>`/`<select>` in host code
> would otherwise render in Arial next to the body font. There is no `--font-mono` token —
> use `var(--font-mono, monospace)` with the literal fallback.

**Brand tokens.** Seed the studio's `brand.tokens.light` / `.dark` with the host's brand colours so
the editor adopts them as its own managed Accent tokens; `BrandTokenStyles` (rendered even in
`embed`) writes them to `:root`, so editing re-tints the host live. The host owns `data-theme`
(light/dark) in `embed` mode — drive it yourself.

**CSS-leakage caveat for non-Tailwind hosts.** `@viax/uxm/studio.css` is a Tailwind v4 bundle: a
global preflight reset (`@layer base`, lower priority than your unlayered CSS) plus an UNLAYERED
`:root { … }` block of the library's *default* tokens. In a non-Tailwind host (e.g. a BEM/SCSS
portal), import it **before** the host's own global stylesheet so the host's `:root` brand stays the
base; the studio's runtime `<style>` still wins live on the editor route.

## Hard rules

1. **Never guess prop names.** Always read the component's README (or `component-catalog.md` if
   not available) before writing the JSX.
2. **Never duplicate primitives.** If `@viax/uxm` already ships a `Card`, do not handroll a div
   with the same intent. The library covers ~76 patterns; check first.
3. **Never inline literal hex codes** when an existing design token covers the intent. Map to
   `--color-*` via `var()` so MODO brand-settings can re-tint.
4. **Never import preview components into application code.** Previews live in
   `@viax/uxm/previews` and are for editor/host shells only. Tree-shake guarantees they don't
   leak into `/ui` consumers — keep it that way.
5. **For new components that don't fit any existing primitive**, propose extending the library
   rather than building one-offs. The contribution flow is in the top-level README's
   "Contributing" section.
6. **`PropertyField`'s value is `children`, never a `value` prop.** `value="…"` silently renders
   an empty cell. `PropertyGrid` has no `columns` / `minColumnWidth` prop — its grid template is
   fixed.
7. **`PageHeader`'s `meta` renders inside a `<p>` — inline content only.** A block-level primitive
   (`Stack`, a `<div>`) there is invalid `<div>`-in-`<p>` nesting and triggers a hydration warning.
8. **`ResponsiveGrid`'s `min` is a CSS length string** (`"280px"`), not a bare number — a bare
   number emits an invalid, dropped `minmax()`.
9. **`Stack` is flex-column only — never override it with `flexDirection: 'row'`.** Use `Cluster`
   for horizontal layouts (avatar/name rows, button groups, inline chips).
10. **`BackLink` always needs a real `href`**, even when the click is intercepted for
    client-side nav (`preventDefault()`) — it's an `<a>`, and `onClick`-only breaks keyboard focus
    and right-click/open-in-new-tab.

## Out of scope

- **Vue MFA components** — use `viax-mfa-component` skill.
- **A *bespoke* editor surface hand-rolled from raw previews** — `@viax/uxm/previews` provides the
  preview primitives for that, but prefer the ready-made `UxmApp` from `@viax/uxm/studio`
  ("Embedding the style editor"). Only the bespoke-from-previews path is out of scope here.
- **Design token additions** — propose them via PR to the `@viax/uxm` repo, do not invent local
  `--color-*` declarations.
