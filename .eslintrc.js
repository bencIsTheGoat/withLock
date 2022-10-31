const testFileGlobs = ['src/test-infra/*', '**/*.test.*', 'jest.*'];
const toolFileGlobs = ['src/tools/**/*', 'src/cron/**/*'];
const devFileGlobs = [...testFileGlobs, ...toolFileGlobs, 'esbuild.*'];

module.exports = {
  ignorePatterns: ['.eslintrc.js'], // suppresses an error around typescript not covering this file
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'prettier', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  env: {
    node: true,
  },
  rules: {
    /**
     * ******************
     * Additional rules.
     * ******************
     */
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    /**
     * ******************
     * Modified rules.
     * ******************
     */
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
      },
    ],
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        // Kind of sad, but there's just too many instances of this to check right now.
        checksVoidReturn: false,
      },
    ],
    /**
     * ******************
     * Rules we don't want.
     * ******************
     */
    'no-fallthrough': 'off',
    '@typescript-eslint/no-explicit-any': 'off', // this was a warning
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/unbound-method': 'off',
    'no-constant-condition': 'off',
    'no-prototype-builtins': 'off',
    'no-extra-boolean-cast': 'off',
    'class-methods-use-this': 'off',

    /**
     * ******************
     * Rules we might want, but need to do the work to resolve existing issues.
     * TODO: add these ad hoc.
     * ******************
     */
    '@typescript-eslint/no-unused-vars': 'off', // there are 2k+ of these, turning off to avoid warning overload
    'no-useless-escape': 'warn',
    'import/no-duplicates': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    /**
     * ******************
     * Rules we might want, but are a little broken right now or require more discussion.
     * TODO: add these ad hoc.
     * ******************
     */

    // Together, these 4 import rules took about 97.5% of the execution time of lint run.
    // https://eslint.org/docs/1.0.0/developer-guide/working-with-rules#per-rule-performance
    // Note that while some overlap with TS, they are apparently still useful for dependencies:
    // https://github.com/import-js/eslint-plugin-import/issues/2346
    'import/default': 'off', // slow: 16s on its own
    'import/namespace': 'off', // slow: 42s on its own
    'import/no-named-as-default': 'off', // slow: took 15s on its own
    'import/no-named-as-default-member': 'off', // slow: took 17s on its own
    '@typescript-eslint/ban-types': 'off',
    // There are some places these should be allowed, like some tools. We can
    // implement overrides to allow.
    '@typescript-eslint/no-var-requires': 'off',
    'import/no-extraneous-dependencies': [
      // this is reporting on a bunch of @types/ packages that aren't directly imported
      'off',
      {
        devDependencies: devFileGlobs,
      },
    ],
    'prettier/prettier': 'error',
    'unused-imports/no-unused-imports': 'error',
  },
  overrides: [
    {
      files: '*',
      excludedFiles: devFileGlobs,

      rules: {
        'import/no-restricted-paths': [
          'error',
          {
            zones: [
              {
                // Note that even though we target all of `src` here, because this is
                // in an override block with excludedFiles, this won't apply to all files.
                target: './',
                from: './src/tools',
                message: 'Tools should not be imported into business logic.',
              },
            ],
          },
        ],
      },
    },
    {
      files: testFileGlobs,
      extends: ['plugin:jest/recommended'],
      rules: {
        /**
         * ******************
         * Additional rules.
         * ******************
         */
        /**
         * ******************
         * Modified rules.
         * ******************
         */
        // this is disabled for normal code (for now) but comes up
        // a fair amount in tests, so we start by enabling it in them.
        '@typescript-eslint/no-floating-promises': 'error',
        'jest/expect-expect': 'error',
        /**
         * ******************
         * Rules we don't want.
         * ******************
         */
        'jest/no-commented-out-tests': 'off',
        /**
         * ******************
         * Rules we might want, but are a little broken right now or require more discussion.
         * TODO: add these ad hoc.
         * ******************
         */
        'jest/no-conditional-expect': 'off', // we have some tests where we do this in a loop, with an else, which should be fine
      },
    },
  ],
};
