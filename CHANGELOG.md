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
  output to preserve `"use client"` directives for Next.js App Router
  consumers.
