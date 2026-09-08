import type { ComponentDef } from '../../types';

export const pillSelectDef: ComponentDef = {
  id: 'pill-select',
  name: 'Pill Select',
  category: 'Composite',
  description: "Multi-select tag input. Selected values render as <Chip mode=\"input\"> (chip theming lives on the Chip atom's registry). This shell owns the field shape and state visuals — default / hover / focus / disabled — matching the input-text / input-with-icon family.",
  styleProperties: [
    // Field colors (per state). The visible field is `.uxm-pill-select__
    // field` — an inner div on the layout-only `.uxm-pill-select` root.
    // `backgroundColor` and `borderColor` are REAL_CSS_PROPS so they're
    // routed through `--uxm-pill-select-{bg,border-color}` via
    // PER_COMPONENT_MAPPING in save/route.ts (otherwise saves would land
    // on the layout wrapper and silently no-op). The per-state keys
    // (hoverBg, focusBorder, …) are custom names that route through the
    // kebab fallback path correctly.
    { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors', showWhen: { state: 'default' } },
    { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors', showWhen: { state: 'default' } },
    { key: 'placeholderColor', label: 'Placeholder', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors', showWhen: { state: 'default' } },
    { key: 'hoverBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors', showWhen: { state: 'hover' } },
    { key: 'hoverBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors', showWhen: { state: 'hover' } },
    { key: 'focusBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors', showWhen: { state: 'focus' } },
    { key: 'focusRing', label: 'Ring', control: 'color', defaultValue: 'var(--color-accent)', section: 'focusState', showWhen: { state: 'focus' } },
    // Disabled defaults intentionally match the default state — the
    // visible "disabled" signal comes from the chips inside (which
    // receive the forwarded `disabled` prop and render the Chip atom's
    // own muted palette) plus `cursor: not-allowed` and the field
    // being skipped in the tab order. Stacking an opacity dim on the
    // wrapper would double-dim the already-muted chips and ruin
    // readability, so opacity defaults to 1 — exposed as a knob if the
    // brand really wants a dimmed disabled treatment.
    { key: 'disabledBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors', showWhen: { state: 'disabled' } },
    { key: 'disabledBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors', showWhen: { state: 'disabled' } },
    { key: 'disabledOpacity', label: 'Opacity', control: 'slider', defaultValue: 1, min: 0.1, max: 1, step: 0.05, section: 'disabledState', showWhen: { state: 'disabled' } },
    // Error state — field-style atom (constrained picker), so it gets
    // the standard error surface: red border + bg on the inner `__field`,
    // plus the shared message knobs. errorBg / errorBorder paint the
    // field; errorColor + errorMessageSize theme the `__error-message`
    // below it. The latter two share keys with the rest of the input
    // family so the editor's "Match in N Inputs" sync links them. All
    // four kebab through the fallback path to `--uxm-pill-select-error-*`
    // (declared on the root, cascade down to `__field`). `colors` section
    // for bg/border matches the other per-state field colors above.
    { key: 'errorBg', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors', showWhen: { state: 'error' } },
    { key: 'errorBorder', label: 'Border', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'colors', showWhen: { state: 'error' } },
    { key: 'errorColor', label: 'Label + Message', control: 'color', defaultValue: 'var(--color-danger-text)', section: 'errorState', showWhen: { state: 'error' } },
    { key: 'errorMessageSize', label: 'Message Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'errorState', showWhen: { state: 'error' } },
    // Shape (universal, no showWhen). Keys `radius` and `chipGap` are
    // deliberately NOT named `borderRadius` / `gap` (which would land
    // in REAL_CSS_PROPS and emit plain CSS on the root); the field-
    // radius lives on the inner `__field`, and `chipGap` is the field's
    // flex gap. `paddingX` / `paddingY` ARE REAL_CSS_PROPS — routed via
    // PER_COMPONENT_MAPPING so they land on `__field`, not the root.
    { key: 'radius', label: 'Field Radius', control: 'slider', defaultValue: 8, min: 0, max: 16, step: 1, unit: 'px' },
    { key: 'chipGap', label: 'Chip Gap', control: 'number', defaultValue: 6, min: 2, max: 12, step: 2, unit: 'px' },
    { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 10, min: 4, max: 24, step: 2, unit: 'px' },
    { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 8, min: 4, max: 20, step: 2, unit: 'px' },
    // Label rendering is the consumer's responsibility — the atom
    // doesn't own a `<label>` element. Preview-only label knobs
    // (labelColor, labelSize) were removed pending a project-wide
    // decision on label theming has now landed: FormField is the sole
    // owner. Wrap pill-select in `<FormField>` to add a label; this
    // atom is just the multi-select field. labelPosition variant was
    // removed here for the same reason — labels are FormField's concern.
  ],
  layoutVariants: [
    {
      key: 'state',
      label: 'State',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'hover', label: 'Hover' },
        { value: 'focus', label: 'Focus' },
        { value: 'disabled', label: 'Disabled' },
        { value: 'error', label: 'Error' },
      ],
      defaultValue: 'default',
    },
    // Chip layout variant — `inside` keeps chips inline within the
    // trigger (tag-input pattern); `below` puts them in a separate row
    // beneath the trigger (filter-bar pattern). Default `below` —
    // modern default, trigger stays a constant height. Consumers
    // wanting the classic compact "To:" tag-input switch to `inside`.
    {
      key: 'chipsPosition',
      label: 'Chips Position',
      options: [
        { value: 'below', label: 'Below' },
        { value: 'inside', label: 'Inside' },
      ],
      defaultValue: 'below',
    },
  ],
};
