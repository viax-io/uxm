import { useId, useRef, useState, type CSSProperties } from 'react';

import { hexToHsl, retintHue } from '@/lib/contrast';
import type { PreviewProps, PreviewShellContext } from '@/previews/types';
import { themeTokens, type ThemeToken } from '@/tokens';
import {
  Badge, ButtonGroup, ButtonPrimary, ButtonSecondary, ButtonTertiary, Card, Cluster,
  ColorInputPopover, Dialog, Disclosure, FormField, Icon, IconButton, InlineAction, Modal,
  ResponsiveGrid, SectionHeader, Select, Stack, Tabs, TextInput,
} from '@/ui';

export const FONT_OPTIONS: { label: string; value: string; stack: string }[] = [
  { label: 'Inter (default)', value: 'Inter', stack: "'Inter', var(--font-inter), system-ui, sans-serif" },
  { label: 'Geist', value: 'Geist', stack: "'Geist', system-ui, sans-serif" },
  { label: 'Manrope', value: 'Manrope', stack: "'Manrope', system-ui, sans-serif" },
  { label: 'Space Grotesk', value: 'Space Grotesk', stack: "'Space Grotesk', system-ui, sans-serif" },
  { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans', stack: "'Plus Jakarta Sans', system-ui, sans-serif" },
  { label: 'DM Sans', value: 'DM Sans', stack: "'DM Sans', system-ui, sans-serif" },
  { label: 'Figtree', value: 'Figtree', stack: "'Figtree', system-ui, sans-serif" },
  { label: 'Roboto', value: 'Roboto', stack: "'Roboto', system-ui, sans-serif" },
  { label: 'IBM Plex Sans', value: 'IBM Plex Sans', stack: "'IBM Plex Sans', system-ui, sans-serif" },
  { label: 'JetBrains Mono', value: 'JetBrains Mono', stack: "'JetBrains Mono', ui-monospace, monospace" },
];

/** Shared by the base-size knob and each role's size knob.
 * Sub-100% values do NOT shrink AA-floor-reasoned small text: surfaces with a
 * documented minimum (Menu's 11px subtitle / 12px hint) floor themselves via
 * `max()` in their own SCSS, so "compact" compacts everything else. */
const SCALE_OPTIONS = [
  { value: '', label: 'Default (100%)' },
  { value: '0.875', label: '87.5% — compact' },
  { value: '1.125', label: '112.5% — large' },
  { value: '1.25', label: '125% — larger' },
  { value: '1.5', label: '150% — largest' },
];

/** Closed sets small enough to show as segments — every option visible, one
 *  click instead of open-then-pick. Labels stay short so the track fits. */
const WEIGHT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: '500', label: '500' },
  { value: '600', label: '600' },
  { value: '700', label: '700' },
];
const LINE_HEIGHT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: '1.4', label: 'Tight' },
  { value: '1.5', label: 'Normal' },
  { value: '1.7', label: 'Relaxed' },
  { value: '2', label: 'Loose' },
];

type TypeTab = 'body' | 'headings';

/** Dot marking a tab whose group holds a non-default value — a setting made on
 *  the hidden tab would otherwise leave no trace on this screen. Rides in
 *  `TabsOption.icon`, which Tabs renders as its own sibling span: a wrapper
 *  here would put a block box inside the label span, and `<button>`/`<span>`
 *  both take phrasing content only. */
const dirtyDot = (dirty: boolean) =>
  (dirty ? <Badge mode="dot" type="accent" aria-hidden /> : undefined);

/**
 * The three heading roles, in visual order. `basePx` / `baseWeight` are the
 * representative surface's own values, used only to render the specimen at a
 * believable size — the atoms keep their individual literals.
 */
const ROLES = [
  { key: 'display', label: 'Display', short: 'Display', sample: '$48.2K', basePx: 28, baseWeight: 700,
    familyKey: 'displayFontFamily', weightKey: 'displayFontWeight', scaleKey: 'displayScale' },
  { key: 'pageTitle', label: 'Page titles', short: 'Page title', sample: 'Quarterly performance review', basePx: 22, baseWeight: 600,
    familyKey: 'pageTitleFontFamily', weightKey: 'pageTitleFontWeight', scaleKey: 'pageTitleScale' },
  { key: 'sectionTitle', label: 'Section titles', short: 'Section title', sample: 'Revenue motions', basePx: 16, baseWeight: 600,
    familyKey: 'sectionTitleFontFamily', weightKey: 'sectionTitleFontWeight', scaleKey: 'sectionTitleScale' },
] as const;

