import type { PreviewProps } from '@/previews/types';
import { ButtonSecondary, TableCard, Tag, type DataTableColumn, type MenuEntry } from '@/ui';

import type { CSSProperties } from 'react';

interface Row {
  id: string;
  name: string;
  owner: string;
  status: 'Active' | 'Draft' | 'Archived';
  amount: string;
}

const rows: Row[] = [
  { id: 'r1', name: 'Enterprise SaaS', owner: 'Dr. Smith', status: 'Active', amount: '$84,500' },
  { id: 'r2', name: 'Product-Led Growth', owner: 'M. Okafor', status: 'Active', amount: '$215,000' },
  { id: 'r3', name: 'Channel Partner', owner: 'J. Lindqvist', status: 'Draft', amount: '$32,750' },
  { id: 'r4', name: 'Usage-Based Pricing', owner: 'A. Ruiz', status: 'Active', amount: '$156,000' },
  { id: 'r5', name: 'Marketplace Listing', owner: 'Dr. Smith', status: 'Archived', amount: '$9,200' },
];

const statusType = { Active: 'success', Draft: 'warning', Archived: 'neutral' } as const;

const columns: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name' },
  { key: 'owner', header: 'Owner' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <Tag type={statusType[row.status]} size="small">{row.status}</Tag>,
  },
  { key: 'amount', header: 'Amount', align: 'right' },
];

const rowActions = (): MenuEntry[] => [
  { key: 'open', label: 'Open', onSelect: () => undefined },
  { key: 'duplicate', label: 'Duplicate', onSelect: () => undefined },
];

/**
 * A table as a card's body in the workbench. The Variant, Card Header and
 * Column Headers variants switch the props; the knobs project as the same
 * `--uxm-table-card-*` variables a consumer would set.
 */
export function TableCardPreview({ styles, variants }: PreviewProps) {
  const variant = ((variants.variant as string) ?? 'lines') as 'lines' | 'striped';
  const withHeader = variants.header !== 'without';
  const hideHeaderRow = variants.columnHeaders === 'hide';
  const px = (key: string) => `${styles[key]}px`;
  const vars = {
    '--uxm-table-card-bg': styles.backgroundColor as string,
    '--uxm-table-card-border-color': styles.borderColor as string,
    '--uxm-table-card-divider-color': styles.dividerColor as string,
    '--uxm-table-card-stripe-bg': styles.stripeBg as string,
    '--uxm-table-card-title-color': styles.titleColor as string,
    '--uxm-table-card-description-color': styles.descriptionColor as string,
    '--uxm-table-card-title-font-size': px('titleFontSize'),
    '--uxm-table-card-description-font-size': px('descriptionFontSize'),
    '--uxm-table-card-radius': px('borderRadius'),
    '--uxm-table-card-padding-x': px('paddingX'),
    '--uxm-table-card-padding-y': px('paddingY'),
    '--uxm-table-card-stripe-inset': px('stripeInset'),
    '--uxm-table-card-shadow-color': styles.shadowColor as string,
    '--uxm-table-card-shadow-blur': px('shadowBlur'),
    '--uxm-table-card-shadow-offset-y': px('shadowOffsetY'),
  } as CSSProperties;

  return (
    <TableCard<Row>
      shadow
      style={{ width: 720, maxWidth: '100%', ...vars }}
      variant={variant}
      hideHeaderRow={hideHeaderRow}
      title={withHeader ? 'Deals' : undefined}
      description={withHeader ? '5 open · updated 2 hours ago' : undefined}
      actions={withHeader ? <ButtonSecondary>Export</ButtonSecondary> : undefined}
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      rowActions={rowActions}
      rowActionsLabel="Deal actions"
    />
  );
}
