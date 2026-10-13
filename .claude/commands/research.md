# /research Command

Quick feasibility & fit research. A lightweight, **read-only** pre-step before
`/start-task`: use it when you have a vague idea and want to know whether it fits
`@viax.io/uxm`, what already exists, and which approaches are viable — without
committing to a spec or a branch.

## Usage
```
/research "topic or idea"
```

## Examples
```
/research "should we add a Combobox atom?"
/research "virtualised rows in Table for 10k items"
/research "expose the studio theme editor as a standalone embeddable widget"
/research "replace sass with lightningcss in the build"
```

## Arguments
- `$ARGUMENTS` — the topic, idea, or question. Can be vague. If empty, ask the
  user (AskUserQuestion) what they want to investigate.

## Place in the workflow

```
/research (optional) → /start-task → /code-review → /end-task
```

Skip `/research` when you already know what to build. Use it when:
- the idea is half-formed and needs a quick feasibility check;
- you're unsure whether something similar already exists in `src/ui/`, `src/studio/`, …;
- you want to compare approaches before writing a spec/plan;
- you need to check the idea against the layer boundaries and the Constitution.

| Command | Input | Purpose | Output |
|---------|-------|---------|--------|
| `/research` | Vague idea or topic | Does it fit? What exists? What are the options? | Feasibility report |
| `/start-task` | Concrete task description | Build/fix it under the full workflow | Code + spec/plan |

## PHASE 1: Load context

1. Read `.claude/memory/constitution.md` — the rules (Principles I–VI, Distribution
   & Consumer Contract, AI Skill & Agent Tooling, quality gates). It wins over any
   handbook.
2. Read `.claude/memory/gotchas.md` — lessons from past work in related areas.
3. `CLAUDE.md` is already in context — use it for the four layers
   (`studio / previews → ui → tokens`), the two-layer theming model, the build
   pipeline and the studio-i18n rule.
4. Read `.claude/handbooks/react-style-guide.md` only if the idea is a new or
   changed component. **Never** use `.claude/handbooks/legacy/` (Vue-era library).
5. Check for overlap with existing or planned work: list `todo/` (local,
   gitignored — plans, audits, earlier research in `todo/research/`) and scan
   `CHANGELOG.md` + `skills/viax-uxm/SKILL.md` (`### Unreleased`) for the topic.
6. Parse `$ARGUMENTS`. If empty, ask what to investigate.

If existing work already covers the topic, say so and ask whether to research
anyway or continue from that work.

## PHASE 2: Codebase investigation

### Step 1: Keywords
Extract 3–7 search terms from the topic: technical terms, domain concepts,
library names, pattern names, likely component/folder names (kebab-case, as in
`src/ui/<name>/`).

### Step 2: Search
For each keyword, Grep/Glob across `src/`, `portal/`, `scripts/`, `tests/`,
`skills/viax-uxm/`, the per-atom `src/ui/*/README.md` files and `README.md`.
Read the most relevant files (≈10 total). Enumerate `src/ui/` rather than
trusting component counts in prose. For a broad sweep, delegate to an `Explore`
subagent and keep only its conclusions.

Map what you find:
- **Existing code** — atoms, previews, studio editors/registry entries, helpers
  (`@/helpers`, `@/hooks`, `@/lib`) that already relate.
- **Closest analogue** — the existing atom/pattern the idea would be modelled on.
- **Reusable abstractions** — floating-layer/focus-trap logic, controlled/
  uncontrolled bridges, `cn()`, WCAG helpers, persistence adapters, etc.
- **Dependencies** — relevant packages already in `package.json`
  (`dependencies` vs `peerDependencies` matters for consumers).

### Step 3: Constitution & architecture check
Cross-reference the idea against:
- **Layer boundaries** — `ui` must not import `studio|previews`; `tokens`
  imports nothing; no `Preview` symbol may leak into `/ui` (ESLint-enforced).
- **Token-first styling** — every value through
  `var(--uxm-<comp>-<prop>, var(--color-<token>))`; Tailwind only in `src/studio/`.
- **BEM** — `uxm-` prefix, canonical `--` modifiers.
- **API stability & semver** — would it remove/rename an export or a `--uxm-*`
  variable (snapshotted in `tests/__snapshots__/`) → MAJOR?
- **A11y / WCAG**, **build hygiene** (the 5-step build chain, CJS + ESM + DTS,
  CDN bundle), **localisation boundary** (atoms ship no copy; studio strings go
  through `t()` in all locales).
- **Distribution** — impact on bundle size, tree-shaking, peer deps, the CDN build.
- **AI skill** — a public component change must update `skills/viax-uxm/` in the
  same PR.

## PHASE 3: External research (signal-based)

**Conditional.** Run it only when at least one signal is present:

