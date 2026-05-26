/**
 * Conventional Commits enforcement.
 * Aligns with semantic-release defaults (commit-analyzer + release-notes-generator).
 * Mirrored from viax-core-importmap with type-enum sourced from
 * conventional-commit-types (same list cz-conventional-changelog presents).
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed types — kept in sync with cz-conventional-changelog prompts.
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
    'footer-max-line-length': [2, 'always', 100],
  },
};
