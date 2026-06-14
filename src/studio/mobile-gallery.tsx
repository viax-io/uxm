import { useMemo } from 'react';

import { BrandSettingsPreview } from '@/previews';
import { Icon } from '@/ui';

import { useUxm } from './lib/context';
import { usePreviewShell } from './lib/preview-shell';
import { registry, categoryColors } from './lib/registry';
import { previewMap } from './shell/canvas';

import type { ComponentDef } from './lib/types';


type StyleMap = Record<string, string | number | boolean>;

function resolveStylesAndVariants(def: ComponentDef, overrides: StyleMap): { styles: StyleMap; variants: Record<string, string> } {
  const styles: StyleMap = {};
  for (const prop of def.styleProperties) {
    styles[prop.key] = overrides[prop.key] ?? prop.defaultValue;
  }
  // Mobile gallery is a read-only display — there's no selection/variant
  // session here. Variants always resolve to their canonical default so
  // every atom shows its baseline look. Style overrides (real saves) still
  // apply via `styles` above.
  const variants: Record<string, string> = {};
  for (const v of def.layoutVariants) {
    variants[v.key] = v.defaultValue as string;
  }
  return { styles, variants };
}

export function MobileGallery() {
  const { getAllOverrides } = useUxm();
  const shell = usePreviewShell();
  const allOverrides = getAllOverrides();

  // Exclude Brand Settings from the gallery — it renders at the top as an editable card.
  const galleryItems = useMemo(
    () => registry.filter((def) => def.id !== 'brand-settings'),
    [],
  );

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-card text-text">
      {/* Banner */}
      <div className="flex items-start gap-3 border-b border-border bg-accent-subtle/40 px-4 py-3">
        <Icon glyph="sparkle" size={20} className="shrink-0 text-accent-bold" />
        <div>
          <p className="text-[13px] font-semibold text-text">Viewing on a small screen</p>
          <p className="text-[12px] text-text-strong leading-relaxed">
            Component editing is a desktop experience. You can still tweak brand settings below and browse
            the component gallery. <span className="text-accent-bold">Open UXM on desktop</span> to change styles, run the
            WCAG checker, and publish.
          </p>
        </div>
      </div>

      {/* Brand Settings — editable on mobile */}
      <section className="border-b border-border px-4 py-5">
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Brand
        </h2>
        <BrandSettingsPreview
          styles={{}}
          variants={{}}
          componentId="brand-settings"
          shell={shell}
        />
      </section>

      {/* Component gallery — read-only */}
      <section className="px-4 py-5">
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Components
        </h2>
        <div className="flex flex-col gap-4">
          {galleryItems.map((def) => {
            const Preview = previewMap[def.id];
            if (!Preview) return null;
            const overrides = allOverrides[def.id] ?? {};
            const { styles, variants } = resolveStylesAndVariants(def, overrides);
            return (
              <article
                key={def.id}
                className="overflow-hidden rounded-lg border border-border bg-surface"
              >
                <header className="flex items-start justify-between gap-2 border-b border-border px-4 py-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-[14px] font-semibold text-text">{def.name}</h3>
                    <p className="mt-0.5 text-[11px] text-text-muted">{def.description}</p>
                  </div>
                  <span
                    className="shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-text-strong"
                    style={{ backgroundColor: 'var(--color-surface-alt)' }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: categoryColors[def.category] }}
                    />
                    {def.category}
                  </span>
                </header>
                <div
                  className="flex min-h-[120px] items-center justify-center overflow-auto bg-card p-6"
                  style={{
                    backgroundImage: 'radial-gradient(circle, var(--color-canvas-dot) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                >
                  {/* pointer-events none so previews can't capture taps — read-only gallery */}
                  <div style={{ pointerEvents: 'none', maxWidth: '100%' }}>
                    <Preview styles={styles} variants={variants} componentId={def.id} shell={shell} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
