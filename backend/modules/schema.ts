import config from '@lib/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';
import { userResolvers } from './user';

const resolvers = [...userResolvers];

export const schema: BuildSchemaOptions = {
	// eslint-disable-next-line @typescript-eslint/ban-types
	resolvers: resolvers as Function[] as BuildSchemaOptions['resolvers'],
	validate: true,
	emitSchemaFile: config.schema.path,
};

export async function createSchema(pubSub?: RedisPubSub) {
	return buildSchema({
		...schema,
		pubSub,
	});
}
