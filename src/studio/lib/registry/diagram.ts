import type { ComponentDef } from '../types';

export const diagramDefs: ComponentDef[] = [
  // ── Diagram (BI Lifecycle) ──
  {
    id: 'lifecycle-node-card',
    name: 'Lifecycle Node Card',
    category: 'Diagram',
    description: 'State / Condition / Task node card used in the BI Lifecycle canvas.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 12, min: 6, max: 24, step: 2, unit: 'px' },
      { key: 'width', label: 'Width', control: 'number', defaultValue: 280, min: 200, max: 360, step: 10, unit: 'px' },
      { key: 'minHeight', label: 'Min Height', control: 'number', defaultValue: 0, min: 0, max: 120, step: 2, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 32, min: 24, max: 48, step: 2, unit: 'px' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 14, min: 11, max: 18, step: 1, unit: 'px' },
      { key: 'kindSize', label: 'Kind Label Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'type',
        label: 'Node Type',
        options: [
          { value: 'state', label: 'State' },
          { value: 'condition', label: 'Condition' },
          { value: 'task', label: 'Task' },
        ],
        defaultValue: 'state',
      },
    ],
    events: [
      { name: 'onClick', description: 'Fires when the user clicks the node card. Typically opens an inspector or selects the node.', payload: 'MouseEvent' },
    ],
  },
  {
    id: 'lifecycle-terminal',
    name: 'Lifecycle Terminal',
    category: 'Diagram',
    description: "Start / End pill used as the graph's terminal nodes.",
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 20, step: 1, unit: 'px' },
      { key: 'width', label: 'Width', control: 'number', defaultValue: 60, min: 40, max: 120, step: 4, unit: 'px' },
      { key: 'height', label: 'Height', control: 'number', defaultValue: 32, min: 20, max: 48, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600', '700'] },
    ],
    layoutVariants: [
      {
        key: 'label',
        label: 'Label',
        options: [
          { value: 'Start', label: 'Start' },
          { value: 'End', label: 'End' },
        ],
        defaultValue: 'Start',
      },
    ],
  },
  {
    id: 'lifecycle-edge-label',
    name: 'Lifecycle Edge Label',
    category: 'Diagram',
    description: 'Pill label attached to a transition edge (true / false / custom).',
    styleProperties: [
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 3, min: 0, max: 10, step: 1, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 999, min: 4, max: 999, step: 1, unit: 'px' },
      { key: 'borderWidth', label: 'Border Width', control: 'number', defaultValue: 1, min: 0, max: 3, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 9, max: 16, step: 1, unit: 'px' },
      { key: 'fontWeight', label: 'Font Weight', control: 'select', defaultValue: '500', options: ['400', '500', '600', '700'] },
    ],
    layoutVariants: [
      {
        key: 'variant',
        label: 'Variant',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' },
          { value: 'neutral', label: 'Custom / Neutral' },
        ],
        defaultValue: 'true',
      },
    ],
  },
  {
    id: 'lifecycle-plus-button',
    name: 'Lifecycle Plus Button',
    category: 'Diagram',
    description: 'Floating circular + button used to insert a node on a canvas edge.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors' },
      { key: 'hoverBackgroundColor', label: 'Hover Background', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'color', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-inverse)', section: 'colors' },
      { key: 'size', label: 'Size', control: 'number', defaultValue: 24, min: 16, max: 40, step: 2, unit: 'px' },
      { key: 'iconSize', label: 'Icon Size', control: 'number', defaultValue: 14, min: 8, max: 24, step: 1, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'lifecycle-connector',
    name: 'Lifecycle Connector',
    category: 'Diagram',
    description: 'Edge between two nodes — idle / hovered stroke, thickness, arrow, dashed variant, and straight / Bezier / elbow routing.',
    styleProperties: [
      // Paint is scoped to the State picker — one Color / Stroke Width pair
      // that follows the selected state, rather than three parallel knobs of
      // which two are inert at any moment. Keys keep their `connector*` prefix
      // so themes saved before this regrouping still resolve.
      { key: 'connectorIdleColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-subtle)', section: 'states', showWhen: { state: 'idle' } },
      { key: 'connectorIdleStrokeWidth', label: 'Stroke Width', control: 'slider', defaultValue: 1.5, min: 0.5, max: 4, step: 0.5, unit: 'px', section: 'states', showWhen: { state: 'idle' } },
      { key: 'connectorActiveColor', label: 'Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'states', showWhen: { state: 'active' } },
      { key: 'connectorActiveStrokeWidth', label: 'Stroke Width', control: 'slider', defaultValue: 2, min: 0.5, max: 5, step: 0.5, unit: 'px', section: 'states', showWhen: { state: 'active' } },
      { key: 'connectorDashedColor', label: 'Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'states', showWhen: { state: 'dashed' } },
      { key: 'connectorDashedStrokeWidth', label: 'Stroke Width', control: 'slider', defaultValue: 1.5, min: 0.5, max: 4, step: 0.5, unit: 'px', section: 'states', showWhen: { state: 'dashed' } },
      // Only read when the state is dashed, so it belongs with that state's
      // paint rather than in the shared section.
      { key: 'connectorDashPattern', label: 'Dash Pattern', control: 'text', defaultValue: '6 4', section: 'states', showWhen: { state: 'dashed' } },
      { key: 'connectorArrowSize', label: 'Arrow Size', control: 'number', defaultValue: 7, min: 3, max: 14, step: 1, unit: 'px' },
      // No knobs for `crossAt` / `cornerRadius` on purpose. Where an elbow's
      // cross bus sits is per-edge geometry — the same kind of value as
      // `from` / `to` — so it belongs to the diagram's layout code, not to a
      // saved theme. They stay props.
    ],
    layoutVariants: [
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'idle', label: 'Idle' },
          { value: 'active', label: 'Active' },
          { value: 'dashed', label: 'Dashed (false)' },
        ],
        defaultValue: 'idle',
      },
      {
        key: 'routing',
        label: 'Routing',
        options: [
          { value: 'auto', label: 'Auto' },
          { value: 'straight', label: 'Straight' },
          { value: 'bezier', label: 'Bezier' },
          { value: 'orthogonal', label: 'Elbow' },
        ],
        defaultValue: 'auto',
      },
      {
        key: 'startDot',
        label: 'Start Dot',
        options: [
          { value: 'on', label: 'On' },
          { value: 'off', label: 'Off' },
        ],
        defaultValue: 'on',
      },
    ],
  },
  {
    id: 'lifecycle-connector-knobs',
    name: 'Lifecycle Connector Knobs',
    category: 'Diagram',
    description: 'Pair of insert (+) and rename (pencil) circles that appear when hovering a connector.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Circle Fill', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'size', label: 'Diameter', control: 'number', defaultValue: 22, min: 16, max: 36, step: 1, unit: 'px' },
      { key: 'borderWidth', label: 'Border Width', control: 'number', defaultValue: 1.5, min: 0.5, max: 3, step: 0.5, unit: 'px' },
      { key: 'insertBorderColor', label: 'Insert Border', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors' },
      { key: 'insertIconColor', label: 'Insert Icon', control: 'color', defaultValue: 'var(--color-accent)', section: 'colors' },
      { key: 'editBorderColor', label: 'Edit Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'editIconColor', label: 'Edit Icon', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'gap', label: 'Gap Between Knobs', control: 'number', defaultValue: 4, min: 0, max: 16, step: 1, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'orientation',
        label: 'Orientation',
        options: [
          { value: 'horizontal', label: 'Horizontal' },
          { value: 'vertical', label: 'Vertical' },
        ],
        defaultValue: 'horizontal',
      },
    ],
  },
  {
    id: 'lifecycle-drop-slot',
    name: 'Lifecycle Drop Slot',
    category: 'Diagram',
    description:
      'Dashed slot showing where a dragged node can land — card-sized for a node, pill-sized for the group a drop would mint.',
    styleProperties: [
      // Knob keys stay the plain CSS-ish names — no `dropSlot*` prefix, which
      // the generator would turn into `--uxm-lifecycle-drop-slot-drop-slot-*`
      // (the lifecycle-connector trap).
      //
      // Dashes and label are separate knobs sharing one default, so they read as
      // one signal until someone deliberately moves them apart. Both default to
      // `var(--color-accent-bold)` rather than the `--color-drop-target` alias —
      // the alias isn't a `themeTokens` entry, so the picker would render its raw
      // var string, and accent (what the alias resolves to) measures 1.92:1 as
      // ink on this fill.
      { key: 'borderColor', label: 'Dashes', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'color', label: 'Text', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      // A LIVE token, not a raw expression: `themeTokens` is what the picker's
      // swatch list is built from, so a `color-mix(…)` default would render as
      // unreadable text. The fill is flat, so what is picked here is what paints.
      { key: 'bg', label: 'Fill', control: 'color', defaultValue: 'var(--color-accent-subtle)', section: 'colors' },
      // Style + width are the two levers on how the edge reads, the same pair
      // FileUpload's drop area exposes. Neither is a dash PATTERN — the UA
      // derives dash length from the width, and CSS has no property for the
      // pattern itself.
      //
      // Both apply to either shape, so they stay in the unscoped section — the
      // panel then subtitles them "Shared across all shapes" while the two shape
      // sections below read "Per Shape · …". Mixing them into one section is what
      // made the group box's panel claim shared knobs were per-state.
      { key: 'borderStyle', label: 'Border Style', control: 'select', defaultValue: 'dashed', options: ['dashed', 'solid', 'dotted'] },
      { key: 'borderWidth', label: 'Border Width', control: 'number', defaultValue: 1, min: 1, max: 3, step: 1, unit: 'px' },
      // Card-only. Labels drop the "Card" prefix — the section heading carries
      // it, and short labels don't truncate in the narrow panel orientation.
      { key: 'cardRadius', label: 'Radius', control: 'slider', defaultValue: 10, min: 0, max: 20, step: 1, unit: 'px', section: 'card', showWhen: { shape: 'card' } },
      { key: 'cardPaddingX', label: 'Padding X', control: 'number', defaultValue: 16, min: 4, max: 32, step: 2, unit: 'px', section: 'card', showWhen: { shape: 'card' } },
      { key: 'cardFontSize', label: 'Font Size', control: 'number', defaultValue: 12, min: 9, max: 16, step: 1, unit: 'px', section: 'card', showWhen: { shape: 'card' } },
      { key: 'cardMinWidth', label: 'Min Width', control: 'number', defaultValue: 72, min: 40, max: 160, step: 4, unit: 'px', section: 'card', showWhen: { shape: 'card' } },
      // No card HEIGHT knob: that one is shared with the node card through the
      // token layer, so it isn't per-component. The atom does expose
      // `--uxm-lifecycle-drop-slot-card-min-height` for a canvas that owns node
      // geometry and needs to zero the floor — a consumer escape hatch, not a
      // theme value, so it gets no knob either.
      //
      // Pill-only. Same 4–999 range LifecycleEdgeLabel uses for its own pill
      // radius: everything at or above half the height reads as a full pill, so
      // the useful travel is the bottom of the slider.
      { key: 'pillRadius', label: 'Radius', control: 'slider', defaultValue: 999, min: 4, max: 999, step: 1, unit: 'px', section: 'pill', showWhen: { shape: 'pill' } },
      { key: 'pillPaddingY', label: 'Padding Y', control: 'number', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px', section: 'pill', showWhen: { shape: 'pill' } },
      { key: 'pillPaddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 4, max: 24, step: 1, unit: 'px', section: 'pill', showWhen: { shape: 'pill' } },
      // 13 matches Chip assist (`--uxm-chip-assist-font-size`), which is what the
      // real group pill is drawn with, so the placeholder doesn't change size on
      // drop.
      { key: 'pillFontSize', label: 'Font Size', control: 'number', defaultValue: 13, min: 10, max: 16, step: 1, unit: 'px', section: 'pill', showWhen: { shape: 'pill' } },
    ],
    layoutVariants: [
      // The preview renders the SELECTED shape only. A picker that left both on
      // canvas would be a control that changes nothing there — the same reason
      // `interactive` gets no knob (it moves hit-testing only, never a pixel, and
      // the canvas has no drag to demonstrate it with). It stays a prop,
      // documented in the README.
      {
        key: 'shape',
        label: 'Shape',
        // Named for what the slot stands in for — the node a drop would create,
        // or the group it would mint — not for a pixel size. "node-sized" read
        // as a dimension and obscured that.
        options: [
          { value: 'card', label: 'Card (node)' },
          { value: 'pill', label: 'Pill (group)' },
        ],
        defaultValue: 'card',
      },
    ],
    events: [
      { name: 'onDragOver', description: 'Fires while a dragged node is over the slot. Requires interactive; call preventDefault to accept the drop.', payload: 'DragEvent' },
      { name: 'onDrop', description: 'Fires when a node is dropped on the slot. The consumer creates the node or group; the atom carries no logic.', payload: 'DragEvent' },
      { name: 'onDragLeave', description: "Fires when the drag leaves the slot — the consumer's cue to unmount it, since the slot exists only while it is the target.", payload: 'DragEvent' },
    ],
  },
  {
    id: 'lifecycle-group-box',
    name: 'Lifecycle Group Box',
    category: 'Diagram',
    description:
      'Frosted frame around the sibling nodes of one group — and, on an editable diagram, the drop zone for adding a member to it.',
    styleProperties: [
      // Knob keys are the ordinary CSS-ish names every other atom uses
      // (`backgroundColor`, `borderWidth`, …), deliberately NOT prefixed with
      // the component's own name: `groupBoxBg` under id `lifecycle-group-box`
      // would have the generator emit
      // `--uxm-lifecycle-group-box-group-box-bg`. That doubling is exactly what
      // happened to lifecycle-connector, whose published themes now need a
      // permanent fallback alias.
      // Both colour knobs default to a LIVE token, not to the literal CSS the
      // rule resolves to: `themeTokens` is what the editor's swatch list is
      // built from, so a raw `color-mix(…)` / `var(--color-drop-target)` string
      // renders as unreadable text in the picker instead of a named colour.
      // The atom applies its own 55% frost around this value (see the
      // stylesheet), which is why Card — the frosted colour — is the honest
      // default here rather than the mix.
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderWidth', label: 'Border Width', control: 'number', defaultValue: 1, min: 0, max: 4, step: 1, unit: 'px' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 14, min: 0, max: 28, step: 1, unit: 'px' },
      // The group's single spacing number: the canvas insets its members by it
      // AND derives the box rect from it, so there is one knob rather than a
      // box padding and a member inset that can drift apart. The inset ring is
      // internal and deliberately not exposed.
      { key: 'padding', label: 'Padding', control: 'number', defaultValue: 20, min: 8, max: 40, step: 2, unit: 'px' },
      { key: 'blur', label: 'Backdrop Blur', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
      // The state-scoped knobs get their OWN section, the way
      // lifecycle-connector's do. Mixed into `colors` / `style` they dragged
      // those whole sections into a "Per State · Drop target" subtitle — the
      // panel derives it from every prop in a section — which claimed the
      // Background, Padding and Radius above were per-state when they are
      // shared. Split out, each section states the truth: Colors / Style read
      // "Shared across all states", and only this one is per-state. It also
      // disappears entirely on `default`, since the panel builds its sections
      // from VISIBLE props.
      //
      // The section is named for what it themes ("Drop Outline") so the three
      // labels can stay one word each. Prefixing them instead — Outline Color /
      // Outline Width / Outline Offset — reads as the same set but pays for it
      // in ellipses: the panel truncates a label around 13 characters in its
      // narrow orientation, so `Outline Offset` arrives as "Outline O…". One
      // word in the heading beats the same word truncated three times.
      //
      // `var(--color-accent)` rather than `var(--color-drop-target)`: the alias
      // isn't a `themeTokens` entry (deliberately — see tokens/index.css), so
      // the picker would show the raw var string, and the two resolve to the
      // same colour anyway. The CSS chain is still knob → alias → accent, so a
      // consumer who re-points the alias changes the paint without this
      // default following.
      { key: 'targetColor', label: 'Color', control: 'color', defaultValue: 'var(--color-accent)', section: 'dropOutline', showWhen: { state: 'target' } },
      { key: 'targetWidth', label: 'Width', control: 'slider', defaultValue: 2, min: 1, max: 5, step: 1, unit: 'px', section: 'dropOutline', showWhen: { state: 'target' } },
      { key: 'targetOffset', label: 'Offset', control: 'number', defaultValue: 2, min: 0, max: 8, step: 1, unit: 'px', section: 'dropOutline', showWhen: { state: 'target' } },
    ],
    layoutVariants: [
      // A State picker, like lifecycle-connector's, rather than a "Drop Target"
      // On/Off: the panel builds its section subtitles out of the variant LABEL
      // ("Per {label}" when scoped, "Shared across all {label}s" otherwise), and
      // "Shared across all drop targets" was actively misleading on the plain
      // style knobs — they are shared across STATES, and there is one box, not
      // many targets.
      //
      // There is no `interactive` picker: that prop moves hit-testing only,
      // never a pixel, and a variant that changes nothing on the canvas reads
      // as a broken toggle. It stays a prop, documented in the README.
      {
        key: 'state',
        label: 'State',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'target', label: 'Drop target' },
        ],
        defaultValue: 'default',
      },
    ],
    events: [
      { name: 'onDragOver', description: 'Fires while a dragged node is over the group. Requires interactive; call preventDefault to accept the drop.', payload: 'DragEvent' },
      { name: 'onDragEnter', description: 'Fires when a drag enters the group — the consumer\'s cue to set `target`.', payload: 'DragEvent' },
      { name: 'onDragLeave', description: 'Fires when a drag leaves the group — clear `target` here.', payload: 'DragEvent' },
      { name: 'onDrop', description: 'Fires when a node is dropped on the group. The consumer adds the member; the atom carries no logic.', payload: 'DragEvent' },
    ],
  },
  {
    id: 'lifecycle-zoom-control',
    name: 'Lifecycle Zoom Control',
    category: 'Diagram',
    description: 'Segmented −/percent/+ zoom control docked at the canvas corner.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 20, step: 1, unit: 'px' },
      { key: 'buttonSize', label: 'Button Size', control: 'number', defaultValue: 32, min: 24, max: 48, step: 2, unit: 'px' },
      { key: 'fontSize', label: 'Value Size', control: 'number', defaultValue: 13, min: 10, max: 18, step: 1, unit: 'px' },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'iconColor', label: 'Icon Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
    ],
    layoutVariants: [],
  },
  {
    id: 'lifecycle-minimap',
    name: 'Lifecycle Minimap',
    category: 'Diagram',
    description: 'Miniature graph overview with a viewport indicator.',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-surface-alt)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 6, min: 0, max: 16, step: 1, unit: 'px' },
      { key: 'nodeColor', label: 'Node Color', control: 'color', defaultValue: 'var(--color-text-muted)', section: 'colors' },
      { key: 'edgeColor', label: 'Edge Color', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'viewportBorder', label: 'Viewport Border', control: 'color', defaultValue: 'var(--color-accent-bold)', section: 'colors' },
      { key: 'viewportFill', label: 'Viewport Fill', control: 'color', defaultValue: 'color-mix(in srgb, var(--color-accent) 10%, transparent)', section: 'colors' },
      { key: 'width', label: 'Width', control: 'number', defaultValue: 240, min: 160, max: 320, step: 10, unit: 'px' },
      { key: 'height', label: 'Height', control: 'number', defaultValue: 104, min: 60, max: 200, step: 4, unit: 'px' },
    ],
    layoutVariants: [],
  },
  {
    id: 'lifecycle-action-row',
    name: 'Lifecycle Action Row',
    category: 'Diagram',
    description: 'Row with a type badge + action name + delete — used inside the node flexpane.',
    styleProperties: [
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 4, min: 0, max: 12, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 12, min: 6, max: 24, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 10, min: 4, max: 20, step: 2, unit: 'px' },
      { key: 'gap', label: 'Gap', control: 'number', defaultValue: 10, min: 4, max: 20, step: 1, unit: 'px' },
      { key: 'fontSize', label: 'Text Size', control: 'number', defaultValue: 13, min: 10, max: 16, step: 1, unit: 'px' },
      { key: 'color', label: 'Text Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
      { key: 'badgeRadius', label: 'Badge Radius', control: 'slider', defaultValue: 999, min: 4, max: 999, step: 1, unit: 'px' },
      { key: 'badgeSize', label: 'Badge Text Size', control: 'number', defaultValue: 11, min: 9, max: 14, step: 1, unit: 'px' },
    ],
    layoutVariants: [
      {
        key: 'actionType',
        label: 'Action Type',
        options: [
          { value: 'notify', label: 'Notify' },
          { value: 'transform', label: 'Transform' },
          { value: 'validate', label: 'Validate' },
        ],
        defaultValue: 'notify',
      },
    ],
  },
  {
    id: 'modal',
    name: 'Modal',
    category: 'Feedback',
    description:
      'Standard modal panel — header / body / footer slots — rendered inside the Dialog shell. Theming knobs live here; backdrop styling is global (tokens).',
    styleProperties: [
      { key: 'backgroundColor', label: 'Background', control: 'color', defaultValue: 'var(--color-card)', section: 'colors' },
      { key: 'borderColor', label: 'Border', control: 'color', defaultValue: 'var(--color-border)', section: 'colors' },
      { key: 'borderRadius', label: 'Border Radius', control: 'slider', defaultValue: 12, min: 0, max: 24, step: 1, unit: 'px' },
      { key: 'paddingX', label: 'Padding X', control: 'number', defaultValue: 20, min: 8, max: 40, step: 2, unit: 'px' },
      { key: 'paddingY', label: 'Padding Y', control: 'number', defaultValue: 16, min: 8, max: 32, step: 2, unit: 'px' },
      { key: 'titleSize', label: 'Title Size', control: 'number', defaultValue: 16, min: 12, max: 24, step: 1, unit: 'px' },
      { key: 'titleColor', label: 'Title Color', control: 'color', defaultValue: 'var(--color-text)', section: 'colors' },
    ],
    layoutVariants: [
      {
        key: 'size',
        label: 'Size',
        options: [
          { value: 'sm', label: 'Small (360px)' },
          { value: 'md', label: 'Medium (480px)' },
          { value: 'lg', label: 'Large (640px)' },
          { value: 'fullscreen', label: 'Fullscreen' },
        ],
        defaultValue: 'md',
      },
    ],
    api: {
      importPath: '@viax/uxm/ui',
      importNames: ['Dialog', 'Modal'],
      props: [
        { name: 'open', type: 'boolean', required: true, description: 'Dialog open state (controlled). Pair with onOpenChange.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', required: true, description: 'Called when the user requests close (Escape or backdrop click).' },
        { name: 'size', type: '"sm" | "md" | "lg" | "fullscreen"', defaultValue: '"md"', description: 'Modal panel width preset.' },
        { name: 'onClose', type: '() => void', description: 'When set, Modal.Header renders a close X that calls this.' },
        { name: 'closeOnEscape', type: 'boolean', defaultValue: 'true', description: 'Escape key dismisses the dialog.' },
        { name: 'closeOnOutsideClick', type: 'boolean', defaultValue: 'true', description: 'Backdrop click dismisses the dialog.' },
        { name: 'initialFocus', type: 'RefObject<HTMLElement>', description: 'Element to focus on open. Defaults to first focusable in panel.' },
      ],
    },
  },
];
