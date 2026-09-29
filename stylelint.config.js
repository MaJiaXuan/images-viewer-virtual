export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'selector-class-pattern': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'layer', 'config'],
      },
    ],
  },
}
