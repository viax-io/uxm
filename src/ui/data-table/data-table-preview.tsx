import { useState } from 'react';

import type { PreviewProps } from '@/previews/types';
import { Tag, type TagType } from '@/ui';

const data = [
  { name: 'Enterprise SaaS', status: 'Active', owner: 'Sarah Chen', amount: '$84,500', date: 'Mar 28' },
  { name: 'Product-Led Growth', status: 'Active', owner: 'Marcus Rivera', amount: '$215,000', date: 'Mar 25' },
  { name: 'Channel Partner', status: 'Draft', owner: 'Emily Zhao', amount: '$32,750', date: 'Mar 30' },
  { name: 'Usage-Based Pricing', status: 'Active', owner: 'David Kim', amount: '$156,000', date: 'Mar 20' },
  { name: 'Marketplace Listing', status: 'Archived', owner: 'Priya Sharma', amount: '$67,800', date: 'Feb 15' },
];

const STATUS_TO_TAG_TYPE: Record<string, TagType> = {
  Active: 'accent',
  Draft: 'warning',
  Archived: 'neutral',
};

export function DataTablePreview({ styles, variants }: PreviewProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const density = variants.density ?? 'default';
  const densityMultiplier = density === 'compact' ? 0.65 : density === 'relaxed' ? 1.4 : 1;
  const cellPy = Math.round((styles.cellPaddingY as number) * densityMultiplier);

  return (
    <div style={{
      width: 580,
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
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                backgroundColor: hovered === i ? (styles.rowHoverBg as string) : (styles.rowBg as string),
                transition: 'background-color 0.1s',
              }}
            >
              <td style={{ padding: `${cellPy}px ${styles.cellPaddingX}px`, fontWeight: 500, color: 'var(--color-text)', borderBottom: `1px solid ${styles.borderColor}` }}>{row.name}</td>
              <td style={{ padding: `${cellPy}px ${styles.cellPaddingX}px`, borderBottom: `1px solid ${styles.borderColor}` }}>
                <Tag type={STATUS_TO_TAG_TYPE[row.status] ?? 'neutral'} size="small">{row.status}</Tag>
              </td>
              <td style={{ padding: `${cellPy}px ${styles.cellPaddingX}px`, color: 'var(--color-text-muted)', borderBottom: `1px solid ${styles.borderColor}` }}>{row.owner}</td>
              <td style={{ padding: `${cellPy}px ${styles.cellPaddingX}px`, fontWeight: 500, color: 'var(--color-text)', borderBottom: `1px solid ${styles.borderColor}` }}>{row.amount}</td>
              <td style={{ padding: `${cellPy}px ${styles.cellPaddingX}px`, color: 'var(--color-text-muted)', borderBottom: `1px solid ${styles.borderColor}` }}>{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