| Signal | Example |
|--------|---------|
| Library/package not yet in the project | "use Floating UI", "add react-virtual" |
| Browser/platform API not yet used | "Popover API", "CSS anchor positioning", "View Transitions" |
| Pattern absent from the codebase | "headless hooks layer", "compound components via context" |
| Build/tooling change | "switch to lightningcss", "Rolldown instead of tsup" |
| A11y pattern needing an authoritative reference | "combobox", "treegrid", "date grid" |
| Performance technique | "virtualisation", "container queries for density" |

No signals → skip this phase; the codebase analysis is enough.

With signals:
- **Named library/framework** → Context7 first (`resolve-library-id` →
  `query-docs`); fall back to WebSearch if it has no docs.
- **A11y patterns** → the WAI-ARIA Authoring Practices pattern for the widget.
- **Browser APIs** → current support (MDN / caniuse) against the consumers' targets.
- **Alternatives / patterns** → WebSearch; compare 2–3 options (maintenance,
  adoption, React 19 compatibility, bundle size, SSR safety, ESM+CJS support).

Keep it short — a feasibility check, not an evaluation.

## PHASE 4: Report

Render the full report **in the console**. Don't write a file yet.

```markdown
# Research: [Topic]

**Date**: [YYYY-MM-DD]
**Topic**: [user's original wording]
**Verdict**: Feasible | Feasible with Caveats | Not Recommended

## Summary
[3–5 sentences: what the idea is, whether it fits uxm, the recommended direction]

## Codebase Findings

### Existing related code
| Area / layer | Files | Relevance |
|--------------|-------|-----------|
| [ui / studio / previews / tokens / build] | [paths] | [how it relates] |

### Closest analogue & reusable pieces
- [atom / helper / pattern]: [how it could be leveraged]

### Gaps
- [what's missing]

## Constitution & Architecture Constraints
| Rule | Impact on this idea |
|------|---------------------|
| [Principle / boundary] | [constrains or enables how] |

**Semver impact**: PATCH | MINOR | MAJOR — [why: new export / new `--uxm-*` var / removed knob …]

## Approaches

### Option A: [Name]
- **Description**: [1–2 sentences]
- **Pros**: …
- **Cons**: …
- **Complexity**: Low / Medium / High

### Option B: [Name]
…

**Recommended approach**: [Option X] — [one-line rationale]

## External Research
[Only if Phase 3 ran; otherwise omit the section.]

| Library / API | Status | Compatibility | Notes |
|---------------|--------|---------------|-------|

### References
- [links consulted]

## Complexity Assessment
| Dimension | Rating | Notes |
|-----------|--------|-------|
| Codebase changes | Low/Med/High | [layers + rough file count] |
| New dependencies | Low/Med/High | [packages; dep vs peerDep] |
| Follow-on work | Low/Med/High | [AI skill, README, styles.css import, i18n locales, snapshots, previews/registry] |
| Risk | Low/Med/High | [what could go wrong] |

## Recommendation
- **Proceed**: `/start-task <name> "<refined description>"`
- **Open questions**: `/start-task <name> "<description>"` — it will clarify [uncertainties] first
- **Not recommended**: [reason]. Consider [alternative] instead.
```

## PHASE 5: Save & next steps

1. Ask with AskUserQuestion: **"Save this research to a file?"**
   - **Yes** → write `todo/research/YYYY-MM-DD-<topic-slug>.md` (create the
     folder if needed; slug = 2–4 kebab-case words; on collision append `-2`,
     `-3`, …). `todo/` is gitignored, so the file stays local — say so, and
     confirm the path.
   - **No** → nothing; the report lives in the console only.
2. Print next steps, tailored to the verdict (lead with the alternative when
   not recommended):
   ```
   Next steps:
   - To proceed: /start-task <name> "<refined description>"
   - To dig deeper: /research "<narrower sub-topic>"
   - To shelve: no action needed
   ```

## IMPORTANT RULES

1. **Lightweight** — useful in minutes, not hours. Trim anything that doesn't
   help the decision.
2. **Read-only** — no source edits, branches, commits, installs or builds. The
   only write allowed is the optional report in `todo/research/`.
3. **Signal-based web research** — no WebSearch unless Phase 3 signals justify it.
4. **Constitution-aware** — every verdict accounts for the layer boundaries,
   token-first styling, semver contract and the i18n/localisation boundary.
5. **Check for overlap** — `todo/`, `CHANGELOG.md`, `### Unreleased` in the skill.
6. **Recommend concretely** — always end with a copy-pasteable `/start-task`
   (or an alternative) carrying a refined description.
7. **No hosting decisions** — for CDN/hosting topics, list the options and their
   constraints but leave the platform choice to DevOps.
