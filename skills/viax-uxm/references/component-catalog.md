# @viax/uxm — Component Catalog

All 92 components exported from `@viax/uxm/ui` (as of v4.9.0), grouped by intent. Use this file
to pick the right primitive when the `@viax/uxm` repo is not available locally. When it is, read
the per-component README at `src/ui/{name}/README.md` in the uxm repo
(`https://gitlab.viax.tech/services-viax/uxm`) for the full API
(note: atoms added in 1.1.0–2.0.0 — toast, dialog, modal, popover, listbox, banner,
field-error, number-stepper — may not have READMEs yet; read their `.tsx` JSDoc).

Import path for all: `import { … } from '@viax/uxm/ui';`

> **v2.0.0 breaking changes:** `Alert` is REMOVED — use `Banner` (same
> variant/title/icon/children; adds `onDismiss`). `NumberField` is RENAMED to `NumberStepper`
> (same props + new `error`). If training data or old code suggests `Alert` / `NumberField`,
> they no longer exist.
>
> **v3.0.0 breaking change:** `Select` no longer accepts a `clearable` prop. Clearability is
> inferred from a placeholder `<option value="" disabled>` — include one to get the reset ✕; omit
> it for a non-clearable select.

---

## Forms & inputs

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **Calendar** | `Calendar`, `CalendarValue`, `CalendarProps` | Three-view (day/month/year) calendar, single + range selection, controlled or uncontrolled. "Today" footer button jumps to the current month; `shadow` boolean (default true — pass false for a flat embedded calendar). |
| **Checkbox** | `Checkbox`, `CheckboxProps` | Label-wrapped native input + custom box; controlled. ⚠️ **`onChange` is `(checked: boolean, e) => void`** — the boolean comes first, NOT a bare native event (so `e.target.checked` is wrong). Label content goes in `children`. `error?: string` (2.8.0) — sets `aria-invalid` + a FieldError message below; box/label stay neutral. |
| **ColorInput** | `ColorInput`, `ColorInputPopover`, `ColorFormat`, `ColorInputProps`, `ColorInputPopoverProps` | Color picker (2.10.0): saturation/brightness area, hue + opacity sliders, swatch, screen eyedropper (Chromium-only, auto-hidden), format select HEX/RGB/RGBA/HSL with a per-format value editor (hex text field, or R/G/B(/A) / H/S/L numeric fields). `outputFormat` (default `'hex'`; alpha<1 → `#rrggbbaa`) fixes what `onChange` returns — independent of the displayed representation; `formats` limits the select. Enter commits + `onEnter`, Esc reverts + `onEsc`; `ColorInputPopover` = swatch trigger + panel in a Popover, Enter/Esc also close it. |
| **CurrencyInput** | `CurrencyInput`, `CurrencyValue`, `CurrencyInputProps` | Left-aligned amount + currency picker with searchable popover, locale formatting. `clearable?: boolean` (**default `true`**) — self-clearing trailing ✕, no `onClear` (3.0.0, which also dropped `pickerPosition`). |
| **DateInput** | `DateInput`, `DateInputFormat`, `DateInputMode`, `DateInputProps` | Masked date field, single/range, formats `mdy`/`dmy`/`ymd`. Focusing the field opens the Calendar picker (type-or-pick). `clearable?: boolean` (**default `true`**) — self-clearing ✕ by the calendar icon, no `onClear` (3.0.0). |
| **FileUpload** | `FileUpload`, `FileUploadFileMeta`, `FileUploadState`, `FileStatus`, `FileUploadProps` | Drop area + per-file progress rows; controlled via state prop. Page-level error via `error?: string` (2.8.0; renamed from `errorMessage`, which stays a deprecated alias); per-file errors via `FileUploadFileMeta.errorMessage`. |
| **FieldError** | `FieldError`, `FieldErrorProps` | Shared error-message renderer (exclamation icon + text) used internally by every input atom's `error` prop. Pass the atom's own `uxm-{atom}__error-message` class; `id?: string` (2.9.0) lets the owning control reference it via `aria-describedby` — every input atom wires this automatically. Rarely used directly. |
| **FormField** | `FormField`, `FormFieldLabelPosition`, `FormFieldProps`, `FormFieldLabelTint`, `FormFieldLabelVariant` | Label + optional help text wrapper. `labelPosition: 'top' \| 'side'`. **Owns label rendering** — atoms below render bare. Field errors live on the ATOM's `error` prop, not here. Two orthogonal label axes: `labelTint: 'strong' \| 'default' \| 'muted'` — colour, each tint themable via `--uxm-form-field-label-tint-*` (muted = detail panels where the value dominates); `labelVariant: 'default' \| 'overline'` — typography, overline = small caps "eyebrow" with its own `--uxm-form-field-overline-*` tokens (colour still comes from the tint). An `EditableCell` child is auto-outdented so its text sits on the label edge (its display state is a button — pair it with an explicit `aria-label`). |
| **TextInput / Select / Textarea** | `TextInput`, `Select`, `Textarea`, `TextInputProps`, `SelectProps`, `SelectSingleProps`, `SelectMultiProps`, `TextareaProps` | Bare input/textarea atoms + Select. All three take `error?: string` (red border + `aria-invalid` + message below via FieldError). `TextInput` & `Textarea` have `clearable?: boolean` (**default `true`**) + optional `onClear` — a trailing ✕ that self-clears and fires `onChange('')` for free on any controlled field (2.7.0). Select is **Listbox-backed** (cross-browser panel, shared listbox theming) with a compatible native-like API: `<option>` children, `value`/`defaultValue`, `onChange(e.target.value)`; plus `searchable?: boolean \| 'auto'` (`'auto'` reveals the search box past 6 options; default). **Clearability is placeholder-driven** (3.0.0): include a placeholder `<option value="" disabled>` and the trigger shows a ✕ to reset to it — the standalone `clearable` prop was REMOVED. (3.4.0) `SelectProps` is now a union on `mode`: `mode="multi"` gives an array `value`/`onChange(next: string[])`, a "N selected" trigger, checkbox rows and `clearable` (✕ on the trigger + "Clear all" in the panel); both modes take `required` + `requiredMessage` (flags empty, never blocks) and keep every non-reshaped native `<select>` attribute. From `./input`. |
| **InputWithIcon** | `InputWithIcon`, `InputWithIconProps` | Text input with leading icon + optional clear ✕ (shared `uxm-field-clear` affordance). ⚠️ The `--uxm-input-with-icon-icon-size` var (default 16px) only reserves LEFT PADDING for the icon — it does not size the `icon` node itself. `icon` is arbitrary `ReactNode` (typically `<Icon>`, which defaults to `size={24}`), so an un-sized `<Icon glyph="…" />` overflows the reserved slot. Clamp it globally: `.uxm-input-with-icon__icon svg { width: 16px; height: 16px; }`. `error?: string` (2.9.0) — re-tones border/background/leading icon, `aria-invalid` + FieldError message below. |
| **NumberStepper** | `NumberStepper`, `NumberStepperProps` | Numeric input with ± steppers (composed IconButton) + optional unit suffix + `error`. Renamed from `NumberField` in 2.0.0. |
| **NumberInput** | `NumberInput`, `NumberInputProps` | Typing-only masked numeric input; supports decimal / negative. 2.9.0: `clearable?: boolean` (**default `true`**) — trailing ✕ that self-clears and fires `onChange('')`, no `onClear` (mirrors Select/DateInput); `error?: string` — red border + `aria-invalid` + FieldError message below. |
| **PasswordInput** | `PasswordInput`, `PasswordInputProps` | Masked password field with eye toggle. |
| **PhoneInput** | `PhoneInput`, `PhoneValue`, `PhoneInputProps` | Country picker + national number, searchable popover. `clearable?: boolean` (**default `true`**) — self-clearing ✕, no `onClear` (3.0.0). |
| **PillSelect** | `PillSelect`, `PillSelectProps` | Multi-select chip field backed by MultiListbox. `chipsPosition: 'inside'` (tag-input style) `\| 'below'` (compact "N selected" trigger, default); `error`. (3.4.0) `clearable` (trailing ✕ that drops every chip + a "Clear all" in the panel) and `required` / `requiredMessage` — emptying is allowed but flags the shared message immediately. |
| **RadioGroup / RadioOption** | `RadioGroup`, `RadioOption`, `RadioGroupDirection`, `RadioGroupProps`, `RadioOptionProps` | Radio group with composable options. `direction: 'vertical' \| 'horizontal'`. `RadioGroup` takes `error?: string` (2.8.0) — `aria-invalid` + a group FieldError message below; circles/labels stay neutral. |
| **RangeSlider** | `RangeSlider`, `RangeSliderProps` | Dual-thumb range; shares slider styling. |
| **SearchDropdown** | `SearchDropdown`, `SearchDropdownOption`, `SearchDropdownProps` | Combobox: trigger + searchable Listbox panel; clear ✕ in the trigger; `error`. Thin wrapper over `Listbox` — panel theming flows from the shared listbox surface. |
| **Slider** | `Slider`, `SliderProps` | Native range input with gradient-painted progress. |
| **TimeInput** | `TimeInput`, `TimeInputFormat`, `TimeInputProps` | Masked HH:MM field, column-scroll picker popover (shared Popover shell), 24h or 12h, `minuteStep`, `error`. Focusing the field opens the picker (type-or-pick). `clearable?: boolean` (**default `true`**) — self-clearing ✕ inboard of the clock icon, no `onClear` (3.0.0). |
| **ToggleSwitch** | `ToggleSwitch`, `ToggleSwitchProps` | On/off toggle; thumb width derived from height. ⚠️ **`onChange` is `(checked: boolean, e) => void`**, same as `Checkbox`. `ToggleSwitchProps` does NOT extend native input attributes — the accepted set is `checked`/`defaultChecked`/`disabled`/`onChange`/`children`/`className`/`name`/`aria-label`/`style`/`error` only. `error?: string` (2.8.0) — `aria-invalid` + a FieldError message below; track/label stay neutral. |

