/* eslint-env node */
// require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: false,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
