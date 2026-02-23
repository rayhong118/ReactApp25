import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // Ignore compiled output and other non-source directories
    ignores: ["lib/**", "generated/**", "node_modules/**"],
  },
  {
    // Set the root directory for TSConfig resolution globally for this config
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // This block specifically configures the TypeScript parser and rules for .ts files.
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es6,
      },
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.dev.json"],
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "no-undef": "off", // Handled by TypeScript
    },
  },
  {
    // Configuration for configuration files (JS/MJS/CJS)
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Global rules for all files
    rules: {
      quotes: ["error", "double"],
      indent: ["error", 2],
      "max-len": ["error", { code: 120 }],
    },
  },
);
