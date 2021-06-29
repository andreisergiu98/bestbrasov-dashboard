import { Command, flags } from '@oclif/command';
import execa from 'execa';
import { cliName } from '../../../config';
import { createWorkspaceArgs } from '../../../lib/shell';

export default class DbMigrateStatus extends Command {
	static description =
		'check the status of migrations in the production/staging database';

	static examples = [`$ ${cliName} db:migrate:status`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [];

	async run() {
		const args = createWorkspaceArgs('backend', 'run prisma migrate status');
		return execa('yarn', args, { stdio: 'inherit' });
	}
}
