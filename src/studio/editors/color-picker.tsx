import { useRef, useState, useEffect, useCallback, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

import { themeTokens, findToken, isTokenValue, resolveHex, type ThemeToken } from '@/tokens';
import { Icon } from '@/ui';
import { SectionHeader } from '@/ui';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string | number | boolean) => void;
}

const groupLabels: Record<string, string> = {
  surfaces: 'Surfaces',
  text: 'Text',
  borders: 'Borders',
  accent: 'Accent',
  highlights: 'Highlights',
  semantic: 'Semantic',
};

const groupOrder = ['surfaces', 'text', 'borders', 'accent', 'highlights', 'semantic'];

// SectionHeader override for the dropdown group labels — 10px font
// (vs. 11px default) and zero margin-bottom because the parent's
// `pb-1` already owns the spacing.
const GROUP_HEADER_STYLE: CSSProperties = {
  ['--uxm-section-header-title-size' as string]: '10px',
  ['--uxm-section-header-margin-bottom' as string]: '0',
};

function groupTokens(tokens: ThemeToken[]) {
  const groups: Record<string, ThemeToken[]> = {};
  for (const t of tokens) {
    (groups[t.group] ??= []).push(t);
  }
  return groupOrder.filter((g) => groups[g]).map((g) => ({ key: g, label: groupLabels[g], tokens: groups[g] }));
}

/**
 * Resolve a token reference to its CURRENT computed hex — brand- and
 * theme-aware — so the custom picker / native input start from the applied
 * value, not the library's static default. Falls back to the static token hex,
 * then the raw value (SSR / unresolved). Swatch markers paint the `var(...)`
 * directly so CSS resolves them live; this is only for the hex-typed surfaces.
 */
