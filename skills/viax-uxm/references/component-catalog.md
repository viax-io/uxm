# @viax/uxm — Component Catalog

All 88 components exported from `@viax/uxm/ui` (as of v3.1.1), grouped by intent. Use this file
to pick the right primitive when the `@viax/uxm` repo is not available locally. When it is, read
the per-component README at `src/ui/{name}/README.md` in the uxm repo
(`https://gitlab.viax.tech/services-viax/uxm`) for the full API
(note: atoms added in 1.1.0–2.0.0 — toast, dialog, modal, popover, listbox, banner,
editable-cell, field-error, number-stepper — may not have READMEs yet; read their `.tsx` JSDoc).

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
| **Checkbox** | `Checkbox`, `CheckboxProps` | Label-wrapped native input + custom box; controlled. `error?: string` (2.8.0) — sets `aria-invalid` + a FieldError message below; box/label stay neutral. |
| **ColorInput** | `ColorInput`, `ColorInputPopover`, `ColorFormat`, `ColorInputProps`, `ColorInputPopoverProps` | Color picker (2.10.0): saturation/brightness area, hue + opacity sliders, swatch, screen eyedropper (Chromium-only, auto-hidden), format select HEX/RGB/RGBA/HSL with a per-format value editor (hex text field, or R/G/B(/A) / H/S/L numeric fields). `outputFormat` (default `'hex'`; alpha<1 → `#rrggbbaa`) fixes what `onChange` returns — independent of the displayed representation; `formats` limits the select. Enter commits + `onEnter`, Esc reverts + `onEsc`; `ColorInputPopover` = swatch trigger + panel in a Popover, Enter/Esc also close it. |
| **CurrencyInput** | `CurrencyInput`, `CurrencyValue`, `CurrencyInputProps` | Left-aligned amount + currency picker with searchable popover, locale formatting. `clearable?: boolean` (**default `true`**) — self-clearing trailing ✕, no `onClear` (3.0.0, which also dropped `pickerPosition`). |
| **DateInput** | `DateInput`, `DateInputFormat`, `DateInputMode`, `DateInputProps` | Masked date field, single/range, formats `mdy`/`dmy`/`ymd`. Focusing the field opens the Calendar picker (type-or-pick). `clearable?: boolean` (**default `true`**) — self-clearing ✕ by the calendar icon, no `onClear` (3.0.0). |
| **FileUpload** | `FileUpload`, `FileUploadFileMeta`, `FileUploadState`, `FileStatus`, `FileUploadProps` | Drop area + per-file progress rows; controlled via state prop. Page-level error via `error?: string` (2.8.0; renamed from `errorMessage`, which stays a deprecated alias); per-file errors via `FileUploadFileMeta.errorMessage`. |
| **FieldError** | `FieldError`, `FieldErrorProps` | Shared error-message renderer (exclamation icon + text) used internally by every input atom's `error` prop. Pass the atom's own `uxm-{atom}__error-message` class; `id?: string` (2.9.0) lets the owning control reference it via `aria-describedby` — every input atom wires this automatically. Rarely used directly. |
| **FormField** | `FormField`, `FormFieldLabelPosition`, `FormFieldProps` | Label + optional help text wrapper. `position: 'top' \| 'side'`. **Owns label rendering** — atoms below render bare. Field errors live on the ATOM's `error` prop, not here. |
| **TextInput / Select / Textarea** | `TextInput`, `Select`, `Textarea`, `TextInputProps`, `SelectProps`, `TextareaProps` | Bare input/textarea atoms + Select. All three take `error?: string` (red border + `aria-invalid` + message below via FieldError). `TextInput` & `Textarea` have `clearable?: boolean` (**default `true`**) + optional `onClear` — a trailing ✕ that self-clears and fires `onChange('')` for free on any controlled field (2.7.0). Select is **Listbox-backed** (cross-browser panel, shared listbox theming) with a compatible native-like API: `<option>` children, `value`/`defaultValue`, `onChange(e.target.value)`; plus `searchable?: boolean \| 'auto'` (`'auto'` reveals the search box past 6 options; default). **Clearability is placeholder-driven** (3.0.0): include a placeholder `<option value="" disabled>` and the trigger shows a ✕ to reset to it — the standalone `clearable` prop was REMOVED. From `./input`. |
| **InputWithIcon** | `InputWithIcon`, `InputWithIconProps` | Text input with leading icon + optional clear ✕ (shared `uxm-field-clear` affordance). `error?: string` (2.9.0) — re-tones border/background/leading icon, `aria-invalid` + FieldError message below. |
| **NumberStepper** | `NumberStepper`, `NumberStepperProps` | Numeric input with ± steppers (composed IconButton) + optional unit suffix + `error`. Renamed from `NumberField` in 2.0.0. |
| **NumberInput** | `NumberInput`, `NumberInputProps` | Typing-only masked numeric input; supports decimal / negative. 2.9.0: `clearable?: boolean` (**default `true`**) — trailing ✕ that self-clears and fires `onChange('')`, no `onClear` (mirrors Select/DateInput); `error?: string` — red border + `aria-invalid` + FieldError message below. |
| **PasswordInput** | `PasswordInput`, `PasswordInputProps` | Masked password field with eye toggle. |
| **PhoneInput** | `PhoneInput`, `PhoneValue`, `PhoneInputProps` | Country picker + national number, searchable popover. `clearable?: boolean` (**default `true`**) — self-clearing ✕, no `onClear` (3.0.0). |
| **PillSelect** | `PillSelect`, `PillSelectProps` | Multi-select chip field backed by MultiListbox. `chipsPosition: 'inside'` (tag-input style) `\| 'below'` (compact "N selected" trigger, default); `error`. |
| **RadioGroup / RadioOption** | `RadioGroup`, `RadioOption`, `RadioGroupDirection`, `RadioGroupProps`, `RadioOptionProps` | Radio group with composable options. `direction: 'vertical' \| 'horizontal'`. `RadioGroup` takes `error?: string` (2.8.0) — `aria-invalid` + a group FieldError message below; circles/labels stay neutral. |
| **RangeSlider** | `RangeSlider`, `RangeSliderProps` | Dual-thumb range; shares slider styling. |
| **SearchDropdown** | `SearchDropdown`, `SearchDropdownOption`, `SearchDropdownProps` | Combobox: trigger + searchable Listbox panel; clear ✕ in the trigger; `error`. Thin wrapper over `Listbox` — panel theming flows from the shared listbox surface. |
| **Slider** | `Slider`, `SliderProps` | Native range input with gradient-painted progress. |
| **TimeInput** | `TimeInput`, `TimeInputFormat`, `TimeInputProps` | Masked HH:MM field, column-scroll picker popover (shared Popover shell), 24h or 12h, `minuteStep`, `error`. Focusing the field opens the picker (type-or-pick). `clearable?: boolean` (**default `true`**) — self-clearing ✕ inboard of the clock icon, no `onClear` (3.0.0). |
| **ToggleSwitch** | `ToggleSwitch`, `ToggleSwitchProps` | On/off toggle; thumb width derived from height. `error?: string` (2.8.0) — `aria-invalid` + a FieldError message below; track/label stay neutral. |

