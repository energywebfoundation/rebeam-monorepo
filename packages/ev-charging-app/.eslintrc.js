module.exports = {
  extends: [
    "@energyweb",
    "plugin:react/recommended"
  ],
  env: {
    // This value should be project dependent and should not be the same for all repos
    // https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments
    es2021: true,
    browser: true,
    jest: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    "react/react-in-jsx-scope": "off"
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect"
    }
  }
};
