import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';

import type { CSSProperties } from 'react';

// Same variant vocabulary as Banner — green check = success across the
// DS. Toast differs by VISUAL TREATMENT, not by what variant means.
const VARIANT_META: Record<
  string,
  { glyph: string; sample: string }
> = {
  success: { glyph: 'check-circle',         sample: 'Email copied' },
  info:    { glyph: 'info',                 sample: 'Sync started' },
  warning: { glyph: 'exclamation-triangle', sample: 'Working offline — changes queued' },
  error:   { glyph: 'exclamation-circle',   sample: 'Import failed' },
};

/**
 * Static preview for the Toast atom — neutral surface + colored
 * left-edge accent + colored icon. Adapts automatically to the active
 * theme (white card in light, raised-dark card in dark) because the
 * background reads `--color-card`, which is theme-aware.
 *
 * Faux corner-positioning via flex-end alignment on a subtle surface
 * suggests where a real toast would dock (top-right by default).
 */
export function ToastPreview({ styles, variants }: PreviewProps & { componentId: string }) {
  const variant = (variants.variant ?? 'success') as keyof typeof VARIANT_META;
  const meta = VARIANT_META[variant] ?? VARIANT_META.success;

  // The neutral surface props come from the variant-agnostic knobs.
  const bg = styles.backgroundColor as string;
  const color = styles.color as string;
  const border = styles.borderColor as string;
  // The icon is the sole variant signal — no separate stripe / pill /
  // background tint. Per-variant accent drives just the icon color.
  const accent = styles[`${variant}Accent`] as string;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 240,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: 24,
        // Subtle context surface so the toast reads as floating above
        // a page. Not the modal backdrop — toasts don't dim the page.
        backgroundColor: 'var(--color-surface-alt)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div
        className="uxm-toast"
        style={{
          width: 380,
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          backgroundColor: bg,
          color,
          border: border ? `1px solid ${border}` : '1px solid transparent',
          borderRadius: styles.borderRadius as number,
          paddingInline: styles.paddingX as number,
          paddingBlock: styles.paddingY as number,
          fontSize: styles.fontSize as number,
          fontWeight: 500,
          boxShadow: 'var(--shadow-xl)',
          animation: 'none',
          // CSS custom property that `.uxm-toast__icon svg { width:
          // var(--uxm-toast-icon-size, 16px) }` reads. Without setting
          // it here, the CSS rule resolves to its 16px fallback and
          // locks the icon at 16px regardless of the slider position —
          // the `<Icon size={N}>` prop loses to CSS specificity.
          ['--uxm-toast-icon-size' as string]: `${styles.iconSize}px`,
        } as CSSProperties}
      >
        <span
          className="uxm-toast__icon"
          aria-hidden="true"
          style={{ flexShrink: 0, display: 'inline-flex', color: accent }}
        >
          <Icon glyph={meta.glyph} size={styles.iconSize as number} strokeWidth={1.8} />
        </span>
        <span
          className="uxm-toast__message"
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {meta.sample}
        </span>
        {/* Render an inline action only for the error preview so
            designers can see how Toast renders with the optional action
            slot — matches the reference image's "Retry" example. */}
        {variant === 'error' && (
          <button
            type="button"
            onClick={() => {}}
            style={{
              flexShrink: 0,
              padding: '0 4px',
              background: 'transparent',
              border: 'none',
              color: accent,
              font: 'inherit',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: 2,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Retry
          </button>
        )}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {}}
          style={{
            flexShrink: 0,
            padding: 2,
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 3,
            opacity: 0.6,
          }}
        >
          <Icon glyph="close" size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
