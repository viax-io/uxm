import type { PreviewProps } from '@/previews/types';
import { ButtonPrimary, Card, FilterTabs, Stack, Surface } from '@/ui';

import type { CSSProperties } from 'react';

// Projected only when set: an empty value would be an invalid `background`
// and drop the colour knob under it (the Card preview does the same).
const backgroundOf = (value: unknown) => (typeof value === 'string' && value.trim() ? value : undefined);

/**
 * A "what happens next" dock: a heading, plain text, tabs, a card and a button
 * on one panel. The Theme variant sets the panel dark, light, or the page's own
 * theme, so the same atoms show on either side of the canvas's theme.
 */
export function SurfacePreview({ styles, variants }: PreviewProps) {
  const theme = (variants.theme as string) ?? 'dark';
  const background = backgroundOf(styles.background);
  const vars = {
    '--uxm-surface-bg': styles.backgroundColor,
    ...(background ? { '--uxm-surface-background': background } : null),
    '--uxm-surface-text-color': styles.textColor,
    '--uxm-surface-radius': `${styles.borderRadius}px`,
    '--uxm-surface-padding': `${styles.padding}px`,
  } as CSSProperties;
  // An explicit width: the canvas centres its content in a shrink-to-fit box.
  return (
    <div style={{ width: 560, maxWidth: '100%' }}>
      <Surface theme={theme === 'dark' || theme === 'light' ? theme : undefined} style={vars}>
        <Stack gap={16}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>What happens next</h3>
            <p style={{ margin: '4px 0 0', fontSize: 14 }}>
              Your order ships in two days. We&apos;ll send a tracking link.
            </p>
          </div>
          <FilterTabs
            aria-label="Order steps"
            options={[
              { value: 'ship', label: 'Shipping' },
              { value: 'install', label: 'Installation' },
              { value: 'support', label: 'Support' },
            ]}
            defaultValue="ship"
          />
          <Card padding={16}>
            <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Delivery window: Tue 9:00–12:00</span>
          </Card>
          <div>
            <ButtonPrimary>Track order</ButtonPrimary>
          </div>
        </Stack>
      </Surface>
    </div>
  );
}
