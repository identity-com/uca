// jest.config.js
module.exports = {
  testURL: 'http://localhost/',
  modulePathIgnorePatterns: [
    '<rootDir>/build/src',
  ],
  collectCoverageFrom: [
    '**/src/**/*.js',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/simulator/**',
    '!**/vendor/**',
    '!**/src/interfaces/*.js',
    '!**/src/index.js',
    '!**/src/CredentialWallet.js',
    '!**/src/adapters/HttpAdapter.js',
    '!**/src/services/SimpleHttpService.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 82,
      lines: 85,
      statements: 85,
    },
  },
  testTimeout: 20000,
  coverageDirectory: 'reports/coverage',
  verbose: true,
};
