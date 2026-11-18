# /update-ai-skill Command

Maintain the Claude skills this repo owns. **The editing source lives IN THIS REPO under
`skills/`** — three of them ship:

| Skill (here) | Ships to (`viax-ai-skills`) | What it is | Versioned with the library? |
|---|---|---|---|
| `skills/viax-uxm/` | `skills/ui/viax-uxm/` | The component/token reference consumers read | **Yes** — CI stamps its version marker, component count and `### Unreleased` heading at release |
| `skills/viax-portal/` | `skills/ui/viax-portal/` | The portal generator (SKILL.md + the BEM MetaPrompt) | **No** — no version marker, no `(unreleased)` qualifiers; it tracks the library's API by hand |
| `skills/viax-uxm-theming/` | `skills/ui/viax-uxm-theming/` | How ANY app consumes the published UXM Studio config — fetch, apply, identity | **No** — same as above. Owns the theming topic; `viax-portal` delegates to it, so a change here must not be duplicated there |

### The distribution layout, and why links here point "outside" this repo

`viax-ai-skills` groups its UI skills (ai/viax-ai-skills!177):

- `skills/ui/` — the React + `@viax.io/uxm` approach: our three, plus `viax-bem-discovery`,
  `viax-portal-generator` and `viax-uxm-conventions`.
- `skills/ui-layers/` — layers both approaches share: `viax-access`,
  `viax-graphql-data-layer`, `viax-keycloak-auth`, `viax-localization`.
- `skills/ui-dbs/` — the older Vue approach (`viax-dynamic-forms`, `viax-mfa-component-skill`).
- Everything else (`graphql/`, `business-execution-model/`, …) stays at the top of `skills/`.

The files here are copied **verbatim**, so every relative link in them is written for that
layout, not for this repo. From a `SKILL.md`:

| Target | Link |
|---|---|
| a sibling in `ui/` | `../viax-uxm-conventions/SKILL.md` |
| a shared layer | `../../ui-layers/viax-keycloak-auth/SKILL.md` |
| a top-level skill | `../../graphql/references/bcore-schema-v2.md` |

