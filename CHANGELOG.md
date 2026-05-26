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
