import type { PreviewProps } from '@/previews/types';
import { ButtonPrimary, ButtonTertiary } from '@/ui';
import { FormField } from '@/ui';
import { Icon } from '@/ui';
import { IconButton } from '@/ui';
import { TextInput } from '@/ui';

const stepTypes = [
  { key: 'state', glyph: 'check-circle', label: 'State', desc: 'A lifecycle state the BI can be in', bg: 'rgba(144, 233, 184, 0.25)', color: 'var(--color-accent-bold)' },
  { key: 'condition', glyph: 'question-mark-circle', label: 'Condition', desc: 'Branch based on a condition expression', bg: 'rgba(252, 208, 161, 0.3)', color: 'var(--color-on-highlight-warm)' },
  { key: 'task', glyph: 'cog-6-tooth', label: 'Task', desc: 'Execute an automated task', bg: 'rgba(195, 190, 247, 0.25)', color: 'var(--color-on-highlight-cool)' },
];

export function LifecycleAddStepModalPreview({ styles }: PreviewProps) {
  const selectedKey = 'state';
  return (
    <div
      style={{
        width: styles.width as number,
        backgroundColor: styles.backgroundColor as string,
        border: `1px solid ${styles.borderColor}`,
        borderRadius: styles.borderRadius as number,
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: styles.paddingX as number,
          paddingRight: styles.paddingX as number,
          paddingTop: styles.paddingY as number,
          paddingBottom: styles.paddingY as number,
          borderBottom: `1px solid ${styles.borderColor}`,
        }}
      >
        <h3 style={{ fontSize: styles.titleSize as number, fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>Add Step</h3>
        <IconButton aria-label="Close">
          <Icon glyph="close" size={14} strokeWidth={2} />
        </IconButton>
      </div>

      {/* Body */}
      <div
        style={{
          paddingLeft: styles.paddingX as number,
          paddingRight: styles.paddingX as number,
          paddingTop: styles.paddingY as number,
          paddingBottom: styles.paddingY as number,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stepTypes.map((st) => {
            const selected = st.key === selectedKey;
            return (
              <div
                key={st.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 4,
                  border: `1px solid ${selected ? 'var(--color-accent)' : styles.borderColor}`,
                  backgroundColor: selected ? 'rgba(144, 233, 184, 0.08)' : 'transparent',
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    backgroundColor: st.bg,
                    color: st.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon glyph={st.glyph} size={16} strokeWidth={1.5} />
                </span>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{st.label}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)' }}>{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        {/* Name field — real atomic composition. Label theming flows
            from FormField's registry; input shape / state visuals flow
            from TextInput's. */}
        <FormField label="Name">
          <TextInput placeholder="e.g. Pending Approval" />
        </FormField>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          paddingLeft: styles.paddingX as number,
          paddingRight: styles.paddingX as number,
          paddingTop: styles.paddingY as number,
          paddingBottom: styles.paddingY as number,
          borderTop: `1px solid ${styles.borderColor}`,
        }}
      >
        <ButtonTertiary style={{ flex: 1 }}>Cancel</ButtonTertiary>
        <ButtonPrimary style={{ flex: 1 }}>Add Step</ButtonPrimary>
      </div>
    </div>
  );
}
