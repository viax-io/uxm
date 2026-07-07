/**
 * Release-time stamp for the viax-uxm Claude skill (skills/viax-uxm/).
 *
 * Invoked by semantic-release (@semantic-release/exec prepare step) with the
 * next version as argv[2]. Keeps the skill's version marker and component
 * count in lockstep with the library WITHOUT authors hand-editing them:
 *
 *   1. SKILL.md frontmatter  — "(N BEM-classed React components as of vX.Y.Z"
 *   2. SKILL.md marker       — "Documents `@viax/uxm` **vX.Y.Z** (N components)"
 *   3. SKILL.md section      — "## vX.Y.Z — current API surface"
 *   4. SKILL.md "### Unreleased" subsection (if present) → "### New in X.Y.Z"
 *   5. component-catalog.md  — "All N components exported ... (as of vX.Y.Z)"
 *
 * The component count is derived from the src/ui component folders (the same
 * set the barrel exports), so it can never drift from the code. Exits 1 if a
 * mandatory pattern is missing or matches more than once — a failed release
 * beats a silently wrong skill.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+/.test(version)) {
  console.error(`stamp-skill-version: expected a semver argument, got "${version}"`);
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillPath = join(root, 'skills/viax-uxm/SKILL.md');
const catalogPath = join(root, 'skills/viax-uxm/references/component-catalog.md');

const componentCount = readdirSync(join(root, 'src/ui')).filter((name) => {
  const dir = join(root, 'src/ui', name);
  return statSync(dir).isDirectory();
}).length;

/** Replace exactly one occurrence of `pattern` or die — drift must fail the release. */
function stampOnce(content, pattern, replacement, label, file) {
  const matches = content.match(new RegExp(pattern.source, pattern.flags + 'g')) ?? [];
  if (matches.length !== 1) {
    console.error(
      `stamp-skill-version: expected exactly 1 match for ${label} in ${file}, found ${matches.length}`,
    );
    process.exit(1);
  }
  return content.replace(pattern, replacement);
}

let skill = readFileSync(skillPath, 'utf8');
skill = stampOnce(
  skill,
  /\(\d+ BEM-classed React components as of v\d+\.\d+\.\d+/,
  `(${componentCount} BEM-classed React components as of v${version}`,
  'frontmatter count marker',
  'SKILL.md',
);
skill = stampOnce(
  skill,
  /Documents `@viax\/uxm` \*\*v\d+\.\d+\.\d+\*\* \(\d+ components\)/,
  `Documents \`@viax/uxm\` **v${version}** (${componentCount} components)`,
  'version marker',
  'SKILL.md',
);
skill = stampOnce(
  skill,
  /## v\d+\.\d+\.\d+ — current API surface/,
  `## v${version} — current API surface`,
  'API-surface heading',
  'SKILL.md',
);
// Optional: a feature MR may have parked its notes under "### Unreleased".
if (/^### Unreleased$/m.test(skill)) {
  skill = skill.replace(/^### Unreleased$/m, `### New in ${version}`);
}
writeFileSync(skillPath, skill);

let catalog = readFileSync(catalogPath, 'utf8');
catalog = stampOnce(
  catalog,
  /All \d+ components exported from `@viax\/uxm\/ui` \(as of v\d+\.\d+\.\d+\)/,
  `All ${componentCount} components exported from \`@viax/uxm/ui\` (as of v${version})`,
  'catalog header',
  'component-catalog.md',
);
writeFileSync(catalogPath, catalog);

// eslint-disable-next-line no-console -- release-log line; the CI job output is the audience
console.log(`stamp-skill-version: stamped v${version}, ${componentCount} components`);
