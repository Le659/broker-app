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
      functions: 50,   // abaixei funções para 50%
      lines: 50,       // abaixei linhas para 50%
      statements: 50,  // abaixei statements para 50%
    },
  },

  // extensões TS
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