From a file under `references/`, add one more `../`. Links to other skills are dead inside
this repo by design (those skills don't live here). A link to the library itself never uses a
relative path: use `https://github.com/viax-io/uxm` (e.g. `…/uxm#cdn-usage`), which resolves in
both repos.

Steps 2 and 3 below (version check, leftover-qualifier check) apply to **`viax-uxm` only** —
`viax-portal` has no markers to stamp. Step 1 (drift + hygiene) and step 4 (sync) cover
**both**. The shared `viax-ai-skills` repo (`https://github.com/viax-io/viax-ai-skills`,
private; clone as `git@github-viax:viax-io/viax-ai-skills.git` with the work-account ssh
alias) is a DISTRIBUTION TARGET only — same model as the npm package itself (source here →
publish to npm). It migrated to GitHub alongside uxm but still runs its own release flow
(`main` → `release`, tag + zips) — follow ITS `CLAUDE.md`, not this one, for the release side.

**ALL Claude work happens locally in `skills/viax-uxm/` in this repo. Syncing to
`viax-ai-skills` (or any other repo) is done MANUALLY by the maintainer — Claude must not
clone, push, or open MRs against the distribution repo. Claude's job ends with the local
files correct + a reminder to the maintainer that a manual sync is (or isn't) due.**

## Lifecycle (who updates what, when)

| What | When | Who |
|---|---|---|
| Skill CONTENT (catalog rows, recipes, "### Unreleased" notes) | in the SAME feature PR as the library change | the author of the change |
| Version marker + component count + "### Unreleased" → "New in X.Y.Z" + "(unreleased)" qualifiers resolved | at release, automatically | CI: `scripts/stamp-skill-version.mjs` via `@semantic-release/exec` (see `.releaserc`); the stamped files land in the `chore(release)` commit |
| Sync to `viax-ai-skills` | after a release lands | the MAINTAINER, manually — this command only reminds |

Authors must NEVER hand-edit the version/count markers — the stamp script requires each
pattern to match exactly once and fails the release otherwise. Park not-yet-released notes
under the `### Unreleased` heading in SKILL.md; mark catalog rows for unreleased atoms with
"(unreleased)". Don't remove it after the release: the stamper does, dropping it inside a
"### New in X.Y.Z" section and rewriting it to "(X.Y.Z)" in the references (step 3 below).

## Usage

```
/update-ai-skill          # drift-check + version/qualifier check; reminds about the manual sync
```

## Workflow

### 1. Drift check (in this repo)

- Every `@viax.io/uxm/ui` export (from `src/ui/index.ts`) appears in
  `skills/viax-uxm/references/component-catalog.md` exactly once; removed atoms appear ONLY
  inside breaking-change notes. Report and fix any gap (content edits are fair game here —
  markers are not).
- Recipe code must compile against the current types — verify prop names against `src/ui`
  JSDoc, never from memory.
- Hygiene — run over **all** of `skills/`, not just `viax-uxm`:
  `grep -rniE "pavlo|/Users/|/home/|C:\\\\|localhost" skills/` → must be empty (keyboard-key
  names like `Home/End` are false positives). Reference the library ONLY as the GitHub repo
  (`https://github.com/viax-io/uxm`), the `@viax.io/uxm` package on npm, or
  repo-root-relative paths. Every skill here ships to consumers, so an absolute local path in
  any of them leaks a developer's machine — scoping this grep to one folder is how one
  survived in `viax-portal` undetected.
- `viax-uxm-theming` drift: it documents the GraphQL operations and the apply pipeline. When the
  config API changes, this skill is the FIRST thing to update — `viax-portal` points at it rather
  than repeating it, so fixing only the portal skill leaves the real source stale.
- Link layout: a new or edited cross-skill link follows the table under "The distribution
  layout" above. `grep -rnE "\]\(\.\./(\.\./)?viax-(access|graphql-data-layer|keycloak-auth|localization)/" skills/`
  must be empty (a shared layer reached as a sibling is the old, flat layout), and so must
  `grep -rn "README.md" skills/ | grep "\](\.\."` (the library README is linked by URL).
- `viax-portal` drift: the MetaPrompt hardcodes the API surface it generates against
  (GraphQL operations, `@viax.io/uxm` version floor, helper names). When the portal's config
  API or the library's public surface changes, verify against a REAL working portal rather
  than from the schema alone — the generated code is what people run.

### 2. Version check

- Published: `npm view @viax.io/uxm version`. Documented: the marker in
  `skills/viax-uxm/SKILL.md` (`Documents \`@viax.io/uxm\` **vX.Y.Z**`).
- Marker behind the published version → the release pipeline didn't stamp (investigate
  `.releaserc` / CI) — you may run `node scripts/stamp-skill-version.mjs <version>` manually
  on a fix branch.
- Marker equal and no obsolete "(unreleased)" qualifiers left in `skills/viax-uxm/` →
  report "skill is current", remind the maintainer to check that the manual sync to
  `viax-ai-skills` has been done for this version, and STOP.

### 3. Leftover-qualifier check

- The release resolves every "(unreleased)" qualifier itself
  (`scripts/stamp-skill-version.mjs`, pinned by `tests/stamp-skill-version.test.ts`), so after
  a release `grep -rn "unreleased" skills/viax-uxm` should find only the `### Unreleased`
  heading, its guidance comment, prose that is not a parenthesised qualifier, and history in
  `references/changelog.md`.
- Anything else is a form the stamper does not recognise. Fix it by hand on a normal branch
  (use the version from `git tag --contains <commit>`, never the latest one by default) AND
  teach the stamper that form with a test, so it is the last time. Never touch the
  version/count markers.

### 4. Remind about the manual sync (do NOT perform it)

Syncing to `viax-ai-skills` is the maintainer's manual step. Claude only reminds, every
run, whether a sync is due (distribution repo behind the published version) or appears
done. Reference checklist for the human (do not execute any of it):

- **First** check the distribution repo for direct edits since the last sync
  (`git log --follow origin/main --format='%h %an %s' -- skills/ui/<skill>/SKILL.md`, plus the
  same for each file under `references/`, for each of the three — `--follow` carries the
  history across the move from `skills/<skill>/`; anything that is not a `[VX-1736] … sync`
  commit must be ported INTO this repo before continuing — see gotchas.md → "The skills
  distribution repo gets edited directly"). The move itself (!177) is already ported.
- Copy **all three** verbatim into `viax-ai-skills` **under `skills/ui/`** —
  `skills/viax-uxm/` → `skills/ui/viax-uxm/`, `skills/viax-portal/` → `skills/ui/viax-portal/`,
  `skills/viax-uxm-theming/` → `skills/ui/viax-uxm-theming/` (never back to `skills/<skill>/`,
  which would recreate the old flat folders beside the grouped ones) — on a branch
  `feature/<ticket>-viax-uxm-skill-v<VERSION>` off up-to-date `main` (VX-1736 is the standing
  ticket used by past syncs). Then check every relative link in the three copies resolves in
  that repo (the links are written for its layout — see "The distribution layout" above). `viax-portal` has
  no version of its own — it rides the same sync, so a portal-skill change alone is still a
  reason to sync even when `viax-uxm` is unchanged.
- Run that repo's `bash scripts/validate-skills.sh` — must pass. Its `CLAUDE.md` → "Releasing"
  owns the plugin version: at the time of writing it asks for a `.claude-plugin/plugin.json`
  version bump IN the same PR and forbids touching `marketplace.json` (CI updates it) — re-read
  that section before each sync rather than trusting this line.
- Push, open a PR to `main` (`[VX-…]`-prefixed title summarising the version jump); the
  `main` → `release` PR that actually publishes the plugin is a separate step in that repo.

Report back: version jump, list of catalog rows added/changed/removed, recipes touched, and
an explicit reminder that the manual sync to `viax-ai-skills` is pending (or looks done).

## Authoring guide (for feature MRs)

Edit surgically — keep the existing prose conventions. Where each kind of change lands:

| Change | SKILL.md | component-catalog.md | quick-recipes.md | design-tokens.md |
|---|---|---|---|---|
| Breaking (removed/renamed atom) | "current API surface" section — old → new mapping incl. CSS-var prefixes | breaking-note under the header; replace the row; cheatsheet rows | replace usages; add an anti-pattern naming the dead export | retarget mentions |
| New component | bullet under `### Unreleased` | row in the right intent group (+ cheatsheet row), marked "(unreleased)" | new recipe ONLY for a new usage pattern | — |
| New prop / variant | only if it changes a stated convention | extend the row text | update affected recipes | — |
| Deprecation (constitution III) | bullet under `### Unreleased` naming the replacement and the removal major | the row starts with **Deprecated → `<replacement>`**; add a line to the "Deprecated" list under the header | replace usages in recipes with the replacement | retarget mentions |
| Token changes | — | — | — | update rows/values |

## Notes

- `skills/viax-uxm/` deliberately lives at the repo root, NOT under `.claude/skills/` — the
  skill targets CONSUMER projects and must not auto-load into Claude sessions in this repo.
- The historical copy in the `modo` repo (`modo/skills/viax-uxm`) is deprecated; modo should
  consume the skill from `viax-ai-skills` like every other project.