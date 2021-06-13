import { Command, flags } from '@oclif/command';
import { cliName } from '../../config';
import { createWorkspaceCommand, shSpawn } from '../../lib/shell';

export default class BackendStart extends Command {
	static description = 'start the backend application';

	static examples = [`$ ${cliName} backend:start`];

	static flags = {
		help: flags.help({ char: 'h' }),
		dev: flags.boolean({ char: 'd', description: 'watch for changes' }),
		'no-clear': flags.boolean(),
	};

	static args = [];

	async run() {
		const { flags } = this.parse(BackendStart);

		let command;
		if (flags.dev) {
			command = createWorkspaceCommand('backend', 'start:dev');
			if (!flags['no-clear']) {
				command += ' --clear';
			}
		} else {
			command = createWorkspaceCommand('backend', 'start:prod');
		}

		shSpawn(command);
	}
}
