import { Command, flags } from '@oclif/command';
import execa from 'execa';
import { cliName } from '../../config';
import { createWorkspaceArgs } from '../../lib/shell';

export default class DbStudio extends Command {
	static description = 'launch Prisma Studio';

	static examples = [`$ ${cliName} db:studio`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [];

	async run() {
		const args = createWorkspaceArgs('backend', 'run prisma studio');
		return execa('yarn', args, { stdio: 'inherit' });
	}
}
