import { Command, flags } from '@oclif/command';
import { cliName } from '../../../config';
import { createWorkspaceCommand, shSpawn } from '../../../lib/shell';

export default class DbMigrateDev extends Command {
	static description =
		'create a migration from changes in Prisma schema, apply it to the database, trigger generators (e.g. Prisma Client)';

	static examples = [`$ ${cliName} db:migrate:status`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [];

	async run() {
		const command = createWorkspaceCommand('backend', 'run prisma migrate dev');
		shSpawn(command);
	}
}
