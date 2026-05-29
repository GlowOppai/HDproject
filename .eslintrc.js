module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2021
  },
  plugins: ['node'],
  rules: {
    // Error prevention
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_|next' }],
    'no-console': 'off',
    'no-undef': 'error',

    // Code style
    'eqeqeq': ['error', 'always'],
    'curly': 'error',
    'no-var': 'error',
    'prefer-const': 'warn',
    'no-trailing-spaces': 'warn',

    // Node.js specific
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-require': 'error',
    'node/no-unpublished-require': 'off',

    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error'
  },
  ignorePatterns: [
    'node_modules/',
    'coverage/'
  ]
};
