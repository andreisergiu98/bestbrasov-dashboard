import { Command, flags } from '@oclif/command';
import { cliName } from '../../config';
import { createWorkspaceCommand, shSpawn } from '../../lib/shell';

export default class DbStudio extends Command {
	static description = 'launch Prisma Studio';

	static examples = [`$ ${cliName} db:studio`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [];

	async run() {
		const command = createWorkspaceCommand('backend', 'run prisma studio');
		shSpawn(command);
	}
}
