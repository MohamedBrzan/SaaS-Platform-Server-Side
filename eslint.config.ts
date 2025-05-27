import { FlatConfigComposer } from "eslint-flat-config-utils";

const composer = new FlatConfigComposer();

export default composer.append(
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-floating-promises": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    ignores: ["dist", "node_modules", "coverage"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "no-debugger": "error",
      "no-empty-function": "warn",
      "no-magic-numbers": ["warn", { ignoreArrayIndexes: true, ignore: [0, 1] }],
      "prefer-const": "warn",
      "max-lines": ["warn", { max: 500 }],
      "max-lines-per-function": ["warn", { max: 75 }],
      "max-depth": ["warn", 4],
      complexity: ["warn", 15],
    },
  },
  {
    rules: {
      "prettier/prettier": "error",
    },
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
  },
);
