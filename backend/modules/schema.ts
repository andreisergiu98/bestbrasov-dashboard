import config from '@lib/config';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';

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
