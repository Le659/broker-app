// broker-app/api/jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // coleta cobertura de src/*.ts, ignora main.ts e testes
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.(ts|js)',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/*.interceptor.ts',
    '!src/types/**',
    '!src/**/*.entity.ts',
    '!**/index.ts'
  ],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],

  // thresholds globais
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // extensões TS
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
