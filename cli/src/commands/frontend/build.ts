import { Command, flags } from '@oclif/command';
import { cliName } from '../../config';
import { createWorkspaceCommand, shSpawn } from '../../lib/shell';

export default class FrontendBuild extends Command {
	static description = 'build the frontend application';

	static examples = [`$ ${cliName} frontend:build`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [];

	async run() {
		const { args, flags } = this.parse(FrontendBuild);

		const command = createWorkspaceCommand('frontend', 'build');
		shSpawn(command);
	}
}