type UploadKind = 'logo' | 'icon' | 'favicon';
type IdentityTab = 'light' | 'dark';

const ACCEPT_MAP: Record<UploadKind, string> = {
  logo: 'image/svg+xml,image/png,image/webp,image/jpeg',
  icon: 'image/svg+xml,image/png,image/webp',
  favicon: 'image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml',
};

const BRAND_FIELD = (k: UploadKind, tab: IdentityTab) =>
  `${k}Url${tab === 'dark' ? 'Dark' : ''}` as const;
const REMOTE_KIND = (k: UploadKind, tab: IdentityTab) =>
  `${k}${tab === 'dark' ? 'Dark' : ''}`;

/**
 * The three brand assets, in render order. `box` sets only the frame's WIDTH —
 * the height stretches to the row, so a frame always matches the field beside
 * it even when the Base text size knob grows it. Width stays explicit because
 * `aspect-ratio` cannot derive it from a stretched height (flex resolves main
 * size from content first), so the square marks are square at the default
 * scale and grow a little taller than wide beyond it.
 * These keep the local `Preview` frame rather than the square `Thumbnail`
 * atom (see `Preview` below for why).
 */
const ASSETS = [
  { kind: 'logo' as const, title: 'Logo', defaultSrc: '/viax-logo.svg',
    box: { width: 110 }, imgStyle: { maxWidth: '90%', maxHeight: '70%' },
    hint: 'Shown in the expanded sidebar. Upload a file or paste a URL.' },
  { kind: 'icon' as const, title: 'Sidebar Icon', defaultSrc: '/viax-icon.svg',
    box: { width: 44 }, imgStyle: { maxWidth: '70%', maxHeight: '70%' },
    hint: 'Shown in the collapsed sidebar.' },
  { kind: 'favicon' as const, title: 'Favicon', defaultSrc: undefined,
    box: { width: 44 }, imgStyle: { maxWidth: '60%', maxHeight: '60%' },
    hint: 'Browser tab icon. Accepts .ico, .png, .svg.' },
];

type Asset = (typeof ASSETS)[number];

/**
 * One asset row: preview frame, URL field, upload button. Three near-identical
 * blocks before this — the only differences are in ASSETS above.
 *
 * FormField's direct child is the `Cluster`, not the field, so its usual
 * `cloneElement` wiring can't reach the control — the id and the hint are
 * associated by hand below. The Cluster carries its OWN id so FormField skips
 * the injection (`childId ? {} : { id: controlId }`) and the field keeps sole
 * ownership of `fieldId`; two elements sharing it made `<label for>` resolve to
 * the Cluster and stopped the label focusing the field.
 */
function AssetRow({
  asset, tab, value, fallbackSrc, hint, uploading, onUrlChange, onPick,
}: {
  asset: Asset;
  tab: IdentityTab;
  value: string;
  fallbackSrc?: string;
  hint: string;
  uploading: boolean;
  onUrlChange: (v: string) => void;
  onPick: (file: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  // Explicit id so the label and hint can be wired by hand: the control sits
  // inside a Cluster (preview + field + button share one row), and FormField's
  // cloneElement only reaches its DIRECT child. `fieldId` belongs to the input
  // alone — the Cluster takes `-row` so FormField does not inject a duplicate.
  const fieldId = useId();
  const src = value || fallbackSrc;
  return (
    <FormField label={asset.title} hint={hint} htmlFor={fieldId}>
      <Cluster id={`${fieldId}-row`} gap={12} align="center">
        <Preview box={asset.box} dim={tab === 'dark'}>
          {src && (
            <PreviewImg key={src} src={src} alt={`${asset.title} preview`} style={asset.imgStyle} />
          )}
        </Preview>
        {/* Stack, not `style` on TextInput: a clearable TextInput wraps itself
            in a `display:block` div, and TextInput forwards `style` to the
            inner <input> — so the flex has to go on something that IS the flex
            item. Stack stretches its child, which the input fills at 100%. */}
        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
          <TextInput
            id={fieldId}
            aria-describedby={`${fieldId}-hint`}
            value={value}
            placeholder={fallbackSrc}
            onChange={(e) => onUrlChange(e.target.value)}
          />
        </Stack>
        {/* Not a UI control — the visible affordance is the button beside it. */}
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT_MAP[asset.kind]}
          hidden
          onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])}
        />
        <ButtonSecondary onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading…' : 'Upload'}
        </ButtonSecondary>
      </Cluster>
    </FormField>
  );
}

