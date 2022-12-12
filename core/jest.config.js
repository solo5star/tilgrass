/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testMatch: ['**/__tests__/**/*.+ts', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
};
