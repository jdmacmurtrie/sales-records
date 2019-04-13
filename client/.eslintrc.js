module.exports = {
  env: {
    browser: true,
    es6: true,
    jquery: true
    },
  extends: [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
    },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
        },
    ecmaVersion: 2018,
    sourceType: "module"
    },
  plugins: [
        "react"
    ],
  rules: {
        "no-console": "off",
        "react/jsx-uses-vars": [
            2
        ],
        "react/prop-types": 0
    },
  parser: "babel-eslint"
};
