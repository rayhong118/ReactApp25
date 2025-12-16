import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Ignore the compiled output and node_modules
    ignores: ['lib/**/*', 'node_modules/**/*'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node, // Correct environment for Functions
        ...globals.jest,
      },
    },
    rules: {
      // Custom rules for your functions
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-unused-vars': 'warn',
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off"
    },
  }
);