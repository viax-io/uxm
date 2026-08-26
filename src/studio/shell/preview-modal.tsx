import { useState, useMemo, useCallback, useEffect, type CSSProperties } from 'react';

import { Banner } from '@/ui';
import { ButtonPrimary } from '@/ui';
import { Checkbox } from '@/ui';
import { Chip } from '@/ui';
import { Icon } from '@/ui';
import { IconButton } from '@/ui';
import { InputWithIcon } from '@/ui';
import { Select, TextInput } from '@/ui';
import { Tag, type TagType } from '@/ui';
import { ToggleSwitch } from '@/ui';

import { useUxm } from '../lib/context';
import { getComponentDef, registry } from '../lib/registry';
import { useGlobalTheme } from '../lib/use-global-theme';

/**
 * This mock is the last thing a user sees before Publish, so it has to reflect
 * the brand the way the shipped atoms do. It hand-rolls its markup, which means
 * it does not inherit the stylesheets' chains — these mirror them by hand.
 *
 * `scaled()` multiplies OUTSIDE any var(), the same rule the stylesheets follow,
 * and parenthesises derived sizes so an offset stays proportional instead of
 * shrinking away as text grows (a `-1px` at 150% should be `-1.5px`, not `-1px`).
 */
type TypeRole = 'display' | 'page-title' | 'section-title';

const scaled = (px: number | string, role?: TypeRole) => {
  const base = typeof px === 'number' ? `${px}px` : px;
  return `calc(${base}${role ? ` * var(--type-${role}-scale, 1)` : ''} * var(--type-scale, 1))`;
};
/** `<knob>px - offset`, scaled as one expression. */
const derived = (px: number, offset: number) => scaled(`(${px}px - ${offset}px)`);
const roleFont = (role: TypeRole) =>
  `var(--type-${role}-font, var(--brand-heading-font, inherit))`;
const roleWeight = (role: TypeRole, fallback: number) =>
  `var(--type-${role}-weight, var(--brand-heading-weight, ${fallback}))`;

function useResolved(componentId: string) {
  const { getOverrides } = useUxm();
  const def = getComponentDef(componentId);
  const overrides = getOverrides(componentId);

  return useMemo(() => {
    if (!def) return {};
    const styles: Record<string, string | number | boolean> = {};
    for (const prop of def.styleProperties) {
      styles[prop.key] = overrides[prop.key] ?? prop.defaultValue;
    }
    return styles;
  }, [def, overrides]);
}

// ── Inline mini-components that use resolved styles ──

