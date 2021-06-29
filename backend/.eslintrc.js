module.exports = {
	root: true,
	env: {
		es2020: true,
		node: true,
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
				project: __dirname,
			},
		},
	},
	extends: ['../.eslintrc'],
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	ignorePatterns: [
		'/src/__generated__/**',
		'/migrations/**',
		'/build/**',
		'/.eslintrc.js',
	],
	rules: {
		'no-restricted-imports': [
			'error',
			{
				patterns: [
					{
						group: ['*/__generated/prisma/*'],
						message: 'Please use @lib/prisma instead.',
					},
					{
						group: ['*/__generated/data/*'],
						message: 'Please use @lib/resolvers instead.',
					},
				],
			},
		],
	},
};
