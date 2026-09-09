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

Then open a PR. `master` is protected **by convention only** — and on GitHub it
is deliberately left unprotected, because `@semantic-release/git` pushes its
`chore(release)` commit with the default `GITHUB_TOKEN`, which cannot write to a
protected branch. Nothing stops a mis-targeted push from landing there and
triggering a release (the Release workflow runs `semantic-release` on `master`)
— the only net under it is that the Release job re-runs lint / typecheck /
check:drift / test before `semantic-release`, so a push that would fail CI is
stopped before it is tagged and published. A push that passes still releases.

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
**major** bump for the whole `@viax.io/uxm` package — every consumer must then
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

**Third variant of the same trap: an MR that outlives a release gets its
bullets silently folded under the freshly stamped heading at merge.** You
write your notes under `### Unreleased`; while your MR is open, another MR
releases and the stamper renames that heading on master; when your MR then
merges, git reconciles your addition INTO the renamed (`### New in X.Y.Z`)
section — your change ships in the NEXT release but its notes sit under the
previous one, and that next release finds `### Unreleased` bare so it stamps
no heading at all. Nothing in the diff looks wrong at merge time.

**This actually happened — 26-08-2026, the AA-floor bullet.** Written under
`### Unreleased` on `fix/type-scale-followups`; 4.28.2 released mid-flight
and stamped that heading; the merge folded the bullet under `### New in
4.28.2` although the change shipped in 4.28.3 — which then stamped markers
but no heading (bare Unreleased is legitimately skipped). Fixed by
hand-relabelling in `docs/skill-relabel-4.28.3`. **How to apply:** after any
merge that crossed a release boundary (yours or master's), check WHERE your
bullets ended up — the heading above them must name the release your change
actually shipped in. When splicing headings by script, anchor on
`^### Unreleased$` (line-anchored, last occurrence) — the guidance comment
QUOTES the heading mid-line and a bare substring search hits the quote first.

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

---

## A per-state var whose fallback is the resting value ships a dead rule

`var(--uxm-<comp>-hover-<prop>, <resting value>)` looks like a correct two-layer
declaration and compiles to a real `:hover` rule — but with no var set it paints
exactly what the resting rule already painted, so the state is invisible. It
passes review easily because the *studio looks right*: the preview and
`preview-modal` project every registry knob's `defaultValue` as an inline
`--uxm-*` var, so the workbench is never running the fallback path a consumer
runs. Only an app that imports the compiled CSS and sets no vars sees the bug.

**This actually happened — `ToggleSwitch` hover.** All four
`--uxm-toggle-switch-hover-*` fallbacks echoed the resting colour
(`--color-border` / `--color-accent`) while `registry/inputs.ts` (now
`registry/inputs/toggle-switch.ts`) declared
`--color-text-muted` / `--color-accent-bold` as the hover defaults. The atom's
own README even documented the symptom as intended ("no additional colour change
in baseline styles"). Reported from a consumer project, not caught here.

**How to apply:** the fallback of a per-state var is that STATE's default, and
the registry's `defaultValue` for the matching knob is the source of truth —
diff the two whenever you touch either. A fallback that *equals* the resting
value is fine when the registry declares it that way — the rule then exists as
an override hook for a property the state deliberately leaves alone
(`--uxm-checkbox-hover-unchecked-bg`, the hover thumb colours). It's a bug only
when the registry says something else. Verify hover/focus in the portal (or any
consumer) with **no** overrides saved, never by reading the studio preview.
`Checkbox` and `RadioGroup` had the same dead fallbacks and were fixed
alongside, as was `disabledOpacity` on all three (registry 0.4 vs 0.6/1/0.6 in
CSS). The `disabled-opacity` half of this class is now CLOSED: a scripted
registry-vs-SCSS diff (every `disabledOpacity` `defaultValue` against every
`--uxm-<id>-disabled-opacity` fallback) found 19 drifting declarations across
17 components, all brought to their registry values in the
`fix/small-control-hover-defaults` MR — the target differs per component
(0.4 / 0.5 / 0.55 / 0.6), so always diff against the registry entry, never
assume one number. `PillSelect` stays `1` by design (registry says so).
The hover/pressed half is closed too (same MR): the scripted diff over the
state knobs of `FilterTabs`, `ViewSwitcher`, `ButtonGroup`, `Disclosure`,
`List` and the `Button` family found 16 more dead fallbacks, all brought to
their registry values. **The script is now checked in:
`node scripts/check-state-var-drift.mjs`** — run it whenever you touch a
per-state knob or registry default (eyeballing found 5 of the first 19). It
normalises whitespace (a multiline `var()` like `ButtonPrimary`'s `color-mix`
hover defeats single-line regexes) and accepts `px`-suffixed CSS fallbacks
for bare numeric registry defaults. Treat a hit as "go look", not "go fix":
of the 19 hits its first full-repo run produced, **7 were legacy-alias
chains** — `var(--uxm-x-new, var(--uxm-x-old, <token>))` where the innermost
token already matched the registry (the script now resolves those) — and 11
were real and are fixed, so the script runs green (exit 0) — and now GATES
CI: the `.github/workflows/ci.yml` `verify` job runs `npm run check:drift`, so a knob
default and its SCSS fallback can no longer disagree without failing the
pipeline.
Three of the 11 changed a *visible aesthetic*, not just a dead state, and
are flagged for design review in the MR: `tabs-underline.barColor`
(accent-bold → accent — the underline bar lightens), icon-button pressed
fill (surface-alt → surface), and `slider.hoverThumbColor` (the alias to the
resting thumb var was replaced by the registry's accent-bold — a themed
resting thumb no longer drags the hover tone with it). `PillSelect` is NOT on this list: its
registry default is `1` **by design** (`composite.ts` — dimming would
double-dim already-muted chips), so its flat disabled look is correct. Check
any per-state block against the registry before assuming it's clean.

---

## A styled class nobody renders is invisible in review

`.uxm--message` sat in `toggle-switch.scss` and `radio-group.scss` for months.
It reads as a plausible BEM-ish block, the properties inside it were correct,
and the comment above it named the right variables — but no component renders
that class (the atoms pass `uxm-{id}__error-message` to `FieldError`), so the
error message shipped unstyled: inherited colour, inherited size, no margin.
`checkbox.scss`, the file they were copied from, has the right selector.

**How to apply:** a selector is only real if something renders it. When adding
or reviewing a rule for a class that isn't built from `&`-nesting inside its
block, grep the class name in `src/ui/**/*.tsx` before trusting it. It's the
same failure as a dead fallback — CSS that exists, parses, and paints nothing —
and neither lint, typecheck, build nor the studio will say a word.

---

## `npm run lint` lints `todo/` — keep scratch out of the ESLint walk

`todo/` is gitignored scratch space (plans, reviews, pasted snippets), but ESLint
walks the working tree, not the git index. One pasted minified `.js` or a scratch
`.mjs` there turned `npm run lint` into 15 000+ errors while CI stayed green
(CI never sees `todo/`). The audit of 07-09-2026 found the `/code-review` agent
had already adapted by running the gates in a fresh worktree — i.e. the local
gate was silently dead.

**Fixed:** `todo/**` is in `eslint.config.mjs` `ignores`. **How to apply:** if
lint suddenly reports thousands of errors from files you never touched, check
the path in the first error before debugging — and add any new scratch folder to
`ignores` rather than to `.gitignore` alone.

---

## MCP servers in `.mcp.json`: a launcher script that isn't committed is a dead server

`.mcp.json` is tracked and shared; anything it runs must be too. The
`chrome-devtools` entry once pointed at `./scripts/chrome-devtools-mcp.sh`,
which was never committed — every session (and every clone) started with
`ENOENT`, and the `runtime-debugger` agent's "Chrome DevTools MCP" tool set was
unavailable without anyone noticing. **Now:** the entry runs
`npx -y chrome-devtools-mcp@latest` directly, no local script.

Expected noise, not a bug: `figma-dev-mode-mcp-server` (`http://127.0.0.1:3845`)
fails to connect whenever Figma Desktop isn't running with Dev Mode MCP enabled.
Treat that as "Figma is closed", not as a config problem.

---

## The Nexus proxy-lag lockfile trap — historical, does not apply on public npm

Kept so nobody reintroduces the workaround. While the package installed from the
Viax Nexus proxy, `npm audit fix` resolved through registry.npmjs.org and could
lock a version published minutes earlier that Nexus's cached packument did not
list yet. Locally nothing broke (the tarball was already in `~/.npm`); CI had no
cache, installed through Nexus, and died with
`404 Not Found … electron-to-chromium-1.5.423.tgz` before a single test ran
(08-09-2026, MR !166, job 1554352).

`scripts/check-lock-nexus.mjs` and the `check:lock` script existed only to catch
that, and were removed with the npm migration: install and audit now both
resolve through registry.npmjs.org, so the two registries cannot disagree.

**How to apply:** do not add a lockfile-reachability gate back unless the install
registry and the audit registry diverge again.

---

## GitHub Actions: `pull_request` + `push` on one workflow double-runs every PR

A workflow triggered on both `pull_request` and `push` fires twice for each
commit on a PR branch — same job, same result, twice the minutes. GitHub has no
native "push only when there is no PR" condition, so pick one trigger.

`ci.yml` uses `pull_request` alone plus a `concurrency` group keyed on
`github.head_ref` with `cancel-in-progress: true`, so a new push supersedes the
in-flight run instead of racing it. The trade is that a branch with no open PR
gets no CI — the PR is the gate.

**How to apply:** when adding a workflow, name one trigger and add a
`concurrency` group. If you need `push` as well, scope it to branches that never
carry a PR.

---

## The skills distribution repo gets edited directly — diff before you rsync

`/update-ai-skill` says "copy all three skills verbatim into `viax-ai-skills`".
That assumes this repo is the only writer. It is not: on 07-09-2026 the
localization work (`VX-1835`) added ~1,050 lines of i18n chapters to
`viax-portal` **in `viax-io/viax-ai-skills` directly**, never here. The next
sync from this repo — done with `rsync --delete` as documented — would have
silently erased them. Caught only because the diff stat showed
`BEM-based-app-generator-MetaPrompt.md | 1179 +---` where a sync should add.

**How to apply:** before every sync, in the distribution clone run
`git log origin/main --format='%h %an %s' -- skills/<skill>` for each of the
three skills. Any commit there that is not a `[VX-1736] … sync` is a direct
edit: port it INTO this repo first (it is the source of truth), then sync.
A sync diff that *removes* prose from a skill you did not touch here is the
alarm — stop and look. The same applies in reverse: our copy of
`viax-portal/SKILL.md` carried an unquoted `description:` with ": " inside
(invalid YAML, the skill never triggered) that only the distribution repo's
`scripts/validate-skills.sh` catches — run it on the synced tree, always.
