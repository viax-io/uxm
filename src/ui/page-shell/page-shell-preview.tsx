import type { PreviewProps } from '@/previews/types';
import { AppSidebar } from '@/ui';
import { AppTopBar } from '@/ui';
import { Avatar } from '@/ui';
import { ButtonPrimary } from '@/ui';
import { Icon } from '@/ui';
import { InputWithIcon } from '@/ui';
import { PageShell, type PageShellVariant } from '@/ui';

import type { CSSProperties } from 'react';

const SAMPLE_SECTIONS = [
  {
    items: [
      { href: '#dashboard', label: 'Dashboard', icon: <Icon glyph="grid" />, active: true },
    ],
  },
  {
    heading: 'Model Types',
    items: [
      {
        href: '#rm',
        label: 'Revenue Motions',
        icon: <Icon glyph="model-revenue-motion" />,
        iconBg: 'var(--color-highlight-warm)',
        iconColor: 'var(--color-on-highlight-warm)',
      },
    ],
  },
];

export function PageShellPreview({ styles, variants }: PreviewProps) {
  const variant = (variants.variant as PageShellVariant) ?? 'standard';
  const wrapperStyle: CSSProperties = {
    width: 720,
    height: 420,
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    overflow: 'hidden',
    ['--uxm-page-shell-bg' as string]: styles.backgroundColor as string,
    ['--uxm-page-shell-content-padding' as string]: `${styles.contentPadding}px`,
  };

  return (
    <PageShell
      variant={variant}
      style={wrapperStyle}
      sidebar={
        <AppSidebar
          brand={{ logoUrl: '/viax-logo.svg', iconUrl: '/viax-icon.svg', alt: 'Brand' }}
          sections={SAMPLE_SECTIONS}
          collapsed={false}
          footer={<span>v0.1.0</span>}
          style={{ height: '100%', width: 200 }}
        />
      }
      topBar={
        variant === 'canvas' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'color-mix(in srgb, var(--color-surface-alt) 50%, transparent)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
              ← Lifecycle
            </span>
            <span style={{ display: 'inline-flex', gap: 6 }}>
              <ButtonPrimary style={{ padding: '4px 10px', fontSize: 11 }}>Publish</ButtonPrimary>
            </span>
          </div>
        ) : (
          <AppTopBar
            search={
              <InputWithIcon
                type="search"
                placeholder="Search…"
                icon={<Icon glyph="search" size={14} strokeWidth={1.5} />}
              />
            }
            actions={
              <>
                <ButtonPrimary>+ New</ButtonPrimary>
                <Avatar initials="LR" />
              </>
            }
          />
        )
      }
    >
      {variant === 'canvas' ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage:
              'radial-gradient(circle, var(--color-canvas-dot) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            fontSize: 13,
          }}
        >
          Full-bleed canvas — light toolbar above
        </div>
      ) : (
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
            Standard page
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 6 }}>
            Padded content area inside the sidebar + top-bar shell.
          </p>
        </div>
      )}
    </PageShell>
  );
}
