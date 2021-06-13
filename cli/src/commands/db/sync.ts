import { Command, flags } from '@oclif/command';
import { cliName } from '../../config';
import { createWorkspaceCommand, shSpawn } from '../../lib/shell';

export default class DbSync extends Command {
	static description = 'sync database with the current version of the schema';

	static examples = [`$ ${cliName} db:sync`];

	static flags = {
		help: flags.help({ char: 'h' }),
		force: flags.boolean({ char: 'f' }),
	};

	static args = [];

	async run() {
		const { args, flags } = this.parse(DbSync);
		const command = createWorkspaceCommand(
			'backend',
			`run prisma db push ${flags.force ? ' --accept-data-loss' : ''}`
		);
		shSpawn(command);
	}
}
