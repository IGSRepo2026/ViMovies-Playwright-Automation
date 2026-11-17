import * as eslintConfig from "eslint/config";
import overridesConfig from "./eslint.config.overrides.mjs";
import { buildEslintConfig } from "./eslint.config.mjs";

/**
 * Pre-commit ESLint config.
 * Used by lint-staged via husky pre-commit hook.
 * Applies full rules + overrides (warnings for gradual adoption).
 */
export default eslintConfig.defineConfig([
  buildEslintConfig({
    isReportUnusedDisableDirectivesEnabled: false,
    tsconfigRootDir: import.meta.dirname,
  }),
  overridesConfig,
]);
