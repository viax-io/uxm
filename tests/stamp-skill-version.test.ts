import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

/**
 * The release-time skill stamper (scripts/stamp-skill-version.mjs), run for
 * real against a throwaway repo root. It resolves every path from its own
 * location, so the script is copied into a temp dir next to a minimal
 * SKILL.md, catalog, changelog and one `src/ui` component.
 *
 * Pinned: the author-guidance comment under "### Unreleased" never survives
 * into a stamped "### New in" section or the changelog, wherever the author
 * left it (it has been stranded twice, by two differently anchored strips),
 * and stripping it does not touch the spacing of the notes themselves.
 */

const SCRIPT = resolve(__dirname, '../scripts/stamp-skill-version.mjs');
const GUIDANCE = `<!-- Notes for changes merged but not yet published. Add a bullet here in the SAME
     PR as the change. -->`;

let root: string | undefined;

afterEach(() => {
  if (root) rmSync(root, { recursive: true, force: true });
  root = undefined;
});

/** Runs the stamper over `sections` (the API-surface body) and returns the written files. */
function stamp(sections: string, version = '9.9.9') {
  root = mkdtempSync(join(tmpdir(), 'stamp-skill-'));
  const skillDir = join(root, 'skills/viax-uxm');
  mkdirSync(join(skillDir, 'references'), { recursive: true });
  mkdirSync(join(root, 'scripts'));
  mkdirSync(join(root, 'src/ui/button'), { recursive: true });
  writeFileSync(join(root, 'src/ui/button/button.scss'), '');
  copyFileSync(SCRIPT, join(root, 'scripts/stamp-skill-version.mjs'));

  writeFileSync(
    join(skillDir, 'SKILL.md'),
    `---\ndescription: (1 BEM-classed React components as of v1.0.0)\n---\n\n` +
      `Documents \`@viax.io/uxm\` **v1.0.0** (1 components)\n\n` +
      `## v1.0.0 — current API surface\n\n${sections}\n## Next\n`,
  );
  writeFileSync(
    join(skillDir, 'references/component-catalog.md'),
    'All 1 components exported from `@viax.io/uxm/ui` (as of v1.0.0)\n',
  );
  writeFileSync(join(skillDir, 'references/changelog.md'), '# Changelog\n');

  execFileSync('node', [join(root, 'scripts/stamp-skill-version.mjs'), version], { stdio: 'pipe' });
  return {
    skill: readFileSync(join(skillDir, 'SKILL.md'), 'utf8'),
    changelog: readFileSync(join(skillDir, 'references/changelog.md'), 'utf8'),
  };
}

/** The text of the "### New in <version>" section, up to the next heading. */
function section(skill: string, version: string) {
  const start = skill.indexOf(`### New in ${version}`);
  expect(start).not.toBe(-1);
  const bodyStart = skill.indexOf('\n', start) + 1;
  const next = skill.slice(bodyStart).search(/^#{2,3} /m);
  return skill.slice(start, bodyStart + next);
}

describe('stamp-skill-version', () => {
  it.each([
    ['directly under the heading', `### Unreleased\n\n${GUIDANCE}\n\n- One.\n`],
    ['below the bullets', `### Unreleased\n\n- One.\n\n${GUIDANCE}\n`],
    ['between two bullets', `### Unreleased\n\n- One.\n\n${GUIDANCE}\n\n- Two.\n`],
  ])('strips the guidance comment left %s when promoting', (_, unreleased) => {
    const { skill } = stamp(unreleased);
    const promoted = section(skill, '9.9.9');
    expect(promoted).not.toContain('<!--');
    expect(promoted).toMatch(/^### New in 9\.9\.9\n\n- One\.\n\n/);
    expect(promoted).not.toMatch(/\n{3,}/);
  });

  it('re-opens an empty "### Unreleased" that still carries the guidance comment', () => {
    const { skill } = stamp(`### Unreleased\n\n- One.\n\n${GUIDANCE}\n`);
    expect(skill).toMatch(/### New in 9\.9\.9\n\n- One\.\n\n### Unreleased\n\n<!-- Notes for changes merged/);
    expect(skill.match(/<!-- Notes for changes merged/g)).toHaveLength(1);
  });

  it('leaves an Unreleased section with no bullets alone', () => {
    const { skill } = stamp(`### Unreleased\n\n${GUIDANCE}\n`);
    expect(skill).not.toContain('### New in 9.9.9');
    expect(skill).toContain(`### Unreleased\n\n${GUIDANCE}\n`);
  });

  it('keeps blank lines inside fenced code in the notes', () => {
    const fence = '```tsx\nconst a = 1;\n\n\n\nconst b = 2;\n```';
    const { skill } = stamp(`### Unreleased\n\n- One:\n\n  ${fence}\n\n${GUIDANCE}\n`);
    expect(section(skill, '9.9.9')).toContain(fence);
  });

  it('strips a stranded comment from sections rolled into the changelog', () => {
    const released = ['1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.0.5']
      .map((v) => `### New in ${v}\n\n- Shipped in ${v}.\n\n${GUIDANCE}\n\n`)
      .join('');
    const { skill, changelog } = stamp(`${released}### Unreleased\n\n- Fresh.\n`);
    expect(changelog).toBe('# Changelog\n\n### New in 1.0.1\n\n- Shipped in 1.0.1.\n');
    expect(skill).not.toContain('### New in 1.0.1');
  });
});
