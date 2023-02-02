module.exports = {
  root: true,
  env: {
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-base', 'airbnb-typescript/base', 'plugin:jsdoc/recommended'],
  ignorePatterns: ['.eslintrc.js', 'jest.config.js'],
  rules: {
    'no-continue': 'off',
    'import/prefer-default-export': 'off',

    // this 없이 메소드를 쓰는 일이 잦아 규칙 off
    'class-methods-use-this': 'off',

    // mongodb의 ID 필드가 _id이기 때문에 규칙 off
    'no-underscore-dangle': 'off',

    // 때로는 inline이 더 깔끔할 때가 있음
    'object-curly-newline': 'off',

    // 비어있는 블록이 필요할 때도 있음
    'no-empty': 'off',

    // JSDoc 관련 규칙
    ...{
      // 항상 JSDoc을 작성하는 것은 아님
      'jsdoc/require-jsdoc': 'off',
    },
  },
};
