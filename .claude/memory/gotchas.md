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

Then open a PR. (For Claude sessions this is also enforced by `.claude/hooks/guard-master.mjs` — see CLAUDE.md → "Branches & pull requests".) `master` is protected **by convention only** — and on GitHub it
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
an override hook for a property the state deliberately leaves alone (the hover
thumb colours). It's a bug only when the registry says something else. Better
still, where the state deliberately leaves a property alone, fall back through
the RESTING VAR rather than repeating its literal value
(`var(--uxm-checkbox-hover-unchecked-bg, var(--uxm-checkbox-unchecked-bg,
transparent))`), so a themed resting value carries into the state instead of
being silently dropped back to the stock one — see the Studio note below. Verify hover/focus in the portal (or any
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

**A shared var name can mask a dead knob — the Checkbox's resting knobs.** The
registry's Default-state `uncheckedBg` / `uncheckedBorder` / `checkedBg` /
`checkedBorder` / `checkGlyphColor` emitted `--uxm-checkbox-unchecked-bg` etc.,
but `checkbox.scss` read the older `-border-color` / `-check-color` (and
hardcoded the bg and glyph), so a saved value painted nothing on the
`Checkbox`. The studio preview hid it (its showcase rows paint the knobs
inline), and the drift script missed it twice over: it skips the Default
state, and it searches every stylesheet, where `listbox.scss` reads the same
names for its checkbox marker. Found from outside, by a theme proof that
checked each emitted var against the emitting atom's own folder.
`tests/knob-wiring.test.ts` now does the same in the suite: every knob of an
atom with its own `src/ui/<id>/` folder goes through the real
`generateOverridesCss`, and an emitted var that another atom reads must be read
by its own folder too (`SHARED` lists the deliberate cases, e.g. the slider
entry driving `RangeSlider`). It lives in a test, not the drift script, because
only the real emitter knows the names: knobs like `backgroundColor` emit a
literal property unless mapped, and the script's regex over
`generate-css-mapping.ts` had been skipping every unquoted id (`card`, `tabs`,
`checkbox`, …) until this fix. A var read by nothing at all is still not
checked — that flags ~60 behaviour/composite knobs and isn't worth gating yet
(the ButtonGroup entry below covers the narrower check that is).

**The inverse of this trap: Studio can UNDER-show a fallback chain.** Everything
above is about the workbench looking right while a consumer breaks. A chain that
falls through to another var reverses it. `checkbox.scss` resolves hover's
unchecked background as `var(--uxm-checkbox-hover-unchecked-bg,
var(--uxm-checkbox-unchecked-bg, transparent))`, so a bare consumer that themes
only the resting background keeps that colour under the pointer. Studio never
shows this: `checkbox-preview.tsx` projects `styles.hoverUncheckedBg` — the
registry's `defaultValue`, `transparent` — as an inline var, which satisfies the
outer `var()` and the chain never reaches the resting one. Same for
`hoverCheckGlyphColor`. So the workbench shows the stock hover where production
shows the themed one, and a designer checking "does my background hold on
hover?" in Studio gets the wrong answer.

**How to apply:** the projection makes the workbench a bad oracle in BOTH
directions — it pins every knob that has a `defaultValue`, which hides a dead
fallback and equally hides a live chain. A multi-step `var()` chain is therefore
only ever verified outside the studio: in the portal with nothing saved, or in
`tests/checkbox-knobs.test.ts`, which compiles the SCSS and resolves the chains
the way a browser would. Don't "fix" a chain to match what Studio paints.

**A third way the preview hides a gap: it does the knob's job itself.**
InputWithIcon's Icon Size emitted `--uxm-input-with-icon-icon-size`, which fed
only the left padding; nothing sized the glyph. The preview passed
`size={iconSize}` to the `<Icon>` it rendered, so the knob looked live in Studio,
while the README's `icon={<Icon glyph="search" />}` drew `Icon`'s 24px default in a
16px slot in every app — and every app passed `size={16}` by hand instead of
reporting it. **How to apply:** a preview should hand the atom what a consumer
hands it (the README's usage) and let the knob arrive as a var, never re-apply a
knob value through a prop. `tests/input-icon-size.test.ts` now pins the
slot-and-glyph pairing for every `iconSize` knob that feeds a padding.

**A var nothing reads passes every gate — ButtonGroup's Border Radius.** The
knob emitted `--uxm-button-group-border-radius`, the preview projected the same
name, and `button-group.scss` hard-coded `border-radius: 8px`. This one didn't
even look right in Studio: the slider moved and the group stayed at 8px. It
still shipped, because no gate asks whether anything reads a var. The drift
script compares state knobs only and skips unread vars, and `knob-wiring` checks
only vars that SOME atom reads. Found from outside again, by the theme proof.
The full "emitted but unread" check is still too noisy to gate (~60 vars, most
of them behaviour knobs such as `showArrow` and composite mock-ups such as
`login-page`). `knob-wiring` now runs a narrower one with no allowlist: every
`--uxm-*` name a preview projects must be read by some atom. A preview only
projects a var to drive a stylesheet, so an unread one is a dead knob or a typo.
**What it doesn't catch:** a preview that projects the name the atom reads while
the emitter writes another (RadioGroup's card knobs, the zoom control's divider),
and a preview that paints a knob through inline style properties instead of a
var (ButtonWithIcon's radius, padding and font). Both look live in Studio and do
nothing in an app. Nor does it ask WHICH declaration reads the var, only that
some non-preview source does — found while mutation-testing this very fix:
reverting the root's `border-radius` alone left both wiring checks green,
because the end items' `calc()` still read the name while the root no longer
rounded. Pinning a specific declaration is a portal check, not a gate. It also
only sees a name written as a literal quoted object key: one built by a ternary
(`Avatar`'s preview picks between two names), a template, or set through
`style.setProperty` is never examined.

Of the ~60 unread vars, most are behaviour knobs (`showArrow`, `showLabel`) or
composite mock-ups (`login-page` alone is 17), but **about 17 are real style
knobs that a theme would expect to work**: `button-with-icon` ×6,
`radio-group`'s card set ×5, `content-tooltip` `shadow` and `titleSize`, and
`icon` `size` / `strokeWidth`. Don't read the count as "all behaviour knobs".

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

---

## GitHub: a stacked PR merges into its BASE BRANCH, not into master

PR #8 (`docs/skill-uxm-alias`) was opened with base `docs/skill-portal-port-localization`
so it would show only its own commit while #6 was pending. #6 merged into master
first; #8 then merged **into the already-merged, now-stale base branch** —
merge commit `ba253d1`, reachable from nothing once that branch was deleted.
`gh pr view 8` said MERGED, master never got the commit, and only
`git merge-base --is-ancestor <sha> origin/master` after the fact showed it.
GitHub retargets a stacked PR to the default branch only when the base branch
is deleted *through the PR page's "Delete branch" button*; a branch deleted any
other way, or one that survives (`delete_branch_on_merge` is off here), leaves
the stacked PR pointing at it.

**How to apply:** don't stack PRs in this repo. Open every PR against `master`;
if it depends on another open PR, say so in the description and merge in
order — the second PR's diff shrinks to its own commits once the first lands.
After any merge, verify with `git merge-base --is-ancestor <sha> origin/master`
rather than trusting the PR's MERGED badge. Recovered here by cherry-picking
`81a6b5f` onto master (PR #9).

---

## tsup: named entries only from a config file, and the config must live in the repo

Building the CDN bundles (`tsup.cdn.config.ts`, 11-09-2026) hit three tsup
surprises in a row. `--entry.uxm.esm dist/ui/index.d.ts` on the CLI dies with
`Cannot find uxm: [object Object]` — the dot in the output name is parsed as a
nested key. A positional `.d.ts` entry with `--dts-only` is emitted as
`index.d.d.ts`. And an IIFE build gets a `.global.js` suffix by default, so the
driver script looked for `uxm.standalone.js` and found nothing.

**How to apply:** any tsup build whose output names matter goes through a
config file with an `entry` object (`{ 'uxm.esm': '…' }`) and an explicit
`outExtension` for IIFE; the config must sit in the repo tree (one in a
scratch dir cannot resolve `tsup` itself). Same root cause as the standalone
entry needing to live under `scripts/cdn/`: Node resolves from the file's
location, never from `cwd`.

---

## A new mode isn't done until the studio can reach it

Three times in one release train (4.44-4.48) an atom gained a mode and the
studio kept showing the old one, and **no gate caught any of them** — lint,
typecheck, `check:drift` and the whole Vitest suite passed each time, because
every one of these lives in the registry or a preview, not in the atom.

The three, all found only by opening the workbench:

- **`List variant="plain"`** — the registry's "Border Color" knob was gated to
  `container: 'card'`. It reads as a container knob and sits in a Container
  section, but it maps to `--uxm-list-item-border-color`, whose only read is the
  ROW DIVIDER. Gating it took the divider colour away from the one presentation
  where dividers are the only separator left.
- **`RadioGroup variant="card"`** — the forced-state showcase is hand-written
  row markup and didn't follow `variant`, so picking Card and then Hover/Focus
  painted a circle for a control that is a tile. The knobs it was tuning
  (`--uxm-radio-group-hover-*`, `-focus-ring`) really do drive the card frame,
  so the feedback was wrong about the thing being edited.
- **`ListItem selected`** — the preview had no way to reach selectable mode at
  all; and once it did, the showcase still rendered a `<button>` row while the
  live list rendered `<label>` rows, and `trailing` still derived from `mode`,
  putting a navigation chevron on a checkbox row.

**How to apply.** When an atom gains a variant or mode, treat these as part of
the change, not follow-up:

1. A registry variant so it can be selected at all.
2. Every hand-written preview branch follows it — especially a forced-state
   showcase, which is usually the ONLY renderer of hover/focus/disabled. If the
   showcase can't produce the new element, it must render the new element.
3. Anything derived from a sibling variant is re-checked. **Hiding a variant
   picker with `showWhen` does not reset its stored value** — `mode` stays
   `'interactive'` while its picker is hidden, so `showWhen: { mode: 'interactive' }`
   options stay on offer and `trailingForMode(mode, …)` keeps returning the
   chevron. Gate on the NEW variant, or pass it in.
4. Trace what a knob actually paints before gating it — the label and the
   section it sits in are not evidence. `grep` the variable it maps to in
   `generate-css-mapping.ts`, then grep that variable in the SCSS.

Related: "A per-state var whose fallback is the resting value ships a dead rule"
is the same family — the workbench looking right while the shipped path is
wrong.

## A Select inside a Dialog: one Escape closes both

The studio's account pane is the library's first `Select`-inside-`Dialog`. Two
things bite there, both verified in the portal:

1. **The panel renders *under* the dialog** unless the app opts in. `Popover`
   defaults to `var(--uxm-popover-z-index, 50)`; `Dialog` is at 60. The studio
   opts in under `body.uxm-studio-pane-open` (`src/studio/studio-shell.css`) so
   the lift lasts only as long as its own modal — declaring it at `:root` would
   move the stacking of every host that imports `studio.css`, which
   `tests/tokens.test.ts` now rejects by allowlist.
2. **One Escape dismisses the dropdown AND the dialog.** Both listen, and
   neither stops the other. Not fixed — noted so the next person doesn't treat
   it as a bug in their own composition.
