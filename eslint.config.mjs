import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettierConfig from 'eslint-config-prettier/flat'
import prettierPlugin from 'eslint-plugin-prettier'
import unusedImports from 'eslint-plugin-unused-imports'

export default defineConfig([
  ...nextVitals,
  {
    plugins: {
      prettier: prettierPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      camelcase: 'off',
      'no-useless-constructor': 'off',
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  prettierConfig,
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'out/**',
    'dist/**',
    'build/**',
    'src/lib/api/generated/**', // Generated code (Orval)
  ]),
])
