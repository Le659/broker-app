module.exports = {
  env: { node: true, es6: true, jest: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { project: './tsconfig.json', sourceType: 'module' },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
  },
  overrides: [
    // libera `any` nos testes
    {
      files: ['src/**/*.spec.ts', 'test/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    // libera `any` nos modules
    {
      files: ['src/**/*.module.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    // libera vars não usadas no main
    {
      files: ['src/main.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};
