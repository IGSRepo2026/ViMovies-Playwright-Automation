import eslint from "@eslint/js";
import eslintPluginPrettier from "eslint-config-prettier/flat";
import eslintTypescript from "typescript-eslint";
import eslintTypescriptParser from "@typescript-eslint/parser";

import * as eslintConfig from "eslint/config";

const eslintConfigBase = {
  extends: [eslint.configs.recommended],
};

const buildEslintConfigTypescript = ({ tsconfigRootDir }) => ({
  extends: [eslintTypescript.configs.recommended, eslintTypescript.configs.stylisticTypeChecked],
  files: ["**/*.ts", "**/*.tsx"],
  languageOptions: {
    parser: eslintTypescriptParser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: tsconfigRootDir,
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  rules: {
    // Prefer `type` over `interface`
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],

    // Stylistic rules — relaxed
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-indexed-object-style": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",

    // Unused variables — error with underscore exception
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],

    // Optional parameters last
    "default-param-last": "off",
    "@typescript-eslint/default-param-last": "error",

    // Return await in async functions
    "@typescript-eslint/return-await": ["error", "always"],
  },
});

const eslintConfigPrettier = {
  extends: [eslintPluginPrettier],
};

/**
 * Build the ESLint config with optional flags.
 *
 * @param {object} options
 * @param {boolean} [options.isReportUnusedDisableDirectivesEnabled] - Report unused eslint-disable comments
 * @param {string} [options.tsconfigRootDir] - TS project root
 * @returns {import("eslint").Linter.Config}
 */
export function buildEslintConfig(
  {
    isReportUnusedDisableDirectivesEnabled = false,
    tsconfigRootDir = "./",
  } = {
    isReportUnusedDisableDirectivesEnabled: false,
    tsconfigRootDir: "./",
  },
) {
  return eslintConfig.defineConfig([
    eslintConfigBase,
    buildEslintConfigTypescript({ tsconfigRootDir }),
    eslintConfigPrettier,
    [
      {
        linterOptions: {
          reportUnusedDisableDirectives: isReportUnusedDisableDirectivesEnabled ? "warn" : "off",
        },
      },
    ],
  ]);
}

export default eslintConfig.defineConfig([
  ...buildEslintConfig({ tsconfigRootDir: import.meta.dirname }),
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "allure-results/**",
      "allure-report/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
]);
