import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: [
      'src/setupTests.js',
      '**/*.test.jsx',
      '**/*.test.js',
    ],
  },
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooksPlugin.configs.flat['recommended-latest'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    settings: {
      react: {
        version: '18.2',
      },
    },
    plugins: {
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      'react-refresh/only-export-components': 'warn',
    },
  },
];
