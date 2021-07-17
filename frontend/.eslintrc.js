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
				project: __dirname,
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
		'/src/typings/__generated__/**',
		'/build/**',
		'craco.config.js',
		'.eslintrc.js',
	],
	rules: {
		'no-restricted-imports': [
			'error',
			{
				patterns: [
					{
						group: ['*/__generated__/data/*'],
						message: 'Please use @lib/data instead.',
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
		'react/react-in-jsx-scope': 'off',
		'react-hooks/exhaustive-deps': 'warn',
		'react-hooks/rules-of-hooks': 'error',
	},
};
