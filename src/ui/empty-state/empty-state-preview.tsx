import type { PreviewProps } from '@/previews/types';
import { ButtonPrimary } from '@/ui';
import { EmptyState } from '@/ui';
import { Icon } from '@/ui';

export function EmptyStatePreview({ styles }: PreviewProps) {
  const iconSize = (styles.iconSize as number) ?? 48;

  return (
    <EmptyState
      style={{
        // Registry knobs map to `--uxm-empty-state-*` variables.
        ['--uxm-empty-state-padding' as string]: `${styles.padding}px`,
        ['--uxm-empty-state-icon-color' as string]: styles.iconColor as string,
        ['--uxm-empty-state-icon-size' as string]: `${iconSize}px`,
        ['--uxm-empty-state-title-color' as string]: styles.titleColor as string,
        ['--uxm-empty-state-description-color' as string]: styles.descriptionColor as string,
      }}
      icon={<Icon glyph="archive-x" size={iconSize} strokeWidth={1} />}
      title="No items found"
      description="Get started by creating your first item. It only takes a few seconds."
      action={
        <ButtonPrimary
          style={{
            backgroundColor: 'var(--color-accent-subtle)',
            color: 'var(--color-accent-bold)',
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Create item
        </ButtonPrimary>
      }
    />
  );
}
