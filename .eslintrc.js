module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "class-methods-use-this": 0,
    "no-param-reassign":0,
    "no-confusing-arrow":0,
    "implicit-arrow-linebreak":0,
    "function-paren-newline":0,
    "comma-dangle":0,
    "arrow-body-style":0,
  },
}


