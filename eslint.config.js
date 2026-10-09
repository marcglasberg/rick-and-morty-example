// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
/* global __dirname */
const kiss = require('eslint-plugin-kiss-for-react').default;

module.exports = defineConfig([
  expoConfig,
  kiss.configs.recommended,
  {
    // Type information lets the Kiss rules find more mistakes, across files.
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    ignores: ['dist/*', '.expo/*'],
  },
]);
