import { useState } from 'react';

import type { PreviewProps } from '@/previews/types';
import {
  EditableCell,
  Icon,
  IconButton,
  Menu,
  Tag,
  type EditableCellOption,
  type EditableCellValue,
  type MenuEntry,
  type TagType,
} from '@/ui';

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

export function DataTablePreview({ styles, variants }: PreviewProps & { componentId: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  // Owning the rows in state lets every editable column round-trip its
  // commits back into the table — designers see the new value persist
  // after the edit.
  const [rows, setRows] = useState<Row[]>(initialData);
  const density = variants.density ?? 'default';
  const densityMultiplier = density === 'compact' ? 0.65 : density === 'relaxed' ? 1.4 : 1;
  const cellPy = Math.round((styles.cellPaddingY as number) * densityMultiplier);

  // One commit path for every column — a simulated async handler so
  // designers can see the submitting state, then patches the row field.
  // EditableCell already hands back the right runtime type per column
  // (number for Amount, string[] for Regions, string elsewhere).
  const commit = (index: number, key: keyof Row) => async (next: EditableCellValue) => {
    await new Promise((r) => setTimeout(r, 300));
    // `as Row`: `next` is the EditableCellValue union; each column's editor type
    // already matches its field shape (see comment above), so the cast is safe
    // here. This is preview/demo code — a real consumer would type per column.
    setRows((prev) => prev.map((r, i) => (i === index ? ({ ...r, [key]: next } as Row) : r)));
  };

  // Per-row action menu — the trailing ⋮ column. Demonstrates the real
  // Menu atom in a table: leading icons, a disabled item (Archive, when
  // already archived), a separator, and a destructive Delete. Actions
  // mutate the table's row state so the effect is visible live.
  const rowActions = (index: number): MenuEntry[] => [
    { key: 'edit', label: 'Edit', icon: 'pencil', onSelect: () => {} },
    {
      key: 'duplicate',
      label: 'Duplicate',
      icon: 'copy',
      onSelect: () =>
        setRows((prev) => {
          const next = [...prev];
          next.splice(index + 1, 0, { ...prev[index], name: `${prev[index].name} (copy)` });
          return next;
        }),
    },
    {
      key: 'archive',
      label: 'Archive',
      icon: 'archive-x',
      disabled: rows[index]?.status === 'Archived',
      onSelect: () =>
        setRows((prev) => prev.map((r, i) => (i === index ? { ...r, status: 'Archived' } : r))),
    },
    { separator: true, key: 'sep' },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'trash',
      danger: true,
      onSelect: () => setRows((prev) => prev.filter((_, i) => i !== index)),
    },
  ];

  // Editable columns share the same -6 horizontal padding compensation so
  // the value's left edge lines up with its header (the cell carries its
  // own 6px paddingX / the select trigger its own gutter).
  const editableTd = {
    padding: `${cellPy}px ${(styles.cellPaddingX as number) - 6}px`,
    color: 'var(--color-text)',
    borderBottom: `1px solid ${styles.borderColor}`,
  } as const;

  return (
    <div style={{
      // max-content with a floor: the table grows for wide data (a long
      // committed Amount widens its own column) instead of staying locked
      // and squeezing the other columns into wrapping — the "Name column
      // jumps when I commit a huge number" effect. (fit-content won't do:
      // the canvas parent's available width clamps it right back.)
      width: 'max-content',
      minWidth: 720,
      border: `1px solid ${styles.borderColor}`,
      borderRadius: styles.borderRadius as number,
      overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: styles.fontSize as number }}>
        <thead>
          <tr style={{ backgroundColor: styles.headerBg as string }}>
            {['Name', 'Description', 'Status', 'Regions', 'Amount', 'Close date'].map((h) => (
              <th key={h} style={{
                textAlign: 'left',
                padding: `${cellPy}px ${styles.cellPaddingX}px`,
                fontWeight: 600,
                color: styles.headerText as string,
                borderBottom: `1px solid ${styles.borderColor}`,
                fontSize: (styles.fontSize as number) - 1,
              }}>{h}</th>
            ))}
            {/* Trailing actions column header — empty, narrow (1% + nowrap
                shrinks it to the ⋮ trigger). */}
            <th aria-label="Actions" style={{
              width: '1%',
              whiteSpace: 'nowrap',
              padding: `${cellPy}px ${styles.cellPaddingX}px`,
              borderBottom: `1px solid ${styles.borderColor}`,
            }} />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                backgroundColor: hovered === i ? (styles.rowHoverBg as string) : (styles.rowBg as string),
                transition: 'background-color 0.1s',
              }}
            >
              {/* text (short) — required, so validate blocks an empty name. */}
              <td style={{ ...editableTd, fontWeight: 500 }}>
                <EditableCell
                  value={row.name}
                  onCommit={commit(i, 'name')}
                  type="text"
                  validate={(v) => (String(v).trim() ? null : 'Name is required')}
                />
              </td>
              {/* text (long) — the value overflows the cell's max-width, so it
                  clips with an ellipsis and reveals the full text on hover. */}
              <td style={{ ...editableTd }}>
                <EditableCell
                  value={row.description}
                  onCommit={commit(i, 'description')}
                  type="text"
                  placeholder="Add a description"
                />
              </td>
              {/* select — status as a single-choice picker; format renders the
                  chosen value as the same status Tag used elsewhere. */}
              <td style={{ ...editableTd }}>
                <EditableCell
                  value={row.status}
                  onCommit={commit(i, 'status')}
                  type="select"
                  options={STATUS_OPTIONS}
                  placeholder="Set status"
                  format={(v) => (
                    <Tag type={STATUS_TO_TAG_TYPE[String(v)] ?? 'neutral'} size="small">
                      {String(v)}
                    </Tag>
                  )}
                />
              </td>
              {/* multiselect — regions; the display joins the selected labels
                  and clips + tooltips when the list runs long. */}
              <td style={{ ...editableTd }}>
                <EditableCell
                  value={row.regions}
                  onCommit={commit(i, 'regions')}
                  type="multiselect"
                  options={REGION_OPTIONS}
                  placeholder="Add regions"
                />
              </td>
              {/* number — validation blocks negatives; blur commits via the
                  simulated async handler; format shows the currency string. */}
              <td style={{ ...editableTd, fontWeight: 500 }}>
                <EditableCell
                  value={row.amount}
                  onCommit={commit(i, 'amount')}
                  type="number"
                  format={formatAmount}
                  validate={(v) => (Number(v) < 0 ? 'Must be ≥ 0' : null)}
                />
              </td>
              {/* date — click opens a masked input + calendar; ISO in, ISO out. */}
              <td style={{ ...editableTd }}>
                <EditableCell
                  value={row.closeDate}
                  onCommit={commit(i, 'closeDate')}
                  type="date"
                />
              </td>
              {/* Actions column — a ⋮ IconButton that opens the Menu atom
                  with row-bound actions. Right-aligned, hugs the trigger. */}
              <td style={{
                width: '1%',
                whiteSpace: 'nowrap',
                textAlign: 'right',
                padding: `0 ${styles.cellPaddingX}px`,
                borderBottom: `1px solid ${styles.borderColor}`,
              }}>
                <Menu
                  items={rowActions(i)}
                  aria-label="Row actions"
                  renderTrigger={({ open, triggerProps }) => (
                    <IconButton
                      {...triggerProps}
                      aria-label="Row actions"
                      className={open ? 'uxm-icon-button--active' : undefined}
                    >
                      <Icon glyph="kebab" size={18} />
                    </IconButton>
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
