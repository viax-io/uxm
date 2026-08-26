import { cn } from '@/helpers';
import { getIcon } from '@/lib/icons';

import type { SVGAttributes } from 'react';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  glyph: string;
  size?: number;
  strokeWidth?: number;
}

export function Icon({ glyph, size = 24, strokeWidth = 1.75, className, ...rest }: IconProps) {
  const def = getIcon(glyph);
  if (!def) return null;

  const ariaLabel = (rest as { 'aria-label'?: string })['aria-label'];

  const commonProps = {
    className: cn('uxm-icon', className),
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: def.filled ? 'currentColor' : 'none',
    stroke: def.filled ? 'none' : 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    // Decorative by default: without an explicit `aria-label` the glyph is
    // hidden from the accessibility tree, so an icon+text control's name is
    // its text alone (the registry label used to leak in — "Kebab (More)
    // Publish"-style names). Pass `aria-label` to make a standalone icon
    // informative; an explicit `aria-hidden` in `...rest` still wins.
    // Truthy check on purpose: `aria-label=""` is not a name — it stays
    // decorative rather than becoming an UNNAMED `role="img"`.
    ...(ariaLabel
      ? { role: 'img' as const }
      : { 'aria-hidden': true }),
    ...rest,
  };

  if (def.body) {
    return <svg {...commonProps} dangerouslySetInnerHTML={{ __html: def.body }} />;
  }

  if (def.path) {
    const segments = def.path.split(/(?=M)/);
    return (
      <svg {...commonProps}>
        {segments.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    );
  }

  return null;
}
