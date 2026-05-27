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
