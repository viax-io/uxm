import type { PreviewProps } from '@/previews/types';
import { AppTopBar } from '@/ui';
import { Avatar } from '@/ui';
import { ButtonPrimary } from '@/ui';
import { Icon } from '@/ui';
import { InputWithIcon } from '@/ui';

import type { CSSProperties } from 'react';

export function AppTopBarPreview({ styles }: PreviewProps) {
  const cssVars: CSSProperties = {
    backgroundColor: styles.backgroundColor as string,
    borderColor: styles.borderColor as string,
    height: styles.height as number,
    padding: `0 ${styles.paddingX}px`,
    gap: styles.gap as number,
    width: 720,
  };
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
