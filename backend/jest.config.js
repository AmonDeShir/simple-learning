/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [ 
    '<rootDir>/src/',
  ],
  collectCoverageFrom: [ 
    '<rootDir>/src/**/*.ts',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/tests',
    '<rootDir>/src/main.ts',
    '<rootDir>/src/config/config.ts',
    '<rootDir>/src/connection/database.ts',
  ],
  setupFilesAfterEnv: ['./src/tests/setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    }
  },
  testMatch: [
    '<rootDir>/src/tests/**/*.test.ts',
  ],
  resetMocks: true
};