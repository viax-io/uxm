import type { PreviewProps } from '@/previews/types';
import { Icon } from '@/ui';

// Glyph + capitalized label per variant. Colors live in the registry's
// variant-scoped knobs (successBg / infoBg / warningBg / errorBg, etc.) —
// the preview just reaches into `styles[<variant><Bg|Text|Border>]`.
const VARIANT_META: Record<
  string,
  { glyph: string; label: string }
> = {
  success: { glyph: 'check-circle',         label: 'Success' },
  info:    { glyph: 'info',                 label: 'Info' },
  warning: { glyph: 'exclamation-triangle', label: 'Warning' },
  error:   { glyph: 'exclamation-circle',   label: 'Error' },
};

export function BannerPreview({ styles, variants }: PreviewProps & { componentId: string }) {
  const variant = (variants.variant ?? 'success') as keyof typeof VARIANT_META;
  const meta = VARIANT_META[variant] ?? VARIANT_META.success;

  // Pull the current variant's color knobs. The registry passes ALL 12
  // (4 variants × 3 properties) — `showWhen` only filters what the
  // Properties panel SHOWS, not what's projected here.
  const bg = styles[`${variant}Bg`] as string;
  const color = styles[`${variant}Text`] as string;
  const border = styles[`${variant}Border`] as string;

  return (
    <div
      style={{
        width: 380,
        backgroundColor: bg,
        color,
        border: `1px solid ${border}`,
        borderRadius: styles.borderRadius as number,
        padding: `${styles.paddingY}px ${styles.paddingX}px`,
        fontSize: styles.fontSize as number,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
      }}
    >
      <Icon glyph={meta.glyph} size={20} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600, margin: '0 0 4px' }}>{meta.label} banner</p>
        <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.5 }}>
          This is an example {variant} banner — persistent until the user dismisses it or
          the consumer removes it from state.
        </p>
      </div>
      {/* Show the dismiss affordance so designers see it as part of the
          atom's surface. No-op handler — the preview is static; the X
          fires onDismiss when the atom is actually consumed. */}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {}}
        style={{
          flexShrink: 0,
          marginLeft: 'auto',
          padding: 4,
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          opacity: 0.6,
        }}
      >
        <Icon glyph="close" size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
