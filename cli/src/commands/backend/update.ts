import { Command, flags } from '@oclif/command';

import Listr from 'listr';
import execa from 'execa';
import chokidar from 'chokidar';
import queue, { QueueWorkerCallback } from 'queue';

import { createWorkspaceCommand } from '../../lib/shell';
import { cliName, config } from '../../config';
import { logSymbols } from '../../lib/log-symbols';

const updateJobs = queue({
	autostart: true,
	concurrency: 1,
});

const runJob = (command: () => Promise<unknown>) => async (cb?: QueueWorkerCallback) => {
	try {
		await command();
	} catch (e) {
		console.log(e.message);
	} finally {
		cb?.();
		console.log(`  ${logSymbols.info} Watching for changes...`);
	}
};
export default class BackendUpdate extends Command {
	static description = 'run backend related code generation';

	static examples = [`$ ${cliName} backend:update`];

	static flags = {
		help: flags.help({ char: 'h' }),
		dev: flags.boolean({ char: 'd', description: 'watch for changes' }),
	};

	static args = [];

	private createTasks = () => {
		return new Listr<{}>([
			{
				title: 'Generate prisma and apollo resolvers',
				task: async () => {
					const gen = createWorkspaceCommand('backend', 'generate');
					const copy = createWorkspaceCommand('backend', 'postbuild');

					return execa
						.command(`${gen} && ${copy}`, { env: { FORCE_COLOR: 'TRUE' } })
						.catch((e) => {
							throw new Error(e.stderr);
						});
				},
			},
		]);
	};

	private runTasks = () => {
		return this.createTasks().run();
	};

	async run() {
		const { flags } = this.parse(BackendUpdate);

		if (flags.dev) {
			this.runWatcher();
		} else {
			this.runTasks().catch((e) => console.log(e.message));
		}
	}

	async runWatcher() {
		updateJobs.push(runJob(this.runTasks));
		chokidar.watch(config.prismaSchema).on('change', async (event, path) => {
			if (updateJobs.length >= 2) {
				updateJobs.pop();
			}
			updateJobs.push(runJob(this.runTasks));
		});
	}
}
