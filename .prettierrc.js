module.exports = {
	useTabs: true,
	singleQuote: true,
	printWidth: 90,
	overrides: [
		{
			files: ['.vscode/**/*.json'],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
		{
			files: ['*.yml', '*.yaml'],
			options: {
				singleQuote: false,
				tabWidth: 2,
			},
		},
	],
	plugins: [require('prettier-plugin-organize-imports')],
};
