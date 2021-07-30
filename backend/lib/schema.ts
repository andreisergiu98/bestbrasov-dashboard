import config from '@lib/config';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';
import { UserCrudResolver } from '@lib/resolvers';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export const schema: BuildSchemaOptions = {
	resolvers: [UserCrudResolver],
	validate: true,
	emitSchemaFile: config.schema.path,
};

export async function createSchema(pubSub?: RedisPubSub) {
	return buildSchema({
		...schema,
		pubSub,
	});
}
