import type { PreviewProps } from '@/previews/types';
import { Icon, IconButton, Tag, type TagType } from '@/ui';

import type { CSSProperties } from 'react';

type ActionType = 'notify' | 'transform' | 'validate';

const actionConfig: Record<ActionType, { label: string; name: string; tone: TagType }> = {
  notify: { label: 'Notify', name: 'Email customer about status change', tone: 'success' },
  transform: { label: 'Transform', name: 'Recalculate totals with tax', tone: 'warning' },
  validate: { label: 'Validate', name: 'Check required fields present', tone: 'info' },
};

export function LifecycleActionRowPreview({ styles, variants }: PreviewProps) {
  const t = (variants.actionType as ActionType) ?? 'notify';
  const cfg = actionConfig[t];

  // Status label is the shipped Tag atom (semantic type per action) rather
  // than a hand-rolled <span> with hardcoded colours. The two badge knobs map
  // onto Tag's own custom properties so editor saves still drive it; colours
  // now come from the semantic tokens Tag reads. Remove control is IconButton.
  const tagVars = {
    '--uxm-tag-border-radius': `${styles.badgeRadius}px`,
    '--uxm-tag-small-font-size': `${styles.badgeSize}px`,
  } as CSSProperties;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: styles.gap as number,
        minWidth: 320,
        paddingLeft: styles.paddingX as number,
        paddingRight: styles.paddingX as number,
        paddingTop: styles.paddingY as number,
        paddingBottom: styles.paddingY as number,
        border: `1px solid ${styles.borderColor}`,
        borderRadius: styles.borderRadius as number,
        backgroundColor: 'var(--color-card)',
      }}
    >
      <Tag type={cfg.tone} size="small" style={tagVars}>
        {cfg.label}
      </Tag>
      <span
        style={{
          flex: 1,
          fontSize: styles.fontSize as number,
          color: styles.color as string,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {cfg.name}
      </span>
      <IconButton
        aria-label="Remove action"
        style={
          {
            // IconButton's `> svg` CSS wins over the Icon size/strokeWidth
            // props, so the intended 14px / 2 close glyph must ride its vars.
            '--uxm-icon-button-icon-size': '14px',
            '--uxm-icon-button-stroke-width': 2,
          } as CSSProperties
        }
      >
        <Icon glyph="close" />
      </IconButton>
    </div>
  );
}