function MiniButton({
  label, variant = 'primary', onClick, icon,
}: {
  label: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  onClick?: () => void;
  icon?: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const sP = useResolved('button-primary');
  const sS = useResolved('button-secondary');
  const sT = useResolved('button-tertiary');
  const sG = useResolved('button-ghost');
  const s = variant === 'secondary' ? sS : variant === 'tertiary' ? sT : variant === 'ghost' ? sG : sP;

  // Resolve the current visible color values per pointer state. Reads the
  // per-state knobs (hover*/active*) added to each button atom — falls back
  // to the default state's value when a state knob isn't defined yet, so
  // designers can drop in a partial save without breaking the preview.
  const fallback = <T,>(stateValue: T | undefined, base: T) =>
    stateValue !== undefined ? stateValue : base;
  const currentBg = pressed
    ? fallback(s.activeBackgroundColor as string | undefined, s.backgroundColor as string)
    : hover
    ? fallback(s.hoverBackgroundColor as string | undefined, s.backgroundColor as string)
    : (s.backgroundColor as string);
  const currentColor = pressed
    ? fallback(s.activeColor as string | undefined, s.color as string)
    : hover
    ? fallback(s.hoverColor as string | undefined, s.color as string)
    : (s.color as string);
  const currentBorderColor = pressed
    ? fallback(s.activeBorderColor as string | undefined, s.borderColor as string)
    : hover
    ? fallback(s.hoverBorderColor as string | undefined, s.borderColor as string)
    : (s.borderColor as string | undefined);

  const border =
    variant === 'secondary' ? `1.5px solid ${currentBorderColor}` :
    variant === 'tertiary' ? `1px solid ${currentBorderColor}` :
    'none';

  const baseStyle: React.CSSProperties = {
    backgroundColor: currentBg,
    color: currentColor,
    border,
    borderRadius: s.borderRadius as number,
    padding: `${s.paddingY}px ${s.paddingX}px`,
    fontSize: scaled(`${s.fontSize}px`),
    fontWeight: s.fontWeight as string,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    transition: 'background-color 0.15s, color 0.15s, border-color 0.15s, transform 0.08s',
    transform: pressed ? 'scale(0.97)' : 'none',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={baseStyle}
    >
      {icon}
      {label}
    </button>
  );
}

function MiniStatCard({ label, value, trend, up }: { label: string; value: string; trend: string; up: boolean }) {
  const s = useResolved('stat-card');
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: s.backgroundColor as string,
        border: `1px solid ${hover ? 'var(--color-accent-light)' : s.borderColor}`,
        borderRadius: s.borderRadius as number, padding: s.padding as number, flex: 1,
        transition: 'border-color 0.15s, transform 0.15s',
        transform: hover ? 'translateY(-1px)' : 'none',
        cursor: 'default',
      }}
    >
      <p style={{ fontSize: scaled(`${s.labelSize}px`), color: 'var(--color-text-muted)', fontWeight: 500, margin: 0 }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
        <span style={{
          fontFamily: roleFont('display'),
          fontSize: scaled(`${(s.valueSize as number) * 0.8}px`, 'display'),
          fontWeight: roleWeight('display', 700),
          color: 'var(--color-text)',
        }}>{value}</span>
        <span style={{
          fontSize: scaled(11), fontWeight: 600,
          color: up ? (s.trendUpColor as string) : (s.trendDownColor as string),
          display: 'inline-flex', alignItems: 'center', gap: 2,
        }}>
          <Icon
            glyph="arrow-up"
            size={10}
            strokeWidth={2.5}
            style={{ transform: up ? 'none' : 'rotate(180deg)' }}
          />
          {trend}
        </span>
      </div>
    </div>
  );
}

function MiniCard() {
  const s = useResolved('card');
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: s.backgroundColor as string, border: `1px solid ${s.borderColor}`,
        borderRadius: s.borderRadius as number, padding: s.padding as number,
        boxShadow: hover ? 'var(--shadow-md)' : (s.shadow ? 'var(--shadow-sm)' : 'none'),
        transition: 'box-shadow 0.2s, transform 0.15s',
        transform: hover ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-bold)' }}>
          <Icon glyph="bolt" size={16} />
        </div>
        <div>
          <h4 style={{
            fontFamily: roleFont('section-title'),
            fontSize: scaled(13, 'section-title'),
            fontWeight: roleWeight('section-title', 600),
            color: 'var(--color-text)', margin: 0,
          }}>Quick Analytics</h4>
          <p style={{ fontSize: scaled(11), color: 'var(--color-text-muted)', margin: 0 }}>Updated 2h ago</p>
        </div>
      </div>
      <p style={{ fontSize: scaled(12), color: 'var(--color-text-muted)', lineHeight: 'var(--type-body-line-height, 1.5)', margin: 0 }}>
        Track key metrics and performance across active motions.
      </p>
    </div>
  );
}

