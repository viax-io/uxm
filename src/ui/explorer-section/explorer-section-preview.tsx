import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { ExplorerSection } from '@/ui';
import { Icon } from '@/ui';

type Styles = PreviewProps['styles'];

const SECTIONS: { name: string; count: number; color: string }[] = [
  { name: 'Buttons', count: 5, color: 'var(--color-accent)' },
  { name: 'Inputs', count: 7, color: 'var(--color-accent-light)' },
  { name: 'Display', count: 12, color: 'var(--color-highlight-warm)' },
];

/**
 * Project every registry knob as a `--uxm-explorer-section-*` custom
 * property on the wrapper. Both the static showcase and the interactive
 * list below read from the same vars; the showcase forces a state via
 * the `--state-*` modifier class, while the interactive list exercises
 * the production `:hover` / `:focus-visible` / `:disabled` rules on
 * real input.
 */
function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-explorer-section-inactive-bg': styles.inactiveBg as string,
    '--uxm-explorer-section-inactive-text': styles.inactiveText as string,
    '--uxm-explorer-section-hover-bg': styles.hoverBg as string,
    '--uxm-explorer-section-hover-text': styles.hoverText as string,
    '--uxm-explorer-section-focus-text': styles.focusText as string,
    '--uxm-explorer-section-focus-ring': styles.focusRing as string,
    '--uxm-explorer-section-disabled-bg': styles.disabledBg as string,
    '--uxm-explorer-section-disabled-text': styles.disabledText as string,
    '--uxm-explorer-section-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
    '--uxm-explorer-section-border-radius': `${styles.borderRadius}px`,
    '--uxm-explorer-section-padding-x': `${styles.paddingX}px`,
    '--uxm-explorer-section-padding-y': `${styles.paddingY}px`,
    '--uxm-explorer-section-font-size': `${styles.fontSize}px`,
    '--uxm-explorer-section-font-weight': styles.fontWeight as string,
    '--uxm-explorer-section-gap': `${styles.gap}px`,
    '--uxm-explorer-section-chevron-color': styles.chevronColor as string,
    '--uxm-explorer-section-chevron-size': `${styles.chevronSize}px`,
    '--uxm-explorer-section-trailing-color': styles.trailingColor as string,
    '--uxm-explorer-section-trailing-size': `${styles.trailingSize}px`,
  } as CSSProperties;
}

/**
 * Static showcase — ONE ExplorerSection hand-rendered with the
 * forced-state class matching the State dropdown. Inert
 * (`pointer-events: none` + `tabIndex={-1}`) so the forced state
 * isn't overridden by real input. Hand-rendered because the atom
 * doesn't expose a way to set the showcase-only `--state-*` modifier.
 */
function StaticShowcase({ state, open }: { state: string; open: boolean }) {
  const isDisabled = state === 'disabled';
  return (
    <button
      type="button"
      tabIndex={-1}
      disabled={isDisabled}
      aria-expanded={open}
      className={cn(
        'uxm-explorer-section',
        open && 'uxm-explorer-section--open',
        state === 'hover' && 'uxm-explorer-section--state-hover',
        state === 'focus' && 'uxm-explorer-section--state-focus',
      )}
      style={{ pointerEvents: 'none' }}
    >
      <Icon
        glyph="chevron-down"
        size={12}
        strokeWidth={2.5}
        className="uxm-explorer-section__chevron"
        aria-hidden="true"
      />
      <span className="uxm-explorer-section__indicator" aria-hidden="true">
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)',
            display: 'inline-block',
          }}
        />
      </span>
      <span className="uxm-explorer-section__label">Buttons</span>
      <span className="uxm-explorer-section__trailing">5</span>
    </button>
  );
}

export function ExplorerSectionPreview({ styles, variants }: PreviewProps) {
  const state = (variants.state as string) ?? 'default';
  const initialOpen = (variants.open as string) !== 'false';
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SECTIONS.map((s) => [s.name, initialOpen])),
  );
  const cssVars = buildVars(styles);

  const sectionLabel = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 280, ...cssVars } as CSSProperties}>
      <div>
        <div style={sectionLabel}>{state} state</div>
        <StaticShowcase state={state} open={initialOpen} />
      </div>

      {/* Interactive instance — three real <ExplorerSection> atoms.
          Real `:hover` / `:focus-visible` exercise the production CSS
          via the projected vars above. Clicking a section toggles its
          chevron + `aria-expanded`. The State dropdown carries through
          to `disabled` (applied to the second section); the rest fire
          on real input. */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <div style={sectionLabel}>Interactive</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SECTIONS.map((s, i) => (
            <ExplorerSection
              key={s.name}
              open={openMap[s.name]}
              disabled={state === 'disabled' && i === 1}
              onClick={() =>
                setOpenMap((prev) => ({ ...prev, [s.name]: !prev[s.name] }))
              }
              indicator={
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: s.color,
                    display: 'inline-block',
                  }}
                />
              }
              trailing={s.count}
            >
              {s.name}
            </ExplorerSection>
          ))}
        </div>
      </div>
    </div>
  );
}
