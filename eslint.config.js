import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    rules: {
      semi: 'off',
      'prefer-const': 'error',
    },
  },
])
