import type { ComponentDef } from '../../types';

export const formFieldDef: ComponentDef = {
  id: 'form-field',
  name: 'Form Field',
  category: 'Forms',
  description: 'Sole owner of label theming for the form family. Pairs a label with any UXM input (TextInput, Select, ToggleSwitch, etc.); optional hint line below. `labelPosition` flips between top (column stack) and side (grid layout).',
  styleProperties: [
    // Per-tint label colours — the Label Tint VARIANT (below) picks which
    // tint a field uses; these knobs define what each tint looks like.
    // One knob per tint, gated to the active tint so the panel reads
    // "Per Label Tint · <value>". Tints apply to both label variants
    // (default + overline) — the variant owns typography, the tint colour.
    { key: 'tintStrongColor', label: 'Label Color', control: 'color', defaultValue: 'var(--color-text-strong)', section: 'colors', showWhen: { labelTint: 'strong' } },
    { key: 'tintDefaultColor', label: 'Label Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors', showWhen: { labelTint: 'default' } },
    { key: 'tintMutedColor', label: 'Label Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors', showWhen: { labelTint: 'muted' } },
    // Typography — per label variant. The overline variant owns only its
    // size here (weight/letter-spacing stay token-level).
    { key: 'labelSize', label: 'Label Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px', showWhen: { labelVariant: 'default' } },
    { key: 'labelWeight', label: 'Label Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600'], showWhen: { labelVariant: 'default' } },
    { key: 'overlineSize', label: 'Label Size', control: 'number', defaultValue: 11, min: 9, max: 16, step: 1, unit: 'px', showWhen: { labelVariant: 'overline' } },
    // Hint — its own section, shared across every variant/tint (no showWhen
    // anywhere in it, so the panel labels it "Shared").
    { key: 'hintColor', label: 'Hint Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'hint' },
    { key: 'hintSize', label: 'Hint Size', control: 'number', defaultValue: 12, min: 10, max: 16, step: 1, unit: 'px', section: 'hint' },
    // Label Gap — top-layout-specific. Lives in its own `topLayout`
    // section parallel to `sideLayout`, so the default STYLE section
    // contains only truly-shared knobs (labelSize, weight, hintSize,
    // hintGap) instead of getting polluted with a per-position knob.
    // Top and side layouts use the gap for visually different
    // distances (vertical vs horizontal), so each owns its own value.
    { key: 'gap', label: 'Label Gap', control: 'number', defaultValue: 8, min: 2, max: 32, step: 1, unit: 'px', section: 'topLayout', showWhen: { labelPosition: 'top' } },
    { key: 'hintGap', label: 'Hint Gap', control: 'number', defaultValue: 2, min: 0, max: 12, step: 1, unit: 'px', section: 'hint' },
    // Side-layout only: width of the label column. Gated on
    // labelPosition=side because it has no effect in top layout.
    { key: 'sideLabelWidth', label: 'Side Label Width', control: 'number', defaultValue: 120, min: 60, max: 240, step: 4, unit: 'px', section: 'sideLayout', showWhen: { labelPosition: 'side' } },
    // Side-layout only: horizontal gap between the label column and
    // the input column. Separate from the top-layout `gap` knob since
    // horizontal label-input distance is visually different from
    // vertical (and brands often want different values for each).
    { key: 'sideGap', label: 'Label Gap', control: 'number', defaultValue: 16, min: 2, max: 48, step: 1, unit: 'px', section: 'sideLayout', showWhen: { labelPosition: 'side' } },
    // Side-layout only: alignment of the label text within the label
    // column. Default "start" (left in LTR) puts label text at the
    // column's left edge — reads naturally with the eye flowing
    // left-to-right into the input. "end" (right) is the alternative
    // for projects that prefer labels flush against the input.
    { key: 'sideLabelAlign', label: 'Side Label Align', control: 'select', defaultValue: 'start', options: ['start', 'end'], section: 'sideLayout', showWhen: { labelPosition: 'side' } },
    // Vertical alignment of the label within its grid cell. Default "center"
    // matches the grid's `align-items: center`; "start" top-aligns the label
    // next to a tall control (radio group / checkbox list).
    { key: 'sideLabelValign', label: 'Side Label V-Align', control: 'select', defaultValue: 'center', options: ['center', 'start', 'end'], section: 'sideLayout', showWhen: { labelPosition: 'side' } },
  ],
  layoutVariants: [
    // Local labelPosition variant (top / side). Floating is intentionally
    // omitted — it requires absolute positioning + state-driven CSS
    // (:has(:not(:placeholder-shown))) that doesn't work with non-input
    // children like Select or PillSelect. Top + side cover the layout
    // shapes that work uniformly with every input atom.
    {
      key: 'labelPosition',
      label: 'Label Position',
      options: [
        { value: 'top', label: 'Top' },
        { value: 'side', label: 'Side' },
      ],
      defaultValue: 'top',
    },
    // Label typography variant. `overline` is the caps "eyebrow" style —
    // typography only; colour comes from the Label Tint below.
    {
      key: 'labelVariant',
      label: 'Label Variant',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'overline', label: 'Overline' },
      ],
      defaultValue: 'default',
    },
    // Label Tint — which semantic colour preset the field uses. Applies to
    // both label variants; each tint's colour is a knob gated to the active
    // tint ("Per Label Tint · <value>").
    {
      key: 'labelTint',
      label: 'Label Tint',
      options: [
        { value: 'strong', label: 'Strong' },
        { value: 'default', label: 'Default' },
        { value: 'muted', label: 'Muted' },
      ],
      defaultValue: 'strong',
    },
  ],
};
