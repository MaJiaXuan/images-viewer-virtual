export default {
  '*.{js,mjs,cjs}': ['eslint --fix'],
  '*.{css,scss}': ['stylelint --fix'],
  '*.{js,css,scss,md,json,html}': ['prettier --write'],
}
