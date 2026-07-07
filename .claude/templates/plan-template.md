# Implementation Plan — [FEATURE_NAME]

> Branch: `[BRANCH_NAME]` · Spec: `[SPEC_PATH]` · Owner: [OWNER]

## 1. Goal & Scope

Concise statement of the user-visible outcome and what is explicitly **out of scope**.

## 2. Constitution Check

Confirm every applicable principle in `.claude/memory/constitution.md` is honored.
List the principle by name and how this plan complies (or document an approved
deviation under §7 *Complexity / Tradeoffs*).

- [ ] **I. Token-First Styling** — no hardcoded colors / spacing / radii / shadows
- [ ] **II. BEM Discipline (uxm- prefix, canonical)** — no ad-hoc class names or CSS-in-JS
- [ ] **III. Component API Stability & Semver** — additive change OR documented major bump
- [ ] **IV. Accessibility & WCAG Contrast** — keyboard nav, ARIA, AA contrast verified
- [ ] **V. Build Hygiene & Strict Typing** — `npm run typecheck` and `npm run build` clean

## 3. Affected Surface

- Components (paths): …
- Tokens added / changed: …
- Public API entries (`src/ui/index.ts`, `src/tokens/index.ts`, root): …
- CSS files: …

## 4. Implementation Steps

Ordered, reviewable steps; each step ends in a green typecheck + build.

1. …
2. …

## 5. Test / Verification Plan

- Type-check: `npm run typecheck`
- Build: `npm run build`
- Consumer smoke (linked `modo`): …
- Manual contrast / a11y checks: …

## 6. Rollout

- Version bump: patch / minor / major (justify)
- CHANGELOG entry: …
- Consumer migration notes (if any): …

## 7. Complexity / Tradeoffs

Document any deviation from the constitution and why a simpler alternative was rejected.
