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
