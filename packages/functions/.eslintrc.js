module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "import/no-unresolved": 0,
    "require-jsdoc": "off",
    quotes: "off",
    "quote-props": "off",
    "operator-linebreak": [
      "error",
      "after",
      { overrides: { "?": "before", ":": "before" } },
    ],
    "multiline-ternary": "off",
    // note you must disable the base rule as it can report incorrect errors
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "no-console": "off",
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/*.test.ts", "**/*.test.tsx"] },
    ],
    "import/order": "off",
    "max-len": ["warn", { code: 150, ignoreStrings: true }],
    "object-curly-spacing": "off",
    "import/prefer-default-export": "off",
    indent: "off",
    "guard-for-in": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
      },
    ],
  },
};
