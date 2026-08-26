import { useRef, useState } from 'react';

import { hexToHsl, retintHue } from '@/lib/contrast';
import type { PreviewProps, PreviewShellContext } from '@/previews/types';
import { themeTokens, type ThemeToken } from '@/tokens';
import { ButtonPrimary, ButtonTertiary, ColorInputPopover, Dialog, Disclosure, Modal, Select, Tabs } from '@/ui';

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

function inputStyle(): React.CSSProperties {
  return {
    flex: 1, minWidth: 0,
    border: '1px solid var(--color-border)', borderRadius: 6,
    padding: '8px 10px', fontSize: 13,
    backgroundColor: 'var(--color-surface)', color: 'var(--color-text)',
    outline: 'none',
  };
}

function buttonStyle(): React.CSSProperties {
  return {
    flexShrink: 0,
    padding: '8px 12px', fontSize: 12, fontWeight: 500,
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-surface-alt)',
    border: '1px solid var(--color-border)', borderRadius: 6,
    cursor: 'pointer',
  };
}

export function BrandSettingsPreview({ shell }: PreviewProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<UploadKind | null>(null);
  const [levelsOpen, setLevelsOpen] = useState(false);
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

  const logoUrl = (brand[BRAND_FIELD('logo', identityTab)] as string | undefined) ?? '';
  const iconUrl = (brand[BRAND_FIELD('icon', identityTab)] as string | undefined) ?? '';
  const faviconUrl = (brand[BRAND_FIELD('favicon', identityTab)] as string | undefined) ?? '';
  const logoFallback = identityTab === 'dark' ? (brand.logoUrl || '/viax-logo.svg') : '/viax-logo.svg';
  const iconFallback = identityTab === 'dark' ? (brand.iconUrl || '/viax-icon.svg') : '/viax-icon.svg';
  const faviconFallback = identityTab === 'dark' ? brand.faviconUrl : undefined;
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

  return (
    <div style={{ width: '100%', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Group
        title="Identity"
        description="Logos and marks shown throughout Modo. Dark values fall back to the light ones when empty."
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            Editing <strong style={{ color: 'var(--color-text)' }}>{identityTab}</strong> assets
          </span>
          <LightDarkTabs value={identityTab} onChange={setIdentityTab} />
        </div>

        <Section
          title="Logo"
          hint={inheritsHint('logo', logoUrl, 'Shown in the expanded sidebar. Upload a file or paste a URL.')}
          previewBox={
            <Preview box={{ width: 110, height: 32 }} dim={identityTab === 'dark'}>
              <PreviewImg
                key={logoUrl || logoFallback}
                src={logoUrl || logoFallback}
                alt="Logo preview"
                style={{ maxWidth: '90%', maxHeight: '70%' }}
              />
            </Preview>
          }
        >
          <input
            type="text"
            value={logoUrl}
            placeholder={identityTab === 'dark' ? (brand.logoUrl || '/viax-logo.svg') : '/viax-logo.svg'}
            onChange={(e) => setBrand({ [BRAND_FIELD('logo', identityTab)]: e.target.value || undefined })}
            style={inputStyle()}
          />
          <input
            ref={logoInputRef}
            type="file"
            accept={ACCEPT_MAP.logo}
            hidden
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'logo', identityTab)}
          />
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            disabled={uploading === 'logo'}
            style={buttonStyle()}
          >
            {uploading === 'logo' ? 'Uploading…' : 'Upload'}
          </button>
        </Section>

        <Section
          title="Sidebar Icon"
          hint={inheritsHint('icon', iconUrl, 'Shown in the collapsed sidebar.')}
          previewBox={
            <Preview box={{ width: 32, height: 32 }} dim={identityTab === 'dark'}>
              <PreviewImg
                key={iconUrl || iconFallback}
                src={iconUrl || iconFallback}
                alt="Icon preview"
                style={{ maxWidth: '70%', maxHeight: '70%' }}
              />
            </Preview>
          }
        >
          <input
            type="text"
            value={iconUrl}
            placeholder={identityTab === 'dark' ? (brand.iconUrl || '/viax-icon.svg') : '/viax-icon.svg'}
            onChange={(e) => setBrand({ [BRAND_FIELD('icon', identityTab)]: e.target.value || undefined })}
            style={inputStyle()}
          />
          <input
            ref={iconInputRef}
            type="file"
            accept={ACCEPT_MAP.icon}
            hidden
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'icon', identityTab)}
          />
          <button
            type="button"
            onClick={() => iconInputRef.current?.click()}
            disabled={uploading === 'icon'}
            style={buttonStyle()}
          >
            {uploading === 'icon' ? 'Uploading…' : 'Upload'}
          </button>
        </Section>

        <Section
          title="Favicon"
          hint={inheritsHint('favicon', faviconUrl, 'Browser tab icon. Accepts .ico, .png, .svg.')}
          previewBox={
            <Preview box={{ width: 32, height: 32 }} dim={identityTab === 'dark'}>
              {(faviconUrl || faviconFallback) && (
                <PreviewImg
                  key={faviconUrl || faviconFallback!}
                  src={faviconUrl || faviconFallback!}
                  alt="Favicon preview"
                  style={{ maxWidth: '80%', maxHeight: '80%' }}
                />
              )}
            </Preview>
          }
        >
          <input
            type="text"
            value={faviconUrl}
            placeholder={identityTab === 'dark' ? (brand.faviconUrl ?? '/uxm-assets/favicon-…') : '/uxm-assets/favicon-…'}
            onChange={(e) => setBrand({ [BRAND_FIELD('favicon', identityTab)]: e.target.value || undefined })}
            style={inputStyle()}
          />
          <input
            ref={faviconInputRef}
            type="file"
            accept={ACCEPT_MAP.favicon}
            hidden
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], 'favicon', identityTab)}
          />
          <button
            type="button"
            onClick={() => faviconInputRef.current?.click()}
            disabled={uploading === 'favicon'}
            style={buttonStyle()}
          >
            {uploading === 'favicon' ? 'Uploading…' : 'Upload'}
          </button>
        </Section>

        {error && (
          <p style={{ fontSize: 12, color: 'var(--color-danger-text)', margin: 0 }}>{error}</p>
        )}
      </Group>

      <Group
        title="Typography"
        description="Typefaces applied across Modo. Headings are optional — they inherit the body face unless you set one. Changes apply live and persist on Publish."
      >
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Body typeface">
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
          </Field>

          <Field label="Heading typeface">
            <Select
              value={headingFontFamily}
              onChange={(e) => setBrand({ headingFontFamily: e.target.value || undefined })}
              aria-label="Heading typeface"
              style={{ width: '100%' }}
            >
              <option value="">Same as body</option>
              {/* All ten, including Inter — heading-Inter over a different body
                  face is a real choice, so it isn't labelled "(default)" here. */}
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.value === 'Inter' ? 'Inter' : f.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Heading weight" hint="Default keeps each component's own weight.">
            <Select
              value={headingFontWeight}
              onChange={(e) => setBrand({ headingFontWeight: e.target.value || undefined })}
              aria-label="Heading weight"
              style={{ width: '100%' }}
            >
              <option value="">Default</option>
              <option value="500">500 — medium</option>
              <option value="600">600 — semibold</option>
              <option value="700">700 — bold</option>
            </Select>
          </Field>

          <Field label="Base text size" hint="Scales every text size in the library — body, controls and headings alike.">
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
          </Field>

          <Field label="Body line height" hint="Applies to multi-line body copy, not compact chrome.">
            <Select
              value={brand.bodyLineHeight ?? ''}
              onChange={(e) => setBrand({ bodyLineHeight: e.target.value || undefined })}
              aria-label="Body line height"
              style={{ width: '100%' }}
            >
              <option value="">Default</option>
              <option value="1.4">Tight (1.4)</option>
              <option value="1.5">Normal (1.5)</option>
              <option value="1.7">Relaxed (1.7)</option>
              <option value="2">Loose (2.0)</option>
            </Select>
          </Field>

          <Disclosure
            id="uxm-typography-levels"
            open={levelsOpen}
            onOpenChange={setLevelsOpen}
            label="Fine-tune levels"
          />
          {levelsOpen && (
            <div
              id="uxm-typography-levels-panel"
              style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 4 }}
            >
              <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Each level inherits the heading settings above until you change it here.
                Display covers metric values and error codes.
              </p>
              {ROLES.map((r) => (
                <div key={r.key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>
                    {r.label}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Select
                      value={(brand[r.familyKey] as string | undefined) ?? ''}
                      onChange={(e) => setBrand({ [r.familyKey]: e.target.value || undefined })}
                      aria-label={`${r.short} typeface`}
                      style={{ flex: 2, minWidth: 0 }}
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
                      style={{ flex: 1, minWidth: 0 }}
                    >
                      <option value="">Inherit weight</option>
                      <option value="500">500</option>
                      <option value="600">600</option>
                      <option value="700">700</option>
                    </Select>
                    <Select
                      value={(brand[r.scaleKey] as string | undefined) ?? ''}
                      onChange={(e) => setBrand({ [r.scaleKey]: e.target.value || undefined })}
                      aria-label={`${r.short} size`}
                      style={{ flex: 1, minWidth: 0 }}
                    >
                      {SCALE_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.value === '' ? 'Size 100%' : s.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Specimen mirrors the real cascade: each line resolves its own role
              first, then the heading umbrella, then the body face. Sizes carry
              both the role factor and the base scale, exactly like the atoms. */}
          <div
            style={{
              marginTop: 4, padding: 16,
              border: '1px solid var(--color-border)', borderRadius: 6,
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
            }}
          >
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
          </div>
        </section>
      </Group>

      <Group
        title="Color"
        description="Palette overrides that cascade across Modo. Changes apply live and persist on Publish."
      >
        <ThemeTokensEditor shell={shell} />
      </Group>
    </div>
  );
}

function Group({
  title, description, children,
}: {
  title: string; description?: string; children: React.ReactNode;
}) {
  return (
    <section
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        padding: 20,
        backgroundColor: 'var(--color-card)',
      }}
    >
      <header style={{ marginBottom: 16 }}>
        <h2 style={{
          fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)',
          margin: 0, letterSpacing: 0.8, textTransform: 'uppercase',
        }}>
          {title}
        </h2>
        {description && (
          <p style={{ fontSize: 13, color: 'var(--color-text)', margin: '4px 0 0', lineHeight: 1.5 }}>
            {description}
          </p>
        )}
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {children}
      </div>
    </section>
  );
}

