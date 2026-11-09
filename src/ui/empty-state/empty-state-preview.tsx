import type { PreviewProps } from '@/previews/types';
import type { EmptyStateSize, EmptyStateVariant } from '@/ui';
import { ButtonPrimary } from '@/ui';
import { EmptyState } from '@/ui';
import { Icon } from '@/ui';

import type { CSSProperties } from 'react';

// Registry defaults for the knobs a variant or `compact` changes. They are
// projected only when moved off these values: projecting the default would pin
// it inline and hide the variant's own padding, icon size, gap, type and stroke.
const VARIANT_DEPENDENT: Record<string, { cssVar: string; defaultValue: number | string; px?: boolean }> = {
  padding: { cssVar: '--uxm-empty-state-padding', defaultValue: 48, px: true },
  iconSize: { cssVar: '--uxm-empty-state-icon-size', defaultValue: 48, px: true },
  gap: { cssVar: '--uxm-empty-state-gap', defaultValue: 12, px: true },
  iconGap: { cssVar: '--uxm-empty-state-icon-gap', defaultValue: 12, px: true },
  actionGap: { cssVar: '--uxm-empty-state-action-gap', defaultValue: 20, px: true },
  titleFontSize: { cssVar: '--uxm-empty-state-title-font-size', defaultValue: 16, px: true },
  descriptionFontSize: { cssVar: '--uxm-empty-state-description-font-size', defaultValue: 14, px: true },
  iconVectorEffect: { cssVar: '--uxm-empty-state-icon-vector-effect', defaultValue: 'none' },
};

export function EmptyStatePreview({ styles, variants }: PreviewProps) {
  const variant = (variants.variant as EmptyStateVariant | undefined) ?? 'default';
  const size = (variants.size as EmptyStateSize | undefined) ?? 'default';

  const projected: Record<string, string> = {};
  for (const [key, { cssVar, defaultValue, px }] of Object.entries(VARIANT_DEPENDENT)) {
    const value = styles[key];
    if (value === undefined || value === defaultValue) continue;
    projected[cssVar] = px ? `${value}px` : String(value);
  }

  const noResults = variant === 'no-results';

  return (
    <EmptyState
      variant={variant}
      size={size}
      style={{
        // Registry knobs map to `--uxm-empty-state-*` variables.
        ['--uxm-empty-state-icon-color' as string]: styles.iconColor as string,
        ['--uxm-empty-state-title-color' as string]: styles.titleColor as string,
        ['--uxm-empty-state-description-color' as string]: styles.descriptionColor as string,
        ['--uxm-empty-state-align' as string]: styles.align as string,
        ['--uxm-empty-state-description-max-width' as string]: styles.descriptionMaxWidth as string,
        ['--uxm-empty-state-first-run-background' as string]: styles.firstRunBackground as string,
        ['--uxm-empty-state-first-run-border-color' as string]: styles.firstRunBorderColor as string,
        ['--uxm-empty-state-first-run-border-width' as string]: `${styles.firstRunBorderWidth}px`,
        ['--uxm-empty-state-first-run-border-style' as string]: styles.firstRunBorderStyle as string,
        ['--uxm-empty-state-first-run-radius' as string]: `${styles.firstRunRadius}px`,
        ...projected,
      } as CSSProperties}
      icon={<Icon glyph={noResults ? 'search' : 'archive-x'} />}
      title={noResults ? 'No items match' : 'No items yet'}
      description={
        noResults
          ? 'Try another search, or clear the filters.'
          : 'Get started by creating your first item. It only takes a few seconds.'
      }
      action={
        noResults ? undefined : (
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
        )
      }
    />
  );
}
