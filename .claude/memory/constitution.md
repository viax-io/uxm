<!--
Sync Impact Report
==================
Version change: 1.1.0 → 1.1.1
Bump rationale: PATCH — no principle changed. The legacy Viax Vue handbooks
(bem-style-guide, design-tokens, ui-components) moved to
`.claude/handbooks/legacy/` (repo audit 2026-09-07); the Principle I reference
to `design-tokens.md` now points at the archived path. The Vue-era commands
`/write-tests` and `/figma-audit` were removed and `/end-task` rewritten around
the gates this document names (lint, typecheck, check:drift, build).

Modified principles: none (path-only wording in I).
Added sections: none. Removed sections: none.

Templates requiring updates:
  ✅ .claude/commands/end-task.md (rewritten — gates + Constitution Check I–V)
  ✅ .claude/commands/commit-message.md (uxm scopes, semver footer guidance)
  ✅ .claude/commands/start-task.md, agents/code-review.md, agents/react-frontend.md
     (legacy-handbook caveats replaced by a pointer to handbooks/legacy/)
  ✅ .claude/templates/* (no change needed — verified)

Previous report (1.0.0 → 1.1.0, 2026-07-07) — kept for history:
  MINOR: added "AI Skill & Agent Tooling"; Principles I, II, V and the
  Development Workflow expanded (lint gate, semantic-release flow, skill
  lifecycle); token taxonomy corrected to `--color-*`; SCSS-per-component and
  BEM state modifiers codified; the SMACSS `.is-*` bullet removed.

Follow-up TODOs:
  - none
-->

# @viax/uxm Constitution

This document is the source of truth for engineering, design and release
discipline in the `@viax/uxm` React 19 UI primitives + design tokens package.
It governs every change merged into `master` and every artifact published to
the Viax Nexus npm registry. Where any handbook, command, agent prompt, or
ad-hoc practice conflicts with this constitution, **the constitution wins**.

## Core Principles

### I. Token-First Styling

All CSS values that carry semantic meaning — colors, spacing, radii, shadows,
typography sizes/weights, motion durations — **MUST** resolve through a design
token. The live token system is defined in `src/tokens/index.css` (typed
mirror: `src/tokens/index.ts`): surface/text/border/accent/semantic color
tokens under the `--color-*` namespace plus elevation (`--shadow-*`) and
typography (`--font-*`) tokens, with dark-theme overrides under
`[data-theme="dark"]`.

- Component rules read a **component-scoped override variable with a token
  fallback**: `var(--uxm-{component}-{state}-{prop}, var(--color-*))`. This is
  what makes the studio's per-component theming and dark mode work without
  component edits.
- Hardcoded literals (`#fff`, `12px`, `rgba(0,0,0,.4)`) are prohibited unless
  the value is provably outside the token taxonomy (`0`, `1px` hairlines,
  `inherit`, `currentColor`, or intrinsic geometry such as a color picker's
  white→hue→black gradients). Every such exception **MUST** carry a comment in
  the stylesheet justifying it.
- The legacy viax token names (`--background-*`, `--text-primary`, `--radius-*`
  from `.claude/handbooks/legacy/design-tokens.md`) document a DIFFERENT system and
  MUST NOT be used in this package.

*Rationale:* The package's entire value proposition is design-token-driven UI.
Hardcoded values silently break dark mode, studio theming, and rebrands.

### II. BEM Discipline (uxm- prefix, canonical variant)

Component classes **MUST** follow canonical BEM with the `uxm-` namespace:

```
uxm-block__element--modifier
```

- Block prefix: `uxm-` (kebab-case, matches the component folder name).
- Element separator: double underscore `__`; modifier separator: double dash
  `--`.
- State is expressed through BEM **modifiers** (`--disabled`, `--error`,
  `--open`) — not SMACSS `.is-*` globals. Components that the studio themes
  per-state also expose forced-state classes (`--state-hover`, `--state-focus`)
  sharing selectors with the real `:hover`/`:focus` rules.
- Styles are authored in a **colocated `src/ui/<name>/<name>.scss`** compiled
  to a sibling `.css`; `src/ui/styles.css` is a pure `@import` aggregator — one
  line per component, nothing else. Rules touching `.uxm-<block>*` live in that
  block's file; cross-component rules live with the context component.
- No CSS-in-JS, no inline `style={}` for theming concerns (dynamic,
  non-themable values such as drag positions or a picker's current hue are the
  exception and SHOULD flow through CSS custom properties), no Tailwind in
  `src/ui` (Tailwind is studio/portal-only).

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
- Components are functional, one-per-folder (`<name>.tsx` + `<name>.scss` +
  `index.ts` barrel), **kebab-case filename**, PascalCase named export. No
  default exports.
- No `"use client"` / `"use server"` directives. Consumers (currently `modo`)
  are SPA; framework-specific pragmas leak abstractions.
- Versioning and `CHANGELOG.md` are **CI-owned**: semantic-release derives the
  bump from Conventional Commits, generates the changelog, stamps the AI-skill
  markers, and publishes. Commit types therefore carry semver meaning and MUST
  be chosen accordingly (`feat` = MINOR, `fix` = PATCH, `BREAKING CHANGE` =
  MAJOR).

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

- `npm run lint` (ESLint 9 flat config) **MUST** pass with zero errors before
  any commit that touches `src/`; disabling a rule requires an inline
  `// eslint-disable-next-line <rule> -- <reason>` comment.
- `npm run typecheck` (`tsc --noEmit`, library + portal) **MUST** pass with
  zero errors.
- `npm run build` (tsup multi-entry → `dist/{index,ui,tokens,…}`) **MUST**
  succeed and produce ESM + CJS + `.d.ts` + CSS for every exports map entry in
  `package.json`. A missing artifact is a release blocker.
- `tsconfig.json` `strict` stays on; new `any`, `// @ts-expect-error`, or
  `// @ts-ignore` requires an inline comment justifying it.
- **No new runtime dependencies** without explicit approval; `peerDependencies`
  are `react` / `react-dom` ^19 and that is intentional. Build/release-infra
  devDependencies (e.g. semantic-release plugins) are allowed with a
  justification in the introducing commit.
- Node engine floor stays at `>=20` to match `package.json` `engines`.

*Rationale:* This is a leaf library — its build output is the product. A lint,
typecheck or build failure ships broken conventions/types/CSS to every consumer.

## Distribution & Consumer Contract

- Published name: `@viax/uxm`; registry: Viax Nexus
  (`https://nexus.viax.tech/repository/viax-npm/`).
- Exports map in `package.json` is the canonical public surface. Adding a new
  entry is a MINOR; removing or renaming one is a MAJOR.
- `dist/` is the only directory shipped (plus `README.md`, `CHANGELOG.md`).
  Source files, skills, tests, configs **MUST NOT** be packaged.
- `prepublishOnly` runs `npm run build`; do **not** bypass it.
- Local consumers using `npm install file:../uxm` rely on `npm run dev` keeping
  `dist/` fresh — never commit a stale `dist/`.

## AI Skill & Agent Tooling

- The `viax-uxm` Claude skill (`skills/viax-uxm/` — SKILL.md + `references/`)
  is **authored in this repo**: the library is the source of truth for every
  fact the skill states. The shared `viax-ai-skills` GitLab repo is a
  distribution target only, synced from release commits **manually by the
  maintainer**. `/update-ai-skill` works only locally (drift-check +
  post-release cleanup in `skills/viax-uxm/`) and ends by reminding about the
  manual sync — Claude never pushes to the distribution repo.
- Any MR that adds, renames, or removes a public component **MUST** update the
  skill in the same MR: a catalog/cheatsheet row (marked "(unreleased)") and a
  bullet under `### Unreleased` in SKILL.md.
- The skill's version marker, component count, and the `### Unreleased` →
  `New in X.Y.Z` rename are **stamped by CI at release**
  (`scripts/stamp-skill-version.mjs` via semantic-release). Hand-editing these
  markers is prohibited — the stamp fails the release on marker drift, by
  design.
- `skills/` lives at the repo root, deliberately NOT under `.claude/skills/`,
  so it never auto-loads into Claude sessions in this repo (it targets
  consumer projects).
- Team-shared agent tooling is **tracked in git**: `.claude/` (agents,
  commands, handbooks, templates, memory, `settings.json`) and `.mcp.json`.
  Only per-user state (`.claude/settings.local.json`) stays untracked. Nothing
  under `.claude/` or `.mcp.json` may contain secrets, tokens, or
  machine-local absolute paths.

## Development Workflow & Quality Gates

1. **Branch & spec** — non-trivial work starts from a spec/plan generated via
   `.claude/templates/spec-template.md` + `plan-template.md`. The plan's
   *Constitution Check* section MUST be filled in.
2. **Implement** — follow Principles I–V; small, reviewable Conventional
   Commits (the commit type drives the semver bump). New/changed public
   components update the AI skill in the same MR (see AI Skill & Agent
   Tooling).
3. **Local gates (pre-PR)** — `npm run lint`, `npm run typecheck` and
   `npm run build` MUST be green. New visual primitives MUST be smoke-tested in
   the studio portal (`npm run dev:modo`) or the linked `modo` consumer,
   including dark theme.
4. **Review** — at least one human reviewer confirms the Constitution Check is
   accurate; any deviation MUST be documented in the plan's *Complexity /
   Tradeoffs* section.
5. **Release** — merging to `master` triggers CI: semantic-release computes the
   version from commits, writes `CHANGELOG.md`, stamps the skill markers, tags,
   and publishes to Nexus. After a release, sync the skill to `viax-ai-skills`
   via `/update-ai-skill`.

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
- **Deferred items.** None.

**Version**: 1.1.1 | **Ratified**: 2026-05-25 | **Last Amended**: 2026-09-07