import { useMemo, useState, useCallback, useRef, useEffect } from 'react';


import {
  BannerPreview,
  BulkActionBarPreview,
  AppSidebarPreview,
  AppTopBarPreview,
  AvatarPreview,
  BackLinkPreview,
  BadgePreview,
  BrandSettingsPreview,
  BreadcrumbPreview,
  ButtonGroupPreview,
  ButtonPreview,
  ButtonWithIconPreview,
  CalendarPreview,
  CardPreview,
  CheckboxPreview,
  ChipPreview,
  ClusterPreview,
  ColorInputPreview,
  ConfigComponentRowPreview,
  ConfigSegmentItemPreview,
  ContentTooltipPreview,
  CurrencyInputPreview,
  DataTablePreview,
  DateInputPreview,
  DetailSectionPreview,
  DisclosurePreview,
  DividerPreview,
  EditableCellPreview,
  EmptyStatePreview,
  ErrorPagePreview,
  ExplorerListItemPreview,
  ExplorerSectionPreview,
  FileUploadPreview,
  FilterTabsPreview,
  FormFieldPreview,
  FormPreview,
  IconButtonPreview,
  IconPreview,
  IconTilePreview,
  InlineActionPreview,
  InlineFilterPreview,
  InputPreview,
  InputWithIconPreview,
  LifecycleActionRowPreview,
  LifecycleAddStepModalPreview,
  LifecycleConnectorKnobsPreview,
  LifecycleConnectorPreview,
  LifecycleEdgeInsertMenuPreview,
  LifecycleEdgeLabelPreview,
  LifecycleMinimapPreview,
  LifecycleNodeCardPreview,
  LifecyclePlusButtonPreview,
  LifecycleTerminalPreview,
  LifecycleZoomControlPreview,
  LinkPreview,
  ListItemPreview,
  ListboxPreview,
  LoaderPreview,
  LoginPagePreview,
  MenuPreview,
  MetaRowPreview,
  ModalPreview,
  MultirowFormPreview,
  NumberStepperPreview,
  NumberInputPreview,
  PageHeaderPreview,
  PageShellPreview,
  PasswordInputPreview,
  PhoneInputPreview,
  PillSelectPreview,
  ProgressBarPreview,
  PropertyFieldPreview,
  PropertyGridPreview,
  RadioGroupPreview,
  ResponsiveGridPreview,
  SearchDropdownPreview,
  SectionHeaderPreview,
  SegmentTreeRowPreview,
  SelectPreview,
  SideFlexpanePreview,
  SidebarNavItemPreview,
  SliderPreview,
  StackPreview,
  StatCardPreview,
  TabsPreview,
  TabsUnderlinePreview,
  TagPreview,
  TextareaPreview,
  ThumbnailPreview,
  TimeInputPreview,
  TimelineEntryPreview,
  ToastPreview,
  TogglePreview,
  TooltipPreview,
  TypeOverviewCardPreview,
  ViewSwitcherPreview,
} from '@/previews';
import { ButtonGhost, ButtonPrimary, IconButton } from '@/ui';
import { Icon } from '@/ui';

import { useUxm } from '../lib/context';
import { usePreviewShell } from '../lib/preview-shell';
import { getComponentDef } from '../lib/registry';

import { PreviewModal } from './preview-modal';

import type { PreviewProps } from '../lib/types';
import type { ReactNode } from 'react';


type PreviewComponent = React.ComponentType<PreviewProps>;

/**
 * Text-entry surfaces (typeable inputs + textarea + contenteditable) where
 * `onInput` / React's mapped `onChange` fires per keystroke. Capturing those
 * events into the UXM event log triggers a context re-render on every
 * character, which races the controlled-input flow and silently drops
 * typed values mid-keystroke (Chrome / Safari / Firefox alike — repro'd
 * by typing into TextInput, PasswordInput, PhoneInput, etc. in the
 * canvas while the side-panel inputs work fine because they aren't
 * wrapped in the capture handlers). The fix: skip these surfaces in
 * the high-frequency capture handlers and rely on `onBlur` to log the
 * committed value once the user leaves the field.
 */
function isHighFrequencyTextEntry(el: HTMLElement | null): boolean {
  if (!el) return false;
  if (el.tagName === 'TEXTAREA') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  if (el.tagName === 'INPUT') {
    const type = (el as HTMLInputElement).type;
    return (
      type === 'text' ||
      type === 'tel' ||
      type === 'email' ||
      type === 'password' ||
      type === 'url' ||
      type === 'search' ||
      type === 'number'
    );
  }
  return false;
}

