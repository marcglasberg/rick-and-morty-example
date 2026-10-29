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
    // Opt-in Kiss rules for this app's conventions: actions are named without an `Action`
    // suffix (`FetchCards`), live in files ending with `-action`, and the store starts
    // from `State.initialState`.
    rules: {
      'kiss-for-react/action-name-without-action': 'warn',
      'kiss-for-react/action-file-name-ends-with-action': 'warn',
      'kiss-for-react/missing-initial-state': 'warn',
    },
  },
  {
    ignores: ['dist/*', '.expo/*'],
  },
]);
