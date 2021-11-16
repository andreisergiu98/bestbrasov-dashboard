import config from '@lib/config';
import { Resolver } from '@typings/apollo';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';

export async function createSchema(resolvers: Resolver[], pubSub?: RedisPubSub) {
	return buildSchema({
		pubSub,
		validate: true,
		resolvers: resolvers as BuildSchemaOptions['resolvers'],
		emitSchemaFile: config.schema.emit && config.schema.path,
	});
}
