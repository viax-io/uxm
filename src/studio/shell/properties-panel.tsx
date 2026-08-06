import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';

import { Card } from '@/ui';
import { Icon } from '@/ui';
import { IconButton } from '@/ui';
import { InlineAction } from '@/ui';
import { SectionHeader } from '@/ui';
import { Tabs } from '@/ui';

import { CodeEditor } from '../editors/code-editor';
import { ColorPicker } from '../editors/color-picker';
import { NumberInput } from '../editors/number-input';
import { SelectInput } from '../editors/select-input';
import { SliderInput } from '../editors/slider-input';
import { TextInput } from '../editors/text-input';
import { ToggleInput } from '../editors/toggle-input';
import { useUxm } from '../lib/context';
import { usePreviewShell } from '../lib/preview-shell';
import { getComponentDef, registry } from '../lib/registry';

import { previewMap } from './canvas';
import { WcagPanel } from './wcag-panel';

import type { LoggedEvent } from '../lib/context';
import type { ComponentDef, PreviewProps, StyleOverrides } from '../lib/types';

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

/**
 * Events tab — Storybook-style API + activity panel. Two sections:
 *
 *   1. EMITS — the static event spec from the registry. Reads like
 *      a method-signature table: each row is one event name, its
 *      payload, and a short description of when it fires.
 *   2. LIVE LOG — runtime capture from the canvas. Updated whenever
 *      the user interacts with the rendered atom. Capped at 200
 *      entries (see EVENT_LOG_LIMIT). Latest at top.
 *
 * The capture itself lives in canvas.tsx — we just render what's in
 * the context-managed `eventLog` here. That separation keeps the
 * Properties pane independent of the rendered atom's DOM tree.
 */
