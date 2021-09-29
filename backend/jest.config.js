module.exports = {
	transform: {
		'^.+\\.ts$': 'esbuild-jest',
	},
	moduleNameMapper: {
		'@jobs/(.*)': '<rootDir>/jobs/$1',
		'@lib/(.*)': '<rootDir>/lib/$1',
		'@rules/(.*)': '<rootDir>/rules/$1',
		'@typings/(.*)': '<rootDir>/typings/$1',
		'@utils/(.*)': '<rootDir>/utils/$1',
	},
	testEnvironment: 'node',
};
