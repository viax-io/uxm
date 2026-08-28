export interface ThemeToken {
  name: string;
  variable: string;
  cssVar: string;
  hex: string;
  darkHex: string;
  group: 'surfaces' | 'text' | 'borders' | 'accent' | 'highlights' | 'categories' | 'semantic';
  /**
   * Promoted into Brand Settings' Identity section as a top-level brand knob
   * (the full token list stays the expert layer). Curated HERE, in the
   * canonical catalog, so the promotion survives token reshuffles — a
   * hardcoded list in the editor would silently drift. Keep this rare: it
   * only earns its place on tokens that FAN OUT (the accent base drives the
   * whole ramp), not ones that merely relocate a row.
   */
  identity?: boolean;
}

export const themeTokens: ThemeToken[] = [
  // ── Surfaces ──
  { name: 'Surface', variable: 'var(--color-surface)', cssVar: '--color-surface', hex: '#F8F7F6', darkHex: '#141414', group: 'surfaces' },
  { name: 'Surface Alt', variable: 'var(--color-surface-alt)', cssVar: '--color-surface-alt', hex: '#F2F1F0', darkHex: '#1C1C1C', group: 'surfaces' },
  { name: 'Card', variable: 'var(--color-card)', cssVar: '--color-card', hex: '#FFFFFF', darkHex: '#0B0B0B', group: 'surfaces' },

  // ── Text ──
  { name: 'Text', variable: 'var(--color-text)', cssVar: '--color-text', hex: '#1E1E1E', darkHex: '#F5F5F5', group: 'text' },
  { name: 'Text Strong', variable: 'var(--color-text-strong)', cssVar: '--color-text-strong', hex: '#4A4A4A', darkHex: '#C8C8C8', group: 'text' },
  { name: 'Text Muted', variable: 'var(--color-text-muted)', cssVar: '--color-text-muted', hex: '#9CA3AF', darkHex: '#8A8A8A', group: 'text' },
  { name: 'Text Subtle', variable: 'var(--color-text-subtle)', cssVar: '--color-text-subtle', hex: '#CBD5E1', darkHex: '#5A5A5A', group: 'text' },
  { name: 'Text Inverse', variable: 'var(--color-text-inverse)', cssVar: '--color-text-inverse', hex: '#FFFFFF', darkHex: '#0B0B0B', group: 'text' },

  // ── Borders ──
  { name: 'Border', variable: 'var(--color-border)', cssVar: '--color-border', hex: '#EBEBEA', darkHex: '#2A2A2A', group: 'borders' },

  // ── Accent ── (brand colour first; the others derive from its hue)
  { name: 'Accent', variable: 'var(--color-accent)', cssVar: '--color-accent', hex: '#3ECC87', darkHex: '#4FD99A', group: 'accent', identity: true },
  { name: 'Accent Subtle', variable: 'var(--color-accent-subtle)', cssVar: '--color-accent-subtle', hex: '#E6FFD1', darkHex: '#0F3A1F', group: 'accent' },
  { name: 'Accent Light', variable: 'var(--color-accent-light)', cssVar: '--color-accent-light', hex: '#90E9B8', darkHex: '#2E8B57', group: 'accent' },
  { name: 'Accent Bold', variable: 'var(--color-accent-bold)', cssVar: '--color-accent-bold', hex: '#1E7150', darkHex: '#8AE6B4', group: 'accent' },

  // ── Highlights ──
  { name: 'Highlight Warm', variable: 'var(--color-highlight-warm)', cssVar: '--color-highlight-warm', hex: '#FCD0A1', darkHex: '#8A5A2B', group: 'highlights' },
  { name: 'Highlight Cool', variable: 'var(--color-highlight-cool)', cssVar: '--color-highlight-cool', hex: '#C3BEF7', darkHex: '#4D4A7F', group: 'highlights' },
  { name: 'On Highlight Warm', variable: 'var(--color-on-highlight-warm)', cssVar: '--color-on-highlight-warm', hex: '#7C6B3E', darkHex: '#FCD0A1', group: 'highlights' },
  { name: 'On Highlight Cool', variable: 'var(--color-on-highlight-cool)', cssVar: '--color-on-highlight-cool', hex: '#5B54A0', darkHex: '#C3BEF7', group: 'highlights' },

  // ── Category markers ──
  { name: 'Composite', variable: 'var(--color-category-composite)', cssVar: '--color-category-composite', hex: '#F472B6', darkHex: '#F9A8D4', group: 'categories' },
  { name: 'Diagram', variable: 'var(--color-category-diagram)', cssVar: '--color-category-diagram', hex: '#6366F1', darkHex: '#818CF8', group: 'categories' },

  // ── Semantic ──
  { name: 'Success Bg', variable: 'var(--color-success-bg)', cssVar: '--color-success-bg', hex: '#F0FDF4', darkHex: '#0F2A18', group: 'semantic' },
  { name: 'Success Text', variable: 'var(--color-success-text)', cssVar: '--color-success-text', hex: '#166534', darkHex: '#86EFAC', group: 'semantic' },
  { name: 'Success Border', variable: 'var(--color-success-border)', cssVar: '--color-success-border', hex: '#BBF7D0', darkHex: '#1E4A2C', group: 'semantic' },
  { name: 'Warning Bg', variable: 'var(--color-warning-bg)', cssVar: '--color-warning-bg', hex: '#FFFBEB', darkHex: '#2B1F0F', group: 'semantic' },
  { name: 'Warning Text', variable: 'var(--color-warning-text)', cssVar: '--color-warning-text', hex: '#92400E', darkHex: '#FCD34D', group: 'semantic' },
  { name: 'Warning Border', variable: 'var(--color-warning-border)', cssVar: '--color-warning-border', hex: '#FDE68A', darkHex: '#4A3A1F', group: 'semantic' },
  { name: 'Danger Bg', variable: 'var(--color-danger-bg)', cssVar: '--color-danger-bg', hex: '#FEF2F2', darkHex: '#2B1214', group: 'semantic' },
  { name: 'Danger Text', variable: 'var(--color-danger-text)', cssVar: '--color-danger-text', hex: '#991B1B', darkHex: '#FCA5A5', group: 'semantic' },
  { name: 'Danger Border', variable: 'var(--color-danger-border)', cssVar: '--color-danger-border', hex: '#FECACA', darkHex: '#4A1F22', group: 'semantic' },
  { name: 'Info Bg', variable: 'var(--color-info-bg)', cssVar: '--color-info-bg', hex: '#EFF6FF', darkHex: '#0F1F3A', group: 'semantic' },
  { name: 'Info Text', variable: 'var(--color-info-text)', cssVar: '--color-info-text', hex: '#1E40AF', darkHex: '#93C5FD', group: 'semantic' },
  { name: 'Info Border', variable: 'var(--color-info-border)', cssVar: '--color-info-border', hex: '#BFDBFE', darkHex: '#1E3A6A', group: 'semantic' },
];

/** Look up a token by its CSS variable string */
export function findToken(value: string): ThemeToken | undefined {
  return themeTokens.find((t) => t.variable === value);
}

/** Check if a value is a theme token reference (vs a raw hex) */
export function isTokenValue(value: string): boolean {
  return value.startsWith('var(--color-');
}

/** Get the display hex for a value — resolves tokens to their hex, passes through raw hex */
export function resolveHex(value: string): string {
  const token = findToken(value);
  return token ? token.hex : value;
}
