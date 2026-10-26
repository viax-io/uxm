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
 * and stripping it does not touch the spacing of the notes themselves. And
 * every "(unreleased)" qualifier resolves to the release: dropped from the
 * promoted section, rewritten to the version in SKILL.md and the references,
 * never touching the "### Unreleased" heading, prose, or the changelog.
 */

const SCRIPT = resolve(__dirname, '../scripts/stamp-skill-version.mjs');
const GUIDANCE = `<!-- Notes for changes merged but not yet published. Add a bullet here in the SAME
     PR as the change. -->`;

let root: string | undefined;

afterEach(() => {
  if (root) rmSync(root, { recursive: true, force: true });
  root = undefined;
});

/**
 * Runs the stamper over `sections` (the API-surface body) and returns the
 * written files. `references` adds or overrides files in `references/`, keyed
 * by name; the catalog and changelog are prefixed with the header lines the
 * stamper itself requires.
 */
function stamp(sections: string, version = '9.9.9', references: Record<string, string> = {}) {
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
  const files: Record<string, string> = {
    ...references,
    'component-catalog.md': `All 1 components exported from \`@viax.io/uxm/ui\` (as of v1.0.0)\n${references['component-catalog.md'] ?? ''}`,
    'changelog.md': `# Changelog\n${references['changelog.md'] ?? ''}`,
  };
  for (const [name, text] of Object.entries(files)) writeFileSync(join(skillDir, 'references', name), text);

  execFileSync('node', [join(root, 'scripts/stamp-skill-version.mjs'), version], { stdio: 'pipe' });
  return {
    skill: readFileSync(join(skillDir, 'SKILL.md'), 'utf8'),
    changelog: readFileSync(join(skillDir, 'references/changelog.md'), 'utf8'),
    ref: (name: string) => readFileSync(join(skillDir, 'references', name), 'utf8'),
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

  describe('"(unreleased)" qualifiers', () => {
    it.each([
      ['a bare qualifier', '- **`Foo`: fixed** (unreleased).', '- **`Foo`: fixed**.'],
      ['one inside bold', '- **`media` (unreleased)**, which renders', '- **`media`**, which renders'],
      ['a bold one', '- `editorOptions` **(unreleased)** an array', '- `editorOptions` an array'],
      ['an italic one', '- reads `--x` *(unreleased)*.', '- reads `--x`.'],
      ['one opening a parenthesis', '- `editorOptions` (**(unreleased)** an array)', '- `editorOptions` (an array)'],
      ['one at the start of a clause', '- neutral. (unreleased) Hover paints', '- neutral. Hover paints'],
      [
        'one that starts a wrapped line, its punctuation moving up',
        '- **`PageHeader`: has a knob**\n  (unreleased). The title',
        '- **`PageHeader`: has a knob**.\n  The title',
      ],
    ])('drops %s from the promoted section', (_, bullet, expected) => {
      const { skill } = stamp(`### Unreleased\n\n${bullet}\n`);
      expect(section(skill, '9.9.9')).toBe(`### New in 9.9.9\n\n${expected}\n\n`);
    });

    it('keeps the text of a qualifier that carries more, with the version in its place', () => {
      const { skill } = stamp('### Unreleased\n\n- `collapsedFlyout?: boolean` (unreleased, default `false`).\n');
      expect(section(skill, '9.9.9')).toContain('(9.9.9, default `false`)');
    });

    it('rewrites qualifiers outside the promoted section to the version', () => {
      const { skill } = stamp('Prose about a **knob** (unreleased: `dashed-active`).\n\n### Unreleased\n\n- One.\n');
      expect(skill).toContain('**knob** (9.9.9: `dashed-active`)');
    });

    it('rewrites every form in the references, catalog rows and other files alike', () => {
      const { ref } = stamp('### Unreleased\n\n- One.\n', '9.9.9', {
        'component-catalog.md':
          '| **Foo** (unreleased) | knobs (unreleased; it used to) | default `normal`, unreleased) | (16px; unreleased, see above) |\n',
        'design-tokens.md': '| `--type-body-line-height` *(unreleased)* |\n',
      });
      expect(ref('component-catalog.md')).toContain(
        '| **Foo** (9.9.9) | knobs (9.9.9; it used to) | default `normal`, 9.9.9) | (16px; 9.9.9, see above) |',
      );
      expect(ref('design-tokens.md')).toBe('| `--type-body-line-height` *(9.9.9)* |\n');
    });

    it('resolves the references even when no notes are promoted', () => {
      const { skill, ref } = stamp(`### Unreleased\n\n${GUIDANCE}\n`, '9.9.9', {
        'component-catalog.md': '| **Foo** (unreleased) |\n',
      });
      expect(skill).not.toContain('### New in 9.9.9');
      expect(ref('component-catalog.md')).toContain('| **Foo** (9.9.9) |');
    });

    it('leaves the heading, unparenthesised prose and the changelog alone', () => {
      const prose = 'Covers whatever is merged but unreleased.\n\n';
      const history = '\n- The convention: mark a row "(unreleased)" until it ships.\n';
      const { skill, changelog } = stamp(`${prose}### Unreleased\n\n${GUIDANCE}\n`, '9.9.9', { 'changelog.md': history });
      expect(skill).toContain(prose);
      expect(skill).toContain(`### Unreleased\n\n${GUIDANCE}\n`);
      expect(changelog).toBe(`# Changelog\n${history}`);
    });

    it('is a no-op on files with no qualifiers', () => {
      const catalog = '| **Foo** (4.31.0) | `Foo` |\n';
      const { ref } = stamp('### Unreleased\n\n- One.\n', '9.9.9', { 'component-catalog.md': catalog });
      expect(ref('component-catalog.md')).toBe(`All 1 components exported from \`@viax.io/uxm/ui\` (as of v9.9.9)\n${catalog}`);
    });

    it('resolves a qualifier stranded under an older heading to THAT release', () => {
      const { skill } = stamp(
        '### New in 1.0.4\n\n- Late note (unreleased).\n- Knob (unreleased, default `0`).\n\n### Unreleased\n\n- Fresh (unreleased).\n',
      );
      expect(section(skill, '1.0.4')).toBe('### New in 1.0.4\n\n- Late note.\n- Knob (1.0.4, default `0`).\n\n');
      expect(section(skill, '9.9.9')).toBe('### New in 9.9.9\n\n- Fresh.\n\n');
    });

    it('never carries a qualifier into the changelog when a section rolls', () => {
      const released = ['1.0.1', '1.0.2', '1.0.3', '1.0.4', '1.0.5']
        .map((v) => `### New in ${v}\n\n- Shipped in ${v} (unreleased).\n\n`)
        .join('');
      const { changelog } = stamp(`${released}### Unreleased\n\n- Fresh.\n`);
      expect(changelog).toBe('# Changelog\n\n### New in 1.0.1\n\n- Shipped in 1.0.1.\n');
    });
  });
});
