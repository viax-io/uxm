<!--
Sync Impact Report
==================
Version change: none → 1.0.0 (initial ratification)
Bump rationale: First formal constitution for @viax/uxm. All principles are new,
so MAJOR=1 establishes the baseline (no prior governance to break).

Modified principles: n/a (initial)
Added principles:
  - I. Token-First Styling
  - II. BEM Discipline (uxm- prefix, canonical variant)
  - III. Component API Stability & Semver
  - IV. Accessibility & WCAG Contrast
  - V. Build Hygiene & Strict Typing

Added sections:
  - Distribution & Consumer Contract (Additional Constraints)
  - Development Workflow & Quality Gates
  - Governance

Removed sections: n/a

Templates requiring updates:
  ✅ .claude/commands/constitution.md (paths moved .specify/ → .claude/)
  ✅ .claude/templates/constitution-template.md (created)
  ✅ .claude/templates/plan-template.md (created; Constitution Check aligned)
  ✅ .claude/templates/spec-template.md (created)
  ✅ .claude/templates/tasks-template.md (created; principle-driven categories)

Follow-up TODOs:
  - None. RATIFICATION_DATE set to today (2026-05-25); revisit if an earlier
    de-facto adoption date is identified from git history.
-->

# @viax/uxm Constitution

This document is the source of truth for engineering, design and release
discipline in the `@viax/uxm` React 19 UI primitives + design tokens package.
It governs every change merged into `main` and every artifact published to the
Viax GitLab npm registry. Where any handbook, command, agent prompt, or ad-hoc
practice conflicts with this constitution, **the constitution wins**.

## Core Principles

### I. Token-First Styling

All CSS values that carry semantic meaning — colors, spacing, radii, shadows,
typography sizes/weights, motion durations — **MUST** resolve through a token
from `@viax/uxm/tokens`. Hardcoded literals (e.g. `#fff`, `12px`, `rgba(0,0,0,.4)`)
in `src/ui/styles.css` or any component are prohibited unless the value is
provably outside the token taxonomy (e.g. `0`, `1px` hairline, `inherit`,
`currentColor`).

Use **semantic** tokens (`--background-surface`, `--text-primary`, …) wherever
one exists; fall back to primitive tokens only when no semantic alias applies.
This is what makes dark mode and theme reskins work without component edits.

*Rationale:* The package's entire value proposition is design-token-driven UI.
Hardcoded values silently break dark mode and downstream rebrands.

### II. BEM Discipline (uxm- prefix, canonical variant)

Component classes **MUST** follow canonical BEM with the `uxm-` namespace:

```
uxm-block__element--modifier
```

- Block prefix: `uxm-` (kebab-case, matches the component filename).
- Element separator: double underscore `__`.
- Modifier separator: double dash `--`.
- State classes use SMACSS-style globals (`.is-disabled`, `.is-open`) — not
  modifiers.
- No CSS-in-JS, no inline `style={}` for theming concerns, no Tailwind-style
  utility soup. All styles live in `src/ui/styles.css` (or a colocated `.css`
  file imported by the component).
- Do **not** mix the legacy `x-block_modifier_value` viax convention into new
  code. That convention is preserved only for the legacy library it documents.

*Rationale:* A single, mechanical class convention keeps the rendered DOM and
the CSS predictable for consumers, tooling (overrides, audits) and code review.

### III. Component API Stability & Semver

The published surface is governed by [Semantic Versioning](https://semver.org/):

- **PATCH** — internal refactors, CSS tweaks that preserve visuals, doc fixes.
- **MINOR** — new components, new props with defaults, new tokens, new exports.
  Existing consumers must compile and render unchanged.
- **MAJOR** — removed/renamed exports, changed prop semantics, removed tokens,
  any DOM/class structure change that breaks downstream overrides.

Rules:

- All public exports go through `src/ui/index.ts`, `src/tokens/index.ts`, and
  the root `src/index.ts`. Deep-imports into individual files are **not** a
  supported contract.
- Components are functional, one-per-file, **kebab-case filename**, PascalCase
  named export. No default exports.
- No `"use client"` / `"use server"` directives. Consumers (currently `modo`)
  are SPA; framework-specific pragmas leak abstractions.
- Every release **MUST** update `CHANGELOG.md` with the version, date, and
  user-visible diff before `npm publish`.

*Rationale:* The package is consumed via `npm install` (and locally via
`file:` link). Silent breakage cascades into every Viax SPA.

### IV. Accessibility & WCAG Contrast

Every interactive primitive **MUST**:

- Be keyboard-operable with a visible focus indicator that meets 3:1 contrast
  against its background.
- Expose correct ARIA roles, names, and states; rely on native semantics
  (`button`, `input`, `dialog`, …) before adding ARIA.
- Maintain text/UI contrast at WCAG 2.1 **AA** (4.5:1 body, 3:1 large/UI) in
  both light and dark themes. Use the package's own helpers (`contrastRatio`,
  `wcagLevel`, `suggestAccessibleToken`) when picking or proposing tokens.
