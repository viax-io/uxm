# /update-ai-skill Command

Maintain the `viax-uxm` Claude skill. **The editing source lives IN THIS REPO:
`skills/viax-uxm/`** (SKILL.md + `references/`). The shared `viax-ai-skills` GitLab repo
(`ssh://git@ssh.gitlab.viax.tech:2222/ai/viax-ai-skills.git` — port 22 on the bare host
times out) is a DISTRIBUTION TARGET only — same model as the npm package itself (source
here → publish to Nexus).

**ALL Claude work happens locally in `skills/viax-uxm/` in this repo. Syncing to
`viax-ai-skills` (or any other repo) is done MANUALLY by the maintainer — Claude must not
clone, push, or open MRs against the distribution repo. Claude's job ends with the local
files correct + a reminder to the maintainer that a manual sync is (or isn't) due.**

## Lifecycle (who updates what, when)

| What | When | Who |
|---|---|---|
| Skill CONTENT (catalog rows, recipes, "### Unreleased" notes) | in the SAME feature MR as the library change | the author of the change |
| Version marker + component count + "### Unreleased" → "New in X.Y.Z" | at release, automatically | CI: `scripts/stamp-skill-version.mjs` via `@semantic-release/exec` (see `.releaserc`); the stamped files land in the `chore(release)` commit |
| Post-release cleanup (drop obsolete "(unreleased)" qualifiers) in `skills/viax-uxm/` | after a release lands | this command, locally in this repo |
| Sync to `viax-ai-skills` | after a release lands | the MAINTAINER, manually — this command only reminds |

Authors must NEVER hand-edit the version/count markers — the stamp script requires each
pattern to match exactly once and fails the release otherwise. Park not-yet-released notes
under the `### Unreleased` heading in SKILL.md; mark catalog rows for unreleased atoms with
"(unreleased)" — and drop that word during post-release cleanup (step 3 below).

## Usage

```
/update-ai-skill          # drift-check + local post-release cleanup; reminds about the manual sync
```

## Workflow

### 1. Drift check (in this repo)

- Every `@viax/uxm/ui` export (from `src/ui/index.ts`) appears in
  `skills/viax-uxm/references/component-catalog.md` exactly once; removed atoms appear ONLY
  inside breaking-change notes. Report and fix any gap (content edits are fair game here —
  markers are not).
- Recipe code must compile against the current types — verify prop names against `src/ui`
  JSDoc, never from memory.
- Hygiene: `grep -rniE "pavlo|/Users/|/home/|C:\\\\|localhost" skills/viax-uxm/` → must be
  empty (keyboard-key names like `Home/End` are false positives). Reference the library ONLY
  as the GitLab repo (`https://gitlab.viax.tech/services-viax/uxm`), the `@viax/uxm` package
  on Nexus, or repo-root-relative paths.

### 2. Version check

- Published: `npm view @viax/uxm version`. Documented: the marker in
  `skills/viax-uxm/SKILL.md` (`Documents \`@viax/uxm\` **vX.Y.Z**`).
- Marker behind the published version → the release pipeline didn't stamp (investigate
  `.releaserc` / CI) — you may run `node scripts/stamp-skill-version.mjs <version>` manually
  on a fix branch.
- Marker equal and no obsolete "(unreleased)" qualifiers left in `skills/viax-uxm/` →
  report "skill is current", remind the maintainer to check that the manual sync to
  `viax-ai-skills` has been done for this version, and STOP.

### 3. Post-release cleanup (local, in this repo)

- Once the release has landed (marker stamped to the published version), remove the
  "(unreleased)" qualifiers that the release has made obsolete — in THIS repo's
  `skills/viax-uxm/` files. Leave the stamper-guidance comment in SKILL.md untouched.
- These are content edits on a normal feature branch of this repo — never touch the
  version/count markers.

### 4. Remind about the manual sync (do NOT perform it)

Syncing to `viax-ai-skills` is the maintainer's manual step. Claude only reminds, every
run, whether a sync is due (distribution repo behind the published version) or appears
done. Reference checklist for the human (do not execute any of it):

- Copy `skills/viax-uxm/` verbatim into `viax-ai-skills` (same relative path) on a branch
  `feature/<ticket>-viax-uxm-skill-v<VERSION>` off up-to-date `main` (VX-1736 is the
  standing ticket used by past syncs).
- Run that repo's `bash scripts/validate-skills.sh` — must pass. Do NOT bump
  `.claude-plugin/plugin.json` or touch `marketplace.json` — plugin releasing is the skills
  repo's own CI-driven flow (see its `CLAUDE.md`).
- Push, open an MR (`[VX-…]`-prefixed message summarising the version jump).

Report back: version jump, list of catalog rows added/changed/removed, recipes touched, and
an explicit reminder that the manual sync to `viax-ai-skills` is pending (or looks done).

## Authoring guide (for feature MRs)

Edit surgically — keep the existing prose conventions. Where each kind of change lands:

| Change | SKILL.md | component-catalog.md | quick-recipes.md | design-tokens.md |
|---|---|---|---|---|
| Breaking (removed/renamed atom) | "current API surface" section — old → new mapping incl. CSS-var prefixes | breaking-note under the header; replace the row; cheatsheet rows | replace usages; add an anti-pattern naming the dead export | retarget mentions |
| New component | bullet under `### Unreleased` | row in the right intent group (+ cheatsheet row), marked "(unreleased)" | new recipe ONLY for a new usage pattern | — |
| New prop / variant | only if it changes a stated convention | extend the row text | update affected recipes | — |
| Token changes | — | — | — | update rows/values |

## Notes

- `skills/viax-uxm/` deliberately lives at the repo root, NOT under `.claude/skills/` — the
  skill targets CONSUMER projects and must not auto-load into Claude sessions in this repo.
- The historical copy in the `modo` repo (`modo/skills/viax-uxm`) is deprecated; modo should
  consume the skill from `viax-ai-skills` like every other project.