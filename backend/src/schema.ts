import path from 'path';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';
import { UserCrudResolver } from '@lib/resolvers';

export default async (options?: Omit<BuildSchemaOptions, 'resolvers'>) =>
	buildSchema({
		resolvers: [UserCrudResolver],
		emitSchemaFile: path.resolve(__dirname, '../api.generated.graphql'),
		validate: true,
		...options,
	});
