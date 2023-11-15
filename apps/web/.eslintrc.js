module.exports = {
  extends: ['custom/next'],
  plugins: ['sort-keys-fix'],
  rules: {
    'sort-keys-fix/sort-keys-fix': 'warn',
    'react/jsx-sort-props': [
      '2',
      {
        callbacksLast: true,
        shorthandFirst: false,
        shorthandLast: true,
        multiline: 'last',
        ignoreCase: true,
        noSortAlphabetically: true,
      },
    ],
  },
};
