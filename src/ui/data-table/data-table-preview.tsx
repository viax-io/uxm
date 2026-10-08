import { useState } from 'react';

import type { PreviewProps } from '@/previews/types';
import {
  DataTable,
  Tag,
  type DataTableColumn,
  type DataTableSort,
  type EditableCellOption,
  type EditableCellValue,
  type MenuEntry,
  type TagType,
} from '@/ui';

import type { CSSProperties } from 'react';

type Styles = PreviewProps['styles'];

interface Row {
  name: string;
  /** Long free text — demonstrates the cell's max-width clip + hover tooltip. */
  description: string;
  status: string;
  /** Multiselect — stored as an array of option values. */
  regions: string[];
  /** Stored as a number — display formatting (`$84,500`) is handled by
   *  the EditableCell's `format` so editing returns the raw value. */
  amount: number;
  /** ISO `YYYY-MM-DD` — the date EditableCell stores and edits ISO. */
  closeDate: string;
}

const initialData: Row[] = [
  {
    name: 'Enterprise SaaS',
    description: 'Annual enterprise agreement with committed seat expansion across every business unit',
    status: 'Active',
    regions: ['na', 'emea'],
    amount: 84500,
    closeDate: '2026-03-28',
  },
  {
    name: 'Product-Led Growth',
    description: 'Self-serve',
    status: 'Active',
    regions: ['na'],
    amount: 215000,
    closeDate: '2026-03-25',
  },
  {
    name: 'Channel Partner',
    description: 'Reseller agreement covering the EMEA territory with quarterly rebate tiers and co-marketing funds',
    status: 'Draft',
    regions: ['emea'],
    amount: 32750,
    closeDate: '2026-03-30',
  },
  {
    name: 'Usage-Based Pricing',
    description: 'Metered API',
    status: 'Active',
    regions: ['na', 'apac'],
    amount: 156000,
    closeDate: '2026-03-20',
  },
  {
    name: 'Marketplace Listing',
    description: 'Cloud marketplace private offer with a custom EULA and a multi-year ramp schedule',
    status: 'Archived',
    regions: ['na', 'emea', 'apac', 'latam'],
    amount: 67800,
    closeDate: '2026-02-15',
  },
];

const formatAmount = (n: EditableCellValue) => `$${Number(Array.isArray(n) ? n[0] : n).toLocaleString()}`;