export const previewMap: Record<string, PreviewComponent> = {
  'app-sidebar': AppSidebarPreview,
  'app-top-bar': AppTopBarPreview,
  'button-primary': ButtonPreview,
  'button-secondary': ButtonPreview,
  'button-tertiary': ButtonPreview,
  'button-ghost': ButtonPreview,
  'button-danger': ButtonPreview,
  'button-icon': ButtonPreview,
  'button-with-icon': ButtonWithIconPreview,
  'input-text': InputPreview,
  'input-with-icon': InputWithIconPreview,
  'color-input': ColorInputPreview,
  textarea: TextareaPreview,
  'file-upload': FileUploadPreview,
  'select-dropdown': SelectPreview,
  checkbox: CheckboxPreview,
  'toggle-switch': TogglePreview,
  'radio-group': RadioGroupPreview,
  chip: ChipPreview,
  tag: TagPreview,
  card: CardPreview,
  avatar: AvatarPreview,
  'empty-state': EmptyStatePreview,
  banner: BannerPreview,
  'bulk-action-bar': BulkActionBarPreview,
  toast: ToastPreview,
  tooltip: TooltipPreview,
  'form-login': FormPreview,
  'form-contact': FormPreview,
  'pill-select': PillSelectPreview,
  'inline-filter': InlineFilterPreview,
  'content-tooltip': ContentTooltipPreview,
  'form-multirow': MultirowFormPreview,
  'data-table': DataTablePreview,
  'button-group': ButtonGroupPreview,
  'stat-card': StatCardPreview,
  'type-overview-card': TypeOverviewCardPreview,
  'page-shell': PageShellPreview,
  'sidebar-nav-item': SidebarNavItemPreview,
  'explorer-list-item': ExplorerListItemPreview,
  'explorer-section': ExplorerSectionPreview,
  'inline-action': InlineActionPreview,
  'number-stepper': NumberStepperPreview,
  'number-input': NumberInputPreview,
  'currency-input': CurrencyInputPreview,
  'search-dropdown': SearchDropdownPreview,
  listbox: ListboxPreview,
  menu: MenuPreview,
  'editable-cell': EditableCellPreview,
  'section-header': SectionHeaderPreview,
  slider: SliderPreview,
  'error-page': ErrorPagePreview,
  'login-page': LoginPagePreview,
  loader: LoaderPreview,
  'progress-bar': ProgressBarPreview,
  'timeline-entry': TimelineEntryPreview,
  'segment-tree-row': SegmentTreeRowPreview,
  'config-segment-item': ConfigSegmentItemPreview,
  'config-component-row': ConfigComponentRowPreview,
  'icon-tile': IconTilePreview,
  'meta-row': MetaRowPreview,
  icon: IconPreview,
  'icon-button': IconButtonPreview,
  'detail-section': DetailSectionPreview,
  'back-link': BackLinkPreview,
  badge: BadgePreview,
  thumbnail: ThumbnailPreview,
  'date-input': DateInputPreview,
  'password-input': PasswordInputPreview,
  'phone-input': PhoneInputPreview,
  'time-input': TimeInputPreview,
  calendar: CalendarPreview,
  disclosure: DisclosurePreview,
  'link': LinkPreview,
  'breadcrumb': BreadcrumbPreview,
  'property-field': PropertyFieldPreview,
  'property-grid': PropertyGridPreview,
  'form-field': FormFieldPreview,
  'list-item': ListItemPreview,
  'side-flexpane': SideFlexpanePreview,
  'page-header': PageHeaderPreview,
  'divider': DividerPreview,
  'filter-tabs': FilterTabsPreview,
  'view-switcher': ViewSwitcherPreview,
  'tabs': TabsPreview,
  'tabs-underline': TabsUnderlinePreview,
  'brand-settings': BrandSettingsPreview,
  'lifecycle-node-card': LifecycleNodeCardPreview,
  'lifecycle-terminal': LifecycleTerminalPreview,
  'lifecycle-edge-label': LifecycleEdgeLabelPreview,
  'lifecycle-plus-button': LifecyclePlusButtonPreview,
  'lifecycle-zoom-control': LifecycleZoomControlPreview,
  'lifecycle-minimap': LifecycleMinimapPreview,
  'lifecycle-action-row': LifecycleActionRowPreview,
  'lifecycle-add-step-modal': LifecycleAddStepModalPreview,
  modal: ModalPreview,
  'lifecycle-edge-insert-menu': LifecycleEdgeInsertMenuPreview,
  'lifecycle-connector': LifecycleConnectorPreview,
  'lifecycle-connector-knobs': LifecycleConnectorKnobsPreview,
  'responsive-grid': ResponsiveGridPreview,
  stack: StackPreview,
  cluster: ClusterPreview,
};

