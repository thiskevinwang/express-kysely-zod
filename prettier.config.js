/** @type {import("prettier").Options} */
module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  importOrder: [
    // node stdlib
    '^(path|fs|child_process)$',
    // node_modules
    '<THIRD_PARTY_MODULES>',
    '^@/',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
