import stylisticJsPlugin from '@stylistic/eslint-plugin-js';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettierConfig,
  {
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      '@stylistic/js': stylisticJsPlugin
    },
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs', '*.js']
        },
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      'max-params': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/max-params': ['off'],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' }
      ],
      '@typescript-eslint/no-misused-promises': [2, { checksVoidReturn: { attributes: false } }],
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {
          allowConstantLoopConditions: true
        }
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'brace-style': 'error',
      camelcase: 'warn',
      curly: 'error',
      eqeqeq: ['error', 'always'],
      'key-spacing': 'error',
      'eol-last': ['warn', 'always'],
      'linebreak-style': ['error', 'unix'],
      'newline-before-return': 'error',
      'no-await-in-loop': 'off',
      'no-console': ['error'],
      'no-multi-spaces': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_'
        }
      ],
      'no-var': 'error',
      'object-curly-spacing': ['error', 'always'],
      'prefer-const': [
        'error',
        {
          destructuring: 'any',
          ignoreReadBeforeAssign: false
        }
      ],
      'require-await': 'error',
      semi: ['error', 'always'],
      'space-before-blocks': 'error',
      'spaced-comment': ['error', 'always'],
      'space-infix-ops': 'error',
      'import/newline-after-import': ['error', { count: 1, exactCount: true, considerComments: true }],
      '@stylistic/js/padding-line-between-statements': [
        'warn',
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*'
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var']
        },
        {
          blankLine: 'always',
          prev: ['function'],
          next: ['function']
        }
      ],
      'import/no-namespace': 'warn',
      'import/no-default-export': 'error',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^.+\\.?(css)$'],
            ['^react', '^@?\\w'],
            ['^@cagnea', '^@?\\w'],
            ['^src?\\w'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
          ]
        }
      ],
      'no-restricted-syntax': [
        'error',
        {
          message: 'Do not import default from lodash-es. Use a namespace import (* as) instead.',
          selector: 'ImportDeclaration[source.value="lodash-es"] ImportDefaultSpecifier'
        }
      ]
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.tsx', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-console': 'off',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off'
    }
  },
  {
    files: [
      '**/module-entry.ts',
      'app/**/*.tsx',
      'app/**/*.ts',
      'next.config.ts',
      '*.config.mjs',
      '*.config.js',
      '*.config.ts'
    ],
    rules: {
      'import/no-default-export': 'off'
    }
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'dist/**', '**/__mocks__/**'])
]);

export default eslintConfig;
