module.exports = {
  roots: ['<rootDir>/test', '<rootDir>/src'],
  testMatch: [
    '**/test/**/*.+(ts|tsx|js|jsx)',
    '**/test/?(*.)+(spec|test).+(ts|tsx|js|jsx)',
    '**/src/**/*.+(spec|test).+(ts|tsx|js|jsx)'
  ],
  testEnvironment: 'jsdom',
}