## Buttons & actions

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **ButtonPrimary / Secondary / Tertiary / Ghost / Danger** | `ButtonPrimary`, `ButtonSecondary`, `ButtonTertiary`, `ButtonGhost`, `ButtonDanger`, `ButtonProps` | Five button variants on native `<button>`. `type` defaults to `'button'`. **`ButtonDanger`** (2.6.0) is the outlined destructive variant for irreversible actions (Delete/Remove/Discard) — danger token trio, solid danger fill when pressed. From `./button`. |
| **ButtonGroup** | `ButtonGroup`, `ButtonGroupOption`, `ButtonGroupProps` | Segmented control. Controlled or uncontrolled. |
| **ButtonIcon** | `ButtonIcon`, `ButtonIconProps` | Square icon button with **required** `aria-label`. |
| **ButtonWithIcon** | `ButtonWithIcon`, `ButtonWithIconProps` | Bordered button with required `icon` slot + label. |
| **IconButton** | `IconButton`, `IconButtonProps` | Alternative icon-only button with SVG-controlling CSS vars. |
| **InlineAction** | `InlineAction`, `InlineActionProps` | 10px text-first button, muted → accent-bold on hover. Use for in-row affordances. |
| **Menu** (2.6.0) | `Menu`, `MenuProps`, `MenuItem`, `MenuSeparator`, `MenuEntry`, `MenuTriggerProps` | Action / dropdown menu on the headless `Popover` (`role="menu"`, arrow-key nav, separators, leading icons, trailing hints, `danger` rows). **No selected value / no checkmarks** — pick a row → run its action → dismiss (use `Listbox`/`Select` to HOLD a value). Consumer owns the trigger via `renderTrigger` (spread `triggerProps` on an `IconButton` ⋮, `Button`, …). `items: MenuEntry[]` where `MenuEntry = MenuItem ({ key, label, subtitle?, icon?, hint?, onSelect?, disabled?, danger? }) \| MenuSeparator ({ separator: true })`. A `subtitle?` renders a two-line row (headline `label` + supporting line beneath), themeable via `--uxm-menu-item-subtitle-{font-size,color,gap}`. Portaled panel; studio-themed on `.uxm-menu, .uxm-menu__panel`. From `./menu`. |
| **BackLink** | `BackLink`, `BackLinkProps` | Anchor with leading back-arrow icon. ⚠️ **Always pass a real `href`**, even when the click is intercepted for client-side nav (`preventDefault()` inside `onClick`) — it renders as `<a>`, so an `onClick`-only usage breaks keyboard focus and right-click/open-in-new-tab. |
| **Link** | `Link`, `LinkUnderline`, `LinkProps` | Native `<a>` with `underline: 'hover' \| 'always' \| 'never'`; `external` adds arrow icon + safe `rel`. |

