import { Command, flags } from '@oclif/command';
import { cliName } from '../../config';
import { createWorkspaceCommand, shSpawn } from '../../lib/shell';

export default class FrontendUpdate extends Command {
	static description = 'run frontend related code generation';

	static examples = [`$ ${cliName} frontend:update`];

	static flags = {
		help: flags.help({ char: 'h' }),
		dev: flags.boolean({ char: 'd', description: 'watch for changes' }),
	};

	static args = [];

	async run() {
		const { flags } = this.parse(FrontendUpdate);

		let command;
		if (flags.dev) {
			command = createWorkspaceCommand('frontend', 'generate -w');
		} else {
			command = createWorkspaceCommand('frontend', 'generate');
		}
		shSpawn(command);
	}
}
