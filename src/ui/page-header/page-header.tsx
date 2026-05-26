import { cn } from '@/helpers';

import { IconTile } from '../icon-tile';

import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}

// Project PageHeader's icon-tile theming surface onto the underlying IconTile.
// The `--uxm-page-header-icon-{bg,color,size}` variables (set by editor saves
// or by consumers via inline style) flow into the IconTile's own CSS-variable
// reads, so PageHeader's per-instance icon controls keep working without any
// hand-rolled __icon CSS.
const ICON_TILE_STYLE: CSSProperties = {
  ['--uxm-icon-tile-bg' as string]: 'var(--uxm-page-header-icon-bg, var(--color-accent-subtle))',
  ['--uxm-icon-tile-color' as string]: 'var(--uxm-page-header-icon-color, var(--color-accent-bold))',
  ['--uxm-icon-tile-size' as string]: 'var(--uxm-page-header-icon-size, 40px)',
  ['--uxm-icon-tile-radius' as string]: '8px',
};

export function PageHeader({ icon, title, meta, actions, className, ...rest }: PageHeaderProps) {
  return (
    <div className={cn('uxm-page-header', className)} {...rest}>
      {icon && <IconTile style={ICON_TILE_STYLE}>{icon}</IconTile>}
      <div className="uxm-page-header__body">
        <h1 className="uxm-page-header__title">{title}</h1>
        {meta && <p className="uxm-page-header__meta">{meta}</p>}
      </div>
      {actions && <div className="uxm-page-header__actions">{actions}</div>}
    </div>
  );
}
