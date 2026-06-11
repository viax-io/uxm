/**
 * Public barrel for @viax/uxm/previews.
 *
 * Re-exports every canvas preview component, plus the shared preview-side
 * types. Imported by the modo uxm-shell to render the registry-driven
 * editor canvas. Tree-shakable: hosts that import only `@viax/uxm/ui` do
 * not pull preview code through this entry.
 */

// ── Atom + sub-component previews (live next to their component) ──
export { AlertPreview } from '@/ui/alert/alert-preview';
export { AppSidebarPreview } from '@/ui/app-sidebar/app-sidebar-preview';
export { AppTopBarPreview } from '@/ui/app-top-bar/app-top-bar-preview';
export { AvatarPreview } from '@/ui/avatar/avatar-preview';
export { BackLinkPreview } from '@/ui/back-link/back-link-preview';
export { BadgePreview } from '@/ui/badge/badge-preview';
export { BannerPreview } from '@/ui/banner/banner-preview';
export { BreadcrumbPreview } from '@/ui/breadcrumb/breadcrumb-preview';
export { ButtonPreview } from '@/ui/button/button-preview';
export { ButtonGroupPreview } from '@/ui/button-group/button-group-preview';
export { ButtonWithIconPreview } from '@/ui/button-with-icon/button-with-icon-preview';
export { CalendarPreview } from '@/ui/calendar/calendar-preview';
export { CardPreview } from '@/ui/card/card-preview';
export { CheckboxPreview } from '@/ui/checkbox/checkbox-preview';
export { ChipPreview } from '@/ui/chip/chip-preview';
export { ClusterPreview } from '@/ui/cluster/cluster-preview';
export { ConfigComponentRowPreview } from '@/ui/config-component-row/config-component-row-preview';
export { ConfigSegmentItemPreview } from '@/ui/config-segment-item/config-segment-item-preview';
export { ContentTooltipPreview } from '@/ui/tooltip/content-tooltip-preview';
export { CurrencyInputPreview } from '@/ui/currency-input/currency-input-preview';
export { DataTablePreview } from '@/ui/data-table/data-table-preview';
export { DateInputPreview } from '@/ui/date-input/date-input-preview';
export { DetailSectionPreview } from '@/ui/detail-section/detail-section-preview';
export { DisclosurePreview } from '@/ui/disclosure/disclosure-preview';
export { DividerPreview } from '@/ui/divider/divider-preview';
export { EditableCellPreview } from '@/ui/editable-cell/editable-cell-preview';
export { EmptyStatePreview } from '@/ui/empty-state/empty-state-preview';
export { ErrorPagePreview } from '@/ui/error-page/error-page-preview';
export { ExplorerListItemPreview } from '@/ui/explorer-list-item/explorer-list-item-preview';
export { ExplorerSectionPreview } from '@/ui/explorer-section/explorer-section-preview';
export { FileUploadPreview } from '@/ui/file-upload/file-upload-preview';
export { FilterTabsPreview } from '@/ui/filter-tabs/filter-tabs-preview';
export { FormFieldPreview } from '@/ui/form-field/form-field-preview';
export { IconPreview } from '@/ui/icon/icon-preview';
export { IconButtonPreview } from '@/ui/icon-button/icon-button-preview';
export { IconTilePreview } from '@/ui/icon-tile/icon-tile-preview';
export { InlineActionPreview } from '@/ui/inline-action/inline-action-preview';
export { InlineFilterPreview } from '@/ui/inline-filter/inline-filter-preview';
export { InputPreview } from '@/ui/input/input-preview';
export { InputWithIconPreview } from '@/ui/input-with-icon/input-with-icon-preview';
export { LifecycleConnectorPreview } from '@/ui/lifecycle-connector/lifecycle-connector-preview';
export { LifecycleEdgeLabelPreview } from '@/ui/lifecycle-edge-label/lifecycle-edge-label-preview';
export { LifecycleMinimapPreview } from '@/ui/lifecycle-minimap/lifecycle-minimap-preview';
export { LifecycleNodeCardPreview } from '@/ui/lifecycle-node-card/lifecycle-node-card-preview';
export { LifecycleTerminalPreview } from '@/ui/lifecycle-terminal/lifecycle-terminal-preview';
export { LifecycleZoomControlPreview } from '@/ui/lifecycle-zoom-control/lifecycle-zoom-control-preview';
export { LinkPreview } from '@/ui/link/link-preview';
export { ListItemPreview } from '@/ui/list/list-item-preview';
export { ListboxPreview } from '@/ui/listbox/listbox-preview';
export { LoaderPreview } from '@/ui/loader/loader-preview';
export { MetaRowPreview } from '@/ui/meta-row/meta-row-preview';
export { ModalPreview } from '@/ui/modal/modal-preview';
export { NumberFieldPreview } from '@/ui/number-field/number-field-preview';
export { NumberInputPreview } from '@/ui/number-input/number-input-preview';
export { PageHeaderPreview } from '@/ui/page-header/page-header-preview';
export { PageShellPreview } from '@/ui/page-shell/page-shell-preview';
export { PasswordInputPreview } from '@/ui/password-input/password-input-preview';
export { PhoneInputPreview } from '@/ui/phone-input/phone-input-preview';
export { PillSelectPreview } from '@/ui/pill-select/pill-select-preview';
export { PropertyFieldPreview } from '@/ui/property-field/property-field-preview';
export { PropertyGridPreview } from '@/ui/property-field/property-grid-preview';
export { RadioGroupPreview } from '@/ui/radio-group/radio-group-preview';
export { ResponsiveGridPreview } from '@/ui/responsive-grid/responsive-grid-preview';
export { SearchDropdownPreview } from '@/ui/search-dropdown/search-dropdown-preview';
export { SectionHeaderPreview } from '@/ui/section-header/section-header-preview';
export { SelectPreview } from '@/ui/input/select-preview';
export { SideFlexpanePreview } from '@/ui/side-flexpane/side-flexpane-preview';
export { SidebarNavItemPreview } from '@/ui/sidebar-nav-item/sidebar-nav-item-preview';
export { SliderPreview } from '@/ui/slider/slider-preview';
export { StackPreview } from '@/ui/stack/stack-preview';
export { StatCardPreview } from '@/ui/stat-card/stat-card-preview';
export { TabsPreview } from '@/ui/tabs/tabs-preview';
export { TabsUnderlinePreview } from '@/ui/tabs-underline/tabs-underline-preview';
export { TagPreview } from '@/ui/tag/tag-preview';
export { TextareaPreview } from '@/ui/input/textarea-preview';
export { ThumbnailPreview } from '@/ui/thumbnail/thumbnail-preview';
export { TimeInputPreview } from '@/ui/time-input/time-input-preview';
export { TimelineEntryPreview } from '@/ui/timeline-entry/timeline-entry-preview';
export { ToastPreview } from '@/ui/toast/toast-preview';
export { TogglePreview } from '@/ui/toggle-switch/toggle-preview';
export { TooltipPreview } from '@/ui/tooltip/tooltip-preview';
export { TypeOverviewCardPreview } from '@/ui/type-overview-card/type-overview-card-preview';
export { ViewSwitcherPreview } from '@/ui/view-switcher/view-switcher-preview';

// ── Composite / showcase previews (no 1:1 component) ──
export { BrandSettingsPreview } from '@/previews/composite/brand-settings-preview';
export { FormPreview } from '@/previews/composite/form-preview';
export { LifecycleActionRowPreview } from '@/previews/composite/lifecycle-action-row-preview';
export { LifecycleAddStepModalPreview } from '@/previews/composite/lifecycle-add-step-modal-preview';
export { LifecycleConnectorKnobsPreview } from '@/previews/composite/lifecycle-connector-knobs-preview';
export { LifecycleEdgeInsertMenuPreview } from '@/previews/composite/lifecycle-edge-insert-menu-preview';
export { LifecyclePlusButtonPreview } from '@/previews/composite/lifecycle-plus-button-preview';
export { LoginPagePreview } from '@/previews/composite/login-page-preview';
export { MultirowFormPreview } from '@/previews/composite/multirow-form-preview';
export { SegmentTreeRowPreview } from '@/previews/composite/segment-tree-row-preview';

// ── Shared preview-side types ──
export type { PreviewProps, PreviewShellContext, Theme } from './types';
