module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'airbnb-base',
    
    'plugin:prettier/recommended',
    '@nuxtjs',
    'prettier',
    'prettier/vue'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'max-len': 'off',
    'camelcase': 'off',
    'no-undef': 'off',
    'no-dupe-keys': 'off',
    'vue/no-dupe-keys': 'off',
    'consistent-return': 'off',
    'no-unused-vars': 'off',
    'array-callback-return': 'off',
    'no-else-return': 'off',
    'arrow-parens': 'off',
    'indent': 'off',
    'dot-notation': 'off',
    'prefer-destructuring': 'off',
    'no-restricted-syntax': 'off',
    'no-lonely-if': 'off',
    'vue/valid-template-root': 'off',
    'no-useless-escape': 'off',
    'no-useless-return': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/this-in-template': 'off',
    'vue/html-self-closing': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/attributes-order': 'off',
    'vue/name-property-casing': 'off',
    'vue/html-indent': 'off',
    'vue/require-prop-types': 'off',
    'no-console': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'space-before-function-paren': 'off',
    'no-param-reassign': 'off',
    'import/no-unresolved': 'off',
    'vue/html-quotes': 'off',
    'no-plusplus': 'off',
    'vue/no-template-shadow': 'off',
    'vue/no-v-html': 'off',  
    "prettier/prettier": "error"
  }
}