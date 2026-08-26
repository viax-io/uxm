# Repo Gotchas & Lessons Learned

Team-shared operational knowledge about *this* repository's tooling — the traps
that aren't obvious from the code and have bitten us before. Companion to
[`constitution.md`](./constitution.md) (which owns the *rules*); this file owns
the *lessons*. Add an entry when something non-obvious costs someone time.

---

## Git: never rely on a bare `git push` — push with an explicit target

**Safe practice (always):**

```sh
git checkout --no-track -b <name> master     # or origin/master
# …work…
git push -u origin <name>                     # explicit branch, first push
```

Then open an MR. `master` is protected **by convention only** — GitLab does not
enforce it — so nothing stops a mis-targeted push from landing there and
triggering a release (CI runs `semantic-release` on `master`).

**Why this matters — the v3.0.1 incident.** A branch was once created with
`git checkout -b <name> origin/master` (tracking `origin/master`); a bare
`git push` from it then went **straight to `master`**, bypassing MR review and
cutting release **v3.0.1** (commit `f6fea61`). The push silently became "push to
master" because the branch's upstream was `origin/master` and the push config at
the time honoured the upstream.

**Current state (verified 2026-07-16) — hardened, but don't lean on it.** The
repo's local git config is now `push.default = current` and
`branch.autoSetupMerge = simple`, which together neutralise that exact trap: a
bare push goes to a *same-named* remote branch (not the upstream), and
`checkout -b foo origin/master` won't even set up master-tracking (name
mismatch). **BUT** these live in `.git/config`, which is **not** version-
controlled — a fresh clone reverts to git defaults, where the trap can resurface
depending on `push.default`. So the `--no-track` + explicit `git push -u origin
<name>` habit stays the rule, regardless of local config.

If a stray direct-to-master push ever happens: don't panic-revert — CI will have
already released. Verify the gates were green, treat it as a merged change, and
tell the user immediately.

---

## lint-staged: a markdown/CSS/JSON-only commit prints "no matching files" — that's fine

The pre-commit hook runs lint-staged, whose only configured task is
`*.{ts,tsx,js,jsx,mjs,cjs}` → `eslint --fix` (see `package.json` → `lint-staged`).

A commit that stages **only** files outside that glob — `.md` (READMEs,
`todo/*.md`), `.css` / `.scss`, JSON — prints:

> → lint-staged could not find any staged files matching configured tasks.

This is a **benign no-op, not a failure.** The commit still completes normally.
Don't treat it as an error, retry, or re-stage — confirm success via the usual
`[branch hash] message` + file-count line that follows.

---

## semver: don't force a `major` for internal-atom refactors

Releases are cut by `semantic-release` from conventional commits, and a
`BREAKING CHANGE:` footer (on **any** commit in the release range) forces a
**major** bump for the whole `@viax/uxm` package — every consumer must then
migrate. Reserve that for changes that actually break a **known external
consumer contract**.

**Don't add a `BREAKING CHANGE:` footer just because a component's internals
changed** — a changed root element, renamed inner BEM node, or reshuffled
prop-forwarding on a niche/internal atom is not a semver break when no external
consumer relies on the old shape. Ship it as the `minor`/`patch` the `feat`/`fix`
commits already imply, and **document the structural change in the component's
README** (current DOM + a "target `X` instead of `Y`" migration hint) so anyone
who was depending on it can adjust.

**Precedent:** `ConfigComponentRow`'s root changed `<button>` → `<div>` (so the
new `actions` slot could hold sibling `IconButton`s instead of nested ones). It
was first over-flagged with a `BREAKING CHANGE:` footer; that was removed and it
shipped as a **minor** in **v3.2.0** with the change documented in
`src/ui/config-component-row/README.md`. Judgement call, not a blanket rule — if
a change genuinely alters a widely-consumed public API, a major is still right.

**How to apply:** before writing a `BREAKING CHANGE:` footer, ask "does an
external consumer's code actually break?" If it's editor-internal / studio-only
surface, prefer minor + a README note. (See `constitution.md` for the
semantic-release flow.)

---

## SKILL.md: always leave a bare `### Unreleased` heading behind

`scripts/stamp-skill-version.mjs` renames the skill's unreleased section by
matching **the exact string `### Unreleased`** and nothing else:

