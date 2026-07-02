import type { PreviewProps } from '@/previews/types';
import { AppSidebar } from '@/ui';
import { Icon } from '@/ui';

import type { CSSProperties } from 'react';

const SAMPLE_SECTIONS = [
  {
    items: [
      {
        href: '#dashboard',
        label: 'Dashboard',
        icon: <Icon glyph="grid" />,
        active: true,
      },
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
      {
        href: '#bi',
        label: 'Business Interactions',
        icon: <Icon glyph="model-business-interaction" />,
        iconBg: 'var(--color-highlight-cool)',
        iconColor: 'var(--color-on-highlight-cool)',
      },
      {
        href: '#dm',
        label: 'Determination',
        icon: <Icon glyph="model-determination" />,
        iconBg: 'var(--color-category-composite)',
        iconColor: 'var(--color-text-inverse)',
      },
      {
        href: '#cm',
        label: 'Configuration',
        icon: <Icon glyph="model-configuration" />,
        iconBg: 'var(--color-category-diagram)',
        iconColor: 'var(--color-text-inverse)',
      },
    ],
  },
  {
    heading: 'Experience',
    items: [
      {
        href: '#uxm',
        label: 'UXM',
        icon: <Icon glyph="paint-brush" />,
      },
    ],
  },
];

export function AppSidebarPreview({ styles, variants, shell }: PreviewProps) {
  const brand = shell?.brand ?? {};
  const theme = shell?.theme ?? 'light';
  const collapsed = variants.state === 'collapsed';

  // Pick the right brand asset for the active theme. Dark variants are
  // optional in BrandConfig — fall back through (dark → light → bundled
  // viax default) so the sidebar always has something to show. Pulling
  // these from the live brand context (instead of hardcoding the viax
  // SVGs) means uploading a new logo or toggling the theme is reflected
  // in the preview immediately.
  const logoUrl =
    theme === 'dark'
      ? brand.logoUrlDark || brand.logoUrl || '/viax-logo.svg'
      : brand.logoUrl || '/viax-logo.svg';
  const iconUrl =
    theme === 'dark'
      ? brand.iconUrlDark || brand.iconUrl || '/viax-icon.svg'
      : brand.iconUrl || '/viax-icon.svg';

  const cssVars: CSSProperties = {
    ['--uxm-app-sidebar-background-color' as string]: styles.backgroundColor as string,
    borderColor: styles.borderColor as string,
    width: collapsed ? (styles.collapsedWidth as number) : (styles.expandedWidth as number),
    height: 480,
  };
  return (
    <AppSidebar
      brand={{ logoUrl, iconUrl, alt: 'Brand' }}
      sections={SAMPLE_SECTIONS}
      collapsed={collapsed}
      onCollapseToggle={() => {}}
      footer={<span>viax Modo v0.1.0</span>}
      style={cssVars}
    />
  );
}
