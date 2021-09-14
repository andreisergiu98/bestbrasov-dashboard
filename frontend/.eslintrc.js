module.exports = {
	root: true,
	env: {
		es6: true,
		browser: true,
	},
	settings: {
		react: {
			version: 'detect',
		},
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
				project: __dirname + '/tsconfig.eslint.json',
			},
		},
	},
	plugins: ['react', 'react-hooks'],
	extends: [
		'../.eslintrc',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:jsx-a11y/recommended',
	],
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	ignorePatterns: [
		'/.dist/**',
		'/.vite/**',
		'/__generated__/**',
		'vite.config.js',
		'.eslintrc.js',
	],
	rules: {
		'no-restricted-imports': [
			'error',
			{
				patterns: [
					{
						group: ['*/__generated__/types/*'],
						message: 'Use @generated/types instead.',
					},
				],
			},
		],
		'@typescript-eslint/naming-convention': 'off',
		'no-unused-expressions': 'off',
		'react/jsx-key': 'error',
		'react/jsx-uses-react': 'off',
		'react/no-deprecated': 'error',
		'react/no-string-refs': 'error',
		'react/prop-types': 'off',
		'react/react-in-jsx-scope': 'off',
		'react-hooks/exhaustive-deps': 'warn',
		'react-hooks/rules-of-hooks': 'error',
	},
};
