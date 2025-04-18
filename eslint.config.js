import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.{ts,js}"],
  },
  {
    ignores: ["docs/.vitepress/cache", "**/dist", "**/*.d.ts"],
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        samp: true,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
