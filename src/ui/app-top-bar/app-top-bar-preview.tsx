import type { PreviewProps } from '@/previews/types';
import { AppTopBar } from '@/ui';
import { Avatar } from '@/ui';
import { ButtonPrimary } from '@/ui';
import { Icon } from '@/ui';
import { InputWithIcon } from '@/ui';

import type { CSSProperties } from 'react';

export function AppTopBarPreview({ styles }: PreviewProps) {
  const cssVars: CSSProperties = {
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
      search={
        <div style={searchStyle}>
          <InputWithIcon
            placeholder="Search models..."
            icon={<Icon glyph="search" size={14} strokeWidth={1.5} />}
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
