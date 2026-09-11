// ESLint 9 flat config for @viax.io/uxm (React 19 + TypeScript).
// Modern, lint-fast setup — no Airbnb dependency (incompatible peer deps).
// See plan: todo/25-05-2026-17-25-eslint-setup.md
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. Global ignores.
  // `todo/` is gitignored scratch space (plans, reviews, pasted snippets) — never lint it,
  // or a single minified paste there turns `npm run lint` red for the whole repo.
  { ignores: ['dist/**', 'dist-portal/**', 'dist-cdn/**', 'node_modules/**', 'coverage/**', '.idea/**', 'todo/**'] },

  // 2. JS recommended.
  js.configs.recommended,

  // 3. TS recommended (non-type-checked — keeps lint fast and config-light).
  ...tseslint.configs.recommended,

  // 4. React + Hooks + JSX a11y for TSX/JSX files.
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: '19.0' },
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
        node: true,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      // React 19 jsx-runtime — turns off react-in-jsx-scope & jsx-uses-react.
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs['recommended-latest'].rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // Airbnb-ish ergonomic rules without the Airbnb dep.
      eqeqeq: ['error', 'smart'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Semicolons required at the end of every statement.
      semi: ['error', 'always'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Enforce the `import type` convention (style guide D3/I3): type-only
      // symbols come in via a separate `import type { … }` statement.
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // TypeScript handles prop typing; React 19 jsx-runtime needs no scope import.
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',

      // Quote style — single quotes for JS/TS, double for JSX attributes
      // (HTML-traditional). `avoidEscape` keeps strings legible when they
      // contain an apostrophe; template literals are always allowed.
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'jsx-quotes': ['error', 'prefer-double'],

      // Function-style — React components use function declarations
      // (hoisting, clean stack traces, generic-prop ergonomics). Local
      // helpers / handlers / callbacks use arrow functions for lexical
      // `this` and inline-readability.
      'react/function-component-definition': ['error', {
        namedComponents: 'function-declaration',
        unnamedComponents: 'arrow-function',
      }],
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'prefer-arrow-callback': 'error',
    },
  },

  // 5. Layer boundaries — `studio / previews → ui → tokens` (CLAUDE.md). Until
  //    now this was convention only; a stray `@/studio` import in an atom would
  //    ship studio code to every consumer without anything noticing. Zones are
  //    "files under `target` may not import from `from`". Per-atom previews
  //    (`src/ui/**/*-preview.tsx`) legitimately read the two leaf modules of
  //    `src/previews` (the PreviewProps contract and the shared demo actions),
  //    hence the `except`; the barrel and the composite previews stay off-limits.
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'import/no-restricted-paths': ['error', {
        zones: [
          {
            target: './src/ui',
            from: './src/studio',
            message: 'src/ui must not depend on src/studio — the direction is studio → ui → tokens.',
          },
          {
            target: './src/ui',
            from: './src/previews',
            except: ['./types.ts', './demo-row-actions.tsx'],
            message: 'src/ui may only read the preview contract (src/previews/types.ts) and demo-row-actions, never the previews barrel or composites.',
          },
          {
            target: './src/previews',
            from: './src/studio',
            message: 'src/previews must not depend on src/studio — previews are consumed BY the studio.',
          },
          {
            target: './src/tokens',
            from: './src',
            except: ['./tokens'],
            message: 'src/tokens is the leaf layer — it imports nothing from the rest of src.',
          },
          {
            target: ['./src/lib', './src/hooks', './src/helpers'],
            from: ['./src/ui', './src/studio', './src/previews'],
            message: 'src/lib, src/hooks and src/helpers are shared leaves — they must not import components or the studio.',
          },
        ],
      }],
    },
  },

  // 6. Tree-shake guarantee — no `*-preview` module may be re-exported from a
  //    ui barrel, or `@viax.io/uxm/ui` drags every canvas preview into consumers.
  //    Previously "verify by hand" (CLAUDE.md); now the linter does it.
  {
    files: ['src/ui/index.ts', 'src/ui/*/index.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['*-preview', '*-preview.tsx', '**/*-preview', '**/*-preview.tsx'],
          message: 'Preview modules are exported from src/previews/index.ts only — never from a ui barrel (tree-shake guarantee).',
        }],
      }],
    },
  },

  // 7. Build / config files — Node globals, no default-export ban.
  {
    files: ['*.{js,mjs,cjs,ts}', 'tsup.config.ts', 'vitest.config.ts', 'eslint.config.mjs'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'import/no-default-export': 'off' },
  },
);
