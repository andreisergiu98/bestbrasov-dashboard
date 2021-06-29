import { Command, flags } from '@oclif/command';
import execa from 'execa';
import { cliName } from '../../config';
import { createWorkspaceCommand } from '../../lib/shell';

export default class FrontendUpdate extends Command {
	static description = 'run frontend related code generation';

	static examples = [`$ ${cliName} frontend:update`];

	static flags = {
		help: flags.help({ char: 'h' }),
		errorsOnly: flags.boolean({
			char: 'e',
			description: 'overrides the errorsOnly config to true.',
		}),
		dev: flags.boolean({ char: 'd', description: 'watch for changes' }),
	};

	static args = [];

	async run() {
		const { flags } = this.parse(FrontendUpdate);

		let command = createWorkspaceCommand('frontend', 'generate');

		if (flags.dev) {
			command += ' -w';
		}

		if (flags.errorsOnly) {
			command += ' -e';
		}

		return execa.command(command, { stdio: 'inherit' });
	}
}
