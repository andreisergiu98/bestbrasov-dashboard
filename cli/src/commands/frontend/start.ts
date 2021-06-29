import { Command, flags } from '@oclif/command';
import concurrently, { CommandObj } from 'concurrently';
import execa from 'execa';
import { cliName } from '../../config';
import { createWorkspaceCommand } from '../../lib/shell';

export default class FrontendStart extends Command {
	static description = 'start the frontend application';

	static examples = [`$ ${cliName} frontend:start`];

	static flags = {
		help: flags.help({ char: 'h' }),
		dev: flags.boolean({ char: 'd', description: 'watch for changes' }),
		update: flags.boolean({ char: 'u', description: 'starts graphql code generation' }),
	};

	static args = [];

	async run() {
		const { flags } = this.parse(FrontendStart);

		if (!flags.dev) {
			throw new Error(
				'No standalone configuration for the Frontend Application was configured!'
			);
		}

		const commands: CommandObj[] = [
			{
				name: ' react ',
				prefixColor: 'cyan',
				command: createWorkspaceCommand('frontend', 'start'),
			},
		];

		if (flags.update) {
			commands.push({
				name: ' codegen ',
				prefixColor: 'magenta',
				command: 'yarn cli frontend:update --dev --errorsOnly',
			});
		}

		if (commands.length === 1) {
			return execa.command(commands[0].command, { stdio: 'inherit' });
		} else {
			concurrently(commands);
		}
	}
}