function MiniInput({ label, placeholder, icon }: { label: string; placeholder: string; icon?: React.ReactNode }) {
  // Render the real <TextInput> / <InputWithIcon> atom and project the
  // full var set onto a wrapper. Atoms' own CSS handles :hover / :focus
  // / :disabled — so edits to bg / border / padding flow through the
  // cascade automatically, and focus / hover behaviour matches what
  // ships to consumers. No more inline border-color juggling.
  const id = icon ? 'input-with-icon' : 'input-text';
  const s = useResolved(id);
  const cssVars = (icon
    ? {
        '--uxm-input-with-icon-bg': s.backgroundColor as string,
        '--uxm-input-with-icon-border-color': s.borderColor as string,
        '--uxm-input-with-icon-color': s.color as string,
        '--uxm-input-with-icon-radius': s.borderRadius != null ? `${s.borderRadius}px` : undefined,
        '--uxm-input-with-icon-padding-x': s.paddingX != null ? `${s.paddingX}px` : undefined,
        '--uxm-input-with-icon-padding-y': s.paddingY != null ? `${s.paddingY}px` : undefined,
        '--uxm-input-with-icon-font-size': s.fontSize != null ? `${s.fontSize}px` : undefined,
        '--uxm-input-with-icon-icon-color': s.iconColor as string,
        '--uxm-input-with-icon-icon-size': s.iconSize != null ? `${s.iconSize}px` : undefined,
        '--uxm-input-with-icon-icon-offset': s.iconOffset != null ? `${s.iconOffset}px` : undefined,
        '--uxm-input-with-icon-hover-bg': s.hoverBg as string,
        '--uxm-input-with-icon-hover-border': s.hoverBorder as string,
        '--uxm-input-with-icon-focus-border': s.focusBorder as string,
        '--uxm-input-with-icon-focus-ring': s.focusRing as string,
        '--uxm-input-with-icon-disabled-bg': s.disabledBg as string,
        '--uxm-input-with-icon-disabled-border': s.disabledBorder as string,
        '--uxm-input-with-icon-disabled-color': s.disabledColor as string,
        '--uxm-input-with-icon-disabled-opacity':
          s.disabledOpacity != null ? String(s.disabledOpacity) : undefined,
      }
    : {
        '--uxm-input-text-bg': s.backgroundColor as string,
        '--uxm-input-text-border-color': s.borderColor as string,
        '--uxm-input-text-color': s.color as string,
        '--uxm-input-text-border-radius': s.borderRadius != null ? `${s.borderRadius}px` : undefined,
        '--uxm-input-text-padding-x': s.paddingX != null ? `${s.paddingX}px` : undefined,
        '--uxm-input-text-padding-y': s.paddingY != null ? `${s.paddingY}px` : undefined,
        '--uxm-input-text-font-size': s.fontSize != null ? `${s.fontSize}px` : undefined,
        '--uxm-input-text-hover-bg': s.hoverBg as string,
        '--uxm-input-text-hover-border': s.hoverBorder as string,
        '--uxm-input-text-focus-border': s.focusBorder as string,
        '--uxm-input-text-focus-ring': s.focusRing as string,
        '--uxm-input-text-disabled-bg': s.disabledBg as string,
        '--uxm-input-text-disabled-border': s.disabledBorder as string,
        '--uxm-input-text-disabled-color': s.disabledColor as string,
        '--uxm-input-text-disabled-opacity':
          s.disabledOpacity != null ? String(s.disabledOpacity) : undefined,
      }) as unknown as CSSProperties;
  return (
    <div style={cssVars}>
      <label style={{ fontSize: scaled(12), fontWeight: 500, color: (s.labelColor as string) ?? 'var(--color-text)', display: 'block', marginBottom: 5 }}>{label}</label>
      {icon ? (
        <InputWithIcon placeholder={placeholder} icon={icon} />
      ) : (
        <TextInput placeholder={placeholder} />
      )}
    </div>
  );
}

