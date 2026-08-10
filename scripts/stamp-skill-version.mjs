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
 *   4. SKILL.md "### Unreleased" subsection (only when it actually has notes)
 *      → "### New in X.Y.Z", with a fresh empty "### Unreleased" re-opened
 *      below it so the next MR always has somewhere to park its notes
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
const UNRELEASED_HEADING = '### Unreleased';

/**
 * The bare section the stamper re-opens after promoting the previous one.
 * Kept here rather than in SKILL.md so the wording can never drift from the
 * behaviour it describes.
 */
const UNRELEASED_BLOCK = `${UNRELEASED_HEADING}

<!-- Notes for changes merged but not yet published. Add a bullet here in the SAME
     MR as the change. At release the pipeline renames this heading to
     "New in X.Y.Z", stamps the version/count markers, and re-opens a fresh
     "### Unreleased" below it (scripts/stamp-skill-version.mjs) — never hand-edit
     the markers, and never append notes under an already-stamped heading. -->

`;

// A feature MR may have parked its notes under "### Unreleased". Promote that
// section to the released version and immediately re-open an empty one.
//
// Re-opening is the whole point: before this was automated the heading was
// simply consumed, so the next author found no "### Unreleased" to write under
// and appended to the stamped section instead — where the notes are labelled
// with a version that already shipped and never get re-stamped. That happened
// four releases running (4.9.0, 4.10.0, 4.12.0, 4.13.0), each time repaired by
// hand afterwards.
//
// The rename is conditional on the section actually HAVING notes. Promoting an
// empty one would mint a hollow "### New in X.Y.Z" on every release that ships
// no skill-visible change — which is most patch releases.
const unreleasedAt = skill.search(/^### Unreleased$/m);
if (unreleasedAt !== -1) {
  const bodyStart = unreleasedAt + UNRELEASED_HEADING.length;
  const nextHeading = skill.slice(bodyStart).search(/^#{2,3} /m);
  const bodyEnd = nextHeading === -1 ? skill.length : bodyStart + nextHeading;
  const body = skill.slice(bodyStart, bodyEnd);

  if (/^- /m.test(body)) {
    // Drop the guidance comment on the way through: it explains how to PARK
    // notes, which is meaningless once the section is a shipped changelog
    // entry. Left in place it gets copied into every release section — 4.10.0
    // and 4.12.0 on master each carry a stranded one.
    const promoted = body
      .replace(/^\n+<!--[\s\S]*?-->\n/, '\n')
      // Normalise the tail so the re-opened section always sits exactly one
      // blank line below, whatever spacing the author happened to leave.
      .replace(/\n+$/, '\n\n');
    skill =
      skill.slice(0, unreleasedAt) +
      `### New in ${version}` +
      promoted +
      UNRELEASED_BLOCK +
      skill.slice(bodyEnd);
  }
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
