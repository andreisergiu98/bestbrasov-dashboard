import { Command, flags } from '@oclif/command';
import execa from 'execa';
import { cliName } from '../../config';
import { createWorkspaceArgs } from '../../lib/shell';

export default class DbSync extends Command {
	static description = 'sync database with the current version of the schema';

	static examples = [`$ ${cliName} db:sync`];

	static flags = {
		help: flags.help({ char: 'h' }),
		force: flags.boolean({ char: 'f' }),
	};

	static args = [];

	async run() {
		const { flags } = this.parse(DbSync);
		const args = createWorkspaceArgs(
			'backend',
			`run prisma db push ${flags.force ? ' --accept-data-loss' : ''}`
		);
		return execa('yarn', args, { stdio: 'inherit' });
	}
}