function liveHex(value: string): string {
  if (typeof document !== 'undefined') {
    const token = findToken(value);
    if (token) {
      const computed = getComputedStyle(document.documentElement)
        .getPropertyValue(token.cssVar)
        .trim();
      if (/^#[0-9A-Fa-f]{6}$/.test(computed)) return computed;
    }
  }
  return resolveHex(value);
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customHex, setCustomHex] = useState('');
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nativePickerRef = useRef<HTMLInputElement>(null);

  const isNone = value === 'none';
  const token = !isNone && isTokenValue(value) ? findToken(value) : undefined;
  // Hex for the custom picker / native input (must be a literal hex), resolved
  // live so it reflects the applied brand.
  const displayHex = isNone ? 'transparent' : liveHex(value);
  // Colour for the visible swatch marker: paint the token's `var(...)` directly
  // so CSS resolves the applied brand value (and current theme); a raw hex
  // value passes through unchanged.
  const swatchColor = isNone ? 'transparent' : value;
  const displayLabel = isNone ? 'None' : token ? token.name : value;

  // Sync custom hex field when value changes externally
  useEffect(() => {
    if (!isTokenValue(value)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional external-value → custom-hex sync
      setCustomHex(value);
    }
  }, [value]);

  // Position dropdown relative to trigger
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4,
      left: rect.right - 220,
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      setOpen(false);
      setCustomMode(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function selectToken(t: ThemeToken) {
    onChange(t.variable);
    setOpen(false);
    setCustomMode(false);
  }

  function applyCustomHex(hex: string) {
    const cleaned = hex.trim();
    if (/^#[0-9A-Fa-f]{3,8}$/.test(cleaned)) {
      onChange(cleaned);
    }
  }

  const grouped = groupTokens(themeTokens);

  const dropdown = open
    ? createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[9999] w-[220px] rounded-xl border border-border bg-card shadow-lg overflow-hidden"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          {/* Theme tokens list */}
          {!customMode && (
            <div className="max-h-[280px] overflow-y-auto py-1">
              {/* "None" — explicit no-color sentinel; renderers treat as transparent. */}
              <button
                onClick={() => { onChange('none'); setOpen(false); }}
                className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[12px] transition-colors ${
                  isNone
                    ? 'bg-accent-subtle/50 text-text font-medium'
                    : 'text-text-strong hover:bg-surface-alt'
                }`}
              >
                <span
                  className="h-4 w-4 flex-shrink-0 rounded border border-border/60 relative overflow-hidden"
                  style={{ backgroundColor: 'transparent' }}
                  aria-hidden
                >
                  <span
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top right, transparent calc(50% - 1px), var(--color-danger-text) calc(50% - 1px), var(--color-danger-text) calc(50% + 1px), transparent calc(50% + 1px))',
                    }}
                  />
                </span>
                <span className="flex-1 truncate">None</span>
                {isNone && (
                  <Icon glyph="check" size={14} strokeWidth={2.5} className="flex-shrink-0 text-accent" />
                )}
              </button>
              {grouped.map((group) => (
                <div key={group.key}>
                  <div className="px-3 pt-2 pb-1">
                    {/* Group label uses the SectionHeader atom with two
                        size overrides: 10px font (vs. 11px default) for
                        the dense dropdown context, and 0 margin-bottom
                        because the surrounding `pb-1` owns the spacing. */}
                    <SectionHeader style={GROUP_HEADER_STYLE}>
                      {group.label}
                    </SectionHeader>
                  </div>
                  {group.tokens.map((t) => {
                    const isActive = value === t.variable;
                    return (
                      <button
                        key={t.variable}
                        onClick={() => selectToken(t)}
                        className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[12px] transition-colors ${
                          isActive
                            ? 'bg-accent-subtle/50 text-text font-medium'
                            : 'text-text-strong hover:bg-surface-alt'
                        }`}
                      >
                        <span
                          className="h-4 w-4 flex-shrink-0 rounded border border-border/60"
                          style={{ backgroundColor: t.variable }}
                        />
                        <span className="flex-1 truncate">{t.name}</span>
                        {isActive && (
                          <Icon glyph="check" size={14} strokeWidth={2.5} className="flex-shrink-0 text-accent" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Custom color section */}
          {customMode && (
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => nativePickerRef.current?.click()}
                  className="h-8 w-8 flex-shrink-0 rounded-lg border border-border shadow-sm cursor-pointer"
                  style={{ backgroundColor: customHex || displayHex }}
                />
                <input
                  ref={nativePickerRef}
                  type="color"
                  value={customHex || displayHex}
                  onChange={(e) => {
                    setCustomHex(e.target.value);
                    onChange(e.target.value);
                  }}
                  className="sr-only"
                />
                <input
                  type="text"
                  value={customHex}
                  onChange={(e) => {
                    setCustomHex(e.target.value);
                    applyCustomHex(e.target.value);
                  }}
                  onBlur={() => applyCustomHex(customHex)}
                  placeholder="#000000"
                  className="flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-[12px] font-mono text-text-strong outline-none focus:border-accent"
                />
              </div>
              <button
                onClick={() => setCustomMode(false)}
                className="w-full text-[11px] text-text-muted hover:text-text-strong transition-colors py-1"
              >
                ← Back to theme colors
              </button>
            </div>
          )}

          {/* Footer: switch to custom */}
          {!customMode && (
            <div className="border-t border-border px-3 py-2">
              <button
                onClick={() => {
                  setCustomMode(true);
                  setCustomHex(isTokenValue(value) ? resolveHex(value) : value);
                }}
                className="flex w-full items-center gap-2 text-[12px] text-text-muted hover:text-text-strong transition-colors"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded border border-dashed border-text/20">
                  <Icon glyph="paint-brush" size={10} strokeWidth={2} />
                </span>
                Custom color…
              </button>
            </div>
          )}
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-[13px] text-text-strong flex-1 min-w-0 truncate">{label}</span>

      {/* Trigger button */}
      <button
        ref={triggerRef}
        onClick={() => { setOpen(!open); setCustomMode(false); }}
        className="w-44 shrink-0 flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1.5 text-[12px] text-text-strong hover:border-accent/40 transition-colors cursor-pointer"
      >
        <span
          className="h-4 w-4 flex-shrink-0 rounded border border-border/60 relative overflow-hidden"
          style={{ backgroundColor: swatchColor }}
        >
          {isNone && (
            <span
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top right, transparent calc(50% - 1px), var(--color-danger-text) calc(50% - 1px), var(--color-danger-text) calc(50% + 1px), transparent calc(50% + 1px))',
              }}
              aria-hidden
            />
          )}
        </span>
        <span className="truncate flex-1 text-left min-w-0">{displayLabel}</span>
        <Icon glyph="chevron-down" size={12} strokeWidth={2} className="flex-shrink-0 text-text-subtle" />
      </button>

      {dropdown}
    </div>
  );
}
