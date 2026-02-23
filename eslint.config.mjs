import expo from 'eslint-config-expo';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  expo,
  prettier,
  {
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
