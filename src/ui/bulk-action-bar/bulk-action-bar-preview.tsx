import { useState, type CSSProperties } from 'react';

import type { PreviewProps } from '@/previews/types';

import { BulkActionBar, type BulkAction } from './bulk-action-bar';

type Styles = PreviewProps['styles'];

/**
 * Project every registry knob onto its CSS custom property. Names follow
 * `--uxm-bulk-action-bar-{kebab(key)}` — exactly what generate-css emits
 * (REAL_CSS_PROPS land bare on the root, the rest kebab through the
 * fallback), so no PER_COMPONENT_MAPPING entry is needed. Set on the bar
 * itself; the per-part vars cascade down to the inner buttons.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-bulk-action-bar-background-color': styles.backgroundColor as string,
    '--uxm-bulk-action-bar-color': styles.color as string,
    '--uxm-bulk-action-bar-border-color': styles.borderColor as string,
    '--uxm-bulk-action-bar-border-radius': `${styles.borderRadius}px`,
    '--uxm-bulk-action-bar-padding-x': `${styles.paddingX}px`,
    '--uxm-bulk-action-bar-padding-y': `${styles.paddingY}px`,
    '--uxm-bulk-action-bar-gap': `${styles.gap}px`,
    '--uxm-bulk-action-bar-font-size': `${styles.fontSize}px`,

    '--uxm-bulk-action-bar-shadow-color': styles.shadowColor as string,
    '--uxm-bulk-action-bar-shadow-blur': `${styles.shadowBlur}px`,
    '--uxm-bulk-action-bar-shadow-offset-y': `${styles.shadowOffsetY}px`,

    '--uxm-bulk-action-bar-action-color': styles.actionColor as string,
    '--uxm-bulk-action-bar-action-hover-bg': styles.actionHoverBg as string,
    '--uxm-bulk-action-bar-action-radius': `${styles.actionRadius}px`,

    '--uxm-bulk-action-bar-danger-color': styles.dangerColor as string,
    '--uxm-bulk-action-bar-danger-hover-bg': styles.dangerHoverBg as string,

    '--uxm-bulk-action-bar-divider-color': styles.dividerColor as string,
  } as CSSProperties;
}

export function BulkActionBarPreview({ styles }: PreviewProps & { componentId: string }) {
  // Representative count — the real count is runtime data the consumer owns.
  const count = 3;
  const cssVars = buildVars(styles);

  const [status, setStatus] = useState<string | null>(null);
  const run = (label: string) => () => setStatus(`Last action: ${label}`);

  const actions: BulkAction[] = [
    { key: 'export', label: 'Export', icon: 'document', onClick: run('Export') },
    { key: 'archive', label: 'Archive', icon: 'archive-x', onClick: run('Archive') },
    { key: 'delete', label: 'Delete', icon: 'trash', danger: true, onClick: run('Delete') },
  ];

  const sectionLabel: CSSProperties = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={sectionLabel}>Bulk action bar</div>
        <BulkActionBar
          count={count}
          actions={actions}
          onClear={() => setStatus('Selection cleared')}
          style={cssVars}
        />
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>
        {status ?? 'No action yet'}
      </div>
    </div>
  );
}