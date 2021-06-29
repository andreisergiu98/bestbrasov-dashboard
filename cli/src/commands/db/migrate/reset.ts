import { Command, flags } from '@oclif/command';
import execa from 'execa';
import { cliName } from '../../../config';
import { createWorkspaceArgs } from '../../../lib/shell';

export default class DbMigrateReset extends Command {
	static description = 'reset your database and apply all migrations';

	static examples = [`$ ${cliName} db:migrate:reset`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [];

	async run() {
		const args = createWorkspaceArgs('backend', 'run prisma migrate reset');
		return execa('yarn', args, { stdio: 'inherit' });
	}
}
