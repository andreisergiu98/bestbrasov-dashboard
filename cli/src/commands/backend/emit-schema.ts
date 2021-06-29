import { Command, flags } from '@oclif/command';
import Listr from 'listr';
import execa from 'execa';
import { cliName } from '../../config';
import { createWorkspaceArgs } from '../../lib/shell';

export default class BackendEmitSchema extends Command {
	static description = 'emits the graphql schema';

	static examples = [`$ ${cliName} backend:emit:schema`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [];

	async run() {
		const tasks = new Listr([
			{
				title: 'Generate graphql schema',
				task: async () => {
					const args = createWorkspaceArgs('backend', 'emit-schema');
					return execa('yarn', args, { env: { FORCE_COLOR: 'true' } }).catch((e) => {
						throw new Error(e.message);
					});
				},
			},
		]);

		tasks.run().catch((err) => {
			console.error(err.message);
		});
	}
}
