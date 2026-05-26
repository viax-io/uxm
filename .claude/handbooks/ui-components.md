# UI Components API Reference

> Auto-generated from source. Run `node tools/gen-components-handbook.js` to refresh.

## Import pattern

```js
import XButton from '@/components/XButton'
import { XButton, XInput } from '@viax/ui-components'  // if using the npm package
```

## Component index

**Layout:** [LayoutFlexPane](#layoutflexpane) · [LayoutFlexPaneModal](#layoutflexpanemodal) · [LayoutFullScreenModal](#layoutfullscreenmodal) · [LayoutPageTwoColumns](#layoutpagetwocolumns) · [LayoutPowerBar](#layoutpowerbar) · [LayoutWithHeader](#layoutwithheader) · [LayoutWithSidebar](#layoutwithsidebar)

**Transition:** [TransitionFade](#transitionfade) · [TransitionMoveRight](#transitionmoveright) · [TransitionMoveUp](#transitionmoveup)

**Inputs & selectors:** [XAmountInput](#xamountinput) · [XCheckbox](#xcheckbox) · [XCheckboxGroup](#xcheckboxgroup) · [XDateInput](#xdateinput) · [XDatePicker](#xdatepicker) · [XDropDown](#xdropdown) · [XDropDownWithCheckboxes](#xdropdownwithcheckboxes) · [XInlineEdit](#xinlineedit) · [XInput](#xinput) · [XNumberInput](#xnumberinput) · [XPhoneInput](#xphoneinput) · [XPillSelect](#xpillselect) · [XQuantityInput](#xquantityinput) · [XRadio](#xradio) · [XSearch](#xsearch) · [XSearchInput](#xsearchinput) · [XSlider](#xslider) · [XSwitch](#xswitch) · [XTagInput](#xtaginput) · [XTextarea](#xtextarea) · [XTimePicker](#xtimepicker)

**Form wrappers:** [XFormAmountInput](#xformamountinput) · [XFormButton](#xformbutton) · [XFormCheckbox](#xformcheckbox) · [XFormDateInput](#xformdateinput) · [XFormDateRangeInput](#xformdaterangeinput) · [XFormDropDown](#xformdropdown) · [XFormField](#xformfield) · [XFormHeader](#xformheader) · [XFormInput](#xforminput) · [XFormNumberInput](#xformnumberinput) · [XFormPillsList](#xformpillslist) · [XFormPlainText](#xformplaintext) · [XFormQuantityInput](#xformquantityinput) · [XFormRadio](#xformradio) · [XFormRow](#xformrow) · [XFormStringArrayInput](#xformstringarrayinput) · [XFormSwitch](#xformswitch) · [XFormTagInput](#xformtaginput) · [XFormTextarea](#xformtextarea) · [XFormTimePicker](#xformtimepicker)

**Buttons & actions:** [XAddAction](#xaddaction) · [XAdditionalAction](#xadditionalaction) · [XBasicButton](#xbasicbutton) · [XButton](#xbutton) · [XContextButton](#xcontextbutton) · [XContextMultiActionsButton](#xcontextmultiactionsbutton) · [XIconButton](#xiconbutton) · [XMultiActionButton](#xmultiactionbutton) · [XTextButton](#xtextbutton)

**Feedback & status:** [XEmptyState](#xemptystate) · [XErrorTooltip](#xerrortooltip) · [XFullAreaSpinner](#xfullareaspinner) · [XInfoBox](#xinfobox) · [XMessage](#xmessage) · [XNoMatchItems](#xnomatchitems) · [XNotifications](#xnotifications) · [XNotificationsCounter](#xnotificationscounter) · [XProgress](#xprogress) · [XProgressCircular](#xprogresscircular) · [XSkeletonLoader](#xskeletonloader) · [XTooltip](#xtooltip)

**Overlays & containers:** [XAccordion](#xaccordion) · [XExpandCard](#xexpandcard) · [XModal](#xmodal) · [XPopper](#xpopper)

**Data display:** [XBreadcrumbs](#xbreadcrumbs) · [XChip](#xchip) · [XDateFilter](#xdatefilter) · [XDateRangeFilter](#xdaterangefilter) · [XEditView](#xeditview) · [XFilters](#xfilters) · [XHeader](#xheader) · [XList](#xlist) · [XListActions](#xlistactions) · [XListFilter](#xlistfilter) · [XListItem](#xlistitem) · [XLocalizedList](#xlocalizedlist) · [XPill](#xpill) · [XPillBasic](#xpillbasic) · [XPillsList](#xpillslist) · [XSortControl](#xsortcontrol) · [XTable](#xtable) · [XTableHeader](#xtableheader) · [XTableRow](#xtablerow) · [XTableValue](#xtablevalue) · [XTabs](#xtabs)

**Utilities & misc:** [XCol](#xcol) · [XIcon](#xicon) · [XOrganizationItemWithType](#xorganizationitemwithtype) · [XOrganizationOption](#xorganizationoption) · [XP](#xp) · [XProductItem](#xproductitem) · [XRow](#xrow) · [XSelectEntityItem](#xselectentityitem) · [XSliderButton](#xsliderbutton) · [XSliderDot](#xsliderdot) · [XUserOption](#xuseroption)

---

## Layout

### LayoutFlexPane

Component: layout-flex-pane - Layout for use in second column from layout-page-two-columns

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `innerPadding` | String | `'l'` |  |
| `fixed` | Boolean | `true` |  |

**Slots**

`header` · `default` · `footer`

---

### LayoutFlexPaneModal

Component: layout-flex-pane-modal - Modal overlay panel with save/cancel actions

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `noActions` | Boolean | `false` |  |
| `isWide` | Boolean | `false` |  |
| `withInfo` | Boolean | `false` |  |
| `additionalComponent` | Boolean | `false` |  |
| `savingDisability` | Boolean | `false` |  |
| `scrollToTop` | Boolean | `true` |  |
| `topPosition` | String | `'72px'` |  |
| `saveButtonTitle` | String | `'Save'` |  |
| `saveButtonTooltip` | String | `''` |  |
| `cancelButtonTitle` | String | `'Cancel'` |  |
| `cancelButtonTooltip` | String | `''` |  |

**Emits**

`close` · `save`

**Slots**

`additional` · `info` · `default`

---

### LayoutFullScreenModal

Component: layout-full-screen-modal - Layout full screen modal

**Emits**

`close`

**Slots**

`default`

---

### LayoutPageTwoColumns

Component: layout-page-two-columns - Layout with two columns and header in first column

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `activeState` | Boolean | `false` |  |
| `wide` | Boolean | `false` |  |
| `withOverlay` | Boolean | `false` |  |
| `innerPadding` | String | `'l'` |  |
| `showClose` | Boolean | `false` |  |
| `scrollable` | Boolean | `true` |  |
| `mainHeaderHeight` | Number | `60` |  |

**Emits**

`close`

**Slots**

`main-header` · `header` · `column-1` · `column-2`

---

### LayoutPowerBar

Component: layout-power-bar - Toolbar layout with left, center and right slots

**Slots**

`left` · `center` · `right`

---

### LayoutWithHeader

Component: layout-with-header - Main content layout with fixed main header and sub-header

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `scrollable` | Boolean | `true` |  |

**Slots**

`main-header` · `header` · `default`

---

### LayoutWithSidebar

Component: layout-with-sidebar - Layout with static header, sidebar and main content area

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `sidebarColor` | String | `null` |  |
| `scrollable` | Boolean | `true` |  |

**Slots**

`main-header` · `header-left-top` · `header-left-center` · `header-left-bottom` · `header-right-icons` · `header-right-center` · `header-right-bottom` · `side-bar` · `content`

---

## Transition

### TransitionFade

Component: transition-fade - Component for transition with fade animation

**Slots**

`default`

---

### TransitionMoveRight

Component: transition-move-right - Component for transition right

**Slots**

`default`

---

### TransitionMoveUp

Component: transition-move-up - Component for transition move up

**Slots**

`default`

---

## Inputs & selectors

### XAmountInput

Component: x-amount-input XInput wrapper with precision decimal and caret position management.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | — |  |
| `placeholder` | String | `''` |  |
| `label` | String | — |  |
| `ariaLabel` | String | *(required)* |  |
| `disabled` | Boolean | `false` |  |
| `iconLeft` | String | — | src-based icons (legacy, kept for backwards compatibility) |
| `iconRight` | String | — |  |
| `iconLeftColor` | String | — |  |
| `iconRightColor` | String | — |  |
| `iconLeftName` | String | — | name-based icons (new, preferred) |
| `iconRightName` | String | — |  |
| `clearable` | Boolean | `true` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `precision` | Number | `2` |  |
| `min` | Number | `0` |  |
| `max` | Number | `Infinity` |  |

**Emits**

`update:modelValue` · `enter` · `keyup` · `change` · `clear` · `focus` · `blur` · `left-click` · `right-click`

---

### XCheckbox

Component: x-checkbox - Checkbox with optional indeterminate state

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `keyValue` | String | `''` | this prop using for checkbox-group |
| `label` | String | `''` |  |
| `modelValue` | Boolean | `undefined` |  |
| `disabled` | Boolean | `false` |  |
| `indeterminate` | Boolean | `false` | Indeterminate (mixed) state — shows minus icon and sets aria-checked="mixed". Used by checkbox groups when only some children are checked. |

**Emits**

`update:modelValue`

---

### XCheckboxGroup

Component: x-checkbox-group

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Array | `() => []` |  |
| `items` | Array | *(required)* |  |
| `disabled` | Boolean | `false` |  |
| `indeterminate` | Boolean | `false` | Renders a parent "Select all" checkbox above the group. Its state (checked / indeterminate / unchecked) is derived automatically from the children selection. |
| `parentLabel` | String | `'Select all'` | Label for the parent "Select all" checkbox. Only used when `indeterminate` is true. |

**Emits**

`update:modelValue`

---

### XDateInput

Component: x-date-input - dropdown component

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | — |  |
| `ariaLabel` | String | `'date input'` |  |
| `placeholder` | String | `''` |  |
| `label` | String | — |  |
| `disabled` | Boolean | `false` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `placement` | String | `'bottom-start'` |  |
| `formatString` | String | `'MM/dd/yyyy'` |  |
| `clearable` | Boolean | `true` |  |
| `showToday` | Boolean | `true` |  |
| `color` | String (`primary | secondary | neutral`) | `'primary'` |  |
| `onlyFuture` | Boolean | `false` |  |
| `onlyPast` | Boolean | `false` |  |
| `withToday` | Boolean | `true` |  |
| `withWeekend` | Boolean | `true` |  |
| `iconLeft` | String | — |  |
| `iconLeftName` | String | — |  |
| `iconLeftColor` | String | — |  |

**Emits**

`update:modelValue` · `blur` · `change` · `clear` · `focus` · `enter`

---

### XDatePicker

Component: x-date-picker - Date picker calendar component

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | `''` |  |
| `formatString` | String | `'MM/dd/yyyy'` |  |
| `showToday` | Boolean | `true` |  |
| `color` | String (`primary | secondary | neutral`) | `'primary'` |  |
| `onlyFuture` | Boolean | `false` |  |
| `onlyPast` | Boolean | `false` |  |
| `withToday` | Boolean | `true` |  |
| `withWeekend` | Boolean | `true` |  |

**Emits**

`input` · `update:modelValue`

---

### XDropDown

Component: drop-down - dropdown component

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | String | `''` |  |
| `withSelectedOptionIcon` | Boolean | `true` |  |
| `modelValue` | — | *(required)* |  |
| `options` | Array | *(required)* |  |
| `topAdditionalOption` | String | `''` |  |
| `bottomAdditionalOption` | String | `''` |  |
| `placeholder` | String | `'Select...'` |  |
| `ariaLabel` | String | `'Drop down'` |  |
| `iconSrc` | String | — |  |
| `iconName` | String | `''` |  |
| `iconColor` | String | — |  |
| `disabled` | Boolean | `false` |  |
| `withFiltering` | Boolean | `false` |  |
| `readonly` | Boolean | `true` |  |
| `inputType` | String (`text | number`) | `'text'` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `clearable` | Boolean | `true` |  |
| `keyOfOption` | String | `'label'` |  |
| `noResultsMatchText` | String | `'no results match'` |  |

**Emits**

`update:modelValue` · `update:input` · `bottom-option-select` · `change` · `blur` · `focus` · `clear` · `top-option-select` · `search-value`

**Slots**

`top-dropdown` · `dropdown` · `bottom-dropdown`

---

### XDropDownWithCheckboxes

Component: x-drop-down-with-checkboxes - Dropdown with an inline checkbox list XTagInput renders a dropdown where each selection appears as a removable pill — the same multi-select UX without a separate checkbox column.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `items` | Array | *(required)* |  |
| `placeholder` | String | `'Select...'` |  |
| `ariaLabel` | String | *(required)* |  |
| `disabled` | Boolean | `false` |  |
| `iconSrc` | String | `''` |  |
| `iconColor` | String | `''` |  |
| `label` | String | `''` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |

**Emits**

`blur` · `selected-item`

---

### XInlineEdit

Component: x-inline-edit - Component for inline editing input, date input, input number, dropdown, tags

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Number | `null` |  |
| `title` | String | `null` |  |
| `saving` | Boolean | `false` |  |
| `error` | Boolean | `false` |  |
| `component` | Object | *(required)* |  |
| `open` | Boolean | `false` |  |
| `propOptions` | Object | `() => null` |  |
| `success` | Boolean | `true` |  |
| `showDefaultSlot` | Boolean | `false` |  |
| `clearable` | Boolean | `false` |  |
| `saveOnChange` | Boolean | `true` | When false, `change` events from the inner component do NOT trigger an immediate save.  Use this for multi-step editors such as XTagInput where each individual change (adding / removing a pill, toggling a checkbox) is an intermediate step, not a final "done" signal. Save is still triggered by `blur` (e.g. click-outside on XTagInput). |

**Emits**

`blur` · `clear` · `focus` · `save` · `select-item` · `update:modelValue`

**Slots**

`default`

---

### XInput

Component: x-input - Input component

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | — |  |
| `placeholder` | String | `''` |  |
| `label` | String | — |  |
| `isRequired` | Boolean | `false` |  |
| `ariaLabel` | String | *(required)* |  |
| `disabled` | Boolean | `false` |  |
| `iconLeft` | String | — | src-based icons (legacy, kept for backwards compatibility) |
| `iconRight` | String | — |  |
| `iconLeftColor` | String | — |  |
| `iconRightColor` | String | — |  |
| `iconLeftName` | String | — | name-based icons (new, preferred) |
| `iconRightName` | String | — |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `autocomplete` | String (`on | off`) | `'off'` |  |
| `type` | String (`text | tel | password | textarea`) | `'text'` | new props for wrapper support |
| `clearable` | Boolean | `true` |  |
| `rows` | Number | `2` |  |
| `readonly` | Boolean | `false` |  |

**Emits**

`clear` · `enter` · `right-click` · `left-click` · `focus` · `blur` · `change` · `update:modelValue`

---

### XNumberInput

Component: x-number-input XInput wrapper with float/integer sanitization and range validation.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | — |  |
| `placeholder` | String | `''` |  |
| `label` | String | — |  |
| `ariaLabel` | String | *(required)* |  |
| `disabled` | Boolean | `false` |  |
| `iconLeft` | String | — |  |
| `iconLeftName` | String | — |  |
| `iconRight` | String | — |  |
| `iconRightName` | String | — |  |
| `iconLeftColor` | String | — |  |
| `iconRightColor` | String | — |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `float` | Boolean | `false` |  |
| `precision` | Number | `2` |  |
| `min` | Number | `-Infinity` |  |
| `max` | Number | `Infinity` |  |
| `clearable` | Boolean | `true` |  |

**Emits**

`update:modelValue` · `enter` · `keyup` · `change` · `clear` · `focus` · `blur` · `esc` · `left-click` · `right-click`

---

### XPhoneInput

Component: x-phone-input — Phone number input with country selector Wraps VueTelInput with XInput-compatible API: same props, emits, BEM classes and theme tokens. Third-party internals are not exposed.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | `''` |  |
| `placeholder` | String | `''` |  |
| `label` | String | `''` |  |
| `ariaLabel` | String | *(required)* |  |
| `isRequired` | Boolean | `false` |  |
| `disabled` | Boolean | `false` |  |
| `clearable` | Boolean | `true` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `defaultCountry` | String | `'US'` |  |
| `onlyCountries` | Array | `() => ['US', 'CA', 'GB', 'UA']` |  |
| `iconRight` | String | `''` | src-based icon (legacy, kept for backwards compatibility) |
| `iconRightName` | String | `'phone'` | name-based icon (preferred) |
| `iconRightColor` | String | `''` |  |

**Emits**

`update:modelValue` · `change` · `focus` · `blur` · `clear`

---

### XPillSelect

Component: x-pill-select - Pill with dropdown list of options

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `options` | Array | *(required)* |  |
| `ellipsis` | Boolean | `false` |  |
| `selectedValue` | String | `''` |  |
| `placement` | String (`top-start | top-end | bottom-start | bottom-end`) | `'bottom-start'` |  |
| `color` | String (`primary | secondary | dark | success | danger | warning`) | `'primary'` |  |
| `nullable` | Boolean | `false` |  |
| `nullValueLabel` | String | `'Not Selected'` |  |

**Emits**

`change`

---

### XQuantityInput

Component: x-quantity-input Stepper wrapper over XNumberInput with increase/decrease controls.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Number | `0` |  |
| `stepValue` | Number | `1` |  |
| `min` | Number | `Number.NEGATIVE_INFINITY` |  |
| `max` | Number | `Number.POSITIVE_INFINITY` |  |
| `ariaLabel` | String | *(required)* |  |
| `disabled` | Boolean | `false` |  |
| `buttonVisible` | Boolean | `true` |  |

**Emits**

`increase` · `decrease` · `update:modelValue`

---

### XRadio

Radio button. Checked when `modelValue === value`. **Every `XRadio` must have an explicit `value` prop** — without it `checked` never activates.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | `Boolean\|String\|Number` | `''` | Bound via `v-model`. The currently selected value in the group. |
| `value` | `Boolean\|String\|Number` | — | **Required in practice.** This radio is checked when `modelValue === value`. Each radio in the group must have a unique value. |
| `disabled` | Boolean | `false` | |
| `label` | String | `''` | Visible text next to the control. |
| `name` | String | `''` | HTML `name` — groups radios for native browser behaviour. Set the same value on all radios in a group. |

**Emits**

`update:modelValue` · `change`

```vue
<!-- ✅ correct — every XRadio has a unique value -->
<XRadio v-model="plan" value="free"       label="Free" />
<XRadio v-model="plan" value="pro"        label="Pro" />
<XRadio v-model="plan" value="enterprise" label="Enterprise" />

<!-- ❌ wrong — missing value, radio can never become checked -->
<XRadio v-model="plan" label="Free" />
```

---

### XSearch

Component: x-search - Search component

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | — |  |
| `options` | Array | *(required)* |  |
| `itemComponent` | Object | — |  |
| `label` | String | `''` |  |
| `placeholder` | String | *(required)* |  |
| `ariaLabel` | String | *(required)* |  |
| `disabled` | Boolean | `false` |  |
| `error` | String | `''` |  |
| `fullWidth` | Boolean | `false` |  |
| `appendToBody` | Boolean | `true` |  |

**Emits**

`update:modelValue` · `enter` · `keyup` · `change` · `blur` · `focus` · `clear` · `click-outside` · `select`

**Slots**

`default`

---

### XSearchInput

Component: x-search-input - Search input component

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | — |  |
| `label` | String | `''` |  |
| `dropDownMaxHeight` | String | `''` |  |
| `placeholder` | String | *(required)* |  |
| `ariaLabel` | String | *(required)* |  |
| `disabled` | Boolean | `false` |  |
| `isOpen` | Boolean | `false` |  |
| `showClear` | Boolean | `false` |  |
| `large` | Boolean | `false` |  |
| `light` | Boolean | `false` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `showSavedQueriesSelect` | Boolean | `false` |  |
| `savedQueries` | Array | `() => ([])` |  |
| `selectedQueryUid` | String | `''` |  |

**Emits**

`click` · `clear` · `click-outside` · `blur` · `change` · `keyup` · `enter` · `update:modelValue` · `handle-select-query` · `handle-save-query`

---

### XSlider

---

### XSwitch

Component: x-switch - Toggle switch

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Boolean | `false` |  |
| `activeValue` | Boolean | `true` |  |
| `inactiveValue` | Boolean | `false` |  |
| `disabled` | Boolean | `false` |  |
| `label` | String | `''` |  |
| `id` | String | `''` |  |
| `name` | String | `''` |  |

**Emits**

`change` · `update:modelValue`

---

### XTagInput

Component: x-tag-input - Input (or dropdown with checkboxes) with a list of pills below it When `options` is provided: renders a text input that opens a dropdown on focus. Typing filters the list. The panel contains XList + XListItem + XCheckbox for multi-select. Selected items are shown as removable pills below the input. When `options` is null: renders a plain text input. Pressing Enter adds a tag.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Array | `() => []` |  |
| `placeholder` | String | `''` |  |
| `label` | String | `''` |  |
| `ariaLabel` | String | *(required)* |  |
| `disabled` | Boolean | `false` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `options` | Array | `null` | If provided, renders a dropdown with checkboxes instead of a text input. Accepts array of strings or { label, value } objects. |
| `keyOfOption` | String | `'label'` | Key used as label when options are objects. |
| `pillColor` | String | `'primary'` | Color of the pills. |
| `iconLeft` | String | `undefined` | Icon src or name to display on the left side of the input. |
| `iconRight` | String | `undefined` | Icon src or name to display on the right side of the input. |
| `iconLeftColor` | String | `undefined` | Color override for the left icon. |
| `iconRightColor` | String | `undefined` | Color override for the right icon. |
| `iconLeftName` | String | `undefined` | Icon name (preferred) for the left side. |
| `iconRightName` | String | `undefined` | Icon name (preferred) for the right side. |
| `clearable` | Boolean | `true` | Whether the free-text input shows a clear button when it has a value. Matches XInput `clearable` behaviour. Only applies to the free-text variant. |

**Emits**

`update:modelValue` · `change` · `blur` · `left-click` · `right-click` · `clear`

---

### XTextarea

Component: x-textarea Wrapper over XInput with type="textarea". Preserves legacy CSS classes.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | — |  |
| `placeholder` | String | `''` |  |
| `label` | String | — |  |
| `ariaLabel` | String | *(required)* |  |
| `disabled` | Boolean | `false` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `rows` | Number | `2` |  |

**Emits**

`blur` · `change` · `keyup` · `enter` · `focus` · `clear` · `update:modelValue`

---

### XTimePicker

Component: x-time-picker

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | `''` | In 12h mode: "HH:MM AM" / "HH:MM PM" In 24h mode: "HH:MM" |
| `ariaLabel` | String | *(required)* |  |
| `label` | String | `''` |  |
| `placeholder` | String | `''` | Overrides the auto-generated placeholder. Defaults: "__:__ --" (12h) or "__:__" (24h). |
| `disabled` | Boolean | `false` |  |
| `iconSrc` | String | `''` |  |
| `iconName` | String | `''` |  |
| `iconColor` | String | `''` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `clearable` | Boolean | `true` | When true — shows a clear button when the field has a value. |
| `is24h` | Boolean | `false` | When true — 24-hour clock (00–23), no AM/PM column. When false (default) — 12-hour clock (12, 01–11) with AM/PM. |

**Emits**

`update:modelValue` · `change` · `blur` · `focus`

---

## Form wrappers

### XFormAmountInput

Component: x-form-amount-input - Component for input in creation form.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Number | — |  |
| `disabled` | Boolean | `false` |  |
| `error` | String | `''` |  |
| `placeholder` | String | *(required)* |  |
| `ariaLabel` | String | *(required)* |  |
| `isRequired` | Boolean | — |  |
| `span` | Number | `8` |  |
| `iconSrc` | String | `''` |  |
| `label` | String | — |  |
| `labelAlign` | String | `'right'` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |
| `iconLeft` | String | — |  |
| `iconRight` | String | — |  |
| `iconLeftColor` | String | — |  |
| `iconRightColor` | String | — |  |
| `iconLeftName` | String | `''` |  |
| `iconRightName` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `precision` | Number | `2` |  |
| `min` | Number | `0` |  |
| `max` | Number | `Infinity` |  |

**Emits**

`blur` · `change` · `clear` · `enter` · `focus` · `keyup` · `left-click` · `right-click` · `update:modelValue`

---

### XFormButton

Component: x-form-button - Component for input in creation form.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `disabled` | Boolean | `false` |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `span` | Number | `8` |  |
| `iconSrc` | String | `''` |  |
| `buttonLabel` | String | `''` |  |
| `buttonType` | String (`primary | secondary | tertiary`) | `'primary'` |  |
| `isLoading` | Boolean | `false` |  |
| `hintInline` | Boolean | `true` |  |

**Emits**

`click`

---

### XFormCheckbox

Component: x-form-checkbox - Component for input in creation form.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Boolean | — |  |
| `items` | Array | `null` |  |
| `vertical` | Boolean | `false` |  |
| `disabled` | Boolean | `false` |  |
| `ariaLabel` | String | *(required)* |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `true` |  |
| `activeValue` | Boolean | `true` |  |
| `inactiveValue` | Boolean | `false` |  |
| `isRequired` | Boolean | `false` |  |

**Emits**

`blur` · `change` · `focus` · `update:modelValue`

---

### XFormDateInput

Component: x-form-date-input - Component for adding date in creation form.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | `''` |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |
| `disabled` | Boolean | `false` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `placeholder` | String | `''` |  |
| `placement` | String | `'bottom-start'` |  |
| `formatString` | String | `'MM/dd/yyyy'` |  |
| `clearable` | Boolean | `true` |  |
| `isRequired` | Boolean | — |  |
| `span` | Number | `8` |  |
| `showToday` | Boolean | `true` |  |
| `color` | String | `'primary'` |  |
| `onlyFuture` | Boolean | `false` |  |
| `onlyPast` | Boolean | `false` |  |
| `withToday` | Boolean | `true` |  |
| `withWeekend` | Boolean | `true` |  |
| `iconLeft` | String | `''` |  |
| `iconLeftName` | String | `''` |  |
| `iconLeftColor` | String | `''` |  |

**Emits**

`update:modelValue` · `blur` · `change` · `clear` · `focus`

---

### XFormDateRangeInput

Component: x-form-date-range-input - Component for adding date in creation form.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Array | `() => []` |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |
| `disabled` | Boolean | `false` |  |
| `error` | String | `''` |  |
| `startDateClearable` | Boolean | `true` |  |
| `isRequired` | Boolean | — |  |
| `span` | Number | `8` |  |
| `alwaysShowDateRange` | Boolean | `false` |  |
| `placement` | String | `'bottom-start'` |  |
| `formatString` | String | `'MM/dd/yyyy'` |  |
| `showToday` | Boolean | `true` |  |
| `color` | String | `'primary'` |  |
| `withToday` | Boolean | `true` |  |
| `withWeekend` | Boolean | `true` |  |

**Emits**

`update:modelValue` · `start-date-cleared`

---

### XFormDropDown

Component: x-form-drop-down - Component for adding date in creation form.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | — | *(required)* |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |
| `clearable` | Boolean | `true` |  |
| `disabled` | Boolean | `false` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `options` | Array | *(required)* |  |
| `placeholder` | String | *(required)* |  |
| `ariaLabel` | String | *(required)* |  |
| `inputType` | String (`text | number`) | `'text'` |  |
| `iconSrc` | String | — |  |
| `iconName` | String | `''` |  |
| `iconColor` | String | — |  |
| `readonly` | Boolean | `true` |  |
| `withFiltering` | Boolean | `false` |  |
| `withSelectedOptionIcon` | Boolean | `true` |  |
| `topAdditionalOption` | String | `''` |  |
| `bottomAdditionalOption` | String | `''` |  |
| `keyOfOption` | String | `'label'` |  |
| `isRequired` | Boolean | — |  |
| `span` | Number | `8` |  |

**Emits**

`blur` · `bottom-option-select` · `change` · `clear` · `focus` · `search-value` · `top-option-select` · `update:modelValue`

---

### XFormField

Component: x-form-field - Component for displaying form fields in responsive way

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `displayValue` | String | `''` |  |
| `showDot` | Boolean | `false` |  |
| `label` | String | `''` |  |
| `labelAlign` | String (`left | right`) | `'right'` |  |
| `span` | Number | `8` |  |
| `hint` | String | `''` |  |
| `hintWithPaddingTop` | Boolean | `false` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |

**Emits**

`update:modelValue`

**Slots**

`label` · `field`

---

### XFormHeader

Component: x-form-header - Component for titles of forms

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `title` | String | `''` |  |
| `note` | String | `''` |  |
| `actions` | Array | `() => []` |  |
| `isMobile` | Boolean | `false` |  |
| `emptyPlaceForClose` | Boolean | `false` |  |
| `showClose` | Boolean | `false` |  |
| `showBack` | Boolean | `false` |  |
| `showSeparator` | Boolean | `false` |  |
| `imageSrc` | String | `''` |  |
| `formState` | String | `'default'` |  |

**Emits**

`handle-emit` · `close` · `back`

**Slots**

`actions` · `default`

---

### XFormInput

Component: x-form-input - Component for input in creation form.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | — |  |
| `disabled` | Boolean | `false` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `placeholder` | String | `''` |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |
| `ariaLabel` | String | *(required)* |  |
| `isRequired` | Boolean | — |  |
| `span` | Number | `8` |  |
| `iconSrc` | String | `''` |  |
| `iconLeft` | String | — |  |
| `iconRight` | String | — |  |
| `iconLeftColor` | String | — |  |
| `iconRightColor` | String | — |  |
| `iconLeftName` | String | `''` |  |
| `iconRightName` | String | `''` |  |

**Emits**

`blur` · `right-click` · `clear` · `enter` · `left-click` · `focus` · `change` · `update:modelValue`

---

### XFormNumberInput

Component: x-form-number-input - Component for input in creation form.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Number | — |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `disabled` | Boolean | `false` |  |
| `error` | String | `''` |  |
| `placeholder` | String | *(required)* |  |
| `ariaLabel` | String | *(required)* |  |
| `float` | Boolean | `false` |  |
| `iconSrc` | String | `''` |  |
| `isRequired` | Boolean | — |  |
| `span` | Number | `8` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |
| `iconLeft` | String | — |  |
| `iconRight` | String | — |  |
| `iconLeftColor` | String | — |  |
| `iconRightColor` | String | — |  |
| `iconLeftName` | String | `''` |  |
| `iconRightName` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `precision` | Number | `2` |  |
| `min` | Number | `-Infinity` |  |
| `max` | Number | `Infinity` |  |

**Emits**

`update:modelValue` · `blur` · `change` · `clear` · `enter` · `focus` · `keyup` · `left-click` · `right-click`

---

### XFormPillsList

Component: x-form-pills-list — XPillsList wrapped in XFormField for use in forms.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Array | `() => []` |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |
| `isRequired` | Boolean | `false` |  |
| `span` | Number | `8` |  |
| `variant` | String (`pill | chip`) | `'pill'` | Visual variant: 'pill' (rounded) or 'chip' (radius-m, accent border). |
| `color` | String | `'primary'` |  |
| `closable` | Boolean | `true` |  |
| `max` | Number | `null` |  |
| `maxWidth` | Number | `undefined` |  |
| `ellipsis` | Boolean | `false` |  |
| `keyOfLabel` | String | `''` |  |

**Emits**

`update:modelValue` · `delete`

---

### XFormPlainText

Component: x-form-plain-text - Component for plain text in creation form.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | — |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `span` | Number | `8` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |

**Emits**

`update:modelValue`

---

### XFormQuantityInput

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Number | `0` |  |
| `isRequired` | Boolean | — |  |
| `span` | Number | `8` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `true` |  |
| `stepValue` | Number | `1` |  |
| `min` | Number | `Number.NEGATIVE_INFINITY` |  |
| `max` | Number | `Number.POSITIVE_INFINITY` |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `ariaLabel` | String | *(required)* |  |
| `disabled` | Boolean | `false` |  |
| `buttonVisible` | Boolean | `true` |  |

**Emits**

`update:modelValue` · `increase` · `decrease`

---

### XFormRadio

Form-field wrapper around a group of `XRadio` buttons. Renders a labeled radio group from an `options` array. Each option's `value` is automatically passed to the underlying `XRadio`.

**Options shape:** `Array<{ value: string|number, label: string, subLabel?: string, disabled?: boolean }>`
- `value` — **required** on every option; used as `XRadio`'s `value` prop and as the emitted `v-model` value
- `label` — visible text next to the radio button
- `subLabel` — secondary line shown below `label` (only when **all** options have `subLabel`)
- `disabled` — disables that individual radio button

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | `String\|Number` | — | Currently selected value; matched against each option's `value`. |
| `options` | Array | `() => []` | List of radio options. Each item must have `{ value, label }`. See shape above. |
| `label` | String | `''` | Field label shown in the form layout. |
| `labelAlign` | String (`left\|right`) | `'right'` | Alignment of the field label column. |
| `span` | Number | `8` | Column span in the form grid (1–12). |
| `vertical` | Boolean | `false` | Stacks radios vertically instead of horizontally. |
| `isRequired` | Boolean | — | Shows a `*` marker next to the label. |
| `preselect` | Boolean | — | Auto-selects the first option when `options` changes and nothing is selected. |
| `hint` | String | `''` | Helper text shown below the field. |
| `hintType` | String (`info\|warning\|error`) | `'info'` | Icon style of the hint. |
| `hintColor` | String (`default\|primary\|secondary\|success\|warning\|danger\|info`) | `'default'` | Color of the hint text. |
| `hintInline` | Boolean | `false` | Renders the hint inline (next to the field) instead of below it. |

**Emits**

`update:modelValue`

```vue
<XFormRadio
  v-model="form.plan"
  label="Plan"
  :options="[
    { value: 'free',       label: 'Free' },
    { value: 'pro',        label: 'Pro',        subLabel: '$9/mo' },
    { value: 'enterprise', label: 'Enterprise', subLabel: 'Contact us', disabled: true },
  ]"
/>
```

---

### XFormRow

**Slots**

`default`

---

### XFormStringArrayInput

Component: x-form-string-array-input - Component for string array input in creation form.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Array | `() => []` |  |
| `disabled` | Boolean | `false` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `placeholder` | String | `''` |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |
| `ariaLabel` | String | *(required)* |  |
| `isRequired` | Boolean | — |  |
| `span` | Number | `8` |  |
| `iconSrc` | String | `''` |  |
| `iconLeft` | String | — |  |
| `iconRight` | String | — |  |
| `iconLeftColor` | String | — |  |
| `iconRightColor` | String | — |  |
| `iconLeftName` | String | `''` |  |
| `iconRightName` | String | `''` |  |

**Emits**

`blur` · `right-click` · `clear` · `enter` · `left-click` · `focus` · `change` · `update:modelValue`

---

### XFormSwitch

Component: x-form-switch - Component for input in creation form.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Boolean | — |  |
| `items` | Array | `null` |  |
| `vertical` | Boolean | `false` |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `isRequired` | Boolean | — |  |
| `span` | Number | `8` |  |
| `disabled` | Boolean | `false` |  |
| `ariaLabel` | String | *(required)* |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |

**Emits**

`blur` · `focus` · `update:modelValue`

---

### XFormTagInput

Component: x-form-tag-input - Tag input for use inside Form components

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Array | `() => []` |  |
| `placeholder` | String | `''` |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `ariaLabel` | String | *(required)* |  |
| `disabled` | Boolean | `false` |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `isRequired` | Boolean | `false` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |
| `span` | Number | `8` |  |
| `options` | Array | `null` |  |
| `keyOfOption` | String | `'label'` |  |
| `pillColor` | String | `'primary'` |  |
| `iconLeft` | String | `''` |  |
| `iconLeftName` | String | `''` |  |
| `iconLeftColor` | String | `''` |  |
| `iconRight` | String | `''` |  |
| `iconRightName` | String | `''` |  |
| `iconRightColor` | String | `''` |  |

**Emits**

`update:modelValue` · `change`

---

### XFormTextarea

Component: x-form-textarea - Component for textarea in creation form.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | — |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `placeholder` | String | `''` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |
| `isRequired` | Boolean | — |  |
| `span` | Number | `8` |  |
| `ariaLabel` | String | *(required)* |  |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `rows` | Number | `2` |  |
| `disabled` | Boolean | `false` |  |

**Emits**

`blur` · `change` · `clear` · `enter` · `focus` · `input` · `keyup` · `update:modelValue`

---

### XFormTimePicker

Component: x-form-time-picker — XTimePicker wrapped in XFormField for use in forms.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | `''` |  |
| `label` | String | `''` |  |
| `labelAlign` | String | `'right'` |  |
| `hint` | String | `''` |  |
| `hintType` | String (`info | warning | error`) | `'info'` |  |
| `hintColor` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |
| `hintInline` | Boolean | `false` |  |
| `ariaLabel` | String | *(required)* |  |
| `placeholder` | String | `''` |  |
| `disabled` | Boolean | `false` |  |
| `clearable` | Boolean | `true` |  |
| `is24h` | Boolean | `false` | When true — 24-hour clock (00–23). When false — 12-hour clock with AM/PM. |
| `error` | String | `''` |  |
| `forceError` | Boolean | `false` |  |
| `isRequired` | Boolean | `false` |  |
| `span` | Number | `8` |  |

**Emits**

`update:modelValue` · `blur` · `change` · `focus`

---

## Buttons & actions

### XAddAction

Component: x-add-action - Add Action Button A specialized button component for "add" actions, built on top of XButton. Provides backward compatibility with previous version while leveraging XButton's features (theme support, loading states, etc.)

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | String | `''` |  |
| `disabled` | Boolean | `false` |  |
| `icon` | String | `''` | Icon specific svg icon |
| `name` | String | `'plus'` | Icon name from icon library |
| `color` | String (`default | primary | secondary | success | warning | danger | dark | info`) | `''` |  |
| `colorImportant` | Boolean | `false` |  |
| `size` | String | `'40px'` | Size of the button. Values < 40 will render as small button. For precise control, use 'small' prop instead. |
| `type` | String (`primary | secondary | tertiary | neutral`) | `'neutral'` | Button type: 'primary', 'secondary', 'tertiary', 'neutral' |
| `small` | Boolean | `false` | Render button in small size |

**Emits**

`click`

**Slots**

`default`

---

### XAdditionalAction

Component: x-additional-action — Round (default) or Square icon-only action button - variant="round"  (default) — 16×16px circle, primary bg, dark icon, Figma "Round" - variant="square"           — 40×40px rounded square, outlined neutral, Figma "Square"

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `disabled` | Boolean | `false` |  |
| `variant` | String (`round | square`) | `'round'` | Visual variant: 'round' (16px circle) or 'square' (40px outlined square). |
| `icon` | String | `''` | Icon src — inline SVG or path (XIcon :src) |
| `name` | String | `'plus-small'` | Icon name from the solid icon library (XIcon :name) |
| `color` | String (`default | primary | secondary | success | warning | danger | dark | info`) | `''` | Color variant. Tints within the shape of the variant: round  → fill color (replaces primary bg) square → border + text color |
| `type` | String (`neutral | primary | secondary | tertiary`) | `'neutral'` | Button type for square variant: 'neutral', 'primary', 'secondary', 'tertiary'. Ignored for round variant. |
| `size` | String | `'40px'` | Custom size for square variant (px value or number). Values < 40 will render as small. Ignored for round variant. |
| `small` | Boolean | `false` | Render square button in small size (32×32px). Ignored for round variant. |

**Emits**

`click`

**Slots**

`default`

---

### XBasicButton

Component: x-basic-button - Headless base button Encapsulates all shared button behaviour (click guard, disabled, loading, icon, slots). Has no visual styles of its own — styling is done entirely by the consumer via class passed from outside.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `disabled` | Boolean | `false` |  |
| `isLoading` | Boolean | `false` |  |
| `progressCount` | Number | `null` |  |
| `fullWidth` | Boolean | `false` |  |
| `plain` | Boolean | `false` |  |
| `small` | Boolean | `false` |  |
| `iconName` | String | `''` |  |
| `iconSrc` | String | `''` |  |
| `iconColor` | String | `''` | CSS color value passed directly to XIcon. Consumers compute this based on their own type/theme logic. |
| `spinnerColor` | String | `''` | Semantic color name for the loading spinner (passed to XProgressCircular). Accepts: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'dark' | 'info' | 'light' | 'neutral' Falls back to iconColor when not provided. |
| `iconSize` | String | `'var(--icon-size)'` | Explicit icon size (height & width) passed to XIcon. Defaults to 'var(--icon-size)' (XIcon default). Use a CSS value like 'var(--icon-size-xs)' or '10px'. |

**Emits**

`click`

**Slots**

`default` · `icon`

---

### XButton

Component: x-button - Button Built on XBasicButton. Adds type-based styling (primary/secondary/tertiary/neutral) and theme-aware icon colour computation.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `disabled` | Boolean | `false` |  |
| `type` | String (`primary | secondary | tertiary | neutral`) | `'primary'` |  |
| `isLoading` | Boolean | `false` |  |
| `progressCount` | Number | `null` |  |
| `fullWidth` | Boolean | `false` |  |
| `plain` | Boolean | `false` |  |
| `small` | Boolean | `false` |  |
| `iconName` | String | `''` |  |
| `iconSrc` | String | `''` |  |
| `color` | String (`default | primary | secondary | success | warning | danger | dark | info`) | `''` |  |

**Emits**

`click`

**Slots**

`default` · `icon`

---

### XContextButton

Component: x-context-button - Context Button Compact button (32px height) for context actions. Built on XBasicButton with three visual types that map to Figma column 2: - primary   → Outlined Tinted  (primary border + primary text/icon) - secondary → Outlined Neutral (neutral border + neutral text/icon) - tertiary  → Ghosted          (no border, transparent, neutral text/icon)

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `type` | String (`primary | secondary | tertiary`) | `'primary'` |  |
| `disabled` | Boolean | `false` |  |
| `isLoading` | Boolean | `false` |  |
| `progressCount` | Number | `null` |  |
| `fullWidth` | Boolean | `false` |  |
| `plain` | Boolean | `false` |  |
| `small` | Boolean | `false` |  |
| `iconName` | String | `''` |  |
| `iconSrc` | String | `''` |  |
| `color` | String (`default | primary | secondary | success | warning | danger | dark | info`) | `''` |  |

**Emits**

`click`

**Slots**

`default` · `icon`

---

### XContextMultiActionsButton

Component: x-context-multi-actions-button - Context button with dropdown list of actions Same structure as XMultiActionButton but uses XContextButton (32px, context styles) instead of XButton (36px, main styles). Types: primary (Outlined Tinted), secondary (Outlined Neutral), tertiary (Ghosted)

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `type` | String (`primary | secondary | tertiary`) | `'primary'` |  |
| `color` | String (`default | primary | secondary | success | warning | danger | dark | info`) | `''` |  |
| `disabled` | Boolean | `false` |  |
| `fullWidth` | Boolean | `false` |  |
| `actions` | Array | `() => []` | dropdown props |
| `selectedAction` | String | `''` |  |
| `closeOnContentClick` | Boolean | `true` |  |
| `placement` | String (`top | top-start | top-end | right-start | right | right-end | bottom-start | bottom | bottom-end | left-start | left | left-end | auto`) | `'bottom-end'` |  |
| `chevronPosition` | String (`left | right`) | `'right'` |  |
| `isMobile` | Boolean | `false` | mobile modal props |
| `title` | String | `''` |  |

**Emits**

`on-action`

**Slots**

`default`

---

### XIconButton

Color variant. Tints within the shape of the type: primary → colored icon + colored tint bg on hover/active section → colored border + icon on hover/active

---

### XMultiActionButton

Component: x-multi-action-button - Button with dropdown list of actions Renamed from XMultiactionButton (correct casing). Adds neutral type support. XMultiactionButton is kept as a deprecated backward-compat alias in src/index.js.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `type` | String (`primary | secondary | tertiary | neutral`) | `'primary'` | XButton props |
| `color` | String (`default | primary | secondary | success | warning | danger | dark | info`) | `''` |  |
| `outlined` | Boolean | `false` | backward compat: outlined=true → type="secondary" |
| `disabled` | Boolean | `false` |  |
| `fullWidth` | Boolean | `false` |  |
| `actions` | Array | `() => []` | dropdown props |
| `selectedAction` | String | `''` |  |
| `closeOnContentClick` | Boolean | `true` |  |
| `placement` | String (`top | top-start | top-end | right-start | right | right-end | bottom-start | bottom | bottom-end | left-start | left | left-end | auto`) | `'bottom-end'` |  |
| `chevronPosition` | String (`left | right`) | `'right'` |  |
| `isMobile` | Boolean | `false` | mobile modal props |
| `title` | String | `''` |  |

**Emits**

`on-action`

**Slots**

`default`

---

### XTextButton

Component: x-text-button - Text-style button without background

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `disabled` | Boolean | `false` |  |

**Slots**

`default`

---

## Feedback & status

### XEmptyState

Component: x-empty-state - Component for empty state display

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `title` | String | *(required)* |  |
| `subTitle` | String | `''` |  |
| `iconSrc` | String | `''` |  |
| `iconName` | String | `''` |  |
| `iconColor` | String | `'var(--icon-color)'` |  |
| `iconSize` | String | `'var(--icon-size-huge)'` |  |
| `centered` | Boolean | `false` |  |

**Slots**

`default`

---

### XErrorTooltip

Component: x-error-tooltip - Component for display error in tooltip

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `visible` | Boolean | `false` |  |
| `referenceElement` | HTMLElement | `null` |  |

**Slots**

`default`

---

### XFullAreaSpinner

Component: x-full-area-spinner - Component for displaying loader and disable component

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `active` | Boolean | `false` |  |

---

### XInfoBox

Component: x-info-box - Component for displaying informational messages

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `type` | String (`info | warning | error`) | `'info'` |  |
| `color` | String (`default | primary | secondary | success | warning | danger | info`) | `'default'` |  |

**Slots**

`default`

---

### XMessage

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `type` | String (`default | info | success | warning | danger`) | `'default'` |  |
| `title` | String | `''` |  |
| `showIcon` | Boolean | `true` |  |

**Slots**

`default`

---

### XNoMatchItems

Component: x-no-match-items - Component for no match items in XSearch

---

### XNotifications

Component: x-notifications - Component for global notifications

---

### XNotificationsCounter

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `counter` | Number | `0` |  |
| `color` | String (`default | primary | secondary | success | danger | warning | info`) | `'default'` |  |
| `maxValue` | Number | `0` |  |

**Emits**

`click`

---

### XProgress

Component: x-progress - Loading overlay with spinner

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `active` | Boolean | `false` |  |
| `isFullPage` | Boolean | `true` |  |
| `size` | String (`tiny | small | medium | large`) | `'small'` |  |
| `color` | String (`primary | secondary | success | warning | danger | dark | info`) | `'primary'` |  |

---

### XProgressCircular

Component: x-progress-circular - Component for ....

---

### XSkeletonLoader

Component: x-skeleton-loader - Skeleton loading placeholder

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `height` | String | `'auto'` |  |
| `width` | String | `'auto'` |  |
| `radius` | String | `'var(--radius-m)'` |  |
| `rounded` | Boolean | `false` |  |
| `color` | String | `'var(--color-skeleton)'` |  |
| `boxShadow` | String | `'none'` |  |
| `animation` | String (`fade | wave | pulse | pulse-x | pulse-y`) | `'wave'` |  |
| `innerPadding` | String | `'o'` |  |

**Slots**

`default`

---

### XTooltip

Component: x-tooltip

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `content` | String | *(required)* |  |
| `indent` | Number | `5` |  |
| `indentY` | Number | `0` |  |
| `position` | String (`top | top-start | top-end | right-start | right | right-end | bottom-start | bottom | bottom-end | left-start | left | left-end | auto`) | `'bottom'` |  |
| `disable` | Boolean | `false` |  |

**Slots**

`default`

---

## Overlays & containers

### XAccordion

Component: x-accordion - Component for standard accordion behavior

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `isExpand` | Boolean | `false` |  |
| `withBackground` | Boolean | `false` |  |

**Emits**

`toggle-expand`

**Slots**

`title` · `sub-title` · `content`

---

### XExpandCard

Component: x-expand-card - Component for standard accordion behavior

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `isActive` | Boolean | `false` |  |
| `isExpand` | Boolean | `false` |  |
| `withBackground` | Boolean | `false` |  |
| `quantity` | Number | `0` |  |
| `cardIcon` | String | `''` |  |
| `cardIconName` | String | `''` |  |

**Emits**

`card-click`

**Slots**

`title` · `content`

---

### XModal

Component: x-modal - Modal Component

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `visible` | Boolean | `false` |  |
| `showClose` | Boolean | `false` |  |
| `beforeClose` | Function | `null` |  |
| `fullscreen` | Boolean | `false` |  |
| `alignCenter` | Boolean | `true` |  |
| `maxWidth` | Number | `655` |  |
| `innerPadding` | String | `'l'` |  |
| `innerPaddingCloseBtn` | String | `''` |  |
| `closeOnClickOutsideModal` | Boolean | `true` |  |

**Emits**

`close`

**Slots**

`title` · `default` · `footer`

---

### XPopper

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `placement` | String (`top | top-start | top-end | right | right-start | right-end | bottom | bottom-start | bottom-end | left | left-start | left-end | auto`) | `'auto'` |  |
| `visible` | Boolean | `false` |  |
| `offset` | Array | `() => [0, 5]` |  |
| `appendToBody` | Boolean | `true` |  |
| `autoWidth` | Boolean | `false` |  |
| `strictWidth` | Boolean | `false` |  |
| `preventOff` | Boolean | `false` |  |
| `referenceElement` | Object | `null` |  |

**Emits**

`change`

**Slots**

`default`

---

## Data display

### XBreadcrumbs

Component: x-breadcrumbs - Component for displaying and generating breadcrumbs

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `breadcrumbs` | Array | *(required)* |  |

---

### XChip

Component: x-chip Chip/tag component (border-radius: var(--radius-m), accent borders). Wraps XPillBasic with chip-specific color tokens and size vocabulary.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `color` | String (`primary | secondary | dark | info | success | warning | danger | inactive | neutral`) | `'primary'` |  |
| `size` | String (`xs | sm | md`) | `'sm'` |  |
| `closable` | Boolean | `false` |  |
| `clickable` | Boolean | `false` |  |
| `disabled` | Boolean | `false` |  |
| `icon` | String | `''` |  |
| `iconName` | String | `''` |  |
| `iconRight` | String | `''` |  |
| `iconRightName` | String | `''` |  |
| `ellipsis` | Boolean | `false` |  |
| `maxWidth` | Number | `undefined` |  |

**Emits**

`click` · `close`

**Slots**

`default`

---

### XDateFilter

Component: x-date-filter - Component for filter of date value

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `filter` | Object | *(required)* |  |
| `index` | Number | *(required)* |  |

**Emits**

`handle-change-value`

---

### XDateRangeFilter

Component: x-date-range-filter - Component for filter of date value

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `filter` | Object | *(required)* |  |
| `index` | Number | *(required)* |  |

**Emits**

`handle-change-value`

---

### XEditView

Component: x-edit-view - Component for ....

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `disabled` | Boolean | `false` |  |
| `isEdit` | Boolean | `false` |  |
| `actionsReferenceElementId` | String | `''` |  |
| `actionsOffset` | Array | `() => [0, 10]` |  |

**Emits**

`save` · `discard`

**Slots**

`view` · `edit`

---

### XFilters

Component: x-filters - Component for display and interact with filters

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `filters` | Array | `() => []` |  |
| `isMobile` | Boolean | `false` |  |

**Emits**

`handle-change-filter` · `handle-reset-filters`

---

### XHeader

Component: x-header - Header of the page

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `title` | String | `''` |  |
| `subTitle` | String | `''` |  |
| `breadcrumbs` | Array | `() => []` |  |

**Slots**

`default`

---

### XList

Component: x-list - Component for ....

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `fullWidth` | Boolean | `false` |  |
| `unBoarded` | Boolean | `false` |  |

**Slots**

`default`

---

### XListActions

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `isMobile` | Boolean | `false` |  |
| `actions` | Array | `() => []` |  |
| `placement` | String | `'bottom-end'` |  |

**Emits**

`handle-emit` · `close`

---

### XListFilter

Component: x-list-filter - Component for filter of list values

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `filter` | Object | *(required)* |  |
| `index` | Number | *(required)* |  |

**Emits**

`handle-change-value`

---

### XListItem

Component: x-list-item — dropdown / list item Variants (auto via CSS :first-child / :last-child): - Element Top Rounded    → first child: top corners rounded, pt: 24px - Element Bottom Rounded → last child:  bottom corners rounded, pb: 24px - Element All Rounded    → only child:  all corners rounded - Element Default        → middle items: no rounding

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `disabled` | Boolean | `false` |  |
| `selected` | Boolean | `false` |  |
| `active` | Boolean | `false` |  |
| `value` | Object | `undefined` |  |
| `ellipsis` | Boolean | `false` |  |
| `icon` | String | `''` | Left icon — inline SVG string |
| `name` | String | `''` | Left icon — name of icon |
| `description` | String | `''` | Secondary description text rendered below the label |
| `header` | Boolean | `false` | Header variant — renders an uppercase section label, non-interactive |

**Emits**

`click`

**Slots**

`default`

---

### XLocalizedList

Component: x-localized-list - Component for display and interact with field localized list

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Object | `() => ({})` |  |
| `defaultLocale` | String | *(required)* |  |
| `error` | String | `''` |  |
| `status` | String (`default | error | updating`) | `'default'` |  |
| `disabled` | Boolean | `false` |  |

**Emits**

`update:modelValue`

---

### XPill

Component: x-pill Pill-shaped tag component (border-radius: 999px, muted borders). Wraps XPillBasic with pill-specific color tokens and size vocabulary.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `color` | String (`primary | secondary | dark | info | success | warning | warning-subtle | danger`) | `'primary'` |  |
| `size` | String (`sm | md | lg`) | `'sm'` |  |
| `disabled` | Boolean | `false` |  |
| `closable` | Boolean | `false` |  |
| `clickable` | Boolean | `false` |  |
| `icon` | String | `''` |  |
| `iconName` | String | `''` |  |
| `iconRight` | String | `''` |  |
| `iconRightName` | String | `''` |  |
| `ellipsis` | Boolean | `false` |  |
| `maxWidth` | Number | `undefined` |  |

**Emits**

`click` · `close`

**Slots**

`default`

---

### XPillBasic

Component: XPillBasic Base component with all shared pill/chip logic. XPill and XChip are thin wrappers over this component.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `componentClass` | String | *(required)* | BEM block class prefix — e.g. "x-pill" or "x-chip". Controls which CSS rules apply. |
| `colorMap` | Object | *(required)* | Icon color map per theme. Shape: { light: { [color]: token }, dark: { [color]: token } } |
| `color` | String | `'primary'` |  |
| `size` | String | `'sm'` |  |
| `closable` | Boolean | `false` |  |
| `clickable` | Boolean | `false` |  |
| `disabled` | Boolean | `false` |  |
| `icon` | String | `''` |  |
| `iconName` | String | `''` |  |
| `iconRight` | String | `''` |  |
| `iconRightName` | String | `''` |  |
| `ellipsis` | Boolean | `false` |  |
| `maxWidth` | Number | `undefined` |  |

**Emits**

`click` · `close`

**Slots**

`default`

---

### XPillsList

Component: x-pills-list - List of pills or chips with optional remove functionality.

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | Array | *(required)* |  |
| `label` | String | — |  |
| `max` | Number | `null` |  |
| `closable` | Boolean | `true` |  |
| `color` | String | `'primary'` |  |
| `maxWidth` | Number | — |  |
| `ellipsis` | Boolean | `false` |  |
| `keyOfLabel` | String | `''` |  |
| `variant` | String (`pill | chip`) | `'pill'` | Visual variant: 'pill' (rounded, muted borders) or 'chip' (radius-m, accent borders). |

**Emits**

`delete` · `update:modelValue`

---

### XSortControl

Component: x-sort-control - Sort/filter control with popover dropdown

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | String | *(required)* |  |
| `modelValue` | String | `null` |  |
| `placeholder` | String | `'Select...'` |  |
| `hideByChange` | Boolean | `false` |  |
| `clearable` | Boolean | `true` |  |
| `labelColor` | String | `'var(--neutral-4)'` |  |
| `options` | Array | `() => []` |  |
| `placement` | String (`top | top-start | top-end | right-start | right | right-end | bottom-start | bottom | bottom-end | left-start | left | left-end | auto`) | `'bottom-end'` |  |

**Emits**

`update:modelValue` · `select`

**Slots**

`default`

---

### XTable

Component: x-table - Component for Table wrapper

**Slots**

`default`

---

### XTableHeader

Component: x-table-header - Component for entity listing header

**Slots**

`left` · `right`

---

### XTableRow

Component: x-table-row - Component for table row

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `first` | Boolean | `false` |  |
| `last` | Boolean | `false` |  |

**Emits**

`click`

**Slots**

`default`

---

### XTableValue

Component: x-table-value - Component for value with label in table row

**Slots**

`label` · `value`

---

### XTabs

Component: x-tabs - Responsive tab bar with dropdown fallback

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `modelValue` | String | `''` |  |
| `tabs` | Array | *(required)* |  |
| `color` | String | `'primary'` |  |
| `bounce` | Boolean | `true` | Enables rubber-band (overshoot) easing on the sliding indicator. When false, uses a smooth ease-out instead. |

**Emits**

`update:modelValue`

---

## Utilities & misc

### XCol

Component: x-col - Component for column

---

### XIcon

---

### XOrganizationItemWithType

Component: x-organization-item-with-type - Component for single organization list item

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `name` | String | *(required)* |  |
| `addressLine` | String | `''` |  |
| `type` | { | `''` |  |

---

### XOrganizationOption

Component: x-organization-option - Component for displaying organization option in XSearch

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `name` | String | *(required)* |  |
| `isTopLevel` | Boolean | *(required)* |  |
| `selected` | Boolean | *(required)* |  |
| `addressLine` | String | `''` |  |
| `subTitle` | String | `''` |  |

---

### XP

Component: x-p - Paragraph component

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `size` | String (`large | medium | small`) | `'large'` |  |
| `color` | String (`light | dark`) | `'dark'` |  |

**Slots**

`default`

---

### XProductItem

Component: x-product-item - Component for displaying a product option in dropdowns/search

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `name` | String | `''` |  |
| `maName` | String | `''` |  |
| `hasConfig` | Boolean | `false` |  |
| `sku` | String | `''` |  |
| `maId` | String | `''` |  |
| `selected` | Boolean | *(required)* |  |

---

### XRow

Component: x-form-row - Component for row in grid system

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `noMargin` | Boolean | `false` |  |
| `smallMargin` | Boolean | `false` |  |

**Slots**

`default`

---

### XSelectEntityItem

Component: x-select-entity-item - Single entity item with title, optional subtitle and selected state

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `title` | String | *(required)* |  |
| `subtitle` | String | `''` |  |
| `selected` | Boolean | *(required)* |  |

---

### XSliderButton

---

### XSliderDot

---

### XUserOption

Component: x-user-option - Component for displaying organization option in XSearch

**Props**

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `name` | String | *(required)* |  |
| `selected` | Boolean | *(required)* |  |
| `role` | String | `''` |  |

---
