module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    // 'eslint:recommended',
    // 'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react-hooks/recommended',
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    // 'airbnb/whitespace',
    'plugin:i18next/recommended',
    'prettier',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'vite.config.ts',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react-refresh', 'i18next', 'import'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "no-unused-vars": "off",
    'react/jsx-filename-extension': [2, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
    "import/prefer-default-export": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-no-constructed-context-values": "off",
    "no-underscore-dangle": "off",
    "import/no-cycle": "off",
    "no-restricted-exports": "off",
    "react/jsx-props-no-spreading": "off",
    "no-console": "error",
    "import/no-unresolved": "off",
    "react/require-default-props": "off",
    "no-use-before-define": "off",
    "no-undef": "off",
    "import/no-extraneous-dependencies": ["error", { "devDependencies": false }]
  },
  "overrides": [
    {
      "files": ["**/*.test.tsx", "**/*.spec.ts", "**/tests/**"],
      "rules": {
        "import/no-extraneous-dependencies": ["error", { "devDependencies": true }]
      }
    }
  ]
};