export function BrandSettingsPreview({ shell }: PreviewProps) {
  const [uploading, setUploading] = useState<UploadKind | null>(null);
  const [levelsOpen, setLevelsOpen] = useState(false);
  const [typeTab, setTypeTab] = useState<TypeTab>('body');
  const [error, setError] = useState<string | null>(null);
  const [identityTab, setIdentityTab] = useState<IdentityTab>('light');

  // The brand-settings preview is shell-only: it reads and writes the host
  // app's brand state. Without `shell`, there's no state to bind to —
  // render an inert hint instead of crashing.
  if (!shell) {
    return (
      <div style={{ padding: 16, fontSize: 13, color: 'var(--color-text-muted)' }}>
        Brand Settings preview requires a host shell context (brand + setBrand).
      </div>
    );
  }

  const { brand, setBrand } = shell;

  const upload = async (file: File, kind: UploadKind, tab: IdentityTab) => {
    if (!shell.uploadAsset) {
      setError('Upload is unavailable in this host.');
      return;
    }
    setUploading(kind);
    setError(null);
    try {
      const data = await shell.uploadAsset(file, REMOTE_KIND(kind, tab));
      if (!data?.url) throw new Error('Upload failed');
      setBrand({ [BRAND_FIELD(kind, tab)]: data.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const inheritsHint = (kind: UploadKind, value: string, base: string) => {
    if (identityTab === 'dark' && !value) {
      return `${base} Inherits the Light ${kind} when empty.`;
    }
    return base;
  };
  const fontFamily = brand.fontFamily ?? '';
  const headingFontFamily = brand.headingFontFamily ?? '';
  const headingFontWeight = brand.headingFontWeight ?? '';
  // Specimen helpers mirroring the real cascade: an unset role falls through to
  // the heading umbrella, which falls through to the body face; sizes multiply
  // the role factor and the base scale exactly as the atoms' calc() does.
  const specimenStack = (roleFamily: string | undefined) =>
    FONT_OPTIONS.find((f) => f.value === (roleFamily || headingFontFamily || fontFamily))?.stack
      ?? 'inherit';
  const specimenSize = (basePx: number, roleScale?: string, baseScale?: string) =>
    Math.round(basePx * Number(roleScale || 1) * Number(baseScale || 1) * 10) / 10;

  // Which tab carries a non-default value, for the dot on the tab label.
  const bodyDirty = Boolean(brand.fontFamily || brand.typeScale || brand.bodyLineHeight);
  const headingsDirty = Boolean(
    brand.headingFontFamily || brand.headingFontWeight
    || ROLES.some((r) => brand[r.familyKey] || brand[r.weightKey] || brand[r.scaleKey]),
  );

  return (
    <Stack gap={16} style={{ width: '100%', maxWidth: 640 }}>
      <Group
        title="Identity"
        description="Logos and marks shown throughout Modo. Dark values fall back to the light ones when empty."
      >
        <Cluster justify="between" align="center" gap={8}>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Editing <strong style={{ color: 'var(--color-text)' }}>{identityTab}</strong> assets
          </span>
          <LightDarkTabs value={identityTab} onChange={setIdentityTab} />
        </Cluster>

        {ASSETS.map((a) => (
          <AssetRow
            key={a.kind}
            asset={a}
            tab={identityTab}
            value={(brand[BRAND_FIELD(a.kind, identityTab)] as string | undefined) ?? ''}
            fallbackSrc={
              identityTab === 'dark'
                ? ((brand[`${a.kind}Url`] as string | undefined) || a.defaultSrc)
                : a.defaultSrc
            }
            hint={inheritsHint(a.kind, (brand[BRAND_FIELD(a.kind, identityTab)] as string | undefined) ?? '', a.hint)}
            uploading={uploading === a.kind}
            onUrlChange={(v) => setBrand({ [BRAND_FIELD(a.kind, identityTab)]: v || undefined })}
            onPick={(file) => upload(file, a.kind, identityTab)}
          />
        ))}

        {error && (
          <p style={{ fontSize: 12, color: 'var(--color-danger-text)', margin: 0 }}>{error}</p>
        )}
      </Group>

      <Group
        title="Typography"
        description="Typefaces applied across Modo. Headings are optional — they inherit the body face unless you set one. Changes apply live and persist on Publish."
      >
        <Stack gap={12}>
          {/* Body and Headings are independent decisions, so they get their own
              tabs rather than one long column. The dot marks a tab whose group
              differs from default — otherwise a setting made on the hidden tab
              is invisible from here. */}
          <Tabs
            value={typeTab}
            onChange={(v) => setTypeTab(v as TypeTab)}
            options={[
              { value: 'body', label: 'Body', icon: dirtyDot(bodyDirty) },
              { value: 'headings', label: 'Headings', icon: dirtyDot(headingsDirty) },
            ]}
          />

          {typeTab === 'body' ? (
            <Stack gap={10}>
              <FormField label="Typeface" labelPosition="side">
                <Select
                  value={fontFamily}
                  onChange={(e) => setBrand({ fontFamily: e.target.value || undefined })}
                  aria-label="Body typeface"
                  style={{ width: '100%' }}
                >
                  <option value="">Inter (default)</option>
                  {FONT_OPTIONS.slice(1).map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Text size"
                labelPosition="side"
                hint="Scales every text size in the library, headings included."
              >
                <Select
                  value={brand.typeScale ?? ''}
                  onChange={(e) => setBrand({ typeScale: e.target.value || undefined })}
                  aria-label="Base text size"
                  style={{ width: '100%' }}
                >
                  {SCALE_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </Select>
              </FormField>

              {/* A closed set of five reads better as segments than as a popup:
                  every option is visible and costs one click, not two. */}
              <FormField
                label="Line height"
                labelPosition="side"
                hint="Applies to multi-line body copy, not compact chrome."
              >
                {/* `alignSelf` rather than a wrapper: FormField's control column
                    is a flex COLUMN whose default stretch would blow this
                    inline-flex track out to full width — but a wrapper would
                    also take FormField's injected `aria-describedby` instead of
                    the control, leaving the hint unannounced. */}
                <ButtonGroup
                  style={{ alignSelf: 'start' }}
                  value={brand.bodyLineHeight ?? ''}
                  onChange={(v) => setBrand({ bodyLineHeight: v || undefined })}
                  aria-label="Body line height"
                  options={LINE_HEIGHT_OPTIONS}
                />
              </FormField>
            </Stack>
          ) : (
            <Stack gap={10}>
              <FormField label="Typeface" labelPosition="side">
                <Select
                  value={headingFontFamily}
                  onChange={(e) => setBrand({ headingFontFamily: e.target.value || undefined })}
                  aria-label="Heading typeface"
                  style={{ width: '100%' }}
                >
                  <option value="">Same as body</option>
                  {/* All ten, including Inter — heading-Inter over a different
                      body face is a real choice, so it isn't labelled
                      "(default)" the way the body Select's first option is. */}
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.value === 'Inter' ? 'Inter' : f.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Weight"
                labelPosition="side"
                hint="Default keeps each component's own weight."
              >
                <ButtonGroup
                  style={{ alignSelf: 'start' }}
                  value={headingFontWeight}
                  onChange={(v) => setBrand({ headingFontWeight: v || undefined })}
                  aria-label="Heading weight"
                  options={WEIGHT_OPTIONS}
                />
              </FormField>

              <Disclosure
                id="uxm-typography-levels"
                open={levelsOpen}
                onOpenChange={setLevelsOpen}
                label="Fine-tune levels"
              />
              {levelsOpen && (
                <Stack id="uxm-typography-levels-panel" gap={10}>
                  <p style={{ margin: 0, fontSize: 'calc(12px * var(--type-scale, 1))', color: 'var(--color-text-muted)', lineHeight: 'var(--type-body-line-height, 1.5)' }}>
                    Each level inherits the settings above until you change it here.
                    Display covers metric values and error codes.
                  </p>
                  {/* Selects (not segments) in here: three controls share one
                      row, so the compact form is the one that fits. */}
                  {ROLES.map((r) => (
                    <FormField key={r.key} label={r.label} labelPosition="side">
                      {/* Grid, not Cluster: `Select` forwards `style` to its inner
                          combobox, not to the `.uxm-listbox` wrapper a flex row
                          would lay out — so flex sizing never reaches the flex
                          child and the controls stack. Grid sizes the wrappers. */}
                      <ResponsiveGrid min="112px" gap={6}>
                        <Select
                          value={(brand[r.familyKey] as string | undefined) ?? ''}
                          onChange={(e) => setBrand({ [r.familyKey]: e.target.value || undefined })}
                          aria-label={`${r.short} typeface`}
                          style={{ width: '100%' }}
                        >
                          <option value="">Inherit typeface</option>
                          {FONT_OPTIONS.map((f) => (
                            <option key={f.value} value={f.value}>
                              {f.value === 'Inter' ? 'Inter' : f.label}
                            </option>
                          ))}
                        </Select>
                        <Select
                          value={(brand[r.weightKey] as string | undefined) ?? ''}
                          onChange={(e) => setBrand({ [r.weightKey]: e.target.value || undefined })}
                          aria-label={`${r.short} weight`}
                          style={{ width: '100%' }}
                        >
                          <option value="">Weight</option>
                          <option value="500">500</option>
                          <option value="600">600</option>
                          <option value="700">700</option>
                        </Select>
                        <Select
                          value={(brand[r.scaleKey] as string | undefined) ?? ''}
                          onChange={(e) => setBrand({ [r.scaleKey]: e.target.value || undefined })}
                          aria-label={`${r.short} size`}
                          style={{ width: '100%' }}
                        >
                          {SCALE_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.value === '' ? 'Size' : s.label.replace(/ —.*$/, '')}
                            </option>
                          ))}
                        </Select>
                      </ResponsiveGrid>
                    </FormField>
                  ))}
                </Stack>
              )}
            </Stack>
          )}

          {/* Specimen mirrors the real cascade: each line resolves its own role
              first, then the heading umbrella, then the body face. */}
          {/* Surface, not the default card white: the specimen is a sample of
              the app's own body text, so it should sit on the app's surface. */}
          <Card padding={16} style={{ '--uxm-card-bg': 'var(--color-surface)' } as CSSProperties}>
            <Stack gap={0}>
              {ROLES.map((r) => (
                <p
                  key={r.key}
                  style={{
                    margin: r.key === 'display' ? 0 : '10px 0 0',
                    fontFamily: specimenStack(brand[r.familyKey] as string | undefined),
                    fontSize: specimenSize(r.basePx, brand[r.scaleKey] as string | undefined, brand.typeScale),
                    fontWeight: Number(
                      (brand[r.weightKey] as string | undefined) || headingFontWeight || r.baseWeight,
                    ),
                  }}
                >
                  {r.sample}
                </p>
              ))}
              <p
                style={{
                  margin: '12px 0 0',
                  fontFamily: FONT_OPTIONS.find((f) => f.value === fontFamily)?.stack ?? 'inherit',
                  fontSize: specimenSize(14, undefined, brand.typeScale),
                  lineHeight: brand.bodyLineHeight ? Number(brand.bodyLineHeight) : 1.5,
                }}
              >
                Body copy sets the baseline everything else is measured against. The quick brown
                fox jumps over the lazy dog.
              </p>
            </Stack>
          </Card>
        </Stack>
      </Group>

      <Group
        title="Color"
        description="Palette overrides that cascade across Modo. Changes apply live and persist on Publish."
      >
        <ThemeTokensEditor shell={shell} />
      </Group>
    </Stack>
  );
}

function Group({
  title, description, children,
}: {
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <Card
      padding={20}
      style={{
        // The panel's own card is a touch rounder than the atom's 4px default.
        '--uxm-card-radius': '10px',
        // SectionHeader's subtitle defaults to 10px muted — right for the terse
        // metadata it was built for ("Active value: 600"), too small for the
        // full sentences these groups carry. Tuned through the atom's own vars
        // rather than by hand-rolling the header again.
        '--uxm-section-header-subtitle-size': '13px',
        '--uxm-section-header-subtitle-color': 'var(--color-text)',
        // These are the panel's top-level section headings, not incidental
        // labels in a dense properties list — the atom's `--color-text-subtle`
        // default reads as too faint at that job.
        '--uxm-section-header-title-color': 'var(--color-text-muted)',
      } as CSSProperties}
    >
      <Stack gap={20}>
        {/* level=3: these sit under the shell's "Brand Settings" <h2>, and the
            atom's default <h4> would skip a level — leaving a screen-reader
            user unable to tell how the sections nest. */}
        <SectionHeader level={3} subtitle={description}>{title}</SectionHeader>
        {children}
      </Stack>
    </Card>
  );
}

const GROUP_LABELS: Record<ThemeToken['group'], string> = {
  surfaces: 'Surfaces',
  text: 'Text',
  borders: 'Borders',
  accent: 'Accent',
  highlights: 'Highlights',
  categories: 'Categories',
  semantic: 'Semantic',
};

const GROUP_ORDER: ThemeToken['group'][] = [
  'surfaces', 'text', 'borders', 'accent', 'highlights', 'categories', 'semantic',
];

function groupTokens(): { group: ThemeToken['group']; label: string; tokens: ThemeToken[] }[] {
  const by: Record<string, ThemeToken[]> = {};
  for (const t of themeTokens) (by[t.group] ??= []).push(t);
  return GROUP_ORDER
    .filter((g) => by[g])
    .map((g) => ({ group: g, label: GROUP_LABELS[g], tokens: by[g] }));
}

function ThemeTokensEditor({ shell }: { shell: PreviewShellContext }) {
  const { theme, setTheme, brand, setBrand } = shell;
  const grouped = groupTokens();
  const overrides = brand.tokens?.[theme] ?? {};
  // When non-null, the recalc modal is open; holds the just-changed accent token
  // (its cssVar + new hex) to use as the base for re-tinting the rest of the group.
  const [pendingAccent, setPendingAccent] = useState<{ cssVar: string; hex: string } | null>(null);

  const setOverride = (cssVar: string, hex: string | undefined) => {
    const next = { ...(brand.tokens?.[theme] ?? {}) };
    if (hex === undefined) delete next[cssVar];
    else next[cssVar] = hex;
    setBrand({
      tokens: {
        ...brand.tokens,
        [theme]: Object.keys(next).length ? next : undefined,
      },
    });
  };

  // Re-tint the accent ramp to the base's hue across BOTH themes, so the brand
  // hue stays consistent in light and dark. Each derived shade is rebuilt from
  // its DEFAULT colour (its designed saturation + lightness step) re-tinted to
  // the base hue — NOT from its current value. This keeps the result a clean
  // light→dark ramp every time, regardless of any prior overrides, so changing
  // one accent always recomputes the others into a proper palette. The shade the
  // user just edited (in the active theme) is left untouched; everything else in
  // the group, in both themes, is recomputed in one batched update.
  const recalcAccents = (baseVar: string, baseHex: string) => {
    const hsl = hexToHsl(baseHex);
    setPendingAccent(null);
    if (!hsl) return;
    const nextTokens = { ...brand.tokens };
    for (const t of ['light', 'dark'] as const) {
      const map = { ...(brand.tokens?.[t] ?? {}) };
      for (const tk of themeTokens) {
        if (tk.group !== 'accent') continue;
        if (t === theme && tk.cssVar === baseVar) continue; // keep the edit the user just made
        const base = t === 'dark' ? tk.darkHex : tk.hex; // re-tint from the designed default ramp
        map[tk.cssVar] = retintHue(base, hsl.h).toUpperCase();
      }
      nextTokens[t] = Object.keys(map).length ? map : undefined;
    }
    setBrand({ tokens: nextTokens });
  };

  const resetAll = () => {
    setBrand({
      tokens: {
        ...brand.tokens,
        [theme]: undefined,
      },
    });
  };

  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <section>
      {/* The reset sits beside the sentence naming its scope, not beside the
          theme switcher. It clears only the theme being edited (`[theme]:
          undefined`), so pairing it with the Light/Dark control implied it
          acted on the switch — and put a destructive action inside what reads
          as one segmented group. The label says which theme for the same
          reason: "Reset all" suggested it cleared both. */}
      <Cluster justify="between" align="center" gap={8} style={{ marginBottom: 14 }}>
        <Cluster gap={10} align="center">
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Editing <strong style={{ color: 'var(--color-text)' }}>{theme}</strong> values
          </span>
          <InlineAction
            onClick={resetAll}
            disabled={!hasOverrides}
            icon={<Icon glyph="refresh" size={11} />}
          >
            Reset {theme} values
          </InlineAction>
        </Cluster>
        <LightDarkTabs value={theme} onChange={setTheme} />
      </Cluster>

      <Stack gap={14}>
        {grouped.map((g) => (
          <div key={g.group}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 6 }}>
              {g.label}
            </div>
            <Stack gap={4}>
              {g.tokens.map((t) => (
                <TokenRow
                  key={t.cssVar}
                  token={t}
                  theme={theme}
                  override={overrides[t.cssVar]}
                  onChange={(hex) => setOverride(t.cssVar, hex)}
                  onCommitColor={
                    // Accent tokens prompt (via modal) to re-tint the ramp to the
                    // new hue — but only once the pick is COMMITTED (popover close
                    // or hex entry), never mid-drag while onChange streams.
                    t.group === 'accent'
                      ? (hex) => setPendingAccent({ cssVar: t.cssVar, hex })
                      : undefined
                  }
                />
              ))}
            </Stack>
          </div>
        ))}
      </Stack>

      <Dialog
        open={pendingAccent !== null}
        onOpenChange={(open) => { if (!open) setPendingAccent(null); }}
      >
        <Modal size="sm" onClose={() => setPendingAccent(null)}>
          <Modal.Header>Recalculate accent palette?</Modal.Header>
          <Modal.Body>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text)', lineHeight: 1.5 }}>
              You changed{' '}
              <strong>
                {themeTokens.find((t) => t.cssVar === pendingAccent?.cssVar)?.name ?? 'an accent color'}
              </strong>
. Re-tint the rest of the accent ramp — in both light and dark — to its hue?
              Each shade keeps its own lightness and saturation; only the hue follows
              the color you just set.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <ButtonTertiary onClick={() => setPendingAccent(null)}>Keep as is</ButtonTertiary>
            <ButtonPrimary onClick={() => { if (pendingAccent) recalcAccents(pendingAccent.cssVar, pendingAccent.hex); }}>
              Recalculate
            </ButtonPrimary>
          </Modal.Footer>
        </Modal>
      </Dialog>
    </section>
  );
}