const STATUS_OPTIONS: EditableCellOption[] = [
  { value: 'Active', label: 'Active' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Archived', label: 'Archived' },
];

const REGION_OPTIONS: EditableCellOption[] = [
  { value: 'na', label: 'North America' },
  { value: 'emea', label: 'EMEA' },
  { value: 'apac', label: 'APAC' },
  { value: 'latam', label: 'LATAM' },
];

const STATUS_TO_TAG_TYPE: Record<string, TagType> = {
  Active: 'accent',
  Draft: 'warning',
  Archived: 'neutral',
};

/**
 * Every `--uxm-data-table-*` knob the registry exposes, projected onto the real
 * component.
 *
 * This preview renders the shipped `<DataTable>`. It used to be a hand-rolled
 * replica with inline styles, which meant the panel tuned a drawing rather than
 * the component: knobs that did nothing went unnoticed, and whole features
 * (sorting, sticky columns, the active row) could not be seen at all. Every
 * knob here reaches the atom through the same custom property a consumer would
 * set.
 */
function tableVars(styles: Styles): CSSProperties {
  return {
    '--uxm-data-table-header-bg': styles.headerBg as string,
    '--uxm-data-table-header-text': styles.headerText as string,
    '--uxm-data-table-row-bg': styles.rowBg as string,
    '--uxm-data-table-row-hover-bg': styles.rowHoverBg as string,
    '--uxm-data-table-row-active-bg': styles.rowActiveBg as string,
    '--uxm-data-table-row-active-rail': styles.rowActiveRail as string,
    '--uxm-data-table-row-active-hover-bg': styles.rowActiveHoverBg as string,
    '--uxm-data-table-border-color': styles.borderColor as string,
    '--uxm-data-table-border-radius': `${styles.borderRadius as number}px`,
    '--uxm-data-table-font-size': `${styles.fontSize as number}px`,
    '--uxm-data-table-cell-padding-x': `${styles.cellPaddingX as number}px`,
    '--uxm-data-table-cell-padding-y': `${styles.cellPaddingY as number}px`,
    '--uxm-data-table-sort-color': styles.sortColor as string,
    '--uxm-data-table-sort-hover-color': styles.sortHoverColor as string,
    '--uxm-data-table-sort-active-color': styles.sortActiveColor as string,
    '--uxm-data-table-sort-focus-color': styles.sortFocusColor as string,
    '--uxm-data-table-sort-icon-color': styles.sortIconColor as string,
  } as CSSProperties;
}

export function DataTablePreview({ styles, variants }: PreviewProps & { componentId: string }) {
  // Owning the rows lets every editable column round-trip its commits, so a
  // designer sees the new value persist after an edit.
  const [rows, setRows] = useState<Row[]>(initialData);
  // Sorted and active state are real, not painted: clicking a header sorts and
  // clicking a row moves the active marker, which is how a consumer drives
  // `sort` / `onSortChange` and `activeRowId`.
  const [sort, setSort] = useState<DataTableSort | null>({ key: 'name', direction: 'asc' });
  const [activeRowId, setActiveRowId] = useState<string | null>('Product-Led Growth');

  const sorted = [...rows].sort((a, b) => {
    if (!sort) return 0;
    const dir = sort.direction === 'asc' ? 1 : -1;
    const key = sort.key as keyof Row;
    const av = a[key];
    const bv = b[key];
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });

  // One commit path for every column — simulated async so the submitting state
  // is visible, then patches the row. The cast is safe because each column's
  // editor type already matches its field shape; a real consumer would type
  // per column.
  const commit = (row: Row, key: keyof Row) => async (next: EditableCellValue) => {
    await new Promise((r) => setTimeout(r, 300));
    setRows((prev) => prev.map((r) => (r.name === row.name ? ({ ...r, [key]: next } as Row) : r)));
  };

  const columns: DataTableColumn<Row>[] = [
    {
      key: 'name',
      header: 'Name',
      sortKey: 'name',
      // Widths put the table past the canvas, which is the only way the
      // scroller, the sticky column and the arrows are ever visible here —
      // pinning means nothing without something to scroll.
      width: 180,
      sticky: 'start',
      editable: true,
      onCommit: (row, v) => commit(row, 'name')(v),
      validate: (v) => (String(v).trim() ? null : 'Name is required'),
    },
    {
      key: 'description',
      header: 'Description',
      width: 260,
      // `maxWidth` clamps the CONTENT (and adds the hover tooltip); `width`
      // sizes the column. Both together, deliberately.
      maxWidth: 220,
      editable: true,
      onCommit: (row, v) => commit(row, 'description')(v),
    },
    {
      key: 'status',
      header: 'Status',
      width: 130,
      editable: true,
      editor: 'select',
      editorOptions: STATUS_OPTIONS,
      formatValue: (v) => (
        <Tag type={STATUS_TO_TAG_TYPE[String(v)] ?? 'neutral'} size="small">
          {String(v)}
        </Tag>
      ),
      onCommit: (row, v) => commit(row, 'status')(v),
    },
    {
      key: 'regions',
      header: 'Regions',
      width: 200,
      editable: true,
      editor: 'multiselect',
      editorOptions: REGION_OPTIONS,
      onCommit: (row, v) => commit(row, 'regions')(v),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      width: 140,
      sortKey: 'amount',
      // A first click on money should open on the largest, not the smallest.
      firstSortDirection: 'desc',
      editable: true,
      editor: 'number',
      formatValue: formatAmount,
      onCommit: (row, v) => commit(row, 'amount')(v),
    },
    {
      key: 'closeDate',
      header: 'Close date',
      width: 160,
      sortKey: 'closeDate',
      firstSortDirection: 'desc',
      editable: true,
      editor: 'date',
      onCommit: (row, v) => commit(row, 'closeDate')(v),
    },
  ];

  const rowActions = (row: Row): MenuEntry[] => [
    { key: 'edit', label: 'Edit', icon: 'pencil', onSelect: () => {} },
    {
      key: 'duplicate',
      label: 'Duplicate',
      icon: 'copy',
      onSelect: () =>
        setRows((prev) => {
          const at = prev.findIndex((r) => r.name === row.name);
          const next = [...prev];
          next.splice(at + 1, 0, { ...row, name: `${row.name} (copy)` });
          return next;
        }),
    },
    {
      key: 'archive',
      label: 'Archive',
      icon: 'archive-x',
      disabled: row.status === 'Archived',
      onSelect: () =>
        setRows((prev) => prev.map((r) => (r.name === row.name ? { ...r, status: 'Archived' } : r))),
    },
    { separator: true, key: 'sep' },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'trash',
      danger: true,
      onSelect: () => setRows((prev) => prev.filter((r) => r.name !== row.name)),
    },
  ];

  return (
    <DataTable<Row>
      style={tableVars(styles)}
      density={(variants.density as 'compact' | 'default' | 'relaxed') ?? 'default'}
      columns={columns}
      rows={sorted}
      rowKey={(r) => r.name}
      sort={sort}
      onSortChange={setSort}
      activeRowId={activeRowId}
      onRowClick={(r) => setActiveRowId(r.name)}
      rowActions={rowActions}
      stickyActions
      scrollLabel="Opportunities"
    />
  );
}
