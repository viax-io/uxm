import { useEffect, useMemo, useRef, useState } from 'react';

import { Icon } from '@/ui';
import { IconButton } from '@/ui';
import { InlineAction } from '@/ui';
import { SectionHeader } from '@/ui';
import { Tabs } from '@/ui';

import { CodeEditor } from '../../editors/code-editor';
import { SelectInput } from '../../editors/select-input';
import { useUxm } from '../../lib/context';
import { getComponentDef, registry } from '../../lib/registry';
import { WcagPanel } from '../wcag-panel';

import { DevTab } from './dev-tab';
import { PropertyRow, renderEditor } from './property-row';

import type { ComponentDef } from '../../lib/types';

type Tab = 'visual' | 'dev' | 'code';

export function PropertiesPanel({
  orientation = 'horizontal',
  onToggleOrientation,
}: {
  /**
   * Accepted for API compatibility with host portals that mount the panel
   * embedded. No longer switches the surface color — the properties panel
   * is always white (`bg-card`) so its text keeps full contrast in both the
   * standalone studio and an embedded portal.
   */
  embed?: boolean;
  orientation?: 'horizontal' | 'vertical';
  onToggleOrientation?: () => void;
}) {
  const [tab, setTab] = useState<Tab>('visual');
  const {
    selectedId,
    getOverrides,
    setOverride,
    resetOverride,
    resetOverrides,
    getCurrentVariants,
    setVariant,
    eventLog,
    clearEvents,
  } = useUxm();
  const def = getComponentDef(selectedId);
  const overrides = getOverrides(selectedId);
  const currentVariants = getCurrentVariants();

  // Keys that were just cascaded — shows a brief "Matched ✓" state, then hides the link.
  // A change to the same key (value edit) removes it so the link reappears.
  const [syncedKeys, setSyncedKeys] = useState<Set<string>>(new Set());
  const [justMatchedKey, setJustMatchedKey] = useState<string | null>(null);
  const justMatchedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset sync state when switching components.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset of cascade-sync UI state on component switch
    setSyncedKeys(new Set());
    setJustMatchedKey(null);
    if (justMatchedTimer.current) {
      clearTimeout(justMatchedTimer.current);
      justMatchedTimer.current = null;
    }
  }, [selectedId]);

  useEffect(() => () => {
    if (justMatchedTimer.current) clearTimeout(justMatchedTimer.current);
  }, []);

  const peers = useMemo<ComponentDef[]>(
    () => def ? registry.filter((c) => c.category === def.category && c.id !== def.id) : [],
    [def],
  );

  const peersByKey = useMemo(() => {
    const map = new Map<string, ComponentDef[]>();
    if (!def) return map;
    for (const prop of def.styleProperties) {
      const matches = peers.filter((p) => p.styleProperties.some((pp) => pp.key === prop.key));
      if (matches.length) map.set(prop.key, matches);
    }
    return map;
  }, [def, peers]);

  if (!def) return null;

  // Variants live in ephemeral session state; styleProperty edits live in
  // persisted overrides. `resolve` checks both so panel UI reads the right
  // thing regardless of which kind of key it's looking at.
  const resolve = (key: string, fallback: string | number | boolean) => {
    const isVariantKey = def.layoutVariants.some((v) => v.key === key);
    if (isVariantKey) return currentVariants[key] ?? fallback;
    return overrides[key] ?? fallback;
  };

  const handleChange = (key: string) => (value: string | number | boolean) => {
    // Branch by key kind. Variants are UI selection — never written to
    // overrides. Style edits are persisted. Auto-clear an override when
    // value === default so the "Reset" affordance reflects the real
    // customization state (manually setting a knob back to its default
    // doesn't leave a stale entry in overrides).
    const variant = def.layoutVariants.find((v) => v.key === key);
    if (variant) {
      setVariant(key, value);
      return;
    }
    const prop = def.styleProperties.find((p) => p.key === key);
    if (prop !== undefined && value === prop.defaultValue) {
      resetOverride(selectedId, key);
    } else {
      setOverride(selectedId, key, value);
    }
    // Any edit diverges this key from its peers — allow re-cascading.
    setSyncedKeys((prev) => {
      if (!prev.has(key)) return prev;
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  // Variants now live in ephemeral session state and never reach overrides,
  // so any key here is a real style edit — no filtering needed.
  const hasOverrides = Object.keys(overrides).length > 0;

  const SECTION_LABELS: Record<string, string> = {
    colors: 'Colors',
    states: 'States',
    style: 'Style',
    frame: 'Frame',
    header: 'Header',
    weekday: 'Weekday Row',
    'shared-states': 'Shared States',
    'day-cell': 'Date Cell',
    'month-year-cells': 'Month & Year Cells',
    text: 'Text',
    uncheckedColors: 'Unchecked',
    checkedColors: 'Checked',
    offColors: 'Off',
    onColors: 'On',
    unselectedColors: 'Unselected',
    selectedColors: 'Selected',
    fieldColors: 'Field Colors',
    dropAreaColors: 'Drop Area',
    dropOutline: 'Drop Outline',
    triggerColors: 'Trigger Colors',
    popover: 'Popover',
    option: 'Option',
    focusState: 'Focus',
    disabledState: 'Disabled',
    errorState: 'Error Message',
    rangeOptions: 'Range Options',
    dragState: 'Drag Over',
    fileList: 'File List',
    fileListProgress: 'File List Progress',
    fileListStatus: 'File List Status',
    headerSlot: 'Header Slot',
    footerSlot: 'Footer Slot',
  };
  const allShowWhenKeys = Array.from(
    new Set(def.styleProperties.flatMap((p) => p.showWhen ? Object.keys(p.showWhen) : [])),
  );
  const labelize = (vKey: string) =>
    def.layoutVariants.find((v) => v.key === vKey)?.label ?? vKey;
  const sectionScopeKeys = (props: ComponentDef['styleProperties']) =>
    Array.from(new Set(props.flatMap((p) => p.showWhen ? Object.keys(p.showWhen) : [])));
  const sectionTitleFor = (slug: string) =>
    SECTION_LABELS[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
  const sectionSubtitleFor = (props: ComponentDef['styleProperties']):
    | { scope: string; current: string | null }
    | null => {
    const keys = sectionScopeKeys(props);
    if (keys.length > 0) {
      const scope = `Per ${keys.map(labelize).join(' × ')}`;
      const current = keys.map((vKey) => {
        const variant = def.layoutVariants.find((v) => v.key === vKey);
        if (!variant) return null;
        const v = resolve(vKey, variant.defaultValue) as string;
        return variant.options.find((o) => o.value === v)?.label ?? v;
      }).filter(Boolean).join(' / ');
      return { scope, current: current || null };
    }
    if (allShowWhenKeys.length > 0) {
      const variantNames = allShowWhenKeys
        .map((k) => labelize(k).toLowerCase() + 's')
        .join(' / ');
      return { scope: `Shared across all ${variantNames}`, current: null };
    }
    return null;
  };
  const sectionBarCategoryFor = (props: ComponentDef['styleProperties']): 'full' | 'partial' | 'shared' => {
    const keys = sectionScopeKeys(props);
    if (keys.length === 0) return 'shared';
    if (keys.length === allShowWhenKeys.length) return 'full';
    return 'partial';
  };
  const BAR_COLOR: Record<'full' | 'partial', string> = {
    full: 'var(--color-highlight-cool)',
    partial: 'var(--color-highlight-warm)',
  };

  // Shared variant-scope filter: an entry with `showWhen` only renders
  // when the current value of every named variant matches. Used by both
  // style properties (existing) and event specs (Events tab).
  const matchesShowWhen = (showWhen?: Record<string, string | string[]>) => {
    if (!showWhen) return true;
    for (const [vKey, vVal] of Object.entries(showWhen)) {
      const current = resolve(
        vKey,
        def.layoutVariants.find((v) => v.key === vKey)?.defaultValue ?? '',
      ) as string;
      // A string[] means "match any of" — the same rule the per-option
      // matcher below uses. Without it a multi-value clause has to be
      // spelled as one string, which is compared verbatim and never matches
      // (that silently hid four editable-cell knobs).
      const allowed = Array.isArray(vVal) ? vVal : [vVal];
      if (!allowed.includes(current)) return false;
    }
    return true;
  };

  const visibleStyleProps = def.styleProperties.filter((prop) =>
    matchesShowWhen(prop.showWhen),
  );
  const visibleEvents = (def.events ?? []).filter((ev) =>
    matchesShowWhen(ev.showWhen),
  );
  // Variants themselves can be scoped via `showWhen` — e.g. the State
  // picker on list-item is irrelevant when `trailing` is meta / none,
  // so the variant disappears entirely rather than sitting as a no-op.
  const visibleVariants = def.layoutVariants.filter((v) =>
    matchesShowWhen(v.showWhen),
  );
  const sectionsMap = new Map<string, ComponentDef['styleProperties']>();
  for (const prop of visibleStyleProps) {
    const slug = prop.section ?? 'style';
    if (!sectionsMap.has(slug)) sectionsMap.set(slug, []);
    sectionsMap.get(slug)!.push(prop);
  }
  const sectionGroups = Array.from(sectionsMap.entries());

  const cascadeKey = (key: string, value: string | number | boolean) => {
    const targets = peersByKey.get(key) ?? [];
    if (targets.length === 0) return;
    for (const p of targets) setOverride(p.id, key, value);
    setSyncedKeys((prev) => new Set(prev).add(key));
    setJustMatchedKey(key);
    if (justMatchedTimer.current) clearTimeout(justMatchedTimer.current);
    justMatchedTimer.current = setTimeout(() => setJustMatchedKey(null), 1400);
  };

  return (
    <aside className={`flex flex-col overflow-hidden w-full h-full ${
      orientation === 'horizontal' ? 'border-l' : 'border-t'
    } border-border bg-card`}>
      {/* Header with tabs */}
      <div className="sticky top-0 z-10 border-b border-border px-5 py-3 bg-card">
        {/* Panel-level header — uses the same SectionHeader atom as the
            VARIANT / COLORS / STYLE per-section headers below, so the
            entire panel's section-title chrome flows through one
            theming surface (`--uxm-section-header-*`). The orientation
            toggle and "Reset all" go into the trailing slot. The 1px
            font-size shift from `text-xs` (12px) to SectionHeader's
            default 11px is intentional — keeps the panel header
            consistent with section headers. */}
        <SectionHeader
          trailing={
            <div className="flex items-center gap-3">
              {onToggleOrientation && (
                <IconButton
                  onClick={onToggleOrientation}
                  aria-label={
                    orientation === 'horizontal'
                      ? 'Move panel to bottom'
                      : 'Move panel to right'
                  }
                  title={
                    orientation === 'horizontal'
                      ? 'Dock to bottom'
                      : 'Dock to right'
                  }
                  // 20×20 footprint matches the previous `h-5 w-5` chrome.
                  style={{ ['--uxm-icon-button-size' as string]: '20px' }}
                >
                  <Icon
                    glyph={orientation === 'horizontal' ? 'dock-bottom' : 'dock-right'}
                    size={14}
                  />
                </IconButton>
              )}
              {hasOverrides && (
                <InlineAction onClick={() => resetOverrides(selectedId)}>
                  Reset all
                </InlineAction>
              )}
            </div>
          }
        >
          Properties
        </SectionHeader>


        {/* Tab bar — uses the real <Tabs> atom so editor saves on the
            Tabs registry (active-bg, padding-x/y, font-size, etc.) flow
            into the properties pane's own toggle. The previous hand-rolled
            <button> elements had `className="uxm-tabs"` on the wrapper but
            no `.uxm-tabs__tab` on the inner buttons, so every inner-element
            var (which is what most Tabs knobs control) silently no-oped
            here. `w-full` keeps the strip stretching across the panel —
            the atom is `display: inline-flex` by default. */}
        <Tabs
          className="w-full"
          value={tab}
          onChange={(v) => setTab(v as Tab)}
          options={[
            {
              value: 'visual',
              label: 'Visual',
              icon: <Icon glyph="list" size={12} />,
            },
            {
              value: 'dev',
              label: 'Dev',
              icon: <Icon glyph="bolt" size={12} />,
            },
            {
              value: 'code',
              label: 'CSS',
              icon: <Icon glyph="code" size={12} />,
            },
          ]}
        />
      </div>

      {/* Tab content */}
      {tab === 'visual' ? (
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Bottom-dock (`orientation === "vertical"`) gives the pane the
              full canvas width — far more than the ~320px right-dock. We
              switch to an auto-fit grid so each section (Variants, Colors,
              Style, WCAG) becomes its own column, side-by-side, wrapping
              gracefully on narrow widths. The `mb-6` between sections is
              dropped in grid mode because grid `gap-y-4` handles spacing
              instead — leaving both would double-space the wrapped rows. */}
          <div
            className={
              orientation === 'vertical'
                ? 'grid items-start gap-x-6 gap-y-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]'
                : ''
            }
          >
          {/* Variant selectors — render before Styles so mode/state/type selectors anchor the form. */}
          {visibleVariants.length > 0 && (
            <div className={orientation === 'vertical' ? 'min-w-0' : 'mb-6'}>
              <SectionHeader>
                {visibleVariants.length === 1 ? 'Variant' : 'Variants'}
              </SectionHeader>
              <div className="space-y-3">
                {visibleVariants.map((variant) => {
                  const rawValue = resolve(variant.key, variant.defaultValue) as string;
                  const visibleOptions = variant.options.filter((opt) => {
                    if (!opt.showWhen) return true;
                    for (const [vKey, vVal] of Object.entries(opt.showWhen)) {
                      const current = resolve(
                        vKey,
                        def.layoutVariants.find((v) => v.key === vKey)?.defaultValue ?? '',
                      ) as string;
                      // A string[] means "match any of"; a string is exact.
                      const allowed = Array.isArray(vVal) ? vVal : [vVal];
                      if (!allowed.includes(current)) return false;
                    }
                    return true;
                  });
                  const valid = visibleOptions.some((o) => o.value === rawValue);
                  const value = valid
                    ? rawValue
                    : visibleOptions.some((o) => o.value === variant.defaultValue)
                      ? variant.defaultValue
                      : visibleOptions[0]?.value ?? rawValue;
                  if (!valid && value !== rawValue) {
                    // Stale variant selection (showWhen filtered out the option).
                    // Repair to a valid value via the variant channel, not overrides —
                    // variants are ephemeral session state. Guarded on
                    // `value !== rawValue` so an empty `visibleOptions` (no
                    // fallback available) doesn't re-queue this microtask
                    // forever — `value` would otherwise fall back to
                    // `rawValue` itself and never settle.
                    queueMicrotask(() => setVariant(variant.key, value));
                  }
                  return (
                    <div key={variant.key} data-variant-key={variant.key}>
                      <SelectInput
                        label={variant.label}
                        value={value}
                        onChange={handleChange(variant.key)}
                        options={visibleOptions}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Style Properties — grouped by section */}
          {sectionGroups.map(([slug, props]) => {
            const overriddenInSection = props.filter((p) => p.key in overrides);
            const hasSectionOverrides = overriddenInSection.length > 0;
            return (
            <div
              key={slug}
              className={`${orientation === 'vertical' ? 'min-w-0' : 'mb-6'} ${sectionBarCategoryFor(props) === 'shared' ? '' : 'border-l-2 pl-3 -ml-3'}`}
              style={sectionBarCategoryFor(props) === 'shared' ? undefined : { borderColor: BAR_COLOR[sectionBarCategoryFor(props) as 'full' | 'partial'] }}
            >
              {(() => {
                const sub = sectionSubtitleFor(props);
                const subtitle = sub ? (
                  <>
                    <span>{sub.scope}</span>
                    {sub.current && (
                      <>
                        <span style={{ color: 'var(--color-text-subtle)' }}>·</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-strong)' }}>
                          {sub.current}
                        </span>
                      </>
                    )}
                  </>
                ) : null;
                return (
                  <SectionHeader
                    subtitle={subtitle}
                    trailing={
                      hasSectionOverrides && sectionGroups.length > 1 ? (
                        <InlineAction
                          onClick={() => {
                            for (const p of overriddenInSection) resetOverride(selectedId, p.key);
                          }}
                          title={`Reset ${overriddenInSection.length} field${overriddenInSection.length === 1 ? '' : 's'} in this section to default`}
                          icon={<Icon glyph="refresh" strokeWidth={2.25} aria-hidden />}
                        >
                          Reset section
                        </InlineAction>
                      ) : undefined
                    }
                  >
                    {sectionTitleFor(slug)}
                  </SectionHeader>
                );
              })()}
              <div className="space-y-3">
                {props.map((prop) => {
                  const value = resolve(prop.key, prop.defaultValue);
                  const onChange = handleChange(prop.key);
                  const editor = renderEditor(prop.control, {
                    label: prop.label,
                    value,
                    onChange,
                    prop,
                  });
                  const peerCount = peersByKey.get(prop.key)?.length ?? 0;
                  const isOverridden = prop.key in overrides;
                  const isSynced = syncedKeys.has(prop.key);
                  const isJustMatched = justMatchedKey === prop.key;
                  return (
                    <PropertyRow
                      key={prop.key}
                      cascadeCount={isOverridden ? peerCount : 0}
                      onCascade={() => cascadeKey(prop.key, value)}
                      category={def.category}
                      propLabel={prop.label}
                      synced={isSynced}
                      justMatched={isJustMatched}
                      isOverridden={isOverridden}
                      onReset={() => resetOverride(selectedId, prop.key)}
                    >
                      {editor}
                    </PropertyRow>
                  );
                })}
              </div>
            </div>
            );
          })}

          {/* WCAG spans two grid columns when bottom-docked — its colour-pair
              rows have enough horizontal content that a single 220px column
              squashes them. `col-span-2` is a no-op outside the grid since
              there's no grid context to span over. */}
          <div className={orientation === 'vertical' ? 'min-w-0 col-span-2' : ''}>
            <WcagPanel def={def} />
          </div>
          </div>
        </div>
      ) : tab === 'dev' ? (
        <DevTab
          def={def}
          api={def.api}
          events={visibleEvents}
          eventLog={eventLog}
          onClearLog={clearEvents}
          orientation={orientation}
          currentVariants={currentVariants}
          overrides={overrides}
        />
      ) : (
        <div className="flex-1 overflow-hidden p-3">
          <CodeEditor />
        </div>
      )}
    </aside>
  );
}