## Buttons & actions

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **ButtonPrimary / Secondary / Tertiary / Ghost / Danger** | `ButtonPrimary`, `ButtonSecondary`, `ButtonTertiary`, `ButtonGhost`, `ButtonDanger`, `ButtonProps` | Five button variants on native `<button>`. `type` defaults to `'button'`. **`ButtonDanger`** (2.6.0) is the outlined destructive variant for irreversible actions (Delete/Remove/Discard) — danger token trio, solid danger fill when pressed. From `./button`. |
| **ButtonGroup** | `ButtonGroup`, `ButtonGroupOption`, `ButtonGroupProps` | Segmented control. Controlled or uncontrolled. |
| **ButtonIcon** | `ButtonIcon`, `ButtonIconProps` | Square icon button with **required** `aria-label`. |
| **ButtonWithIcon** | `ButtonWithIcon`, `ButtonWithIconProps` | Bordered button with required `icon` slot + label. |
| **IconButton** | `IconButton`, `IconButtonProps` | Alternative icon-only button with SVG-controlling CSS vars. |
| **InlineAction** | `InlineAction`, `InlineActionProps` | 10px text-first button, muted → accent-bold on hover. Use for in-row affordances. |
| **Menu** (2.6.0) | `Menu`, `MenuProps`, `MenuItem`, `MenuSeparator`, `MenuEntry`, `MenuTriggerProps` | Action / dropdown menu on the headless `Popover` (`role="menu"`, arrow-key nav, separators, leading icons, trailing hints, `danger` rows). **No selected value / no checkmarks** — pick a row → run its action → dismiss (use `Listbox`/`Select` to HOLD a value). Consumer owns the trigger via `renderTrigger` (spread `triggerProps` on an `IconButton` ⋮, `Button`, …). `items: MenuEntry[]` where `MenuEntry = MenuItem ({ key, label, icon?, hint?, onSelect?, disabled?, danger? }) \| MenuSeparator ({ separator: true })`. Portaled panel; studio-themed on `.uxm-menu, .uxm-menu__panel`. From `./menu`. |
| **BackLink** | `BackLink`, `BackLinkProps` | Anchor with leading back-arrow icon. |
| **Link** | `Link`, `LinkUnderline`, `LinkProps` | Native `<a>` with `underline: 'hover' \| 'always' \| 'never'`; `external` adds arrow icon + safe `rel`. |

