import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: { ...globals.browser },
    },
    plugins: {
      js: pluginJs,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      "no-unused-vars": "warn",
    },
  },
];