## Navigation

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **AppSidebar** | `AppSidebar`, `AppSidebarBrand`, `AppSidebarSection`, `AppSidebarNavItem`, `AppSidebarProps` | App-shell left sidebar. `brand: { logoUrl?, iconUrl?, alt? }` (⚠️ no `name` prop), `sections: { heading?, items }[]` (⚠️ the section key is **`heading`**, not `label`), plus `collapsed`, `onCollapseToggle`, `footer`, `linkAs`, `mobileOpen`, `onMobileClose`. Items are `{ href, label, icon?, active?, iconBg?, iconColor?, trailing? }`. **`linkAs` receives `href`** — fine for `next/link`, but react-router's `Link` needs `to`, so wrap it in a `forwardRef` adapter (see quick-recipes §1) or nav breaks/reloads. |
| **AppTopBar** | `AppTopBar`, `AppTopBarProps` | App-shell top bar; translucent bg via `color-mix`. Props: `search`, `actions`, `onMobileMenuClick` — ⚠️ there is **no `title`** prop; page titles belong to `PageHeader`. |
| **Breadcrumb** | `Breadcrumb`, `BreadcrumbCrumb`, `BreadcrumbSeparator`, `BreadcrumbProps` | Crumb path with 4 separator styles. |
| **FilterTabs** | `FilterTabs`, `FilterTabsOption`, `FilterTabsProps` | Segmented control with `role="tablist"`. |
| **SidebarNavItem** | `SidebarNavItem`, `SidebarNavItemProps` | Anchor-based nav row; polymorphic `as` prop. |
| **Tabs** | `Tabs`, `TabsOption`, `TabsProps` | Pill segmented control, equal-width. |
| **TabsUnderline** | `TabsUnderline`, `TabsUnderlineOption`, `TabsUnderlineProps` | Underlined tab nav. |
| **ViewSwitcher** | `ViewSwitcher`, `ViewSwitcherOption`, `ViewSwitcherProps` | Icon-only segmented group; `label` required as `aria-label`. |

