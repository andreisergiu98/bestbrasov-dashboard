const esbuild = require('esbuild');

const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { esbuildDecorators } = require('esbuild-plugin-ts-decorators');
const { esbuildWatchTypes } = require('esbuild-plugin-watch-types');
const { esbuildCommands } = require('esbuild-plugin-commands');

const { copyStaticFiles } = require('./esbuild.files');

const args = process.argv.slice(2);
const isDev = args.includes('--dev') || args.includes('-d');

const plugins = [
	nodeExternalsPlugin(),
	esbuildDecorators(),
	copyStaticFiles({ files: ['schema.prisma'] }),
];

const devPlugins = [
	...plugins,
	esbuildCommands({ onSuccess: 'yarn start:app:dev' }),
	esbuildWatchTypes(),
];

async function build() {
	await esbuild.build({
		entryPoints: ['index.ts'],
		outdir: '.dist',
		bundle: true,
		color: true,
		sourcemap: true,
		platform: 'node',
		watch: isDev || undefined,
		target: 'node16',
		plugins: isDev ? devPlugins : plugins,
	});
}

build().catch(() => process.exit(1));
