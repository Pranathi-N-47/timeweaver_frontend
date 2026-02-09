/**
 * Jest Configuration for TimeWeaver Frontend
 * Testing vanilla JavaScript with JSDOM for browser APIs
 */

module.exports = {
  // Use JSDOM environment to simulate browser APIs
  testEnvironment: 'jsdom',
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.test.js'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.min.js',
    '!src/legacy/**'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 50,
      functions: 60,
      lines: 60
    }
  },
  
  // Verbose output
  verbose: true,
  
  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
