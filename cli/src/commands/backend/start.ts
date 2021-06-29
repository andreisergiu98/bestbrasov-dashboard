import { Command, flags } from '@oclif/command';
import concurrently, { CommandObj } from 'concurrently';
import execa from 'execa';
import { cliName } from '../../config';
import { createWorkspaceCommand } from '../../lib/shell';

export default class BackendStart extends Command {
	static description = 'start the backend application';

	static examples = [`$ ${cliName} backend:start`];

	static flags = {
		help: flags.help({ char: 'h' }),
		update: flags.boolean({ char: 'u', description: 'update on prisma schema changes' }),
		clear: flags.boolean({ description: 'clear on changes' }),
		dev: flags.boolean({ char: 'd', description: 'watch for changes' }),
	};

	static args = [];

	async run() {
		const { flags } = this.parse(BackendStart);

		if (!flags.dev) {
			const command = createWorkspaceCommand('backend', 'start');
			return execa.command(command, { stdio: 'inherit' });
		}

		const commands: CommandObj[] = [
			{
				name: ' backend ',
				prefixColor: 'green',
				command: createWorkspaceCommand('backend', 'start:dev'),
			},
		];

		if (!flags.clear) {
			commands[0].command += ' --noClear';
		}

		if (flags.update) {
			commands.push({
				name: ' prisma ',
				prefixColor: 'cyan',
				command: 'yarn cli backend:update --dev',
			});
		}

		if (commands.length === 1) {
			execa.command(commands[0].command, { stdio: 'inherit' });
		} else {
			concurrently(commands);
		}
	}
}
