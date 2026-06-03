import { useRef, useState } from 'react';

import type { PreviewProps } from '@/previews/types';
import { ButtonPrimary, ButtonTertiary } from '@/ui';
import { FormField } from '@/ui';
import { TextInput } from '@/ui';

export function LoginPagePreview({ styles, variants, shell }: PreviewProps) {
  const brand = shell?.brand ?? {};
  const theme = shell?.theme ?? 'light';
  const variant = (variants.background as string) ?? 'solid';
  const bgColor = styles.bgColor as string;
  const patternColor = styles.patternColor as string;
  const patternSize = styles.patternSize as number;
  const imageUrl = styles.imageUrl as string;
  const imageFit = (styles.imageFit as string) ?? 'cover';

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const upload = async (file: File) => {
    if (!shell?.uploadAsset) return;
    setUploading(true);
    setUploadError(null);
    try {
      const data = await shell.uploadAsset(file, 'logo');
      if (!data?.url) throw new Error('Upload failed');
      // Surface the new URL by syncing it through the same field — preview reads styles.imageUrl,
      // but we don't have a direct setter here, so we just blink a notice for the designer.
      // The user can paste this into the Image URL field in the properties panel.
      navigator.clipboard?.writeText(data.url).catch(() => {});
      alert(`Uploaded. URL copied to clipboard:\n${data.url}`);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  let backgroundStyle: React.CSSProperties = { backgroundColor: bgColor };
  if (variant === 'dots') {
    backgroundStyle = {
      ...backgroundStyle,
      backgroundImage: `radial-gradient(circle, ${patternColor} 1px, transparent 1px)`,
      backgroundSize: `${patternSize}px ${patternSize}px`,
    };
  } else if (variant === 'stripes') {
    backgroundStyle = {
      ...backgroundStyle,
      backgroundImage: `repeating-linear-gradient(45deg, ${patternColor} 0 1px, transparent 1px ${patternSize}px)`,
    };
  } else if (variant === 'image' && imageUrl) {
    backgroundStyle = imageFit === 'repeat'
      ? {
          ...backgroundStyle,
          backgroundImage: `url("${imageUrl}")`,
          backgroundRepeat: 'repeat',
        }
      : {
          ...backgroundStyle,
          backgroundImage: `url("${imageUrl}")`,
          backgroundSize: imageFit,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
  }

  const cardShadow = styles.cardShadow as boolean;
  const cardMaxWidth = styles.cardMaxWidth as number;
  const cardPadding = styles.cardPadding as number;
  const logoSize = styles.logoSize as number;
  const logoSrc =
    theme === 'dark'
      ? brand.logoUrlDark || brand.logoUrl || '/viax-logo.svg'
      : brand.logoUrl || '/viax-logo.svg';

  return (
    <div
      style={{
        ...backgroundStyle,
        width: 720,
        minHeight: 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        borderRadius: 12,
        position: 'relative',
      }}
    >
      {variant === 'image' && !imageUrl && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          display: 'flex', gap: 6, alignItems: 'center',
          padding: '4px 8px',
          backgroundColor: 'var(--color-card)',
          border: '1px dashed var(--color-border)',
          borderRadius: 6,
          fontSize: 11, color: 'var(--color-text-muted)',
        }}>
          No image set
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 4,
              background: 'var(--color-accent-bold)', color: 'var(--color-text-inverse)',
              border: 'none', cursor: 'pointer',
            }}
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            hidden
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          {uploadError && (
            <span style={{ color: 'var(--color-danger-text)' }}>{uploadError}</span>
          )}
        </div>
      )}

      <div
        style={{
          width: '100%',
          maxWidth: cardMaxWidth,
          backgroundColor: styles.cardBg as string,
          border: `${styles.cardBorderWidth}px solid ${styles.cardBorderColor}`,
          borderRadius: styles.cardRadius as number,
          padding: cardPadding,
          boxShadow: cardShadow ? '0 12px 32px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        {/* Logo */}
        <img
          src={logoSrc}
          alt="Brand logo"
          style={{ height: logoSize, maxWidth: '70%', objectFit: 'contain', display: 'block', marginBottom: 16 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        <h1 style={{
          fontSize: styles.titleSize as number, fontWeight: 600,
          color: styles.titleColor as string,
          margin: 0,
        }}>
          Welcome back
        </h1>
        <p style={{
          fontSize: styles.subtitleSize as number,
          color: styles.subtitleColor as string,
          margin: '4px 0 24px',
        }}>
          Sign in to your viax workspace
        </p>

        {/* Email + Password — real atomic composition. Label theming
            flows from FormField's registry; input shape / state visuals
            flow from TextInput's. No hardcoded inline styles. */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
          <FormField label="Email">
            <TextInput type="email" placeholder="you@company.com" />
          </FormField>
          <FormField label="Password">
            <TextInput type="password" placeholder="••••••••" />
          </FormField>
        </div>

        <ButtonPrimary style={{ width: '100%' }}>Sign in</ButtonPrimary>

        {/* "or" divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 12px' }}>
          <span style={{ flex: 1, height: 1, backgroundColor: 'var(--color-border)' }} />
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', letterSpacing: 0.5, textTransform: 'uppercase' }}>or</span>
          <span style={{ flex: 1, height: 1, backgroundColor: 'var(--color-border)' }} />
        </div>

        {/* Google sign-in */}
        <ButtonTertiary style={{ width: '100%' }}>
          <GoogleIcon />
          Continue with Google
        </ButtonTertiary>

        <p style={{ marginTop: 16, fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
          Forgot your password?{' '}
          <span style={{ color: 'var(--color-accent-bold)', fontWeight: 500, cursor: 'pointer' }}>
            Reset
          </span>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}
