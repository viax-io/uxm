# [2.10.0](https://gitlab.viax.tech/services-viax/uxm/compare/v2.9.1...v2.10.0) (2026-07-07)


### Bug Fixes

* **popover:** keep open on clicks inside nested floating layers ([264ceea](https://gitlab.viax.tech/services-viax/uxm/commit/264ceeac273937239406e689e213cfbb0c34bb46))


### Features

* **brand-settings:** pick token colors with ColorInputPopover ([cd2604b](https://gitlab.viax.tech/services-viax/uxm/commit/cd2604b14890cec12adb1a92b8cc69411ba8d5e7))
* **color-input:** add ColorInput and ColorInputPopover atoms ([e2ffe9f](https://gitlab.viax.tech/services-viax/uxm/commit/e2ffe9feeb73d34c5476369e5c8bf592051653ce)), closes [#rrggbbaa](https://gitlab.viax.tech/services-viax/uxm/issues/rrggbbaa)
* **icons:** add eyedropper glyph ([fb11a09](https://gitlab.viax.tech/services-viax/uxm/commit/fb11a09e63b5538c8100ba4157e1fb56c7139f5d))
* **studio:** register Color Input preview and knobs ([338206a](https://gitlab.viax.tech/services-viax/uxm/commit/338206ad05d7daef20960ac18226de8c9ff2eef1))

## [2.9.1](https://gitlab.viax.tech/services-viax/uxm/compare/v2.9.0...v2.9.1) (2026-07-06)


### Bug Fixes

* resolve all critical and warning findings from project audit ([172ebdb](https://gitlab.viax.tech/services-viax/uxm/commit/172ebdbfb35970107ec59f42836068df88bebc08))

# [2.9.0](https://gitlab.viax.tech/services-viax/uxm/compare/v2.8.0...v2.9.0) (2026-07-03)


### Bug Fixes

* **button:** route geometry/type knobs through --uxm vars ([d393c98](https://gitlab.viax.tech/services-viax/uxm/commit/d393c98a4bc7822ac5d386cb8cdc24ef26caacde))
* **card:** route colour/geometry knobs through --uxm vars ([45180fc](https://gitlab.viax.tech/services-viax/uxm/commit/45180fc0e07d7ecf5d0fb8ab7c4c70f63113a61e))
* **data-table:** cell-padding knobs work in every density; radius via var ([70fa741](https://gitlab.viax.tech/services-viax/uxm/commit/70fa7410102c8abcbb008e791aa836524e401317))
* **editable-cell:** mask the number editor's input per keystroke ([3fdede2](https://gitlab.viax.tech/services-viax/uxm/commit/3fdede2fef98733736278bef1b919c1dbe500c23))
* **editable-cell:** number editor uses text + inputMode, not native number input ([98d291e](https://gitlab.viax.tech/services-viax/uxm/commit/98d291e5cc97cdf42256db6ea8e02b4baf767960))
* **input-with-icon:** use the shared clear affordance (atomize the ✕) ([bca0eb9](https://gitlab.viax.tech/services-viax/uxm/commit/bca0eb9b69d5c15ab8792a5d527e4f014db32237))
* **listbox:** selected option shows its colour on open, not after mouse-move ([7be2b75](https://gitlab.viax.tech/services-viax/uxm/commit/7be2b75c21ec57b09501bf33ea9b6e808dd35dff))
* **studio:** drop stale --lc-* mapping so lifecycle-connector knobs persist ([f30e9fa](https://gitlab.viax.tech/services-viax/uxm/commit/f30e9faa902f05e1e123295b9fe0ef90eb23cda7))
* **studio:** previews exercise the real error prop + border knob var ([c5d6c46](https://gitlab.viax.tech/services-viax/uxm/commit/c5d6c468d9b674e6307ba18f0723f41f1a70bb12))
* **toggle-switch:** revive dead resting-state + disabled knobs ([78edabc](https://gitlab.viax.tech/services-viax/uxm/commit/78edabc8b239343123cefb13ef9d1f5290088841))
* **uxm:** route knob-backed props through --uxm vars + revive dead knobs (sweep) ([0765996](https://gitlab.viax.tech/services-viax/uxm/commit/0765996f9ec160f6cbd404649afe73bfccc823f0))


### Features

* **input-with-icon:** port error state so its error knobs work ([d0e614c](https://gitlab.viax.tech/services-viax/uxm/commit/d0e614c67ce2d5250f66f14c4acd1b5bb0f35702))
* **number-input:** add clear (✕) button + error state (parity with modo) ([9bdfef7](https://gitlab.viax.tech/services-viax/uxm/commit/9bdfef7186bdcc958b7389ccce7cc572fb7dda4a))
* **ui:** link every FieldError to its control via aria-describedby ([455879d](https://gitlab.viax.tech/services-viax/uxm/commit/455879dca499ea68da3acd6060f9d5bb569b7908))

# [2.8.0](https://gitlab.viax.tech/services-viax/uxm/compare/v2.7.0...v2.8.0) (2026-07-01)


### Features

* **ui:** add error state to Checkbox, RadioGroup and ToggleSwitch ([c14f3c9](https://gitlab.viax.tech/services-viax/uxm/commit/c14f3c9dda429a381b94cc308e9c00798d0677ea))
* **ui:** align file-upload page-error prop with the input family ([885fa34](https://gitlab.viax.tech/services-viax/uxm/commit/885fa3478a04b8bf9b2ec6b35606c30b6e1ff53e))

# [2.7.0](https://gitlab.viax.tech/services-viax/uxm/compare/v2.6.0...v2.7.0) (2026-07-01)


### Bug Fixes

* **studio:** keep the properties panel white for text contrast ([1ace2b8](https://gitlab.viax.tech/services-viax/uxm/commit/1ace2b8cf8df83bcf9985118574e2b32dc34f6fd)), closes [#F2F1F0](https://gitlab.viax.tech/services-viax/uxm/issues/F2F1F0)
* **studio:** render all five Editable Cell types in the preview ([76ab019](https://gitlab.viax.tech/services-viax/uxm/commit/76ab01918723c61e67c362d3e8c1e1ba4f8e234f))


### Features

* **ui:** add Clearable (✕) to TextInput and Textarea ([6798a74](https://gitlab.viax.tech/services-viax/uxm/commit/6798a74f07ba639aee641e10fcbe315973c5f466))
* **ui:** add Progress Bar — determinate Feedback atom (linear + ring) ([72f033f](https://gitlab.viax.tech/services-viax/uxm/commit/72f033f144ef0341adaec5c55fd90ba138446c2a))

# [2.6.0](https://gitlab.viax.tech/services-viax/uxm/compare/v2.5.4...v2.6.0) (2026-06-29)


### Features

* **ui:** port Menu, BulkActionBar, ButtonDanger, DataTable rowActions, Listbox shadow ([2ca363e](https://gitlab.viax.tech/services-viax/uxm/commit/2ca363ef55ec8afd5d2c58c88faa50b36e9f76e6))

## [2.5.4](https://gitlab.viax.tech/services-viax/uxm/compare/v2.5.3...v2.5.4) (2026-06-25)


### Bug Fixes

* **studio:** render optional headerActions slot in the canvas top bar ([65edf0b](https://gitlab.viax.tech/services-viax/uxm/commit/65edf0bda7b31c879d95dcec0e801ac7ed245e75))

## [2.5.3](https://gitlab.viax.tech/services-viax/uxm/compare/v2.5.2...v2.5.3) (2026-06-23)


### Bug Fixes

* **studio:** recompute the accent ramp from any edited accent colour ([3713d01](https://gitlab.viax.tech/services-viax/uxm/commit/3713d01cfebc83b170218e63df77f7e56dbc9038))

## [2.5.2](https://gitlab.viax.tech/services-viax/uxm/compare/v2.5.1...v2.5.2) (2026-06-18)


### Bug Fixes

* **studio:** revert the Brand Settings colour picker to the native input ([e59d13d](https://gitlab.viax.tech/services-viax/uxm/commit/e59d13d04e36e6c319cf9148a93a7efbab534026))

## [2.5.1](https://gitlab.viax.tech/services-viax/uxm/compare/v2.5.0...v2.5.1) (2026-06-18)


### Bug Fixes

* **studio:** replace the unsuccessful hex-text picker with a real ColorPicker ([bc6cdee](https://gitlab.viax.tech/services-viax/uxm/commit/bc6cdee00b1869372ead5a459798eb47d8754628))

# [2.5.0](https://gitlab.viax.tech/services-viax/uxm/compare/v2.4.1...v2.5.0) (2026-06-18)


### Features

* **studio:** hex-only colour popover for brand token rows ([f298a4a](https://gitlab.viax.tech/services-viax/uxm/commit/f298a4acf8ce1da5a87db9f938135e1ac8a4f8bf))

## [2.4.1](https://gitlab.viax.tech/services-viax/uxm/compare/v2.4.0...v2.4.1) (2026-06-18)


### Bug Fixes

* **studio:** paint colour-picker swatches from live token vars, not static defaults ([253b649](https://gitlab.viax.tech/services-viax/uxm/commit/253b649799f8827aa210f15e673fc7e8c2dca2dc))

# [2.4.0](https://gitlab.viax.tech/services-viax/uxm/compare/v2.3.4...v2.4.0) (2026-06-17)


### Features

* **ui:** read per-component and per-state CSS vars across atoms for portal studio theming ([8c78e84](https://gitlab.viax.tech/services-viax/uxm/commit/8c78e8455db7ee54cd62af62ea7dd21042341d1c))

## [2.3.4](https://gitlab.viax.tech/services-viax/uxm/compare/v2.3.3...v2.3.4) (2026-06-17)


### Bug Fixes

* **studio:** tune portal sidebar header padding ([6c44378](https://gitlab.viax.tech/services-viax/uxm/commit/6c443788f98b633d621965f9dd72a7dae074ab6a))

## [2.3.3](https://gitlab.viax.tech/services-viax/uxm/compare/v2.3.2...v2.3.3) (2026-06-16)


### Bug Fixes

* **studio:** recover brand preview images on error; add brand mark to sidebar header ([e7caeb8](https://gitlab.viax.tech/services-viax/uxm/commit/e7caeb8f934ba0714991139bbbc59282d10fdf66))

## [2.3.2](https://gitlab.viax.tech/services-viax/uxm/compare/v2.3.1...v2.3.2) (2026-06-16)


### Bug Fixes

* **portal:** add light/dark theme toggle + keep brand assets visible ([5e816e9](https://gitlab.viax.tech/services-viax/uxm/commit/5e816e9a86e799e213572e32036ca90300f26d72))

## [2.3.1](https://gitlab.viax.tech/services-viax/uxm/compare/v2.3.0...v2.3.1) (2026-06-16)


### Bug Fixes

* **portal:** default VIAX brand assets + working asset substitution ([322791a](https://gitlab.viax.tech/services-viax/uxm/commit/322791a9adf946a03ac8f14c87cd8b9e66ddd7d4))

# [2.3.0](https://gitlab.viax.tech/services-viax/uxm/compare/v2.2.1...v2.3.0) (2026-06-16)


### Features

* **calendar:** add today button + configurable soft shadow ([f0593a8](https://gitlab.viax.tech/services-viax/uxm/commit/f0593a8e2f605afb6a5a425822ad14f16ce619f6))
* **date-input,time-input:** open picker on focus (type-or-pick) ([f958fd5](https://gitlab.viax.tech/services-viax/uxm/commit/f958fd542585af073535b880954a2ec9e1bf35b3))
* **editable-cell,data-table:** add date/select/multiselect editors + hover-tooltip wiring ([d37cfd7](https://gitlab.viax.tech/services-viax/uxm/commit/d37cfd77019f8e9f2a443cbe61023ac391e67ea6))
* **hover-tooltip:** add primitive that reveals truncated values on hover ([310fcdb](https://gitlab.viax.tech/services-viax/uxm/commit/310fcdb9a42113dfb469a252a64b86107b400976))
* **listbox,select:** cap dropdown panel width, auto-search threshold, truncate long labels ([6aef6ff](https://gitlab.viax.tech/services-viax/uxm/commit/6aef6ff7e72d3e9fda5354a3267fdc16ed287430))
* **popover:** fix first-open positioning + cap width (maxWidth, matchAnchorWidth "min") ([8d9cc0e](https://gitlab.viax.tech/services-viax/uxm/commit/8d9cc0e0866422a52bad9b1ff9aa2af6c87f1efd))

## [2.2.1](https://gitlab.viax.tech/services-viax/uxm/compare/v2.2.0...v2.2.1) (2026-06-14)


### Bug Fixes

* **studio:** stable read-only persistence default + flex layout for demo banner ([21d95e5](https://gitlab.viax.tech/services-viax/uxm/commit/21d95e5a26b1d946f94899ac3addd02365858f77))

# [2.2.0](https://gitlab.viax.tech/services-viax/uxm/compare/v2.1.0...v2.2.0) (2026-06-14)


### Features

* **studio:** expose generateOverridesCss via ./studio/generate-css subpath ([1ec0884](https://gitlab.viax.tech/services-viax/uxm/commit/1ec088472a09c40abb7c0620c412a6a4738f6de9))

# [2.1.0](https://gitlab.viax.tech/services-viax/uxm/compare/v2.0.0...v2.1.0) (2026-06-14)


### Features

* **studio:** add @viax/uxm/studio workbench + build:modo/dev:modo portal ([64328a2](https://gitlab.viax.tech/services-viax/uxm/commit/64328a226cc4d531670c88112ba725d4db2645bf))
* **studio:** compile portal from src for live HMR in dev:modo ([c7cd62f](https://gitlab.viax.tech/services-viax/uxm/commit/c7cd62fc98cf1ff19084a1affd3a88bcd09d8582))

# [2.0.0](https://gitlab.viax.tech/services-viax/uxm/compare/v1.6.0...v2.0.0) (2026-06-11)


* feat(banner,number-stepper)!: remove Alert; rename NumberField to NumberStepper ([df1b019](https://gitlab.viax.tech/services-viax/uxm/commit/df1b0194cfd10677ee3134edc6de9791ccb70f61))


### BREAKING CHANGES

* Alert and NumberField are removed from @viax/uxm/ui.

Migration:
- <Alert ...> → <Banner ...> (drop-in: same variant/title/icon/children;
  optionally adopt onDismiss). CSS vars --uxm-alert-* →
  --uxm-banner-{variant}-{bg|text|border} (per-variant tokens).
  Class names .uxm-alert* → .uxm-banner*.
- <NumberField ...> → <NumberStepper ...> (same props; new optional
  error). CSS vars --uxm-number-field-* → --uxm-number-stepper-*.
  Class names .uxm-number-field* → .uxm-number-stepper*.
- Previews: AlertPreview removed (use BannerPreview);
  NumberFieldPreview → NumberStepperPreview.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>

# [1.6.0](https://gitlab.viax.tech/services-viax/uxm/compare/v1.5.1...v1.6.0) (2026-06-11)


### Features

* **search-dropdown,pill-select,time-input:** finish the Listbox/Popover wave ([7c716c3](https://gitlab.viax.tech/services-viax/uxm/commit/7c716c38295441696bd3782bb7bf7fdb7c70745d))

## [1.5.1](https://gitlab.viax.tech/services-viax/uxm/compare/v1.5.0...v1.5.1) (2026-06-11)


### Bug Fixes

* **time-input:** align popover-row selected defaults with Listbox option tokens ([8426ece](https://gitlab.viax.tech/services-viax/uxm/commit/8426ece884ded7f4f4f4d6e66cc60003264fc994))

# [1.5.0](https://gitlab.viax.tech/services-viax/uxm/compare/v1.4.0...v1.5.0) (2026-06-11)


### Features

* **select,input,field-error:** migrate Select to Listbox; add input error states ([d6bce2f](https://gitlab.viax.tech/services-viax/uxm/commit/d6bce2f500a2284268bd7a14411dcde9b2544110))

# [1.4.0](https://gitlab.viax.tech/services-viax/uxm/compare/v1.3.1...v1.4.0) (2026-06-11)


### Features

* **banner,editable-cell,data-table:** port Banner, EditableCell, DataTable editing ([ade1b1e](https://gitlab.viax.tech/services-viax/uxm/commit/ade1b1e6d86281581d31721279893c6d589b507d))

## [1.3.1](https://gitlab.viax.tech/services-viax/uxm/compare/v1.3.0...v1.3.1) (2026-06-10)


### Bug Fixes

* **previews:** export Toast/Modal/Listbox previews from the previews barrel ([2ea360b](https://gitlab.viax.tech/services-viax/uxm/commit/2ea360b72a9ecd8509bc07e3304054cd27fc4a6d))

# [1.3.0](https://gitlab.viax.tech/services-viax/uxm/compare/v1.2.0...v1.3.0) (2026-06-10)


### Features

* **popover,listbox:** add Popover shell + Listbox/MultiListbox dropdowns ([5e211f2](https://gitlab.viax.tech/services-viax/uxm/commit/5e211f24ce6d326db0a76a958632bbf6b216a3f7))

# [1.2.0](https://gitlab.viax.tech/services-viax/uxm/compare/v1.1.0...v1.2.0) (2026-06-10)


### Features

* **dialog,modal:** add Dialog shell + Modal surface atom ([69fb4c5](https://gitlab.viax.tech/services-viax/uxm/commit/69fb4c5509af9dadc5858b252cf8819e64d2c2f5))

# [1.1.0](https://gitlab.viax.tech/services-viax/uxm/compare/v1.0.9...v1.1.0) (2026-06-10)


### Features

* **toast:** add Toast atom + Toaster + imperative toast.* API ([0d97b55](https://gitlab.viax.tech/services-viax/uxm/commit/0d97b555700d2d45079d03f5c1149b74d0ec2b79))

## [1.0.9](https://gitlab.viax.tech/services-viax/uxm/compare/v1.0.8...v1.0.9) (2026-06-03)


### Bug Fixes

* **migrate previews into @viax/uxm with lint-clean baseline:** migrate previews into @viax/uxm ([18a06b0](https://gitlab.viax.tech/services-viax/uxm/commit/18a06b0b55e7272f28c659f5cdc456c6e81613ff))

## [1.0.8](https://gitlab.viax.tech/services-viax/uxm/compare/v1.0.7...v1.0.8) (2026-06-02)


### Bug Fixes

* **sync changes from modo:** sync changes from modo ([d9f0f41](https://gitlab.viax.tech/services-viax/uxm/commit/d9f0f414818daf51c0b202c326c02f973ec5e7a1))

## [1.0.7](https://gitlab.viax.tech/services-viax/uxm/compare/v1.0.6...v1.0.7) (2026-05-28)


### Bug Fixes

* **fix yml:** fix yml ([7a743bd](https://gitlab.viax.tech/services-viax/uxm/commit/7a743bddaaeba1dadd42a1cefd4ff391eaaf1fbf))

## [1.0.6](https://gitlab.viax.tech/services-viax/uxm/compare/v1.0.5...v1.0.6) (2026-05-28)


### Bug Fixes

* **fix package:** fix package ([dc8994b](https://gitlab.viax.tech/services-viax/uxm/commit/dc8994b49aa64370111c0e496ff7423424689434))

## [1.0.5](https://gitlab.viax.tech/services-viax/uxm/compare/v1.0.4...v1.0.5) (2026-05-28)


### Bug Fixes

* **fix email:** fix email ([fb6ba83](https://gitlab.viax.tech/services-viax/uxm/commit/fb6ba83a1ad0c888b9e73176c9ca2eebe8490e78))
* **fix yml:** fix yml ([78d089b](https://gitlab.viax.tech/services-viax/uxm/commit/78d089b2648f25fe2a912258b7dbae9220c3fe35))
* **fix yml:** fix yml ([79f661a](https://gitlab.viax.tech/services-viax/uxm/commit/79f661aa1778b34d54894af46e1a950e2dc8ed67))
* **fix yml:** fix yml ([34120b1](https://gitlab.viax.tech/services-viax/uxm/commit/34120b1a5df823b9b1ac95a914396b928f3db8ce))
* **fix yml:** fix yml ([921575b](https://gitlab.viax.tech/services-viax/uxm/commit/921575bee41ab1ff9fe66e0178d5390528d5f34c))

## [1.0.4](https://gitlab.viax.tech/services-viax/uxm/compare/v1.0.3...v1.0.4) (2026-05-27)


### Bug Fixes

* **registry:** publish @viax/uxm to nexus npm-private ([0029f41](https://gitlab.viax.tech/services-viax/uxm/commit/0029f417598f7b2482fa380de7beea0a59c1a60b))

## [1.0.3](https://gitlab.viax.tech/services-viax/uxm/compare/v1.0.2...v1.0.3) (2026-05-27)


### Bug Fixes

* **revert npm registry:** revert npm registry ([39649fa](https://gitlab.viax.tech/services-viax/uxm/commit/39649fa3d6e9bba24474fadb8a769dd4fe9e7b08))

## [1.0.2](https://gitlab.viax.tech/services-viax/uxm/compare/v1.0.1...v1.0.2) (2026-05-27)


### Bug Fixes

* **fix npm registry:** fix npm registry ([27c5743](https://gitlab.viax.tech/services-viax/uxm/commit/27c57431a8a96590c7f2129b3b3bf001cad6e199))

## [1.0.1](https://gitlab.viax.tech/services-viax/uxm/compare/v1.0.0...v1.0.1) (2026-05-27)


### Bug Fixes

* **fix $nexus_npm_token:** fix $nexus_npm_token ([e35301c](https://gitlab.viax.tech/services-viax/uxm/commit/e35301cfa448abb61eaeeddf2cf28f54ae36e0f8))
* **fix npm regestry:** fix npm regestry ([b2f8737](https://gitlab.viax.tech/services-viax/uxm/commit/b2f8737de99d1b8bf0938cea88f84096800320e5))
* **fix papline and npm registry:** fix papline and npm registry ([8c7f396](https://gitlab.viax.tech/services-viax/uxm/commit/8c7f396292e6ac810a5ee0b2d393937e504761fb))
* **fix yml:** fix yml ([5795d98](https://gitlab.viax.tech/services-viax/uxm/commit/5795d98b180bfffa3be494e4d6e78e28a4a1dedf))

# 1.0.0 (2026-05-27)


### Bug Fixes

* **fix builder and add scss:** fix builder and add scss ([8269d92](https://gitlab.viax.tech/services-viax/uxm/commit/8269d9210962dd164aea6558a63965e1abc877d3))


### Features

* per-component folder refactor + sync 6 new + 24 updated atoms from upstream ([50f689d](https://gitlab.viax.tech/services-viax/uxm/commit/50f689da272b53e7d7806612a7243bc5b547dfc2))

# Changelog

All notable changes to `@viax/uxm` will be documented in this file. The format
loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — Unreleased

### Added

- Initial extraction from the `modo` monorepo's `packages/uxm` and
  `packages/tokens` workspaces into a standalone publishable package.
- Public entry points:
  - `@viax/uxm` — convenience root re-export, including WCAG/contrast helpers
    (`contrastRatio`, `parseColor`, `rgbToHex`, `suggestAccessibleColor`,
    `suggestAccessibleToken`, `wcagLevel`, plus `RGB` and `TokenCandidate`
    types).
  - `@viax/uxm/ui` — React 19 UI primitives barrel + icon registry
    (`ICONS`, `ICON_OPTIONS`, `getIcon`, `IconDef`).
  - `@viax/uxm/ui.css` — primitive defaults stylesheet.
  - `@viax/uxm/tokens` — `themeTokens` array, `findToken`, `resolveHex`,
    `isTokenValue`, `ThemeToken` type.
  - `@viax/uxm/tokens.css` — CSS custom-property declarations for tokens.
- `tsup`-based build pipeline producing ESM + CJS + `.d.ts` with per-file
  output.
