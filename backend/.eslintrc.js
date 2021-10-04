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
				project: __dirname + '/tsconfig.eslint.json',
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
		'/.dist/**',
		'/__generated__/**',
		'/migrations/**',
		'/.eslintrc.js',
		'/.jestrc.js',
		'/.swc.cli.js',
	],
	rules: {
		'no-restricted-imports': [
			'error',
			{
				patterns: [
					{
						group: ['*/__generated__/prisma', '*/__generated__/prisma*'],
						message: 'Use "@lib/prisma" instead.',
					},
					{
						group: ['*/__generated__/data', '*/__generated__/data*'],
						message: 'Use "@lib/" modules instead.',
					},
				],
			},
		],
		'@typescript-eslint/naming-convention': 'off',
	},
};