- Never convey state through color alone.

Any change that introduces a new color usage or alters an existing color/text
pairing **MUST** be verified against AA before merge.

*Rationale:* The package literally ships WCAG tooling — failing AA inside it
would be self-defeating, and downstream apps trust its primitives as a floor.

### V. Build Hygiene & Strict Typing

- `npm run typecheck` (`tsc --noEmit`) **MUST** pass with zero errors before
  any commit that touches `src/`.
- `npm run build` (tsup multi-entry → `dist/{index,ui,tokens}`) **MUST**
  succeed and produce ESM + CJS + `.d.ts` + CSS for every exports map entry in
  `package.json`. A missing artifact is a release blocker.
- `tsconfig.json` `strict` flag stays on; new `any`, `// @ts-expect-error`, or
  `// @ts-ignore` requires an inline comment justifying it.
- No new runtime dependencies without explicit approval; the package's
  `peerDependencies` are `react` / `react-dom` ^19 and that is intentional.
- Node engine floor stays at `>=20` to match `package.json` `engines`.

*Rationale:* This is a leaf library — its build output is the product. A
typecheck or build failure ships broken types/CSS to every consumer.

## Distribution & Consumer Contract

- Published name: `@viax/uxm`; private registry:
  `https://gitlab.viax.tech/api/v4/projects/services-viax%2Fuxm/packages/npm/`.
- Exports map in `package.json` is the canonical public surface. Adding a new
  entry is a MINOR; removing or renaming one is a MAJOR.
- `dist/` is the only directory shipped (plus `README.md`, `CHANGELOG.md`).
  Source files, tests, configs **MUST NOT** be packaged.
- `prepublishOnly` runs `npm run build`; do **not** bypass it (no
  `npm publish --ignore-scripts`).
- Local consumers using `npm install file:../uxm` rely on `npm run dev` keeping
  `dist/` fresh — never commit a stale `dist/`.

## Development Workflow & Quality Gates

1. **Branch & spec** — non-trivial work starts from a spec/plan generated via
   `.claude/templates/spec-template.md` + `plan-template.md`. The plan's
   *Constitution Check* section MUST be filled in.
2. **Implement** — follow Principles I–V; small, reviewable commits.
3. **Local gates (pre-PR)** — `npm run typecheck` and `npm run build` MUST be
   green. New visual primitives MUST be smoke-tested in the linked `modo`
   consumer.
4. **Review** — at least one human reviewer confirms the Constitution Check is
   accurate; any deviation MUST be documented in the plan's *Complexity /
   Tradeoffs* section.
5. **Release** — `CHANGELOG.md` updated, `npm version <patch|minor|major>`
   driven by Principle III, `npm publish` from a clean tree.

## Governance

- **Supremacy.** This constitution supersedes any handbook, agent prompt,
  command template, or informal practice. Conflicts MUST be resolved by
  amending the constitution, not by overriding it in passing.
- **Amendment procedure.** Open a PR that (a) modifies
  `.claude/memory/constitution.md`, (b) updates the Sync Impact Report comment
  at the top, (c) propagates wording into the dependent templates listed in
  `.claude/commands/constitution.md` §4. Merge requires explicit reviewer
  acknowledgement of the version bump.
- **Versioning policy.** This document follows semver as defined in the
  `/constitution` command:
  - **MAJOR** — a principle is removed or its meaning materially narrowed/broadened.
  - **MINOR** — a new principle or section is added, or guidance is materially expanded.
  - **PATCH** — clarifications, wording, typo fixes that do not change behavior.
- **Compliance review.** Every PR touching `src/` is reviewed against the
  Constitution Check in its plan. Releases additionally re-confirm Principles
  III and V (semver + build hygiene). Quarterly, the maintainers re-read this
  document end-to-end and file follow-up issues for drift.
- **Deferred items.** None at ratification.

**Version**: 1.0.0 | **Ratified**: 2026-05-25 | **Last Amended**: 2026-05-25
