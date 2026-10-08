# /update-readme Command

Bring the root `README.md` in line with what the library actually ships. The README is the
**consumer-facing** entry point (npm + GitHub): subpath exports, the component catalog, the
theming and localisation models, the studio, build & contributing. It drifts because feature
PRs update the deep docs (`src/**/README.md`, `skills/viax-uxm/`, `CLAUDE.md`) and forget the
root one — the studio-i18n PR (#49) is the case that prompted this command.

The README **summarises and links**; the deep docs **explain**. Never copy a component or
subsystem README into it — one or two paragraphs plus a link to the authoritative file.

## Usage

```
/update-readme              # changes since README.md was last touched on master
/update-readme <ref>        # changes in <ref>..HEAD (e.g. a merge commit's first parent, a tag)
/update-readme #49          # changes from one merged PR (resolve via `gh pr view 49 --json mergeCommit`)
```

## Workflow

### 1. Branch

Never edit on `master` — if on it, create `docs/readme-<topic>` first. Never push or open a
PR without the maintainer confirming the target.

### 2. Find what changed

- Default range: `git log -1 --format=%H master -- README.md` → `<that>..HEAD`.
- `git diff --stat <range>` and `git log --oneline <range>`; if `README.md` is already in the
  diff, read that hunk first — someone may have done part of the job.
- Read the deep docs the range touched (component READMEs, `src/studio/**/README.md`,
  `skills/viax-uxm/SKILL.md` `### Unreleased` bullets, `CLAUDE.md`) — they describe the intent
  better than the code diff does.

### 3. Map each change to its README section

| Change in the range | README section to update |
|---|---|
| `package.json` → `exports` entry added/removed/renamed | **Subpath exports** table (+ **CDN usage** if it affects `dist-cdn/`) |
| New / removed / renamed `src/ui/<name>/` folder | **Component catalog** — right intent group, alphabetical, `[\`name\`](src/ui/name/README.md)`; deprecated atoms keep the `(deprecated → …)` note |
| New prop on `UxmApp`, new persistence adapter, studio feature | **Studio** (and its subsections) — update the code example if the integration changed |
| Studio i18n (new locale in `STUDIO_LOCALES`, review status) | **Studio localisation** — the shipped-locale list |
| `UxmLocaleProvider`, label-prop conventions, `LanguageSwitcher` | **Localisation** |
| Tokens, two-layer theming, `check:tokens` | **Design tokens & MODO theming** |
| `package.json` → `scripts` added/removed/renamed, gate composition (`check:drift`) | **Build & develop** command list |
| Build pipeline (`tsup.config.ts`, `build` script chain), `dist/` layout | **Build & develop** pipeline list + `dist/` tree |
| Layer boundaries, ESLint zones, tree-shake guarantee | **Architecture** / **Previews** |
| New authoring rule (constitution, CLAUDE.md "must") | **Contributing** bullet |
| Release flow (`.releaserc`, CI) | **Releases** |
| Peer deps / install steps / required CSS imports | **Install** / **Quick start** |

### 4. Drift checks (run every time, even if the range looks unrelated)

- **Catalog ↔ `src/ui/`**: every folder in `src/ui/` (excluding `index.ts`, `styles.css`)
  appears in the catalog exactly once, and every catalog link resolves.
  ```bash
  S=<scratchpad dir>   # not /tmp
  ls -d src/ui/*/ | xargs -n1 basename | sort > "$S/ui.txt"
  # scope to the catalog section — atoms are also linked from Localisation, Previews, etc.
  sed -n '/^## Component catalog/,/^## Design tokens/p' README.md \
    | grep -oE '\(src/ui/[a-z0-9-]+/README.md\)' | sed -E 's#\(src/ui/([^/]+)/.*#\1#' | sort > "$S/readme.txt"
  diff "$S/ui.txt" "$S/readme.txt"   # empty = in sync; a duplicate shows as an extra `>` line
  ```
- **Subpath table ↔ `package.json` `exports`**: every public entry has a row (CSS entries
  included); no row for an entry that no longer exists.
- **Command list ↔ `package.json` `scripts`**: user-facing scripts are listed; descriptions of
  composite gates (`check:drift`) match what they actually run.
- **`dist/` tree** matches a fresh `npm run build` when the pipeline or exports changed.
- **Every relative link** in the README resolves:
  `grep -oE '\]\(([^)#h][^)#]*)' README.md | sed 's/](//' | sort -u | while read f; do [ -e "$f" ] || echo "missing: $f"; done`

### 5. Edit rules

- English only, match the surrounding voice (short bold lead-ins, em-dashes, backticked
  identifiers). Edit surgically — don't reflow paragraphs you aren't changing.
- **No hard component counts** — enumerate, never "N components" (CLAUDE.md rule).
- State behaviour, not history ("ships ten locales", not "we added ten locales").
- Mark nothing "(unreleased)" here — that convention belongs to `skills/viax-uxm/` only.
- Don't touch `CHANGELOG.md` (semantic-release owns it) or the skill's version markers.
- If a deep doc is wrong or missing, fix it there first and link to it — don't paper over the
  gap in the README.
- If the change also needs the AI skill updated and it wasn't, say so and point at
  `/update-ai-skill` — don't silently fix it in the same commit.

### 6. Verify and commit

- Re-run the drift checks from step 4 — all clean.
- `npx prettier --check README.md` is **not** a gate (the file has pre-existing deviations);
  just don't introduce new formatting styles.
- Commit: `docs(readme): <what>` — conventional commit, no AI attribution (CLAUDE.md). The
  lint-staged "no matching files" message on a docs-only commit is benign (`gotchas.md`).

Report back: the range inspected, each README section touched and why, any drift found by
step 4 that wasn't part of the range, and anything left for the maintainer (deep docs to fix,
skill update needed, push/PR pending).
