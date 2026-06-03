import type { PreviewProps } from '@/previews/types';
import { ButtonPrimary, ButtonTertiary } from '@/ui';
import { FormField } from '@/ui';
import { Select, TextInput } from '@/ui';

import type { CSSProperties } from 'react';

/**
 * Multi-section form composite. Real atomic composition: every field is
 * `<FormField><TextInput|Select /></FormField>`. Always top labels —
 * side labels combined with multi-section + multi-column gets cramped
 * (label width eats input width), so this composite doesn't expose a
 * labelPosition variant. Open FormField's own editor to preview side
 * labels in isolation.
 *
 * What this composite owns:
 *   - Form card shape (background, border, radius, padding)
 *   - Field grid layout (columns variant: 1 / 2)
 *   - Field gap + section gap
 *
 * What other atoms own:
 *   - Input shape / state visuals → TextInput / Select registries
 *   - Label theming → FormField registry
 *
 * Span-2 fields (Email, Street in the 2-column variant) span both
 * columns by passing `gridColumn: "1 / -1"` to FormField via `style`.
 */
export function MultirowFormPreview({ styles, variants }: PreviewProps) {
  const cols = (variants.columns as string) ?? '2';
  const isTwoCol = cols === '2';

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isTwoCol ? '1fr 1fr' : '1fr',
    gap: styles.fieldGap as number,
  };
  // Span both columns when 2-column layout is active. In 1-column the
  // grid only has one column so the span style is harmless / no-op.
  const fullSpan: CSSProperties | undefined = isTwoCol ? { gridColumn: '1 / -1' } : undefined;

  return (
    <div
      style={{
        width: 520,
        backgroundColor: styles.backgroundColor as string,
        border: `1px solid ${styles.borderColor}`,
        borderRadius: styles.borderRadius as number,
        padding: styles.padding as number,
      }}
    >
      <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px' }}>
        Create Account
      </h3>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 24px' }}>
        Fill in your personal details.
      </p>

      {/* Section 1: Personal */}
      <div style={{ marginBottom: styles.sectionGap as number }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Personal Information
        </p>
        <div style={gridStyle}>
          <FormField label="First Name">
            <TextInput placeholder="John" />
          </FormField>
          <FormField label="Last Name">
            <TextInput placeholder="Doe" />
          </FormField>
          <FormField label="Email" style={fullSpan}>
            <TextInput type="email" placeholder="john@example.com" />
          </FormField>
          <FormField label="Phone">
            <TextInput placeholder="+1 (555) 000-0000" />
          </FormField>
          <FormField label="Role">
            <Select defaultValue="">
              <option value="" disabled>Select role</option>
              <option>Admin</option>
              <option>Editor</option>
              <option>Viewer</option>
            </Select>
          </FormField>
        </div>
      </div>

      {/* Section 2: Address */}
      <div style={{ marginBottom: styles.sectionGap as number }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Address
        </p>
        <div style={gridStyle}>
          <FormField label="Street" style={fullSpan}>
            <TextInput placeholder="123 Main St" />
          </FormField>
          <FormField label="City">
            <TextInput placeholder="New York" />
          </FormField>
          <FormField label="State">
            <Select defaultValue="">
              <option value="" disabled>Select state</option>
              <option>NY</option>
              <option>CA</option>
              <option>TX</option>
            </Select>
          </FormField>
          <FormField label="ZIP">
            <TextInput placeholder="10001" />
          </FormField>
          <FormField label="Country">
            <Select defaultValue="">
              <option value="" disabled>Select country</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Germany</option>
            </Select>
          </FormField>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <ButtonTertiary>Cancel</ButtonTertiary>
        <ButtonPrimary>Create Account</ButtonPrimary>
      </div>
    </div>
  );
}
