import { Command, flags } from '@oclif/command';
import chokidar from 'chokidar';
import queue, { QueueWorkerCallback } from 'queue';

import { createWorkspaceCommand, shSpawn } from '../../lib/shell';
import { cliName, config } from '../../config';

const updateJobs = queue({
	autostart: true,
	concurrency: 1,
});

updateJobs.push();

const runCommand = (command: string) => async (cb?: QueueWorkerCallback) => {
	try {
		await shSpawn(command);
	} catch (e) {}
	cb?.();
};

export default class BackendUpdate extends Command {
	static description = 'run backend related code generation';

	static examples = [`$ ${cliName} backend:update`];

	static flags = {
		help: flags.help({ char: 'h' }),
		dev: flags.boolean({ char: 'd', description: 'watch for changes' }),
	};

	static args = [];

	async run() {
		const { flags } = this.parse(BackendUpdate);

		const command = createWorkspaceCommand('backend', 'prisma generate');

		if (!flags.dev) {
			return shSpawn(command);
		}

		updateJobs.push(runCommand(command));
		chokidar.watch(config.prismaSchema).on('change', async (event, path) => {
			if (updateJobs.length >= 2) {
				updateJobs.pop();
			}
			updateJobs.push(runCommand(command));
		});
	}
}
