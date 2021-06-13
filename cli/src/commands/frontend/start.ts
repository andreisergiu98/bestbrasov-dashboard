import { Command, flags } from '@oclif/command';
import { cliName } from '../../config';
import { createWorkspaceCommand, shSpawn } from '../../lib/shell';

export default class FrontendStart extends Command {
	static description = 'start the frontend application';

	static examples = [`$ ${cliName} frontend:start`];

	static flags = {
		help: flags.help({ char: 'h' }),
		dev: flags.boolean({ char: 'd', description: 'watch for changes' }),
	};

	static args = [];

	async run() {
		const { flags } = this.parse(FrontendStart);

		if (flags.dev) {
			const command = createWorkspaceCommand('frontend', 'start');
			shSpawn(command);
			return;
		}

		throw new Error(
			'No standalone configuration for the Frontend Application was configured!'
		);
	}
}
