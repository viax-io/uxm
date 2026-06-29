import { useState } from 'react';

import type { PreviewProps } from '@/previews/types';
import { EditableCell, Icon, IconButton, Menu, Tag, type EditableCellValue, type MenuEntry, type TagType } from '@/ui';

interface Row {
  name: string;
  status: string;
  owner: string;
  /** Stored as a number — display formatting (`$84,500`) is handled by
   *  the EditableCell's `format` so editing returns the raw value. */
  amount: number;
  date: string;
}

const initialData: Row[] = [
  { name: 'Enterprise SaaS', status: 'Active', owner: 'Sarah Chen', amount: 84500, date: 'Mar 28' },
  { name: 'Product-Led Growth', status: 'Active', owner: 'Marcus Rivera', amount: 215000, date: 'Mar 25' },
  { name: 'Channel Partner', status: 'Draft', owner: 'Emily Zhao', amount: 32750, date: 'Mar 30' },
  { name: 'Usage-Based Pricing', status: 'Active', owner: 'David Kim', amount: 156000, date: 'Mar 20' },
  { name: 'Marketplace Listing', status: 'Archived', owner: 'Priya Sharma', amount: 67800, date: 'Feb 15' },
];

const formatAmount = (n: EditableCellValue) => `$${Number(Array.isArray(n) ? n[0] : n).toLocaleString()}`;

const STATUS_TO_TAG_TYPE: Record<string, TagType> = {
  Active: 'accent',
  Draft: 'warning',
  Archived: 'neutral',
};

export function DataTablePreview({ styles, variants }: PreviewProps & { componentId: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  // Owning the rows in state lets the Amount column (made editable
  // below) round-trip its commits back into the table — designers
  // see the new value persist after the edit.
  const [rows, setRows] = useState<Row[]>(initialData);
  const density = variants.density ?? 'default';
  const densityMultiplier = density === 'compact' ? 0.65 : density === 'relaxed' ? 1.4 : 1;
  const cellPy = Math.round((styles.cellPaddingY as number) * densityMultiplier);

  const commitAmount = (index: number) => async (next: EditableCellValue) => {
    // Simulated async commit so designers can see the submitting state.
    await new Promise((r) => setTimeout(r, 300));
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, amount: Number(next) } : r)));
  };

  const commitName = (index: number) => async (next: EditableCellValue) => {
    await new Promise((r) => setTimeout(r, 300));
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, name: String(next) } : r)));
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

  return (
    <div style={{
      // max-content with a floor: the table grows for wide data (a long
      // committed Amount widens its own column) instead of staying locked
      // at 580px and squeezing the other columns into wrapping — the
      // "Name column jumps when I commit a huge number" effect.
      // (fit-content won't do: the canvas parent's available width clamps
      // it right back to the floor.)
      width: 'max-content',
      minWidth: 580,
      border: `1px solid ${styles.borderColor}`,
      borderRadius: styles.borderRadius as number,
      overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: styles.fontSize as number }}>
        <thead>
          <tr style={{ backgroundColor: styles.headerBg as string }}>
            {['Name', 'Status', 'Owner', 'Amount', 'Date'].map((h) => (
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
              {/* Name is an editable text cell — together with the numeric
                  Amount column the preview demos both editor types live in
                  a table. Horizontal padding compensates for the cell's own
                  paddingX so the value aligns with the header. */}
              <td style={{ padding: `${cellPy}px ${(styles.cellPaddingX as number) - 6}px`, fontWeight: 500, color: 'var(--color-text)', borderBottom: `1px solid ${styles.borderColor}` }}>
                <EditableCell
                  value={row.name}
                  onCommit={commitName(i)}
                  type="text"
                  validate={(v) => (String(v).trim() ? null : 'Name is required')}
                />
              </td>
              <td style={{ padding: `${cellPy}px ${styles.cellPaddingX}px`, borderBottom: `1px solid ${styles.borderColor}` }}>
                <Tag type={STATUS_TO_TAG_TYPE[row.status] ?? 'neutral'} size="small">{row.status}</Tag>
              </td>
              <td style={{ padding: `${cellPy}px ${styles.cellPaddingX}px`, color: 'var(--color-text-muted)', borderBottom: `1px solid ${styles.borderColor}` }}>{row.owner}</td>
              {/* Amount column shows the editable-cell affordance live —
                  click any value to edit it. Validation blocks negatives;
                  blur commits via a simulated async handler. */}
              <td style={{ padding: `${cellPy}px ${(styles.cellPaddingX as number) - 6}px`, fontWeight: 500, color: 'var(--color-text)', borderBottom: `1px solid ${styles.borderColor}` }}>
                <EditableCell
                  value={row.amount}
                  onCommit={commitAmount(i)}
                  type="number"
                  format={formatAmount}
                  validate={(v) => (Number(v) < 0 ? 'Must be ≥ 0' : null)}
                />
              </td>
              <td style={{ padding: `${cellPy}px ${styles.cellPaddingX}px`, color: 'var(--color-text-muted)', borderBottom: `1px solid ${styles.borderColor}` }}>{row.date}</td>
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
