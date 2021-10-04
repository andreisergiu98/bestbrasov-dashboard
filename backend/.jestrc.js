module.exports = {
	transform: {
		'^.+\\.tsx?$': '@swc/jest',
	},
	testEnvironment: 'node',
	setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
	modulePathIgnorePatterns: ['<rootDir>/.dist/'],
};
