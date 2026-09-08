import { backLinkDef } from './back-link';
import { badgeDef } from './badge';
import { breadcrumbDef } from './breadcrumb';
import { buttonGroupDef } from './button-group';
import { calendarDef } from './calendar';
import { contentTooltipDef } from './content-tooltip';
import { dataTableDef } from './data-table';
import { detailSectionDef } from './detail-section';
import { dividerDef } from './divider';
import { errorPageDef } from './error-page';
import { explorerListItemDef } from './explorer-list-item';
import { explorerSectionDef } from './explorer-section';
import { filterTabsDef } from './filter-tabs';
import { formFieldDef } from './form-field';
import { formMultirowDef } from './form-multirow';
import { iconTileDef } from './icon-tile';
import { inlineActionDef } from './inline-action';
import { inlineFilterDef } from './inline-filter';
import { linkDef } from './link';
import { listItemDef } from './list-item';
import { loginPageDef } from './login-page';
import { metaRowDef } from './meta-row';
import { pageHeaderDef } from './page-header';
import { pageShellDef } from './page-shell';
import { pillSelectDef } from './pill-select';
import { propertyFieldDef } from './property-field';
import { propertyGridDef } from './property-grid';
import { sectionHeaderDef } from './section-header';
import { sideFlexpaneDef } from './side-flexpane';
import { sidebarNavItemDef } from './sidebar-nav-item';
import { sidebarNavTriggerDef } from './sidebar-nav-trigger';
import { statCardDef } from './stat-card';
import { tabsDef } from './tabs';
import { tabsUnderlineDef } from './tabs-underline';
import { thumbnailDef } from './thumbnail';
import { typeOverviewCardDef } from './type-overview-card';
import { viewSwitcherDef } from './view-switcher';

import type { ComponentDef } from '../../types';

// One file per atom (`<id>.ts`), assembled here in sidebar order — the order
// is the only thing this file owns. Add a new def as a new file + one line
// here; `scripts/check-state-var-drift.mjs` globs the folder.
export const compositeDefs: ComponentDef[] = [
  // ── Composite ──
  pillSelectDef,
  inlineFilterDef,
  contentTooltipDef,
  formMultirowDef,
  dataTableDef,
  viewSwitcherDef,
  tabsDef,
  tabsUnderlineDef,
  filterTabsDef,
  buttonGroupDef,
  sideFlexpaneDef,
  pageHeaderDef,
  dividerDef,
  loginPageDef,
  errorPageDef,
  sidebarNavItemDef,
  explorerListItemDef,
  sidebarNavTriggerDef,
  explorerSectionDef,
  inlineActionDef,
  sectionHeaderDef,
  detailSectionDef,
  breadcrumbDef,
  linkDef,
  backLinkDef,
  badgeDef,
  thumbnailDef,
  calendarDef,
  iconTileDef,
  metaRowDef,
  formFieldDef,
  propertyFieldDef,
  propertyGridDef,
  listItemDef,
  statCardDef,
  pageShellDef,
  typeOverviewCardDef,
];
