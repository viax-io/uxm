// ESLint 9 flat config for @viax/uxm (React 19 + TypeScript).
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
  { ignores: ['dist/**', 'dist-portal/**', 'node_modules/**', 'coverage/**', '.idea/**'] },

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

  // 5. Build / config files — Node globals, no default-export ban.
  {
    files: ['*.{js,mjs,cjs,ts}', 'tsup.config.ts', 'eslint.config.mjs'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'import/no-default-export': 'off' },
  },
);
