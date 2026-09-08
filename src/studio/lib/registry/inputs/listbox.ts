import type { ComponentDef } from '../../types';

export const listboxDef: ComponentDef = {
  id: 'listbox',
  name: 'Listbox (Dropdown Panel)',
  category: 'Inputs',
  description: "Shared dropdown panel used by every select / picker in the app (SearchDropdown, PhoneInput country, CurrencyInput, PillSelect, native Select replacement, ColorPicker). The atom is generic over item shape — consumers pass items + a renderItem and own the trigger entirely. This entry themes the PANEL only: chrome, search input, option rows + states, group headers, empty state, footer. Trigger / field theming lives on each consuming component's own registry entry.",
  styleProperties: [
    // Panel chrome — the floating card.
    { key: 'panelBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'panel' },
    { key: 'panelBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'panel' },
    { key: 'panelRadius', label: 'Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px', section: 'panel' },
    // Drop shadow — decomposed into Color / Blur / Offset Y (colour picker
    // + sliders) instead of a raw box-shadow text field. Same pattern as
    // the Calendar / Menu atoms; the box-shadow is composed from these
    // three vars in listbox.scss.
    { key: 'shadowColor', label: 'Color', control: 'color', defaultValue: 'rgba(0, 0, 0, 0.10)', section: 'shadow' },
    { key: 'shadowBlur', label: 'Blur', control: 'slider', defaultValue: 20, min: 0, max: 48, step: 1, unit: 'px', section: 'shadow' },
    { key: 'shadowOffsetY', label: 'Offset Y', control: 'slider', defaultValue: 6, min: 0, max: 24, step: 1, unit: 'px', section: 'shadow' },
    { key: 'panelMaxHeight', label: 'Max Height', control: 'number', defaultValue: 320, min: 120, max: 600, step: 20, unit: 'px', section: 'panel' },

    // Search input — only meaningful when the consumer enables search.
    { key: 'searchBorder', label: 'Divider', control: 'color', defaultValue: 'var(--color-border)', section: 'search', showWhen: { withSearch: 'yes' } },
    { key: 'searchIconColor', label: 'Icon', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'search', showWhen: { withSearch: 'yes' } },
    { key: 'searchColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'search', showWhen: { withSearch: 'yes' } },
    { key: 'searchPlaceholderColor', label: 'Placeholder', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'search', showWhen: { withSearch: 'yes' } },
    { key: 'searchFontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 10, max: 18, step: 1, unit: 'px', section: 'search', showWhen: { withSearch: 'yes' } },

    // Option row — sizing knobs apply across all states. The shared
    // (always-visible) section keeps padding / font / radius next to
    // the state-specific colours so they're easy to find.
    { key: 'optionPaddingX', label: 'Padding X', control: 'number', defaultValue: 10, min: 4, max: 20, step: 1, unit: 'px', section: 'option' },
    { key: 'optionPaddingY', label: 'Padding Y', control: 'number', defaultValue: 6, min: 2, max: 14, step: 1, unit: 'px', section: 'option' },
    { key: 'optionFontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px', section: 'option' },
    { key: 'optionRadius', label: 'Radius', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px', section: 'option' },

    // Per-state colour knobs — scoped by `state` variant so only the
    // knobs relevant to the currently-displayed showcase state are
    // visible. Matches the search-dropdown / select-dropdown / input-text
    // convention. State labels in showWhen match the variant `value`
    // strings ("default" / "active" / "selected" / "selected-active" /
    // "disabled"). Default state has no row background of its own — the
    // panel bg shows through — so only the text colour is exposed there.
    // Default state — bg + text. Bg defaults to transparent so the
    // panel chrome shows through (the common case); tune it if you
    // want every row to have its own surface (e.g. striped rows).
    { key: 'optionDefaultBg', label: 'Background', control: 'color', defaultValue: 'transparent', section: 'optionState', showWhen: { state: 'default' } },
    { key: 'optionColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'optionState', showWhen: { state: 'default' } },

    // "Hover" state covers both mouse hover and keyboard arrow-key
    // highlight — they paint the same modifier class (`--active`)
    // because the atom keeps them visually equivalent. Registry key
    // names stay `optionActive*` to match the CSS class + var
    // namespace; the workbench label is "Hover" because that's the
    // term designers use.
    { key: 'optionActiveBg', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'optionState', showWhen: { state: 'hover' } },
    { key: 'optionActiveColor', label: 'Text', control: 'color', defaultValue: 'var(--color-text)', section: 'optionState', showWhen: { state: 'hover' } },

    { key: 'optionSelectedBg', label: 'Background', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'optionState', showWhen: { state: 'selected' } },
    { key: 'optionSelectedColor', label: 'Text', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'optionState', showWhen: { state: 'selected' } },

    { key: 'optionDisabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 0.4, min: 0.1, max: 1, step: 0.05, section: 'optionState', showWhen: { state: 'disabled' } },

    // Group headers — only meaningful when the consumer groups items.
    { key: 'groupHeaderFontSize', label: 'Font Size', control: 'number', defaultValue: 10, min: 9, max: 14, step: 1, unit: 'px', section: 'groupHeader', showWhen: { withGroups: 'yes' } },
    { key: 'groupHeaderColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'groupHeader', showWhen: { withGroups: 'yes' } },

    // Empty-state line (e.g. "No matches").
    { key: 'emptyColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'empty' },

    // Footer divider — only shown when a consumer passes a footer slot
    // (ColorPicker's custom-hex panel).
    { key: 'footerBorder', label: 'Divider', control: 'color', defaultValue: 'var(--color-border)', section: 'footer', showWhen: { withFooter: 'yes' } },

    // No "Selection Indicator" knobs — the atom decides the pattern
    // (single-select → right-edge ✓ on selected, multi-select → left
    // checkboxes on every row). The right-edge ✓ inherits the row's
    // `--selected` text colour (tune via Selected → Text). The
    // checkbox marker reads `--uxm-checkbox-*` (tune via the Checkbox
    // atom). No new tuning surface here.
  ],
  layoutVariants: [
    {
      // Which state's classes to apply to the static showcase row at
      // the top of the preview. The interactive instance below is
      // always live — hover / keyboard / selection exercise the real
      // CSS rules independently. This picker is purely for VISUAL
      // confirmation of the per-state knobs (active bg, selected
      // bg/color, disabled opacity) — without it you'd have to hover
      // / click the interactive instance to verify each state.
      key: 'state',
      label: 'Row State',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'hover', label: 'Hover' },
        { value: 'selected', label: 'Selected' },
        { value: 'disabled', label: 'Disabled' },
      ],
      defaultValue: 'default',
    },
    {
      key: 'withSearch',
      label: 'Search Input',
      options: [
        { value: 'yes', label: 'On' },
        { value: 'no', label: 'Off' },
      ],
      defaultValue: 'yes',
    },
    {
      key: 'withGroups',
      label: 'Group Headers',
      options: [
        { value: 'no', label: 'Off' },
        { value: 'yes', label: 'On' },
      ],
      defaultValue: 'no',
    },
    {
      key: 'withFooter',
      label: 'Footer Slot',
      options: [
        { value: 'no', label: 'Off' },
        { value: 'yes', label: 'On' },
      ],
      defaultValue: 'no',
    },
    {
      // Wrap a long list into up to two balanced columns to roughly halve
      // the panel height. Drives `--uxm-listbox-list-columns` on the list
      // in the preview; a real consumer sets the `columns` prop. The count
      // is a max (each column keeps a min width, so a narrow panel falls
      // back to one) — try it with Group Headers on to see headers span.
      // One vs two — deeper columns get unusable in a dropdown.
      key: 'columns',
      label: 'Columns',
      options: [
        { value: '1', label: 'One' },
        { value: '2', label: 'Two' },
      ],
      defaultValue: '1',
    },
    {
      // Which atom the interactive preview mounts. The indicator
      // pattern is decided by the atom, not by the workbench:
      //   - `Listbox` (single)   → right-edge ✓ on the selected row
      //   - `MultiListbox` (multi) → left-edge checkbox on every row
      // The static showcase above respects this too — single mode
      // shows the right-✓ when `state=selected`; multi mode shows
      // checkboxes on the row regardless of state.
      key: 'mode',
      label: 'Selection',
      options: [
        { value: 'single', label: 'Single' },
        { value: 'multi', label: 'Multi' },
      ],
      defaultValue: 'single',
    },
    // Multi-only — the Checkboxes variant shows the with/without
    // indicator design choice for multi-select panels. `excludeSelected`
    // (hide picked items from the list) is intentionally NOT exposed
    // — it's a consumer-level decision baked into atoms like
    // PillSelect, not a panel-design choice designers should tune.
    // `showWhen: { mode: "multi" }` keeps it out of single mode.
    {
      key: 'showCheckbox',
      label: 'Checkboxes',
      options: [
        { value: 'on', label: 'On' },
        { value: 'off', label: 'Off' },
      ],
      defaultValue: 'on',
      showWhen: { mode: 'multi' },
    },
  ],
  events: [
    { name: 'onChange', description: 'Fires when the user picks an option (click or Enter). Multi-select toggles items in/out of the array.', payload: 'T (single) | T[] (multi)' },
    { name: 'onOpenChange', description: 'Fires when the panel opens or closes.', payload: 'boolean' },
  ],
  api: {
    importPath: '@viax/uxm/ui',
    importNames: ['Listbox', 'MultiListbox'],
    props: [
      { name: 'items', type: 'T[]', required: true, description: "Source data — the listbox is generic over T and has no knowledge of what's inside." },
      { name: 'getKey', type: '(item: T) => string', required: true, description: 'Stable React key per item.' },
      { name: 'getLabel', type: '(item: T) => string', required: true, description: 'Plain text used for default substring filter and a11y.' },
      { name: 'value', type: 'T | null  // Listbox\nT[]         // MultiListbox', required: true, description: 'Current selection.' },
      { name: 'onChange', type: '(item: T | null) => void  // Listbox — null when consumer clears\n(items: T[]) => void        // MultiListbox — empty array when cleared', required: true, description: 'Selection callback. Listbox passes null when the consumer wires up a clear affordance (e.g. ✕ in their renderTrigger). MultiListbox passes an empty array when all selections are cleared.' },
      { name: 'renderTrigger', type: '(state: { open, selected, triggerProps }) => ReactNode', required: true, description: "Render the consumer's trigger. Spread `triggerProps` on a button — that wires ref + click + ARIA in one go." },
      { name: 'renderItem', type: '(item: T, state: { active, selected }) => ReactNode', required: true, description: 'Render each row body — the atom owns layout + states; consumer owns visuals (icon, flag, swatch, etc.).' },
      { name: 'searchable', type: 'boolean | "auto"', defaultValue: 'true', description: 'Show a search input above the list. `"auto"` reveals it only once the option count exceeds the shared threshold (6) — the one place that rule lives, so every Listbox-backed picker shares it.' },
      { name: 'filterItems', type: '(items: T[], query: string) => T[]', description: 'Override the default case-insensitive substring filter on `getLabel`.' },
      { name: 'groupBy', type: '(item: T) => string', description: 'Group items under section headers in declared order.' },
      { name: 'columns', type: '1 | 2', defaultValue: '1', description: 'Wrap a long list into up to two balanced columns to roughly halve the panel height. Rows keep source order down column one then continue in column two, so arrow-key nav still reads naturally. A max, not a fixed count — each column keeps a min width (--uxm-listbox-list-column-min-width), so a narrow panel falls back to one column instead of cramping; widen the panel (wider anchor or matchAnchorWidth={false} + minPanelWidth) to reveal the second. Works with groupBy — headers span full width above each group.' },
      { name: 'footer', type: 'ReactNode', description: "Slot below the list (e.g. ColorPicker's custom hex panel)." },
      { name: 'isItemDisabled', type: '(item: T) => boolean', description: 'Mark individual items inert (not selectable, skipped by keyboard nav).' },
      { name: 'placement', type: '"bottom-start" | "bottom-end" | "top-start" | "top-end"', defaultValue: '"bottom-start"', description: 'Preferred placement; flips on overflow.' },
      { name: 'matchAnchorWidth', type: 'boolean', defaultValue: 'true', description: "Match the positioning anchor's width (the trigger by default, or `anchorRef` if provided)." },
      { name: 'anchorRef', type: 'RefObject<HTMLElement | null>', description: "Override what the popover positions / sizes against. Defaults to the trigger element. Use when the trigger is a small affordance inside a larger field (e.g. PhoneInput's country button inside the phone field)." },
      { name: 'showCheckmark', type: 'boolean', defaultValue: 'true', description: 'Listbox only — show the right-edge ✓ on the selected row. Set to `false` when row content already has trailing meta (dial codes, currency codes) that would compete for the right edge.' },
      { name: 'portal', type: 'boolean', defaultValue: 'true', description: 'Mount the panel into document.body — escapes clipping parents.' },
      { name: 'excludeSelected', type: 'boolean', defaultValue: 'true', description: 'MultiListbox only — hide items already in `value` from the panel.' },
    ],
  },
};
