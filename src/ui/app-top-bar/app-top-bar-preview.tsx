import type { PreviewProps } from '@/previews/types';
import { AppTopBar } from '@/ui';
import { Avatar } from '@/ui';
import { ButtonPrimary } from '@/ui';
import { Icon } from '@/ui';
import { InputWithIcon } from '@/ui';

import type { CSSProperties } from 'react';

export function AppTopBarPreview({ styles, variants, shell }: PreviewProps) {
  // The Brand Settings logo, theme-aware with the same fallbacks as the
  // sidebar preview, so an uploaded logo shows here too.
  const brand = shell?.brand ?? {};
  const logoUrl =
    shell?.theme === 'dark'
      ? brand.logoUrlDark || brand.logoUrl || '/viax-logo.svg'
      : brand.logoUrl || '/viax-logo.svg';
  const withBrand = variants.brandSlot === 'logo';
  const cssVars: CSSProperties = {
    '--uxm-app-top-bar-brand-height': `${styles.brandHeight}px`,
    '--uxm-app-top-bar-brand-gap': `${styles.brandGap}px`,
    '--uxm-app-top-bar-background-color': styles.backgroundColor as string,
    '--uxm-app-top-bar-border-color': styles.borderColor as string,
    '--uxm-app-top-bar-height': `${styles.height}px`,
    '--uxm-app-top-bar-padding-x': `${styles.paddingX}px`,
    '--uxm-app-top-bar-gap': `${styles.gap}px`,
    width: 720,
  } as CSSProperties;
  const searchStyle: CSSProperties = { maxWidth: styles.searchMaxWidth as number };
  return (
    <AppTopBar
      style={cssVars}
      onMobileMenuClick={() => {}}
      brand={
        withBrand ? (
          <a href="#home" onClick={(e) => e.preventDefault()}>
            <img src={logoUrl} alt="Brand" />
          </a>
        ) : undefined
      }
      search={
        <div style={searchStyle}>
          <InputWithIcon
            placeholder="Search…"
            icon={<Icon glyph="search" strokeWidth={1.5} />}
          />
        </div>
      }
      actions={
        <>
          <ButtonPrimary>+ New Model</ButtonPrimary>
          <Avatar initials="LR" />
        </>
      }
    />
  );
}
