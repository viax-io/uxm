import { cn } from '../../helpers/cn';
import { Icon } from '../icon';
import { IconButton } from '../icon-button';

import type { CSSProperties, ReactNode } from 'react';

/**
 * One action in a {@link BulkActionBar}. Presentational — the consumer
 * owns `onClick` and decides what "do it to the selection" means.
 */
export type BulkAction = {
  /** Stable React key + identity. */
  key: string;
  /** Visible label, e.g. "Export", "Archive", "Delete". */
  label: string;
  /** Optional leading icon glyph id (see the icon registry). */
  icon?: string;
  /** Render in the destructive (danger) colour. Reserve for Delete/Remove. */
  danger?: boolean;
  /** Disable this single action without removing it. */
  disabled?: boolean;
  /** Invoked on click. */
  onClick?: () => void;
};

export interface BulkActionBarProps {
  /** Number of selected items. Drives the default count label. */
  count: number;
  /** Action buttons, in display order. */
  actions?: BulkAction[];
  /** When provided, renders a trailing × that clears the selection. */
  onClear?: () => void;
  /**
   * Override the "{n} selected" count label — e.g. for pluralisation or
   * a different noun ("3 rows"). Receives the current count.
   */
  countLabel?: (count: number) => ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Floating bulk-action bar — the toolbar that appears once rows are
 * selected: "{N} selected · actions · × to clear". Purely presentational;
 * the consumer wires it to its own `selectedKeys` state and renders it
 * (typically fixed/sticky near the bottom of a table view). Destructive
 * actions get the danger treatment via `danger: true`.
 */
export function BulkActionBar({
  count,
  actions = [],
  onClear,
  countLabel,
  className,
  style,
}: BulkActionBarProps) {
  const label = countLabel ? countLabel(count) : `${count} selected`;

  return (
    <div
      className={cn('uxm-bulk-action-bar', className)}
      role="toolbar"
      aria-label="Bulk actions"
      style={style}
    >
      <span className="uxm-bulk-action-bar__count">{label}</span>

      {actions.length > 0 && (
        <>
          <span className="uxm-bulk-action-bar__divider" aria-hidden="true" />
          <div className="uxm-bulk-action-bar__actions">
            {actions.map((action) => (
              <button
                key={action.key}
                type="button"
                className={cn(
                  'uxm-bulk-action-bar__action',
                  action.danger && 'uxm-bulk-action-bar__action--danger',
                )}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.icon && (
                  <Icon glyph={action.icon} size={16} className="uxm-bulk-action-bar__action-icon" />
                )}
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}

      {onClear && (
        <>
          <span className="uxm-bulk-action-bar__divider" aria-hidden="true" />
          <IconButton aria-label="Clear selection" onClick={onClear}>
            <Icon glyph="close" size={16} />
          </IconButton>
        </>
      )}
    </div>
  );
}