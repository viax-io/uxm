import type { PreviewProps } from '@/previews/types';
import {
  ButtonPrimary,
  ButtonTertiary,
  FormField,
  Icon,
  IconButton,
  TextInput,
} from '@/ui';

const SIZE_WIDTHS: Record<string, number> = {
  sm: 360,
  md: 480,
  lg: 640,
  fullscreen: 720, // fullscreen previewed at lg-plus width so the canvas stays usable
};

/**
 * Static preview for the Modal atom. Mirrors the live `<Modal>` markup
 * (header / body / footer + close X) but doesn't go through the Dialog
 * shell — UXM previews render the visual outcome, not the open/close
 * behavior. A dim backdrop layer behind the panel gives the modal its
 * usual "interrupting" visual context.
 *
 * Behavioral verification (focus trap, Escape, backdrop dismiss, scroll
 * lock, focus restoration) was done once against a live Dialog + Modal
 * during build-out — see commit history. Subsequent validation flows
 * through real product consumers when they ship.
 */
export function ModalPreview({ styles, variants }: PreviewProps) {
  const size = (variants?.size ?? 'md') as string;
  const width = SIZE_WIDTHS[size] ?? SIZE_WIDTHS.md;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        // Faux backdrop so the modal reads as floating over content. Uses
        // the same token the real Dialog backdrop reads, so designers
        // see what backdrop theming would do.
        backgroundColor: 'var(--backdrop-color, rgba(0,0,0,0.50))',
        backdropFilter: 'blur(var(--backdrop-blur, 4px))',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div
        className="uxm-modal"
        style={{
          width,
          maxWidth: '100%',
          backgroundColor: styles.backgroundColor as string,
          border: `1px solid ${styles.borderColor}`,
          borderRadius: styles.borderRadius as number,
          // Shadow comes from the global `--shadow-modal` token — no
          // per-modal knob. CSS will apply it via the .uxm-modal class.
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="uxm-modal__header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingInline: styles.paddingX as number,
            paddingBlock: styles.paddingY as number,
            // Header divider follows the same `borderColor` as the outer
            // border — one knob controls all chrome lines.
            borderBottom: `1px solid ${styles.borderColor}`,
          }}
        >
          <h2
            className="uxm-modal__title"
            style={{
              margin: 0,
              fontSize: styles.titleSize as number,
              fontWeight: 600,
              color: styles.titleColor as string,
            }}
          >
            Add step
          </h2>
          <IconButton aria-label="Close">
            <Icon glyph="close" size={14} strokeWidth={2} />
          </IconButton>
        </div>

        {/* Body */}
        <div
          className="uxm-modal__body"
          style={{
            paddingInline: styles.paddingX as number,
            paddingBlock: styles.paddingY as number,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-muted)' }}>
            Pick a step type, then name it. The Modal atom owns the surface — header,
            body, footer slots — and the Dialog shell owns mechanics (focus trap,
            scroll lock, Escape, backdrop dismiss).
          </p>
          <FormField label="Name">
            <TextInput placeholder="e.g. Pending Approval" />
          </FormField>
        </div>

        {/* Footer */}
        <div
          className="uxm-modal__footer"
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end',
            paddingInline: styles.paddingX as number,
            paddingBlock: styles.paddingY as number,
            // Footer divider — same `borderColor` as outer border + header.
            borderTop: `1px solid ${styles.borderColor}`,
          }}
        >
          <ButtonTertiary>Cancel</ButtonTertiary>
          <ButtonPrimary>Add Step</ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
