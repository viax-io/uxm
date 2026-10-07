/**
 * Display titles for the properties panel's section slugs.
 *
 * Data, not render logic — it lives here rather than inside the panel for two
 * reasons: it was being rebuilt on every render, and `scripts/extract-studio-i18n.mjs`
 * bundles this module to collect the `section` namespace. A title added to a
 * component body would be invisible to the extractor and would ship
 * untranslated in all 24 locales.
 *
 * A slug with no entry falls back to its own capitalised slug.
 */
export const SECTION_LABELS: Record<string, string> = {
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