## Navigation

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **AppSidebar** | `AppSidebar`, `AppSidebarBrand`, `AppSidebarSection`, `AppSidebarNavItem`, `AppSidebarProps` | App-shell left sidebar with brand + nav sections. |
| **AppTopBar** | `AppTopBar`, `AppTopBarProps` | App-shell top bar; translucent bg via `color-mix`. |
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
| **EmptyState** | `EmptyState`, `EmptyStateProps` | Icon + title + body for empty lists / no-results. |
| **ErrorPage** | `ErrorPage`, `ErrorPageProps` | Full-page error layout (zero `--uxm-*` knobs; tokens only). |
| **Loader** | `Loader`, `LoaderVariant`, `LoaderLayout`, `LoaderProps` | Spinner / dots / bar, optional `|`-separated cycling messages. ⚠ Does not honour `prefers-reduced-motion`. |
| **ProgressBar** | `ProgressBar`, `ProgressBarVariant`, `ProgressBarProps` | Determinate progress (0–100%) — companion to `Loader` when the fraction done is known (uploads, batch ops). `value` (clamped 0–100), `variant: 'linear' \| 'ring'` (linear track+fill or CSS conic-gradient ring, no SVG), `label` (caption + accessible name), `valueText` (override `${round}%`). `role="progressbar"` + aria-valuenow/min/max. Theming via `--uxm-progress-bar-*`. From `./progress-bar` (2.7.0). |
| **Tag** | `Tag`, `TagType`, `TagSize`, `TagProps` | Semantic label; 6 types × 2 sizes; presentational. |
| **Tooltip / ContentTooltip** | `Tooltip`, `ContentTooltip`, `TooltipPlacement`, `TooltipProps`, `ContentTooltipProps` | Dark bubble + arrow / card popover. Render-only, no positioning. |
| **HoverTooltip** | `HoverTooltip`, `HoverTooltipProps` | Behavior layer `Tooltip` lacks: hover trigger (owned `openDelay`) + optional truncation gate (`truncatedOnly` — only reveals when the wrapped element overflows) + `Popover` positioning/portal, rendering `Tooltip` inside. Wraps a single child `ReactElement`; `content`, `placement: 'top' \| 'bottom'`, `disabled`, `showArrow`. Non-interactive (closes on pointer-leave). Use to reveal clamped table/cell values. |
| **BulkActionBar** (2.6.0) | `BulkActionBar`, `BulkActionBarProps`, `BulkAction` | Floating toolbar shown once rows are selected: "{N} selected · actions · × clear". Presentational — the consumer owns `selectedKeys` state and positions it (fixed/sticky); pairs with `DataTable` selection. `count: number`, `actions?: BulkAction[]` (`{ key, label, icon?, danger?, disabled?, onClick? }`), `onClear?` (renders the ×), `countLabel?: (count) => ReactNode`, `style?`. From `./bulk-action-bar`. |

