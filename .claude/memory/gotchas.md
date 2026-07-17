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