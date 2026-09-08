import { Card } from '@/ui';
import { Icon } from '@/ui';
import { InlineAction } from '@/ui';
import { SectionHeader } from '@/ui';

import { VariantMatrix } from './variant-matrix';

import type { LoggedEvent } from '../../lib/context';
import type { ComponentDef, StyleOverrides } from '../../lib/types';

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
export function DevTab({
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