## Layout & structure

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **Card** | `Card`, `CardProps` | Minimal surface; `shadow` boolean. |
| **Cluster** | `Cluster`, `ClusterProps` | Flex-row layout: `align` / `justify` / `wrap` / `gap`. **No tokens read.** |
| **DetailSection** | `DetailSection`, `DetailSectionProps` | Title + icon-tile + content section. |
| **Divider** | `Divider`, `DividerProps` | Horizontal rule, optional inline label. |
| **InlineFilter** | `InlineFilter`, `InlineFilterProps` | 3-slot layout: `search` / `filters` / `trailing`. **No tokens read.** |
| **PageHeader** | `PageHeader`, `PageHeaderProps` | Icon-tile + title + meta + actions row. |
| **PageShell** | `PageShell`, `PageShellVariant`, `PageShellProps` | Sidebar + topBar + content chrome. `variant: 'standard' \| 'canvas'`. |
| **ResponsiveGrid** | `ResponsiveGrid`, `ResponsiveGridProps` | Breakpoint-free `auto-fit` + `minmax(min, 1fr)`. **No tokens read.** |
| **SectionHeader** | `SectionHeader`, `SectionHeaderProps` | Uppercase `<h4>` with optional trailing + subtitle. |
| **SideFlexpane** | `SideFlexpane`, `SideFlexpaneProps` | Right-docked resizable `<aside>` with ARIA separator. |
| **Stack** | `Stack`, `StackProps` | Flex-column with `gap` + `align`. **No tokens read.** |

