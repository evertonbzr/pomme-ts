const { pathsToModuleNameMapper } = require('ts-jest');
const { cpus } = require('os');
const { compilerOptions } = require('./tsconfig');
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testTimeout: 30000,
  testRegex: '.*.test.ts$',
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/__mocks__/',
    '<rootDir>/node_modules/',
  ],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'ts', 'tsx'],
  testEnvironment: 'node',
  collectCoverage: false,
  coverageReporters: ['json', 'html'],
  // setupFilesAfterEnv: ['<rootDir>/__tests__/cleanup.ts'],
  forceExit: true,
  maxConcurrency: cpus().length * (process.env.CI ? 3 : 0.5),
  maxWorkers: cpus().length * (process.env.CI ? 3 : 0.5),
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/',
  }),
};