## Feedback & status

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **Banner** | `Banner`, `BannerVariant`, `BannerProps` | Persistent inline strip; variants `success` / `info` / `warning` / `error`; `title` / `icon` / `children` / optional `onDismiss` (X). Stays until dismissed or removed from state — for transient feedback use `toast.*()`. Replaced `Alert` in 2.0.0. |
| **Toast / Toaster / toast** | `Toast`, `Toaster`, `toast`, `ToastVariant`, `ToastProps`, `ToasterProps`, `ToastPosition` | Transient corner notifications. Mount `<Toaster position max />` ONCE at the app root, then fire imperatively: `toast.success('Saved')`, `.info/.warning/.error(message, { duration?, id? })`, `toast.dismiss(id)`. |
| **Dialog** | `Dialog`, `DialogProps` | Headless modal shell: portal + backdrop + focus trap + scroll lock + Escape/outside-click dismissal (`closeOnEscape` / `closeOnOutsideClick` / `initialFocus`). Controlled via `open` / `onOpenChange`. Pairs with `Modal`. |
| **Modal** | `Modal`, `ModalSize`, `ModalProps`, `ModalHeaderProps` | Standard panel inside Dialog: `<Modal size onClose><Modal.Header/><Modal.Body/><Modal.Footer/></Modal>`. `size: 'sm' \| 'md' \| 'lg' \| 'fullscreen'`; `onClose` renders the header X. |
| **Badge** | `Badge`, `BadgeMode`, `BadgeType`, `BadgeProps` | Small status pill; 6 tones × 2 modes (`count` / `dot`). |
| **Chip** | `Chip`, `ChipMode`, `ChipProps` | Mode-driven (`assist` / `filter` / `input` / `suggestion`). Renders `<button>` or `<span>` depending on interactivity. |
| **EmptyState** | `EmptyState`, `EmptyStateProps` | Icon + title + `description` for empty lists / no-results. Props: `icon`, `title` (required), `description`, `action`. ⚠️ It is `description` — **not** `body`. |
| **ErrorPage** | `ErrorPage`, `ErrorPageProps` | Full-page error layout (zero `--uxm-*` knobs; tokens only). Props: `code`, `icon`, `title` (required), `message`, `primaryAction`, `secondaryAction`. ⚠️ Not `description` / `action` — those are `EmptyState`'s names. |
| **Loader** | `Loader`, `LoaderVariant`, `LoaderLayout`, `LoaderProps` | Spinner / dots / bar, optional `|`-separated cycling messages. ⚠ Does not honour `prefers-reduced-motion`. |
| **ProgressBar** | `ProgressBar`, `ProgressBarVariant`, `ProgressBarProps` | Determinate progress (0–100%) — companion to `Loader` when the fraction done is known (uploads, batch ops). `value` (clamped 0–100), `variant: 'linear' \| 'ring'` (linear track+fill or CSS conic-gradient ring, no SVG), `label` (caption + accessible name), `valueText` (override `${round}%`). `role="progressbar"` + aria-valuenow/min/max. Theming via `--uxm-progress-bar-*`. From `./progress-bar` (2.7.0). |
| **Tag** | `Tag`, `TagType`, `TagSize`, `TagProps` | Semantic label; 6 types × 2 sizes; presentational. |
| **Tooltip / ContentTooltip** | `Tooltip`, `ContentTooltip`, `TooltipPlacement`, `TooltipProps`, `ContentTooltipProps` | Dark bubble + arrow / card popover. Render-only, no positioning. |
| **HoverTooltip** | `HoverTooltip`, `HoverTooltipProps` | Behavior layer `Tooltip` lacks: hover trigger (owned `openDelay`) + optional truncation gate (`truncatedOnly` — only reveals when the wrapped element overflows) + `Popover` positioning/portal, rendering `Tooltip` inside. Wraps a single child `ReactElement`; `content`, `placement: 'top' \| 'bottom'`, `disabled`, `showArrow`. Non-interactive (closes on pointer-leave). Use to reveal clamped table/cell values. |
| **BulkActionBar** (2.6.0) | `BulkActionBar`, `BulkActionBarProps`, `BulkAction` | Floating toolbar shown once rows are selected: "{N} selected · actions · × clear". Presentational — the consumer owns `selectedKeys` state and positions it (fixed/sticky); pairs with `DataTable` selection. `count: number`, `actions?: BulkAction[]` (`{ key, label, icon?, danger?, disabled?, onClick? }`), `onClear?` (renders the ×), `countLabel?: (count) => ReactNode`, `style?`. From `./bulk-action-bar`. |

