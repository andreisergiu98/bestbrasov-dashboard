import path from 'path';

export const cliName = 'yarn cli';

export const config = {
	workspaces: {
		cli: '@bestbrasov/cli',
		backend: '@bestbrasov/backend',
		frontend: '@bestbrasov/frontend',
	},
	backendDir: path.resolve(__dirname, '../../backend'),
	frontendDir: path.resolve(__dirname, '../../frontend'),
	prismaSchema: path.resolve(__dirname, '../../backend/schema.prisma'),
};

export default config;