/** Labelled wrapper for a single control. Sentence case, not the uppercase
 *  eyebrow the Group header uses — these sit close together and read as prose. */
function Field({
  label, hint, children,
}: {
  label: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{
        display: 'block', marginBottom: 6,
        fontSize: 12, fontWeight: 500, color: 'var(--color-text)',
      }}>
        {label}
      </span>
      {children}
      {hint && (
        <span style={{
          display: 'block', marginTop: 4,
          fontSize: 12, color: 'var(--color-text-muted)',
        }}>
          {hint}
        </span>
      )}
    </label>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Editing <strong style={{ color: 'var(--color-text)' }}>{theme}</strong> values
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <LightDarkTabs value={theme} onChange={setTheme} />
          <button
            type="button"
            onClick={resetAll}
            disabled={!hasOverrides}
            style={{
              padding: '3px 8px',
              fontSize: 11,
              color: hasOverrides ? 'var(--color-text)' : 'var(--color-text-muted)',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              cursor: hasOverrides ? 'pointer' : 'not-allowed',
            }}
          >
            Reset all
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {grouped.map((g) => (
          <div key={g.group}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 6 }}>
              {g.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
            </div>
          </div>
        ))}
      </div>

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
      <input
        type="text"
        value={shown}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
        spellCheck={false}
        style={{
          width: 84,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 11,
          padding: '3px 6px',
          border: '1px solid var(--color-border)',
          borderRadius: 4,
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)',
          outline: 'none',
          textTransform: 'uppercase',
        }}
      />
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
      <button
        type="button"
        onClick={() => onChange(undefined)}
        disabled={!isOverridden}
        title="Reset to default"
        aria-label={`Reset ${token.name}`}
        style={{
          width: 18, height: 18,
          padding: 0,
          border: 'none',
          background: 'transparent',
          color: 'var(--color-text-muted)',
          cursor: isOverridden ? 'pointer' : 'default',
          opacity: isOverridden ? 1 : 0.25,
          fontSize: 14,
          lineHeight: 1,
        }}
      >
        ↺
      </button>
    </div>
  );
}

function Section({
  title, hint, previewBox, children,
}: {
  title: string; hint: string;
  previewBox: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', margin: 0, marginBottom: 2 }}>{title}</h3>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, marginBottom: 10, lineHeight: 1.5 }}>{hint}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {previewBox}
        {children}
      </div>
    </section>
  );
}

function Preview({ box, children, dim }: { box: { width: number; height: number }; children?: React.ReactNode; dim?: boolean }) {
  return (
    <div style={{
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
