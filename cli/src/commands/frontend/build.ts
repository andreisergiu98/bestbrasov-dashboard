import { Command, flags } from '@oclif/command';
import Listr from 'listr';
import execa from 'execa';
import { cliName } from '../../config';
import { createWorkspaceArgs } from '../../lib/shell';

export default class FrontendBuild extends Command {
	static description = 'build the frontend application';

	static examples = [`$ ${cliName} frontend:build`];

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
			{
				title: 'Generate graphql types',
				task: async () => {
					const args = createWorkspaceArgs('frontend', 'generate');
					return execa('yarn', args, { env: { FORCE_COLOR: 'true' } }).catch((e) => {
						throw new Error(e.message);
					});
				},
			},
			{
				title: 'Build frontend application',
				task: async () => {
					const args = createWorkspaceArgs('frontend', 'build');
					return execa('yarn', args, { env: { FORCE_COLOR: 'true' } }).catch((e) => {
						throw new Error(e.message);
					});
				},
			},
		]);

		tasks.run().catch((err) => {
			console.log(err.message);
		});
	}
}
