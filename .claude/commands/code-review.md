# /code-review Command

Perform code review with configurable scope, target, and depth.

## Usage
```
/code-review                                       # Thorough review of uncommitted changes (default)
/code-review --quick                               # Quick inline review of uncommitted changes
/code-review --branch                              # Review ALL changes in current branch vs master
/code-review --branch --quick                      # Quick review of branch changes
/code-review --full                                # Full review of uncommitted changes (entire file, not just diff)
/code-review --full --branch                       # Full review of all files changed in branch
/code-review src/ui                                # Review a specific directory (full file content)
/code-review src/ui/disclosure/disclosure.tsx      # Review a specific file (full file content)
/code-review --quick src/ui/button/button.tsx      # Quick review of a specific file
```

## Examples
```
/code-review                                              # Review uncommitted changes (staged + unstaged)
/code-review --quick                                      # Quick review of uncommitted changes
/code-review --branch                                     # Review all commits in feature branch vs master
/code-review --branch --quick                             # Quick review of branch changes
/code-review --full                                       # Review full content of uncommitted changed files
/code-review --full --branch                              # Review full content of all branch-changed files
/code-review src/ui                                       # Review all UI library files
/code-review src/ui/disclosure/disclosure.tsx             # Review a specific file
```

## Scope

### Default (uncommitted changes)
**Reviews files with uncommitted modifications:**
- Staged files (`git diff --cached`)
- Unstaged modified files (`git diff`)
- Reviews only the **changed lines** (diff)

### Branch mode (`--branch`)
**Reviews ALL files changed in current branch vs master:**
- Uses `git diff master...HEAD --name-only` (the base branch is `master` — there is no `main`)
- Includes all commits made in the feature branch
- Reviews only the **changed lines** (diff)
- Perfect for pre-MR review when code is already committed/pushed

### Full mode (`--full`)
**Reviews entire file content, not just the diff:**
- Same file selection as default or `--branch` when combined
- Reads and reviews the **complete file** — catches issues outside changed lines
- Useful when refactoring, when context matters, or for deeper analysis

### Path mode (`<path>`)
**Reviews a specific file or directory regardless of git status:**
- Pass a file path or directory path as argument (no flag needed)
- Always reviews **full file content** (not diff-based)
- If a directory is given, reviews all `.tsx`, `.ts`, and `.scss` files within it recursively (skip build-output `.css` — the only hand-written one is the `src/ui/styles.css` aggregator)
- Ignores git status — reviews the file as it currently exists on disk

## Modes

### Default Mode (Agent-Based)
Spawns the `code-review` agent for comprehensive review:
- Analyzes all target files
- Runs the gates: `npm run lint` and `npm run typecheck`
- Checks the constitution (`.claude/memory/constitution.md`), the React style guide, and component patterns
- Checks accessibility, documentation, security and performance
- Provides a structured report with severity levels
- Gives a clear verdict (Ready for merge / Needs changes)

### Quick Mode (`--quick`)
Performs inline review without spawning the agent:
- Faster, lower token usage
- Reviews files already in context
- Basic checks: logic, style, obvious issues
- Best for small, confident changes or a specific file

## Argument Parsing

Parse `$ARGUMENTS` as follows:

1. If `$ARGUMENTS` contains a file or directory path (starts with `src/`,
   `portal/`, `skills/`, `scripts/`, `./`, `/`, or matches a known path pattern):
   - Set **scope = path**, read full file content from disk
   - `--quick` flag may still be combined
2. If `$ARGUMENTS` contains `--full`: set **scope = full** (entire file content of git-changed files)
3. If `$ARGUMENTS` contains `--branch`: use branch diff (`git diff master...HEAD --name-only`)
4. If `$ARGUMENTS` contains `--quick`: use quick inline mode instead of the agent
5. If no arguments: default scope (uncommitted diff)

## What Gets Reviewed

| Category | Checks |
|----------|--------|
| **Lint + typecheck + drift** | Must pass `npm run lint`, `npm run typecheck`, and `npm run check:drift` (registry-vs-CSS state-var gate) with zero errors |
| **React style guide** | See `.claude/handbooks/react-style-guide.md` |
| **Project conventions** | Named exports, kebab-case files, `export interface ${Name}Props`, `className`+`cn`, `...rest` spread, no `"use client"` |
| **UI library specifics** | `uxm-` prefix, canonical BEM, two-layer theming (`var(--uxm-*, var(--color-*))`), no Tailwind outside `src/studio`, barrel re-exports, `styles.css` `@import`, AI-skill update (`skills/viax-uxm/`) |
| **Accessibility** | Semantic HTML, ARIA, keyboard support, focus styles |
| **Documentation** | JSDoc on non-obvious hooks/utilities; brief comment on non-obvious components |
| **SOLID/DRY/KISS** | Simplicity and maintainability |
| **Security** | No hardcoded secrets, proper validation, OWASP awareness |
| **Performance** | Justified memoisation, no leaks, no needless re-renders |

> Note: no test framework is configured at present — the review does NOT
> report on tests, jest-axe, or Storybook.

## Output Format

```
## Code Review: [feature name / file name]

### Scope
[Uncommitted changes / Branch changes / Full file / Path: src/...]

### Summary
[Brief assessment]

### Findings
| # | Severity | File:Line | Issue | Suggestion |
|---|----------|-----------|-------|------------|
| 1 | Critical | file.tsx:42 | ... | ... |
| 2 | Warning  | file.ts:15  | ... | ... |

### Gates
[lint: Pass/Fail, typecheck: Pass/Fail]

### Verdict
[Ready for merge / Needs changes]
```

The findings table MUST include a `#` column as the first column with sequential
row numbers. Numbers make it easy to reference specific findings in follow-up
discussions (e.g. "fix #3 and #7").

## Severity Levels
- **Critical**: Bugs, security issues, data-loss risks — MUST fix
- **Warning**: Pattern violations, missing error handling — SHOULD fix
- **Suggestion**: Style improvements, optimisations — COULD fix
- **Note**: Observations, questions, praise — FYI

## Implementation

When invoked:

1. **Parse arguments** (`$ARGUMENTS`) to determine scope, target path, and mode
2. **Collect files to review:**
   - `path` scope: read full content of the given file or all `.tsx`/`.ts`/`.scss`
     files in the directory
   - `full` scope: get file list from git diff, then read full content of each file
   - `branch` scope: `git diff master...HEAD --name-only`, then read diff (or full if `--full`)
   - default scope: `git diff` + `git diff --cached`, use diff output
3. **If `--quick`**: perform inline review without the agent
4. **If default (no `--quick`)**: spawn the `code-review` agent with collected file content
5. **Save the review to a file** after the review is complete (always, regardless of mode):
   - Determine target name: use file/directory name for path mode, branch name for branch mode, or `uncommitted` for default
   - Get the current timestamp in Ukrainian timezone (UTC+2/UTC+3)
   - Create the `todo/code-review/` directory if it does not exist
   - Save the full review output to: `todo/code-review/DD-MM-YYYY-HH-MM-[target-name].md`

## Notes

- Default mode reviews only changed lines — use `--full` or a path for deeper analysis
- `--full` is slower but catches issues that exist outside the changed lines
- Path mode is ideal for auditing a component that was not recently modified
- Use `--quick` for small changes or when you want a fast sanity check
- Run before opening an MR to catch issues early
- Review output includes line numbers for easy navigation

ARGUMENTS: $ARGUMENTS
