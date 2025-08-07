// A somewhat common set of rules we use across noon

module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true,
        jest: true,
    },
    extends: [
        'next/core-web-vitals',
        'airbnb',
        'eslint:recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:json/recommended',
        'next',
        'prettier',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    plugins: ['prettier', '@typescript-eslint', 'sort-destructure-keys', 'json'],
    rules: {
        'react/no-unescaped-entities': 'off',
        '@next/next/no-page-custom-font': 'off',

        // Prettier config
        'prettier/prettier': [
            1,
            {
                jsxSingleQuote: false,
                printWidth: 120,
                tabWidth: 4,
                singleQuote: true,
                trailingComma: 'all',
            },
        ],
        // Monorepo compatibility
        'import/no-extraneous-dependencies': [
            'warn',
            {
                packageDir: [__dirname],
                devDependencies: false,
                optionalDependencies: false,
                peerDependencies: false,
            },
        ],
        // So that .ts and .tsx should not be in imports
        'import/extensions': [
            'error',
            {
                json: 'always',
                ts: 'never',
                tsx: 'never',
                css: 'always',
                scss: 'always',
            },
        ],
        // So that .tsx files can have JSX
        'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
        // So that types are like TCatalog, and interfaces are like IUser. Easier to identify types vs vars
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'interface',
                format: ['PascalCase'],
                custom: {
                    regex: '^I[A-Z][a-zA-Z0-9]+$',
                    match: true,
                },
            },
            {
                selector: 'typeAlias',
                format: ['PascalCase'],
                custom: {
                    regex: '^T[A-Z][a-zA-Z0-9]+$',
                    match: true,
                },
            },
        ],
        'import/prefer-default-export': 'off',
        'sort-destructure-keys/sort-destructure-keys': 2,
        'sort-keys': [0, 'asc', { natural: true }],
        'react/require-default-props': 0,

        // Disable base rule as it can report incorrect errors https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md#how-to-use
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': ['error'],
    },
};
