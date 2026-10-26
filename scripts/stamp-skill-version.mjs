/**
 * Release-time stamp for the viax-uxm Claude skill (skills/viax-uxm/).
 *
 * Invoked by semantic-release (@semantic-release/exec prepare step) with the
 * next version as argv[2]. Keeps the skill's version marker and component
 * count in lockstep with the library WITHOUT authors hand-editing them:
 *
 *   1. SKILL.md frontmatter  — "(N BEM-classed React components as of vX.Y.Z"
 *   2. SKILL.md marker       — "Documents `@viax.io/uxm` **vX.Y.Z** (N components)"
 *   3. SKILL.md section      — "## vX.Y.Z — current API surface"
 *   4. SKILL.md "### Unreleased" subsection (only when it actually has notes)
 *      → "### New in X.Y.Z", with a fresh empty "### Unreleased" re-opened
 *      below it so the next PR always has somewhere to park its notes
 *   5. component-catalog.md  — "All N components exported ... (as of vX.Y.Z)"
 *   6. SKILL.md keeps only the KEEP_RELEASE_SECTIONS most recent "### New in"
 *      sections; older ones are rolled verbatim to the END of
 *      references/changelog.md (ascending order), so the skill stays short
 *      without anyone hand-moving text
 *   7. Inline "(unreleased)" qualifiers resolve to the release that shipped
 *      them: dropped inside a "### New in X.Y.Z" section (its heading carries
 *      the version), rewritten to "(X.Y.Z)" everywhere else in SKILL.md and the
 *      references (see dropQualifiers / resolveQualifiers)
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
const changelogPath = join(root, 'skills/viax-uxm/references/changelog.md');

/** How many "### New in X.Y.Z" sections SKILL.md keeps before rolling to the changelog. */
const KEEP_RELEASE_SECTIONS = 5;

