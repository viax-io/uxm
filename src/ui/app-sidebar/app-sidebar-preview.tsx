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
        // Demonstrates the persistent `badge` slot: shows inline (a ✓) when
        // expanded, and collapses to a corner status dot on the icon tile when
        // the rail is collapsed.
        badge: <Icon glyph="check" size={14} />,
      },
    ],
  },
  {
    heading: 'Model Types',
    items: [
      // No per-item colours here — the "Auto Icon Colors" variant fills them
      // from the palette when on, matching how a modo sidebar (which passes no
      // per-item colour) behaves. A real consumer can still pin `iconColor` /
      // `iconBg` on a specific item to override the auto assignment.
      {
        href: '#rm',
        label: 'Revenue Motions',
        icon: <Icon glyph="model-revenue-motion" />,
      },
      {
        href: '#bi',
        label: 'Business Interactions',
        icon: <Icon glyph="model-business-interaction" />,
      },
      {
        href: '#dm',
        label: 'Determination',
        icon: <Icon glyph="model-determination" />,
      },
      {
        href: '#cm',
        label: 'Configuration',
        icon: <Icon glyph="model-configuration" />,
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
  const autoIconColors = variants.autoIconColors === 'on';

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
    ['--uxm-app-sidebar-border-color' as string]: styles.borderColor as string,
    width: collapsed ? (styles.collapsedWidth as number) : (styles.expandedWidth as number),
    height: 480,
  };
  return (
    <AppSidebar
      brand={{ logoUrl, iconUrl, alt: 'Brand' }}
      sections={SAMPLE_SECTIONS}
      autoIconColors={autoIconColors}
      collapsed={collapsed}
      onCollapseToggle={() => {}}
      footer={<span>viax Modo v0.1.0</span>}
      style={cssVars}
    />
  );
}
