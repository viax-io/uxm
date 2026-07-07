# Tasks — [FEATURE_NAME]

> Spec: `[SPEC_PATH]` · Plan: `[PLAN_PATH]`

Tasks are grouped by principle-driven category. Every category MUST have at least
one task or an explicit `N/A — rationale` line.

## A. Tokens & Styling (Principle I, II)

- [ ] T-A1 Add / reuse semantic tokens for … (`src/tokens/index.ts`, `index.css`)
- [ ] T-A2 Author BEM rules using `uxm-` prefix in `src/ui/styles.css`

## B. Component Implementation (Principle III, V)

- [ ] T-B1 Implement `<ComponentName>` in `src/ui/component-name.tsx`
- [ ] T-B2 Export from `src/ui/index.ts` (named export + type re-export)

## C. Accessibility (Principle IV)

- [ ] T-C1 Keyboard interaction model documented & implemented
- [ ] T-C2 ARIA roles / labels verified
- [ ] T-C3 Contrast check via `contrastRatio` / `suggestAccessibleToken` for new color usage

## D. Verification (Principle V)

- [ ] T-D1 `npm run typecheck` clean
- [ ] T-D2 `npm run build` clean (tsup multi-entry)
- [ ] T-D3 Manual smoke in linked `modo` consumer

## E. Release & Docs

- [ ] T-E1 Update `CHANGELOG.md` with semver-correct entry
- [ ] T-E2 Bump `package.json` version (patch / minor / major)
- [ ] T-E3 Update README / handbooks if public surface changed

## F. Out-of-band / Follow-ups

- [ ] T-F1 …
