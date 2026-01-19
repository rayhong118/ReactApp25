import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPlugin from "eslint-plugin-react-compiler";

export default tseslint.config(
  {
    // Ignore the compiled output and node_modules
    ignores: ["lib/**", "dist/**", "functions/lib/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPlugin.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node, // Correct environment for Functions
        ...globals.jest,
      },
    },
    rules: {
      // Custom rules for your functions
      "@typescript-eslint/no-explicit-any": "warn",
      "no-unused-vars": "warn",
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
      "max-len": ["error", { code: 120 }],
    },
  },
);
