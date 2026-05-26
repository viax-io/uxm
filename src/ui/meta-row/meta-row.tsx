import { Children, Fragment, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/helpers';

export interface MetaRowProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Each child becomes one segment of the row. A small dot separator is
   * rendered between every pair of siblings.
   *
   * Children-based (rather than `items={[]}`) so callers can mix plain text,
   * `<span>`s, links, and other inline content without losing rich-content
   * support.
   */
  children: ReactNode;
}

/**
 * The dot-separated metadata strip — "v1.2 · 3 days ago · Sarah" — that
 * appeared by hand-rolled flex+span+span+span in card footers across modo.
 * Renders muted text with a 4px dot between each child.
 */
export function MetaRow({ children, className, ...rest }: MetaRowProps) {
  // Children.toArray already drops null / undefined / boolean — the
  // returned array's type doesn't allow falsy entries.
  const items = Children.toArray(children);
  return (
    <div {...rest} className={cn('uxm-meta-row', className)}>
      {items.map((child, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="uxm-meta-row__dot" aria-hidden="true" />}
          <span className="uxm-meta-row__item">{child}</span>
        </Fragment>
      ))}
    </div>
  );
}