```js
if (/^### Unreleased$/m.test(skill)) {
  skill = skill.replace(/^### Unreleased$/m, `### New in ${version}`);
}
```

It renames in place — it does **not** open a fresh `### Unreleased` for the next
cycle. So the heading only survives if the next MR that adds notes recreates it.

**The trap:** a release stamps `### Unreleased` → `### New in 3.0.2`; the next MR
appends its bullets under that now-versioned heading instead of adding a new
`### Unreleased`. From then on the stamper's regex matches nothing, so every
later release is a silent no-op and notes keep piling up under a version they
didn't ship in.

**This actually happened — 3.0.2 → 3.2.1.** The Typography / `fontFileUrl` items
shipped in **3.1.2** (see `CHANGELOG.md`) but sat under `### New in 3.0.2` for
four releases, and the next icon note would have inherited the same wrong label.
Fixed in the `feat/language-icon` MR (!73): the block was relabelled `New in
3.1.2` and a fresh `### Unreleased` opened above the new notes.

**How to apply:** when adding skill notes, check the heading you're writing
under. If it reads `### New in X.Y.Z`, do **not** append to it — add a new
`### Unreleased` section below it and put your bullets there. Don't hand-edit
version/count markers either way; the stamper owns those. (See
`.claude/commands/update-ai-skill.md` for the full lifecycle.)

**Second half of the same trap: `### Unreleased` goes at the BOTTOM.** The
version run is ordered **ascending** — `### 2.0.0 baseline` at the top, newest
last — so a fresh `### Unreleased` belongs *after* the highest `### New in
X.Y.Z`, not above it. The stamper renames in place and never reorders, so a
section parked in the wrong slot is frozen there by the next release and the
history reads scrambled from then on.

**This actually happened — 4.5.0 landed before 4.4.0.** The
`fix/editable-cell-picker-open-chrome` MR opened its `### Unreleased` above the
then-current `### New in 4.4.0`; the 4.5.0 release stamped it where it sat,
leaving `4.3.0 → 4.5.0 → 4.4.0` on master. Nothing broke (the stamper's
`/^### Unreleased$/m` is position-independent) but the file had to be reordered
by hand afterwards in `fix/skill-version-heading-order`. Both the code review
of that MR and the MR itself missed it — the heading rename looks correct in
isolation, and only the surrounding order reveals the problem, so check the
neighbouring headings, not just your own.

---

## Skill-file branches: catalog rows are one physical line — parallel branches conflict wholesale; resolve by re-applying, not hand-merging

`component-catalog.md` keeps each component's entire description on ONE physical
line (a markdown table row), and SKILL.md bullets are near-neighbours. Two
consequences that are not obvious until they bite:

1. **Any two branches that touch the same component's row conflict on the whole
   row** — even when the edits are semantically disjoint (one strips an
   `(unreleased)` qualifier, the other appends a sentence). Git cannot merge
   within a line.
2. **The conflict block engulfs neighbouring rows.** A same-region edit makes
   the `<<<<<<<` block span every row between the two changes (five components'
   rows for a two-row overlap, in practice), which looks much scarier than it
   is.

**How to resolve (the process that works):**

1. `git rebase origin/master` on the skill/fix branch.
2. In the conflict block, **take the master side wholesale as the base** —
   never try to hand-merge two 1,000-character lines; you will drop a clause
   and nobody will notice in review.
3. **Re-apply your branch's semantic edits onto that base with a script** —
   exact-string replacements with an assert that each anchor matches exactly
   once (`assert t.count(old) == 1`). A failed assert means master's text
   drifted under you — stop and look, don't force.
4. Verify beyond the markers: `grep -c '(unreleased)'` (or whatever the other
   branch's edit was) must show master's state preserved, and the version-run
   headings must still be ordered. Then `git push --force-with-lease`.

**Prevention:** when two of your own branches must edit the same catalog rows,
either stack them (base the second on the first) or say the conflict out loud
in the handoff — a predicted two-line conflict costs a minute; a surprise one
costs a review round-trip.

**This actually happened — 26-08-2026.** `docs/skill-drift-sync-4.26` (dropped
15 stale `(unreleased)` qualifiers) and `fix/sidebar-status-dot-a11y` (amended
the AppSidebar + SidebarNavItem rows) both touched the sidebar rows; the sync
branch merged first and the fix MR conflicted exactly as predicted at handoff.
The take-master-then-re-apply script resolved it in one pass; the naive
hand-merge would have had to reconcile a five-row block by eye.