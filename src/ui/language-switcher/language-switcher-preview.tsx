import { useState, type CSSProperties } from 'react';

import { cn } from '@/helpers';
import type { PreviewProps } from '@/previews/types';
import { Icon, LanguageSwitcher } from '@/ui';

type Styles = PreviewProps['styles'];

/** A spread of scripts — Latin, Cyrillic, CJK — so the endonym rendering and
 *  the trigger's width behaviour are both visible at a glance. */
const DEMO_LOCALES = ['en-US', 'de-DE', 'uk-UA', 'fr-FR', 'ja-JP', 'pl-PL'];

function buildVars(styles: Styles): CSSProperties {
  return {
    '--uxm-language-switcher-bg': styles.bg as string,
    '--uxm-language-switcher-border-color': styles.borderColor as string,
    '--uxm-language-switcher-radius': `${styles.radius}px`,
    '--uxm-language-switcher-color': styles.color as string,
    '--uxm-language-switcher-font-size': `${styles.fontSize}px`,
    '--uxm-language-switcher-gap': `${styles.gap}px`,
    '--uxm-language-switcher-padding-x': `${styles.paddingX}px`,
    '--uxm-language-switcher-padding-y': `${styles.paddingY}px`,
    '--uxm-language-switcher-hover-bg': styles.hoverBg as string,
    '--uxm-language-switcher-hover-border-color': styles.hoverBorderColor as string,
    '--uxm-language-switcher-open-bg': styles.openBg as string,
    '--uxm-language-switcher-open-border-color': styles.openBorderColor as string,
    '--uxm-language-switcher-focus-ring': styles.focusRing as string,
    '--uxm-language-switcher-caret-color': styles.caretColor as string,
    '--uxm-language-switcher-disabled-opacity':
      styles.disabledOpacity != null ? String(styles.disabledOpacity) : undefined,
  } as CSSProperties;
}

/**
 * Static showcase — hand-rendered trigger markup, not the real atom.
 *
 * The atom routes `className` to the Listbox root and exposes no hook onto the
 * trigger, so the `--state-*` forced modifier cannot be projected through it
 * (same reason ButtonGroup's preview hand-renders). Inert: `pointer-events:
 * none` stops the production `:hover` firing on mouse-over and `tabIndex={-1}`
 * keeps it out of the focus order, so a real Tab press cannot override the
 * forced state being demonstrated.
 */
function StaticShowcase({ state, variant }: { state: string; variant: 'full' | 'compact' }) {
  return (
    <div className="uxm-language-switcher" style={{ pointerEvents: 'none' }}>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className={cn(
          'uxm-language-switcher__trigger',
          `uxm-language-switcher__trigger--${variant}`,
          state !== 'default' && `uxm-language-switcher__trigger--state-${state}`,
        )}
      >
        <Icon glyph="globe" size={16} />
        {variant === 'full' && <span className="uxm-language-switcher__current">Deutsch</span>}
        <span className="uxm-language-switcher__caret">
          <Icon
            glyph="chevron-down"
            size={12}
            strokeWidth={2.2}
            style={{ transform: state === 'open' ? 'rotate(180deg)' : 'none' }}
          />
        </span>
      </button>
    </div>
  );
}

export function LanguageSwitcherPreview({ styles, variants }: PreviewProps) {
  const variant = ((variants.variant as string) ?? 'full') as 'full' | 'compact';
  const state = (variants.state as string) ?? 'default';
  const [locale, setLocale] = useState('en-US');
  const cssVars = buildVars(styles);

  const sectionLabel = {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, ...cssVars } as CSSProperties}>
      <div>
        <div style={sectionLabel}>
          {variant} · {state} state
        </div>
        <StaticShowcase state={state} variant={variant} />
      </div>

      {/* Live instance — the real atom, exercising the production :hover /
          :focus-visible / open rules through the same projected vars. */}
      <div>
        <div style={sectionLabel}>interactive</div>
        <LanguageSwitcher
          locales={DEMO_LOCALES}
          value={locale}
          onChange={setLocale}
          variant={variant}
          disabled={state === 'disabled'}
        />
      </div>

      {/* The zero-cost-absence rule, shown rather than described: the same atom
          with a single configured locale emits nothing. A realm with one
          language depends on this, and it is easy to regress into a disabled
          control, so it earns a slot. */}
      <div>
        <div style={sectionLabel}>one locale configured → renders nothing</div>
        <div
          style={{
            border: '1px dashed var(--color-border)',
            borderRadius: 8,
            padding: 12,
            fontSize: 12,
            color: 'var(--color-text-muted)',
          }}
        >
          <LanguageSwitcher locales={['en-US']} value="en-US" onChange={() => {}} />
          (empty — no wrapper, no disabled control)
        </div>
      </div>
    </div>
  );
}