function TokenRow({
  token, theme, override, onChange, onCommitColor,
}: {
  token: ThemeToken;
  theme: 'light' | 'dark';
  override: string | undefined;
  /** Live update — streams during a drag in the picker. */
  onChange: (hex: string | undefined) => void;
  /** Fires once the pick is committed (popover close or hex entry), not mid-drag. */
  onCommitColor?: (hex: string) => void;
}) {
  const defaultHex = theme === 'dark' ? token.darkHex : token.hex;
  const effective = (override ?? defaultHex).toUpperCase();
  const isOverridden = override !== undefined;
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? effective;
  // Whether the color changed during the current popover session — so opening
  // and closing an accent swatch without editing doesn't trigger the recalc
  // prompt. `latestHex` holds the freshest picked value so a commit-then-close
  // in the same tick (Enter in the picker field) prompts with the right color.
  const changedWhileOpen = useRef(false);
  const latestHex = useRef(effective);

  const commit = (raw: string) => {
    const v = raw.trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(v) || /^#[0-9A-Fa-f]{3}$/.test(v)) {
      const hex = v.toUpperCase();
      onChange(hex);
      onCommitColor?.(hex);
    }
    setDraft(null);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '20px 1fr auto auto 18px',
        alignItems: 'center',
        gap: 8,
        padding: '4px 6px',
        borderRadius: 4,
        fontSize: 12,
      }}
    >
      <ColorInputPopover
        value={effective}
        onChange={(c) => {
          const hex = c.toUpperCase();
          changedWhileOpen.current = true;
          latestHex.current = hex;
          onChange(hex);
        }}
        onOpenChange={(open) => {
          if (open) changedWhileOpen.current = false;
          else if (changedWhileOpen.current) {
            changedWhileOpen.current = false;
            onCommitColor?.(latestHex.current);
          }
        }}
        outputFormat="hex"
        alpha={false}
        triggerLabel={`Pick colour for ${token.name}`}
        title="Pick a color"
        style={{
          '--uxm-color-input-trigger-size': '20px',
          '--uxm-color-input-border-radius': '4px',
        } as React.CSSProperties}
      />
      <span style={{ color: 'var(--color-text)', fontWeight: isOverridden ? 600 : 400, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {token.name}
        <span style={{ marginLeft: 6, color: 'var(--color-text-muted)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 11 }}>
          {token.cssVar}
        </span>
      </span>
      {/* Sits BEFORE the field, not after: it is `visibility: hidden` when the
          token is at its default, and hidden still reserves its column — after
          the field that put 72px of dead space between the value and the reset.
          It cannot simply collapse: every row is its own grid, so an overridden
          row would size the column differently and the reset icons would go
          ragged down the list. Reading default-then-current is natural anyway. */}
      <span
        style={{
          fontSize: 10,
          color: 'var(--color-text-muted)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          minWidth: 56,
          textAlign: 'right',
          visibility: isOverridden ? 'visible' : 'hidden',
        }}
        title={`Default: ${defaultHex}`}
      >
        {defaultHex.toUpperCase()}
      </span>
      {/* Sized down through the atom's own vars rather than restyled: this row
          repeats 31 times, so the default 14px/10px field would add ~400px to
          the list. `clearable={false}` because a ✕ inside an 84px hex field is
          noise — resetting is the ↺ at the end of the row. */}
      <TextInput
        value={shown}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
        spellCheck={false}
        clearable={false}
        aria-label={`${token.name} hex value`}
        style={{
          width: 84,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          textTransform: 'uppercase',
          '--uxm-input-text-font-size': '11px',
          '--uxm-input-text-padding-x': '6px',
          '--uxm-input-text-padding-y': '3px',
          '--uxm-input-text-border-radius': '4px',
          '--uxm-input-text-bg': 'var(--color-surface)',
        } as CSSProperties}
      />
      <IconButton
        onClick={() => onChange(undefined)}
        disabled={!isOverridden}
        title="Reset to default"
        aria-label={`Reset ${token.name}`}
        style={{
          '--uxm-icon-button-size': '18px',
          '--uxm-icon-button-radius': '4px',
          opacity: isOverridden ? 1 : 0.25,
        } as CSSProperties}
      >
        <Icon glyph="refresh" size={12} />
      </IconButton>
    </div>
  );
}

function Preview({ box, children, dim }: { box: CSSProperties; children?: React.ReactNode; dim?: boolean }) {
  return (
    <div style={{
      // Stretch, not a fixed height: the frame matches whatever the field
      // beside it measures, at any type scale.
      alignSelf: 'stretch',
      ...box,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: `1px solid var(--color-preview-border-${dim ? 'dark' : 'light'})`,
      borderRadius: 6,
      backgroundColor: `var(--color-preview-bg-${dim ? 'dark' : 'light'})`,
      flexShrink: 0,
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

/**
 * Image that hides itself when its source fails to load — but tracks the
 * failure in React state rather than imperatively setting `display:none`
 * (which never resets, so a transiently-404ing src stayed hidden forever even
 * after a valid one arrived). Callers pass `key={src}` so a new source
 * remounts it clean, letting a valid URL recover after a bad one.
 */
function PreviewImg({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) {
  const [errored, setErrored] = useState(false);
  if (errored) return null;
  return <img src={src} alt={alt} style={style} onError={() => setErrored(true)} />;
}

function LightDarkTabs({ value, onChange }: { value: 'light' | 'dark'; onChange: (v: 'light' | 'dark') => void }) {
  return (
    <Tabs
      value={value}
      onChange={(v) => onChange(v as 'light' | 'dark')}
      options={[
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
      ]}
    />
  );
}
