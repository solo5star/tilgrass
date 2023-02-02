module.exports = {
  extends: ['../.eslintrc.js'],
  parserOptions: {
    project: 'tsconfig.json',
  },
  env: {
    node: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // 기본 설정 값들
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
