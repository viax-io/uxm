// ESLint 9 flat config for @viax/uxm (React 19 + TypeScript).
// Modern, lint-fast setup — no Airbnb dependency (incompatible peer deps).
// See plan: todo/25-05-2026-17-25-eslint-setup.md
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import globals from "globals";

export default tseslint.config(
  // 1. Global ignores.
  { ignores: ["dist/**", "node_modules/**", "coverage/**", ".idea/**"] },

  // 2. JS recommended.
  js.configs.recommended,

  // 3. TS recommended (non-type-checked — keeps lint fast and config-light).
  ...tseslint.configs.recommended,

  // 4. React + Hooks + JSX a11y for TSX/JSX files.
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "19.0" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      // React 19 jsx-runtime — turns off react-in-jsx-scope & jsx-uses-react.
      ...react.configs.flat["jsx-runtime"].rules,
      ...reactHooks.configs["recommended-latest"].rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // Airbnb-ish ergonomic rules without the Airbnb dep.
      eqeqeq: ["error", "smart"],
      "no-var": "error",
      "prefer-const": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "type"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // TypeScript handles prop typing; React 19 jsx-runtime needs no scope import.
      "react/prop-types": "off",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
    },
  },

  // 5. Build / config files — Node globals, no default-export ban.
  {
    files: ["*.{js,mjs,cjs,ts}", "tsup.config.ts", "eslint.config.mjs"],
    languageOptions: { globals: { ...globals.node } },
    rules: { "import/no-default-export": "off" },
  },
);