## Layout & structure

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **Card** | `Card`, `CardProps` | Minimal surface; `shadow` boolean. `padding?: number \| string` (any value → `--uxm-card-padding`); `gap?: number \| string \| true` — opt-in column layout (`.uxm-card--gap`) spacing the card's DIRECT children (e.g. header ↔ content group; `true` = themed `--uxm-card-gap` default). Shadow is tunable via `--uxm-card-shadow-{color,blur,offset-y}` with a theme-aware dark default — and now reads **visibly stronger**: it used to paint the subtle two-layer `--shadow-card` token, now Calendar's 6/20 geometry at ~3× the alpha, so existing `<Card shadow>` instances change appearance (set offset-y/blur/color to `4px`/`12px`/`rgba(0,0,0,0.04)` to approximate the old look). `--shadow-card` stays exported as a public elevation alias but Card no longer reads it. Content arrangement stays composition: nest `Stack`/`Cluster`/`ResponsiveGrid`; hairlines between rows = compose `Divider` (deliberately NOT a Card prop). No width props — the card fills its container. |
| **Cluster** | `Cluster`, `ClusterProps` | Flex-row layout: `align` / `justify` / `wrap` / `gap`. **No tokens read.** Use this (not a `flexDirection: 'row'`-overridden `Stack`) for any horizontal row — avatar + name rows, button groups, inline chips. |
| **DetailSection** | `DetailSection`, `DetailSectionProps` | Title + icon-tile + content section. |
| **Divider** | `Divider`, `DividerProps` | Horizontal rule, optional inline label. |
| **InlineFilter** | `InlineFilter`, `InlineFilterProps` | 3-slot layout: `search` / `filters` / `trailing`. **No tokens read.** |
| **PageHeader** | `PageHeader`, `PageHeaderProps` | Icon-tile + title + meta + actions row. ⚠️ **`meta` renders inside a `<p>`** — pass inline content only (string/`<span>`/fragment); a block-level primitive like `Stack` there is invalid `<div>`-in-`<p>` nesting and triggers a hydration warning. |
| **PageShell** | `PageShell`, `PageShellVariant`, `PageShellProps` | Sidebar + topBar + content chrome. `variant: 'standard' \| 'canvas'`. |
| **ResponsiveGrid** | `ResponsiveGrid`, `ResponsiveGridProps` | Breakpoint-free `auto-fit` + `minmax(min, 1fr)`. **No tokens read.** ⚠️ **`min` is a CSS length string** (e.g. `"280px"`), not a bare number — `min={280}` emits the invalid, dropped `minmax(280, 1fr)`. |
| **SectionHeader** | `SectionHeader`, `SectionHeaderProps` | Uppercase `<h4>` with optional trailing + subtitle. |
| **SideFlexpane** | `SideFlexpane`, `SideFlexpaneProps` | Right-docked resizable `<aside>` with ARIA separator. Header composes optional `icon` · `eyebrow` · `title` · `subtitle` + a trailing `actions` slot; optional `onBack`/`backLabel` back-link bar; `expandable` toggle (`expanded`/`defaultExpanded`/`onExpandedChange`, `expandedWidth`) that maximises and hides the resize handle while expanded. |
| **Stack** | `Stack`, `StackProps` | Flex-column with `gap` + `align`. **No tokens read.** ⚠️ **Vertical only — there is no direction prop**; do not fight it with a `flexDirection: 'row'` style override — reach for `Cluster` for horizontal layouts. |

