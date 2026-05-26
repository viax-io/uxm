'use client';

import { cn } from '@/helpers';

import type { HTMLAttributes, ReactNode } from 'react';

export interface InlineFilterProps extends HTMLAttributes<HTMLDivElement> {
  search?: ReactNode;
  filters?: ReactNode;
  trailing?: ReactNode;
}

export function InlineFilter({
  search,
  filters,
  trailing,
  className,
  ...rest
}: InlineFilterProps) {
  return (
    <div className={cn('uxm-inline-filter', className)} {...rest}>
      {search && <div className="uxm-inline-filter__search">{search}</div>}
      {filters && <div className="uxm-inline-filter__filters">{filters}</div>}
      {trailing && <div className="uxm-inline-filter__trailing">{trailing}</div>}
    </div>
  );
}
