/*
👋 Hi! This file was autogenerated by tslint-to-eslint-config.
https://github.com/typescript-eslint/tslint-to-eslint-config

It represents the closest reasonable ESLint configuration to this
project's original TSLint configuration.

We recommend eventually switching this configuration to extend from
the recommended rulesets in typescript-eslint.
https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

Happy linting! 💖
*/
module.exports = {
    env: {
      browser: true,
      es6: true,
      node: true,
    },
    extends: ['prettier'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'client/tsconfig.json',
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
      '@typescript-eslint/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        },
      ],
      '@typescript-eslint/semi': ['error', 'always'],
      indent: 'off',
      semi: 'off',
    },
  };