## Data display

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **Avatar** | `Avatar`, `AvatarType`, `AvatarProps` | Image / text-fallback circle. |
| **DataTable** | `DataTable`, `DataTableColumn`, `DataTableDensity`, `DataTableProps` | Generic typed table. `density: 'compact' \| 'default' \| 'relaxed'`. Per-column `render`, `align`, `key`, `maxWidth` (ellipsis clamp; capped plain cells auto-wrap in HoverTooltip; on an editable column it feeds the cell's per-size max-width vars, so the column cap wins at either size — uncapped editable columns fall back to the atom's own default: 320px at `small`, none at `medium`), plus inline editing: `editable`, `editor: EditableCellType` (`text`/`number`/`date`/`select`/`multiselect`), `dateFormat`, `editorOptions`, `editorSearchable`, `editorClearable`, (3.4.0) `editorRequired` / `editorRequiredMessage` (empty blocks the commit with a warning, checked before `validate`), `formatValue`, `validate`, `isEditable`, `onCommit` (async). **`rowActions?: (row) => MenuEntry[]`** (2.6.0) appends a trailing ⋮ column that opens a `Menu` of per-row actions (clicks don't bubble to `onRowClick`). Card-list reflow at <480px container width. |
| **EditableCell** | `EditableCell`, `EditableCellType`, `EditableCellAlign`, `EditableCellSize`, `EditableCellValue`, `EditableCellOption`, `EditableCellProps` | Inline-editable cell: click to edit, Enter commits, Esc cancels, blur commits; async `onCommit` (reject → inline error), sync `validate`, `format`. `type: 'text' \| 'number' \| 'date' \| 'select' \| 'multiselect'`; value `string \| number \| string[]`. **number** editor is masked per keystroke (2.9.0: `type="text"` + `inputMode="decimal"` via NumberInput's `maskNumeric` — no native number input); **date** = masked input + Calendar hybrid (`dateFormat`, commits ISO); **select/multiselect** = `options` via Listbox/MultiListbox + `searchable`/`clearable`. (3.4.0) `required` / `requiredMessage` block an empty commit with a warning BEFORE `validate` runs (uniform across types); `searchable` now defaults to `'auto'` (was the raw Listbox `true`), matching the `Select` atom; multiselect stages its picks and commits once when the panel closes, so "clear all → pick one" never trips the required rule. Truncated values reveal via HoverTooltip. Problems surface in a Popover-anchored compact Banner. Standalone or via DataTable columns. `size: 'small' \| 'medium'` — `small` (default) is the dense table scale (font falls back to inherited `1em`); `medium` steps up to the input-family scale (12/6 padding, 14px font) for standalone use in side panels / detail views. Symmetric per-size theming: `--uxm-editable-cell-{small\|medium}-{padding-x,padding-y,font-size,max-width}`; height always derives from font-size + padding (`1lh` floor keeps empty cells clickable; the old un-namespaced dimension vars incl. min-height are gone). `clearable` now also covers text/number/date — a ✕ inside the editing input (draft-only clear, focus kept, commit still via Enter/blur; date's ✕ sits inboard of the calendar toggle). `required` never hides a clear affordance — clearing a required cell surfaces the required warning, an optional one empties to the placeholder. ⚠️ `clearable` now **defaults to `true`** (input-family convention; was opt-in) — pass `false` / `editorClearable: false` to opt out. **Pickers clear from the field too**: alongside the dropdown-footer Clear, a clearable select/multiselect renders a ✕ on the trigger inboard of the chevron, revealed only while the panel is open, out of the tab order, committing `''` / `[]` directly. **Open pickers wear the editing chrome** — while the panel is open the trigger paints the same card surface + accent border + focus halo as the text/number/date editing input (same `--uxm-editable-cell-input-*` vars), so "being edited" reads identically across all five editor types. **The width cap is per size**: `small` keeps the 320px cap (a long value truncates instead of pushing its table column), `medium` has **no** cap and fills its container like any input-family field; knobs are `--uxm-editable-cell-{small\|medium}-max-width`. ⚠️ the shared `--uxm-editable-cell-max-width` is retired — a pre-split saved override no longer applies and must be re-saved per size. **The value colour is pinned, not inherited**: `--uxm-editable-cell-color` (fallback `--color-text`), so a muted column / dimmed row no longer bleeds into the cell; font-size still inherits by design. |
| **Disclosure** | `Disclosure`, `DisclosureProps` | Expand/collapse panel. |
| **Icon** | `Icon`, `IconProps`, `ICONS`, `ICON_OPTIONS`, `getIcon`, `IconDef` | SVG by `glyph` id from the registry. Props: `glyph` (required), `size` (default **24**), `strokeWidth` (default **1.75**). Inherits `currentColor`. **Returns `null` for an unknown glyph — it fails silently, so only use ids from the registry below.** |
| **IconTile** | `IconTile`, `IconTileProps` | Square coloured tile holding an Icon; used as a visual anchor in headers/rows. |
| **List / ListItem** | `List`, `ListItem`, `ListProps`, `ListItemProps` | Vertical list container + item. ListItem polymorphs to div/button/anchor based on `interactive` / `href`. |
| **MetaRow** | `MetaRow`, `MetaRowProps` | Dot-separated inline metadata strip. |
| **PropertyField / PropertyGrid** | `PropertyField`, `PropertyGrid`, `PropertyFieldProps`, `PropertyGridProps` | Label/value pair + responsive grid of them. ⚠️ **`PropertyField`'s value is `children`, not a `value` prop** — `<PropertyField label="Total" value={x} />` silently renders an empty cell; use `<PropertyField label="Total">{x}</PropertyField>`. `PropertyGrid` has **no `columns` / `minColumnWidth` props** — its grid template is fixed (`repeat(auto-fill, minmax(120px, 1fr))`); only the gaps are themable (`--uxm-property-grid-{column,row}-gap`). |
| **StatCard** | `StatCard`, `StatCardTrend`, `StatCardProps` | Label + headline value + trend chip (up/down/neutral). |
| **Thumbnail** | `Thumbnail`, `ThumbnailFit`, `ThumbnailProps` | Square image frame with icon fallback. |
| **TimelineEntry** | `TimelineEntry`, `TimelineDotState`, `TimelineEntryProps` | Single rail + dot + card row; `lineBefore` / `lineAfter` toggles. |
| **TypeOverviewCard** | `TypeOverviewCard`, `TypeOverviewCardProps` | Icon tile + label + value + hover-revealed trailing + accent stripe. |

## Icon glyph registry (all 64 ids)

`<Icon glyph="…">` returns **`null`** for anything not in this list — no error, no warning, just a
missing icon. There is deliberately no `dashboard`, `folder`, `package`, `external`, `chart`,
`shopping-cart` or `home`; reaching for those is the most common generation mistake. Verify against
`ICONS.map(i => i.id)` (or `ICON_OPTIONS`, from `@viax/uxm/ui`) if you suspect the set has grown.

```
archive-x  arrow-down  arrow-left  arrow-right  arrow-up  arrow-up-right  bell  bolt
business-interaction  calendar  chat-bubble  check  check-circle  chevron-down  chevron-left
chevron-right  chevron-up  clock  close  cloud-arrow-up  code  cog-6-tooth  copy
cursor-arrow-rays  dock-bottom  dock-right  document  drag-handle  exclamation-circle
exclamation-triangle  eye  eye-slash  eyedropper  filter  globe  grid  history  image  info
kebab  list  list-lines  menu  minus  model-business-interaction  model-configuration
model-determination  model-revenue-motion  moon  organization  paint-brush  pencil  plus
product  question-mark-circle  refresh  save  search  settings  sparkle  square  sun  trash  user
```

Substitutions for the ids people reach for but that don't exist:

| Wanted | Use |
|---|---|
| `dashboard` / `home` | `grid` |
| `folder` / `package` / catalog / product list | `list-lines` |
| `external` / open-in-new | `arrow-up-right` |
| A real business transaction / order / invoice | `business-interaction` — the literal transaction glyph |
| A model/blueprint node representing a business interaction TYPE (e.g. a data-model diagram) | `model-business-interaction` (chat-bubble mark) — distinct from the glyph above |
| A company / organization entity | `organization` |
| A product / SKU / catalog item entity | `product` |
| settings / admin | `cog-6-tooth` (or `settings`) |
| error / failure | `exclamation-triangle`, `exclamation-circle` |
| light / dark toggle | `sun` / `moon` |
| overflow ⋮ menu | `kebab` |

`Icon` defaults to `size={24}`. Inside `InputWithIcon` the slot reserves **16px** via padding only
(see the InputWithIcon row above) — clamp the SVG in global CSS rather than passing `size={16}` at
every call site:

```css
.uxm-input-with-icon__icon svg { width: 16px; height: 16px; }
```

## Overlays & pickers (shared infrastructure)

The shared building blocks behind every dropdown / popover in the library. Reach for these
directly when no higher-level picker fits; otherwise prefer `Select` / `SearchDropdown` /
`PillSelect`, which compose them.

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **Popover** | `Popover`, `PopoverPlacement`, `PopoverProps` | Portal'd floating panel anchored to a ref: positioning + flip-on-overflow, click-outside, Escape, focus restore. `anchor` (RefObject), `placement` (default `bottom-start`), `matchAnchorWidth` (`boolean \| 'min'` — `'min'` floors at anchor width but grows to content), `minWidth`, `maxWidth`, `closeOnEscape`, `closeOnOutsideClick`, `restoreFocus`, `role`. Controlled via `open` / `onOpenChange`. First-open positioning resolves correctly even when mounted already-open. |
| **Listbox** | `Listbox`, `ListboxProps`, `ListboxRenderTriggerState`, `ListboxRenderItemState`, `ListboxTriggerProps`, `SEARCHABLE_AUTO_THRESHOLD` | Single-select dropdown panel, generic over item shape: keyboard nav (Arrow/Home/End/Enter), ARIA listbox/option roles, ✓ on the selected row. `searchable?: boolean \| 'auto'` (`'auto'` reveals search past `SEARCHABLE_AUTO_THRESHOLD` = 6; default true), `maxPanelWidth` (caps width; long labels truncate). Consumer owns the trigger via `renderTrigger={({ open, triggerProps }) => …}`. Panel theming is the SHARED surface every picker inherits. |
| **MultiListbox** | `MultiListbox`, `MultiListboxProps` | Multi-select sibling: `value: T[]`, row checkboxes (`showCheckbox`), optional `excludeSelected` (picked items leave the list). (3.4.0) `commitMode?: 'change' \| 'close'` — `'change'` (default, unchanged behaviour) fires `onChange` per toggle; `'close'` stages picks in an internal draft and fires ONCE on close (for commit-boundary editors like EditableCell). `required` / `requiredMessage` / `onRequiredViolation` own the "empty set is invalid" rule for every picker — staged mode blocks the empty commit, live mode allows it; either way the message is reported, never rendered, by the atom. `footer` gains `({ close, clear, selected })` so a "Clear all" can empty the working set without closing; style it with the shared `.uxm-listbox__footer-clear-option`. |

## Configuration editor (MODO-specific)

These are tuned for the MODO brand-settings editor and similar config UIs. Don't use them in
end-user apps.

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **ConfigComponentRow** | `ConfigComponentRow`, `ConfigComponentRowProps` | Middle-pane row in MODO's config UI. Root is a `<div>` wrapping an inner select `<button>`; optional `actions` slot holds hover/focus-revealed `IconButton`s as siblings of the button (not nested). |
| **SegmentRow** | `SegmentRow`, `SegmentRowProps` | Segment header — drag · accent line · expand chevron · name · count badge. Building block. |
| **SegmentCard** | `SegmentCard`, `SegmentCardProps` | Container for a nested segment — SegmentRow header + divider + inset body. The compositional segment-tree container. |
| **ComponentRow** | `ComponentRow`, `ComponentRowProps` | Config field row — drag · type-icon badge · optional chevron · name · type label. Building block. |
| **OptionList** | `OptionList`, `OptionListProps`, `OptionListItem` | Indented list of options under a Predefined-Options component (drag · bullet · name). Building block. |
| **ConfigSegmentItem** | `ConfigSegmentItem`, `ConfigSegmentItemProps` | Left-pane segment row with `aria-pressed`. |
| **ExplorerListItem** | `ExplorerListItem`, `ExplorerListItemProps` | Tree explorer row. |
| **ExplorerSection** | `ExplorerSection`, `ExplorerSectionProps` | Collapsible explorer section. |

## Lifecycle diagrams

Visual-only primitives for rendering lifecycle / state-machine diagrams. The parent canvas owns
positioning and a11y.

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **LifecycleConnector** | `LifecycleConnector`, `LifecycleConnectorProps`, `LifecycleConnectorState`, `LifecycleConnectorRouting` | SVG edge; idle / active / dashed; `routing` auto / straight / bezier / orthogonal elbow. |
| **LifecycleDropSlot** (unreleased) | `LifecycleDropSlot`, `LifecycleDropSlotProps`, `LifecycleDropSlotShape` | Dashed drag slot, `card` / `pill`. One appearance — it exists only while it's the target. `interactive` defaults to false. Width is the consumer's. |
| **LifecycleEdgeLabel** | `LifecycleEdgeLabel`, `LifecycleEdgeLabelProps`, `LifecycleEdgeLabelVariant` | Midpoint pill: `true` / `false` / `neutral`. |
| **LifecycleGroupBox** (unreleased) | `LifecycleGroupBox`, `LifecycleGroupBoxProps` | Frosted frame around one group's sibling nodes; `interactive` + `target` make it a drop zone. Members are siblings, not children. |
| **LifecycleMinimap** | `LifecycleMinimap`, `LifecycleMinimapProps`, `LifecycleMinimapNode`, `LifecycleMinimapViewport` | Birds-eye 0–1 canvas overview + optional viewport overlay. |
| **LifecycleNodeCard** | `LifecycleNodeCard`, `LifecycleNodeCardProps`, `LifecycleNodeKind` | Kind-aware pill (`state` / `condition` / `task` / `interaction` — the last unreleased; steps vs the BI object). `--uxm-lifecycle-node-card-min-height` knob (default `0` = content-driven) sets an opt-in uniform-height floor for canvas layouts; the card sets `box-sizing: border-box` itself, so the value **is** the rendered height and connector geometry can key off it. Same box model applies to `--uxm-lifecycle-node-card-width` (default `280px` total, padding and border included). |
| **LifecycleTerminal** | `LifecycleTerminal`, `LifecycleTerminalProps` | Start/End marker pill. |
| **LifecycleZoomControl** | `LifecycleZoomControl`, `LifecycleZoomControlProps` | `−` / value / `+` cluster. |

## Pick-the-right-component cheatsheet

| User intent | Use |
|-------------|-----|
| Submit a form action | `ButtonPrimary` |
| Cancel / secondary action next to primary | `ButtonSecondary` or `ButtonTertiary` |
| Destructive action (Delete / Remove / Discard) | `ButtonDanger` (2.6.0) |
| Quiet text-first action inside a row | `InlineAction` |
| Action / overflow menu from a ⋮ (or any) trigger | `Menu` (2.6.0) — `role=menu`, runs an action (no held value) |
| Navigate within app | `Link` (`underline="hover"`) |
| Go back one level | `BackLink` |
| Icon-only action with tooltip | `ButtonIcon` (sets aria-label contract) |
| Boolean toggle | `ToggleSwitch` (binary on/off) or `Checkbox` (form field semantics) |
| Pick one from a few options | `RadioGroup` (≤5 options) or `Select` (more) |
| Pick one from a large list | `SearchDropdown` |
| Pick many from a large list | `PillSelect` (or `MultiListbox` with a custom trigger) |
| Pick a color (theme/brand token, style editor) | `ColorInput` (inline panel) or `ColorInputPopover` (swatch → popover) |
| Custom dropdown no picker covers | `Listbox` / `MultiListbox` + `renderTrigger` |
| Show error feedback near a field | the atom's own `error` prop (red border + message), not a banner |
| Show page-level / persistent status strip | `Banner` (stays until dismissed) |
| Transient after-the-fact feedback ("Saved", "Copied") | `toast.success(…)` — requires `<Toaster/>` at the app root |
| Confirm / form dialog over the page | `Dialog` + `Modal` (`Modal.Header/Body/Footer`) |
| Edit a value in place (table cell, rename) | `EditableCell` (or DataTable's `editable` columns) |
| Show small status near data | `Tag` (semantic colour) or `Badge` (count / dot) |
| Show categorical filters | `Chip` (`mode="filter"`) |
| Tabular data | `DataTable` (generic, typed columns) |
| Per-row actions in a table (⋮ menu) | `DataTable` `rowActions={(row) => MenuEntry[]}` (2.6.0; opens `Menu`) |
| Bulk actions on selected rows | `BulkActionBar` (2.6.0; "{N} selected · actions · × clear") |
| Vertical list of items | `List` + `ListItem` |
| Metric / KPI block | `StatCard` |
| Pair of label + value | `PropertyField` (single) or `PropertyGrid` (multiple) |
| Detail card of labelled EDITABLE rows (entity name/status/…) | `Card gap` + `Stack` + `FormField labelPosition="side" labelTint="muted"` + `EditableCell` |
| Caps "eyebrow" label above an editable field | `FormField labelVariant="overline"` (read-only metadata stays `PropertyField`) |
| Top page nav | `Tabs` (pill) or `TabsUnderline` (page-level) |
| App-level nav switching | `ViewSwitcher` (icon-only) or `FilterTabs` (text + count) |
| Empty list / no results | `EmptyState` |
| Loading (indeterminate, no ETA) | `Loader` (`variant: 'spinner' \| 'dots' \| 'bar'`) |
| Progress with a known % (upload, batch, steps) | `ProgressBar` (`variant: 'linear' \| 'ring'`, `value` 0–100) |
| Confirm-on-hover affordance | `Tooltip` (text) or `ContentTooltip` (rich card) |
| Reveal a truncated/clamped value on hover | `HoverTooltip` (`truncatedOnly` — only shows when overflowing) |
| Frame a group of sibling lifecycle nodes (and accept drops into it) | `LifecycleGroupBox` (unreleased) |
| Show where a dragged lifecycle node can land | `LifecycleDropSlot` (unreleased) |
