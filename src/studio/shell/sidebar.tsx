import { useState, useMemo, useEffect, useCallback } from 'react';

import { Badge } from '@/ui';
import { Chip } from '@/ui';
import { ExplorerListItem } from '@/ui';
import { ExplorerSection } from '@/ui';
import { Icon } from '@/ui';
import { IconButton } from '@/ui';
import { InlineAction } from '@/ui';
import { InputWithIcon } from '@/ui';

import { useUxm } from '../lib/context';
import { categories, categoryColors, getComponentsByCategory, registry } from '../lib/registry';

import type { Category } from '../lib/types';

const COLLAPSED_STORAGE_KEY = 'uxm:collapsed-categories';

export function Sidebar({ embed = false }: { embed?: boolean }) {
  const { selectedId, selectComponent, brand, theme } = useUxm();
  // Brand mark shown left of the title — same asset as the Sidebar Icon
  // brand control, defaulting to the viax mark. Theme-aware to match the
  // rest of the brand surface.
  const brandIcon =
    (theme === 'dark' ? brand.iconUrlDark || brand.iconUrl : brand.iconUrl) || '/viax-icon.svg';
  const grouped = getComponentsByCategory();
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  // Category filter — session only (not persisted). Empty set = no
  // filter active = show all categories. Multi-select so designers can
  // narrow to, e.g., Buttons + Inputs while comparing form atoms.
  const [activeCats, setActiveCats] = useState<Set<Category>>(new Set());
  // Whether the chip strip is expanded. Toggle button next to the
  // search input. Auto-opens when a category becomes active (so the
  // user can see what they've picked); doesn't auto-close.
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COLLAPSED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot restore of persisted collapsed state on mount
        if (Array.isArray(parsed)) setCollapsed(new Set(parsed.filter((x) => typeof x === 'string')));
      }
    } catch {
      /* ignore malformed/unavailable storage */
    }
  }, []);

  const toggleCategory = useCallback((cat: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      try { localStorage.setItem(COLLAPSED_STORAGE_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const toggleCat = useCallback((cat: Category) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  // Combined filter: text query AND category set. Both can be active
  // at once — typing "save" with the Buttons chip selected shows only
  // Button atoms matching "save". When neither is active we return
  // null and fall back to the grouped layout below.
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const catActive = activeCats.size > 0;
    if (!q && !catActive) return null;
    return registry.filter((def) => {
      if (catActive && !activeCats.has(def.category)) return false;
      if (!q) return true;
      return (
        def.name.toLowerCase().includes(q) ||
        def.category.toLowerCase().includes(q) ||
        def.description.toLowerCase().includes(q)
      );
    });
  }, [query, activeCats]);

  const matchCount = filtered ? filtered.length : registry.length;

  return (
    <aside className={`flex flex-col border-r border-border overflow-y-auto ${embed ? 'bg-transparent' : 'bg-surface-alt'}`}>
      <div className={`sticky top-0 z-10 ${embed ? 'bg-card pt-3' : 'bg-surface-alt'}`}>
        {/* Header — hidden in embed mode */}
        {!embed && (
          <div className="px-5 pt-2 pb-6 flex items-start gap-3">
            <img
              src={brandIcon}
              alt=""
              aria-hidden
              className="w-auto object-contain shrink-0"
              style={{ height: 40, marginTop: 12 }}
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-[38px] tracking-[-0.06em] text-text leading-none" style={{ fontFamily: 'var(--font-logo)' }}>uxm</h1>
              <p className="text-xs text-text-muted mt-1">Component Explorer</p>
            </div>
          </div>
        )}

        {/* Search + category filter. Search input fills the row; the
            filter button toggles a chip strip of category quick-picks
            below. The chip strip stays collapsed by default — most
            sessions don't need category narrowing — but auto-opens
            when any chip is active so the user can see what's picked.
            Clear button in <InputWithIcon> handles type="search". */}
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <InputWithIcon
                type="search"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClear={() => setQuery('')}
                icon={<Icon glyph="search" size={14} />}
              />
            </div>
            <IconButton
              onClick={() => setFiltersOpen((v) => !v)}
              aria-label={filtersOpen ? 'Hide category filter' : 'Filter by category'}
              title="Filter by category"
              aria-expanded={filtersOpen}
              // Indicator dot is rendered as a pseudo-style positioned
              // overlay so the button keeps its uniform 32×32 footprint.
              // We surface "filter is active" via the dot rather than
              // changing the button's color, which would compete with
              // the IconButton atom's own hover/active states.
              style={{ position: 'relative' }}
            >
              <Icon glyph="filter" size={14} />
              {activeCats.size > 0 && (
                // Badge atom (dot mode) for the "filter is active"
                // indicator. Themable via the Badge registry's
                // `--uxm-badge-accent-dot-color` knob, and reads as
                // the same status-indicator vocabulary used elsewhere
                // (notification counts, system alerts). The 6px size
                // is set via `--uxm-badge-dot-size` so we don't
                // override Badge's own dot dimensions globally.
                <Badge
                  mode="dot"
                  type="accent"
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    ['--uxm-badge-dot-size' as string]: '6px',
                  }}
                />
              )}
            </IconButton>
          </div>
          {filtersOpen && (
            <div className="mt-2.5">
              {/* Category quick-picks. `mode="filter"` is Material Design's
                  chip-as-filter pattern — selected state is a real toggle,
                  multi-select supported. The "Clear" affordance appears
                  only when at least one chip is selected. */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <Chip
                    key={cat}
                    mode="filter"
                    selected={activeCats.has(cat)}
                    onClick={() => toggleCat(cat)}
                    iconLeft={
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: categoryColors[cat],
                          display: 'inline-block',
                        }}
                      />
                    }
                  >
                    {cat}
                  </Chip>
                ))}
              </div>
              {activeCats.size > 0 && (
                <div className="mt-2">
                  <InlineAction onClick={() => setActiveCats(new Set())}>
                    Clear filter
                  </InlineAction>
                </div>
              )}
            </div>
          )}
          {(query || activeCats.size > 0) && (
            <p className="text-[11px] text-text-subtle mt-1.5 px-1">
              {matchCount} result{matchCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Component list */}
      <nav className="flex-1 px-3 pb-4">
        {filtered ? (
          // Flat search results
          filtered.length > 0 ? (
            <div className="space-y-0.5">
              {filtered.map((def) => (
                <ExplorerListItem
                  key={def.id}
                  name={def.name}
                  trailing={def.category}
                  active={selectedId === def.id}
                  onClick={() => selectComponent(def.id)}
                />
              ))}
            </div>
          ) : (
            <div className="px-3 py-8 text-center">
              <p className="text-xs text-text-subtle">No components match &quot;{query}&quot;</p>
            </div>
          )
        ) : (
          // Grouped by category
          categories.map((cat) => {
            const isCollapsed = collapsed.has(cat);
            const count = grouped[cat].length;
            return (
              <div key={cat} className="mb-4">
                <ExplorerSection
                  open={!isCollapsed}
                  onClick={() => toggleCategory(cat)}
                  className="mb-1.5"
                  indicator={
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: categoryColors[cat],
                        display: 'inline-block',
                      }}
                    />
                  }
                  trailing={count}
                >
                  {cat}
                </ExplorerSection>
                {!isCollapsed && grouped[cat].map((def) => (
                  <ExplorerListItem
                    key={def.id}
                    name={def.name}
                    active={selectedId === def.id}
                    onClick={() => selectComponent(def.id)}
                  />
                ))}
              </div>
            );
          })
        )}
      </nav>
    </aside>
  );
}
