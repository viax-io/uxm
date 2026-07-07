# Tasks — [FEATURE_NAME]

> Spec: `[SPEC_PATH]` · Plan: `[PLAN_PATH]`

Tasks are grouped by principle-driven category. Every category MUST have at least
one task or an explicit `N/A — rationale` line.

## A. Tokens & Styling (Principle I, II)

- [ ] T-A1 Add / reuse semantic tokens for … (`src/tokens/index.ts`, `index.css`)
- [ ] T-A2 Author BEM rules using `uxm-` prefix in `src/ui/<name>/<name>.scss` (+ `@import` line in `src/ui/styles.css`)

## B. Component Implementation (Principle III, V)

- [ ] T-B1 Implement `<ComponentName>` in `src/ui/<name>/<name>.tsx` (+ folder `index.ts` barrel)
- [ ] T-B2 Export from `src/ui/index.ts` (named export + type re-export)

## C. Accessibility (Principle IV)

- [ ] T-C1 Keyboard interaction model documented & implemented
- [ ] T-C2 ARIA roles / labels verified
- [ ] T-C3 Contrast check via `contrastRatio` / `suggestAccessibleToken` for new color usage

## D. Verification (Principle V)

- [ ] T-D1 `npm run lint` clean
- [ ] T-D2 `npm run typecheck` clean
- [ ] T-D3 `npm run build` clean (tsup multi-entry)
- [ ] T-D4 Manual smoke in the studio portal (`npm run dev:modo`) or linked `modo` consumer

## E. Release & Docs

- [ ] T-E1 Commit messages carry the correct Conventional Commit types (CI derives the semver
      bump, CHANGELOG, and skill-marker stamps from them — no manual version/CHANGELOG edits)
- [ ] T-E2 AI skill updated for public-surface changes (`skills/viax-uxm/` — same MR,
      "(unreleased)" marks, markers untouched)
- [ ] T-E3 Update README / handbooks if public surface changed

## F. Out-of-band / Follow-ups

- [ ] T-F1 …
