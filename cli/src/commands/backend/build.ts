import { Command, flags } from '@oclif/command';
import { cliName } from '../../config';
import { createWorkspaceCommand, shSpawn } from '../../lib/shell';

export default class BackendBuild extends Command {
	static description = 'builds the backend application';

	static examples = [`$ ${cliName} backend:build`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [];

	async run() {
		const command = createWorkspaceCommand('backend', 'build');
		shSpawn(command);
	}
}
