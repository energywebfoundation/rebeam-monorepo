module.exports = {
  extends: [
    "@energyweb",
  ],
  env: {
    // This value should be project dependent and should not be the same for all repos
    // https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments
    es2021: true,
    node: true,
    jest: true,
  },
};
