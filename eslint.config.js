import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  { ignores: ["dist", "**/*.js", "**/*.jsx"] },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react: react,
      "react-hooks": reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...prettier.rules,
      "no-console": "error",
      "react-hooks/exhaustive-deps": "off",
      "react/prop-types": "off",
      "react/self-closing-comp": "warn",
      "react/button-has-type": "warn",
      "react/no-array-index-key": "warn",
      "react/no-children-prop": "error",
      "max-lines": ["warn", 750],
      "no-unused-vars": "warn",
      "react/jsx-no-target-blank": "off",
    },
  },
];
