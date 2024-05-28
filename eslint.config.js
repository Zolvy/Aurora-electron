import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  {
    ignores: ["**/utils/*", "**/src/web/scripts/"],
  },
  ...tseslint.configs.recommended,
];
