import { useState } from 'react';

import type { PreviewProps } from '@/previews/types';
import { Card, Cluster, EditableCell, FormField, Stack } from '@/ui';

export function CardPreview({ styles, variants }: PreviewProps) {
  const [name, setName] = useState('Dental Customer Onboarding');
  const [status, setStatus] = useState('Active');
  const [owner, setOwner] = useState('Dr. Smith');

  // Explicit aria-labels: composed inside a labelled FormField an
  // EditableCell's `htmlFor` can't attach (its display state is a button
  // that takes no `id`), so the cell names itself — the pattern the
  // FormField README prescribes. (Want divided rows? Compose the Divider
  // atom between rows — it's not a Card concern.)
  const rows = [
    <FormField key="name" label="Name" labelPosition="side" labelTone="muted">
      <EditableCell
        type="text"
        value={name}
        aria-label="Name"
        onCommit={(next) => setName(String(next))}
      />
    </FormField>,
    <FormField key="status" label="Status" labelPosition="side" labelTone="muted">
      <EditableCell
        type="text"
        value={status}
        aria-label="Status"
        onCommit={(next) => setStatus(String(next))}
      />
    </FormField>,
    <FormField key="owner" label="Owner" labelPosition="side" labelTone="muted">
      <EditableCell
        type="text"
        value={owner}
        aria-label="Owner"
        onCommit={(next) => setOwner(String(next))}
      />
    </FormField>,
  ];

  // The Content Layout variant switches the CONTENT group's arrangement only —
  // the header above stays stacked on top either way. Alignment comes from
  // VARIANTS, not styles: Stack/Cluster drive it with modifier classes, so
  // there's no var a saved override could write (see the registry note). No
  // `gap` is passed either — the row gap belongs to the nested atom and is
  // themed by ITS own knob, so leaving it off previews what a consumer gets.
  const content =
    variants.contentLayout === 'cluster' ? (
      <Cluster
        align={(variants.clusterAlign as 'start' | 'center' | 'end' | 'baseline') ?? 'center'}
        justify={(variants.justify as 'start' | 'center' | 'end' | 'between') ?? 'start'}
        wrap={(variants.wrap ?? 'wrap') === 'wrap'}
      >
        {rows}
      </Cluster>
    ) : (
      <Stack align={(variants.stackAlign as 'start' | 'center' | 'end' | 'stretch') ?? 'stretch'}>
        {rows}
      </Stack>
    );

  return (
    <Card
      // Always on in the preview — with/without shadow is a value state
      // (zero the Offset/Blur knobs for a flat card); consumers opt in/out
      // in code via the `shadow` prop.
      shadow
      padding={styles.padding as number}
      // Card's own `gap` lays out its direct children in a column and spaces
      // them — here the header and the content group — so it reads as the
      // header ↔ content gap.
      gap={styles.gap as number}
      style={{
        ['--uxm-card-bg' as string]: styles.backgroundColor as string,
        ['--uxm-card-border-color' as string]: styles.borderColor as string,
        ['--uxm-card-radius' as string]: `${styles.borderRadius}px`,
        // Tunable shadow — same var surface a production consumer re-themes.
        ['--uxm-card-shadow-color' as string]: styles.shadowColor as string,
        ['--uxm-card-shadow-blur' as string]: `${styles.shadowBlur}px`,
        ['--uxm-card-shadow-offset-y' as string]: `${styles.shadowOffsetY}px`,
      }}
    >
      {/* Optional header — NOT a Card prop, just composed content the page
          author drops in. Its distance from the content below is Card's gap. */}
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
          Analytics Dashboard
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
          Updated 2 hours ago
        </div>
      </div>

      {/* Content group — Stack or Cluster per the Layout knob. Its own gap
          (Row Gap) spaces the rows independently of the header gap above. */}
      {content}
    </Card>
  );
}
