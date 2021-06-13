import { Command, flags } from '@oclif/command';
import { cliName } from '../../../config';
import { createWorkspaceCommand, shSpawn } from '../../../lib/shell';

export default class DbMigrateStatus extends Command {
	static description =
		'check the status of migrations in the production/staging database';

	static examples = [`$ ${cliName} db:migrate:status`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [];

	async run() {
		const command = createWorkspaceCommand('backend', 'run prisma migrate status');
		shSpawn(command);
	}
}
