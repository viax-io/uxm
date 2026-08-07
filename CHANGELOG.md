# [4.11.0](https://gitlab.viax.tech/services-viax/uxm/compare/v4.10.0...v4.11.0) (2026-08-07)


### Features

* **icons:** add upload (arrow-up-tray) glyph ([f3e4bff](https://gitlab.viax.tech/services-viax/uxm/commit/f3e4bff5458267591e51cac720d79b81a8f1816e))

# [4.10.0](https://gitlab.viax.tech/services-viax/uxm/compare/v4.9.0...v4.10.0) (2026-08-06)


### Features

* **lifecycle-drop-slot:** dashed slot showing where a dragged node can land ([5269218](https://gitlab.viax.tech/services-viax/uxm/commit/52692185baeabedc689a38b6dfe0bb827845fdb4))
* **lifecycle-group-box:** frosted group frame that doubles as a drop zone ([a3481f1](https://gitlab.viax.tech/services-viax/uxm/commit/a3481f1342a258b9f05719191f82d87602f1d836))
* **lifecycle-node-card:** add the `interaction` kind for Business Interactions ([dd74f76](https://gitlab.viax.tech/services-viax/uxm/commit/dd74f76279daf6c2398db89a447d27ded339f566))

# [4.9.0](https://gitlab.viax.tech/services-viax/uxm/compare/v4.8.0...v4.9.0) (2026-08-03)


### Features

* **lifecycle-node-card:** add a min-height knob for uniform-height nodes ([cd797db](https://gitlab.viax.tech/services-viax/uxm/commit/cd797dbd648a5b4907eda5f839b20f58731d8bac))

# [4.8.0](https://gitlab.viax.tech/services-viax/uxm/compare/v4.7.0...v4.8.0) (2026-08-03)


### Bug Fixes

* **lifecycle-connector:** apply dashPattern via CSS var, guard themed arrow size ([d370554](https://gitlab.viax.tech/services-viax/uxm/commit/d370554e98eb17631d13ad4d405d9f50e4b06211))


### Features

* **lifecycle-connector:** elbow routing, themable dashed state and live arrow size ([af04600](https://gitlab.viax.tech/services-viax/uxm/commit/af046007441cfa9ba2ed1c54c6f394a00fa6de80))

# [4.7.0](https://gitlab.viax.tech/services-viax/uxm/compare/v4.6.0...v4.7.0) (2026-07-31)


### Bug Fixes

* **menu:** give the row subtitle an AA-passing default colour ([90ea3e0](https://gitlab.viax.tech/services-viax/uxm/commit/90ea3e0092f3c11f98973b476ed0d750271bfd4b))


### Features

* **menu:** add optional two-line rows via a MenuItem `subtitle` ([b85c9ca](https://gitlab.viax.tech/services-viax/uxm/commit/b85c9ca05d27294c08e77862e429fee53f2437bd))

# [4.6.0](https://gitlab.viax.tech/services-viax/uxm/compare/v4.5.0...v4.6.0) (2026-07-31)


### Bug Fixes

* **icon-button:** chain the pressed state off hover instead of the bare default ([718ce1d](https://gitlab.viax.tech/services-viax/uxm/commit/718ce1d760ca3b121c93f10d93daef0eeaf45e3f))


### Features

* **previews:** atomize lifecycle diagram previews & drop two mock previews ([445cda5](https://gitlab.viax.tech/services-viax/uxm/commit/445cda52b21a4671f881f02972363d98274bf6a4))

# [4.5.0](https://gitlab.viax.tech/services-viax/uxm/compare/v4.4.0...v4.5.0) (2026-07-31)


### Bug Fixes

* **editable-cell:** correct the picker clear's reveal, gutter and re-entry ([a54159e](https://gitlab.viax.tech/services-viax/uxm/commit/a54159efbd4bb46dce5cddac8fc11d0990830d78))
* **editable-cell:** dress open pickers in the editing chrome ([74521b2](https://gitlab.viax.tech/services-viax/uxm/commit/74521b24445b13a20656d357793801c58f8d9ff7))
* **editable-cell:** gate the picker clear's hit area, commit and gutter on open ([c9cc1c9](https://gitlab.viax.tech/services-viax/uxm/commit/c9cc1c934474becdbe43944743df00aa08159950))
* **studio:** match showWhen values by list, one control per property ([43b75b8](https://gitlab.viax.tech/services-viax/uxm/commit/43b75b8e7a7f22fa5ee5b30a5888c5d80cc3a4ab))


### Features

* **editable-cell:** make the width cap per size ([4e44f95](https://gitlab.viax.tech/services-viax/uxm/commit/4e44f95eceb175fd68c95fab53f40808ad8dd048))
* **editable-cell:** pickers clear from the field on every size ([334fc1a](https://gitlab.viax.tech/services-viax/uxm/commit/334fc1acaaf1e5e049a4b5988878a25b648c2ff3))
* **editable-cell:** pin the value colour behind a Text Color knob ([55eaad4](https://gitlab.viax.tech/services-viax/uxm/commit/55eaad440e8cd4b705204e0f46ea8a2d2b2ab8c0))

# [4.4.0](https://gitlab.viax.tech/services-viax/uxm/compare/v4.3.0...v4.4.0) (2026-07-29)


### Bug Fixes

* **card:** hoist toLen to module scope ([50d6cea](https://gitlab.viax.tech/services-viax/uxm/commit/50d6cea12a0cea49d472c727cfa5f05c41409b53))
* **form-field:** align overline's BEM class with the tint axis ([35634a3](https://gitlab.viax.tech/services-viax/uxm/commit/35634a3471e0cd0efccf7aa53072580ec9a20ac4))
* **form-field:** follow editable-cell's per-size padding var in the outdent ([399ec3d](https://gitlab.viax.tech/services-viax/uxm/commit/399ec3de50cdcb5521cf1de85347a98508bc0a4b))
* **form-field:** outdent EditableCell via a published inset, not its padding var ([4fccadc](https://gitlab.viax.tech/services-viax/uxm/commit/4fccadcb6becb8e01b15da5f47bb5cf1be7982e7))
* **form-field:** rename labelTone to labelTint for consistency ([c12a902](https://gitlab.viax.tech/services-viax/uxm/commit/c12a902f4263b0b635bc1506d59ad3ddac4ada67))
* **studio:** make Card's content-layout axes variants; drop the Row Gap knob ([6a2d065](https://gitlab.viax.tech/services-viax/uxm/commit/6a2d0651a848264f1da6b740549c42828e11f234))
* **studio:** map card and form-field knobs to their real CSS vars ([e471456](https://gitlab.viax.tech/services-viax/uxm/commit/e4714565f4eca30db2dda8b043f5107493a0f700))
* **studio:** migrate the retired form-field labelColor knob into the strong tint ([7657c9a](https://gitlab.viax.tech/services-viax/uxm/commit/7657c9af5b47fb70991067f8855f41ba9273ce62))


### Features

* **card:** add opt-in column gap, tunable theme-aware shadow, layout variants ([5bee7c0](https://gitlab.viax.tech/services-viax/uxm/commit/5bee7c0b14a02603b8a33dbc3738f37cdc08ed5e))
* **form-field:** add label tint and overline variant with per-tint theming ([0ef3b26](https://gitlab.viax.tech/services-viax/uxm/commit/0ef3b2628ad90e4400cd0d1492d54031f5be73fa))

# [4.3.0](https://gitlab.viax.tech/services-viax/uxm/compare/v4.2.0...v4.3.0) (2026-07-28)


### Bug Fixes

* **editable-cell:** add a pre-lh fallback under the empty-cell height floor ([b8e9042](https://gitlab.viax.tech/services-viax/uxm/commit/b8e90421d8a1efe4d51fe85ec6f810ee70c88a70))
* **editable-cell:** make the small Font Size knob honest about inheriting ([91410c4](https://gitlab.viax.tech/services-viax/uxm/commit/91410c4dd3ca3d29a612481b137eabe40504a4f9))
* **editable-cell:** take gutter buttons out of the tab order; theme the ✕ ([b3e08f0](https://gitlab.viax.tech/services-viax/uxm/commit/b3e08f0fe4bd3acff8cd9279ed8c2702162e28b5))
* **studio:** keep retired editable-cell dimension keys mapped so they stay inert ([5dba675](https://gitlab.viax.tech/services-viax/uxm/commit/5dba675cf8aec9f63bf0b93b76253d5b6e160920))


### Features

* **editable-cell:** clear affordance for every editor type, on by default ([7b15ca9](https://gitlab.viax.tech/services-viax/uxm/commit/7b15ca9476a8eede83269109c2d190c318a7984a))
* **editable-cell:** size presets with symmetric per-size theming ([0363e1a](https://gitlab.viax.tech/services-viax/uxm/commit/0363e1a9df67edab8341a6899c4df03d26be663d))

# [4.2.0](https://gitlab.viax.tech/services-viax/uxm/compare/v4.1.2...v4.2.0) (2026-07-27)


### Features

* **icons:** add product, organization, business-interaction glyphs ([a53976d](https://gitlab.viax.tech/services-viax/uxm/commit/a53976d489af64578682f38c1eb89fff0a022704))

## [4.1.2](https://gitlab.viax.tech/services-viax/uxm/compare/v4.1.1...v4.1.2) (2026-07-27)


### Bug Fixes

* **studio:** scope light-mode brand color tokens away from dark theme ([46be321](https://gitlab.viax.tech/services-viax/uxm/commit/46be321da6df3598570a72e0919f1c3ac082a52d))

## [4.1.1](https://gitlab.viax.tech/services-viax/uxm/compare/v4.1.0...v4.1.1) (2026-07-24)


### Bug Fixes

* **button:** align ButtonWithIcon active registry defaults with the atom ([eca2515](https://gitlab.viax.tech/services-viax/uxm/commit/eca25151b462097cb2f729bfc3ca5b74fc9d24be))
* **button:** align ButtonWithIcon hover registry default; drop vestigial opacity transition ([38afa91](https://gitlab.viax.tech/services-viax/uxm/commit/38afa91aa850ba369e01fd2176f46cbc8a784d5b)), closes [#1](https://gitlab.viax.tech/services-viax/uxm/issues/1) [#2](https://gitlab.viax.tech/services-viax/uxm/issues/2)
* **button:** distinct hover fills instead of an opacity dim ([7ab6cec](https://gitlab.viax.tech/services-viax/uxm/commit/7ab6cecae5b051014c8c860ef0de7a71ba889139))

# [4.1.0](https://gitlab.viax.tech/services-viax/uxm/compare/v4.0.0...v4.1.0) (2026-07-24)


### Bug Fixes

* **side-flexpane:** resolve review findings — theming, a11y, expand guard ([201f1bf](https://gitlab.viax.tech/services-viax/uxm/commit/201f1bfd414ee229f4eded9b8e5c149f2db7e8ea)), closes [#8](https://gitlab.viax.tech/services-viax/uxm/issues/8) [#1](https://gitlab.viax.tech/services-viax/uxm/issues/1) [#2](https://gitlab.viax.tech/services-viax/uxm/issues/2) [#3](https://gitlab.viax.tech/services-viax/uxm/issues/3) [#4](https://gitlab.viax.tech/services-viax/uxm/issues/4) [#6](https://gitlab.viax.tech/services-viax/uxm/issues/6) [#5](https://gitlab.viax.tech/services-viax/uxm/issues/5) [#7](https://gitlab.viax.tech/services-viax/uxm/issues/7) [#8](https://gitlab.viax.tech/services-viax/uxm/issues/8)


### Features

* **side-flexpane:** fold PaneShell features into the pane header ([d809c0c](https://gitlab.viax.tech/services-viax/uxm/commit/d809c0c81a6b4bf510be74b73500acaa1c133abe))

# [4.0.0](https://gitlab.viax.tech/services-viax/uxm/compare/v3.4.0...v4.0.0) (2026-07-23)


* feat(configuration)!: add Segment Row / Card / Component Row / Option List; remove Segment Tree Row ([0ce8679](https://gitlab.viax.tech/services-viax/uxm/commit/0ce86796969fde858878af444a226c7f713a469d))


### Bug Fixes

* **configuration:** resolve review findings — a11y, theming, ordering, skill ([7216c37](https://gitlab.viax.tech/services-viax/uxm/commit/7216c3707ea20313131bcbdaf600e565f53c68f1)), closes [#8](https://gitlab.viax.tech/services-viax/uxm/issues/8) [#1](https://gitlab.viax.tech/services-viax/uxm/issues/1) [#7](https://gitlab.viax.tech/services-viax/uxm/issues/7) [#6](https://gitlab.viax.tech/services-viax/uxm/issues/6) [#3](https://gitlab.viax.tech/services-viax/uxm/issues/3) [#8](https://gitlab.viax.tech/services-viax/uxm/issues/8) [#4](https://gitlab.viax.tech/services-viax/uxm/issues/4) [#5](https://gitlab.viax.tech/services-viax/uxm/issues/5)
* **option-list:** namespace fallback row key; review cleanups ([20ace2a](https://gitlab.viax.tech/services-viax/uxm/commit/20ace2a2c6e96d02550094567435a2d3075041ce))


### Features

* **option-list:** add per-row action slot (rowActions) ([e67001e](https://gitlab.viax.tech/services-viax/uxm/commit/e67001e782821c261b17d767a17bd56d20af252b))


### BREAKING CHANGES

* `SegmentTreeRow` / `SegmentTreeRowProps` are removed from
`@viax/uxm/ui`. Compose `SegmentCard` (with a `SegmentRow` header) over
`ComponentRow`/`OptionList` children instead.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>

# [3.4.0](https://gitlab.viax.tech/services-viax/uxm/compare/v3.3.0...v3.4.0) (2026-07-23)


### Bug Fixes

* **listbox:** guard staged multiselect commit and restore native Select props ([1f2c939](https://gitlab.viax.tech/services-viax/uxm/commit/1f2c939a2dc67bb03a440fa1b2045bb93450a609))
* **previews:** showcase multiselect / clear / mode; fix cell text color ([745effe](https://gitlab.viax.tech/services-viax/uxm/commit/745effed3f0da0e24811bf823346d199fe8b22da))


### Features

* **data-table:** add editorRequired column option ([7bb6379](https://gitlab.viax.tech/services-viax/uxm/commit/7bb6379fe7ac25ec2943364526eba1ec60e9bf9f))
* **editable-cell:** staged multiselect, required, clearable, searchable auto ([32cb796](https://gitlab.viax.tech/services-viax/uxm/commit/32cb7962e481e15851a7b4239f2868777f432cb8))
* **listbox:** add commitMode (staged), required, and shared footer-clear ([6696c8c](https://gitlab.viax.tech/services-viax/uxm/commit/6696c8c0e87525611447f8d4834dc44da87b1c64))
* **pill-select:** add clearable + required; move clear ✕ beside chevron ([7cd6355](https://gitlab.viax.tech/services-viax/uxm/commit/7cd63555a1bd8588e50ade346d752d14b2a7f57b))
* **select:** implement real mode="multi", required, in-dropdown clear ([1baaedc](https://gitlab.viax.tech/services-viax/uxm/commit/1baaedc8a9b51d8395d39b4fb24951880f3f4142))

# [3.3.0](https://gitlab.viax.tech/services-viax/uxm/compare/v3.2.1...v3.3.0) (2026-07-23)


### Features

* **icon:** add language (globe) glyph ([fc702d3](https://gitlab.viax.tech/services-viax/uxm/commit/fc702d31ee5d89b4b1de32d91264c98a9015e8e9))

## [3.2.1](https://gitlab.viax.tech/services-viax/uxm/compare/v3.2.0...v3.2.1) (2026-07-21)


### Bug Fixes

* **list-item:** document icon-tile slot; make its radius studio-themeable ([97ce4cc](https://gitlab.viax.tech/services-viax/uxm/commit/97ce4ccdaaf47b825fb1b12212c30bfb6b7aec1b)), closes [#1](https://gitlab.viax.tech/services-viax/uxm/issues/1)
* **list-item:** stretch interactive rows to full width; render icon via IconTile ([70f7828](https://gitlab.viax.tech/services-viax/uxm/commit/70f782805cd85a296bee5f1ff05fd28ea8e31fd8))

# [3.2.0](https://gitlab.viax.tech/services-viax/uxm/compare/v3.1.4...v3.2.0) (2026-07-17)


### Bug Fixes

* **config-component-row:** keep `style` on the root so padding/radius vars apply ([b611482](https://gitlab.viax.tech/services-viax/uxm/commit/b611482961c43f0215f557412c0a3d31b49e6b16))
* **segment-tree-row:** address self-review — live caret, empty body, aria ([d5ced1d](https://gitlab.viax.tech/services-viax/uxm/commit/d5ced1da9a4cd2cb6ff1b92b991d6d0d60e115b8))
* **segment-tree-row:** drop stray 'use client'; document row atoms ([8476bd7](https://gitlab.viax.tech/services-viax/uxm/commit/8476bd74a0e55c3124b14fdf220aa6120e077ca6)), closes [#1](https://gitlab.viax.tech/services-viax/uxm/issues/1) [#2](https://gitlab.viax.tech/services-viax/uxm/issues/2)


### Features

* **segment-tree-row,config-component-row:** hover-revealed row actions ([188e6a5](https://gitlab.viax.tech/services-viax/uxm/commit/188e6a5ed5ebbe6bfc38e3b17812f7acafa58101))
* **segment-tree-row:** ship it as a real atom (was studio-only mock) ([b697767](https://gitlab.viax.tech/services-viax/uxm/commit/b69776701f34f9ad73033860aa7bbdb4d4028e6d))

## [3.1.4](https://gitlab.viax.tech/services-viax/uxm/compare/v3.1.3...v3.1.4) (2026-07-16)


### Bug Fixes

* **calendar:** open on the selected value's month, not today's ([bd622a7](https://gitlab.viax.tech/services-viax/uxm/commit/bd622a7ba66f51cb8d044f69477fec690cb540ac))
* **date-input:** keep caller aria-describedby alongside the error id ([0f0e45b](https://gitlab.viax.tech/services-viax/uxm/commit/0f0e45bc37ec0f01b08197bf1d522f8a612657fe))
* **date-input:** reject impossible typed dates with inline feedback ([3b4dfb8](https://gitlab.viax.tech/services-viax/uxm/commit/3b4dfb8e821d7b46dfa227232ab95eb22eed3418))
* **editable-cell:** show date format hint as placeholder when empty ([e64d8f0](https://gitlab.viax.tech/services-viax/uxm/commit/e64d8f0f14cea9bc72a85aeb6ee21e8cd238b865))

## [3.1.3](https://gitlab.viax.tech/services-viax/uxm/compare/v3.1.2...v3.1.3) (2026-07-16)


### Bug Fixes

* **studio:** revert brand font live when default is picked over a published font ([a90df4d](https://gitlab.viax.tech/services-viax/uxm/commit/a90df4df66b116de18d67b09f0278b564bef78b7)), closes [#uxm-overrides](https://gitlab.viax.tech/services-viax/uxm/issues/uxm-overrides)

## [3.1.2](https://gitlab.viax.tech/services-viax/uxm/compare/v3.1.1...v3.1.2) (2026-07-16)


### Bug Fixes

* **studio:** apply brand font live and make Typography picker interactive ([bcd0234](https://gitlab.viax.tech/services-viax/uxm/commit/bcd0234a7b4284963ab00748470a2ee9b31d5882))

## [3.1.1](https://gitlab.viax.tech/services-viax/uxm/compare/v3.1.0...v3.1.1) (2026-07-14)


### Bug Fixes

* **editable-cell:** address MR review on date commit paths ([684b814](https://gitlab.viax.tech/services-viax/uxm/commit/684b814316f1816491b211c8923f18fdd1e52778))
* **editable-cell:** align select/multiselect value with other cell types ([48c404d](https://gitlab.viax.tech/services-viax/uxm/commit/48c404d9392d1b3e12d4d57796db05f081d55dca))
* **editable-cell:** don't commit an unchanged date on blur ([3fc4384](https://gitlab.viax.tech/services-viax/uxm/commit/3fc4384fcce94efc3222b94fe83a0581222c28fe))
* **editable-cell:** label calendar dialog and document no-op validate asymmetry ([417c22e](https://gitlab.viax.tech/services-viax/uxm/commit/417c22ec0590713bc133d335f0b3ebd1702baa16))
* **editable-cell:** make date type a typeable DateInput-style field ([bab366e](https://gitlab.viax.tech/services-viax/uxm/commit/bab366e9223e8c90219a09fba9afe9961f41c1ec))
* **studio:** hide Editing state for picker editable-cells ([087c10f](https://gitlab.viax.tech/services-viax/uxm/commit/087c10fb9be2b52d4f25041aaca2b2ae9560c507))

# [3.1.0](https://gitlab.viax.tech/services-viax/uxm/compare/v3.0.2...v3.1.0) (2026-07-13)


### Features

* **studio:** remove Quick Save — Publish is the single save path ([3e62ba3](https://gitlab.viax.tech/services-viax/uxm/commit/3e62ba36874f0690d7fe19b7b14ad571e8311780))

## [3.0.2](https://gitlab.viax.tech/services-viax/uxm/compare/v3.0.1...v3.0.2) (2026-07-08)


### Bug Fixes

* **app-top-bar:** match README search placeholder to "Search…" ([f8632bf](https://gitlab.viax.tech/services-viax/uxm/commit/f8632bf70605f9023d2673c308a8470ef73bf6e6))
* **pickers:** address code-review findings on the Listbox migration ([0da7430](https://gitlab.viax.tech/services-viax/uxm/commit/0da7430250bbacb44f875a350c56b163488532ac))
* **search:** unify search-bar placeholders to "Search…" ([e051426](https://gitlab.viax.tech/services-viax/uxm/commit/e051426d8a24ea93e076f56fbb2cde71d0473243))

## [3.0.1](https://gitlab.viax.tech/services-viax/uxm/compare/v3.0.0...v3.0.1) (2026-07-08)


### Bug Fixes

* **calendar:** render weeks as rows via display:contents on ARIA row wrappers ([f6fea61](https://gitlab.viax.tech/services-viax/uxm/commit/f6fea61dd12301f94833177cb10b64c1654c7b06))

# [3.0.0](https://gitlab.viax.tech/services-viax/uxm/compare/v2.10.0...v3.0.0) (2026-07-08)


### Bug Fixes

* **input-with-icon:** wire up clear button in Studio preview ([527fa0f](https://gitlab.viax.tech/services-viax/uxm/commit/527fa0f6729c4d5606c9c390b7aad0c0ed8a11d8))
* **inputs:** address code-review findings for clear-button rollout ([e52627b](https://gitlab.viax.tech/services-viax/uxm/commit/e52627b88c1595f8a20cc6e5725dca384ed0a8be))


### Features

* **currency-input:** add clear button, left-align amount, drop pickerPosition ([09a2091](https://gitlab.viax.tech/services-viax/uxm/commit/09a209152807dfe8721768faba88a4f49bb244e6))
* **date-input:** add clearable clear button ([0004909](https://gitlab.viax.tech/services-viax/uxm/commit/0004909e03fe6bc2266c164c9f875ae58c824d5d))
* **phone-input:** add clearable clear button ([d3a404c](https://gitlab.viax.tech/services-viax/uxm/commit/d3a404cde4525c04bb2ce379e484a70383affbfd))
* **select:** placeholder-driven clear, drop clearable knob, rename ([89afd6c](https://gitlab.viax.tech/services-viax/uxm/commit/89afd6cee1700b27c1c1643d0b9526079b13b0d7))
* **time-input:** add clearable clear button, fix outside-click dismiss ([f91e088](https://gitlab.viax.tech/services-viax/uxm/commit/f91e088f8e4ea4a6439d3212851037f10e5c6ceb))


### BREAKING CHANGES

* **select:** Select no longer accepts a `clearable` prop. Clearability is
inferred from the presence of a placeholder option instead.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>

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