export function Canvas({
  embed = false,
  headerActions,
}: {
  embed?: boolean;
  /** Optional host-provided actions rendered at the end of the top-bar
      cluster, right after the Preview & Publish button (e.g. a user avatar). */
  headerActions?: ReactNode;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const saveStatusTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { selectedId, getOverrides, getAllOverrides, resetOverrides, brand, getCurrentVariants, pushEvent, persistence, capabilities, theme, setTheme } = useUxm();
  const shell = usePreviewShell();
  const def = getComponentDef(selectedId);
  const overrides = getOverrides(selectedId);
  const currentVariants = getCurrentVariants();
  const allOverrides = getAllOverrides();

  const resolved = useMemo(() => {
    if (!def) return { styles: {}, variants: {} };
    const styles: Record<string, string | number | boolean> = {};
    for (const prop of def.styleProperties) {
      styles[prop.key] = overrides[prop.key] ?? prop.defaultValue;
    }
    // Variants read from ephemeral session state, NOT from overrides.
    // Variant selections decide which knobs are visible in the panel —
    // they don't persist and never get saved to components.css/json.
    const variants: Record<string, string> = {};
    for (const v of def.layoutVariants) {
      variants[v.key] = (currentVariants[v.key] as string | undefined) ?? v.defaultValue;
    }
    return { styles, variants };
  }, [def, overrides, currentVariants]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveStatus('idle');
    try {
      await persistence.save({ overrides: allOverrides, brand });
      setSaveStatus('success');
      if (saveStatusTimeout.current) clearTimeout(saveStatusTimeout.current);
      saveStatusTimeout.current = setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      if (saveStatusTimeout.current) clearTimeout(saveStatusTimeout.current);
      saveStatusTimeout.current = setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  }, [allOverrides, brand, persistence]);

  useEffect(() => {
    return () => {
      if (saveStatusTimeout.current) clearTimeout(saveStatusTimeout.current);
    };
  }, []);

  if (!def) return null;

  const Preview = previewMap[def.id];
  const hasOverrides = Object.keys(overrides).length > 0;
  const hasAnyOverrides = Object.keys(allOverrides).length > 0 || Object.keys(brand).length > 0;

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Toolbar — uses container queries so the layout adapts to the
          canvas's actual width, not the viewport. The canvas can be
          much narrower than the viewport when the sidebar + properties
          pane are open; viewport breakpoints would respond to the
          wrong dimension. Three steps:
            ≥640px  full (name + description + labelled buttons)
            480-640 hide description, keep labels
            <480px  icon-only secondary buttons; primary CTA stays
                    labelled (Preview & Publish is moment-of-truth). */}
      <div className="@container flex items-center justify-between gap-3 border-b border-border px-6 py-4">
        {/* min-w-0 enables `truncate` on the children — without it the
            flex item ignores the constraint and pushes the actions
            cluster off-screen. */}
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-semibold text-text truncate">{def.name}</h2>
          <p className="text-xs text-text-muted mt-0.5 hidden @[640px]:block truncate">
            {def.description}
          </p>
        </div>
        {/* flex-shrink-0 keeps the actions cluster from wrapping; the
            label spans inside the secondary buttons hide first when
            space gets tight. */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasOverrides && (
            <ButtonGhost onClick={() => resetOverrides(selectedId)} title="Reset overrides">
              <Icon glyph="refresh" size={14} />
              <span className="hidden @[480px]:inline">Reset</span>
            </ButtonGhost>
          )}
          {capabilities.persist && hasAnyOverrides && (
            <ButtonGhost onClick={handleSave} disabled={saving} title="Quick Save">
              {saveStatus === 'success' ? (
                <>
                  <Icon glyph="check" size={14} />
                  <span className="hidden @[480px]:inline">Saved</span>
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <Icon glyph="info" size={14} />
                  <span className="hidden @[480px]:inline">Error</span>
                </>
              ) : (
                <>
                  <Icon glyph="save" size={14} />
                  <span className="hidden @[480px]:inline">{saving ? 'Saving…' : 'Quick Save'}</span>
                </>
              )}
            </ButtonGhost>
          )}
          {/* Light/dark toggle — only in the standalone portal (the studio
              owns the theme here; ThemeSync mirrors it onto data-theme). An
              embedded host renders its own theme control. */}
          {!embed && (
            <IconButton
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              <Icon glyph={theme === 'dark' ? 'sun' : 'moon'} size={16} />
            </IconButton>
          )}
          <ButtonPrimary onClick={() => setPreviewOpen(true)}>
            <Icon glyph="eye" size={14} />
            {capabilities.persist ? 'Preview & Publish' : 'Preview'}
          </ButtonPrimary>
          {headerActions}
        </div>
      </div>

      {/* Preview area with optional dot grid */}
      <div
        className="flex-1 overflow-auto p-12"
        style={def.canvasBackground === false ? undefined : {
          backgroundImage: 'radial-gradient(circle, var(--color-canvas-dot) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <div className="min-h-full flex items-center justify-center">
          {Preview ? (
            // Wrap the preview in a capture-phase event listener so any
            // native event the rendered atom fires gets logged to the
            // Events tab. Capture (rather than bubble) sees the event
            // before the atom's own handler — so we log first, the atom
            // behaves second. We don't `preventDefault`, so the rendered
            // component still works normally.
            <div
              onClickCapture={(e) =>
                pushEvent({
                  name: 'onClick',
                  target: (e.target as HTMLElement).tagName.toLowerCase(),
                  payload: JSON.stringify({ x: e.clientX, y: e.clientY, button: e.button }),
                })
              }
              onChangeCapture={(e) => {
                const t = e.target as HTMLInputElement;
                // Skip text-entry surfaces here too — React maps onChange
                // to the native `input` event for text inputs / textareas /
                // contenteditable, so this capture would fire on EVERY
                // keystroke. Combined with onInputCapture below, that's
                // two `setEventLog` calls per character, each triggering
                // a context re-render that races the controlled-input
                // flow and eats typed values mid-keystroke (focus is fine,
                // but the value never lands). The final committed value
                // is captured via onBlurCapture below instead.
                if (isHighFrequencyTextEntry(t)) return;
                pushEvent({
                  name: 'onChange',
                  target: t.tagName.toLowerCase(),
                  payload: JSON.stringify({
                    value: t.value,
                    checked: t.type === 'checkbox' ? t.checked : undefined,
                  }),
                });
              }}
              onInputCapture={(e) => {
                const t = e.target as HTMLInputElement;
                // Skip the input types where `input` is either redundant
                // or pathologically high-frequency:
                //   - checkbox/radio fire `change` AND `input` for a single
                //     toggle — the `change` is the meaningful one.
                //   - range fires `input` on every drag tick (30-60Hz).
                //   - text / tel / email / password / url / search / number
                //     inputs and <textarea> fire `input` per keystroke —
                //     same hazard as range, but worse because text fields
                //     are controlled and the cascading re-render replaces
                //     the inner DOM (or interferes with React's value
                //     reconciliation) and drops typed characters. The blur
                //     handler logs the final committed value instead.
                //   Each captured event pushes to a context-managed log
                //   that triggers a re-render of the UXM shell. Slow
                //   renders during this loop visibly stutter range thumbs
                //   AND silently eat keystrokes for text fields.
                if (t.type === 'checkbox' || t.type === 'radio' || t.type === 'range') return;
                if (isHighFrequencyTextEntry(t)) return;
                pushEvent({
                  name: 'onInput',
                  target: t.tagName.toLowerCase(),
                  payload: JSON.stringify({ value: t.value }),
                });
              }}
              onFocusCapture={(e) =>
                pushEvent({
                  name: 'onFocus',
                  target: (e.target as HTMLElement).tagName.toLowerCase(),
                  payload: JSON.stringify({}),
                })
              }
              onBlurCapture={(e) => {
                const t = e.target as HTMLElement;
                // For text-entry surfaces we suppressed the per-keystroke
                // onChange / onInput log entries (those caused mid-typing
                // re-render races that dropped characters). Include the
                // committed value here so designers can still see what
                // landed in the field once the user leaves it.
                const payload: Record<string, unknown> = {};
                if (isHighFrequencyTextEntry(t)) {
                  payload.value = (t as HTMLInputElement | HTMLTextAreaElement).value;
                }
                pushEvent({
                  name: 'onBlur',
                  target: t.tagName.toLowerCase(),
                  payload: JSON.stringify(payload),
                });
              }}
              onSubmitCapture={(e) => {
                pushEvent({
                  name: 'onSubmit',
                  target: (e.target as HTMLElement).tagName.toLowerCase(),
                  payload: JSON.stringify({}),
                });
                // Forms in the preview shouldn't navigate — they're not
                // backed by anything. The atoms themselves don't always
                // remember to preventDefault, so we do it here.
                e.preventDefault();
              }}
              onKeyDownCapture={(e) => {
                // Log only "meaningful" keystrokes — Enter, Escape, Space,
                // and arrow keys. Logging every keystroke during typing
                // would drown the log; onInput already covers value changes.
                const meaningful = ['Enter', 'Escape', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'];
                if (!meaningful.includes(e.key)) return;
                pushEvent({
                  name: 'onKeyDown',
                  target: (e.target as HTMLElement).tagName.toLowerCase(),
                  payload: JSON.stringify({ key: e.key }),
                });
              }}
            >
              <Preview styles={resolved.styles} variants={resolved.variants} componentId={def.id} shell={shell} />
            </div>
          ) : (
            <p className="text-sm text-text-muted">No preview available.</p>
          )}
        </div>
      </div>

      {previewOpen && <PreviewModal onClose={() => setPreviewOpen(false)} />}
    </div>
  );
}
