const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { esbuildDecorators } = require('@anatine/esbuild-decorators');
const { esbuildTypechecking } = require('esbuild-plugin-typecheck');
const { esbuildRunner } = require('esbuild-plugin-runner');
const fs = require('fs');

const args = process.argv.slice(2);

const isDev = args.includes('--dev') || args.includes('-d');

const outdir = '.dist';
const prismaSchema = 'schema.prisma';
const entryPoints = ['index.ts'];

function copyPrismaSchema() {
	return {
		name: 'copy-prisma-schema',
		async setup(build) {
			build.onStart(async () => {
				try {
					await fs.promises.mkdir(outdir, { recursive: true });
				} catch (e) {}
				await fs.promises.copyFile(prismaSchema, `${outdir}/${prismaSchema}`);
			});
		},
	};
}

const plugins = [copyPrismaSchema(), nodeExternalsPlugin(), esbuildDecorators()];

const devPlugins = [
	esbuildTypechecking(),
	esbuildRunner({ onSuccess: 'yarn start:env' }),
];

async function build() {
	await esbuild.build({
		entryPoints,
		outdir,
		bundle: true,
		sourcemap: true,
		platform: 'node',
		watch: isDev || undefined,
		target: 'node16',
		plugins: isDev ? plugins.concat(devPlugins) : plugins,
	});
}

build().catch(() => process.exit(1));
