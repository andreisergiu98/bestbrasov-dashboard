import esbuild from 'esbuild';
import { esbuildCommands } from 'esbuild-plugin-commands';
import { esbuildDecorators } from 'esbuild-plugin-ts-decorators';
import fs from 'fs';
import recursiveCopy from 'recursive-copy';
import yargs from 'yargs';

const packageConfig = JSON.parse(
	fs.readFileSync(process.cwd() + '/package.json', 'utf-8')
);

const options = yargs(process.argv.slice(2))
	.option('dev', {
		alias: 'd',
		type: 'boolean',
		description: 'Run in development mode',
	})
	.parse();

const { dev } = options;

function getWorkspaces() {
	const map = packageConfig.dependencies;
	const deps = Object.keys(map);
	const workspaceDeps = deps.filter((key) => map[key]?.startsWith('workspace:'));
	return workspaceDeps;
}

function getExternals(bundleWorkspaces) {
	const map = packageConfig.dependencies;
	const deps = Object.keys(map);

	// if (!bundleWorkspaces) {
	return deps;
	// }

	const workspaces = getWorkspaces();
	const external = deps.filter((key) => !workspaces.includes(key));
	return external;
}

const resolvePrisma = () => ({
	name: 'prisma-resolver',
	async setup(build) {
		let finish = Promise.resolve();
		const dist = build.initialOptions.outdir + '/prisma';

		build.onStart(() => {
			finish = recursiveCopy('./__generated__/prisma', dist, {
				overwrite: true,
				concurrency: 15,
			}).then(() => {});
		});

		build.onEnd(() => {
			return finish;
		});

		build.onResolve({ filter: /__generated__\/prisma$/ }, (args) => {
			console.log(args);
			return { path: './prisma', external: true };
		});
	},
});

const mainPlugins = [
	resolvePrisma(),
	esbuildDecorators(),
	// pnpPlugin(),
];
const devPlugins = [esbuildCommands({ onSuccess: 'yarn start:inspect' })];

const plugins = dev ? mainPlugins.concat(devPlugins) : mainPlugins;

esbuild
	.build({
		entryPoints: ['setup-server.ts'],
		outdir: '.dist',
		bundle: true,
		color: true,
		sourcemap: true,
		platform: 'node',
		watch: dev,
		target: 'node17',
		plugins,
		treeShaking: true,
		external: getExternals(dev),
	})
	.catch(() => process.exit(1));
