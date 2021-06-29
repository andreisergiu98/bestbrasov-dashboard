import { Command, flags } from '@oclif/command';
import Listr from 'listr';
import execa from 'execa';
import { cliName } from '../../config';
import { createWorkspaceArgs } from '../../lib/shell';

export default class BackendBuild extends Command {
	static description = 'builds the backend application';

	static examples = [`$ ${cliName} backend:build`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	static args = [];

	async run() {
		const tasks = new Listr([
			{
				title: 'Generate prisma and apollo resolvers',
				task: async () => {
					const args = createWorkspaceArgs('backend', 'generate');
					return execa('yarn', args, { env: { FORCE_COLOR: 'true' } }).catch((e) => {
						throw new Error(e.stderr);
					});
				},
			},
			{
				title: 'Build backend application',
				task: async () => {
					const args = createWorkspaceArgs('backend', 'build');
					return execa('yarn', args, { env: { FORCE_COLOR: 'true' } }).catch((e) => {
						throw new Error(e.message);
					});
				},
			},
			{
				title: 'Post build task',
				task: async () => {
					const args = createWorkspaceArgs('backend', 'postbuild');
					return execa('yarn', args, { env: { FORCE_COLOR: 'true' } }).catch((e) => {
						throw new Error(e.stderr);
					});
				},
			},
		]);

		tasks.run().catch((err) => {
			console.error(err.message);
		});
	}
}
