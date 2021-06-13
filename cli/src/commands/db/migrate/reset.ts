import { Command, flags } from '@oclif/command';
import { cliName } from '../../../config';
import { createWorkspaceCommand, shSpawn } from '../../../lib/shell';

export default class DbMigrateReset extends Command {
	static description = 'reset your database and apply all migrations';

	static examples = [`$ ${cliName} db:migrate:reset`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [];

	async run() {
		const command = createWorkspaceCommand('backend', 'run prisma migrate reset');
		shSpawn(command);
	}
}