function DevTab({
  def,
  api,
  events,
  eventLog,
  onClearLog,
  orientation,
  currentVariants,
  overrides,
}: {
  def: ComponentDef;
  api: ComponentDef['api'];
  events: ComponentDef['events'];
  eventLog: LoggedEvent[];
  onClearLog: () => void;
  orientation: 'horizontal' | 'vertical';
  currentVariants: Record<string, string | number | boolean>;
  overrides: StyleOverrides;
}) {
  // Resolved styles for the variant matrix — overrides win over
  // defaults, same logic the canvas applies. Reused by every cell so
  // they all reflect the user's current theming, just with different
  // variant values locked in.
  const resolvedStyles: Record<string, string | number | boolean> = {};
  for (const prop of def.styleProperties) {
    resolvedStyles[prop.key] = overrides[prop.key] ?? prop.defaultValue;
  }
  return (
    <div className="flex-1 overflow-y-auto px-5 py-4">
      {/* Bottom-dock (`orientation === "vertical"`) gives the pane the
          full canvas width. Match the Visual tab's auto-fit grid so
          API / Emits / Live Log sit side-by-side instead of stacking.
          Same `mb-6` ↔ `min-w-0` swap as the Visual tab: grid `gap-y-4`
          handles spacing in grid mode, so the section's own bottom
          margin would double-space wrapped rows. */}
      <div
        className={
          orientation === 'vertical'
            ? 'grid items-start gap-x-6 gap-y-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]'
            : ''
        }
      >
      {/* API section — renders when the registry entry carries an
          `api` slot. Built first because it's the developer's "how do
          I use this?" entry point; Emits + Live Log are the runtime
          observation layer below. */}
      {api && (
        <div className={orientation === 'vertical' ? 'min-w-0' : 'mb-6'}>
          <ApiSection api={api} currentVariants={currentVariants} />
        </div>
      )}

      {/* Variant Matrix — renders only when the atom has variants
          (atoms without any layoutVariants would just show a single
          duplicate of the canvas preview, which is noise). */}
      {def.layoutVariants.length > 0 && (
        <div className={orientation === 'vertical' ? 'min-w-0' : 'mb-6'}>
          <VariantMatrix def={def} styles={resolvedStyles} currentVariants={currentVariants} />
        </div>
      )}

      <div className={orientation === 'vertical' ? 'min-w-0' : 'mb-6'}>
        <SectionHeader>Emits</SectionHeader>
        {events && events.length > 0 ? (
          <div className="space-y-2 text-[12px]">
            {events.map((ev) => (
              // Card atom (uxm-card surface) instead of a hand-rolled div
              // so the spec rows pick up the design system's bg/border/
              // radius tokens and flow through Card's registry knobs.
              // Padding + radius are tightened inline to keep the dense
              // panel-row feel — Card's 24px default is meant for full
              // page cards, not list rows.
              <Card
                key={ev.name}
                style={{ padding: '8px 12px', borderRadius: 6 }}
              >
                <div className="flex items-baseline gap-2">
                  <code className="text-[12px] font-semibold text-accent-bold">
                    {ev.name}
                  </code>
                  {ev.payload && (
                    <code className="text-[11px] text-text-muted">
                      ({ev.payload})
                    </code>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-text-muted leading-relaxed">
                  {ev.description}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-text-muted leading-relaxed">
            No event spec yet for this component. Interact with the canvas
            to see the live activity log below.
          </p>
        )}
      </div>

      <div className={orientation === 'vertical' ? 'min-w-0' : ''}>
        <SectionHeader
          trailing={
            eventLog.length > 0 ? (
              <InlineAction
                onClick={onClearLog}
                icon={<Icon glyph="refresh" strokeWidth={2.25} aria-hidden />}
              >
                Clear
              </InlineAction>
            ) : undefined
          }
        >
          Live Log
        </SectionHeader>
        {eventLog.length === 0 ? (
          <p className="text-[12px] text-text-muted leading-relaxed">
            Interact with the preview to see events appear here.
          </p>
        ) : (
          // Dark-theme log surface — same hardcoded palette the CSS
          // editor uses (#1e1e1e bg / #2a2a2a border / #d4d4d8 text).
          // Intentionally bypasses design tokens for the same reason
          // the code editor does: a developer-output surface should
          // read as a developer-output surface regardless of the
          // product's light/dark theme.
          //
          // Row layout: header row (time + name + target) plus an
          // optional payload row indented to align under the event name
          // (58px time column + 8px gap = 66px). `tabular-nums` keeps
          // the timestamp column steady as digits change; `break-all`
          // lets long payloads wrap rather than overflow. Single
          // consumer for now — if a second log surface lands, extract
          // `LogRow` then.
          <div
            style={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #2a2a2a',
              borderRadius: 8,
              padding: '6px 10px',
            }}
          >
            <ol className="font-mono text-[11px]" style={{ color: '#d4d4d8' }}>
              {eventLog.map((entry, i) => (
                <li
                  key={entry.id}
                  className="py-1.5"
                  style={{
                    // Thin divider in the dark palette — only between
                    // entries, not above the first one.
                    borderTop: i === 0 ? undefined : '1px solid #2a2a2a',
                  }}
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      className="tabular-nums text-[10px] w-[58px] shrink-0"
                      style={{ color: '#71717a' }}
                    >
                      {new Date(entry.ts).toLocaleTimeString(undefined, {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                    <span className="font-semibold" style={{ color: '#a5e8c2' }}>
                      {entry.name}
                    </span>
                    <span
                      className="ml-auto text-[10px] shrink-0"
                      style={{ color: '#71717a' }}
                    >
                      &lt;{entry.target}&gt;
                    </span>
                  </div>
                  {entry.payload && entry.payload !== '{}' && (
                    <div
                      className="pl-[66px] mt-0.5 break-all"
                      style={{ color: '#d4d4d8' }}
                    >
                      {entry.payload}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

function renderEditor(
  control: ComponentDef['styleProperties'][number]['control'],
  args: {
    label: string;
    value: string | number | boolean;
    onChange: (v: string | number | boolean) => void;
    prop: ComponentDef['styleProperties'][number];
  },
): ReactNode {
  const { label, value, onChange, prop } = args;
  switch (control) {
    case 'color':
      return <ColorPicker label={label} value={value as string} onChange={onChange} />;
    case 'number':
      return (
        <NumberInput
          label={label}
          value={value as number}
          onChange={onChange}
          min={prop.min}
          max={prop.max}
          step={prop.step}
          unit={prop.unit}
        />
      );
    case 'slider':
      return (
        <SliderInput
          label={label}
          value={value as number}
          onChange={onChange}
          min={prop.min ?? 0}
          max={prop.max ?? 100}
          step={prop.step ?? 1}
          unit={prop.unit}
        />
      );
    case 'select':
      return (
        <SelectInput
          label={label}
          value={value as string}
          onChange={onChange}
          options={(prop.options ?? []).map((o) => ({ value: o, label: o }))}
        />
      );
    case 'toggle':
      return <ToggleInput label={label} value={value as boolean} onChange={onChange} />;
    case 'text':
      return <TextInput label={label} value={value as string} onChange={onChange} />;
  }
}

function PropertyRow({
  cascadeCount,
  onCascade,
  category,
  propLabel,
  synced,
  justMatched,
  isOverridden,
  onReset,
  children,
}: {
  cascadeCount: number;
  onCascade: () => void;
  category: string;
  propLabel: string;
  synced: boolean;
  justMatched: boolean;
  isOverridden: boolean;
  onReset: () => void;
  children: ReactNode;
}) {
  // 16×16 footprint matches the previous `h-4 w-4` chrome — IconButton's
  // default is 32×32, so we override via the size var. Absolute
  // positioning lives inline since this is a panel-specific placement
  // (centred to the field row), not part of the atom's API.
  const resetIconStyle: CSSProperties = {
    ['--uxm-icon-button-size' as string]: '16px',
    color: 'var(--color-text-subtle)',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  };
  const resetButton = isOverridden ? (
    <IconButton
      onClick={onReset}
      title={`Reset ${propLabel} to default`}
      aria-label={`Reset ${propLabel} to default`}
      style={resetIconStyle}
    >
      <Icon glyph="refresh" size={12} strokeWidth={2.25} aria-hidden />
    </IconButton>
  ) : null;

  if (cascadeCount === 0) {
    return (
      <div className="relative pr-5">
        {children}
        {resetButton}
      </div>
    );
  }

  // Show post-cascade confirmation briefly; once that fades, hide the link until the value diverges again.
  const hideLink = synced && !justMatched;

  return (
    <div className="pl-3 -ml-3 border-l-2 border-accent-bold/30">
      <div className="relative pr-5">
        {children}
        {resetButton}
      </div>
      {!hideLink && (
        justMatched ? (
          // The success-state confirmation is intentionally left as a plain
          // span — it's a one-off transient state ("just matched"), not a
          // tappable action, so it doesn't fit InlineAction's button shape.
          <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-accent-bold">
            <Icon glyph="check" size={10} strokeWidth={3} />
            Matched in {cascadeCount} other {category}
          </span>
        ) : (
          <div className="mt-1.5">
            <InlineAction
              onClick={onCascade}
              title={`Apply "${propLabel}" to ${cascadeCount} other ${category}`}
              icon={<Icon glyph="arrow-down" strokeWidth={2.5} />}
            >
              Match in {cascadeCount} other {category}
            </InlineAction>
          </div>
        )
      )}
    </div>
  );
}

/**
 * Dev tab — API section. Shows the developer-facing component API:
 *
 *   1. **Import** — copy-button block with the exact `import { ... }` line.
 *   2. **Props** — table of props with type / required / default / desc.
 *   3. **Usage** — JSX snippet seeded from the current variant selection
 *      (so what's shown matches what's previewed).
 *
 * Authored alongside the atom in the registry (`api` slot on
 * `ComponentDef`). A future build-time extractor could populate the
 * same slot from TypeScript interface declarations — the consumer
 * shape stays the same.
 *
 * Uses the same dark surface as the CSS editor for the code blocks
 * (#1e1e1e / #2a2a2a / #d4d4d8). Reads as "developer output" rather
 * than "themable card content" — matches what the user expects from
 * Storybook's Docs addon.
 */
function ApiSection({
  api,
  currentVariants,
}: {
  api: NonNullable<ComponentDef['api']>;
  currentVariants: Record<string, string | number | boolean>;
}) {
  const importLine = formatImport(api);
  const usageSnippet = formatUsage(api, currentVariants);
  return (
    <div>
      <SectionHeader>API</SectionHeader>
      <CodeBlock label="Import" code={importLine} />
      {api.props.length > 0 && (
        <div className="mt-4">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-subtle">
            Props
          </div>
          <div className="space-y-2">
            {api.props.map((p) => (
              // Card atom for each prop row — same treatment as the
              // Emits cards so the two sections read as one family.
              <Card key={p.name} style={{ padding: '8px 12px', borderRadius: 6 }}>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <code className="text-[12px] font-semibold text-accent-bold">
                    {p.name}
                  </code>
                  {p.required && (
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-warm">
                      required
                    </span>
                  )}
                  <code className="text-[11px] text-text-muted break-all">
                    {p.type}
                  </code>
                </div>
                {p.defaultValue !== undefined && (
                  <div className="mt-0.5 text-[11px]">
                    <span className="text-text-subtle">default: </span>
                    <code className="text-text">{p.defaultValue}</code>
                  </div>
                )}
                {p.description && (
                  <p className="mt-1 text-[11px] text-text-muted leading-relaxed">
                    {p.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4">
        <CodeBlock label="Usage" code={usageSnippet} />
      </div>
    </div>
  );
}

/**
 * Compact dark-surface code-block for the API section — used for both
 * the import line and the usage snippet. Same hardcoded VS Code-ish
 * palette as the Live Log: a developer-output surface should read
 * the same regardless of the product's light/dark theme.
 */
function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-subtle">
        {label}
      </div>
      <pre
        className="font-mono text-[11px] whitespace-pre-wrap break-all"
        style={{
          backgroundColor: '#1e1e1e',
          border: '1px solid #2a2a2a',
          borderRadius: 8,
          padding: '8px 10px',
          color: '#d4d4d8',
          margin: 0,
        }}
      >
        {code}
      </pre>
    </div>
  );
}

/** Build the `import { X } from "path"` line from the api slot. */
function formatImport(api: NonNullable<ComponentDef['api']>): string {
  const names = Array.isArray(api.importNames)
    ? api.importNames.join(', ')
    : api.importNames;
  return `import { ${names} } from "${api.importPath}";`;
}

/**
 * Build a JSX usage snippet from the api slot + the user's current
 * variant selection in the editor. Variants flow in as props, which
 * matches how the atoms actually consume them (Chip's `mode`, Slider's
 * `mode`, button family's nothing — variants are visual previews).
 *
 * Variants whose value equals the canonical default ("default" state,
 * etc.) are omitted to keep the snippet readable. The user can always
 * see them in the Props table.
 */
function formatUsage(
  api: NonNullable<ComponentDef['api']>,
  variants: Record<string, string | number | boolean>,
): string {
  const name = Array.isArray(api.importNames) ? api.importNames[0] : api.importNames;
  const variantProps = Object.entries(variants)
    // Skip the boilerplate-y "state" variant — it's a visual preview
    // selector in the editor, not a real prop on most atoms.
    .filter(([k, v]) => k !== 'state' && v !== 'default')
    .map(([k, v]) => (typeof v === 'string' ? `${k}="${v}"` : `${k}={${v}}`));
  const attrs = variantProps.length > 0 ? ' ' + variantProps.join(' ') : '';
  return `<${name}${attrs}>\n  …\n</${name}>`;
}

/**
 * Dev tab — Variant Matrix section. Renders every variant × variant
 * combination of the current component as a thumbnail grid. Each cell
 * is the real Preview component (same `previewMap` the canvas uses)
 * with variants locked to that cell's combination; styles flow from
 * the user's current overrides so saved theming carries through.
 *
 * Layout strategy:
 *   - 1 variant   → single column of N thumbnails
 *   - 2 variants  → 2D grid (variant 1 as columns, variant 2 as rows)
 *   - 3+ variants → first two as the matrix axes; remaining variants
 *                   stay at their default value (3-D grids don't read
 *                   well in a panel; if a particular axis matters,
 *                   the user can pick it in the Visual tab and re-
 *                   visit the matrix)
 *
 * Each cell:
 *   - `pointer-events: none` so the thumbnail doesn't capture clicks
 *     (matches the MobileGallery's read-only convention)
 *   - `overflow: hidden` so wide atoms (SideFlexpane, AppSidebar) clip
 *     rather than overflow the matrix
 *   - thin caption beneath labeling the variant value
 */
function VariantMatrix({
  def,
  styles,
  currentVariants,
}: {
  def: ComponentDef;
  styles: Record<string, string | number | boolean>;
  currentVariants: Record<string, string | number | boolean>;
}) {
  const Preview = previewMap[def.id];
  const shell = usePreviewShell();
  if (!Preview) {
    return null;
  }

  // Filter variants suitable for matrix expansion. Two ineligibility
  // rules — both about cells that "don't make sense":
  //
  //   1. Large-enum variants (`glyph` with 56 icons): content
  //      selections, not visual variants. A 56×5 grid is pure noise.
  //      Heuristic cap: 8 options.
  //
  //   2. Gating variants: a variant V is a "gate" if some OTHER variant
  //      references it from a `showWhen` clause. Example: list-item's
  //      `state` has `showWhen: { mode: "interactive" }`, so `mode` is
  //      a gate. Expanding both as axes produces rows like (static,
  //      hover) / (static, focus) / etc., where every cell collapses
  //      to the same static rendering — wasted space. We instead lock
  //      the gate to the value the dependent needs (here: "interactive")
  //      and only expand the dependent.
  const MATRIX_AXIS_OPTION_CAP = 8;

  // Collect the gate map: gateKey → required value (from the FIRST
  // dependent's showWhen). Most components have a single dependent per
  // gate, so "first wins" is fine in practice; if conflicts ever come
  // up, the registry author can pick the variant order they want.
  const gateLocks: Record<string, string> = {};
  for (const v of def.layoutVariants) {
    const showWhen = (v as { showWhen?: Record<string, string> }).showWhen;
    if (!showWhen) continue;
    for (const [gateKey, gateVal] of Object.entries(showWhen)) {
      if (!(gateKey in gateLocks)) gateLocks[gateKey] = gateVal;
    }
  }

  const expandable = def.layoutVariants.filter(
    (v) =>
      v.options.length <= MATRIX_AXIS_OPTION_CAP &&
      !(v.key in gateLocks),
  );

  // If nothing's expandable, the matrix has nothing meaningful to
  // compare — hide the section. The Visual tab still covers variant
  // selection via the picker.
  if (expandable.length === 0) {
    return null;
  }

  const [axisX, axisY] = expandable;
  // Base variants — three priority layers:
  //   1. Gate locks (from another variant's showWhen) win first, so
  //      the matrix shows the dependent variant in the context where
  //      it actually applies.
  //   2. User's current selection from the editor (so e.g. the icon-
  //      button matrix reflects the user's picked glyph).
  //   3. Variant defaults as a final fallback.
  const baseVariants: Record<string, string> = {};
  for (const v of def.layoutVariants) {
    baseVariants[v.key] =
      gateLocks[v.key]
      ?? (currentVariants[v.key] as string | undefined)
      ?? v.defaultValue;
  }

  const xs = axisX.options;
  const ys = axisY ? axisY.options : null;

  const renderCell = (cellVariants: Record<string, string>, caption: string) => (
    <div
      key={caption}
      className="rounded border border-border bg-card overflow-hidden"
    >
      <div
        className="flex items-center justify-center p-3"
        style={{
          // Read-only thumbnail. Clip wide atoms so they don't blow up
          // the cell width; centred so small atoms stay readable.
          //
          // Sizing: minHeight gives small atoms (icon buttons, chips) a
          // consistent visual weight; maxHeight caps tall atoms (Card,
          // LifecycleNodeCard) so a single oversized atom can't make
          // every row in a 2D grid 200px tall. Scale 0.6 is the sweet
          // spot for the atoms we ship today — wide ones (SideFlexpane,
          // AppSidebar) still clip, but everything fits the cell width
          // budget at typical panel sizes.
          pointerEvents: 'none',
          minHeight: 80,
          maxHeight: 140,
          overflow: 'hidden',
        }}
      >
        <div
          className="uxm-matrix-cell-preview"
          style={{ transform: 'scale(0.6)', transformOrigin: 'center' }}
        >
          <Preview
            styles={styles as PreviewProps['styles']}
            variants={cellVariants}
            componentId={def.id}
            shell={shell}
          />
        </div>
      </div>
      <div className="border-t border-border/60 px-2 py-1 text-[10px] font-medium text-text-muted truncate text-center">
        {caption}
      </div>
    </div>
  );

  return (
    <div>
      <SectionHeader>Variant Matrix</SectionHeader>
      {/* Horizontal-scroll wrapper. Cells have a 120px minimum so they
          stay readable; if the panel is too narrow to show every column
          at that width, the matrix scrolls instead of crushing cells
          into illegibility. -mx-5 + px-5 lets the scroll surface bleed
          to the panel edges so a thumb shadow at the right edge hints
          at "more content". */}
      <div className="-mx-5 overflow-x-auto px-5">
        {ys ? (
          // 2D grid: ys as rows, xs as columns. Each row has a leading
          // row-label cell so the user can read both axes without
          // hovering captions. `minmax(120px, 1fr)` gives cells a
          // legible floor — narrower than that and atoms (esp. Card,
          // StatCard, button-with-icon) lose meaningful detail even at
          // 0.6 scale.
          <div
            className="grid gap-1.5"
            style={{
              gridTemplateColumns: `auto repeat(${xs.length}, minmax(120px, 1fr))`,
              minWidth: 'min-content',
            }}
          >
            {/* corner cell + column headers */}
            <div />
            {xs.map((x) => (
              <div
                key={`xh-${x.value}`}
                className="text-[10px] font-semibold uppercase tracking-wider text-text-subtle text-center truncate"
              >
                {x.label}
              </div>
            ))}
            {ys.map((y) => (
              <Fragment key={`row-${y.value}`}>
                <div className="self-center pr-1 text-[10px] font-semibold uppercase tracking-wider text-text-subtle text-right truncate">
                  {y.label}
                </div>
                {xs.map((x) => {
                  const cellV: Record<string, string> = {
                    ...baseVariants,
                    [axisX.key]: x.value,
                    [axisY.key]: y.value,
                  };
                  return renderCell(cellV, `${x.label} / ${y.label}`);
                })}
              </Fragment>
            ))}
          </div>
        ) : (
          // 1D row of thumbnails. `auto-fit` lets it reflow to multiple
          // rows on narrow panes — when the parent is wide enough we
          // get one row; when it isn't, cells wrap rather than scroll.
          <div
            className="grid gap-1.5"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            }}
          >
            {xs.map((x) => {
              const cellV: Record<string, string> = {
                ...baseVariants,
                [axisX.key]: x.value,
              };
              return renderCell(cellV, x.label);
            })}
          </div>
        )}
      </div>
    </div>
  );
}
