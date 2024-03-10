// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
  rules: {
    'no-const-assign': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'dot-notation': 'error',
    eqeqeq: 'error',
    // 'capitalized-comments': 'error',
    // curly: 'error',
    'no-global-assign': 'error',
    'no-implicit-globals': 'error',
    'no-with': 'error',
    '@typescript-eslint/no-duplicate-enum-values': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
})