## Data display

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **Avatar** | `Avatar`, `AvatarType`, `AvatarProps` | Image / text-fallback circle. |
| **DataTable** | `DataTable`, `DataTableColumn`, `DataTableDensity`, `DataTableProps` | Generic typed table. `density: 'compact' \| 'default' \| 'relaxed'`. Per-column `render`, `align`, `key`, `maxWidth` (ellipsis clamp; capped plain cells auto-wrap in HoverTooltip), plus inline editing: `editable`, `editor: EditableCellType` (`text`/`number`/`date`/`select`/`multiselect`), `dateFormat`, `editorOptions`, `editorSearchable`, `editorClearable`, `formatValue`, `validate`, `isEditable`, `onCommit` (async). **`rowActions?: (row) => MenuEntry[]`** (2.6.0) appends a trailing ⋮ column that opens a `Menu` of per-row actions (clicks don't bubble to `onRowClick`). Card-list reflow at <480px container width. |
| **EditableCell** | `EditableCell`, `EditableCellType`, `EditableCellAlign`, `EditableCellValue`, `EditableCellOption`, `EditableCellProps` | Inline-editable cell: click to edit, Enter commits, Esc cancels, blur commits; async `onCommit` (reject → inline error), sync `validate`, `format`. `type: 'text' \| 'number' \| 'date' \| 'select' \| 'multiselect'`; value `string \| number \| string[]`. **number** editor is masked per keystroke (2.9.0: `type="text"` + `inputMode="decimal"` via NumberInput's `maskNumeric` — no native number input); **date** = masked input + Calendar hybrid (`dateFormat`, commits ISO); **select/multiselect** = `options` via Listbox/MultiListbox + `searchable`/`clearable`. Truncated values reveal via HoverTooltip. Problems surface in a Popover-anchored compact Banner. Standalone or via DataTable columns. |
| **Disclosure** | `Disclosure`, `DisclosureProps` | Expand/collapse panel. |
| **Icon** | `Icon`, `IconProps`, `ICONS`, `ICON_OPTIONS`, `getIcon`, `IconDef` | SVG by `glyph` id from the registry. Inherits `currentColor`. Returns `null` for unknown glyphs. |
| **IconTile** | `IconTile`, `IconTileProps` | Square coloured tile holding an Icon; used as a visual anchor in headers/rows. |
| **List / ListItem** | `List`, `ListItem`, `ListProps`, `ListItemProps` | Vertical list container + item. ListItem polymorphs to div/button/anchor based on `interactive` / `href`. |
| **MetaRow** | `MetaRow`, `MetaRowProps` | Dot-separated inline metadata strip. |
| **PropertyField / PropertyGrid** | `PropertyField`, `PropertyGrid`, `PropertyFieldProps`, `PropertyGridProps` | Label/value pair + responsive grid of them. |
| **StatCard** | `StatCard`, `StatCardTrend`, `StatCardProps` | Label + headline value + trend chip (up/down/neutral). |
| **Thumbnail** | `Thumbnail`, `ThumbnailFit`, `ThumbnailProps` | Square image frame with icon fallback. |
| **TimelineEntry** | `TimelineEntry`, `TimelineDotState`, `TimelineEntryProps` | Single rail + dot + card row; `lineBefore` / `lineAfter` toggles. |
| **TypeOverviewCard** | `TypeOverviewCard`, `TypeOverviewCardProps` | Icon tile + label + value + hover-revealed trailing + accent stripe. |

## Overlays & pickers (shared infrastructure)

The shared building blocks behind every dropdown / popover in the library. Reach for these
directly when no higher-level picker fits; otherwise prefer `Select` / `SearchDropdown` /
`PillSelect`, which compose them.

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **Popover** | `Popover`, `PopoverPlacement`, `PopoverProps` | Portal'd floating panel anchored to a ref: positioning + flip-on-overflow, click-outside, Escape, focus restore. `anchor` (RefObject), `placement` (default `bottom-start`), `matchAnchorWidth` (`boolean \| 'min'` — `'min'` floors at anchor width but grows to content), `minWidth`, `maxWidth`, `closeOnEscape`, `closeOnOutsideClick`, `restoreFocus`, `role`. Controlled via `open` / `onOpenChange`. First-open positioning resolves correctly even when mounted already-open. |
| **Listbox** | `Listbox`, `ListboxProps`, `ListboxRenderTriggerState`, `ListboxRenderItemState`, `ListboxTriggerProps`, `SEARCHABLE_AUTO_THRESHOLD` | Single-select dropdown panel, generic over item shape: keyboard nav (Arrow/Home/End/Enter), ARIA listbox/option roles, ✓ on the selected row. `searchable?: boolean \| 'auto'` (`'auto'` reveals search past `SEARCHABLE_AUTO_THRESHOLD` = 6; default true), `maxPanelWidth` (caps width; long labels truncate). Consumer owns the trigger via `renderTrigger={({ open, triggerProps }) => …}`. Panel theming is the SHARED surface every picker inherits. |
| **MultiListbox** | `MultiListbox`, `MultiListboxProps` | Multi-select sibling: `value: T[]`, row checkboxes (`showCheckbox`), optional `excludeSelected` (picked items leave the list). |

## Configuration editor (MODO-specific)

These are tuned for the MODO brand-settings editor and similar config UIs. Don't use them in
end-user apps.

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **ConfigComponentRow** | `ConfigComponentRow`, `ConfigComponentRowProps` | Middle-pane row in MODO's config UI. |
| **ConfigSegmentItem** | `ConfigSegmentItem`, `ConfigSegmentItemProps` | Left-pane segment row with `aria-pressed`. |
| **ExplorerListItem** | `ExplorerListItem`, `ExplorerListItemProps` | Tree explorer row. |
| **ExplorerSection** | `ExplorerSection`, `ExplorerSectionProps` | Collapsible explorer section. |

## Lifecycle diagrams

Visual-only primitives for rendering lifecycle / state-machine diagrams. The parent canvas owns
positioning and a11y.

| Component | Key exports | What it is |
|-----------|-------------|------------|
| **LifecycleConnector** | `LifecycleConnector`, `LifecycleConnectorProps`, `LifecycleConnectorState` | SVG edge; idle / active / dashed; auto straight or Bezier. |
| **LifecycleEdgeLabel** | `LifecycleEdgeLabel`, `LifecycleEdgeLabelProps`, `LifecycleEdgeLabelVariant` | Midpoint pill: `true` / `false` / `neutral`. |
| **LifecycleMinimap** | `LifecycleMinimap`, `LifecycleMinimapProps`, `LifecycleMinimapNode`, `LifecycleMinimapViewport` | Birds-eye 0–1 canvas overview + optional viewport overlay. |
| **LifecycleNodeCard** | `LifecycleNodeCard`, `LifecycleNodeCardProps`, `LifecycleNodeKind` | Kind-aware pill (`state` / `condition` / `task`). |
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
| Top page nav | `Tabs` (pill) or `TabsUnderline` (page-level) |
| App-level nav switching | `ViewSwitcher` (icon-only) or `FilterTabs` (text + count) |
| Empty list / no results | `EmptyState` |
| Loading (indeterminate, no ETA) | `Loader` (`variant: 'spinner' \| 'dots' \| 'bar'`) |
| Progress with a known % (upload, batch, steps) | `ProgressBar` (`variant: 'linear' \| 'ring'`, `value` 0–100) |
| Confirm-on-hover affordance | `Tooltip` (text) or `ContentTooltip` (rich card) |
| Reveal a truncated/clamped value on hover | `HoverTooltip` (`truncatedOnly` — only shows when overflowing) |