function MiniSelect({ label, options, initial }: { label: string; options: string[]; initial?: string }) {
  // Same architecture as MiniInput / MiniCheckbox / MiniToggle — render
  // the real <Select> atom and project the full `--uxm-select-dropdown-*`
  // var set on a wrapper. The atom's own CSS owns :hover / :focus /
  // :disabled, so live edits to the registry flow through automatically.
  // Native <select> means clicking opens the platform picker, which is a
  // small UX change from the prior custom popover but keeps the Mini in
  // sync with the actual Select Dropdown atom we ship.
  const s = useResolved('select-dropdown');
  const [value, setValue] = useState(initial ?? options[0]);
  const cssVars = {
    '--uxm-select-dropdown-bg': s.backgroundColor as string,
    '--uxm-select-dropdown-border-color': s.borderColor as string,
    '--uxm-select-dropdown-color': s.color as string,
    '--uxm-select-dropdown-border-radius': s.borderRadius != null ? `${s.borderRadius}px` : undefined,
    '--uxm-select-dropdown-padding-x': s.paddingX != null ? `${s.paddingX}px` : undefined,
    '--uxm-select-dropdown-padding-y': s.paddingY != null ? `${s.paddingY}px` : undefined,
    '--uxm-select-dropdown-font-size': s.fontSize != null ? `${s.fontSize}px` : undefined,
    '--uxm-select-dropdown-hover-bg': s.hoverBg as string,
    '--uxm-select-dropdown-hover-border': s.hoverBorder as string,
    '--uxm-select-dropdown-focus-border': s.focusBorder as string,
    '--uxm-select-dropdown-focus-ring': s.focusRing as string,
    '--uxm-select-dropdown-disabled-bg': s.disabledBg as string,
    '--uxm-select-dropdown-disabled-border': s.disabledBorder as string,
    '--uxm-select-dropdown-disabled-color': s.disabledColor as string,
    '--uxm-select-dropdown-disabled-opacity':
      s.disabledOpacity != null ? String(s.disabledOpacity) : undefined,
  } as unknown as CSSProperties;
  return (
    <div style={cssVars}>
      <label style={{ fontSize: scaled(12), fontWeight: 500, color: (s.labelColor as string) ?? 'var(--color-text)', display: 'block', marginBottom: 5 }}>{label}</label>
      <Select value={value} onChange={(e) => setValue(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </Select>
    </div>
  );
}

function MiniCheckbox({ label, initial = false }: { label: string; initial?: boolean }) {
  // Render the real Checkbox atom so its CSS (hover / focus / disabled,
  // checked × unchecked × per-state colors) all exercise the same rules
  // that ship to consumers. Project every relevant `--uxm-checkbox-*`
  // custom prop onto a wrapper; the atom's styles.css rules read them
  // and paint accordingly. No more hand-mirroring the registry shape.
  const s = useResolved('checkbox');
  const [checked, setChecked] = useState(initial);
  const cssVars = {
    '--uxm-checkbox-size': s.size != null ? `${s.size}px` : undefined,
    '--uxm-checkbox-border-radius': s.borderRadius != null ? `${s.borderRadius}px` : undefined,
    '--uxm-checkbox-gap': s.gap != null ? `${s.gap}px` : undefined,
    '--uxm-checkbox-unchecked-bg': s.uncheckedBg as string | undefined,
    '--uxm-checkbox-unchecked-border': s.uncheckedBorder as string | undefined,
    '--uxm-checkbox-checked-bg': s.checkedBg as string | undefined,
    '--uxm-checkbox-checked-border': s.checkedBorder as string | undefined,
    '--uxm-checkbox-check-glyph-color': s.checkGlyphColor as string | undefined,
    '--uxm-checkbox-hover-unchecked-bg': s.hoverUncheckedBg as string | undefined,
    '--uxm-checkbox-hover-unchecked-border': s.hoverUncheckedBorder as string | undefined,
    '--uxm-checkbox-hover-checked-bg': s.hoverCheckedBg as string | undefined,
    '--uxm-checkbox-hover-checked-border': s.hoverCheckedBorder as string | undefined,
    '--uxm-checkbox-hover-check-glyph-color': s.hoverCheckGlyphColor as string | undefined,
    '--uxm-checkbox-focus-ring': s.focusRing as string | undefined,
    '--uxm-checkbox-disabled-opacity':
      s.disabledOpacity != null ? String(s.disabledOpacity) : undefined,
    fontSize: scaled(12),
  } as unknown as CSSProperties;
  return (
    <span style={cssVars}>
      <Checkbox checked={checked} onChange={(v) => setChecked(v)}>{label}</Checkbox>
    </span>
  );
}

function MiniToggle({ label = 'Notifications', initial = true }: { label?: string; initial?: boolean }) {
  // Same rationale as MiniCheckbox — render the real ToggleSwitch atom
  // and project the full `--uxm-toggle-switch-*` var set on a wrapper.
  // Keeps state-coverage (off / on × default / hover / focus + disabled)
  // in sync with what consumers see, no hand-rolled track/thumb markup
  // to drift out of date when the registry changes.
  const s = useResolved('toggle-switch');
  const [on, setOn] = useState(initial);
  const cssVars = {
    '--uxm-toggle-switch-width': s.width != null ? `${s.width}px` : undefined,
    '--uxm-toggle-switch-height': s.height != null ? `${s.height}px` : undefined,
    '--uxm-toggle-switch-off-track': s.offTrack as string | undefined,
    '--uxm-toggle-switch-off-thumb': s.offThumb as string | undefined,
    '--uxm-toggle-switch-on-track': s.onTrack as string | undefined,
    '--uxm-toggle-switch-on-thumb': s.onThumb as string | undefined,
    '--uxm-toggle-switch-hover-off-track': s.hoverOffTrack as string | undefined,
    '--uxm-toggle-switch-hover-off-thumb': s.hoverOffThumb as string | undefined,
    '--uxm-toggle-switch-hover-on-track': s.hoverOnTrack as string | undefined,
    '--uxm-toggle-switch-hover-on-thumb': s.hoverOnThumb as string | undefined,
    '--uxm-toggle-switch-focus-ring': s.focusRing as string | undefined,
    '--uxm-toggle-switch-disabled-opacity':
      s.disabledOpacity != null ? String(s.disabledOpacity) : undefined,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: scaled(12),
    color: 'var(--color-text)',
  } as unknown as CSSProperties;
  return (
    <span style={cssVars}>
      <ToggleSwitch checked={on} onChange={(v) => setOn(v)} />
      <span>{label}</span>
    </span>
  );
}

function MiniButtonGroup() {
  const s = useResolved('button-group');
  const opts = ['Day', 'Week', 'Month'];
  const [active, setActive] = useState(1);
  return (
    <div style={{ display: 'inline-flex', border: `1px solid ${s.borderColor}`, borderRadius: s.borderRadius as number, overflow: 'hidden' }}>
      {opts.map((o, i) => (
        <button
          key={o}
          onClick={() => setActive(i)}
          style={{
            backgroundColor: i === active ? (s.activeBg as string) : (s.inactiveBg as string),
            color: i === active ? (s.activeText as string) : (s.inactiveText as string),
            padding: `${(s.paddingY as number) * 0.75}px ${(s.paddingX as number) * 0.85}px`,
            fontSize: derived(s.fontSize as number, 1), fontWeight: i === active ? 600 : 500,
            border: 'none', borderRight: i < 2 ? `1px solid ${s.borderColor}` : 'none', cursor: 'pointer',
            transition: 'background-color 0.15s, color 0.15s',
          }}
        >{o}</button>
      ))}
    </div>
  );
}

// MiniFilterChips renders the actual <Chip mode="filter"> atom — same way
// InlineFilter composes chips in production. The previous hand-rolled
// version read InlineFilter registry knobs (chipBg / chipActiveBg /
// borderRadius / paddingX / paddingY / fontSize) that were removed when
// InlineFilter was trimmed to layout-only; chip theming now lives on the
// Chip atom's own registry. The undefined readbacks were producing
// `NaN` for `fontSize: (s.fontSize as number) - 1`, which React rejects.
// Switching to the real atom both silences the warning and lets editor
// saves on the Chip registry flow into this preview row automatically.
function MiniFilterChips() {
  const s = useResolved('inline-filter');
  const chips = ['All', 'Active', 'Draft', 'Archived'];
  const [active, setActive] = useState(0);
  return (
    <div style={{ display: 'flex', gap: (s.gap as number) * 0.75 }}>
      {chips.map((c, i) => (
        <Chip
          key={c}
          mode="filter"
          selected={i === active}
          onClick={() => setActive(i)}
        >
          {c}
        </Chip>
      ))}
    </div>
  );
}

function MiniTabs() {
  const s = useResolved('tabs');
  const tabs = ['Overview', 'Motions', 'Pipelines'];
  const [active, setActive] = useState(0);
  return (
    <div style={{
      display: 'inline-flex',
      padding: s.trackPadding as number,
      backgroundColor: s.trackBg as string,
      border: `1px solid ${s.trackBorder}`,
      borderRadius: s.trackRadius as number,
      gap: 2,
    }}>
      {tabs.map((t, i) => (
        <button
          key={t}
          type="button"
          onClick={() => setActive(i)}
          style={{
            backgroundColor: i === active ? (s.activeBg as string) : 'transparent',
            color: i === active ? (s.activeText as string) : (s.inactiveText as string),
            border: 'none',
            borderRadius: s.tabRadius as number,
            padding: `${s.paddingY}px ${s.paddingX}px`,
            fontSize: derived(s.fontSize as number, 1), fontWeight: i === active ? 600 : 500, cursor: 'pointer',
            boxShadow: i === active ? 'var(--shadow-xs)' : 'none',
            transition: 'background-color 0.15s, color 0.15s',
          }}
        >{t}</button>
      ))}
    </div>
  );
}

function MiniAvatar({ initials = 'LR' }: { initials?: string }) {
  const s = useResolved('avatar');
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: (s.size as number) * 0.75, height: (s.size as number) * 0.75,
        borderRadius: s.borderRadius as number,
        backgroundColor: s.backgroundColor as string,
        color: s.color as string,
        border: hover ? `2px solid var(--color-accent)` : '2px solid transparent',
        fontSize: derived(s.fontSize as number, 2),
        fontWeight: s.fontWeight as string,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      {initials}
    </button>
  );
}


function MiniTable() {
  const s = useResolved('data-table');
  const rows = [
    { name: 'Enterprise SaaS', status: 'Active', amount: '$84,500' },
    { name: 'Product-Led Growth', status: 'Active', amount: '$215,000' },
    { name: 'Channel Partner', status: 'Draft', amount: '$32,750' },
  ];
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const STATUS_TO_TAG_TYPE: Record<string, TagType> = {
    Active: 'accent',
    Draft: 'warning',
  };
  return (
    <div style={{ border: `1px solid ${s.borderColor}`, borderRadius: s.borderRadius as number, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: derived(s.fontSize as number, 1) }}>
        <thead>
          <tr style={{ backgroundColor: s.headerBg as string }}>
            {['Name', 'Status', 'Amount'].map((h) => (
              <th key={h} style={{
                textAlign: 'left', padding: `${(s.cellPaddingY as number) * 0.75}px ${s.cellPaddingX}px`,
                fontWeight: 600, color: s.headerText as string, borderBottom: `1px solid ${s.borderColor}`, fontSize: derived(s.fontSize as number, 2),
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.name}
              onMouseEnter={() => setHoverRow(i)}
              onMouseLeave={() => setHoverRow(null)}
              style={{
                backgroundColor: hoverRow === i ? 'var(--color-surface-alt)' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.12s',
              }}
            >
              <td style={{ padding: `${(s.cellPaddingY as number) * 0.75}px ${s.cellPaddingX}px`, fontWeight: 500, color: 'var(--color-text)', borderBottom: `1px solid ${s.borderColor}` }}>{r.name}</td>
              <td style={{ padding: `${(s.cellPaddingY as number) * 0.75}px ${s.cellPaddingX}px`, borderBottom: `1px solid ${s.borderColor}` }}>
                <Tag type={STATUS_TO_TAG_TYPE[r.status] ?? 'neutral'} size="small">{r.status}</Tag>
              </td>
              <td style={{ padding: `${(s.cellPaddingY as number) * 0.75}px ${s.cellPaddingX}px`, fontWeight: 500, color: 'var(--color-text)', borderBottom: `1px solid ${s.borderColor}` }}>{r.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Success state ──

function BuildSuccess({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', gap: 16, textAlign: 'center',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%', backgroundColor: 'var(--color-accent-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Animated BuildSuccess check — kept inline because the
            stroke-dasharray draw animation is per-path. <Icon> doesn't
            forward per-path style, so swapping would lose the draw
            effect. The path itself is the same as the `check` glyph. */}
        <svg width={36} height={36} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="var(--color-accent-bold)">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"
            style={{
              strokeDasharray: 30,
              strokeDashoffset: 0,
              animation: 'drawCheck 0.4s ease-out 0.2s both',
            }}
          />
        </svg>
      </div>
      <div>
        <h2 id="uxm-preview-modal-title" style={{
          fontFamily: roleFont('page-title'),
          fontSize: scaled(22, 'page-title'),
          fontWeight: roleWeight('page-title', 700),
          color: 'var(--color-text)', margin: '0 0 6px',
        }}>Design system ready</h2>
        <p style={{ fontSize: scaled(14), color: 'var(--color-text-muted)', margin: 0 }}>{registry.length} components configured</p>
      </div>
      <ButtonPrimary onClick={onClose} style={{ marginTop: 8 }}>
        Close
      </ButtonPrimary>
    </div>
  );
}

// ── Main modal ──

export function PreviewModal({ onClose }: { onClose: () => void }) {
  const { getAllOverrides, brand, persistence, capabilities } = useUxm();
  const globalTheme = useGlobalTheme();
  const activeLogo = globalTheme === 'dark' ? (brand.logoUrlDark || brand.logoUrl) : brand.logoUrl;
  const activeFavicon = globalTheme === 'dark' ? (brand.faviconUrlDark || brand.faviconUrl) : brand.faviconUrl;
  const [built, setBuilt] = useState(false);
  const [building, setBuilding] = useState(false);
  const [buildError, setBuildError] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  // Escape-to-close — the modal has no focus trap, so this is the primary
  // keyboard dismissal path.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleBuild = useCallback(async () => {
    setBuilding(true);
    setBuildError(null);
    try {
      await persistence.save({ overrides: getAllOverrides(), brand });
      setBuilt(true);
    } catch (err) {
      setBuildError(err instanceof Error ? err.message : 'Build failed');
    } finally {
      setBuilding(false);
    }
  }, [getAllOverrides, brand, persistence]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events -- modal backdrop click-to-dismiss; the close control inside is keyboard-accessible
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes scaleIn { from { transform: scale(0) } to { transform: scale(1) } }
        @keyframes drawCheck { from { stroke-dashoffset: 30 } to { stroke-dashoffset: 0 } }
        @keyframes alertSlide { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: translateY(0) } }

        .uxm-browser-tab {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 240px;
          padding: 6px 16px 6px 12px;
          background-color: var(--color-card);
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }
        .uxm-browser-tab::before,
        .uxm-browser-tab::after {
          content: "";
          position: absolute;
          bottom: 0;
          width: 10px;
          height: 10px;
          background-color: transparent;
        }
        .uxm-browser-tab::before {
          left: -10px;
          border-bottom-right-radius: 10px;
          box-shadow: 4px 0 0 0 var(--color-card);
        }
        .uxm-browser-tab::after {
          right: -10px;
          border-bottom-left-radius: 10px;
          box-shadow: -4px 0 0 0 var(--color-card);
        }
      `}</style>

      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events -- backdrop-dismiss guard: stops clicks inside the dialog from bubbling to the backdrop; the dialog panel isn't itself an interactive control */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="uxm-preview-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90vw', maxWidth: 960, height: '85vh', maxHeight: 680,
          backgroundColor: 'var(--color-surface)', borderRadius: 16,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: 'var(--shadow-2xl)',
          animation: 'slideUp 0.25s ease-out',
        }}
      >
        {built ? (
          <BuildSuccess onClose={onClose} />
        ) : (
          <>
            {/* Browser tab strip */}
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: 0,
              paddingTop: 8, paddingLeft: 24, paddingRight: 12,
              backgroundColor: 'var(--color-surface-alt)',
            }}>
              <div className="uxm-browser-tab">
                <img
                  src={activeFavicon || '/favicon.ico'}
                  alt=""
                  width={14}
                  height={14}
                  style={{ flexShrink: 0, objectFit: 'contain' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                />
                <span style={{
                  fontSize: scaled(12), color: 'var(--color-text)', fontWeight: 500,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  Modo — Dashboard
                </span>
              </div>
              <IconButton
                aria-label="Close preview"
                onClick={onClose}
                style={{ marginLeft: 'auto', marginBottom: 6 }}
              >
                <Icon glyph="close" size={16} strokeWidth={1.5} />
              </IconButton>
            </div>

            {/* Dashboard content */}
            <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
              {/* Top row: logo + title + actions + avatar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <img
                    src={activeLogo || '/viax-logo.svg'}
                    alt="Logo"
                    style={{ height: 22, maxWidth: 140, objectFit: 'contain', flexShrink: 0 }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div style={{ height: 22, width: 1, backgroundColor: 'var(--color-border)', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <h3 id="uxm-preview-modal-title" style={{
                      fontFamily: roleFont('page-title'),
                      fontSize: scaled(18, 'page-title'),
                      fontWeight: roleWeight('page-title', 700),
                      color: 'var(--color-text)', margin: 0,
                    }}>Dashboard</h3>
                    <p style={{ fontSize: scaled(12), color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Revenue overview for Q1 2026</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MiniButtonGroup />
                  <MiniButton label="Export" variant="secondary" />
                  <MiniButton label="New Report" />
                  <MiniAvatar />
                </div>
              </div>

              {/* Tabs row */}
              <div style={{ marginBottom: 16 }}>
                <MiniTabs />
              </div>

              {bannerVisible && (
                <div style={{ marginBottom: 16, animation: 'alertSlide 0.25s ease-out' }}>
                  {/* Banner: persistent status announcement inline in the dashboard */}
                  <Banner
                    variant="success"
                    title="Q1 forecast beat target by 12%. Nice work."
                    onDismiss={() => setBannerVisible(false)}
                  />
                </div>
              )}

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                <MiniStatCard label="Total Revenue" value="$48.2K" trend="+12.5%" up />
                <MiniStatCard label="Active Users" value="2,847" trend="+8.2%" up />
                <MiniStatCard label="Churn Rate" value="3.1%" trend="+0.4%" up={false} />
              </div>

              {/* Main: table + sidebar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <MiniFilterChips />
                  </div>
                  <MiniTable />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <MiniCard />
                  <div style={{
                    backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 10, padding: 16,
                  }}>
                    <h4 style={{
                      fontFamily: roleFont('section-title'),
                      fontSize: scaled(13, 'section-title'),
                      fontWeight: roleWeight('section-title', 600),
                      color: 'var(--color-text)', margin: '0 0 12px',
                    }}>Quick Add</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <MiniInput
                        label="Name"
                        placeholder="Motion name"
                        icon={<Icon glyph="pencil" size={14} />}
                      />
                      <MiniSelect label="Segment" options={['Enterprise', 'Mid-Market', 'SMB', 'Startup']} />
                      <MiniCheckbox label="Send confirmation email" initial />
                      <MiniToggle label="Auto-publish" initial={false} />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <MiniButton label="Cancel" variant="tertiary" />
                        <MiniButton label="Create" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: scaled(12), color: 'var(--color-text-muted)', marginRight: 4 }}>Tags:</span>
                <Tag type="success">Active</Tag>
                <Tag type="warning">Draft</Tag>
                <Tag type="info">Q1 2026</Tag>
                <Tag type="neutral">Revenue</Tag>
              </div>
            </div>

            {/* Build CTA — hidden in read-only mode (static portal) */}
            {capabilities.persist && (
              <div style={{
                padding: '16px 24px', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <p style={{ fontSize: scaled(13), color: buildError ? 'var(--color-danger-text)' : 'var(--color-text-muted)', margin: 0 }}>
                  {buildError ?? 'Publish saves your changes to the environment'}
                </p>
                <ButtonPrimary
                  onClick={handleBuild}
                  disabled={building}
                  style={{
                    cursor: building ? 'not-allowed' : 'pointer',
                    opacity: building ? 0.6 : 1,
                  }}
                >
                  <Icon glyph="cursor-arrow-rays" size={16} strokeWidth={2} />
                  {building ? 'Publishing…' : 'Publish'}
                </ButtonPrimary>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
