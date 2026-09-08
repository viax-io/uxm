# /commit-message Command

Generate a standardized git commit message based on current repository changes.

## Usage
```
/commit-message
```

## Format

The generated commit message follows the **Conventional Commits** specification
enforced by `commitlint` and consumed by `semantic-release` for versioning and
`CHANGELOG.md` generation:

```
type(scope): short description

Optional longer body explaining what and why (max 100 chars per line).
```

### Type (required)

| Type | When to use | semver impact |
|------|-------------|---------------|
| `feat` | New component, new prop/variant, new token, new export | MINOR |
| `fix` | Bug fix in an existing component / token / build output | PATCH |
| `refactor` | Code change that neither fixes a bug nor adds a feature | none |
| `style` | Formatting, whitespace, missing semicolons — no logic change | none |
| `perf` | Performance improvement | PATCH |
| `test` | Adding or changing tests in `tests/` | none |
| `docs` | Documentation only (README, skill, handbooks, `.claude/`) | none |
| `build` | Build pipeline or dependency changes (`tsup`, `tsc-alias`, deps) | none |
| `ci` | `.github/workflows/*`, `.releaserc` | none |
| `chore` | Other changes that don't modify `src/` | none |
| `revert` | Reverts a previous commit | depends |

### Scope (recommended)

Use the component folder name (kebab-case) or the area:

```
feat(tag-input): add clearable prop
fix(config-component-row): keep the actions slot outside the button
refactor(listbox): extract the roving-tabindex logic into a hook
feat(tokens): lift the dark theme out of near-black
docs(skill): post-4.36.0 cleanup - drop the FileUpload (unreleased) qualifier
fix(studio): persist brand font on publish
ci: gate lint, typecheck and build in the test job
```

For cross-cutting changes with no single scope, omit it:

```
chore: bump sass to 1.104.0
build: rewrite CJS requires after tsc-alias
```

### Breaking changes

```
feat(select)!: rename value prop to selected

BREAKING CHANGE: consumers must replace `value` with `selected`
```

A `BREAKING CHANGE:` footer forces a **major** release of the whole package.
Reserve it for a change that breaks a **known external consumer**; an internal
DOM/class reshuffle on a niche atom is a `feat`/`fix` plus a README migration
note (see `.claude/memory/gotchas.md` → semver).

## Example output

```
feat(tag-input): add TagInput atom

Introduce a controlled/uncontrolled tag input for entering and removing
string tags. Enter adds, Backspace removes the last tag; max-tags limit
and disabled state are supported. Skill catalog row added (unreleased).
```

```
fix(checkbox): make the hover fallback distinct from the resting colour

The hover var fell back to --color-border, which is also the resting
border, so consumers without studio overrides saw no hover state.
```

## Workflow

When invoked:

1. **Analyze changes** — run these bash commands, nothing else:
   - `git status`
   - `git diff`
   - `git diff --cached`
   - `git branch --show-current`

2. **Determine type and scope**
   - Identify the primary nature of the change (feature, fix, refactor, …)
   - Take the scope from the changed `src/ui/<name>/` folder or area
     (`tokens`, `studio`, `skill`, `ci`, …)
   - If multiple unrelated areas changed, suggest separate commits or omit scope

3. **Generate the message**
   - Subject: `type(scope): imperative description` — max 100 chars
   - Body (optional): what changed and why, max 100 chars per line
   - Footer: `BREAKING CHANGE:` only when justified above; ticket reference if
     known (e.g. `Refs: VX-1570`)

4. **Present to the user**
   - Output the commit message as plain text in your response
   - Ask whether to use it as is, modify it, or create the commit

> **IMPORTANT:** only use bash for the four git commands in step 1. Do NOT run
> `echo`, `printf`, or any other command to display output — all output is plain
> text in your response.

## Message guidelines

- Imperative mood: "add", not "added" / "adds"
- Subject describes WHAT changed; body explains WHY
- No trailing period on the subject
- No file paths or implementation internals in the subject

## Restrictions

- No `[branch-name]` prefix — this project uses Conventional Commits.
- No implementation details or code snippets in the subject line.
- Attribution trailers (`Co-Authored-By:`, `Claude-Session:`) follow the
  session's harness instructions — add exactly what the session specifies,
  never invent or paraphrase them.

## Notes

- `feat` and `fix` commits trigger a release via semantic-release on `master`
  (`feat` → MINOR, `fix` / `perf` → PATCH, `BREAKING CHANGE` → MAJOR)
- Commit messages feed directly into the published `CHANGELOG.md` and the
  release notes — write them for a consumer reading the changelog

ARGUMENTS: $ARGUMENTS
