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
- [ ] **V. Build Hygiene & Strict Typing** — `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` clean
- [ ] **VI. Localisation Boundary** — no i18n dependency; every user-visible string (incl. `aria-label`, placeholders, validation messages) reachable from props; interpolated labels are callbacks, not prefixes; `Intl` formatting resolves prop → `UxmLocaleProvider` → `DEFAULT_UXM_LOCALE`
- [ ] **AI Skill** — new/renamed/removed public component reflected in `skills/viax-uxm/` (same PR; markers untouched — CI stamps them)

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

- Lint: `npm run lint`
- Type-check: `npm run typecheck`
- Build: `npm run build`
- Studio smoke (`npm run dev:modo`) / consumer smoke (linked `modo`): …
- Manual contrast / a11y checks: …

## 6. Rollout

- Expected semver bump: patch / minor / major — driven by Conventional Commit
  types; CI (semantic-release) computes the version, writes CHANGELOG, stamps
  the skill markers and publishes
- Consumer migration notes (if any): …

## 7. Complexity / Tradeoffs

Document any deviation from the constitution and why a simpler alternative was rejected.
