import type { PreviewProps } from '@/previews/types';
import { ButtonPrimary, ButtonTertiary } from '@/ui';
import { Icon } from '@/ui';

const COPY: Record<string, { code: string; title: string; message: string; primary: string; secondary?: string }> = {
  '404': {
    code: '404',
    title: 'Page not found',
    message: "We couldn't find what you were looking for. The link may be broken, or the page may have moved.",
    primary: 'Back to Dashboard',
  },
  '500': {
    code: '500',
    title: 'Something went wrong',
    message: 'We hit an unexpected error. Try again, or head back to the dashboard.',
    primary: 'Try again',
    secondary: 'Back to Dashboard',
  },
  empty: {
    code: '',
    title: 'Nothing here yet',
    message: 'Once you create your first item it will show up here.',
    primary: 'Create one',
  },
};

export function ErrorPagePreview({ styles, variants }: PreviewProps) {
  const v = (variants.variant as keyof typeof COPY) ?? '404';
  const cfg = COPY[v];

  const codeSize = styles.codeSize as number;
  const titleSize = styles.titleSize as number;
  const messageSize = styles.messageSize as number;
  const iconSize = styles.iconSize as number;
  const messageMaxWidth = styles.messageMaxWidth as number;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px 24px',
        width: 620,
      }}
    >
      <div style={{
        width: iconSize, height: iconSize,
        borderRadius: 16,
        backgroundColor: styles.iconBg as string,
        color: styles.iconColor as string,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <Icon glyph="question-mark-circle" size={iconSize * 0.5} strokeWidth={1.5} />
      </div>
      {cfg.code && (
        <p style={{
          fontSize: codeSize,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: styles.codeColor as string,
          margin: 0,
        }}>{cfg.code}</p>
      )}
      <h1 style={{
        fontSize: titleSize,
        fontWeight: 600,
        color: styles.titleColor as string,
        marginTop: 16,
        marginBottom: 0,
      }}>{cfg.title}</h1>
      <p style={{
        fontSize: messageSize,
        color: styles.messageColor as string,
        maxWidth: messageMaxWidth,
        margin: '8px 0 0',
        lineHeight: 1.5,
      }}>{cfg.message}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 32 }}>
        <ButtonPrimary>{cfg.primary}</ButtonPrimary>
        {cfg.secondary && (
          <ButtonTertiary>{cfg.secondary}</ButtonTertiary>
        )}
      </div>
    </div>
  );
}
