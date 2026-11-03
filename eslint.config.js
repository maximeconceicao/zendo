const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const reactHooks = require('eslint-plugin-react-hooks');

/** Flat config ESLint pour l'application Web (React + TypeScript + Vite). */
module.exports = [
  { ignores: ['dist/**', 'node_modules/**', 'ios/**', 'android/**', 'app-example/**'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-undef': 'off', // géré par TypeScript
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off'
    }
  }
];
