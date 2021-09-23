import config from '@lib/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';
import { UserCrudResolver } from './resolvers';
import { MeResolver } from './users';

export const schema: BuildSchemaOptions = {
	resolvers: [UserCrudResolver, MeResolver],
	validate: true,
	emitSchemaFile: config.schema.path,
};

export async function createSchema(pubSub?: RedisPubSub) {
	return buildSchema({
		...schema,
		pubSub,
	});
}