// Both markers say "BEM-classed React components", so the count is of styled
// atoms — a folder shipping a `.scss` is exactly that. `src/ui/locale/` is the
// first folder here that is NOT one (a context provider + hook, no class, no
// stylesheet); without this filter it would inflate the published count and
// describe a provider as a component.
const componentCount = readdirSync(join(root, 'src/ui')).filter((name) => {
  const dir = join(root, 'src/ui', name);
  if (!statSync(dir).isDirectory()) return false;
  return readdirSync(dir).some((f) => f.endsWith('.scss'));
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
  /Documents `@viax\.io\/uxm` \*\*v\d+\.\d+\.\d+\*\* \(\d+ components\)/,
  `Documents \`@viax.io/uxm\` **v${version}** (${componentCount} components)`,
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
     PR as the change. At release the pipeline renames this heading to
     "New in X.Y.Z", stamps the version/count markers, and re-opens a fresh
     "### Unreleased" below it (scripts/stamp-skill-version.mjs) — never hand-edit
     the markers, and never append notes under an already-stamped heading. -->

`;

/**
 * Remove the author-guidance comment from a span of release notes.
 *
 * It is instructions for whoever edits the live "### Unreleased" section; in a
 * stamped release entry, and in the append-only changelog downstream of it, it
 * says only that a section published months ago is "not yet published".
 *
 * Deliberately unanchored. The first version of this only matched a comment
 * sitting at the very top of the body, because UNRELEASED_BLOCK writes it
 * directly under the heading. Authors then add their bullets ABOVE it, so by
 * promote time it is trailing the notes and the anchor misses -- which is how
 * 4.44.0 through 4.48.0 each ended up carrying one.
 *
 * The comment takes the blank lines around it with it and leaves exactly one
 * behind. That spacing fix is scoped to the comment on purpose: an earlier
 * version collapsed every run of blank lines in the whole span, which also
 * squashed deliberate blank lines inside fenced code in the release notes.
 */
function stripGuidanceComment(text) {
  return text.replace(/\n*<!-- Notes for changes merged but not yet published\.[\s\S]*?-->\n*/g, '\n\n');
}

/**
 * Drop the bare "(unreleased)" qualifiers from a "### New in X.Y.Z" section.
 *
 * The heading already says when it shipped, so the qualifier is just removed,
 * emphasis and all (`**(unreleased)**`, `*(unreleased)*`), with ONE space
 * around it: the one before it, or the one after when it opens a parenthesis
 * ("(**(unreleased)** an array"). One that starts a wrapped line takes the
 * line's punctuation back up to the end of the line before, so
 * "knob**\n  (unreleased). The" becomes "knob**.\n  The", not "knob**\n  . The".
 * A qualifier that carries more text — "(unreleased, default `false`)" — is
 * left to resolveQualifiers, which keeps the text.
 */
function dropQualifiers(text) {
  return text
    .replace(/\n([ \t]+)(\*{0,2})\(unreleased\)\2([.,;:]?) ?/g, '$3\n$1')
    .replace(/ (\*{0,2})\(unreleased\)\1|(\*{0,2})\(unreleased\)\2 ?/g, '');
}

/**
 * Rewrite every remaining "unreleased" qualifier to the release that ships it.
 *
 * Every merge to master releases, so whatever a file still calls unreleased
 * when the stamper runs is exactly what `release` publishes. Before this ran
 * here the qualifiers were dropped by hand after each release (#96, #100 and
 * earlier), and until someone did, the skill told agents that shipped API was
 * not out yet.
 *
 * Only the parenthesised forms the skill has used are touched: "(unreleased)",
 * "(unreleased, …)" / "(unreleased; …)" / "(unreleased: …)", and the word as a
 * later item of a parenthesised list: "(…, unreleased)", "(16px; unreleased, …)".
 * Lower-case on purpose, so the "### Unreleased" heading is never a match, and
 * neither is prose like "merged but unreleased" outside parentheses.
 */
function resolveQualifiers(text, release = version) {
  return text
    .replace(/\(unreleased(?=[),;:])/g, `(${release}`)
    .replace(/([,;] )unreleased(?=[),;:])/g, `$1${release}`);
}

// A feature PR may have parked its notes under "### Unreleased". Promote that
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
    // Drop the guidance comment on the way through (see stripGuidanceComment).
    // Left in place it is copied into every release section: 4.10.0 and 4.12.0
    // carried one before this strip existed, 4.44.0-4.48.0 after it, because
    // it only matched the comment in the one position authors do not leave it.
    const promoted = stripGuidanceComment(body)
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
// Each "### New in" section resolves to ITS OWN version — the one promoted
// above is simply the newest of them. A qualifier left under an older heading
// (a note appended after that release was stamped) shipped with that release,
// not this one. Whatever remains outside those sections ships now. Done before
// the roll below, so a section moved to the append-only changelog never
// carries a qualifier out with it.
skill = resolveQualifiers(
  skill.replace(/^### New in (\d+\.\d+\.\d+)\n[\s\S]*?(?=^#{2,3} |(?![\s\S]))/gm, (section, release) =>
    resolveQualifiers(dropQualifiers(section), release),
  ),
);

// Roll surplus release sections into the changelog. The API-surface region
// runs from the "## vX.Y.Z — current API surface" heading to the next "## ";
// inside it, every "### New in …" section is a release entry, oldest first.
// Anything beyond the newest KEEP_RELEASE_SECTIONS moves, verbatim, to the
// end of references/changelog.md — which is ascending too, so appending keeps
// the order. "### Unreleased" is never a candidate.
{
  const regionStart = skill.search(/^## v\d+\.\d+\.\d+ — current API surface/m);
  const afterHeading = skill.indexOf('\n', regionStart) + 1;
  const nextH2 = skill.slice(afterHeading).search(/^## /m);
  const regionEnd = nextH2 === -1 ? skill.length : afterHeading + nextH2;
  const region = skill.slice(afterHeading, regionEnd);
  const starts = [...region.matchAll(/^### New in \d/gm)].map((m) => m.index);
  if (starts.length > KEEP_RELEASE_SECTIONS) {
    const cut = starts[starts.length - KEEP_RELEASE_SECTIONS];
    // Strip the guidance comment again on the way out. The promote step above
    // drops it from the section it stamps, but a copy can still ride along
    // here — it only has to be sitting inside the rolled span once (a
    // hand-edit, or a section stamped before the strip caught this shape) to
    // be appended verbatim, and then it is permanent: the changelog is
    // append-only, so nothing ever revisits it. Eight had accumulated in two
    // different wordings before this was added.
    const moved = stripGuidanceComment(region.slice(starts[0], cut)).replace(/\n+$/, '\n');
    skill = skill.slice(0, afterHeading) + region.slice(0, starts[0]) + region.slice(cut) + skill.slice(regionEnd);
    const changelog = readFileSync(changelogPath, 'utf8').replace(/\n+$/, '\n');
    writeFileSync(changelogPath, `${changelog}\n${moved}`);
    // eslint-disable-next-line no-console -- release-log line; the CI job output is the audience
    console.log(`stamp-skill-version: rolled ${starts.length - KEEP_RELEASE_SECTIONS} release section(s) into references/changelog.md`);
  }
}
writeFileSync(skillPath, skill);

let catalog = readFileSync(catalogPath, 'utf8');
catalog = stampOnce(
  catalog,
  /All \d+ components exported from `@viax\.io\/uxm\/ui` \(as of v\d+\.\d+\.\d+\)/,
  `All ${componentCount} components exported from \`@viax.io/uxm/ui\` (as of v${version})`,
  'catalog header',
  'component-catalog.md',
);
writeFileSync(catalogPath, catalog);

// The other references carry qualifiers too (catalog rows, token tables,
// recipes). changelog.md is history: append-only, and its prose describes the
// qualifier convention itself, so it is never rewritten.
const referencesDir = join(root, 'skills/viax-uxm/references');
for (const name of readdirSync(referencesDir)) {
  if (!name.endsWith('.md') || name === 'changelog.md') continue;
  const path = join(referencesDir, name);
  const text = readFileSync(path, 'utf8');
  const resolved = resolveQualifiers(text);
  if (resolved !== text) writeFileSync(path, resolved);
}

// eslint-disable-next-line no-console -- release-log line; the CI job output is the audience
console.log(`stamp-skill-version: stamped v${version}, ${componentCount} components`);
