import type { PreviewProps } from '@/previews/types';
import { AppSidebar } from '@/ui';
import { Avatar, Icon, SidebarNavTrigger } from '@/ui';

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
  const withHeader = (variants.headerSlot ?? 'on') === 'on';
  const withFooter = (variants.footerSlot ?? 'on') === 'on';

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
    // Projected, not decorative: `leadPadding` rides generate-css's kebab
    // fallback to `--uxm-app-sidebar-lead-padding`, and a knob the live preview
    // does not project only dies once a brand is SAVED.
    ['--uxm-app-sidebar-lead-padding' as string]: `${styles.leadPadding as number}px`,
    ['--uxm-app-sidebar-footer-padding' as string]: `${styles.footerPadding as number}px`,
    width: collapsed ? (styles.collapsedWidth as number) : (styles.expandedWidth as number),
    height: 480,
  };
  // Both slots model the CONSUMER's side of the contract, which is the whole
  // point of the pair: the sidebar renders them in either rail state and never
  // rewrites what is inside, so it is the consumer who passes `collapsed` down
  // and sizes the marks. A slot that ignored the rail would look right here and
  // break at 64px.
  // No spacing wrapper: `__lead` is a flex column and owns the gap, which is
  // the point of it doing so — a consumer hands over controls, not a layout.
  const switchers = (
    <>
      <SidebarNavTrigger
        variant="outlined"
        collapsed={collapsed}
        title={collapsed ? 'Tenant A' : undefined}
        caption={collapsed ? undefined : 'Tenant'}
        icon={<Icon glyph="organization" size={18} />}
        trailing={<Icon glyph="chevron-down" size={16} />}
      >
        Tenant A
      </SidebarNavTrigger>
      <SidebarNavTrigger
        variant="outlined"
        collapsed={collapsed}
        title={collapsed ? 'Default' : undefined}
        caption={collapsed ? undefined : 'Workspace'}
        icon={<Icon glyph="product" size={18} />}
        trailing={<Icon glyph="chevron-down" size={16} />}
      >
        Default
      </SidebarNavTrigger>
    </>
  );

  // The account row: a control that legitimately belongs at the FOOT (it names
  // the person, not a level anything below it sits in) — and the reason the
  // footer had to stop disappearing when the rail collapses.
  const account = (
    <SidebarNavTrigger
      variant="plain"
      collapsed={collapsed}
      title={collapsed ? 'dan@acme.com' : undefined}
      caption={collapsed ? undefined : 'Tenant owner'}
      captionPlacement="below"
      icon={<Avatar initials="DR" size={collapsed ? 'small' : 'medium'} />}
      trailing={<Icon glyph="chevron-down" size={16} />}
    >
      dan@acme.com
    </SidebarNavTrigger>
  );

  return (
    <AppSidebar
      brand={{ logoUrl, iconUrl, alt: 'Brand' }}
      sections={SAMPLE_SECTIONS}
      autoIconColors={autoIconColors}
      collapsed={collapsed}
      onCollapseToggle={() => {}}
      header={withHeader ? switchers : undefined}
      footer={withFooter ? account : undefined}
      style={cssVars}
    />
  );
}
