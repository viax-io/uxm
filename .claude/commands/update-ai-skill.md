# /update-ai-skill Command

Update the shared `viax-uxm` Claude skill (in the `viax-ai-skills` GitLab repo) to match the
latest published `@viax/uxm` release. Run this from the uxm repo after a release lands —
THIS checkout is the source of truth for the library surface; the skill repo is the target.

## Usage

```
/update-ai-skill
```

## Workflow

When invoked, perform the following steps **in order**:

### 1. Compute the version delta

- **Published version**: `npm view @viax/uxm version` (Viax Nexus registry:
  `https://nexus.viax.tech/repository/viax-npm/`). If the working tree contains unreleased
  commits beyond that version, warn the user — the skill documents PUBLISHED releases only.
- **Documented version**: locate a checkout of `viax-ai-skills`
  (`git@gitlab.viax.tech:ai/viax-ai-skills.git`; ask the user for the path, or clone into a
  temp dir). Parse the marker at the top of `skills/viax-uxm/SKILL.md`:
  `Documents \`@viax/uxm\` **v(X.Y.Z)**`.
- Versions equal → report "skill is current" and STOP.

### 2. Build the change inventory (from THIS repo)

- `CHANGELOG.md` — one section per release between documented and published versions;
  BREAKING CHANGE notes carry the migration guide verbatim. This is the primary input.
- Export diff: `src/ui/index.ts` export list vs the component names in the skill's
  `references/component-catalog.md` → **added** / **removed** / **renamed** (a paired
  removal + addition in a BREAKING CHANGE note is a rename).
- For changed atoms, read the source JSDoc (`src/ui/{atom}/{atom}.tsx`) — never document
  props from memory.
- Tokens: check whether `src/tokens/index.ts` changed in the range (`git log <range> --
  src/tokens/`). Usually it doesn't.

### 3. Apply the updates in the skills checkout

Work on a feature branch off up-to-date `main`:
`feature/<ticket>-viax-uxm-skill-v<NEW_VERSION>`. Edit surgically — keep the existing prose
conventions and structure. Where each kind of change lands:

| Change | SKILL.md | component-catalog.md | quick-recipes.md | design-tokens.md |
|---|---|---|---|---|
| Breaking (removed/renamed atom) | "current API surface" section — first thing after the marker; old → new mapping incl. CSS-var prefixes | breaking-note under the header; replace the row; cheatsheet rows | replace usages; add an anti-pattern naming the dead export | retarget mentions |
| New component | one bullet in the "new since" list | row in the right intent group (+ new group only for a new architectural layer); cheatsheet row | new recipe ONLY for a new usage pattern (mount-once outlet, compound component, imperative API, render-prop trigger) | — |
| New prop / variant | only if it changes a stated convention | extend the row text | update affected recipes | — |
| Token changes | — | — | — | update rows/values |

Update in lockstep: the version marker, and the component count everywhere it appears
(marker, skill description frontmatter, catalog header — all must agree).

### 4. Hygiene gate (hard requirements)

- `grep -rniE "pavlo|/Users/|/home/|C:\\\\|localhost" skills/viax-uxm/` → must be empty
  (keyboard-key names like `Home/End` are false positives). Reference the library ONLY as
  the GitLab repo (`https://gitlab.viax.tech/services-viax/uxm`), the `@viax/uxm` package on
  Nexus, or repo-root-relative paths — no usernames, personal machines, or local config.
- Every `@viax/uxm/ui` export appears in the catalog exactly once; removed atoms appear ONLY
  inside breaking-change notes.
- Recipe code must compile against the new types — verify prop names against `src/ui` or the
  published `.d.ts`.
- Run the skill repo's `bash scripts/validate-skills.sh` — must pass.

### 5. Deliver

Commit on the feature branch (`[VX-…]`-prefixed message summarising the version jump), push,
open an MR to the skills repo's `main`. Do NOT bump `.claude-plugin/plugin.json` or touch
`marketplace.json` — plugin releasing is the skills repo's own CI-driven flow (see its
`CLAUDE.md`).

Report back: version jump, list of catalog rows added/changed/removed, recipes touched, and
the MR link (or branch name if MR creation isn't possible).
