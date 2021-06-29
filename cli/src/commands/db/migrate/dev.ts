import { Command, flags } from '@oclif/command';
import execa from 'execa';
import { cliName } from '../../../config';
import { createWorkspaceArgs } from '../../../lib/shell';

export default class DbMigrateDev extends Command {
	static description =
		'create a migration from changes in Prisma schema, apply it to the database, trigger generators (e.g. Prisma Client)';

	static examples = [`$ ${cliName} db:migrate:status`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [];

	async run() {
		const args = createWorkspaceArgs('backend', 'run prisma migrate dev');
		return execa('yarn', args, { stdio: 'inherit' });
	}
}
