import { cn } from '@/helpers';
import { Icon } from '@/ui/icon';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export interface ComponentRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Leading type-icon glyph, shown inside the coloured badge — typically `<Icon glyph="…" />`. */
  icon?: ReactNode;
  /** Component display name (primary text). */
  name: ReactNode;
  /** Type label shown to the right (e.g. "Predefined Options", "Text", "Number"). */
  type?: ReactNode;
  /**
   * Show a leading expand chevron before the name — used for expandable
   * component types (e.g. Predefined Options). Default `false`.
   */
  chevron?: boolean;
  /** Expanded state for the chevron direction (when `chevron`). Default `false`. */
  open?: boolean;
  /**
   * Badge background / foreground. In MODO these come from the per-type
   * visual dictionary at runtime; pass them here to tint the badge. Default to
   * the neutral token surface via CSS variables when omitted.
   */
  iconBg?: string;
  iconColor?: string;
  /** Show a leading drag-handle affordance (visual only; wire your own DnD). */
  dragHandle?: boolean;
  /** Trailing action controls, revealed on row hover / focus. */
  actions?: ReactNode;
}

/**
 * A single configuration component (field) row: drag handle, a coloured
 * type-icon badge, an optional leading chevron (for expandable types like
 * Predefined Options), the component name, and a type label.
 *
 * Every colour/dimension reads a `--uxm-component-row-*` custom property (with
 * a token fallback) so the UXM studio knobs re-theme it.
 */
export function ComponentRow({
  icon,
  name,
  type,
  chevron = false,
  open = false,
  iconBg,
  iconColor,
  dragHandle = false,
  actions,
  className,
  style,
  ...rest
}: ComponentRowProps) {
  const badgeStyle: CSSProperties | undefined =
    iconBg || iconColor
      ? ({
          ...(iconBg ? { ['--uxm-component-row-icon-badge-bg' as string]: iconBg } : {}),
          ...(iconColor ? { ['--uxm-component-row-icon-badge-color' as string]: iconColor } : {}),
        } as CSSProperties)
      : undefined;

  return (
    <div
      className={cn('uxm-component-row', open && 'uxm-component-row--open', className)}
      style={style}
      {...rest}
    >
      {dragHandle && (
        <span className="uxm-component-row__drag" aria-hidden="true">
          <Icon glyph="drag-handle" size={14} />
        </span>
      )}
      {icon && (
        <span className="uxm-component-row__badge" style={badgeStyle} aria-hidden="true">
          {icon}
        </span>
      )}
      {chevron && (
        <span className="uxm-component-row__chevron" aria-hidden="true">
          <Icon glyph="chevron-right" size={14} strokeWidth={2} />
        </span>
      )}
      <span className="uxm-component-row__name">{name}</span>
      {type && <span className="uxm-component-row__type">{type}</span>}
      {actions && <span className="uxm-component-row__actions">{actions}</span>}
    </div>
  );
}
