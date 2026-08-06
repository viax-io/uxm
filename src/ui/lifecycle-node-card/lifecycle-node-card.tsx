import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';
import { IconTile } from '@/ui/icon-tile';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

// The kind modifier classes (`.uxm-lifecycle-node-card--state` etc.) set
// `--kind-icon-bg` and `--kind-icon-color` on the card. Those bridge to
// IconTile's own `--uxm-icon-tile-{bg,color}` so the kind-aware coloring
// continues to drive the icon tile after composition.
const ICON_TILE_STYLE: CSSProperties = {
  ['--uxm-icon-tile-bg' as string]: 'var(--kind-icon-bg)',
  ['--uxm-icon-tile-color' as string]: 'var(--kind-icon-color)',
  ['--uxm-icon-tile-size' as string]: 'var(--uxm-lifecycle-node-card-icon-size, 32px)',
  ['--uxm-icon-tile-radius' as string]: '6px',
};

export type LifecycleNodeKind = 'state' | 'condition' | 'task' | 'interaction';

// Drop the native HTML `title` attribute (a string, used for tooltips) — our
// `title` prop is the primary content (ReactNode). Tooltips can still be set
// via `aria-label` if needed.
export interface LifecycleNodeCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** What kind of step this node represents — drives the icon, label, and accent color. */
  kind: LifecycleNodeKind;
  /** Primary text — typically the node name (e.g. "In Cart", "Validate Price"). */
  title: ReactNode;
  /**
   * Trailing badge content — e.g. an action count for state nodes ("2"), or a
   * truncated condition expression for condition nodes ("$data.price > 100").
   * Hidden if not provided.
   */
  badge?: ReactNode;
  /** Override the kind label sub-text shown above the title. Defaults to humanised `kind`. */
  kindLabel?: ReactNode;
  /** Render the active/selected state. */
  active?: boolean;
}

const KIND_LABEL: Record<LifecycleNodeKind, string> = {
  state: 'State',
  condition: 'Condition',
  task: 'Task',
  interaction: 'Business Interaction',
};

// Map each node kind to its glyph in the Icon registry. Centralised so
// other lifecycle components share the exact same kind→glyph contract.
//
// `interaction` takes `business-interaction` (exchange arrows) rather than a
// clipboard: a clipboard reads as a checklist, which is what `task` already
// means, and the exchange mark is what the product uses for a BI in its sidebar
// and dashboard — so the canvas agrees with the rest of the app.
const KIND_GLYPH: Record<LifecycleNodeKind, string> = {
  state: 'check-circle',
  condition: 'question-mark-circle',
  task: 'cog-6-tooth',
  interaction: 'business-interaction',
};

function NodeIcon({ kind }: { kind: LifecycleNodeKind }) {
  return <Icon glyph={KIND_GLYPH[kind]} size={14} strokeWidth={1.5} />;
}

/**
 * The pill card used for each node on a BI lifecycle canvas. Four kinds — the
 * first three describe STEPS in a lifecycle, the fourth an OBJECT the lifecycle
 * runs on, which is why it gets its own kind instead of borrowing `state`'s
 * green checkmark with a substituted `kindLabel`:
 *
 *   `state`        — green accent · checkmark icon · optional action-count badge
 *   `condition`    — warm accent  · question icon  · optional expression badge
 *   `task`         — cool accent  · gear icon
 *   `interaction`  — green accent · exchange icon  · a Business Interaction
 *
 * `interaction` shares `state`'s green on purpose: a BI is marked green
 * everywhere else in the product, so the canvas keeps that. What separates the
 * two is the glyph and the label, not the tint.
 *
 * Visuals (icon tile color, accent stripe, default size) are driven by CSS
 * custom properties scoped to the kind modifier — see `.uxm-lifecycle-node-card--{kind}`
 * in styles.css. Override per-instance via `style` / className when needed.
 */
export function LifecycleNodeCard({
  kind,
  title,
  badge,
  kindLabel,
  active,
  className,
  ...rest
}: LifecycleNodeCardProps) {
  const containerStyle = rest.style as CSSProperties | undefined;
  return (
    <div
      {...rest}
      className={cn(
        'uxm-lifecycle-node-card',
        `uxm-lifecycle-node-card--${kind}`,
        active && 'uxm-lifecycle-node-card--active',
        className,
      )}
      style={containerStyle}
    >
      <IconTile style={ICON_TILE_STYLE} aria-hidden="true">
        <NodeIcon kind={kind} />
      </IconTile>
      <div className="uxm-lifecycle-node-card__body">
        <p className="uxm-lifecycle-node-card__kind">{kindLabel ?? KIND_LABEL[kind]}</p>
        <p className="uxm-lifecycle-node-card__title">{title}</p>
      </div>
      {badge != null && <span className="uxm-lifecycle-node-card__badge">{badge}</span>}
    </div>
  );
}
